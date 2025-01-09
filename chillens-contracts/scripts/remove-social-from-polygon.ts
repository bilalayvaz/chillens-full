import { ethers } from "hardhat";

async function main() {
  const SOCIAL_TOKEN = '0xD3C68968137317a57a9bAbeacC7707Ec433548B4';
  const POLYGON_CONTRACT = '0xB811727Fa0B25351Faf40f1d432928c02B357f6B';
  
  const ChillensCredits = await ethers.getContractAt(
    "ChillensCredits",
    POLYGON_CONTRACT
  );

  console.log("Checking if SOCIAL token is allowed on Polygon...");
  const isAllowed = await ChillensCredits.allowedTokens(SOCIAL_TOKEN);
  console.log("Current status:", isAllowed);

  if (isAllowed) {
    console.log("Removing SOCIAL token from Polygon contract...");
    const tx = await ChillensCredits.setAllowedToken(SOCIAL_TOKEN, false);
    await tx.wait();
    console.log("SOCIAL token removed successfully from Polygon!");

    // Tekrar kontrol et
    const finalCheck = await ChillensCredits.allowedTokens(SOCIAL_TOKEN);
    console.log("Final status:", finalCheck);
  } else {
    console.log("SOCIAL token is already not allowed on Polygon contract.");
  }
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});