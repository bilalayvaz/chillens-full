// test/utils.ts
import { createPublicClient, createWalletClient, http } from "viem";
import { privateKeyToAccount } from "viem/accounts";
import { hardhat } from "viem/chains";
import hre from "hardhat";

export async function getWalletClients() {
  const [owner, user] = await hre.viem.getWalletClients();
  return [owner, user];
}

export async function getPublicClient() {
  return await hre.viem.getPublicClient();
}

export async function deployContract(name: string, args: any[] = []) {
  return await hre.viem.deployContract(name, args);
}