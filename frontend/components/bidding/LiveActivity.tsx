import { Terminal, ShieldAlert, CheckCircle, Info } from "lucide-react";

export interface HistoryEntry {
  id: number;
  team: string;
  bid: number;
  time: string;
  isYou: boolean;
}

interface Props {
  history: HistoryEntry[];
  status: "live" | "won" | "lost";
}

export default function LiveActivity({ history, status }: Props) {
  return (
    <div className="rounded-3xl border border-white/10 bg-black/60 p-6 flex flex-col h-[320px] text-white">
      <div className="flex items-center gap-2 border-b border-white/10 pb-3 mb-4 shrink-0">
        <Terminal className="h-4.5 w-4.5 text-[#E8C07D]" />
        <h3 className="text-base font-bold tracking-tight">Live Activity Feed</h3>
        <span className="relative flex h-2 w-2 ml-1">
          {status === "live" ? (
            <>
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-400"></span>
            </>
          ) : (
            <span className="relative inline-flex rounded-full h-2 w-2 bg-slate-500"></span>
          )}
        </span>
      </div>

      <div className="flex-grow overflow-y-auto space-y-3 pr-2 scrollbar-thin scrollbar-thumb-white/10 font-mono text-xs">
        {status === "won" && (
          <div className="flex items-start gap-2.5 bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 p-3 rounded-xl">
            <CheckCircle className="h-4 w-4 shrink-0 mt-0.5" />
            <div>
              <p className="font-bold">SYSTEM ALERT: AUCTION FINALIZED</p>
              <p className="mt-0.5">Asset successfully purchased by Your Team.</p>
            </div>
          </div>
        )}

        {status === "lost" && (
          <div className="flex items-start gap-2.5 bg-red-500/10 text-red-400 border border-red-500/20 p-3 rounded-xl">
            <ShieldAlert className="h-4 w-4 shrink-0 mt-0.5" />
            <div>
              <p className="font-bold">SYSTEM ALERT: AUCTION TERMINATED</p>
              <p className="mt-0.5">Asset won by rival bidder. Bidding console locked.</p>
            </div>
          </div>
        )}

        {history.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-slate-500 py-12">
            <Info className="h-5 w-5 mb-1.5" />
            <span>No transaction logs recorded in block.</span>
          </div>
        ) : (
          [...history].reverse().map((log, idx) => {
            const isUser = log.isYou;

            return (
              <div
                key={log.id}
                className={`flex items-center justify-between p-2.5 rounded-lg border transition-colors
                  ${
                    isUser
                      ? "bg-[#E8C07D]/10 border-[#E8C07D]/20 text-[#E8C07D] font-semibold"
                      : "bg-white/[0.01] border-white/5 text-slate-400 hover:bg-white/[0.02]"
                  }`}
              >
                <div className="flex items-center gap-2">
                  <span
                    className={`w-1.5 h-1.5 rounded-full ${isUser ? "bg-[#E8C07D]" : "bg-slate-500"}`}
                  />
                  <span>
                    <span className={isUser ? "text-[#E8C07D]" : "text-slate-200 font-semibold"}>
                      {log.team}
                    </span>{" "}
                    placed a bid of{" "}
                    <span className="text-white font-bold font-mono">{log.bid} CR</span>
                  </span>
                </div>

                <span className="text-[10px] text-slate-500 font-mono-tabular">
                  [{log.time}]
                </span>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}

