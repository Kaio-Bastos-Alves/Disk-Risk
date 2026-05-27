import React, { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";

declare global {
  interface Window {
    google: any;
    initMap: () => void;
  }
}

type RiskPin = {
  id: number;
  lat: number;
  lng: number;
  type: "flood" | "landslide" | "storm";
  title: string;
  description: string;
  severity: "high" | "medium" | "low";
};

const MOCK_PINS: RiskPin[] = [
  {
    id: 1,
    lat: -23.5505,
    lng: -46.6333,
    type: "flood",
    title: "Enchente — Av. Paulista",
    description: "Nível da água subindo rapidamente. Evite a região e busque abrigo em local elevado.",
    severity: "high",
  },
  {
    id: 2,
    lat: -23.5605,
    lng: -46.6533,
    type: "landslide",
    title: "Desabamento — Vila Madalena",
    description: "Risco de deslizamento de encosta após chuvas intensas nas últimas 24h.",
    severity: "high",
  },
  {
    id: 3,
    lat: -23.5405,
    lng: -46.6133,
    type: "storm",
    title: "Chuva Forte — Centro",
    description: "Tempestade com raios e ventos de até 80 km/h prevista para as próximas horas.",
    severity: "medium",
  },
];

const PIN_COLORS: Record<RiskPin["type"], string> = {
  flood: "#2563eb",
  landslide: "#b45309",
  storm: "#7c3aed",
};

const SEVERITY_COLORS: Record<RiskPin["severity"], string> = {
  high: "#dc2626",
  medium: "#d97706",
  low: "#16a34a",
};

const TYPE_LABELS: Record<RiskPin["type"], string> = {
  flood: "Enchente",
  landslide: "Desabamento",
  storm: "Tempestade",
};

const GOOGLE_MAPS_API_KEY = "YOUR_GOOGLE_MAPS_API_KEY";

export default function Home() {
  const navigate = useNavigate();
  const mapRef = useRef<HTMLDivElement>(null);
  const [selectedPin, setSelectedPin] = useState<RiskPin | null>(null);
  const [userLocation, setUserLocation] = useState<{ lat: number; lng: number } | null>(null);
  const [search, setSearch] = useState("");
  const [menuOpen, setMenuOpen] = useState(false);
  const mapInstanceRef = useRef<any>(null);

  useEffect(() => {
    navigator.geolocation?.getCurrentPosition(
      (pos) => setUserLocation({ lat: pos.coords.latitude, lng: pos.coords.longitude }),
      () => setUserLocation({ lat: -23.5505, lng: -46.6333 })
    );
  }, []);

  useEffect(() => {
    if (!userLocation) return;

    const loadMap = () => {
      if (!mapRef.current || !window.google) return;

      const map = new window.google.maps.Map(mapRef.current, {
        center: userLocation,
        zoom: 13,
        mapTypeControl: false,
        streetViewControl: false,
        fullscreenControl: false,
      });

      mapInstanceRef.current = map;

      // Marcador do usuário
      new window.google.maps.Marker({
        position: userLocation,
        map,
        title: "Você está aqui",
        icon: {
          path: window.google.maps.SymbolPath.CIRCLE,
          scale: 10,
          fillColor: "#2563eb",
          fillOpacity: 1,
          strokeColor: "#fff",
          strokeWeight: 2,
        },
      });

      // Pins de risco
      MOCK_PINS.forEach((pin) => {
        const marker = new window.google.maps.Marker({
          position: { lat: pin.lat, lng: pin.lng },
          map,
          title: pin.title,
          icon: {
            path: window.google.maps.SymbolPath.BACKWARD_CLOSED_ARROW,
            scale: 8,
            fillColor: PIN_COLORS[pin.type],
            fillOpacity: 1,
            strokeColor: "#fff",
            strokeWeight: 1,
          },
        });

        marker.addListener("click", () => setSelectedPin(pin));
      });
    };

    if (window.google) {
      loadMap();
    } else {
      window.initMap = loadMap;
      if (!document.getElementById("google-maps-script")) {
        const script = document.createElement("script");
        script.id = "google-maps-script";
        script.src = `https://maps.googleapis.com/maps/api/js?key=${GOOGLE_MAPS_API_KEY}&callback=initMap`;
        script.async = true;
        script.defer = true;
        document.head.appendChild(script);
      }
    }
  }, [userLocation]);

  const filteredPins = MOCK_PINS.filter(
    (p) =>
      search === "" ||
      p.title.toLowerCase().includes(search.toLowerCase()) ||
      p.description.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div style={styles.page}>
      {/* HEADER */}
      <header style={styles.header}>
        <div style={styles.headerLeft}>
          <span style={styles.logo}>🛡️ DiskRisk</span>
        </div>

        <div style={styles.searchWrapper}>
          <span style={styles.searchIcon}>🔍</span>
          <input
            style={styles.searchInput}
            placeholder="Buscar área de risco..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        <div style={styles.headerRight}>
          <button style={styles.profileBtn} onClick={() => setMenuOpen(!menuOpen)} aria-label="Perfil">
            👤
          </button>
          {menuOpen && (
            <div style={styles.dropdown}>
              <button style={styles.dropdownItem} onClick={() => navigate("/")}>Sair</button>
            </div>
          )}
        </div>
      </header>

      {/* CONTEÚDO PRINCIPAL */}
      <main style={styles.main}>
        {/* MAPA */}
        <div style={styles.mapContainer}>
          <div ref={mapRef} style={styles.map} />
          {!window.google && (
            <div style={styles.mapPlaceholder}>
              <p style={{ color: "#64748b", textAlign: "center" }}>
                🗺️ Mapa carregando...<br />
                <small>Adicione sua chave da API do Google Maps em <code>Home.tsx</code></small>
              </p>
            </div>
          )}
        </div>

        {/* PAINEL INFERIOR */}
        <div style={styles.bottomPanel}>
          {/* LISTA DE PINS */}
          <div style={styles.pinList}>
            {filteredPins.length === 0 && (
              <p style={{ color: "#94a3b8", padding: "12px" }}>Nenhuma área encontrada.</p>
            )}
            {filteredPins.map((pin) => (
              <div
                key={pin.id}
                style={{
                  ...styles.pinCard,
                  borderLeft: `4px solid ${PIN_COLORS[pin.type]}`,
                  background: selectedPin?.id === pin.id ? "#f0f9ff" : "#fff",
                }}
                onClick={() => {
                  setSelectedPin(pin);
                  if (mapInstanceRef.current) {
                    mapInstanceRef.current.panTo({ lat: pin.lat, lng: pin.lng });
                  }
                }}
              >
                <div style={styles.pinCardHeader}>
                  <span style={styles.pinType}>{TYPE_LABELS[pin.type]}</span>
                  <span
                    style={{
                      ...styles.severityBadge,
                      background: SEVERITY_COLORS[pin.severity],
                    }}
                  >
                    {pin.severity === "high" ? "Alto" : pin.severity === "medium" ? "Médio" : "Baixo"}
                  </span>
                </div>
                <strong style={styles.pinTitle}>{pin.title}</strong>
                <p style={styles.pinDesc}>{pin.description}</p>
              </div>
            ))}
          </div>

          {/* ÍCONES LATERAIS */}
          <div style={styles.sideIcons}>
            <button
              style={styles.iconBtn}
              title="Previsão do Tempo"
              onClick={() => navigate("/weather")}
            >
              <span style={styles.iconEmoji}>🌡️</span>
              <span style={styles.iconLabel}>Tempo</span>
            </button>

            <button
              style={styles.iconBtn}
              title="Legenda dos Pins"
              onClick={() => navigate("/legend")}
            >
              <span style={styles.iconEmoji}>📍</span>
              <span style={styles.iconLabel}>Legenda</span>
            </button>

            <button
              style={styles.iconBtn}
              title="Denunciar Desastre"
              onClick={() => navigate("/report")}
            >
              <span style={styles.iconEmoji}>🚨</span>
              <span style={styles.iconLabel}>Denunciar</span>
            </button>
          </div>
        </div>
      </main>
    </div>
  );
}

const styles: Record<string, React.CSSProperties> = {
  page: {
    minHeight: "100vh",
    display: "flex",
    flexDirection: "column",
    background: "#f1f5f9",
    fontFamily: "'Segoe UI', sans-serif",
  },
  header: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    padding: "12px 20px",
    background: "#1e293b",
    color: "#fff",
    gap: 12,
    flexWrap: "wrap",
    position: "sticky",
    top: 0,
    zIndex: 100,
  },
  headerLeft: { display: "flex", alignItems: "center" },
  logo: { fontSize: 20, fontWeight: 700, letterSpacing: 0.5 },
  searchWrapper: {
    display: "flex",
    alignItems: "center",
    background: "#334155",
    borderRadius: 8,
    padding: "6px 12px",
    flex: 1,
    maxWidth: 400,
    minWidth: 180,
    gap: 8,
  },
  searchIcon: { fontSize: 14 },
  searchInput: {
    background: "transparent",
    border: "none",
    outline: "none",
    color: "#fff",
    fontSize: 14,
    width: "100%",
  },
  headerRight: { position: "relative" },
  profileBtn: {
    background: "#334155",
    border: "none",
    borderRadius: "50%",
    width: 38,
    height: 38,
    fontSize: 18,
    cursor: "pointer",
    color: "#fff",
  },
  dropdown: {
    position: "absolute",
    right: 0,
    top: 44,
    background: "#fff",
    borderRadius: 8,
    boxShadow: "0 4px 20px rgba(0,0,0,0.15)",
    overflow: "hidden",
    minWidth: 120,
    zIndex: 200,
  },
  dropdownItem: {
    display: "block",
    width: "100%",
    padding: "10px 16px",
    background: "none",
    border: "none",
    textAlign: "left",
    cursor: "pointer",
    fontSize: 14,
    color: "#1e293b",
  },
  main: {
    flex: 1,
    display: "flex",
    flexDirection: "column",
  },
  mapContainer: {
    position: "relative",
    width: "100%",
    height: "55vh",
    minHeight: 280,
    background: "#cbd5e1",
  },
  map: { width: "100%", height: "100%" },
  mapPlaceholder: {
    position: "absolute",
    inset: 0,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    background: "#e2e8f0",
  },
  bottomPanel: {
    display: "flex",
    flexDirection: "row",
    gap: 0,
    flex: 1,
    minHeight: 0,
  },
  pinList: {
    flex: 1,
    overflowY: "auto",
    padding: "12px 16px",
    display: "flex",
    flexDirection: "column",
    gap: 10,
    maxHeight: "38vh",
  },
  pinCard: {
    background: "#fff",
    borderRadius: 8,
    padding: "12px 14px",
    cursor: "pointer",
    boxShadow: "0 1px 4px rgba(0,0,0,0.07)",
    transition: "background 0.2s",
  },
  pinCardHeader: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 4,
  },
  pinType: { fontSize: 11, color: "#64748b", textTransform: "uppercase", letterSpacing: 0.5 },
  severityBadge: {
    fontSize: 11,
    color: "#fff",
    borderRadius: 4,
    padding: "2px 8px",
    fontWeight: 600,
  },
  pinTitle: { fontSize: 14, color: "#1e293b", display: "block", marginBottom: 4 },
  pinDesc: { fontSize: 13, color: "#475569", margin: 0, lineHeight: 1.5 },
  sideIcons: {
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    gap: 8,
    padding: "12px 10px",
    background: "#1e293b",
    alignItems: "center",
  },
  iconBtn: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    background: "#334155",
    border: "none",
    borderRadius: 10,
    padding: "10px 14px",
    cursor: "pointer",
    color: "#fff",
    gap: 4,
    transition: "background 0.2s",
    minWidth: 64,
  },
  iconEmoji: { fontSize: 22 },
  iconLabel: { fontSize: 11, color: "#94a3b8" },
};
