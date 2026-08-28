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
    <div className="rounded-3xl border border-border bg-black/60 p-6 flex flex-col h-[320px]">
      <div className="flex items-center gap-2 border-b border-border/60 pb-3 mb-4 shrink-0">
        <Terminal className="h-4.5 w-4.5 text-primary" />
        <h3 className="text-base font-bold tracking-tight">Live Activity Feed</h3>
        <span className="relative flex h-2 w-2 ml-1">
          {status === "live" ? (
            <>
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-accent opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-accent"></span>
            </>
          ) : (
            <span className="relative inline-flex rounded-full h-2 w-2 bg-muted-foreground"></span>
          )}
        </span>
      </div>

      <div className="flex-grow overflow-y-auto space-y-3 pr-2 scrollbar-thin scrollbar-thumb-white/10 font-mono text-xs">
        {status === "won" && (
          <div className="flex items-start gap-2.5 bg-primary/10 text-primary border border-primary/20 p-3 rounded-xl">
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
          <div className="flex flex-col items-center justify-center h-full text-muted-foreground/60 py-12">
            <Info className="h-5 w-5 mb-1.5" />
            <span>No transaction logs recorded in block.</span>
          </div>
        ) : (
          history.map((log, idx) => {
            const isUser = log.team.includes("Your Team") || log.team.includes("Team") === false; // User's custom team

            return (
              <div
                key={idx}
                className={`flex items-center justify-between p-2.5 rounded-lg border transition-colors
                  ${
                    isUser
                      ? "bg-primary/5 border-primary/20 text-primary-foreground font-semibold"
                      : "bg-white/[0.01] border-border/40 text-muted-foreground hover:bg-white/[0.02]"
                  }`}
              >
                <div className="flex items-center gap-2">
                  <span
                    className={`w-1.5 h-1.5 rounded-full ${isUser ? "bg-primary" : "bg-muted-foreground/50"}`}
                  />
                  <span>
                    <span className={isUser ? "text-primary" : "text-foreground font-semibold"}>
                      {log.team}
                    </span>{" "}
                    placed a bid of{" "}
                    <span className="text-foreground font-bold font-mono">{log.bid} CR</span>
                  </span>
                </div>

                <span className="text-[10px] text-muted-foreground/60 font-mono-tabular">
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
