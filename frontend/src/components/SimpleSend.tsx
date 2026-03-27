"use client";

import { useState } from "react";
import { EXPLORER_URL } from "@/lib/constants";

interface SimpleSendProps {
  walletAddress: string;
  step: "idle" | "sending" | "done" | "error";
  error: string | null;
  txHash: string | null;
  onSend: (recipient: string, amount: number) => void;
  onClose: () => void;
}

function CopyButton({ text }: { text: string }) {
  const [copied, setCopied] = useState(false);

  return (
    <button
      onClick={() => {
        navigator.clipboard.writeText(text);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      }}
      style={{
        padding: "6px 12px",
        background: "transparent",
        border: "1px solid var(--border, #333)",
        borderRadius: 4,
        color: copied ? "#00ff41" : "var(--text-primary)",
        cursor: "pointer",
        fontSize: "0.75rem",
        fontFamily: "monospace",
        whiteSpace: "nowrap",
      }}
    >
      {copied ? "Copied!" : "Copy"}
    </button>
  );
}

export default function SimpleSend({
  walletAddress,
  step,
  error,
  txHash,
  onSend,
  onClose,
}: SimpleSendProps) {
  const [recipient, setRecipient] = useState("");
  const [amount, setAmount] = useState("");

  const parsedAmount = parseFloat(amount) || 0;
  const isValid =
    recipient.startsWith("0x") &&
    recipient.length >= 10 &&
    parsedAmount > 0;

  const isBusy = step === "sending";
  const truncatedAddr = walletAddress.slice(0, 10) + "..." + walletAddress.slice(-6);

  return (
    <div
      className="modal-overlay"
      onClick={(e) => {
        if (e.target === e.currentTarget && !isBusy) onClose();
      }}
    >
      <div className="modal-content" style={{ maxWidth: 480 }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
          <h2 style={{ margin: 0, color: "var(--text-primary)", fontSize: "1.2rem" }}>
            Send STRK
          </h2>
          {!isBusy && (
            <button
              onClick={onClose}
              style={{
                background: "none",
                border: "none",
                color: "var(--text-dim)",
                cursor: "pointer",
                fontSize: "1.2rem",
              }}
            >
              x
            </button>
          )}
        </div>

        {/* Wallet address + copy */}
        <div style={{
          background: "rgba(0, 255, 65, 0.06)",
          border: "1px solid rgba(0, 255, 65, 0.2)",
          borderRadius: 6,
          padding: "12px 14px",
          marginBottom: 16,
        }}>
          <div style={{ color: "var(--text-dim)", fontSize: "0.75rem", marginBottom: 6 }}>
            Your Wallet Address
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <span style={{
              color: "var(--text-primary)",
              fontFamily: "monospace",
              fontSize: "0.8rem",
              flex: 1,
              overflow: "hidden",
              textOverflow: "ellipsis",
            }}>
              {truncatedAddr}
            </span>
            <CopyButton text={walletAddress} />
          </div>
        </div>

        {step === "done" ? (
          <div style={{ textAlign: "center" }}>
            <div style={{ color: "#00ff41", fontSize: "1.5rem", marginBottom: 12 }}>
              Sent!
            </div>
            <div style={{ color: "var(--text-secondary)", fontSize: "0.85rem", marginBottom: 16 }}>
              {amount} STRK sent to {recipient.slice(0, 10)}...{recipient.slice(-4)}
            </div>
            {txHash && (
              <a
                href={`${EXPLORER_URL}/tx/${txHash}`}
                target="_blank"
                rel="noopener noreferrer"
                style={{ color: "var(--text-primary)", fontSize: "0.8rem" }}
              >
                View on Voyager
              </a>
            )}
            <div style={{ marginTop: 24 }}>
              <button className="btn btn-secondary" onClick={onClose}>
                Close
              </button>
            </div>
          </div>
        ) : (
          <>
            <div style={{ marginBottom: 16 }}>
              <label style={{ display: "block", color: "var(--text-dim)", fontSize: "0.8rem", marginBottom: 6 }}>
                Recipient Address
              </label>
              <input
                type="text"
                value={recipient}
                onChange={(e) => setRecipient(e.target.value)}
                placeholder="0x..."
                disabled={isBusy}
                style={{
                  width: "100%",
                  padding: "10px 12px",
                  background: "var(--bg-input, #111)",
                  border: "1px solid var(--border, #333)",
                  borderRadius: 6,
                  color: "var(--text-primary)",
                  fontFamily: "monospace",
                  fontSize: "0.85rem",
                  outline: "none",
                  boxSizing: "border-box",
                }}
              />
            </div>

            <div style={{ marginBottom: 20 }}>
              <label style={{ display: "block", color: "var(--text-dim)", fontSize: "0.8rem", marginBottom: 6 }}>
                Amount (STRK)
              </label>
              <input
                type="number"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                min="0"
                step="0.1"
                placeholder="0.0"
                disabled={isBusy}
                style={{
                  width: "100%",
                  padding: "10px 12px",
                  background: "var(--bg-input, #111)",
                  border: "1px solid var(--border, #333)",
                  borderRadius: 6,
                  color: "var(--text-primary)",
                  fontFamily: "monospace",
                  fontSize: "0.85rem",
                  outline: "none",
                  boxSizing: "border-box",
                }}
              />
            </div>

            {error && (
              <div style={{ color: "#ff4141", fontSize: "0.85rem", marginBottom: 16 }}>
                {error}
              </div>
            )}

            {isBusy && (
              <div style={{
                display: "flex",
                alignItems: "center",
                gap: 8,
                color: "var(--text-secondary)",
                fontSize: "0.85rem",
                marginBottom: 16,
              }}>
                <span style={{
                  width: 14,
                  height: 14,
                  border: "2px solid rgba(0,255,65,0.2)",
                  borderTopColor: "#00ff41",
                  borderRadius: "50%",
                  display: "inline-block",
                  animation: "spin 0.8s linear infinite",
                }} />
                Sending...
              </div>
            )}

            <div style={{ display: "flex", gap: 12 }}>
              <button
                className="btn"
                onClick={() => onSend(recipient, parsedAmount)}
                disabled={!isValid || isBusy}
                style={{ flex: 1 }}
              >
                {isBusy ? "Sending..." : "Send STRK"}
              </button>
              {!isBusy && (
                <button className="btn btn-secondary" onClick={onClose}>
                  Cancel
                </button>
              )}
            </div>
          </>
        )}
      </div>
    </div>
  );
}
