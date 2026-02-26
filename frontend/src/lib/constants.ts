export const NETWORK = process.env.NEXT_PUBLIC_NETWORK || "sepolia";
export const API_URL =
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001";
export const CONTRACT_ADDRESS =
  process.env.NEXT_PUBLIC_CONTRACT_ADDRESS ||
  "0x017ef3adc7dadf087760e0fdbb13eea65c9cde4c8376b9fbaa306b1b64657ea6";

export const RPC_URL =
  NETWORK === "mainnet"
    ? "https://api.cartridge.gg/x/starknet/mainnet"
    : "https://api.cartridge.gg/x/starknet/sepolia";

export const EXPLORER_URL =
  NETWORK === "mainnet"
    ? "https://voyager.online"
    : "https://sepolia.voyager.online";

export const VOYAGER_TX = (hash: string) => `${EXPLORER_URL}/tx/${hash}`;
export const VOYAGER_CONTRACT = (addr: string) =>
  `${EXPLORER_URL}/contract/${addr}`;

export const GAME_CONFIG = {
  MAX_CONCURRENT_TXS: 5,
  TX_TIMEOUT_MS: 20_000,
  COUNTDOWN_SECONDS: 3,
  RACE_DURATION_SECONDS: 30,
  WPM_SAMPLE_INTERVAL_MS: 2_000,
};

export const STORAGE_KEYS = {
  walletId: "typeracer_wallet_id",
  walletAddress: "typeracer_wallet_address",
  publicKey: "typeracer_public_key",
};
