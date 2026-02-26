import { Redis } from "@upstash/redis";

interface UserData {
  privyWallet: { id: string; address: string; publicKey: string };
  accounts: Record<string, { address: string; deployed: boolean }>;
}

let _redis: Redis | null = null;

function getRedis(): Redis {
  if (!_redis) {
    _redis = new Redis({
      url: process.env.KV_REST_API_URL!,
      token: process.env.KV_REST_API_TOKEN!,
    });
  }
  return _redis;
}

function userKey(userId: string): string {
  return `typeracer:user:${userId}`;
}

export async function getUser(userId: string): Promise<UserData | null> {
  return getRedis().get<UserData>(userKey(userId));
}

export async function setUser(userId: string, data: UserData): Promise<void> {
  await getRedis().set(userKey(userId), data);
}
