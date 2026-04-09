export function Chip({ label, color = "yellow" }) {
  const colors = {
    yellow: { bg: "rgba(238,210,40,0.12)", text: "#EED228", border: "rgba(238,210,40,0.25)" },
    green: { bg: "rgba(40,167,69,0.12)", text: "#5cb85c", border: "rgba(40,167,69,0.25)" },
    gray: { bg: "rgba(158,165,173,0.12)", text: "#9EA5AD", border: "rgba(158,165,173,0.2)" },
    blue: { bg: "rgba(52,144,220,0.12)", text: "#5ba3e0", border: "rgba(52,144,220,0.25)" },
    red: { bg: "rgba(220,53,69,0.12)", text: "#e06b75", border: "rgba(220,53,69,0.25)" },
  };
  const c = colors[color] || colors.yellow;
  return (
    <span style={{
      display: "inline-block", fontSize: 10,
      fontFamily: "'Montserrat', sans-serif", fontWeight: 600,
      letterSpacing: "0.5px", borderRadius: 12, padding: "3px 10px",
      background: c.bg, color: c.text, border: `1px solid ${c.border}`,
    }}>{label}</span>
  );
}

export function Card({ children, style = {} }) {
  return (
    <div style={{
      background: "rgba(255,255,255,0.03)",
      border: "1px solid rgba(255,255,255,0.07)",
      borderRadius: 14, padding: 22, marginBottom: 18, ...style,
    }}>{children}</div>
  );
}

export function CardHeader({ title, badge, badgeColor = "yellow" }) {
  return (
    <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 18, flexWrap: "wrap", gap: 8 }}>
      <div style={{ fontFamily: "'Montserrat', sans-serif", fontSize: 15, fontWeight: 700, color: "#fff" }}>{title}</div>
      {badge && <Chip label={badge} color={badgeColor} />}
    </div>
  );
}

export function StatCard({ icon, label, value, sub, yellow = false }) {
  return (
    <div style={{
      background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.07)",
      borderRadius: 14, padding: 20, position: "relative", overflow: "hidden",
    }}>
      <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: 2, background: "linear-gradient(90deg, #EED228, transparent)" }} />
      <div style={{ fontSize: 20, marginBottom: 12 }}>{icon}</div>
      <div style={{ fontSize: 10, color: "#6E7884", letterSpacing: "2px", textTransform: "uppercase", fontFamily: "'Montserrat', sans-serif", fontWeight: 600, marginBottom: 6 }}>{label}</div>
      <div style={{ fontFamily: "'Montserrat', sans-serif", fontSize: 26, fontWeight: 800, color: yellow ? "#EED228" : "#fff", lineHeight: 1 }}>{value}</div>
      {sub && <div style={{ fontSize: 12, color: "#6E7884", marginTop: 6 }}>{sub}</div>}
    </div>
  );
}

export function ProgressBar({ label, current, max, fmt = v => v }) {
  const pct = max ? Math.min(Math.round((current / max) * 100), 100) : 0;
  return (
    <div style={{ marginBottom: 14 }}>
      <div style={{ display: "flex", justifyContent: "space-between", fontSize: 12, color: "#9EA5AD", marginBottom: 5 }}>
        <span>{label}</span>
        <span style={{ color: "#EED228" }}>{fmt(current)} / {fmt(max)}</span>
      </div>
      <div style={{ height: 7, background: "rgba(255,255,255,0.06)", borderRadius: 4, overflow: "hidden" }}>
        <div style={{ height: "100%", width: `${pct}%`, background: "linear-gradient(90deg, #EED228, #f5e060)", borderRadius: 4 }} />
      </div>
    </div>
  );
}

export function EmptyState({ icon = "📭", msg = "No records yet", sub = "Data will appear once added in Airtable" }) {
  return (
    <div style={{ textAlign: "center", padding: "48px 20px", color: "#6E7884" }}>
      <div style={{ fontSize: 36, marginBottom: 12 }}>{icon}</div>
      <div style={{ fontFamily: "'Montserrat', sans-serif", fontSize: 14, fontWeight: 600, color: "#9EA5AD" }}>{msg}</div>
      <div style={{ fontSize: 12, marginTop: 4 }}>{sub}</div>
    </div>
  );
}

export function LiveBadge({ label = "Live · Airtable Sync" }) {
  return (
    <div style={{
      display: "flex", alignItems: "center", gap: 7,
      background: "rgba(40,167,69,0.1)", border: "1px solid rgba(40,167,69,0.25)",
      borderRadius: 20, padding: "7px 16px", fontSize: 12, color: "#5cb85c",
      fontFamily: "'Montserrat', sans-serif", fontWeight: 600,
    }}>
      <div style={{ width: 7, height: 7, background: "#5cb85c", borderRadius: "50%", animation: "blink 2s infinite" }} />
      {label}
    </div>
  );
}

export const f = (n) => n ? `$${Number(n).toLocaleString()}` : "$0";

export function statusColor(status = "") {
  const s = status.toLowerCase();
  if (["confirmed","complete","completed","paid","active"].includes(s)) return "green";
  if (["pending","scheduled","in progress"].includes(s)) return "yellow";
  if (["cancelled","failed"].includes(s)) return "red";
  return "gray";
}
