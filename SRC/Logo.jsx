export function LogoMark({ size = 40, white = false }) {
  return (
    <svg width={size} height={size} viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect width="100" height="100" rx="14" fill={white ? "rgba(255,255,255,0.1)" : "#0D1E32"} />
      <path d="M12 52 Q22 38 34 52 Q46 66 58 52 Q70 38 82 52 Q87 58 90 55"
        stroke="#EED228" strokeWidth="5" strokeLinecap="round" fill="none" />
      <path d="M12 65 Q22 51 34 65 Q46 79 58 65 Q70 51 82 65 Q87 71 90 68"
        stroke="#ffffff" strokeWidth="4" strokeLinecap="round" fill="none" />
      <path d="M12 78 Q22 64 34 78 Q46 92 58 78 Q70 64 82 78 Q87 84 90 81"
        stroke="rgba(255,255,255,0.5)" strokeWidth="3" strokeLinecap="round" fill="none" />
    </svg>
  );
}

export function LogoFull({ white = false, size = "md" }) {
  const nameSize = size === "lg" ? 22 : 17;
  const subSize = size === "lg" ? 10 : 9;
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
      <LogoMark size={size === "lg" ? 52 : 42} white={white} />
      <div>
        <div style={{
          fontFamily: "'Montserrat', sans-serif",
          fontWeight: 800,
          fontSize: nameSize,
          color: white ? "#fff" : "#0D1E32",
          letterSpacing: "0.3px",
          lineHeight: 1.15,
        }}>La Marina</div>
        <div style={{
          fontFamily: "'Montserrat', sans-serif",
          fontWeight: 600,
          fontSize: subSize,
          color: white ? "rgba(255,255,255,0.55)" : "#6E7884",
          letterSpacing: "2.5px",
          textTransform: "uppercase",
          marginTop: 1,
        }}>By Cruize Watersport</div>
      </div>
    </div>
  );
}
