import React from "react";
import { useNavigate } from "react-router-dom";

const LEGENDS = [
  {
    color: "#2563eb",
    emoji: "🌊",
    type: "Enchente",
    risks: [
      "Afogamento e arrastamento por correnteza",
      "Contaminação da água potável",
      "Danos estruturais em edificações",
      "Interrupção de energia elétrica",
    ],
    tips: "Desligue a energia elétrica, não atravesse ruas alagadas e busque locais elevados.",
  },
  {
    color: "#b45309",
    emoji: "⛰️",
    type: "Desabamento / Deslizamento",
    risks: [
      "Soterramento de pessoas e veículos",
      "Bloqueio de vias e rotas de fuga",
      "Danos a redes de gás e esgoto",
      "Risco de novas quedas em cadeia",
    ],
    tips: "Afaste-se imediatamente da área. Não retorne ao local sem autorização da Defesa Civil.",
  },
  {
    color: "#7c3aed",
    emoji: "⛈️",
    type: "Chuva Forte / Tempestade",
    risks: [
      "Raios e descargas elétricas",
      "Ventos fortes com queda de árvores",
      "Granizo com danos a veículos e telhados",
      "Visibilidade reduzida no trânsito",
    ],
    tips: "Fique em local fechado, longe de janelas. Evite usar aparelhos elétricos e não se abrigue sob árvores.",
  },
];

const SEVERITY = [
  { color: "#dc2626", label: "Alto", desc: "Perigo imediato. Evacue a área e acione emergências." },
  { color: "#d97706", label: "Médio", desc: "Situação preocupante. Fique em alerta e monitore." },
  { color: "#16a34a", label: "Baixo", desc: "Risco controlado. Monitoramento preventivo." },
];

const EMERGENCY = [
  { label: "Bombeiros", number: "193" },
  { label: "SAMU", number: "192" },
  { label: "Defesa Civil", number: "199" },
  { label: "Polícia Militar", number: "190" },
];

export default function Legend() {
  const navigate = useNavigate();

  return (
    <div style={styles.page}>
      <div style={styles.container}>
        <button style={styles.backBtn} onClick={() => navigate("/home")}>← Voltar ao mapa</button>
        <h2 style={styles.title}>📍 Legenda dos Pins</h2>
        <p style={styles.subtitle}>Entenda o significado de cada marcador no mapa e como agir em cada situação.</p>

        {LEGENDS.map((item) => (
          <div key={item.type} style={{ ...styles.card, borderTop: `4px solid ${item.color}` }}>
            <div style={styles.cardHeader}>
              <span style={styles.emoji}>{item.emoji}</span>
              <span style={{ ...styles.typeLabel, color: item.color }}>{item.type}</span>
            </div>
            <div style={styles.section}>
              <strong style={styles.sectionTitle}>⚠️ Riscos</strong>
              <ul style={styles.list}>
                {item.risks.map((r) => <li key={r} style={styles.listItem}>{r}</li>)}
              </ul>
            </div>
            <div style={styles.tipBox}>
              <strong>💡 O que fazer:</strong> {item.tips}
            </div>
          </div>
        ))}

        <h3 style={styles.sectionHeader}>Níveis de Severidade</h3>
        <div style={styles.severityGrid}>
          {SEVERITY.map((s) => (
            <div key={s.label} style={styles.severityCard}>
              <span style={{ ...styles.severityDot, background: s.color }} />
              <div>
                <strong style={{ color: s.color }}>{s.label}</strong>
                <p style={styles.severityDesc}>{s.desc}</p>
              </div>
            </div>
          ))}
        </div>

        <h3 style={styles.sectionHeader}>📞 Números de Emergência</h3>
        <div style={styles.emergencyGrid}>
          {EMERGENCY.map((e) => (
            <a key={e.label} href={`tel:${e.number}`} style={styles.emergencyCard}>
              <span style={styles.emergencyNumber}>{e.number}</span>
              <span style={styles.emergencyLabel}>{e.label}</span>
            </a>
          ))}
        </div>
      </div>
    </div>
  );
}

const styles: Record<string, React.CSSProperties> = {
  page: {
    minHeight: "100vh",
    background: "#f1f5f9",
    padding: "24px 16px",
    fontFamily: "'Segoe UI', sans-serif",
  },
  container: { maxWidth: 600, margin: "0 auto" },
  backBtn: {
    background: "none",
    border: "none",
    color: "#2563eb",
    cursor: "pointer",
    fontSize: 14,
    padding: 0,
    marginBottom: 16,
  },
  title: { margin: "0 0 6px", fontSize: 22, color: "#1e293b" },
  subtitle: { margin: "0 0 20px", color: "#64748b", fontSize: 14 },
  card: {
    background: "#fff",
    borderRadius: 10,
    padding: "16px 18px",
    marginBottom: 16,
    boxShadow: "0 2px 8px rgba(0,0,0,0.06)",
  },
  cardHeader: { display: "flex", alignItems: "center", gap: 10, marginBottom: 12 },
  emoji: { fontSize: 28 },
  typeLabel: { fontSize: 18, fontWeight: 700 },
  section: { marginBottom: 10 },
  sectionTitle: { fontSize: 13, color: "#475569" },
  list: { margin: "6px 0 0 0", paddingLeft: 18 },
  listItem: { fontSize: 13, color: "#334155", marginBottom: 4 },
  tipBox: {
    background: "#f0fdf4",
    borderRadius: 8,
    padding: "10px 12px",
    fontSize: 13,
    color: "#166534",
    lineHeight: 1.5,
  },
  sectionHeader: { fontSize: 16, color: "#1e293b", margin: "24px 0 12px" },
  severityGrid: { display: "flex", flexDirection: "column", gap: 10 },
  severityCard: {
    display: "flex",
    alignItems: "flex-start",
    gap: 12,
    background: "#fff",
    borderRadius: 8,
    padding: "12px 14px",
    boxShadow: "0 1px 4px rgba(0,0,0,0.06)",
  },
  severityDot: {
    width: 14,
    height: 14,
    borderRadius: "50%",
    marginTop: 3,
    flexShrink: 0,
  },
  severityDesc: { margin: "2px 0 0", fontSize: 13, color: "#475569" },
  emergencyGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(2, 1fr)",
    gap: 10,
    marginBottom: 32,
  },
  emergencyCard: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    background: "#1e293b",
    borderRadius: 10,
    padding: "14px 10px",
    textDecoration: "none",
    gap: 4,
  },
  emergencyNumber: { fontSize: 22, fontWeight: 700, color: "#fff" },
  emergencyLabel: { fontSize: 12, color: "#94a3b8" },
};
