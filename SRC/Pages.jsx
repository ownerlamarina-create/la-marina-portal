import { useState } from "react";
import { Card, CardHeader, StatCard, ProgressBar, EmptyState, LiveBadge, Chip, f, statusColor } from "./components.jsx";

const Topbar = ({ title, sub, badge }) => (
  <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", marginBottom: 28, flexWrap: "wrap", gap: 12 }}>
    <div>
      <div style={{ fontFamily: "'Montserrat', sans-serif", fontSize: 26, fontWeight: 800, color: "#fff", letterSpacing: "-0.5px" }}>{title}</div>
      {sub && <div style={{ fontSize: 13, color: "#6E7884", marginTop: 3 }}>{sub}</div>}
    </div>
    {badge}
  </div>
);

const TwoCol = ({ children }) => (
  <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", gap: 18 }}>{children}</div>
);

export function DashboardPage({ data }) {
  const { reservations = [], payouts = [], assets = [], investors = [] } = data;
  const today = new Date().toLocaleDateString("en-US", { weekday: "long", month: "long", day: "numeric", year: "numeric" });
  const totalRevenue = reservations.reduce((s, r) => s + Number(r.fields["TOTAL AMOUNT"] || r.fields["REVENUE"] || r.fields["AMOUNT"] || 0), 0);
  const investorEarnings = payouts.reduce((s, p) => s + Number(p.fields["INVESTOR PAYOUT"] || p.fields["AMOUNT"] || p.fields["INVESTOR SHARE"] || 0), 0);
  const confirmed = reservations.filter(r => ["confirmed","complete","completed"].includes((r.fields["STATUS"] || "").toLowerCase())).length;

  return (
    <div>
      <Topbar title="Investor Dashboard" sub={today} badge={<LiveBadge />} />
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(190px, 1fr))", gap: 14, marginBottom: 24 }}>
        <StatCard icon="💰" label="Season Revenue" value={f(totalRevenue)} sub="Apr – Sep 2026" />
        <StatCard icon="📈" label="Your Earnings (60%)" value={f(investorEarnings || totalRevenue * 0.6)} sub="60/40 split" yellow />
        <StatCard icon="🛥️" label="Fleet Size" value={assets.length || 2} sub="Kawasaki jet skis" />
        <StatCard icon="📅" label="Total Bookings" value={reservations.length} sub={`${confirmed} confirmed`} />
      </div>
      <TwoCol>
        <Card>
          <CardHeader title="Season Progress" badge="Apr – Sep 2026" />
          <ProgressBar label="Revenue Target" current={totalRevenue} max={18000} fmt={f} />
          <ProgressBar label="Booking Target" current={reservations.length} max={120} fmt={v => v} />
          <ProgressBar label="Season Duration" current={1} max={6} fmt={v => `Month ${v} of 6`} />
        </Card>
        <Card>
          <CardHeader title="Recent Reservations" badge={`${confirmed} confirmed`} badgeColor="green" />
          {reservations.length === 0 ? <EmptyState icon="📅" msg="No reservations yet" /> :
            reservations.slice(0, 5).map((r) => {
              const name = r.fields["CUSTOMER NAME"] || r.fields["NAME"] || r.fields["GUEST"] || "Customer";
              const date = r.fields["DATE"] || r.fields["BOOKING DATE"] || "";
              const rev = r.fields["TOTAL AMOUNT"] || r.fields["REVENUE"] || r.fields["AMOUNT"] || 0;
              const status = r.fields["STATUS"] || "Pending";
              return (
                <div key={r.id} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "10px 0", borderBottom: "1px solid rgba(255,255,255,0.04)" }}>
                  <div>
                    <div style={{ fontSize: 13, fontWeight: 600, color: "#fff", fontFamily: "Montserrat" }}>{name}</div>
                    <div style={{ fontSize: 11, color: "#6E7884", marginTop: 2 }}>{date}</div>
                  </div>
                  <div style={{ textAlign: "right", display: "flex", flexDirection: "column", alignItems: "flex-end", gap: 4 }}>
                    <div style={{ fontSize: 13, color: "#EED228", fontWeight: 700 }}>{f(rev)}</div>
                    <Chip label={status} color={statusColor(status)} />
                  </div>
                </div>
              );
            })
          }
        </Card>
      </TwoCol>
      <Card>
        <CardHeader title="Investment Terms" badge="Active Contract" />
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(160px,1fr))", gap: 12 }}>
          {[
            ["Contract Term", "Apr 1 – Sep 30, 2026"],
            ["Revenue Split", "60% Investor / 40% Operator"],
            ["Assets", "2 Kawasaki Jet Skis"],
            ["Operating Lakes", "Lewisville · Grapevine · Ray Roberts"],
            ["Payout Schedule", "Monthly"],
            ["Investors", investors.length > 0 ? investors.map(i => i.fields["INVESTOR NAME"] || "Investor").join(", ") : "Gentlemen of Lagos"],
          ].map(([k, v]) => (
            <div key={k} style={{ background: "rgba(13,30,50,0.6)", border: "1px solid rgba(238,210,40,0.07)", borderRadius: 8, padding: "12px 14px" }}>
              <div style={{ fontSize: 9, color: "#6E7884", letterSpacing: "2px", textTransform: "uppercase", fontFamily: "Montserrat", fontWeight: 600, marginBottom: 5 }}>{k}</div>
              <div style={{ fontSize: 13, color: "#DBDBDB" }}>{v}</div>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}

export function AssetsPage({ data }) {
  const { assets = [], maintenance = [] } = data;
  return (
    <div>
      <Topbar title="Fleet Assets" sub="Kawasaki Jet Ski Fleet · DFW Texas" badge={<LiveBadge label="All Units Online" />} />
      {assets.length === 0 ? <Card><EmptyState icon="🛥️" msg="No assets found" sub="Add assets in your Airtable ASSETS table" /></Card> : (
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", gap: 18, marginBottom: 18 }}>
          {assets.map((a) => {
            const name = a.fields["ASSET NAME"] || a.fields["NAME"] || "Jet Ski";
            const model = a.fields["MODEL"] || a.fields["MAKE/MODEL"] || "Kawasaki";
            const status = a.fields["STATUS"] || "Active";
            const hours = a.fields["ENGINE HOURS"] || a.fields["HOURS"] || "—";
            const location = a.fields["LOCATION"] || a.fields["HOME LAKE"] || "Lake Lewisville";
            const value = a.fields["VALUE"] || a.fields["ASSET VALUE"] || 0;
            const color = a.fields["COLOR"] || "—";
            return (
              <div key={a.id} style={{ background: "linear-gradient(140deg, rgba(255,255,255,0.04), rgba(255,255,255,0.01))", border: "1px solid rgba(238,210,40,0.15)", borderRadius: 14, padding: 22, position: "relative", overflow: "hidden" }}>
                <div style={{ position: "absolute", right: -8, bottom: -8, fontSize: 70, opacity: 0.05 }}>🌊</div>
                <div style={{ fontFamily: "'Montserrat', sans-serif", fontSize: 17, fontWeight: 800, color: "#fff" }}>{name}</div>
                <div style={{ fontSize: 12, color: "#EED228", margin: "4px 0 16px", fontFamily: "'Montserrat', sans-serif", fontWeight: 500 }}>{model}</div>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
                  {[["Status", status],["Engine Hours", hours ? `${hours} hrs` : "—"],["Home Lake", location],["Value", value ? f(value) : "—"],["Color", color]].map(([l, v]) => (
                    <div key={l}>
                      <div style={{ fontSize: 9, color: "#6E7884", letterSpacing: "2px", textTransform: "uppercase", fontFamily: "'Montserrat', sans-serif", fontWeight: 600 }}>{l}</div>
                      <div style={{ fontSize: 13, fontWeight: 500, color: "#fff", marginTop: 2 }}>{v}</div>
                    </div>
                  ))}
                </div>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: 16, paddingTop: 14, borderTop: "1px solid rgba(255,255,255,0.06)" }}>
                  <Chip label={status} color={statusColor(status)} />
                  <span style={{ fontSize: 11, color: "#6E7884" }}>Insured · Inspected</span>
                </div>
              </div>
            );
          })}
        </div>
      )}
      <Card>
        <CardHeader title="Maintenance Log" />
        {maintenance.length === 0 ? <EmptyState icon="🔧" msg="No maintenance records" sub="Records sync from MAINTENANCE LOG table" /> : (
          <div style={{ overflowX: "auto" }}>
            <table style={{ width: "100%", borderCollapse: "collapse" }}>
              <thead><tr>{["Unit","Type","Date","Technician","Status"].map(h => <th key={h} style={{ textAlign: "left", fontSize: 10, color: "#6E7884", letterSpacing: "2px", textTransform: "uppercase", fontFamily: "'Montserrat', sans-serif", fontWeight: 600, padding: "9px 14px", borderBottom: "1px solid rgba(255,255,255,0.06)" }}>{h}</th>)}</tr></thead>
              <tbody>{maintenance.map((m) => {
                const unit = m.fields["ASSET"] || m.fields["UNIT"] || "—";
                const type = m.fields["TYPE"] || m.fields["SERVICE TYPE"] || "Service";
                const date = m.fields["DATE"] || "—";
                const tech = m.fields["TECHNICIAN"] || "—";
                const status = m.fields["STATUS"] || "Complete";
                return (
                  <tr key={m.id}>
                    {[Array.isArray(unit) ? unit.join(", ") : unit, type, date, tech].map((v, i) => (
                      <td key={i} style={{ padding: "13px 14px", fontSize: 13.5, color: i === 0 ? "#fff" : "#9EA5AD", borderBottom: "1px solid rgba(255,255,255,0.04)", fontWeight: i === 0 ? 500 : 400 }}>{v}</td>
                    ))}
                    <td style={{ padding: "13px 14px", borderBottom: "1px solid rgba(255,255,255,0.04)" }}><Chip label={status} color={statusColor(status)} /></td>
                  </tr>
                );
              })}</tbody>
            </table>
          </div>
        )}
      </Card>
    </div>
  );
}

