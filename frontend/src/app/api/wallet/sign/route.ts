import { NextRequest, NextResponse } from "next/server";
import { privy as getPrivy } from "@/lib/server/privy";

export async function POST(req: NextRequest) {
  const { walletId, hash } = await req.json();
  if (!walletId || !hash) {
    return NextResponse.json({ error: "walletId and hash required" }, { status: 400 });
  }

  try {
    const result = await getPrivy().wallets().rawSign(walletId, { params: { hash } });
    return NextResponse.json({ signature: result.signature });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
