"use client";

import type { WordTx } from "@/hooks/use-typing-contract";
import { VOYAGER_TX } from "@/lib/constants";

interface TransactionLogProps {
  txLog: WordTx[];
  pendingCount: number;
  successCount: number;
}

function truncateHash(hash: string): string {
  if (hash.length <= 14) return hash;
  return `${hash.slice(0, 8)}...${hash.slice(-4)}`;
}

export default function TransactionLog({
  txLog,
  pendingCount,
  successCount,
}: TransactionLogProps) {
  const totalTxs = txLog.length;
  const errorCount = txLog.filter((t) => t.status === "error").length;

  return (
    <div className="game-sidebar">
      <div className="tx-log-title">
        Transaction Feed [{successCount}/{totalTxs}]
      </div>

      <div
        style={{
          fontSize: "0.65rem",
          color: "var(--text-muted)",
          marginBottom: 12,
          display: "flex",
          gap: 12,
        }}
      >
        <span style={{ color: "var(--text-primary)" }}>
          {successCount} confirmed
        </span>
        {pendingCount > 0 && (
          <span style={{ color: "#ffaa00" }}>{pendingCount} pending</span>
        )}
        {errorCount > 0 && (
          <span style={{ color: "var(--text-error)" }}>
            {errorCount} failed
          </span>
        )}
      </div>

      {txLog.length === 0 && (
        <div
          style={{
            color: "var(--text-dim)",
            fontSize: "0.7rem",
            textAlign: "center",
            padding: 20,
          }}
        >
          Complete words to see transactions...
        </div>
      )}

      {txLog.map((tx) => (
        <div key={tx.id} className="tx-entry">
          <span className="tx-num">W{tx.wordNumber}</span>
          <span className={`tx-status ${tx.status}`} />
          {tx.hash ? (
            <a
              href={VOYAGER_TX(tx.hash)}
              target="_blank"
              rel="noopener noreferrer"
              className="tx-hash"
            >
              {truncateHash(tx.hash)}
            </a>
          ) : (
            <span
              style={{
                fontSize: "0.65rem",
                color:
                  tx.status === "error"
                    ? "var(--text-error)"
                    : "#ffaa00",
              }}
            >
              {tx.status === "pending"
                ? "broadcasting..."
                : tx.error || "failed"}
            </span>
          )}
        </div>
      ))}
    </div>
  );
}
