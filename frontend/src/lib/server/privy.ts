import { PrivyClient } from "@privy-io/node";

let _privy: PrivyClient | null = null;

function getPrivy(): PrivyClient {
  if (!_privy) {
    _privy = new PrivyClient({
      appId: process.env.PRIVY_APP_ID!,
      appSecret: process.env.PRIVY_APP_SECRET!,
    });
  }
  return _privy;
}

export { getPrivy as privy };

export async function verifyToken(authHeader: string | null): Promise<string | null> {
  const token = authHeader?.replace("Bearer ", "");
  if (!token) return null;

  try {
    const claims = await getPrivy().utils().auth().verifyAccessToken(token);
    return claims.user_id;
  } catch {
    return null;
  }
}
