import { NextRequest, NextResponse } from "next/server";
import { auth, db } from "@/lib/server/firebase-admin";
import { USERS_COLLECTION } from "@/config/db";
import { addressFromEncMnemonic } from "@/lib/server/wallet";

export async function GET(req: NextRequest) {
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
    if (!snap.exists)
      return NextResponse.json(
        { ok: false, error: "Not found" },
        { status: 404 }
      );

    const u = snap.data()!;
    let address: string | null = null;

    const enc = u.internalWallet?.encMnemonic;
    if (enc?.ciphertext && enc?.iv && enc?.tag) {
      address = await addressFromEncMnemonic(enc);
    }

    return NextResponse.json({
      ok: true,
      data: {
        uid: u.uid,
        externalWallet: u.externalWallet ?? null,
        internalWallet: { address },
        profile: u.profile ?? {},
        points: typeof u.points === "number" ? u.points : 0,
      },
    });
  } catch (e) {
    console.error("[/api/users/me] error:", e);
    return NextResponse.json(
      { ok: false, error: "Internal server error" },
      { status: 500 }
    );
  }
}
