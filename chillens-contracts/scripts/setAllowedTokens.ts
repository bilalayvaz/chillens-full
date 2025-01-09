import { ethers } from "hardhat";

async function main() {
  const SOCIAL_TOKEN = '0xD3C68968137317a57a9bAbeacC7707Ec433548B4';
  const BONSAI_TOKEN = '0x4ed4e862860bed51a9570b96d89af5e1b0efefed';
  
  const ChillensCredits = await ethers.getContractAt(
    "ChillensCredits",
    "0xB811727Fa0B25351Faf40f1d432928c02B357f6B"
  );

  console.log("Setting SOCIAL token...");
  const tx1 = await ChillensCredits.setAllowedToken(SOCIAL_TOKEN, true);
  await tx1.wait();
  console.log("SOCIAL token set successfully!");

  console.log("Setting BONSAI token...");
  const tx2 = await ChillensCredits.setAllowedToken(BONSAI_TOKEN, true);
  await tx2.wait();
  console.log("BONSAI token set successfully!");
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});