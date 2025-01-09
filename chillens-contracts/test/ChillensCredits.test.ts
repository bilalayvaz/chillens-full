import { expect } from "chai";
import { loadFixture } from "@nomicfoundation/hardhat-toolbox/network-helpers";
import { viem } from "hardhat";

describe("ChillensCredits", function () {
  async function deployContractFixture() {
    const [owner, user] = await viem.getWalletClients();

    const chillensCredits = await viem.deployContract("ChillensCredits");
    const socialToken = await viem.deployContract("MockERC20", ["SOCIAL", "SOC"]);
    const bonsaiToken = await viem.deployContract("MockERC20", ["BONSAI", "DEGEN"]);

    return { 
      chillensCredits, 
      socialToken, 
      bonsaiToken, 
      owner, 
      user 
    };
  }

  it("Should deploy successfully", async function () {
    const { chillensCredits } = await loadFixture(deployContractFixture);
    const address = chillensCredits.address;
    expect(address).to.be.a('string').and.to.have.lengthOf(42);
    expect(address).to.match(/^0x[0-9a-fA-F]{40}$/);
  });

  it("Should allow owner to add tokens to allowlist", async function () {
    const { chillensCredits, socialToken, owner } = await loadFixture(deployContractFixture);

    await chillensCredits.write.setAllowedToken([
      socialToken.address,
      true
    ]);

    const isAllowed = await chillensCredits.read.allowedTokens([
      socialToken.address
    ]);

    expect(isAllowed).to.be.true;
  });
  
  describe("Credit Plans", function () {
    it("Should allow owner to add credit plans", async function () {
      const { chillensCredits, socialToken } = await loadFixture(deployContractFixture);

      await chillensCredits.write.setAllowedToken([socialToken.address, true]);
      await chillensCredits.write.addCreditPlan([
        socialToken.address,
        10n * 10n ** 18n, // 10 token (18 decimals)
        50n // 50 kredi
      ]);

      const plans = await chillensCredits.read.getCreditPlans([socialToken.address]);
      expect(plans[0].tokenAmount).to.equal(10n * 10n ** 18n);
      expect(plans[0].credits).to.equal(50n);
    });

    it("Should allow owner to update credit plans", async function () {
      const { chillensCredits, socialToken } = await loadFixture(deployContractFixture);

      await chillensCredits.write.setAllowedToken([socialToken.address, true]);
      await chillensCredits.write.addCreditPlan([
        socialToken.address,
        10n * 10n ** 18n,
        50n
      ]);

      await chillensCredits.write.updateCreditPlan([
        socialToken.address,
        0n,
        20n * 10n ** 18n,
        100n
      ]);

      const plans = await chillensCredits.read.getCreditPlans([socialToken.address]);
      expect(plans[0].tokenAmount).to.equal(20n * 10n ** 18n);
      expect(plans[0].credits).to.equal(100n);
    });

    it("Should allow owner to remove credit plans", async function () {
      const { chillensCredits, socialToken } = await loadFixture(deployContractFixture);

      await chillensCredits.write.setAllowedToken([socialToken.address, true]);
      
      // İki plan ekle
      await chillensCredits.write.addCreditPlan([
        socialToken.address,
        10n * 10n ** 18n,
        50n
      ]);
      await chillensCredits.write.addCreditPlan([
        socialToken.address,
        20n * 10n ** 18n,
        100n
      ]);

      // İlk planı sil
      await chillensCredits.write.removeCreditPlan([socialToken.address, 0n]);

      const plans = await chillensCredits.read.getCreditPlans([socialToken.address]);
      expect(plans.length).to.equal(1);
      expect(plans[0].tokenAmount).to.equal(20n * 10n ** 18n);
      expect(plans[0].credits).to.equal(100n);
    });
  });

});

