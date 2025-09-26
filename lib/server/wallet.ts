import * as bip39 from "bip39";
import { derivePath } from "ed25519-hd-key";
import { Keypair } from "@solana/web3.js";
import bs58 from "bs58";
import { decryptMnemonic } from "./crypto";

export async function deriveSolanaFromMnemonic(mnemonic: string) {
  const seed = await bip39.mnemonicToSeed(mnemonic);
  const { key } = derivePath(
    `m/44'/501'/0'/0'`,
    Buffer.from(seed).toString("hex")
  );
  const kp = Keypair.fromSeed(Buffer.from(key));
  const address = bs58.encode(kp.publicKey.toBytes());
  return { keypair: kp, address };
}

export async function addressFromEncMnemonic(enc: {
  ciphertext: string;
  iv: string;
  tag: string;
}) {
  const mnemonic = decryptMnemonic(enc);
  const { address } = await deriveSolanaFromMnemonic(mnemonic);
  return address;
}
