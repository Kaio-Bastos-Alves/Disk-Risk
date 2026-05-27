import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

type FormData = {
  type: string;
  address: string;
  description: string;
  severity: string;
  name: string;
  phone: string;
};

const INITIAL: FormData = {
  type: "",
  address: "",
  description: "",
  severity: "",
  name: "",
  phone: "",
};

export default function Report() {
  const navigate = useNavigate();
  const [form, setForm] = useState<FormData>(INITIAL);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.type || !form.address || !form.description || !form.severity) {
      setError("Preencha todos os campos obrigatórios.");
      return;
    }
    setError(null);
    setSubmitted(true);
  };

  if (submitted) {
    return (
      <div style={styles.page}>
        <div style={styles.successBox}>
          <span style={{ fontSize: 48 }}>✅</span>
          <h2 style={{ margin: "12px 0 8px" }}>Denúncia enviada!</h2>
          <p style={{ color: "#475569", marginBottom: 20 }}>
            Obrigado por ajudar a comunidade. Sua denúncia será analisada em breve.
          </p>
          <button style={styles.btn} onClick={() => navigate("/home")}>
            Voltar ao mapa
          </button>
        </div>
      </div>
    );
  }

  return (
    <div style={styles.page}>
      <div style={styles.card}>
        <button style={styles.backBtn} onClick={() => navigate("/home")}>← Voltar</button>
        <h2 style={styles.title}>🚨 Denunciar Desastre</h2>
        <p style={styles.subtitle}>Relate um risco ou desastre na sua região para alertar outras pessoas.</p>

        <form onSubmit={handleSubmit} style={styles.form}>
          <label style={styles.label}>
            Tipo de desastre *
            <select name="type" value={form.type} onChange={handleChange} style={styles.input}>
              <option value="">Selecione...</option>
              <option value="flood">Enchente</option>
              <option value="landslide">Desabamento / Deslizamento</option>
              <option value="storm">Chuva forte / Tempestade</option>
              <option value="other">Outro</option>
            </select>
          </label>

          <label style={styles.label}>
            Nível de risco *
            <select name="severity" value={form.severity} onChange={handleChange} style={styles.input}>
              <option value="">Selecione...</option>
              <option value="high">Alto — Perigo imediato</option>
              <option value="medium">Médio — Situação preocupante</option>
              <option value="low">Baixo — Monitoramento necessário</option>
            </select>
          </label>

          <label style={styles.label}>
            Endereço / Localização *
            <input
              name="address"
              value={form.address}
              onChange={handleChange}
              style={styles.input}
              placeholder="Ex: Rua das Flores, 123 — Bairro Centro"
            />
          </label>

          <label style={styles.label}>
            Descrição do ocorrido *
            <textarea
              name="description"
              value={form.description}
              onChange={handleChange}
              style={{ ...styles.input, minHeight: 100, resize: "vertical" }}
              placeholder="Descreva o que está acontecendo com o máximo de detalhes..."
            />
          </label>

          <label style={styles.label}>
            Seu nome (opcional)
            <input
              name="name"
              value={form.name}
              onChange={handleChange}
              style={styles.input}
              placeholder="Nome completo"
            />
          </label>

          <label style={styles.label}>
            Telefone para contato (opcional)
            <input
              name="phone"
              value={form.phone}
              onChange={handleChange}
              style={styles.input}
              placeholder="(00) 00000-0000"
            />
          </label>

          {error && <div style={styles.error}>{error}</div>}

          <button type="submit" style={styles.btn}>Enviar denúncia</button>
        </form>
      </div>
    </div>
  );
}

const styles: Record<string, React.CSSProperties> = {
  page: {
    minHeight: "100vh",
    background: "#f1f5f9",
    display: "flex",
    alignItems: "flex-start",
    justifyContent: "center",
    padding: "24px 16px",
    fontFamily: "'Segoe UI', sans-serif",
  },
  card: {
    background: "#fff",
    borderRadius: 12,
    padding: "28px 24px",
    width: "100%",
    maxWidth: 520,
    boxShadow: "0 4px 24px rgba(0,0,0,0.08)",
  },
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
  form: { display: "flex", flexDirection: "column", gap: 14 },
  label: { display: "flex", flexDirection: "column", fontSize: 14, color: "#334155", gap: 6 },
  input: {
    padding: "10px 12px",
    borderRadius: 8,
    border: "1px solid #cbd5e1",
    fontSize: 14,
    outline: "none",
    color: "#1e293b",
    fontFamily: "'Segoe UI', sans-serif",
  },
  error: {
    background: "#fef2f2",
    color: "#dc2626",
    borderRadius: 8,
    padding: "10px 14px",
    fontSize: 13,
  },
  btn: {
    background: "#dc2626",
    color: "#fff",
    border: "none",
    borderRadius: 8,
    padding: "12px",
    fontSize: 15,
    fontWeight: 600,
    cursor: "pointer",
    marginTop: 4,
  },
  successBox: {
    background: "#fff",
    borderRadius: 12,
    padding: 40,
    textAlign: "center",
    boxShadow: "0 4px 24px rgba(0,0,0,0.08)",
    maxWidth: 400,
    width: "100%",
  },
};
