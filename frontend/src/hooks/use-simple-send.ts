"use client";

import { useState, useCallback, useRef, useEffect } from "react";
import { STRK_TOKEN_ADDRESS, VOYAGER_TX } from "@/lib/constants";

type SendStep = "idle" | "sending" | "done" | "error";

interface UseSimpleSendOpts {
  wallet: any;
  walletAddress: string | null;
}

export function useSimpleSend({ wallet, walletAddress }: UseSimpleSendOpts) {
  const [step, setStep] = useState<SendStep>("idle");
  const [error, setError] = useState<string | null>(null);
  const [txHash, setTxHash] = useState<string | null>(null);
  const walletRef = useRef(wallet);

  useEffect(() => { walletRef.current = wallet; }, [wallet]);

  const send = useCallback(
    async (recipientAddress: string, amountStrk: number) => {
      const w = walletRef.current;
      if (!w || !walletAddress) {
        setError("Wallet not connected");
        setStep("error");
        return;
      }

      setStep("sending");
      setError(null);
      setTxHash(null);

      try {
        // Convert STRK to u256 (18 decimals) — split into low/high
        const amountWei = BigInt(Math.floor(amountStrk * 1e18));
        const low = (amountWei & ((BigInt(1) << BigInt(128)) - BigInt(1))).toString();
        const high = (amountWei >> BigInt(128)).toString();

        const tx = await w.execute([
          {
            contractAddress: STRK_TOKEN_ADDRESS,
            entrypoint: "transfer",
            calldata: [recipientAddress, low, high],
          },
        ], { feeMode: "user_pays" });

        await tx.wait();
        setTxHash(tx.hash);
        setStep("done");
      } catch (err: any) {
        console.error("STRK transfer failed:", err);
        const msg = err?.message || String(err);
        if (msg.includes("paymaster") || msg.includes("sponsor") || msg.includes("resources")) {
          setError("Paymaster can't sponsor transfers. Your wallet needs STRK for gas.");
        } else {
          setError(msg || "Transfer failed");
        }
        setStep("error");
      }
    },
    [walletAddress]
  );

  const reset = useCallback(() => {
    setStep("idle");
    setError(null);
    setTxHash(null);
  }, []);

  return { send, step, error, txHash, reset };
}
