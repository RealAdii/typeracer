import { NextRequest, NextResponse } from "next/server";
import { privy as getPrivy, verifyToken } from "@/lib/server/privy";
import { getUser, setUser } from "@/lib/server/storage";

export async function POST(req: NextRequest) {
  const userId = await verifyToken(req.headers.get("authorization"));
  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const existing = await getUser(userId);
  if (existing) {
    return NextResponse.json({
      wallet: existing.privyWallet,
      accounts: existing.accounts,
      isNew: false,
    });
  }

  try {
    const wallet = await getPrivy().wallets().create({ chain_type: "starknet" });
    const privyWallet = {
      id: wallet.id,
      address: wallet.address,
      publicKey: wallet.public_key as string,
    };
    await setUser(userId, { privyWallet, accounts: {} });
    return NextResponse.json({ wallet: privyWallet, accounts: {}, isNew: true });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
