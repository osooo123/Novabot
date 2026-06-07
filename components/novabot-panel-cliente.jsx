import { useState, useEffect } from "react";

const COP = n => `$${new Intl.NumberFormat("es-CO").format(n)}`;
const load = (k, d) => { try { const v = localStorage.getItem(k); return v ? JSON.parse(v) : d; } catch { return d; } };
const save = (k, v) => { try { localStorage.setItem(k, JSON.stringify(v)); } catch {} };

/* ══════════════════════════════════════
   DATOS DEL CLIENTE (simulado)
══════════════════════════════════════ */
const CLIENTES_DEMO = {
  "luisa": {
    id: "luisa", nombre: "Luisa Fernanda Gómez", tienda: "Luisa Fernanda Boutique",
    plan: "pro", precio: 290000, ciudad: "Bogotá", whatsapp: "3001234567",
    color: "#ec4899", emoji: "👗", industria: "Boutique moda femenina",
    fechaInicio: "2025-04-01",
    proximoPago: "2025-07-01",
    stats: {
      mensajesHoy: 47, mensajesSemana: 312, mensajesMes: 1240,
      ventasHoy: 3, ventasSemana: 19, ventasMes: 89,
      ingresosMes: 12450000, ticketPromedio: 189000,
      clientesNuevos: 34, clientesRepetidos: 55,
      horaPico: "8pm - 10pm", diaPico: "Viernes y Sábado",
      tasaRespuesta: 98, tiempoRespuesta: "< 2 seg",
    },
    historico: [
      { mes: "Febrero", mensajes: 680, ventas: 41, ingresos: 6890000 },
      { mes: "Marzo", mensajes: 890, ventas: 58, ingresos: 9240000 },
      { mes: "Abril", mensajes: 1050, ventas: 71, ingresos: 11320000 },
      { mes: "Mayo", mensajes: 1240, ventas: 89, ingresos: 12450000 },
    ],
    productos: [
      { id: 1, n: "Vestido Midi Floral", p: 189000, tallas: "XS S M L", colores: "Rosa, Blanco, Verde menta", activo: true },
      { id: 2, n: "Blazer Oversize Camel", p: 245000, tallas: "S M L XL", colores: "Camel, Negro, Beige", activo: true },
      { id: 3, n: "Set Coord Lino", p: 320000, tallas: "S M L", colores: "Blanco, Azul cielo", activo: true },
      { id: 4, n: "Jeans Mom Tiro Alto", p: 145000, tallas: "26 al 34", colores: "Azul, Negro, Gris", activo: true },
      { id: 5, n: "Blusa Satín Elegante", p: 89000, tallas: "XS S M L", colores: "Champagne, Negro, Rojo", activo: false },
    ],
    promo: "15% OFF primera compra con código NOVA15. Envío GRATIS en pedidos +$200.000",
    tono: "sofisticado y cálido",
    redes: ["WhatsApp", "Instagram"],
    ultimasConversaciones: [
      { hora: "9:47pm", cliente: "Andrea M.", resumen: "Preguntó por tallas del blazer camel. NOVA cerró venta $245.000", resultado: "venta" },
      { hora: "9:12pm", cliente: "Carolina V.", resumen: "Consultó disponibilidad vestido midi rosa talla S", resultado: "consulta" },
      { hora: "8:55pm", cliente: "María F.", resumen: "Preguntó precio envío a Medellín. NOVA informó $12.000", resultado: "consulta" },
      { hora: "8:30pm", cliente: "Daniela R.", resumen: "Pidió conjunto completo talla M. NOVA cerró venta $434.000", resultado: "venta" },
      { hora: "7:45pm", cliente: "Sofía T.", resumen: "Preguntó si tienen talla XS en verde. NOVA confirmó y cerró $189.000", resultado: "venta" },
    ]
  },
  "urban": {
    id: "urban", nombre: "Sebastián Murillo", tienda: "UrbanFlow Store",
    plan: "pro", precio: 290000, ciudad: "Medellín", whatsapp: "3109876543",
    color: "#f97316", emoji: "🔥", industria: "Streetwear urbano",
    fechaInicio: "2025-04-15",
    proximoPago: "2025-07-15",
    stats: {
      mensajesHoy: 38, mensajesSemana: 267, mensajesMes: 890,
      ventasHoy: 2, ventasSemana: 14, ventasMes: 67,
      ingresosMes: 8950000, ticketPromedio: 165000,
      clientesNuevos: 28, clientesRepetidos: 39,
      horaPico: "7pm - 11pm", diaPico: "Sábado y Domingo",
      tasaRespuesta: 97, tiempoRespuesta: "< 2 seg",
    },
    historico: [
      { mes: "Febrero", mensajes: 420, ventas: 28, ingresos: 4200000 },
      { mes: "Marzo", mensajes: 610, ventas: 42, ingresos: 6300000 },
      { mes: "Abril", mensajes: 780, ventas: 55, ingresos: 7900000 },
      { mes: "Mayo", mensajes: 890, ventas: 67, ingresos: 8950000 },
    ],
    productos: [
      { id: 1, n: "Hoodie Premium Oversized", p: 165000, tallas: "S M L XL XXL", colores: "Negro, Gris, Blanco, Verde", activo: true },
      { id: 2, n: "Cargo Pants Urban", p: 185000, tallas: "28 al 36", colores: "Negro, Caqui, Gris", activo: true },
      { id: 3, n: "Camiseta Gráfica Drop", p: 75000, tallas: "S M L XL", colores: "Blanco, Negro, Beige", activo: true },
      { id: 4, n: "Chaqueta Bomber Varsity", p: 295000, tallas: "S M L XL", colores: "Negro/Blanco, Verde/Crema", activo: true },
      { id: 5, n: "Bucket Hat Logo", p: 65000, tallas: "Único", colores: "Negro, Beige, Azul", activo: true },
    ],
    promo: "2x1 en camisetas oversize. Envío gratis en pedidos +$150.000",
    tono: "energético y cool",
    redes: ["WhatsApp", "Instagram", "Facebook"],
    ultimasConversaciones: [
      { hora: "10:23pm", cliente: "Diego A.", resumen: "Preguntó por hoodie negro talla L. NOVA cerró venta $165.000", resultado: "venta" },
      { hora: "9:45pm", cliente: "Camilo R.", resumen: "Quería cargo pants talla 32. NOVA cerró venta $185.000", resultado: "venta" },
      { hora: "9:10pm", cliente: "Juan P.", resumen: "Consultó si llegó el nuevo drop. NOVA informó disponibilidad", resultado: "consulta" },
      { hora: "8:30pm", cliente: "Andrés M.", resumen: "Pidió combo hoodie + cargo. NOVA cerró $350.000", resultado: "venta" },
    ]
  }
};

