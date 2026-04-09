import { useState, useEffect } from "react";
import { LogoFull } from "./Logo.jsx";
import { fetchAllTables } from "./airtable.js";
import { DashboardPage, AssetsPage, ReservationsPage, PayoutsPage, StatementsPage } from "./pages.jsx";

const NAV = [
  { id: "dashboard", label: "Dashboard", icon: "📊" },
  { id: "assets", label: "Fleet Assets", icon: "🛥️" },
  { id: "reservations", label: "Reservations", icon: "📅" },
  { id: "payouts", label: "Payouts", icon: "💰" },
  { id: "statements", label: "Statements", icon: "📄" },
];

function LoginPage({ onLogin, investors }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    if (!email || !password) { setError("Please enter your credentials."); return; }
    setLoading(true);
    setError("");
    await new Promise(r => setTimeout(r, 400));
    const match = investors.find(i => (i.fields["EMAIL"] || "").toLowerCase() === email.toLowerCase());
    const isDemo = email === "investor@lamarina.ai" && password === "lamarina2026";
    const isAdmin = email === "admin@lamarina.ai" && password === "lamarina2026";
    if (match || isDemo || isAdmin) {
      onLogin(match
        ? { name: match.fields["INVESTOR NAME"] || "Investor", email: match.fields["EMAIL"], tier: "Verified Investor" }
        : { name: isAdmin ? "Admin" : "Demo Investor", email, tier: "Portal Access" });
    } else {
      setError("Invalid credentials. Contact lamarinaai@gmail.com for access.");
    }
    setLoading(false);
  };

  return (
    <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", background: "linear-gradient(160deg, #0D1E32 0%, #152840 60%, #0D1E32 100%)", padding: 20 }}>
      <div style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(238,210,40,0.2)", borderRadius: 20, padding: "48px 40px", width: "100%", maxWidth: 420, boxShadow: "0 40px 80px rgba(0,0,0,0.4)" }}>
        <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 14, marginBottom: 32 }}>
          <LogoFull white size="lg" />
          <span style={{ fontSize: 10, fontFamily: "'Montserrat', sans-serif", fontWeight: 700, letterSpacing: "3px", textTransform: "uppercase", color: "#EED228", background: "rgba(238,210,40,0.1)", border: "1px solid rgba(238,210,40,0.2)", padding: "4px 14px", borderRadius: 20 }}>Investor Portal</span>
        </div>
        <div style={{ fontFamily: "'Montserrat', sans-serif", fontSize: 22, fontWeight: 700, color: "#fff", textAlign: "center", marginBottom: 6 }}>Welcome Back</div>
        <div style={{ fontSize: 14, color: "#9EA5AD", textAlign: "center", marginBottom: 28 }}>Sign in to access your dashboard</div>
        {error && <div style={{ background: "rgba(220,53,69,0.12)", border: "1px solid rgba(220,53,69,0.3)", borderRadius: 8, padding: "11px 14px", fontSize: 13, color: "#e06b75", textAlign: "center", marginBottom: 18 }}>{error}</div>}
        {[
          { label: "Email Address", type: "email", val: email, set: setEmail, placeholder: "you@example.com" },
          { label: "Password", type: "password", val: password, set: setPassword, placeholder: "••••••••" },
        ].map(({ label, type, val, set, placeholder }) => (
          <div key={label} style={{ marginBottom: 18 }}>
            <label style={{ display: "block", font​​​​​​​​​​​​​​​​