export function ReservationsPage({ data }) {
  const { reservations = [] } = data;
  const [filter, setFilter] = useState("All");
  const allStatuses = ["All", ...new Set(reservations.map(r => r.fields["STATUS"] || "Pending"))];
  const filtered = filter === "All" ? reservations : reservations.filter(r => (r.fields["STATUS"] || "Pending") === filter);
  const totalRev = reservations.reduce((s, r) => s + Number(r.fields["TOTAL AMOUNT"] || r.fields["REVENUE"] || r.fields["AMOUNT"] || 0), 0);
  const confirmed = reservations.filter(r => ["confirmed","complete","completed"].includes((r.fields["STATUS"] || "").toLowerCase())).length;

  return (
    <div>
      <Topbar title="Reservations" sub={`${reservations.length} total bookings`} />
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(190px, 1fr))", gap: 14, marginBottom: 20 }}>
        <StatCard icon="📅" label="Total Bookings" value={reservations.length} />
        <StatCard icon="✅" label="Confirmed" value={confirmed} />
        <StatCard icon="⏳" label="Pending" value={reservations.filter(r => (r.fields["STATUS"] || "pending").toLowerCase() === "pending").length} />
        <StatCard icon="💰" label="Gross Revenue" value={f(totalRev)} yellow />
      </div>
      <Card>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 18, flexWrap: "wrap", gap: 10 }}>
          <div style={{ fontFamily: "'Montserrat', sans-serif", fontSize: 15, fontWeight: 700, color: "#fff" }}>All Reservations</div>
          <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
            {allStatuses.slice(0, 4).map(s => (
              <button key={s} onClick={() => setFilter(s)} style={{ background: filter === s ? "rgba(238,210,40,0.15)" : "transparent", border: `1px solid ${filter === s ? "rgba(238,210,40,0.35)" : "rgba(255,255,255,0.08)"}`, borderRadius: 6, padding: "4px 12px", color: filter === s ? "#EED228" : "#9EA5AD", fontSize: 11, cursor: "pointer", fontFamily: "'Montserrat', sans-serif", fontWeight: 600 }}>{s}</button>
            ))}
          </div>
        </div>
        {filtered.length === 0 ? <EmptyState icon="📅" msg="No reservations found" sub="Bookings sync from RESERVATIONS table" /> : (
          <div style={{ overflowX: "auto" }}>
            <table style={{ width: "100%", borderCollapse: "collapse" }}>
              <thead><tr>{["Customer","Date","Lake","Duration","Revenue","Status"].map(h => <th key={h} style={{ textAlign: "left", fontSize: 10, color: "#6E7884", letterSpacing: "2px", textTransform: "uppercase", fontFamily: "'Montserrat', sans-serif", fontWeight: 600, padding: "9px 14px", borderBottom: "1px solid rgba(255,255,255,0.06)" }}>{h}</th>)}</tr></thead>
              <tbody>{filtered.map((r) => {
                const name = r.fields["CUSTOMER NAME"] || r.fields["NAME"] || r.fields["GUEST"] || "—";
                const date = r.fields["DATE"] || r.fields["BOOKING DATE"] || "—";
                const lake = r.fields["LAKE"] || r.fields["LOCATION"] || r.fields["PICK UP LOCATION"] || "—";
                const duration = r.fields["DURATION"] || r.fields["HOURS"] || "—";
                const rev = r.fields["TOTAL AMOUNT"] || r.fields["REVENUE"] || r.fields["AMOUNT"] || 0;
                const status = r.fields["STATUS"] || "Pending";
                return (
                  <tr key={r.id}>
                    <td style={{ padding: "13px 14px", fontSize: 13.5, color: "#fff", fontWeight: 600, borderBottom: "1px solid rgba(255,255,255,0.04)" }}>{name}</td>
                    <td style={{ padding: "13px 14px", fontSize: 13.5, color: "#9EA5AD", borderBottom: "1px solid rgba(255,255,255,0.04)" }}>{date}</td>
                    <td style={{ padding: "13px 14px", fontSize: 13.5, color: "#9EA5AD", borderBottom: "1px solid rgba(255,255,255,0.04)" }}>{lake}</td>
                    <td style={{ padding: "13px 14px", fontSize: 13.5, color: "#DBDBDB", borderBottom: "1px solid rgba(255,255,255,0.04)" }}>{duration}</td>
                    <td style={{ padding: "13px 14px", fontSize: 13.5, color: "#EED228", fontWeight: 700, borderBottom: "1px solid rgba(255,255,255,0.04)" }}>{f(rev)}</td>
                    <td style={{ padding: "13px 14px", borderBottom: "1px solid rgba(255,255,255,0.04)" }}><Chip label={status} color={statusColor(status)} /></td>
                  </tr>
                );
              })}</tbody>
            </table>
          </div>
        )}
      </Card>
    </div>
  );
}

