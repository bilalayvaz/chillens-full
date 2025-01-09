// scripts/deploy.ts
import { ethers } from "hardhat";

async function main() {
  const [deployer] = await ethers.getSigners();

  console.log("Deploying contracts with the account:", deployer.address);
  console.log("Account balance:", (await deployer.provider.getBalance(deployer.address)).toString());

  const ChillensCredits = await ethers.getContractFactory("ChillensCredits");
  const chillensCredits = await ChillensCredits.deploy();

  await chillensCredits.waitForDeployment();

  const address = await chillensCredits.getAddress();
  console.log("ChillensCredits deployed to:", address);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });