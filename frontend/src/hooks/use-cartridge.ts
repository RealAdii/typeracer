"use client";

import { useState, useCallback, useRef } from "react";
import { CONTRACT_ADDRESS, RPC_URL, NETWORK, API_URL } from "@/lib/constants";

type CartridgeStep = "idle" | "connecting" | "connected" | "error";

export function useCartridge() {
  const [step, setStep] = useState<CartridgeStep>("idle");
  const [error, setError] = useState<string | null>(null);
  const walletRef = useRef<any>(null);

  const connect = useCallback(async () => {
    setStep("connecting");
    setError(null);

    try {
      const { CartridgeWallet } = await import("starkzap/cartridge");

      const wallet = await CartridgeWallet.create({
        rpcUrl: RPC_URL,
        chainId: NETWORK === "mainnet" ? "mainnet" : "sepolia",
        policies: [
          { target: CONTRACT_ADDRESS, method: "start_race" },
          { target: CONTRACT_ADDRESS, method: "record_keystroke" },
          { target: CONTRACT_ADDRESS, method: "finish_race" },
        ],
        feeMode: "user_pays",
      } as any);

      walletRef.current = wallet;
      setStep("connected");
      return wallet;
    } catch (err: any) {
      console.error("Cartridge connect failed:", err);
      setError(err?.message || "Failed to connect with Cartridge");
      setStep("error");
      return null;
    }
  }, []);

  const disconnect = useCallback(async () => {
    if (walletRef.current) {
      try { await walletRef.current.disconnect(); } catch {}
      walletRef.current = null;
    }
    setStep("idle");
    setError(null);
  }, []);

  return { connect, disconnect, step, error };
}