export function PayoutsPage({ data }) {
  const { payouts = [], reservations = [] } = data;
  const totalGross = reservations.reduce((s, r) => s + Number(r.fields["TOTAL AMOUNT"] || r.fields["REVENUE"] || r.fields["AMOUNT"] || 0), 0);
  const totalInvestor = payouts.reduce((s, p) => s + Number(p.fields["INVESTOR PAYOUT"] || p.fields["AMOUNT"] || p.fields["INVESTOR SHARE"] || 0), 0);

  return (
    <div>
      <Topbar title="Payouts" sub="60% investor share · Monthly disbursement" />
      <Card style={{ marginBottom: 18 }}>
        <CardHeader title="Revenue Split" badge="60 / 40" />
        <div style={{ height: 10, borderRadius: 5, overflow: "hidden", background: "rgba(255,255,255,0.05)", display: "flex", marginBottom: 6 }}>
          <div style={{ width: "60%", background: "linear-gradient(90deg, #EED228, #f5e060)" }} />
          <div style={{ width: "40%", background: "rgba(110,120,132,0.4)" }} />
        </div>
        <div style={{ display: "flex", justifyContent: "space-between", fontSize: 11, fontFamily: "'Montserrat', sans-serif", fontWeight: 600 }}>
          <span style={{ color: "#EED228" }}>60% — Investor (You)</span>
          <span style={{ color: "#9EA5AD" }}>40% — La Marina AI</span>
        </div>
      </Card>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(180px,1fr))", gap: 14, marginBottom: 20 }}>
        {[["Total Gross Revenue", f(totalGross)],["Your Share (60%)", f(totalInvestor || totalGross * 0.6)],["Next Payout", "May 1, 2026"]].map(([label, val]) => (
          <div key={label} style={{ background: "rgba(13,30,50,0.6)", border: "1px solid rgba(238,210,40,0.08)", borderRadius: 10, padding: 16, textAlign: "center" }}>
            <div style={{ fontSize: 10, color: "#6E7884", letterSpacing: "1.5px", textTransform: "uppercase", fontFamily: "'Montserrat', sans-serif", fontWeight: 600 }}>{label}</div>
            <div style={{ fontFamily: "'Montserrat', sans-serif", fontSize: 22, fontWeight: 800, color: "#EED228", marginTop: 6 }}>{val}</div>
          </div>
        ))}
      </div>
      <Card>
        <CardHeader title="Payout History" />
        {payouts.length === 0 ? <EmptyState icon="💸" msg="No payouts yet" sub="Records sync from your PAYOUT table" /> : (
          <div style={{ overflowX: "auto" }}>
            <table style={{ width: "100%", borderCollapse: "collapse" }}>
              <thead><tr>{["Period","Gross Revenue","Investor Share","Payout Date","Status"].map(h => <th key={h} style={{ textAlign: "left", fontSize: 10, color: "#6E7884", letterSpacing: "2px", textTransform: "uppercase", fontFamily: "'Montserrat', sans-serif", fontWeight: 600, padding: "9px 14px", borderBottom: "1px solid rgba(255,255,255,0.06)" }}>{h}</th>)}</tr></thead>
              <tbody>{payouts.map((p) => {
                const period = p.fields["PERIOD"] || p.fields["MONTH"] || p.fields["NAME"] || "—";
                const gross = p.fields["GROSS REVENUE"] || p.fields["TOTAL"] || 0;
                const share = p.fields["INVESTOR PAYOUT"] || p.fields["INVESTOR SHARE"] || p.fields["AMOUNT"] || (gross * 0.6);
                const date = p.fields["PAYOUT DATE"] || p.fields["DATE"] || "—";
                const status = p.fields["STATUS"] || "Scheduled";
                return (
                  <tr key={p.id}>
                    <td style={{ padding: "13px 14px", fontSize: 13.5, color: "#fff", fontWeight: 500, borderBottom: "1px solid rgba(255,255,255,0.04)" }}>{period}</td>
                    <td style={{ padding: "13px 14px", fontSize: 13.5, color: "#DBDBDB", borderBottom: "1px solid rgba(255,255,255,0.04)" }}>{f(gross)}</td>
                    <td style={{ padding: "13px 14px", fontSize: 13.5, color: "#EED228", fontWeight: 700, borderBottom: "1px solid rgba(255,255,255,0.04)" }}>{f(share)}</td>
                    <td style={{ padding: "13px 14px", fontSize: 13.5, color: "#9EA5AD", borderBottom: "1px solid rgba(255,255,255,0.04)" }}>{date}</td>
                    <td style={{ padding: "13px 14px", borderBottom: "1px solid rgba(255,255,255,0.04)" }}><Chip label={status} color={statusColor(status)} /></td>
                  </tr>
                );
              })}</tbody>
            </table>
          </div>
        )}
      </Card>
    </div>
  );
}

