// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/Pausable.sol";
import "@openzeppelin/contracts/utils/ReentrancyGuard.sol";
import "@openzeppelin/contracts/governance/TimelockController.sol";

contract Chillens is Ownable, Pausable, ReentrancyGuard {
    using SafeERC20 for IERC20;

    IERC20 public immutable BONSAI;
    uint256 public constant TIMELOCK_DELAY = 1 hours;
    uint256 public constant EMERGENCY_TIMELOCK_DELAY = 60;
    uint256 public constant BASE_GAS_PREMIUM = 150; // 150% premium over base fee

    mapping(bytes32 => bool) public usedPaymentIds;
    mapping(address => bool) public blacklisted;

    uint256 public maxWithdrawAmount;
    uint256 public maxPaymentAmount;
    uint256 public minPaymentAmount;
    uint256 public maxGasPriceMultiplier;

    TimelockController public timelock;

    event PaymentReceived(address indexed user, uint256 amount, bytes32 paymentId, uint256 timestamp);
    event TokensWithdrawn(address indexed owner, uint256 amount, uint256 timestamp);
    event BlacklistUpdated(address indexed user, bool status, uint256 timestamp);
    event LimitsUpdated(uint256 maxWithdrawAmount, uint256 maxPaymentAmount, uint256 minPaymentAmount, uint256 timestamp);
    event MaxGasPriceMultiplierUpdated(uint256 newMultiplier);
    event EmergencyWithdrawal(address token, address to, uint256 amount);
    event ContractPaused(address indexed by);
    event ContractUnpaused(address indexed by);
    event SuspiciousGasPrice(uint256 currentGasPrice, uint256 allowedMaxGasPrice, address user, uint256 timestamp);

    error GasPriceTooHigh(uint256 currentPrice, uint256 maxPrice);
    error InvalidAmount();
    error InvalidAddress();
    error TransferFailed();
    error PaymentIDUsed();
    error Blacklisted();
    error InsufficientBalance();
    error NotAuthorized();
    error InvalidToken();

    constructor(address _bonsaiToken) Ownable(msg.sender) {
        require(_bonsaiToken != address(0), "Zero address not allowed");
        BONSAI = IERC20(_bonsaiToken);

        maxWithdrawAmount = 1_000_000 * 10**18; // 1M tokens
        maxPaymentAmount = 100_000 * 10**18;    // 100K tokens
        minPaymentAmount = 1 * 10**18;          // 1 token
        maxGasPriceMultiplier = 3;              // 3x the base fee as maximum

        // Initialize timelock
        address[] memory proposers = new address[](1);
        address[] memory executors = new address[](1);
        proposers[0] = msg.sender;
        executors[0] = msg.sender;

        timelock = new TimelockController(
            TIMELOCK_DELAY,
            proposers,
            executors,
            msg.sender
        );
    }

    modifier validPaymentId(bytes32 paymentId) {
        if (usedPaymentIds[paymentId]) revert PaymentIDUsed();
        _;
        usedPaymentIds[paymentId] = true;
    }

    modifier checkGasPrice() {
        uint256 maxAllowedGasPrice = block.basefee * maxGasPriceMultiplier;
        if (tx.gasprice > maxAllowedGasPrice) {
            emit SuspiciousGasPrice(tx.gasprice, maxAllowedGasPrice, msg.sender, block.timestamp);
            revert GasPriceTooHigh(tx.gasprice, maxAllowedGasPrice);
        }
        _;
    }

    function createPaymentId(string calldata payment) public view returns (bytes32) {
        return keccak256(abi.encodePacked(
            payment,
            msg.sender,
            block.timestamp,
            block.number,
            block.prevrandao
        ));
    }

    function makePayment(
        uint256 amount,
        bytes32 paymentId
    ) external whenNotPaused nonReentrant validPaymentId(paymentId) {
        if (amount == 0) revert InvalidAmount();
        if (blacklisted[msg.sender]) revert Blacklisted();
        if (amount < minPaymentAmount || amount > maxPaymentAmount) revert InvalidAmount();

        bool success = IERC20(BONSAI).transferFrom(msg.sender, address(this), amount);
        if (!success) revert TransferFailed();

        emit PaymentReceived(msg.sender, amount, paymentId, block.timestamp);
    }

    function withdrawTokens(
        uint256 amount
    ) external onlyOwner nonReentrant checkGasPrice {
        if (amount == 0) revert InvalidAmount();
        if (amount > maxWithdrawAmount) revert InvalidAmount();

        uint256 contractBalance = IERC20(BONSAI).balanceOf(address(this));
        if (amount > contractBalance) revert InsufficientBalance();

        bool success = IERC20(BONSAI).transfer(msg.sender, amount);
        if (!success) revert TransferFailed();

        emit TokensWithdrawn(msg.sender, amount, block.timestamp);
    }

    function setBlacklist(address user, bool status) external onlyOwner {
        if (user == address(0)) revert InvalidAddress();
        if (user == owner()) revert NotAuthorized();

        blacklisted[user] = status;
        emit BlacklistUpdated(user, status, block.timestamp);
    }

    function updateLimits(
        uint256 _maxWithdrawAmount,
        uint256 _maxPaymentAmount,
        uint256 _minPaymentAmount
    ) external onlyOwner {
        if (_minPaymentAmount == 0) revert InvalidAmount();
        if (_maxPaymentAmount < _minPaymentAmount) revert InvalidAmount();
        if (_maxWithdrawAmount == 0) revert InvalidAmount();

        maxWithdrawAmount = _maxWithdrawAmount;
        maxPaymentAmount = _maxPaymentAmount;
        minPaymentAmount = _minPaymentAmount;

        emit LimitsUpdated(maxWithdrawAmount, maxPaymentAmount, minPaymentAmount, block.timestamp);
    }

    function updateMaxGasPriceMultiplier(uint256 newMultiplier) external onlyOwner {
        if (newMultiplier < 1) revert InvalidAmount();
        maxGasPriceMultiplier = newMultiplier;
        emit MaxGasPriceMultiplierUpdated(newMultiplier);
    }

    function pauseContract() external onlyOwner {
        _pause();
        emit ContractPaused(msg.sender);
    }

    function unpauseContract() external onlyOwner {
        _unpause();
        emit ContractUnpaused(msg.sender);
    }

    function emergencyWithdraw(
        address token,
        address to,
        uint256 amount
    ) external onlyOwner {
        if (token == address(0) || to == address(0)) revert InvalidAddress();
        if (token == address(BONSAI)) revert InvalidToken();
        if (amount == 0) revert InvalidAmount();

        uint256 balance = IERC20(token).balanceOf(address(this));
        if (amount > balance) revert InsufficientBalance();

        bool success = IERC20(token).transfer(to, amount);
        if (!success) revert TransferFailed();

        emit EmergencyWithdrawal(token, to, amount);
    }

    // View Functions
    function isPaymentIdUsed(bytes32 paymentId) external view returns (bool) {
        return usedPaymentIds[paymentId];
    }

    function getContractBalance() external view returns (uint256) {
        return IERC20(BONSAI).balanceOf(address(this));
    }

    function getCurrentMaxGasPrice() external view returns (uint256) {
        return block.basefee * maxGasPriceMultiplier;
    }
}