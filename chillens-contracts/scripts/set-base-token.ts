import { ethers } from "hardhat";

async function main() {
  const SOCIAL_TOKEN = '0xD3C68968137317a57a9bAbeacC7707Ec433548B4';
  
  // Base'deki kontrat adresi
  const BASE_CONTRACT = "0xB811727Fa0B25351Faf40f1d432928c02B357f6B";
  
  const ChillensCredits = await ethers.getContractAt(
    "ChillensCredits",
    BASE_CONTRACT
  );

  console.log("Setting SOCIAL token on Base...");
  const tx = await ChillensCredits.setAllowedToken(SOCIAL_TOKEN, true);
  await tx.wait();
  console.log("SOCIAL token set successfully on Base!");

  // Kontrol et
  const isAllowed = await ChillensCredits.allowedTokens(SOCIAL_TOKEN);
  console.log("Is SOCIAL token allowed?", isAllowed);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});