/* ══════════════════════════════════════
   BARRA DE PROGRESO
══════════════════════════════════════ */
function Barra({ valor, max, color, height = 6 }) {
  return (
    <div style={{ width: "100%", height, background: "#1a1a2a", borderRadius: height }}>
      <div style={{ height: "100%", width: `${Math.min((valor / max) * 100, 100)}%`, background: color, borderRadius: height, transition: "width .6s ease" }} />
    </div>
  );
}

/* ══════════════════════════════════════
   MINI GRÁFICO DE BARRAS
══════════════════════════════════════ */
function MiniChart({ data, color, valueKey, labelKey }) {
  const max = Math.max(...data.map(d => d[valueKey]));
  return (
    <div style={{ display: "flex", alignItems: "flex-end", gap: 8, height: 80 }}>
      {data.map((d, i) => (
        <div key={i} style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", gap: 4 }}>
          <div style={{ fontSize: 10, color: "#555", fontWeight: 700 }}>{d[valueKey]}</div>
          <div style={{ width: "100%", background: i === data.length - 1 ? color : `${color}55`, borderRadius: "4px 4px 0 0", height: `${(d[valueKey] / max) * 56}px`, transition: "height .5s ease" }} />
          <div style={{ fontSize: 9, color: "#444", whiteSpace: "nowrap" }}>{d[labelKey].substring(0, 3)}</div>
        </div>
      ))}
    </div>
  );
}

/* ══════════════════════════════════════
   MODAL EDITAR PRODUCTO
══════════════════════════════════════ */
function ProductoModal({ producto, color, onSave, onClose }) {
  const [f, setF] = useState({ ...producto });
  const set = (k, v) => setF(p => ({ ...p, [k]: v }));
  const inp = { width: "100%", background: "#0a0a12", border: "1px solid #1e1e2e", borderRadius: 10, padding: "10px 14px", color: "#fff", fontSize: 13, outline: "none", fontFamily: "'DM Sans',sans-serif", boxSizing: "border-box" };
  return (
    <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,.92)", zIndex: 999, display: "flex", alignItems: "center", justifyContent: "center", padding: 20, backdropFilter: "blur(10px)" }}>
      <div style={{ width: "100%", maxWidth: 480, background: "#08080f", border: `1px solid ${color}33`, borderRadius: 22, overflow: "hidden" }}>
        <div style={{ padding: "18px 22px", borderBottom: "1px solid #1a1a2a", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <div style={{ fontWeight: 800, fontSize: 15, fontFamily: "'DM Sans',sans-serif" }}>{producto.id ? "Editar producto" : "Nuevo producto"}</div>
          <button onClick={onClose} style={{ background: "#ffffff11", border: "none", color: "#666", borderRadius: 8, width: 32, height: 32, cursor: "pointer", fontSize: 16 }}>✕</button>
        </div>
        <div style={{ padding: "20px 22px", display: "flex", flexDirection: "column", gap: 14 }}>
          <div><div style={{ color: "#555", fontSize: 11, marginBottom: 6 }}>Nombre del producto</div><input style={inp} value={f.n} onChange={e => set("n", e.target.value)} /></div>
          <div><div style={{ color: "#555", fontSize: 11, marginBottom: 6 }}>Precio (COP)</div><input style={inp} type="number" value={f.p} onChange={e => set("p", Number(e.target.value))} /></div>
          <div><div style={{ color: "#555", fontSize: 11, marginBottom: 6 }}>Tallas disponibles</div><input style={inp} value={f.tallas} onChange={e => set("tallas", e.target.value)} placeholder="Ej: XS S M L XL" /></div>
          <div><div style={{ color: "#555", fontSize: 11, marginBottom: 6 }}>Colores disponibles</div><input style={inp} value={f.colores} onChange={e => set("colores", e.target.value)} placeholder="Ej: Negro, Blanco, Rojo" /></div>
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <button onClick={() => set("activo", !f.activo)} style={{ width: 44, height: 24, borderRadius: 12, background: f.activo ? color : "#2a2a3a", border: "none", cursor: "pointer", position: "relative", transition: "background .2s" }}>
              <div style={{ position: "absolute", top: 2, left: f.activo ? "calc(100% - 22px)" : 2, width: 20, height: 20, borderRadius: "50%", background: "#fff", transition: "left .2s" }} />
            </button>
            <span style={{ color: f.activo ? "#22c55e" : "#555", fontSize: 13, fontFamily: "'DM Sans',sans-serif" }}>{f.activo ? "Activo — NOVA lo ofrece" : "Inactivo — NOVA no lo menciona"}</span>
          </div>
        </div>
        <div style={{ padding: "14px 22px", borderTop: "1px solid #1a1a2a", display: "flex", gap: 10 }}>
          <button onClick={onClose} style={{ flex: 1, background: "transparent", border: "1px solid #1e1e2e", color: "#555", borderRadius: 12, padding: "11px", cursor: "pointer", fontSize: 13, fontFamily: "'DM Sans',sans-serif" }}>Cancelar</button>
          <button onClick={() => onSave(f)} style={{ flex: 2, background: `linear-gradient(135deg,${color},${color}cc)`, border: "none", color: "#fff", borderRadius: 12, padding: "11px", cursor: "pointer", fontSize: 14, fontWeight: 800, fontFamily: "'DM Sans',sans-serif" }}>
            💾 Guardar cambios
          </button>
        </div>
      </div>
    </div>
  );
}

/* ══════════════════════════════════════
   CATÁLOGO — SOLO LECTURA + SOLICITUD
══════════════════════════════════════ */
function CatalogoTab({ c, notify }) {
  const [tipo, setTipo] = useState("cambio_precio");
  const [detalle, setDetalle] = useState("");
  const [enviado, setEnviado] = useState(false);
  const [solicitudes, setSolicitudes] = useState(() => load(`nova_solicitudes_${c.id}`, []));

  const tiposSolicitud = [
    { id: "cambio_precio", label: "Cambiar precio de un producto", icon: "💰" },
    { id: "nuevo_producto", label: "Agregar producto nuevo", icon: "➕" },
    { id: "quitar_producto", label: "Quitar un producto", icon: "🗑️" },
    { id: "cambio_tallas", label: "Actualizar tallas disponibles", icon: "📏" },
    { id: "cambio_colores", label: "Actualizar colores disponibles", icon: "🎨" },
    { id: "cambio_promo", label: "Cambiar promoción activa", icon: "🎁" },
    { id: "otro", label: "Otro cambio", icon: "✏️" },
  ];

  const enviarSolicitud = () => {
    if (!detalle.trim()) return;
    const nueva = {
      id: Date.now(), tipo, detalle,
      tipoLabel: tiposSolicitud.find(t => t.id === tipo)?.label,
      fecha: new Date().toLocaleString("es-CO"),
      estado: "pendiente"
    };
    const nuevas = [nueva, ...solicitudes];
    setSolicitudes(nuevas);
    save(`nova_solicitudes_${c.id}`, nuevas);
    setDetalle("");
    setEnviado(true);
    notify("✅ Solicitud enviada. La aplicamos en menos de 24 horas.");
    setTimeout(() => setEnviado(false), 3000);
  };

  const estadoConfig = {
    pendiente: { label: "Pendiente", color: "#f59e0b" },
    en_proceso: { label: "En proceso", color: "#3b82f6" },
    aplicado: { label: "Aplicado ✓", color: "#22c55e" },
  };

  return (
    <div style={{ animation: "fadeUp .3s ease" }}>
      <div style={{ marginBottom: 24 }}>
        <div style={{ color: c.color, fontSize: 10, fontWeight: 700, letterSpacing: 3, textTransform: "uppercase", marginBottom: 4 }}>Tu catálogo actual</div>
        <h2 style={{ fontSize: 24, fontWeight: 900, letterSpacing: -0.5, marginBottom: 4 }}>Productos que conoce NOVA</h2>
        <p style={{ color: "#444", fontSize: 13 }}>¿Necesitas un cambio? Usa el formulario de abajo — lo aplicamos en menos de 24 horas.</p>
      </div>

      {/* Promo activa — solo lectura */}
      <div style={{ background: `${c.color}0d`, border: `1px solid ${c.color}33`, borderRadius: 16, padding: 18, marginBottom: 20, display: "flex", alignItems: "center", gap: 12 }}>
        <span style={{ fontSize: 22 }}>🎁</span>
        <div>
          <div style={{ color: c.color, fontSize: 10, fontWeight: 700, textTransform: "uppercase", letterSpacing: 1.5, marginBottom: 3 }}>Promoción activa</div>
          <div style={{ color: "#ccc", fontSize: 13 }}>{c.promo}</div>
        </div>
        <div style={{ marginLeft: "auto", background: "#22c55e18", border: "1px solid #22c55e33", borderRadius: 20, padding: "3px 12px", fontSize: 11, color: "#22c55e", fontWeight: 700, flexShrink: 0 }}>
          ● Activa
        </div>
      </div>

      {/* Lista productos — solo lectura */}
      <div style={{ display: "flex", flexDirection: "column", gap: 8, marginBottom: 24 }}>
        {c.productos.map(p => (
          <div key={p.id} style={{ background: "#0a0a14", border: `1px solid ${p.activo ? c.color + "22" : "#1a1a2a"}`, borderRadius: 14, padding: "14px 18px", display: "flex", alignItems: "center", gap: 12 }}>
            <div style={{ width: 40, height: 40, borderRadius: 11, background: p.activo ? `${c.color}18` : "#1a1a2a", border: `1px solid ${p.activo ? c.color + "33" : "#2a2a3a"}`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 18, flexShrink: 0 }}>
              {c.emoji}
            </div>
            <div style={{ flex: 1 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 3 }}>
                <span style={{ fontWeight: 700, fontSize: 14 }}>{p.n}</span>
                <span style={{ background: p.activo ? "#22c55e18" : "#ef444418", border: `1px solid ${p.activo ? "#22c55e33" : "#ef444433"}`, color: p.activo ? "#22c55e" : "#ef4444", borderRadius: 20, padding: "2px 9px", fontSize: 10, fontWeight: 700 }}>
                  {p.activo ? "● Activo" : "○ Inactivo"}
                </span>
              </div>
              <div style={{ display: "flex", gap: 12, fontSize: 12 }}>
                <span style={{ color: "#22c55e", fontWeight: 800 }}>{COP(p.p)}</span>
                <span style={{ color: "#555" }}>📏 {p.tallas}</span>
                <span style={{ color: "#555" }}>🎨 {p.colores}</span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Formulario solicitud de cambio */}
      <div style={{ background: "#0a0a14", border: `1px solid ${c.color}33`, borderRadius: 20, padding: 28, marginBottom: 20 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 20 }}>
          <div style={{ width: 40, height: 40, borderRadius: 12, background: `${c.color}18`, border: `1px solid ${c.color}33`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 20 }}>✏️</div>
          <div>
            <div style={{ fontWeight: 800, fontSize: 16 }}>Solicitar cambio en el catálogo</div>
            <div style={{ color: "#555", fontSize: 13, marginTop: 2 }}>Lo aplicamos en menos de 24 horas · Sin costo adicional</div>
          </div>
        </div>

        <div style={{ marginBottom: 16 }}>
          <div style={{ color: "#555", fontSize: 11, textTransform: "uppercase", letterSpacing: 1.5, marginBottom: 10 }}>¿Qué necesitas cambiar?</div>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 }}>
            {tiposSolicitud.map(t => (
              <button key={t.id} onClick={() => setTipo(t.id)} style={{ background: tipo === t.id ? `${c.color}18` : "transparent", border: `1px solid ${tipo === t.id ? c.color + "66" : "#1e1e2e"}`, borderRadius: 12, padding: "10px 14px", cursor: "pointer", display: "flex", alignItems: "center", gap: 8, transition: "all .2s", textAlign: "left" }}>
                <span style={{ fontSize: 16 }}>{t.icon}</span>
                <span style={{ color: tipo === t.id ? c.color : "#555", fontWeight: tipo === t.id ? 700 : 400, fontSize: 12, fontFamily: "'DM Sans',sans-serif", lineHeight: 1.3 }}>{t.label}</span>
              </button>
            ))}
          </div>
        </div>

        <div style={{ marginBottom: 16 }}>
          <div style={{ color: "#555", fontSize: 11, textTransform: "uppercase", letterSpacing: 1.5, marginBottom: 8 }}>Detalla el cambio</div>
          <textarea value={detalle} onChange={e => setDetalle(e.target.value)} placeholder={
            tipo === "cambio_precio" ? "Ej: El Vestido Midi Floral ahora vale $200.000 (antes $189.000)" :
            tipo === "nuevo_producto" ? "Ej: Agregar 'Blusa Campesina' $120.000, tallas S M L, colores: Blanco, Rosa, Azul" :
            tipo === "quitar_producto" ? "Ej: Quitar 'Blusa Satín Elegante' — se agotó y no entra más" :
            tipo === "cambio_tallas" ? "Ej: El Blazer Oversize ya no tiene talla XS — solo S M L XL" :
            tipo === "cambio_colores" ? "Ej: Los Jeans Mom ya no tienen color gris, solo azul y negro" :
            tipo === "cambio_promo" ? "Ej: Nueva promo: 20% en todos los conjuntos esta semana" :
            "Describe exactamente el cambio que necesitas..."
          } style={{ width: "100%", background: "#0d0d18", border: `1px solid ${c.color}33`, borderRadius: 12, padding: "12px 16px", color: "#fff", fontSize: 13, outline: "none", fontFamily: "'DM Sans',sans-serif", resize: "vertical", minHeight: 100 }} />
        </div>

        <button onClick={enviarSolicitud} disabled={!detalle.trim()} style={{ width: "100%", background: !detalle.trim() ? "#1a1a2a" : `linear-gradient(135deg,${c.color},${c.color}cc)`, border: "none", color: !detalle.trim() ? "#333" : "#fff", borderRadius: 14, padding: "14px", cursor: !detalle.trim() ? "default" : "pointer", fontSize: 14, fontWeight: 900, fontFamily: "'DM Sans',sans-serif", transition: "all .2s" }}>
          {enviado ? "✅ ¡Solicitud enviada!" : "📨 Enviar solicitud de cambio"}
        </button>

        <div style={{ marginTop: 14, background: "#f59e0b0d", border: "1px solid #f59e0b22", borderRadius: 10, padding: "10px 14px", fontSize: 12, color: "#f59e0b" }}>
          ⏱️ Tiempo de respuesta: menos de 24 horas en días hábiles. Te avisamos por WhatsApp cuando esté aplicado.
        </div>
      </div>

      {/* Historial de solicitudes */}
      {solicitudes.length > 0 && (
        <div style={{ background: "#0a0a14", border: "1px solid #1a1a2a", borderRadius: 18, overflow: "hidden" }}>
          <div style={{ padding: "14px 20px", borderBottom: "1px solid #1a1a2a", fontWeight: 800, fontSize: 14 }}>
            📋 Mis solicitudes anteriores
          </div>
          {solicitudes.map(s => (
            <div key={s.id} style={{ padding: "14px 20px", borderBottom: "1px solid #0d0d18", display: "flex", gap: 12, alignItems: "flex-start" }}>
              <div style={{ flex: 1 }}>
                <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 4 }}>
                  <span style={{ fontWeight: 700, fontSize: 13 }}>{s.tipoLabel}</span>
                  <span style={{ background: `${estadoConfig[s.estado]?.color}18`, border: `1px solid ${estadoConfig[s.estado]?.color}33`, color: estadoConfig[s.estado]?.color, borderRadius: 20, padding: "2px 9px", fontSize: 10, fontWeight: 700 }}>
                    {estadoConfig[s.estado]?.label}
                  </span>
                </div>
                <div style={{ color: "#666", fontSize: 12, lineHeight: 1.6 }}>{s.detalle}</div>
                <div style={{ color: "#333", fontSize: 11, marginTop: 4 }}>{s.fecha}</div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

/* ══════════════════════════════════════
   PANEL DEL CLIENTE
══════════════════════════════════════ */
function PanelCliente({ clienteId, onLogout }) {
  const [clienteData, setClienteData] = useState(() => {
    const saved = load(`nova_cliente_${clienteId}`, null);
    return saved || CLIENTES_DEMO[clienteId];
  });
  const [tab, setTab] = useState("dashboard");
  const [toast, setToast] = useState(null);

  const c = clienteData;

  useEffect(() => { save(`nova_cliente_${clienteId}`, clienteData); }, [clienteData]);

  const notify = (msg, tipo = "ok") => { setToast({ msg, tipo }); setTimeout(() => setToast(null), 3000); };

  const planColor = { basico: "#6b7280", pro: "#ec4899", premium: "#a855f7" };
  const planLabel = { basico: "Básico", pro: "Pro", premium: "Premium" };

  const tabs = [
    { id: "dashboard", icon: "📊", label: "Mi resumen" },
    { id: "catalogo", icon: "🛍️", label: "Mi catálogo" },
    { id: "conversaciones", icon: "💬", label: "Conversaciones" },
    { id: "config", icon: "⚙️", label: "Configuración" },
    { id: "soporte", icon: "🆘", label: "Soporte" },
  ];

  return (
    <div style={{ minHeight: "100vh", background: "#05050d", color: "#fff", fontFamily: "'DM Sans', sans-serif" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@300;400;500;600;700;800;900&display=swap');
        *{box-sizing:border-box;margin:0;padding:0}
        ::-webkit-scrollbar{width:3px}::-webkit-scrollbar-track{background:#0a0a14}::-webkit-scrollbar-thumb{background:${c.color}44;border-radius:2px}
        @keyframes fadeUp{from{opacity:0;transform:translateY(8px)}to{opacity:1;transform:translateY(0)}}
        @keyframes pulse{0%,100%{opacity:1}50%{opacity:.3}}
        @keyframes slideIn{from{transform:translateX(20px);opacity:0}to{transform:translateX(0);opacity:1}}
        .card{background:#0a0a14;border:1px solid #1a1a2a;border-radius:16px;transition:border-color .2s}
        .card:hover{border-color:${c.color}33}
      `}</style>

      {/* TOAST */}
      {toast && (
        <div style={{ position: "fixed", top: 20, right: 20, zIndex: 2000, background: "#0a0a14", border: `1px solid ${c.color}44`, borderRadius: 14, padding: "12px 20px", fontSize: 14, fontWeight: 700, animation: "slideIn .3s ease", backdropFilter: "blur(10px)" }}>
          {toast.msg}
        </div>
      )}

      {/* HEADER */}
      <div style={{ background: "#07070e", borderBottom: "1px solid #12121e", padding: "14px 24px", display: "flex", alignItems: "center", gap: 14 }}>
        <div style={{ width: 42, height: 42, borderRadius: 12, background: `linear-gradient(135deg,${c.color},${c.color}88)`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 22 }}>{c.emoji}</div>
        <div style={{ flex: 1 }}>
          <div style={{ fontWeight: 900, fontSize: 16, letterSpacing: -0.5 }}>{c.tienda}</div>
          <div style={{ display: "flex", alignItems: "center", gap: 8, marginTop: 2 }}>
            <span style={{ width: 6, height: 6, borderRadius: "50%", background: "#22c55e", display: "inline-block", animation: "pulse 2s infinite" }} />
            <span style={{ color: "#22c55e", fontSize: 11, fontWeight: 600 }}>NOVA activa</span>
            <span style={{ color: "#333", fontSize: 11 }}>·</span>
            <span style={{ background: `${planColor[c.plan]}18`, border: `1px solid ${planColor[c.plan]}33`, color: planColor[c.plan], borderRadius: 20, padding: "2px 10px", fontSize: 10, fontWeight: 700 }}>Plan {planLabel[c.plan]}</span>
          </div>
        </div>
        <button onClick={onLogout} style={{ background: "#ffffff0a", border: "1px solid #1e1e2e", color: "#555", borderRadius: 10, padding: "7px 16px", cursor: "pointer", fontSize: 12, fontFamily: "'DM Sans',sans-serif" }}>
          Cerrar sesión
        </button>
      </div>

      {/* TABS */}
      <div style={{ background: "#07070e", borderBottom: "1px solid #12121e", padding: "0 24px", display: "flex", gap: 2, overflowX: "auto" }}>
        {tabs.map(t => (
          <button key={t.id} onClick={() => setTab(t.id)} style={{ background: "transparent", border: "none", borderBottom: `2px solid ${tab === t.id ? c.color : "transparent"}`, color: tab === t.id ? c.color : "#444", padding: "13px 18px", cursor: "pointer", fontSize: 13, fontWeight: tab === t.id ? 800 : 500, fontFamily: "'DM Sans',sans-serif", whiteSpace: "nowrap" }}>
            {t.icon} {t.label}
          </button>
        ))}
      </div>

      <div style={{ maxWidth: 960, margin: "0 auto", padding: "28px 20px" }}>

        {/* ══ DASHBOARD ══ */}
        {tab === "dashboard" && (
          <div style={{ animation: "fadeUp .3s ease" }}>
            <div style={{ marginBottom: 24 }}>
              <div style={{ color: c.color, fontSize: 10, fontWeight: 700, letterSpacing: 3, textTransform: "uppercase", marginBottom: 4 }}>Panel de control</div>
              <h2 style={{ fontSize: 26, fontWeight: 900, letterSpacing: -0.5 }}>¡Hola, {c.nombre.split(" ")[0]}! 👋</h2>
              <p style={{ color: "#444", fontSize: 14, marginTop: 4 }}>Así está trabajando NOVA por {c.tienda} hoy</p>
            </div>

            {/* KPIs principales */}
            <div style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 12, marginBottom: 20 }}>
              {[
                { l: "Mensajes hoy", v: c.stats.mensajesHoy, sub: `${c.stats.mensajesMes.toLocaleString("es-CO")} este mes`, c: "#3b82f6", e: "💬" },
                { l: "Ventas cerradas hoy", v: c.stats.ventasHoy, sub: `${c.stats.ventasMes} este mes`, c: "#22c55e", e: "🛍️" },
                { l: "Ingresos generados", v: COP(c.stats.ingresosMes), sub: "este mes por NOVA", c: "#f59e0b", e: "💰" },
                { l: "Ticket promedio", v: COP(c.stats.ticketPromedio), sub: "por venta cerrada", c: c.color, e: "🎯" },
              ].map(k => (
                <div key={k.l} className="card" style={{ padding: 20, border: `1px solid ${k.c}18` }}>
                  <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 10 }}>
                    <span style={{ fontSize: 22 }}>{k.e}</span>
                    <div style={{ width: 7, height: 7, borderRadius: "50%", background: k.c, animation: "pulse 2s infinite" }} />
                  </div>
                  <div style={{ color: k.c, fontWeight: 900, fontSize: k.v.toString().length > 8 ? 18 : 24, letterSpacing: -0.5, marginBottom: 3 }}>{k.v}</div>
                  <div style={{ color: "#333", fontSize: 11 }}>{k.l}</div>
                  <div style={{ color: "#222", fontSize: 10, marginTop: 2 }}>{k.sub}</div>
                </div>
              ))}
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14, marginBottom: 14 }}>
              {/* Gráfico histórico */}
              <div className="card" style={{ padding: 22 }}>
                <div style={{ color: c.color, fontSize: 10, fontWeight: 700, textTransform: "uppercase", letterSpacing: 2, marginBottom: 14 }}>Ventas por mes</div>
                <MiniChart data={c.historico} color={c.color} valueKey="ventas" labelKey="mes" />
                <div style={{ color: "#555", fontSize: 11, marginTop: 10, textAlign: "center" }}>
                  Crecimiento: <span style={{ color: "#22c55e", fontWeight: 700 }}>+{Math.round(((c.historico[3].ventas - c.historico[0].ventas) / c.historico[0].ventas) * 100)}% desde que activaste NOVA</span>
                </div>
              </div>

              {/* Stats adicionales */}
              <div className="card" style={{ padding: 22 }}>
                <div style={{ color: c.color, fontSize: 10, fontWeight: 700, textTransform: "uppercase", letterSpacing: 2, marginBottom: 16 }}>Rendimiento de NOVA</div>
                {[
                  { l: "Tasa de respuesta", v: `${c.stats.tasaRespuesta}%`, max: 100, color: "#22c55e" },
                  { l: "Clientes nuevos este mes", v: c.stats.clientesNuevos, max: c.stats.mensajesMes, color: "#3b82f6" },
                  { l: "Clientes que repiten", v: c.stats.clientesRepetidos, max: c.stats.ventasMes, color: c.color },
                ].map(s => (
                  <div key={s.l} style={{ marginBottom: 14 }}>
                    <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 6 }}>
                      <span style={{ color: "#666", fontSize: 12 }}>{s.l}</span>
                      <span style={{ color: s.color, fontWeight: 800, fontSize: 13 }}>{s.v}</span>
                    </div>
                    <Barra valor={typeof s.v === "string" ? parseFloat(s.v) : s.v} max={s.max} color={s.color} />
                  </div>
                ))}
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10, marginTop: 16 }}>
                  <div style={{ background: "#0d0d18", borderRadius: 10, padding: 12, textAlign: "center" }}>
                    <div style={{ color: c.color, fontWeight: 900, fontSize: 14 }}>{c.stats.horaPico}</div>
                    <div style={{ color: "#444", fontSize: 10, marginTop: 2 }}>Hora pico</div>
                  </div>
                  <div style={{ background: "#0d0d18", borderRadius: 10, padding: 12, textAlign: "center" }}>
                    <div style={{ color: c.color, fontWeight: 900, fontSize: 14 }}>{c.stats.diaPico}</div>
                    <div style={{ color: "#444", fontSize: 10, marginTop: 2 }}>Día pico</div>
                  </div>
                </div>
              </div>
            </div>

            {/* Próximo pago y estado de cuenta */}
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }}>
              <div className="card" style={{ padding: 22, border: "1px solid #f59e0b22" }}>
                <div style={{ color: "#f59e0b", fontSize: 10, fontWeight: 700, textTransform: "uppercase", letterSpacing: 2, marginBottom: 14 }}>Estado de tu suscripción</div>
                {[
                  { l: "Plan activo", v: `Plan ${planLabel[c.plan]}`, c: planColor[c.plan] },
                  { l: "Valor mensual", v: COP(c.precio), c: "#22c55e" },
                  { l: "Próximo pago", v: new Date(c.proximoPago).toLocaleDateString("es-CO", { day: "numeric", month: "long" }), c: "#f59e0b" },
                  { l: "Cliente desde", v: new Date(c.fechaInicio).toLocaleDateString("es-CO", { day: "numeric", month: "long", year: "numeric" }), c: "#aaa" },
                ].map(r => (
                  <div key={r.l} style={{ display: "flex", justifyContent: "space-between", padding: "8px 0", borderBottom: "1px solid #0d0d18", fontSize: 13 }}>
                    <span style={{ color: "#555" }}>{r.l}</span>
                    <span style={{ color: r.c, fontWeight: 700 }}>{r.v}</span>
                  </div>
                ))}
                <div style={{ marginTop: 14, background: "#22c55e0d", border: "1px solid #22c55e22", borderRadius: 10, padding: "10px 14px", fontSize: 12, color: "#22c55e" }}>
                  ✅ Tu NOVA está activa y funcionando al 100%
                </div>
              </div>

              <div className="card" style={{ padding: 22, border: `1px solid ${c.color}18` }}>
                <div style={{ color: c.color, fontSize: 10, fontWeight: 700, textTransform: "uppercase", letterSpacing: 2, marginBottom: 14 }}>Tu ROI este mes</div>
                {[
                  { l: "Ventas cerradas por NOVA", v: c.stats.ventasMes, c: "#22c55e" },
                  { l: "Ingresos generados", v: COP(c.stats.ingresosMes), c: "#22c55e" },
                  { l: "Costo del servicio", v: `- ${COP(c.precio)}`, c: "#ef4444" },
                  { l: "Ganancia neta de NOVA", v: COP(c.stats.ingresosMes - c.precio), c: "#f59e0b" },
                ].map(r => (
                  <div key={r.l} style={{ display: "flex", justifyContent: "space-between", padding: "8px 0", borderBottom: "1px solid #0d0d18", fontSize: 13 }}>
                    <span style={{ color: "#555" }}>{r.l}</span>
                    <span style={{ color: r.c, fontWeight: 700 }}>{r.v}</span>
                  </div>
                ))}
                <div style={{ marginTop: 14, textAlign: "center" }}>
                  <div style={{ color: c.color, fontWeight: 900, fontSize: 28, letterSpacing: -1 }}>{Math.round((c.stats.ingresosMes - c.precio) / c.precio * 100)}x</div>
                  <div style={{ color: "#555", fontSize: 12 }}>retorno sobre inversión</div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ══ CATÁLOGO ══ */}
        {tab === "catalogo" && (
          <CatalogoTab c={c} notify={notify} />
        )}

        {/* ══ CONVERSACIONES ══ */}
        {tab === "conversaciones" && (
          <div style={{ animation: "fadeUp .3s ease" }}>
            <div style={{ marginBottom: 24 }}>
              <div style={{ color: c.color, fontSize: 10, fontWeight: 700, letterSpacing: 3, textTransform: "uppercase", marginBottom: 4 }}>Actividad reciente</div>
              <h2 style={{ fontSize: 24, fontWeight: 900, letterSpacing: -0.5 }}>Últimas conversaciones de NOVA</h2>
              <p style={{ color: "#444", fontSize: 13, marginTop: 4 }}>Lo que NOVA respondió por ti hoy</p>
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 12, marginBottom: 20 }}>
              {[
                { l: "Conversaciones hoy", v: c.stats.mensajesHoy, c: "#3b82f6", e: "💬" },
                { l: "Ventas cerradas hoy", v: c.stats.ventasHoy, c: "#22c55e", e: "✅" },
                { l: "Consultas resueltas", v: c.stats.mensajesHoy - c.stats.ventasHoy, c: "#f59e0b", e: "🔍" },
              ].map(k => (
                <div key={k.l} className="card" style={{ padding: 18, textAlign: "center", border: `1px solid ${k.c}18` }}>
                  <div style={{ fontSize: 24, marginBottom: 8 }}>{k.e}</div>
                  <div style={{ color: k.c, fontWeight: 900, fontSize: 28 }}>{k.v}</div>
                  <div style={{ color: "#444", fontSize: 11, marginTop: 4 }}>{k.l}</div>
                </div>
              ))}
            </div>

            <div className="card" style={{ overflow: "hidden", marginBottom: 16 }}>
              <div style={{ padding: "14px 20px", borderBottom: "1px solid #1a1a2a", fontWeight: 800, fontSize: 14 }}>Conversaciones recientes de hoy</div>
              {c.ultimasConversaciones.map((conv, i) => (
                <div key={i} style={{ padding: "14px 20px", borderBottom: "1px solid #0d0d18", display: "flex", alignItems: "flex-start", gap: 14 }}>
                  <div style={{ width: 36, height: 36, borderRadius: 10, background: conv.resultado === "venta" ? "#22c55e18" : "#3b82f618", border: `1px solid ${conv.resultado === "venta" ? "#22c55e33" : "#3b82f633"}`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 16, flexShrink: 0 }}>
                    {conv.resultado === "venta" ? "💰" : "💬"}
                  </div>
                  <div style={{ flex: 1 }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 4 }}>
                      <span style={{ fontWeight: 700, fontSize: 13 }}>{conv.cliente}</span>
                      <span style={{ background: conv.resultado === "venta" ? "#22c55e18" : "#3b82f618", color: conv.resultado === "venta" ? "#22c55e" : "#3b82f6", borderRadius: 20, padding: "2px 9px", fontSize: 10, fontWeight: 700 }}>
                        {conv.resultado === "venta" ? "✅ Venta" : "💬 Consulta"}
                      </span>
                      <span style={{ color: "#333", fontSize: 11, marginLeft: "auto" }}>{conv.hora}</span>
                    </div>
                    <div style={{ color: "#666", fontSize: 13, lineHeight: 1.6 }}>{conv.resumen}</div>
                  </div>
                </div>
              ))}
            </div>

            <div style={{ background: "#0a0a14", border: "1px solid #1a1a2a", borderRadius: 14, padding: 18 }}>
              <div style={{ fontWeight: 700, fontSize: 14, marginBottom: 8 }}>📊 Resumen del mes</div>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(2,1fr)", gap: 10 }}>
                {[
                  { l: "Total mensajes respondidos", v: c.stats.mensajesMes.toLocaleString("es-CO"), c: "#3b82f6" },
                  { l: "Total ventas cerradas", v: c.stats.ventasMes, c: "#22c55e" },
                  { l: "Clientes nuevos", v: c.stats.clientesNuevos, c: c.color },
                  { l: "Clientes que repitieron", v: c.stats.clientesRepetidos, c: "#f59e0b" },
                ].map(s => (
                  <div key={s.l} style={{ background: "#0d0d18", borderRadius: 12, padding: 14 }}>
                    <div style={{ color: s.c, fontWeight: 900, fontSize: 22 }}>{s.v}</div>
                    <div style={{ color: "#444", fontSize: 11, marginTop: 3 }}>{s.l}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* ══ CONFIG ══ */}
        {tab === "config" && (
          <div style={{ animation: "fadeUp .3s ease", maxWidth: 640 }}>
            <div style={{ marginBottom: 24 }}>
              <div style={{ color: c.color, fontSize: 10, fontWeight: 700, letterSpacing: 3, textTransform: "uppercase", marginBottom: 4 }}>Configuración</div>
              <h2 style={{ fontSize: 24, fontWeight: 900, letterSpacing: -0.5 }}>Ajustes de mi NOVA ⚙️</h2>
            </div>

            {[
              { t: "Información del negocio", icon: "🏪", campos: [
                { l: "Nombre de la tienda", v: c.tienda, tipo: "text" },
                { l: "Ciudad", v: c.ciudad, tipo: "text" },
                { l: "WhatsApp de contacto", v: c.whatsapp, tipo: "text" },
              ]},
              { t: "Personalidad de NOVA", icon: "🤖", campos: [
                { l: "Tono de comunicación", v: c.tono, tipo: "select", opciones: ["sofisticado y cálido", "energético y cool", "cariñoso y empático", "profesional y directo", "casual y divertido"] },
                { l: "Redes sociales activas", v: c.redes.join(", "), tipo: "text" },
              ]},
            ].map((sec, si) => (
              <div key={si} className="card" style={{ padding: 24, marginBottom: 14 }}>
                <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 18 }}>
                  <span style={{ fontSize: 20 }}>{sec.icon}</span>
                  <span style={{ fontWeight: 800, fontSize: 15 }}>{sec.t}</span>
                </div>
                <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
                  {sec.campos.map(campo => (
                    <div key={campo.l}>
                      <div style={{ color: "#555", fontSize: 11, textTransform: "uppercase", letterSpacing: 1.5, marginBottom: 6 }}>{campo.l}</div>
                      {campo.tipo === "select" ? (
                        <select defaultValue={campo.v} style={{ width: "100%", background: "#0a0a12", border: `1px solid ${c.color}33`, borderRadius: 10, padding: "10px 14px", color: "#fff", fontSize: 13, outline: "none", fontFamily: "'DM Sans',sans-serif" }}>
                          {campo.opciones.map(o => <option key={o} value={o}>{o}</option>)}
                        </select>
                      ) : (
                        <input defaultValue={campo.v} style={{ width: "100%", background: "#0a0a12", border: `1px solid ${c.color}33`, borderRadius: 10, padding: "10px 14px", color: "#fff", fontSize: 13, outline: "none", fontFamily: "'DM Sans',sans-serif" }} />
                      )}
                    </div>
                  ))}
                </div>
              </div>
            ))}

            <button onClick={() => notify("✅ Cambios guardados. NOVA se actualiza en segundos.")}
              style={{ width: "100%", background: `linear-gradient(135deg,${c.color},${c.color}cc)`, border: "none", color: "#fff", borderRadius: 14, padding: "14px", cursor: "pointer", fontSize: 15, fontWeight: 900, fontFamily: "'DM Sans',sans-serif" }}>
              💾 Guardar cambios
            </button>
          </div>
        )}

        {/* ══ SOPORTE ══ */}
        {tab === "soporte" && (
          <div style={{ animation: "fadeUp .3s ease", maxWidth: 700 }}>
            <div style={{ marginBottom: 24 }}>
              <div style={{ color: c.color, fontSize: 10, fontWeight: 700, letterSpacing: 3, textTransform: "uppercase", marginBottom: 4 }}>Ayuda</div>
              <h2 style={{ fontSize: 24, fontWeight: 900, letterSpacing: -0.5 }}>Centro de soporte 🆘</h2>
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14, marginBottom: 20 }}>
              {[
                { t: "WhatsApp directo", d: "Respuesta en menos de 2 horas en horario hábil", icon: "📱", accion: "Escribir ahora", color: "#25D366" },
                { t: "Actualizar catálogo", d: "¿Cambiaron tus productos? Actualiza aquí en segundos", icon: "🛍️", accion: "Ir al catálogo", color: c.color },
                { t: "Reportar problema", d: "¿NOVA respondió mal algo? Cuéntanos para mejorar", icon: "🐛", accion: "Reportar", color: "#f59e0b" },
                { t: "Solicitar mejora", d: "¿Quieres que NOVA aprenda algo nuevo de tu negocio?", icon: "✨", accion: "Solicitar", color: "#a855f7" },
              ].map(s => (
                <div key={s.t} className="card" style={{ padding: 22, border: `1px solid ${s.color}22` }}>
                  <div style={{ fontSize: 28, marginBottom: 12 }}>{s.icon}</div>
                  <div style={{ fontWeight: 800, fontSize: 14, marginBottom: 6 }}>{s.t}</div>
                  <div style={{ color: "#555", fontSize: 13, lineHeight: 1.6, marginBottom: 14 }}>{s.d}</div>
                  <button onClick={() => { if(s.t === "Actualizar catálogo") setTab("catalogo"); else notify(`📨 Solicitud enviada. Te contactamos pronto.`); }}
                    style={{ background: `${s.color}18`, border: `1px solid ${s.color}33`, color: s.color, borderRadius: 10, padding: "8px 16px", cursor: "pointer", fontSize: 12, fontWeight: 700, fontFamily: "'DM Sans',sans-serif" }}>
                    {s.accion} →
                  </button>
                </div>
              ))}
            </div>

            <div className="card" style={{ padding: 24 }}>
              <div style={{ fontWeight: 800, fontSize: 15, marginBottom: 16 }}>❓ Preguntas frecuentes</div>
              {[
                { p: "¿Cuándo actualiza NOVA los cambios del catálogo?", r: "Inmediatamente. En cuanto guardas un cambio aquí, NOVA empieza a usarlo en la siguiente conversación." },
                { p: "¿Puedo ver las conversaciones completas de NOVA?", r: "Actualmente ves el resumen de cada conversación. El historial completo estará disponible próximamente en el plan Premium." },
                { p: "¿Qué pasa si NOVA responde algo incorrecto?", r: "Repórtalo en 'Reportar problema' con el detalle. Lo revisamos y ajustamos el bot en menos de 24 horas." },
                { p: "¿Cómo cambio mi plan?", r: "Contáctanos por WhatsApp de soporte y lo gestionamos de inmediato. El cambio aplica desde el siguiente período de facturación." },
                { p: "¿Puedo pausar el servicio temporalmente?", r: "Sí. Escríbenos y pausamos NOVA sin costo. Cuando quieras reactivarla, la tenemos lista en menos de 1 hora." },
              ].map((faq, i) => {
                const [open, setOpen] = useState(false);
                return (
                  <div key={i} onClick={() => setOpen(o => !o)} style={{ borderBottom: "1px solid #1a1a2a", cursor: "pointer" }}>
                    <div style={{ padding: "12px 0", display: "flex", alignItems: "center", gap: 10 }}>
                      <span style={{ color: c.color, fontWeight: 900 }}>?</span>
                      <span style={{ flex: 1, fontWeight: 600, fontSize: 13 }}>{faq.p}</span>
                      <span style={{ color: "#444", transition: "transform .2s", transform: open ? "rotate(45deg)" : "none" }}>+</span>
                    </div>
                    {open && <div style={{ paddingBottom: 12, color: "#666", fontSize: 13, lineHeight: 1.7 }}>{faq.r}</div>}
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

/* ══════════════════════════════════════
   LOGIN
══════════════════════════════════════ */
function Login({ onLogin }) {
  const [user, setUser] = useState("");
  const [pass, setPass] = useState("");
  const [error, setError] = useState("");

  const cuentas = {
    "luisa@boutique.co": { pass: "nova2025", id: "luisa" },
    "sebastian@urbanflow.co": { pass: "nova2025", id: "urban" },
  };

  const intentar = () => {
    const cuenta = cuentas[user.toLowerCase()];
    if (cuenta && cuenta.pass === pass) {
      onLogin(cuenta.id);
    } else {
      setError("Correo o contraseña incorrectos");
      setTimeout(() => setError(""), 3000);
    }
  };

  return (
    <div style={{ minHeight: "100vh", background: "#05050d", display: "flex", alignItems: "center", justifyContent: "center", padding: 24, fontFamily: "'DM Sans', sans-serif" }}>
      <style>{`@import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;600;700;800;900&display=swap');*{box-sizing:border-box;margin:0;padding:0}@keyframes fadeUp{from{opacity:0;transform:translateY(12px)}to{opacity:1;transform:translateY(0)}}`}</style>
      <div style={{ width: "100%", maxWidth: 420, animation: "fadeUp .5s ease" }}>
        <div style={{ textAlign: "center", marginBottom: 36 }}>
          <div style={{ width: 64, height: 64, borderRadius: 18, background: "linear-gradient(135deg,#ec4899,#f97316)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 32, margin: "0 auto 16px" }}>👗</div>
          <h1 style={{ fontSize: 26, fontWeight: 900, color: "#fff", letterSpacing: -0.5, marginBottom: 6 }}>Mi Panel NOVA</h1>
          <p style={{ color: "#555", fontSize: 14 }}>Accede a las métricas y configuración de tu bot</p>
        </div>

        <div style={{ background: "#0a0a14", border: "1px solid #1a1a2a", borderRadius: 22, padding: 32 }}>
          <div style={{ marginBottom: 16 }}>
            <div style={{ color: "#555", fontSize: 11, textTransform: "uppercase", letterSpacing: 1.5, marginBottom: 8 }}>Correo electrónico</div>
            <input value={user} onChange={e => setUser(e.target.value)} onKeyDown={e => e.key === "Enter" && intentar()}
              placeholder="tu@correo.com"
              style={{ width: "100%", background: "#0d0d18", border: "1px solid #1e1e2e", borderRadius: 12, padding: "12px 16px", color: "#fff", fontSize: 14, outline: "none", fontFamily: "'DM Sans',sans-serif" }} />
          </div>
          <div style={{ marginBottom: 24 }}>
            <div style={{ color: "#555", fontSize: 11, textTransform: "uppercase", letterSpacing: 1.5, marginBottom: 8 }}>Contraseña</div>
            <input type="password" value={pass} onChange={e => setPass(e.target.value)} onKeyDown={e => e.key === "Enter" && intentar()}
              placeholder="••••••••"
              style={{ width: "100%", background: "#0d0d18", border: "1px solid #1e1e2e", borderRadius: 12, padding: "12px 16px", color: "#fff", fontSize: 14, outline: "none", fontFamily: "'DM Sans',sans-serif" }} />
          </div>
          {error && <div style={{ background: "#ef444418", border: "1px solid #ef444433", borderRadius: 10, padding: "10px 14px", color: "#ef4444", fontSize: 13, marginBottom: 16 }}>{error}</div>}
          <button onClick={intentar} style={{ width: "100%", background: "linear-gradient(135deg,#ec4899,#f97316)", border: "none", color: "#fff", borderRadius: 14, padding: "14px", cursor: "pointer", fontSize: 15, fontWeight: 900, fontFamily: "'DM Sans',sans-serif" }}>
            Entrar a mi panel →
          </button>

          <div style={{ marginTop: 24, background: "#ec489908", border: "1px solid #ec489922", borderRadius: 12, padding: 14 }}>
            <div style={{ color: "#ec4899", fontSize: 11, fontWeight: 700, marginBottom: 8 }}>🔑 Cuentas demo para probar</div>
            <div style={{ color: "#666", fontSize: 12, lineHeight: 1.8 }}>
              luisa@boutique.co / nova2025<br />
              sebastian@urbanflow.co / nova2025
            </div>
          </div>
        </div>

        <p style={{ textAlign: "center", color: "#333", fontSize: 12, marginTop: 20 }}>
          ¿No tienes acceso? Contáctanos por WhatsApp
        </p>
      </div>
    </div>
  );
}

/* ══════════════════════════════════════
   APP
══════════════════════════════════════ */
export default function App() {
  const [clienteId, setClienteId] = useState(null);
  if (!clienteId) return <Login onLogin={setClienteId} />;
  return <PanelCliente clienteId={clienteId} onLogout={() => setClienteId(null)} />;
}
