//SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/Pausable.sol";
import "@openzeppelin/contracts/utils/ReentrancyGuard.sol";

contract ChillensCredits is Ownable, Pausable, ReentrancyGuard {
    address public constant BONSAI = 0x3d2bD0e15829AA5C362a4144FdF4A1112fa29B5c;
    
    uint256 public constant MAX_WITHDRAW_AMOUNT = 1000000 * 10**18; // 1M token limit
    uint256 public constant MAX_PAYMENT_AMOUNT = 100000 * 10**18;   // 100K token limit
    uint256 public constant MIN_PAYMENT_AMOUNT = 1 * 10**18;        // 1 token minimum

    mapping(string => bool) public usedPaymentIds;
    mapping(address => bool) public blacklisted;

    event PaymentReceived(
        address indexed user, 
        uint256 amount,
        string paymentId,
        uint256 timestamp
    );
    event TokensWithdrawn(
        address indexed owner,
        uint256 amount,
        uint256 timestamp
    );

    constructor() Ownable(msg.sender) {}

    modifier validPaymentId(string calldata paymentId) {
        require(!usedPaymentIds[paymentId], "Payment ID already used");
        _;
        usedPaymentIds[paymentId] = true;
    }

    function makePayment(
        uint256 amount, 
        string calldata paymentId
    ) external whenNotPaused nonReentrant validPaymentId(paymentId) {
        require(!blacklisted[msg.sender], "Address is blacklisted");
        require(amount >= MIN_PAYMENT_AMOUNT, "Amount too low");
        require(amount <= MAX_PAYMENT_AMOUNT, "Amount too high");
        
        bool success = IERC20(BONSAI).transferFrom(msg.sender, address(this), amount);
        require(success, "Transfer failed");
        
        emit PaymentReceived(msg.sender, amount, paymentId, block.timestamp);
    }

    function withdrawTokens(uint256 amount) external onlyOwner nonReentrant {
    uint256 contractBalance = IERC20(BONSAI).balanceOf(address(this)); 
    require(amount <= MAX_WITHDRAW_AMOUNT, "Amount exceeds withdraw limit");
    require(amount <= contractBalance, "Insufficient balance");

    bool success = IERC20(BONSAI).transfer(msg.sender, amount);
    require(success, "Transfer failed");

    emit TokensWithdrawn(msg.sender, amount, block.timestamp);
}


    function getTokenBalance() external view returns (uint256) {
        return IERC20(BONSAI).balanceOf(address(this));
    }

    function setBlacklist(address user, bool status) external onlyOwner {
        blacklisted[user] = status;
    }

    function pause() external onlyOwner {
        _pause();
    }

    function unpause() external onlyOwner {
        _unpause();
    }

    // Emergency withdraw function with timelock
    uint256 public constant EMERGENCY_WITHDRAW_DELAY = 24 hours;
    uint256 public emergencyWithdrawRequestTime;

    function requestEmergencyWithdraw() external onlyOwner {
        emergencyWithdrawRequestTime = block.timestamp;
    }

    function executeEmergencyWithdraw() external onlyOwner nonReentrant {
        require(emergencyWithdrawRequestTime > 0, "No withdraw requested");
        require(block.timestamp >= emergencyWithdrawRequestTime + EMERGENCY_WITHDRAW_DELAY, "Timelock not expired");
        
        uint256 balance = IERC20(BONSAI).balanceOf(address(this));
        bool success = IERC20(BONSAI).transfer(msg.sender, balance);
        require(success, "Transfer failed");
        
        emergencyWithdrawRequestTime = 0;
    }
}