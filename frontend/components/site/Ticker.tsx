const ITEMS = [
  { label: "MARKET", value: "OPEN", tone: "primary" as const, dot: true },

  { label: "QUALIFIED", value: "TOP 60%", tone: "accent" as const },

  { label: "BASE CREDITS", value: "1000 credits", tone: "foreground" as const },

  { label: "AI ASSISTANT", value: "350 credits", tone: "accent" as const },

  { label: "CLOUD SERVERS", value: "150 credits", tone: "foreground" as const },

  { label: "INVESTOR ACCESS", value: "250 credits", tone: "primary" as const },

  { label: "MARKETPLACE", value: "LIVE", tone: "accent" as const },

  { label: "DISRUPTION", value: "STANDBY", tone: "destructive" as const },

  { label: "SHARK TANK", value: "TOP 5", tone: "primary" as const },

  { label: "BUILD • BID • PITCH", tone: "foreground" as const },
];

const toneClass: Record<string, string> = {
  primary: "text-primary",
  accent: "text-accent",
  destructive: "text-destructive",
  foreground: "text-foreground",
};

export function Ticker() {
  const row = (
    <div className="flex items-center gap-12 px-6">
      {ITEMS.map((it, i) =>
        it.dot ? (
          <span
            key={i}
            className="flex items-center gap-2 font-mono-tabular text-[10px] uppercase tracking-widest text-primary"
          >
            <span className="animate-pulse-dot size-1.5 rounded-full bg-primary" />
            {it.label}
          </span>
        ) : (
          <span
            key={i}
            className="font-mono-tabular text-[10px] uppercase tracking-widest text-muted-foreground"
          >
            {it.label}: <span className={toneClass[it.tone]}>{it.value}</span>
          </span>
        ),
      )}
    </div>
  );
  return (
    <div className="overflow-hidden border-b border-primary/20 bg-primary/10 py-2">
      <div className="animate-ticker flex whitespace-nowrap">
        {row}
        {row}
      </div>
    </div>
  );
}