export function StatementsPage({ data }) {
  const { statements = [] } = data;
  return (
    <div>
      <Topbar title="Monthly Statements" sub="Financial summaries · Live from Airtable" />
      {statements.length === 0 ? <Card><EmptyState icon="📄" msg="No statements yet" sub="Monthly statements sync from MONTHLY STATEMENT table" /></Card> :
        statements.map((s) => {
          const month = s.fields["MONTH"] || s.fields["PERIOD"] || s.fields["NAME"] || "—";
          const gross = Number(s.fields["GROSS REVENUE"] || s.fields["TOTAL REVENUE"] || s.fields["REVENUE"] || 0);
          const bookings = s.fields["BOOKINGS"] || s.fields["TOTAL BOOKINGS"] || 0;
          const investorEarnings = Number(s.fields["INVESTOR EARNINGS"] || s.fields["INVESTOR SHARE"] || gross * 0.6);
          const operatorShare = Number(s.fields["OPERATOR SHARE"] || gross * 0.4);
          const status = s.fields["STATUS"] || "In Progress";
          return (
            <Card key={s.id}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 20, flexWrap: "wrap", gap: 12 }}>
                <div>
                  <div style={{ fontFamily: "'Montserrat', sans-serif", fontSize: 18, fontWeight: 800, color: "#fff" }}>{month}</div>
                  <div style={{ marginTop: 8 }}><Chip label={status} color={statusColor(status)} /></div>
                </div>
                <div style={{ textAlign: "right" }}>
                  <div style={{ fontSize: 10, color: "#6E7884", letterSpacing: "2px", textTransform: "uppercase", fontFamily: "'Montserrat', sans-serif", fontWeight: 600 }}>Your Earnings</div>
                  <div style={{ fontFamily: "'Montserrat', sans-serif", fontSize: 30, fontWeight: 800, color: "#EED228" }}>{f(investorEarnings)}</div>
                </div>
              </div>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(140px,1fr))", gap: 10 }}>
                {[["Gross Revenue", f(gross), false],["Total Bookings", bookings, false],["Investor Share (60%)", f(investorEarnings), true],["Operator Share (40%)", f(operatorShare), false]].map(([label, val, hi]) => (
                  <div key={label} style={{ background: "rgba(13,30,50,0.6)", border: "1px solid rgba(238,210,40,0.07)", borderRadius: 8, padding: "12px 14px" }}>
                    <div style={{ fontSize: 9, color: "#6E7884", letterSpacing: "2px", textTransform: "uppercase", fontFamily: "'Montserrat', sans-serif", fontWeight: 600, marginBottom: 4 }}>{label}</div>
                    <div style={{ fontFamily: "'Montserrat', sans-serif", fontSize: 18, fontWeight: 800, color: hi ? "#EED228" : "#fff" }}>{val}</div>
                  </div>
                ))}
              </div>
              <div style={{ fontSize: 12, color: "#6E7884", marginTop: 14, paddingTop: 12, borderTop: "1px solid rgba(255,255,255,0.05)" }}>
                📄 Full PDF statement available upon request · lamarinaai@gmail.com
              </div>
            </Card>
          );
        })
      }
    </div>
  );
}
