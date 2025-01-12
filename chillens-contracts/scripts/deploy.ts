import { ethers,run } from "hardhat";
import { CONTRACTS } from "../../src/app/config/contracts";

async function main() {
  console.log("Deploying Chillens contract...");

  const Chillens = await ethers.getContractFactory("Chillens");
  const chillens = await Chillens.deploy(CONTRACTS.BONSAI.address);

  await chillens.waitForDeployment();

  const contractAddress = await chillens.getAddress();
  console.log(`Chillens deployed to: ${contractAddress}`);

  // Wait for few block confirmations
  console.log("Waiting for block confirmations...");
  await chillens.deploymentTransaction()?.wait(5);

  // Verify the contract
  console.log("Verifying contract...");
  try {
    await run("verify:verify", {
      address: contractAddress,
      constructorArguments: [CONTRACTS.BONSAI.address],
      contract: "contracts/Chillens.sol:Chillens" // Bu satırı ekledik
    });
    console.log("Contract verified successfully");
  } catch (error) {
    console.error("Error verifying contract:", error);
  }
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});