"use client";

import { useState, useCallback } from "react";
import { RpcProvider } from "starknet";
import { CONTRACT_ADDRESS, RPC_URL } from "@/lib/constants";

export interface LeaderboardEntry {
  address: string;
  wpm: number;
  races: number;
}

const provider = new RpcProvider({ nodeUrl: RPC_URL });

async function callView(fn: string, calldata: string[] = []): Promise<string[]> {
  return provider.callContract(
    { contractAddress: CONTRACT_ADDRESS, entrypoint: fn, calldata },
    "latest"
  );
}

export function useLeaderboard() {
  const [entries, setEntries] = useState<LeaderboardEntry[]>([]);
  const [loading, setLoading] = useState(false);
  const [totalRaces, setTotalRaces] = useState(0);
  const [totalKeystrokes, setTotalKeystrokes] = useState(0);

  const refresh = useCallback(async () => {
    setLoading(true);
    try {
      const racesResult = await callView("get_total_races");
      const keystrokesResult = await callView("get_total_keystrokes");

      const raceCount = Number(BigInt(racesResult[0]));
      const keystrokeCount = Number(BigInt(keystrokesResult[0]));

      setTotalRaces(raceCount);
      setTotalKeystrokes(keystrokeCount);

      const userBests = new Map<string, { wpm: number; races: number }>();

      for (let i = 0; i < Math.min(raceCount, 100); i++) {
        try {
          // get_race returns: [racer, challenge_id, keystroke_count, start_time, end_time, wpm, accuracy, finished]
          const race = await callView("get_race", ["0x" + i.toString(16)]);

          const finished = Number(BigInt(race[7])) === 1;
          if (!finished) continue;

          const address = race[0];
          const wpm = Number(BigInt(race[5]));

          const existing = userBests.get(address);
          if (existing) {
            existing.races++;
            if (wpm > existing.wpm) existing.wpm = wpm;
          } else {
            userBests.set(address, { wpm, races: 1 });
          }
        } catch (err) {
          console.error(`Failed to read race ${i}:`, err);
        }
      }

      const sorted = Array.from(userBests.entries())
        .map(([address, data]) => ({
          address,
          wpm: data.wpm,
          races: data.races,
        }))
        .sort((a, b) => b.wpm - a.wpm);

      setEntries(sorted);
    } catch (err) {
      console.error("Leaderboard fetch failed:", err);
    } finally {
      setLoading(false);
    }
  }, []);

  return { entries, loading, refresh, totalRaces, totalKeystrokes };
}
