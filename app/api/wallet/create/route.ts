import { NextRequest, NextResponse } from "next/server";
import { auth, db } from "@/lib/server/firebase-admin";
import { USERS_COLLECTION } from "@/config/db";
import * as bip39 from "bip39";
import { encryptMnemonic, digestAddress } from "@/lib/server/crypto";
import {
  addressFromEncMnemonic,
  deriveSolanaFromMnemonic,
} from "@/lib/server/wallet";
import { InternalWallet } from "@/types/wallet";
import { Connection, PublicKey, LAMPORTS_PER_SOL } from "@solana/web3.js";

export async function POST(req: NextRequest) {
  try {
    const firebaseAuth = auth();
    const firebaseDb = db();

    const idToken = req.headers.get("authorization")?.replace("Bearer ", "");
    if (!idToken)
      return NextResponse.json(
        { ok: false, error: "Unauthorized" },
        { status: 401 }
      );
    const decoded = await firebaseAuth.verifyIdToken(idToken).catch(() => null);
    if (!decoded)
      return NextResponse.json(
        { ok: false, error: "Unauthorized" },
        { status: 401 }
      );

    const uid = decoded.uid;
    const userRef = firebaseDb.collection(USERS_COLLECTION).doc(uid);
    const snap = await userRef.get();
    const user = snap.exists ? snap.data() ?? {} : {};

    if (user.internalWallet?.encMnemonic?.ciphertext) {
      const enc = user.internalWallet.encMnemonic;
      const address = await addressFromEncMnemonic(enc);
      return NextResponse.json({ ok: true, address });
    }

    const mnemonic = bip39.generateMnemonic(256);
    const { address } = await deriveSolanaFromMnemonic(mnemonic);

    const enc = encryptMnemonic(mnemonic);
    const addressDigest = digestAddress(address);

    // Airdrop 0.2 SOL to new wallet for transaction fees
    let airdropResult = null;
    try {
      console.log(`🚀 Airdropping 0.2 SOL to new wallet: ${address}`);

      const connection = new Connection(
        "https://api.devnet.solana.com",
        "confirmed"
      );

      const publicKey = new PublicKey(address);
      const signature = await connection.requestAirdrop(
        publicKey,
        0.2 * LAMPORTS_PER_SOL
      );

      // Wait for confirmation
      const confirmation = await connection.confirmTransaction(signature);

      if (confirmation.value.err) {
        console.warn(`⚠️ SOL airdrop failed: ${confirmation.value.err}`);
      } else {
        const balance = await connection.getBalance(publicKey);
        const solBalance = balance / LAMPORTS_PER_SOL;
        airdropResult = {
          success: true,
          signature,
          balance: solBalance,
        };
        console.log(`✅ SOL airdrop successful: ${solBalance} SOL`);
      }
    } catch (airdropError) {
      console.warn("⚠️ SOL airdrop failed:", airdropError);
      // Don't fail wallet creation if airdrop fails
    }

    const now = new Date();
    await userRef.set(
      {
        uid,
        updatedAt: now,
        ...(snap.exists ? {} : { createdAt: now }),
        internalWallet: {
          encMnemonic: enc,
          addressDigest,
          createdAt: now,
          version: 1,
          oUSDC: 0,
          oVND: 0,
          solAirdrop: airdropResult, // Store airdrop result for debugging
        } as InternalWallet,
      },
      { merge: true }
    );

    return NextResponse.json({
      ok: true,
      address,
      solAirdrop: airdropResult,
      message: airdropResult?.success
        ? "Wallet created successfully with 0.2 SOL airdrop"
        : "Wallet created successfully (SOL airdrop may have failed)",
    });
  } catch (e) {
    console.error("[/api/wallet/create] error:", e);
    return NextResponse.json(
      { ok: false, error: "Internal server error" },
      { status: 500 }
    );
  }
}
