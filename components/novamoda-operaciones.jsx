import { useState, useEffect } from "react";

/* ══════════════════════════════════════════
   STORAGE
══════════════════════════════════════════ */
const load = (key, def) => { try { const v = localStorage.getItem(key); return v ? JSON.parse(v) : def; } catch { return def; } };
const save = (key, val) => { try { localStorage.setItem(key, JSON.stringify(val)); } catch {} };

const COP = n => `$${new Intl.NumberFormat("es-CO").format(n)}`;
const TODAY = new Date();
const addDays = (d, n) => { const r = new Date(d); r.setDate(r.getDate() + n); return r; };
const fmtDate = d => new Date(d).toLocaleDateString("es-CO", { day: "numeric", month: "short", year: "numeric" });
const daysLeft = d => Math.ceil((new Date(d) - TODAY) / 86400000);

const DEFAULT_CLIENTS = [
  { id: "c1", name: "Luisa Fernanda Boutique", owner: "Luisa Fernanda Gómez", whatsapp: "3001234567", city: "Bogotá", plan: "pro", price: 290000, status: "active", joined: "2025-04-01", nextPayment: "2025-06-01", paymentMethod: "Nequi", paidMonths: 2, notes: "Paga puntual. Muy contenta con resultados.", color: "#ec4899" },
  { id: "c2", name: "UrbanFlow Store", owner: "Sebastián Murillo", whatsapp: "3109876543", city: "Medellín", plan: "pro", price: 290000, status: "active", joined: "2025-04-15", nextPayment: "2025-06-15", paymentMethod: "Daviplata", paidMonths: 1, notes: "Pide muchos cambios de catálogo. Recordar actualizar drops.", color: "#f97316" },
  { id: "c3", name: "Valeria Moda", owner: "Valeria Ospina", whatsapp: "3205551234", city: "Cali", plan: "basico", price: 200000, status: "overdue", joined: "2025-03-10", nextPayment: "2025-05-10", paymentMethod: "Nequi", paidMonths: 2, notes: "Lleva 20 días vencida. Mandar recordatorio.", color: "#6b7280" },
];

const PLAN_PRICES = { basico: 200000, pro: 290000, premium: 420000 };

/* ══════════════════════════════════════════
   MODAL NUEVO/EDITAR CLIENTE
══════════════════════════════════════════ */
function ClientModal({ client, onSave, onClose }) {
  const isNew = !client?.id;
  const [f, setF] = useState(client || {
    name: "", owner: "", whatsapp: "", city: "Bogotá", plan: "pro",
    price: 290000, status: "active", paymentMethod: "Nequi",
    joined: TODAY.toISOString().split("T")[0],
    nextPayment: addDays(TODAY, 30).toISOString().split("T")[0],
    paidMonths: 0, notes: "", color: "#ec4899"
  });
  const set = (k, v) => setF(p => ({ ...p, [k]: v }));
  const inp = { width: "100%", background: "#0a0a12", border: "1px solid #1e1e2e", borderRadius: 10, padding: "10px 14px", color: "#fff", fontSize: 13, outline: "none", fontFamily: "'DM Sans',sans-serif", boxSizing: "border-box" };
  const lbl = { color: "#555", fontSize: 11, textTransform: "uppercase", letterSpacing: 1.5, marginBottom: 5, display: "block", fontFamily: "'DM Sans',sans-serif" };
  return (
    <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,.9)", zIndex: 999, display: "flex", alignItems: "center", justifyContent: "center", padding: 20, backdropFilter: "blur(10px)" }}>
      <div style={{ width: "100%", maxWidth: 560, maxHeight: "90vh", background: "#08080f", border: "1px solid #ec489933", borderRadius: 24, overflow: "hidden", display: "flex", flexDirection: "column" }}>
        <div style={{ padding: "18px 24px", borderBottom: "1px solid #1a1a2a", display: "flex", alignItems: "center", gap: 12 }}>
          <div style={{ width: 36, height: 36, borderRadius: 10, background: "linear-gradient(135deg,#ec4899,#f97316)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 18 }}>👗</div>
          <div style={{ flex: 1 }}>
            <div style={{ fontWeight: 800, fontSize: 15, fontFamily: "'DM Sans',sans-serif" }}>{isNew ? "Nuevo cliente" : `Editar: ${client.name}`}</div>
            <div style={{ color: "#444", fontSize: 12 }}>Tienda de ropa</div>
          </div>
          <button onClick={onClose} style={{ background: "#ffffff10", border: "none", color: "#666", borderRadius: 8, width: 32, height: 32, cursor: "pointer", fontSize: 16 }}>✕</button>
        </div>
        <div style={{ flex: 1, overflowY: "auto", padding: "20px 24px", display: "flex", flexDirection: "column", gap: 14 }}>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
            <div><label style={lbl}>Nombre de la tienda</label><input style={inp} value={f.name} onChange={e => set("name", e.target.value)} placeholder="Ej: La Boutique de Ana" /></div>
            <div><label style={lbl}>Dueño / Contacto</label><input style={inp} value={f.owner} onChange={e => set("owner", e.target.value)} placeholder="Nombre completo" /></div>
            <div><label style={lbl}>WhatsApp</label><input style={inp} value={f.whatsapp} onChange={e => set("whatsapp", e.target.value)} placeholder="3001234567" /></div>
            <div><label style={lbl}>Ciudad</label>
              <select style={inp} value={f.city} onChange={e => set("city", e.target.value)}>
                {["Bogotá","Medellín","Cali","Barranquilla","Cartagena","Bucaramanga","Pereira","Manizales","Otra"].map(c => <option key={c}>{c}</option>)}
              </select>
            </div>
            <div><label style={lbl}>Plan</label>
              <select style={inp} value={f.plan} onChange={e => { set("plan", e.target.value); set("price", PLAN_PRICES[e.target.value]); }}>
                <option value="basico">Básico — $200.000/mes</option>
                <option value="pro">Pro — $290.000/mes</option>
                <option value="premium">Premium — $420.000/mes</option>
              </select>
            </div>
            <div><label style={lbl}>Método de pago</label>
              <select style={inp} value={f.paymentMethod} onChange={e => set("paymentMethod", e.target.value)}>
                {["Nequi","Daviplata","Transferencia bancaria","Efecty","Otro"].map(p => <option key={p}>{p}</option>)}
              </select>
            </div>
            <div><label style={lbl}>Fecha inicio</label><input style={inp} type="date" value={f.joined} onChange={e => set("joined", e.target.value)} /></div>
            <div><label style={lbl}>Próximo pago</label><input style={inp} type="date" value={f.nextPayment} onChange={e => set("nextPayment", e.target.value)} /></div>
            <div><label style={lbl}>Color identificador</label>
              <div style={{ display: "flex", gap: 8, marginTop: 4 }}>
                {["#ec4899","#f97316","#3b82f6","#22c55e","#a855f7","#f59e0b","#ef4444","#06b6d4"].map(c => (
                  <div key={c} onClick={() => set("color", c)} style={{ width: 28, height: 28, borderRadius: "50%", background: c, cursor: "pointer", border: f.color === c ? "3px solid #fff" : "3px solid transparent", transition: "all .2s" }} />
                ))}
              </div>
            </div>
          </div>
          <div><label style={lbl}>Notas internas</label><textarea style={{ ...inp, height: 70, resize: "vertical" }} value={f.notes} onChange={e => set("notes", e.target.value)} placeholder="Observaciones, recordatorios, historial..." /></div>
        </div>
        <div style={{ padding: "14px 24px", borderTop: "1px solid #1a1a2a", display: "flex", gap: 10 }}>
          <button onClick={onClose} style={{ flex: 1, background: "transparent", border: "1px solid #1e1e2e", color: "#555", borderRadius: 12, padding: "12px", cursor: "pointer", fontSize: 13, fontWeight: 700, fontFamily: "'DM Sans',sans-serif" }}>Cancelar</button>
          <button onClick={() => onSave({ ...f, id: f.id || `c${Date.now()}` })} style={{ flex: 2, background: "linear-gradient(135deg,#ec4899,#f97316)", border: "none", color: "#fff", borderRadius: 12, padding: "12px", cursor: "pointer", fontSize: 14, fontWeight: 800, fontFamily: "'DM Sans',sans-serif" }}>
            {isNew ? "✅ Crear cliente" : "💾 Guardar cambios"}
          </button>
        </div>
      </div>
    </div>
  );
}

/* ══════════════════════════════════════════
   RECIBO / COMPROBANTE
══════════════════════════════════════════ */
function Recibo({ client, onClose }) {
  const [copied, setCopied] = useState(false);
  const num = `REC-${Date.now().toString().slice(-6)}`;
  const fecha = TODAY.toLocaleDateString("es-CO", { day: "numeric", month: "long", year: "numeric" });
  const sig = addDays(TODAY, 30).toLocaleDateString("es-CO", { day: "numeric", month: "long", year: "numeric" });
  const txt = `━━━━━━━━━━━━━━━━━━━━━
🧾 RECIBO DE PAGO
NOVAModa Colombia
━━━━━━━━━━━━━━━━━━━━━

N° ${num}
Fecha: ${fecha}

Cliente: ${client.name}
Contacto: ${client.owner}
Ciudad: ${client.city}

━━━ DETALLE ━━━

Servicio: Bot de ventas NOVA
Plan: ${client.plan.toUpperCase()}
Período: ${fecha} al ${sig}
Método de pago: ${client.paymentMethod}

TOTAL: ${COP(client.price)} COP

━━━━━━━━━━━━━━━━━━━━━
✅ PAGO RECIBIDO
━━━━━━━━━━━━━━━━━━━━━

Próximo pago: ${sig}

Gracias por confiar en NOVAModa 🙌
¿Dudas? Escríbenos al WhatsApp.`;

  return (
    <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,.9)", zIndex: 999, display: "flex", alignItems: "center", justifyContent: "center", padding: 20, backdropFilter: "blur(10px)" }}>
      <div style={{ width: "100%", maxWidth: 440, background: "#08080f", border: "1px solid #22c55e33", borderRadius: 24, overflow: "hidden" }}>
        <div style={{ padding: "18px 24px", borderBottom: "1px solid #1a1a2a", display: "flex", alignItems: "center", gap: 12 }}>
          <span style={{ fontSize: 22 }}>🧾</span>
          <div style={{ flex: 1, fontWeight: 800, fontSize: 15, fontFamily: "'DM Sans',sans-serif" }}>Recibo — {client.name}</div>
          <button onClick={onClose} style={{ background: "#ffffff10", border: "none", color: "#666", borderRadius: 8, width: 32, height: 32, cursor: "pointer", fontSize: 16 }}>✕</button>
        </div>
        <div style={{ padding: "20px 24px" }}>
          <pre style={{ color: "#ccc", fontSize: 13, lineHeight: 1.8, whiteSpace: "pre-wrap", fontFamily: "'DM Sans',sans-serif", marginBottom: 16 }}>{txt}</pre>
          <button onClick={() => { navigator.clipboard.writeText(txt); setCopied(true); setTimeout(() => setCopied(false), 2500); }}
            style={{ width: "100%", background: copied ? "linear-gradient(135deg,#22c55e,#16a34a)" : "linear-gradient(135deg,#ec4899,#f97316)", border: "none", color: "#fff", borderRadius: 12, padding: "13px", cursor: "pointer", fontSize: 14, fontWeight: 800, fontFamily: "'DM Sans',sans-serif" }}>
            {copied ? "✅ ¡Copiado! Pégalo en WhatsApp" : "📋 Copiar recibo para WhatsApp"}
          </button>
        </div>
      </div>
    </div>
  );
}

/* ══════════════════════════════════════════
   MENSAJES DE COBRO
══════════════════════════════════════════ */
const COBRO_MSGS = {
  recordatorio: (c) => `Hola ${c.owner.split(" ")[0]}! 👗✨\n\nTe escribo del equipo NOVAModa. Tu bot de ventas tiene su renovación mensual el próximo ${fmtDate(c.nextPayment)}.\n\nPlan ${c.plan.toUpperCase()}: ${COP(c.price)} COP\nMétodo: ${c.paymentMethod}\n\nCualquier duda estoy aquí. ¡Que sigan las ventas! 🚀`,
  vencido: (c) => `Hola ${c.owner.split(" ")[0]}! 👋\n\nTu suscripción de NOVAModa venció el ${fmtDate(c.nextPayment)}.\n\nPara que NOVA siga atendiendo a tus clientas 24/7, necesitamos renovar:\n\n💳 ${COP(c.price)} COP por ${c.paymentMethod}\n\nSi tienes algún inconveniente, cuéntame y buscamos solución. ¡Queremos que sigas vendiendo! 🙌`,
  gracias: (c) => `¡Gracias ${c.owner.split(" ")[0]}! 🎉\n\nRecibimos tu pago de ${COP(c.price)} COP. Tu NOVA sigue activa hasta el ${fmtDate(addDays(TODAY, 30))}.\n\n¿Todo funcionando bien con el bot? Si necesitas actualizar productos o promos, dime y lo hacemos de una 👗✨`,
  pausa: (c) => `Hola ${c.owner.split(" ")[0]}!\n\nEntendemos que en este momento no puedes continuar. He pausado temporalmente tu NOVA.\n\nCuando quieras retomar, escríbeme y en menos de 24h la tenemos activa de nuevo con todo tu catálogo tal como lo dejaste.\n\nCuídate mucho 🙌`,
};

/* ══════════════════════════════════════════
   APP PRINCIPAL
══════════════════════════════════════════ */
export default function OperacionesNova() {
  const [tab, setTab] = useState("dashboard");
  const [clients, setClients] = useState(() => load("nova_moda_clients", DEFAULT_CLIENTS));
  const [modal, setModal] = useState(null); // null | "new" | "edit" | "recibo" | "cobro"
  const [selected, setSelected] = useState(null);
  const [cobroType, setCobroType] = useState("recordatorio");
  const [copiedMsg, setCopiedMsg] = useState(null);
  const [toast, setToast] = useState(null);

  useEffect(() => { save("nova_moda_clients", clients); }, [clients]);

  const notify = (msg, type = "ok") => { setToast({ msg, type }); setTimeout(() => setToast(null), 3000); };

  const saveClient = (c) => {
    setClients(prev => prev.find(x => x.id === c.id) ? prev.map(x => x.id === c.id ? c : x) : [...prev, c]);
    setModal(null);
    notify(c.id ? `✅ ${c.name} actualizado` : `🚀 ${c.name} agregado`);
  };

  const markPaid = (id) => {
    setClients(prev => prev.map(c => c.id === id ? { ...c, status: "active", paidMonths: c.paidMonths + 1, nextPayment: addDays(new Date(c.nextPayment), 30).toISOString().split("T")[0] } : c));
    notify("✅ Pago registrado");
  };

  const deleteClient = (id) => {
    const c = clients.find(x => x.id === id);
    if (!confirm(`¿Eliminar ${c?.name}?`)) return;
    setClients(prev => prev.filter(x => x.id !== id));
    notify("🗑️ Cliente eliminado", "warn");
  };

  const copy = (text, id) => { navigator.clipboard.writeText(text); setCopiedMsg(id); setTimeout(() => setCopiedMsg(null), 2500); };

  /* KPIs */
  const active = clients.filter(c => c.status === "active");
  const overdue = clients.filter(c => c.status === "overdue");
  const ingreso = active.reduce((s, c) => s + c.price, 0);
  const costoApi = clients.length * 8000;
  const ganancia = ingreso - costoApi;
  const proximos7 = clients.filter(c => { const d = daysLeft(c.nextPayment); return d >= 0 && d <= 7; });

  const planLabel = { basico: "Básico", pro: "Pro", premium: "Premium" };
  const planColor = { basico: "#6b7280", pro: "#ec4899", premium: "#a855f7" };
  const statusLabel = { active: "Activo", overdue: "Vencido", paused: "Pausado" };
  const statusColor = { active: "#22c55e", overdue: "#ef4444", paused: "#f59e0b" };

  const tabs = [
    { id: "dashboard", icon: "📊", label: "Dashboard" },
    { id: "clientes", icon: "👗", label: "Clientes" },
    { id: "cobros", icon: "💳", label: "Cobros" },
    { id: "mensajes", icon: "💬", label: "Mensajes de cobro" },
    { id: "mantenimiento", icon: "🔧", label: "Mantenimiento" },
    { id: "guia", icon: "📋", label: "Guía de operación" },
  ];

  return (
    <div style={{ minHeight: "100vh", background: "#05050d", color: "#fff", fontFamily: "'DM Sans', sans-serif", display: "flex" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@300;400;500;600;700;800;900&family=DM+Mono:wght@400;500&display=swap');
        *{box-sizing:border-box;margin:0;padding:0}
        ::-webkit-scrollbar{width:3px}::-webkit-scrollbar-track{background:#0a0a14}::-webkit-scrollbar-thumb{background:#ec489955;border-radius:2px}
        @keyframes fadeUp{from{opacity:0;transform:translateY(8px)}to{opacity:1;transform:translateY(0)}}
        @keyframes pulse{0%,100%{opacity:1}50%{opacity:.3}}
        @keyframes slideIn{from{transform:translateX(20px);opacity:0}to{transform:translateX(0);opacity:1}}
        .row:hover{background:#0d0d1a!important}
      `}</style>

      {/* TOAST */}
      {toast && (
        <div style={{ position: "fixed", top: 20, right: 20, zIndex: 2000, background: toast.type === "warn" ? "#ef444422" : "#22c55e22", border: `1px solid ${toast.type === "warn" ? "#ef444444" : "#22c55e44"}`, borderRadius: 14, padding: "12px 20px", fontSize: 14, fontWeight: 700, animation: "slideIn .3s ease", backdropFilter: "blur(10px)" }}>
          {toast.msg}
        </div>
      )}

      {/* SIDEBAR */}
      <div style={{ width: 210, background: "#07070e", borderRight: "1px solid #12121e", display: "flex", flexDirection: "column", padding: "18px 10px", flexShrink: 0 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10, padding: "4px 8px", marginBottom: 24 }}>
          <div style={{ width: 32, height: 32, borderRadius: 9, background: "linear-gradient(135deg,#ec4899,#f97316)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 16 }}>👗</div>
          <div>
            <div style={{ fontWeight: 900, fontSize: 14, letterSpacing: -0.5 }}>NOVAModa</div>
            <div style={{ color: "#ec489877", fontSize: 9, letterSpacing: 2, fontWeight: 700 }}>OPERACIONES</div>
          </div>
        </div>
        <div style={{ flex: 1, display: "flex", flexDirection: "column", gap: 3 }}>
          {tabs.map(t => (
            <button key={t.id} onClick={() => setTab(t.id)} style={{ background: tab === t.id ? "#ec489912" : "transparent", border: `1px solid ${tab === t.id ? "#ec489933" : "transparent"}`, borderRadius: 10, padding: "10px 12px", display: "flex", alignItems: "center", gap: 9, cursor: "pointer", transition: "all .2s" }}>
              <span style={{ fontSize: 15 }}>{t.icon}</span>
              <span style={{ color: tab === t.id ? "#ec4899" : "#444", fontWeight: tab === t.id ? 700 : 500, fontSize: 12, fontFamily: "'DM Sans',sans-serif" }}>{t.label}</span>
            </button>
          ))}
        </div>
        <div style={{ background: "#22c55e0d", border: "1px solid #22c55e22", borderRadius: 12, padding: "14px 12px" }}>
          <div style={{ color: "#22c55e", fontSize: 9, fontWeight: 700, textTransform: "uppercase", letterSpacing: 2, marginBottom: 6 }}>Ganancia neta</div>
          <div style={{ color: "#22c55e", fontWeight: 900, fontSize: 20, letterSpacing: -0.5 }}>{COP(ganancia)}</div>
          <div style={{ color: "#333", fontSize: 9, marginTop: 2 }}>este mes</div>
        </div>
      </div>

      {/* MAIN */}
      <div style={{ flex: 1, overflow: "auto", padding: 24 }}>

        {/* ─── DASHBOARD ─── */}
        {tab === "dashboard" && (
          <div style={{ animation: "fadeUp .3s ease" }}>
            <div style={{ marginBottom: 24 }}>
              <div style={{ color: "#ec4899", fontSize: 10, fontWeight: 700, letterSpacing: 3, textTransform: "uppercase", marginBottom: 4 }}>Resumen del negocio</div>
              <h1 style={{ fontSize: 26, fontWeight: 900, letterSpacing: -0.5 }}>Dashboard NOVAModa 👗</h1>
            </div>

            {/* KPIs */}
            <div style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 12, marginBottom: 20 }}>
              {[
                { l: "Ingresos del mes", v: COP(ingreso), sub: `${active.length} clientes activos`, c: "#ec4899", e: "💰" },
                { l: "Costo API real", v: COP(costoApi), sub: `${clients.length} × $8.000`, c: "#ef4444", e: "⚡" },
                { l: "Ganancia neta", v: COP(ganancia), sub: `Margen ${ingreso ? Math.round(ganancia / ingreso * 100) : 0}%`, c: "#22c55e", e: "📈" },
                { l: "Cobros vencidos", v: overdue.length, sub: overdue.length ? "Requieren atención" : "Todo al día", c: overdue.length ? "#ef4444" : "#22c55e", e: overdue.length ? "🚨" : "✅" },
              ].map(k => (
                <div key={k.l} style={{ background: "#0a0a14", border: `1px solid ${k.c}18`, borderRadius: 16, padding: 20 }}>
                  <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 12 }}>
                    <span style={{ fontSize: 22 }}>{k.e}</span>
                    <div style={{ width: 7, height: 7, borderRadius: "50%", background: k.c, animation: "pulse 2s infinite" }} />
                  </div>
                  <div style={{ color: k.c, fontWeight: 900, fontSize: 22, letterSpacing: -0.5, marginBottom: 3 }}>{k.v}</div>
                  <div style={{ color: "#333", fontSize: 11 }}>{k.l}</div>
                  <div style={{ color: "#222", fontSize: 10, marginTop: 2 }}>{k.sub}</div>
                </div>
              ))}
            </div>

            {/* Alertas */}
            {(overdue.length > 0 || proximos7.length > 0) && (
              <div style={{ marginBottom: 20, display: "flex", flexDirection: "column", gap: 8 }}>
                {overdue.map(c => (
                  <div key={c.id} style={{ background: "#ef444410", border: "1px solid #ef444433", borderRadius: 14, padding: "14px 18px", display: "flex", alignItems: "center", gap: 12 }}>
                    <span style={{ fontSize: 20 }}>🚨</span>
                    <div style={{ flex: 1 }}>
                      <span style={{ color: "#ef4444", fontWeight: 800, fontSize: 13 }}>{c.name}</span>
                      <span style={{ color: "#666", fontSize: 13 }}> — pago vencido el {fmtDate(c.nextPayment)} · {COP(c.price)}</span>
                    </div>
                    <button onClick={() => { setSelected(c); setCobroType("vencido"); setTab("mensajes"); }} style={{ background: "#ef444422", border: "1px solid #ef444444", color: "#ef4444", borderRadius: 8, padding: "6px 14px", cursor: "pointer", fontSize: 12, fontWeight: 700, fontFamily: "'DM Sans',sans-serif" }}>
                      Enviar cobro →
                    </button>
                  </div>
                ))}
                {proximos7.filter(c => c.status !== "overdue").map(c => (
                  <div key={c.id} style={{ background: "#f59e0b10", border: "1px solid #f59e0b33", borderRadius: 14, padding: "14px 18px", display: "flex", alignItems: "center", gap: 12 }}>
                    <span style={{ fontSize: 20 }}>⏰</span>
                    <div style={{ flex: 1 }}>
                      <span style={{ color: "#f59e0b", fontWeight: 800, fontSize: 13 }}>{c.name}</span>
                      <span style={{ color: "#666", fontSize: 13 }}> — pago en {daysLeft(c.nextPayment)} días · {COP(c.price)}</span>
                    </div>
                    <button onClick={() => { setSelected(c); setCobroType("recordatorio"); setTab("mensajes"); }} style={{ background: "#f59e0b22", border: "1px solid #f59e0b44", color: "#f59e0b", borderRadius: 8, padding: "6px 14px", cursor: "pointer", fontSize: 12, fontWeight: 700, fontFamily: "'DM Sans',sans-serif" }}>
                      Recordatorio →
                    </button>
                  </div>
                ))}
              </div>
            )}

            {/* Lista clientes */}
            <div style={{ background: "#0a0a14", border: "1px solid #12121e", borderRadius: 18, overflow: "hidden" }}>
              <div style={{ padding: "16px 20px", borderBottom: "1px solid #12121e", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                <div style={{ fontWeight: 800, fontSize: 14 }}>Clientes ({clients.length})</div>
                <button onClick={() => setModal("new")} style={{ background: "linear-gradient(135deg,#ec4899,#f97316)", border: "none", color: "#fff", borderRadius: 10, padding: "7px 16px", cursor: "pointer", fontSize: 12, fontWeight: 800, fontFamily: "'DM Sans',sans-serif" }}>+ Nuevo</button>
              </div>
              {clients.map(c => (
                <div key={c.id} className="row" style={{ padding: "13px 20px", borderBottom: "1px solid #0a0a14", display: "flex", alignItems: "center", gap: 12, cursor: "pointer", transition: "background .2s" }} onClick={() => { setSelected(c); setModal("edit"); }}>
                  <div style={{ width: 36, height: 36, borderRadius: 10, background: `${c.color}18`, border: `1px solid ${c.color}44`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 16, flexShrink: 0 }}>👗</div>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontWeight: 700, fontSize: 13 }}>{c.name}</div>
                    <div style={{ color: "#444", fontSize: 11, marginTop: 1 }}>{c.city} · {c.owner}</div>
                  </div>
                  <div style={{ textAlign: "right" }}>
                    <div style={{ color: "#22c55e", fontWeight: 800, fontSize: 13 }}>{COP(c.price)}/mes</div>
                    <div style={{ color: "#333", fontSize: 10 }}>próx: {fmtDate(c.nextPayment)}</div>
                  </div>
                  <div style={{ background: `${statusColor[c.status]}18`, border: `1px solid ${statusColor[c.status]}33`, borderRadius: 20, padding: "3px 10px", fontSize: 10, color: statusColor[c.status], fontWeight: 700, flexShrink: 0 }}>
                    {statusLabel[c.status]}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ─── CLIENTES ─── */}
        {tab === "clientes" && (
          <div style={{ animation: "fadeUp .3s ease" }}>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 22 }}>
              <div>
                <div style={{ color: "#ec4899", fontSize: 10, fontWeight: 700, letterSpacing: 3, textTransform: "uppercase", marginBottom: 4 }}>Gestión</div>
                <h2 style={{ fontSize: 24, fontWeight: 900, letterSpacing: -0.5 }}>Mis clientes ({clients.length})</h2>
              </div>
              <button onClick={() => setModal("new")} style={{ background: "linear-gradient(135deg,#ec4899,#f97316)", border: "none", color: "#fff", borderRadius: 12, padding: "11px 22px", cursor: "pointer", fontSize: 14, fontWeight: 800, fontFamily: "'DM Sans',sans-serif" }}>+ Agregar cliente</button>
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
              {clients.map(c => (
                <div key={c.id} style={{ background: "#0a0a14", border: `1px solid ${c.status === "overdue" ? "#ef444433" : c.color + "22"}`, borderRadius: 16, padding: "18px 20px", display: "flex", alignItems: "center", gap: 14 }}>
                  <div style={{ width: 46, height: 46, borderRadius: 13, background: `${c.color}18`, border: `1px solid ${c.color}44`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 22, flexShrink: 0 }}>👗</div>
                  <div style={{ flex: 1 }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 4 }}>
                      <span style={{ fontWeight: 800, fontSize: 15 }}>{c.name}</span>
                      <span style={{ background: `${planColor[c.plan]}18`, border: `1px solid ${planColor[c.plan]}33`, color: planColor[c.plan], borderRadius: 20, padding: "2px 9px", fontSize: 10, fontWeight: 700 }}>{planLabel[c.plan]}</span>
                      <span style={{ background: `${statusColor[c.status]}18`, border: `1px solid ${statusColor[c.status]}33`, color: statusColor[c.status], borderRadius: 20, padding: "2px 9px", fontSize: 10, fontWeight: 700 }}>{statusLabel[c.status]}</span>
                    </div>
                    <div style={{ color: "#444", fontSize: 12 }}>{c.owner} · {c.city} · {c.paymentMethod} · {c.paidMonths} mes{c.paidMonths !== 1 ? "es" : ""} pagado{c.paidMonths !== 1 ? "s" : ""}</div>
                    {c.notes && <div style={{ color: "#333", fontSize: 11, marginTop: 4, fontStyle: "italic" }}>📝 {c.notes}</div>}
                  </div>
                  <div style={{ textAlign: "right", marginRight: 12 }}>
                    <div style={{ color: "#22c55e", fontWeight: 900, fontSize: 16 }}>{COP(c.price)}</div>
                    <div style={{ color: "#333", fontSize: 11 }}>próx: {fmtDate(c.nextPayment)}</div>
                    <div style={{ color: daysLeft(c.nextPayment) < 0 ? "#ef4444" : daysLeft(c.nextPayment) <= 7 ? "#f59e0b" : "#333", fontSize: 11, fontWeight: 700 }}>
                      {daysLeft(c.nextPayment) < 0 ? `Vencido hace ${Math.abs(daysLeft(c.nextPayment))} días` : `En ${daysLeft(c.nextPayment)} días`}
                    </div>
                  </div>
                  <div style={{ display: "flex", gap: 6, flexShrink: 0 }}>
                    <button onClick={() => { setSelected(c); setModal("recibo"); }} title="Generar recibo" style={{ background: "#22c55e18", border: "1px solid #22c55e33", color: "#22c55e", borderRadius: 9, width: 34, height: 34, cursor: "pointer", fontSize: 14 }}>🧾</button>
                    <button onClick={() => markPaid(c.id)} title="Registrar pago" style={{ background: "#ec489918", border: "1px solid #ec489933", color: "#ec4899", borderRadius: 9, width: 34, height: 34, cursor: "pointer", fontSize: 14 }}>✅</button>
                    <button onClick={() => { setSelected(c); setModal("edit"); }} title="Editar" style={{ background: "#ffffff0a", border: "1px solid #1e1e2e", color: "#666", borderRadius: 9, width: 34, height: 34, cursor: "pointer", fontSize: 13 }}>✏️</button>
                    <button onClick={() => deleteClient(c.id)} title="Eliminar" style={{ background: "#ef444412", border: "1px solid #ef444433", color: "#ef4444", borderRadius: 9, width: 34, height: 34, cursor: "pointer", fontSize: 13 }}>🗑</button>
                  </div>
                </div>
              ))}
              {clients.length === 0 && (
                <div style={{ textAlign: "center", padding: 60, color: "#333" }}>
                  <div style={{ fontSize: 40, marginBottom: 12 }}>👗</div>
                  <div style={{ fontSize: 16, fontWeight: 700, marginBottom: 8 }}>Aún no tienes clientes</div>
                  <button onClick={() => setModal("new")} style={{ background: "linear-gradient(135deg,#ec4899,#f97316)", border: "none", color: "#fff", borderRadius: 12, padding: "11px 24px", cursor: "pointer", fontSize: 14, fontWeight: 800, fontFamily: "'DM Sans',sans-serif" }}>Agregar primer cliente</button>
                </div>
              )}
            </div>
          </div>
        )}

        {/* ─── COBROS ─── */}
        {tab === "cobros" && (
          <div style={{ animation: "fadeUp .3s ease" }}>
            <div style={{ marginBottom: 22 }}>
              <div style={{ color: "#ec4899", fontSize: 10, fontWeight: 700, letterSpacing: 3, textTransform: "uppercase", marginBottom: 4 }}>Finanzas</div>
              <h2 style={{ fontSize: 24, fontWeight: 900, letterSpacing: -0.5 }}>Control de cobros 💳</h2>
            </div>

            {/* Resumen financiero */}
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14, marginBottom: 20 }}>
              <div style={{ background: "#0a0a14", border: "1px solid #22c55e22", borderRadius: 16, padding: 22 }}>
                <div style={{ color: "#22c55e", fontSize: 10, fontWeight: 700, textTransform: "uppercase", letterSpacing: 2, marginBottom: 14 }}>Estado de cuenta este mes</div>
                {[
                  { l: "Clientes activos", v: active.length, c: "#22c55e" },
                  { l: "Ingresos brutos", v: COP(ingreso), c: "#22c55e" },
                  { l: "Costo API Anthropic", v: `- ${COP(costoApi)}`, c: "#ef4444" },
                  { l: "Ganancia neta", v: COP(ganancia), c: "#f59e0b" },
                  { l: "Margen", v: `${ingreso ? Math.round(ganancia / ingreso * 100) : 0}%`, c: "#f59e0b" },
                ].map(r => (
                  <div key={r.l} style={{ display: "flex", justifyContent: "space-between", padding: "8px 0", borderBottom: "1px solid #0d0d18", fontSize: 13 }}>
                    <span style={{ color: "#555" }}>{r.l}</span>
                    <span style={{ color: r.c, fontWeight: 800 }}>{r.v}</span>
                  </div>
                ))}
              </div>
              <div style={{ background: "#0a0a14", border: "1px solid #1a1a2a", borderRadius: 16, padding: 22 }}>
                <div style={{ color: "#f59e0b", fontSize: 10, fontWeight: 700, textTransform: "uppercase", letterSpacing: 2, marginBottom: 14 }}>Próximos cobros (30 días)</div>
                {clients.filter(c => daysLeft(c.nextPayment) <= 30 && daysLeft(c.nextPayment) >= -5).sort((a, b) => new Date(a.nextPayment) - new Date(b.nextPayment)).map(c => (
                  <div key={c.id} style={{ display: "flex", alignItems: "center", gap: 10, padding: "8px 0", borderBottom: "1px solid #0d0d18" }}>
                    <div style={{ flex: 1 }}>
                      <div style={{ fontWeight: 700, fontSize: 13 }}>{c.name}</div>
                      <div style={{ color: "#444", fontSize: 11 }}>{fmtDate(c.nextPayment)} · {c.paymentMethod}</div>
                    </div>
                    <div style={{ color: daysLeft(c.nextPayment) < 0 ? "#ef4444" : daysLeft(c.nextPayment) <= 3 ? "#f59e0b" : "#22c55e", fontWeight: 800, fontSize: 13 }}>{COP(c.price)}</div>
                    <button onClick={() => markPaid(c.id)} style={{ background: "#22c55e18", border: "1px solid #22c55e33", color: "#22c55e", borderRadius: 8, padding: "4px 10px", cursor: "pointer", fontSize: 11, fontWeight: 700, fontFamily: "'DM Sans',sans-serif" }}>Pago ✓</button>
                  </div>
                ))}
              </div>
            </div>

            {/* Tabla completa */}
            <div style={{ background: "#0a0a14", border: "1px solid #1a1a2a", borderRadius: 16, overflow: "hidden" }}>
              <div style={{ padding: "14px 20px", borderBottom: "1px solid #1a1a2a", fontWeight: 800, fontSize: 14 }}>Todos los cobros</div>
              <table style={{ width: "100%", borderCollapse: "collapse" }}>
                <thead>
                  <tr style={{ background: "#070710" }}>
                    {["Cliente","Plan","Precio/mes","Método pago","Próximo cobro","Días","Estado","Acciones"].map(h => (
                      <th key={h} style={{ padding: "10px 14px", textAlign: "left", color: "#333", fontSize: 11, fontFamily: "'DM Sans',sans-serif", fontWeight: 700, textTransform: "uppercase", letterSpacing: 1 }}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {clients.map(c => {
                    const dl = daysLeft(c.nextPayment);
                    return (
                      <tr key={c.id} className="row" style={{ borderTop: "1px solid #0d0d18", transition: "background .2s" }}>
                        <td style={{ padding: "11px 14px", fontWeight: 700, fontSize: 13 }}>{c.name}</td>
                        <td style={{ padding: "11px 14px" }}><span style={{ color: planColor[c.plan], fontWeight: 700, fontSize: 12 }}>{planLabel[c.plan]}</span></td>
                        <td style={{ padding: "11px 14px", color: "#22c55e", fontWeight: 800, fontSize: 13 }}>{COP(c.price)}</td>
                        <td style={{ padding: "11px 14px", color: "#666", fontSize: 12 }}>{c.paymentMethod}</td>
                        <td style={{ padding: "11px 14px", color: "#888", fontSize: 12 }}>{fmtDate(c.nextPayment)}</td>
                        <td style={{ padding: "11px 14px", fontWeight: 700, fontSize: 12, color: dl < 0 ? "#ef4444" : dl <= 7 ? "#f59e0b" : "#22c55e" }}>
                          {dl < 0 ? `−${Math.abs(dl)}d` : `${dl}d`}
                        </td>
                        <td style={{ padding: "11px 14px" }}><span style={{ background: `${statusColor[c.status]}18`, color: statusColor[c.status], borderRadius: 20, padding: "3px 9px", fontSize: 10, fontWeight: 700 }}>{statusLabel[c.status]}</span></td>
                        <td style={{ padding: "11px 14px", display: "flex", gap: 6 }}>
                          <button onClick={() => markPaid(c.id)} style={{ background: "#22c55e18", border: "1px solid #22c55e33", color: "#22c55e", borderRadius: 7, padding: "5px 10px", cursor: "pointer", fontSize: 11, fontWeight: 700, fontFamily: "'DM Sans',sans-serif" }}>✓ Pagó</button>
                          <button onClick={() => { setSelected(c); setModal("recibo"); }} style={{ background: "#ec489918", border: "1px solid #ec489933", color: "#ec4899", borderRadius: 7, padding: "5px 10px", cursor: "pointer", fontSize: 11, fontWeight: 700, fontFamily: "'DM Sans',sans-serif" }}>Recibo</button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* ─── MENSAJES DE COBRO ─── */}
        {tab === "mensajes" && (
          <div style={{ animation: "fadeUp .3s ease" }}>
            <div style={{ marginBottom: 22 }}>
              <div style={{ color: "#ec4899", fontSize: 10, fontWeight: 700, letterSpacing: 3, textTransform: "uppercase", marginBottom: 4 }}>Comunicación</div>
              <h2 style={{ fontSize: 24, fontWeight: 900, letterSpacing: -0.5 }}>Mensajes de cobro 💬</h2>
              <p style={{ color: "#444", fontSize: 14, marginTop: 4 }}>Selecciona un cliente y el tipo de mensaje para generar el texto listo para WhatsApp</p>
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "260px 1fr", gap: 16 }}>
              {/* Selector cliente */}
              <div>
                <div style={{ color: "#555", fontSize: 10, textTransform: "uppercase", letterSpacing: 2, marginBottom: 10 }}>Seleccionar cliente</div>
                <div style={{ display: "flex", flexDirection: "column", gap: 6, marginBottom: 16 }}>
                  {clients.map(c => (
                    <button key={c.id} onClick={() => setSelected(c)} style={{ background: selected?.id === c.id ? `${c.color}18` : "transparent", border: `1px solid ${selected?.id === c.id ? c.color + "55" : "#1a1a2a"}`, borderRadius: 12, padding: "11px 14px", cursor: "pointer", textAlign: "left", transition: "all .2s" }}>
                      <div style={{ color: selected?.id === c.id ? c.color : "#666", fontWeight: selected?.id === c.id ? 700 : 500, fontSize: 13, fontFamily: "'DM Sans',sans-serif" }}>{c.name}</div>
                      <div style={{ color: "#333", fontSize: 11, marginTop: 2 }}>{c.city} · {statusLabel[c.status]}</div>
                    </button>
                  ))}
                </div>
                <div style={{ color: "#555", fontSize: 10, textTransform: "uppercase", letterSpacing: 2, marginBottom: 10 }}>Tipo de mensaje</div>
                {[
                  { id: "recordatorio", l: "Recordatorio de pago", e: "⏰", c: "#f59e0b" },
                  { id: "vencido", l: "Pago vencido", e: "🚨", c: "#ef4444" },
                  { id: "gracias", l: "Confirmar pago recibido", e: "✅", c: "#22c55e" },
                  { id: "pausa", l: "Pausa de servicio", e: "⏸", c: "#6b7280" },
                ].map(m => (
                  <button key={m.id} onClick={() => setCobroType(m.id)} style={{ width: "100%", background: cobroType === m.id ? `${m.c}18` : "transparent", border: `1px solid ${cobroType === m.id ? m.c + "44" : "#1a1a2a"}`, borderRadius: 10, padding: "10px 12px", cursor: "pointer", display: "flex", alignItems: "center", gap: 8, marginBottom: 5, transition: "all .2s" }}>
                    <span style={{ fontSize: 16 }}>{m.e}</span>
                    <span style={{ color: cobroType === m.id ? m.c : "#555", fontWeight: cobroType === m.id ? 700 : 500, fontSize: 12, fontFamily: "'DM Sans',sans-serif" }}>{m.l}</span>
                  </button>
                ))}
              </div>

              {/* Mensaje generado */}
              <div style={{ background: "#0a0a14", border: "1px solid #1a1a2a", borderRadius: 16, padding: 24, display: "flex", flexDirection: "column" }}>
                {selected ? (
                  <>
                    <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 18, paddingBottom: 14, borderBottom: "1px solid #1a1a2a" }}>
                      <div style={{ width: 38, height: 38, borderRadius: 10, background: `${selected.color}18`, border: `1px solid ${selected.color}44`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 18 }}>👗</div>
                      <div>
                        <div style={{ fontWeight: 800, fontSize: 14 }}>{selected.name}</div>
                        <div style={{ color: "#444", fontSize: 12 }}>{selected.paymentMethod} · {COP(selected.price)}/mes</div>
                      </div>
                    </div>
                    <pre style={{ flex: 1, color: "#ccc", fontSize: 13, lineHeight: 1.85, whiteSpace: "pre-wrap", fontFamily: "'DM Sans',sans-serif", marginBottom: 18 }}>
                      {COBRO_MSGS[cobroType](selected)}
                    </pre>
                    <div style={{ display: "flex", gap: 10 }}>
                      <button onClick={() => copy(COBRO_MSGS[cobroType](selected), "msg")} style={{ flex: 1, background: copiedMsg === "msg" ? "linear-gradient(135deg,#22c55e,#16a34a)" : "linear-gradient(135deg,#ec4899,#f97316)", border: "none", color: "#fff", borderRadius: 12, padding: "12px", cursor: "pointer", fontSize: 14, fontWeight: 800, fontFamily: "'DM Sans',sans-serif" }}>
                        {copiedMsg === "msg" ? "✅ ¡Copiado! Pégalo en WhatsApp" : "📋 Copiar mensaje"}
                      </button>
                      {cobroType === "gracias" && (
                        <button onClick={() => markPaid(selected.id)} style={{ background: "#22c55e18", border: "1px solid #22c55e44", color: "#22c55e", borderRadius: 12, padding: "12px 20px", cursor: "pointer", fontSize: 13, fontWeight: 700, fontFamily: "'DM Sans',sans-serif" }}>
                          ✓ Marcar como pagado
                        </button>
                      )}
                    </div>
                  </>
                ) : (
                  <div style={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "center", color: "#333", flexDirection: "column", gap: 10 }}>
                    <span style={{ fontSize: 36 }}>👈</span>
                    <span style={{ fontSize: 14 }}>Selecciona un cliente para generar el mensaje</span>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* ─── MANTENIMIENTO ─── */}
        {tab === "mantenimiento" && (
          <div style={{ animation: "fadeUp .3s ease" }}>
            <div style={{ marginBottom: 22 }}>
              <div style={{ color: "#ec4899", fontSize: 10, fontWeight: 700, letterSpacing: 3, textTransform: "uppercase", marginBottom: 4 }}>Técnico</div>
              <h2 style={{ fontSize: 24, fontWeight: 900, letterSpacing: -0.5 }}>Mantenimiento del servicio 🔧</h2>
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
              {[
                {
                  t: "Actualizar catálogo de productos", icon: "🛍️", freq: "Cuando el cliente pida", tiempo: "15-30 min", color: "#ec4899",
                  pasos: ["El cliente te envía los nuevos productos por WhatsApp", "Abres el panel admin (novabot-admin) y buscas al cliente", "Haz clic en editar → actualiza productos, precios, tallas y colores", "Guarda los cambios → el bot empieza a usar el catálogo nuevo de inmediato", "Confirma al cliente que ya está actualizado con el mensaje: 'Listo! Tu NOVA ya tiene el catálogo actualizado ✅'"]
                },
                {
                  t: "Cambiar promociones activas", icon: "🎁", freq: "Semanal o cuando el cliente pida", tiempo: "5 min", color: "#f97316",
                  pasos: ["El cliente te dice la nueva promo (ej: '30% en vestidos este fin de semana')", "Abres el panel admin → editar cliente → campo 'Promoción activa'", "Actualizas el texto de la promo y guardas", "NOVA empieza a mencionar la promo nueva en todas las conversaciones", "Avisa al cliente que ya está activa"]
                },
                {
                  t: "Monitorear calidad del bot", icon: "📊", freq: "Cada 2 semanas", tiempo: "20 min", color: "#3b82f6",
                  pasos: ["Abre la demo del cliente en modo prueba", "Haz 5-10 preguntas típicas como si fueras una clienta", "Verifica que responde bien tallas, precios y promos", "Si algo está mal, revisa el prompt y el catálogo", "Documenta cualquier error para mejorar el sistema"]
                },
                {
                  t: "Renovar créditos de API Anthropic", icon: "⚡", freq: "Mensual o cuando se agoten", tiempo: "5 min", color: "#f59e0b",
                  pasos: ["Entra a console.anthropic.com con tu cuenta", "Ve a Settings → Billing → Usage para ver cuánto llevas gastado", "Si los créditos bajan de $5 USD, recarga otros $10-20 USD", "Con 10 clientes activos gastas aproximadamente $8-15 USD al mes", "Configura recarga automática en Billing → Auto-reload para no quedarte sin créditos"]
                },
                {
                  t: "Gestionar clientes que quieren cancelar", icon: "💔", freq: "Cuando ocurra", tiempo: "15 min", color: "#6b7280",
                  pasos: ["Escucha la razón sin ponerte a la defensiva", "Si es precio: ofrece 1 mes gratis o baja temporalmente al plan básico", "Si es resultados: revisa con él los números reales de ventas cerradas", "Si insiste: pausa (no canceles) el servicio con el mensaje de pausa del sistema", "Haz seguimiento en 30 días: muchos vuelven cuando sienten la diferencia"]
                },
                {
                  t: "Onboarding de nuevo cliente", icon: "🚀", freq: "Cada vez que entra uno nuevo", tiempo: "1-2 horas", color: "#22c55e",
                  pasos: ["Recibe el pago primero (Nequi/Daviplata) antes de configurar", "Pide por WhatsApp: nombre, productos+precios, promos, tono, redes sociales", "Abre el panel admin → Nuevo cliente → ingresa toda la información", "Prueba el bot 10 veces con preguntas típicas del negocio", "Envía la URL del bot al cliente con el mensaje: '¡Tu NOVA está lista! Pruébala escribiéndole como una clienta 👗✨'"]
                },
              ].map(item => (
                <div key={item.t} style={{ background: "#0a0a14", border: `1px solid ${item.color}22`, borderRadius: 16, padding: 22 }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 14 }}>
                    <span style={{ fontSize: 24 }}>{item.icon}</span>
                    <div>
                      <div style={{ fontWeight: 800, fontSize: 14 }}>{item.t}</div>
                      <div style={{ color: "#444", fontSize: 11, marginTop: 2 }}>Frecuencia: {item.freq} · Tiempo: {item.tiempo}</div>
                    </div>
                  </div>
                  <div style={{ display: "flex", flexDirection: "column", gap: 7 }}>
                    {item.pasos.map((p, i) => (
                      <div key={i} style={{ display: "flex", gap: 10, alignItems: "flex-start" }}>
                        <div style={{ width: 20, height: 20, borderRadius: "50%", background: `${item.color}22`, border: `1px solid ${item.color}44`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 10, color: item.color, fontWeight: 900, flexShrink: 0, marginTop: 1 }}>{i + 1}</div>
                        <span style={{ color: "#666", fontSize: 12, lineHeight: 1.6 }}>{p}</span>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ─── GUÍA OPERACIÓN ─── */}
        {tab === "guia" && (
          <div style={{ animation: "fadeUp .3s ease", maxWidth: 720 }}>
            <div style={{ marginBottom: 22 }}>
              <div style={{ color: "#ec4899", fontSize: 10, fontWeight: 700, letterSpacing: 3, textTransform: "uppercase", marginBottom: 4 }}>Manual</div>
              <h2 style={{ fontSize: 24, fontWeight: 900, letterSpacing: -0.5 }}>Guía completa de operación 📋</h2>
            </div>

            {[
              {
                t: "Cómo cobrar mensualmente", icon: "💳", color: "#22c55e",
                content: [
                  { sub: "Cuándo cobrar", txt: "Cobra el mismo día que el cliente activó el servicio, cada mes. Si entró el 15 de mayo, cobras el 15 de junio." },
                  { sub: "Mensaje de recordatorio (3 días antes)", txt: "Ve a la sección 'Mensajes de cobro' → selecciona el cliente → tipo 'Recordatorio'. Copia y pega en WhatsApp." },
                  { sub: "Si no paga en la fecha", txt: "Espera 3 días hábiles. Luego envía el mensaje de 'Pago vencido'. Si pasan 10 días sin pago, pausa el bot temporalmente." },
                  { sub: "Cuando pague", txt: "Haz clic en '✓ Pagó' para actualizar la fecha al próximo mes. Luego envía el mensaje de confirmación de pago." },
                  { sub: "Métodos de cobro recomendados", txt: "Nequi y Daviplata son los más usados. Para clientes que quieren factura, usa transferencia bancaria y lleva un registro en este sistema." },
                ]
              },
              {
                t: "Cuánto cuesta operar (tus gastos reales)", icon: "💰", color: "#f59e0b",
                content: [
                  { sub: "API Anthropic", txt: "Aproximadamente $8.000 COP por cliente al mes (con uso normal de 500-1.000 mensajes). Con 10 clientes: $80.000/mes. Recarga en console.anthropic.com cuando quedes con menos de $5 USD de saldo." },
                  { sub: "Hosting Vercel", txt: "GRATIS para siempre en el plan hobby. Solo pagas si tienes más de 100 usuarios simultáneos, que es cuando ya tienes 200+ clientes activos." },
                  { sub: "Dominio (opcional)", txt: "$35.000 COP al año en NIC.co (dominio .co). No es urgente, arrancan muchos sin él." },
                  { sub: "WhatsApp API (cuando escales)", txt: "$25.000-$60.000 COP/mes por cliente. Inclúyelo en el precio del plan o cóbralo aparte como 'módulo WhatsApp'." },
                  { sub: "Tu tiempo", txt: "Onboarding de cliente nuevo: 1-2 horas. Mantenimiento mensual por cliente: 30 min. Con 20 clientes: ~15 horas al mes de trabajo total." },
                ]
              },
              {
                t: "Cómo crecer de 5 a 40 clientes", icon: "📈", color: "#3b82f6",
                content: [
                  { sub: "Semana 1-2: Resultados reales", txt: "Con tus primeros 2-3 clientes, documenta TODO: cuántas ventas cerró NOVA, cuántos mensajes respondió, cuánto tiempo les ahorró. Pide captura de pantalla de conversaciones exitosas (con permiso)." },
                  { sub: "Semana 3-4: Contenido en redes", txt: "Crea una cuenta de Instagram como '@novamoda.co' o similar. Publica los resultados reales de tus clientes (con nombres si te dejan, o anónimos). 1 post al día es suficiente para empezar." },
                  { sub: "Mes 2: Referidos activos", txt: "Cada cliente satisfecho puede traerte 2-3 más. Ofrécele 1 mes gratis por cada referido que active. Es tu canal más rentable y de más confianza." },
                  { sub: "Mes 3: Publicidad pagada", txt: "Invierte $50.000-$100.000 COP/día en Instagram Ads. Crea un anuncio con video mostrando NOVA respondiendo a una clienta. Target: dueñas de tiendas de ropa en Colombia." },
                  { sub: "Mes 4+: Alianzas estratégicas", txt: "Busca alianzas con contadores, diseñadores de redes sociales o agencias de marketing que ya tengan clientes boutiques. Ofréceles comisión del 20% por referidos." },
                ]
              },
              {
                t: "Qué hacer cuando algo falla", icon: "🔧", color: "#ef4444",
                content: [
                  { sub: "El bot responde mal o no responde", txt: "1. Verifica que tienes saldo en Anthropic (console.anthropic.com → Billing). 2. Revisa que el catálogo del cliente esté bien escrito. 3. Prueba el bot tú mismo. Si el problema persiste, contacta soporte de Anthropic." },
                  { sub: "La app no carga (error en Vercel)", txt: "Ve a vercel.com → tu proyecto → Deployments → mira los logs de error. El 80% de errores son de código. El 20% son de API Key mal configurada." },
                  { sub: "Un cliente se queja de respuestas del bot", txt: "Primero pide capturas de pantalla de las respuestas malas. Revisa el prompt y el catálogo. Actualiza la información incorrecta. Ofrece 3-5 días gratis como compensación por el inconveniente." },
                  { sub: "Perdiste la API Key de Anthropic", txt: "Ve a console.anthropic.com → API Keys → crea una nueva. Actualiza la variable de entorno en Vercel → Settings → Environment Variables. El nuevo deploy toma 2 minutos." },
                  { sub: "Un cliente no paga y no responde", txt: "Después de 15 días sin pago y sin respuesta, pausa el bot. Envía un último mensaje avisando que el servicio está pausado. Si en 30 días no hay respuesta, libera ese espacio para otro cliente." },
                ]
              },
            ].map(s => (
              <GuideSectionCard key={s.t} section={s} />
            ))}
          </div>
        )}
      </div>

      {/* MODALS */}
      {modal === "new" && <ClientModal client={null} onSave={saveClient} onClose={() => setModal(null)} />}
      {modal === "edit" && selected && <ClientModal client={selected} onSave={saveClient} onClose={() => setModal(null)} />}
      {modal === "recibo" && selected && <Recibo client={selected} onClose={() => setModal(null)} />}
    </div>
  );
}

function GuideSectionCard({ section }) {
  const [open, setOpen] = useState(false);
  return (
    <div style={{ background: "#0a0a14", border: `1px solid ${open ? section.color + "44" : "#1a1a2a"}`, borderRadius: 16, overflow: "hidden", marginBottom: 10, transition: "all .2s" }}>
      <div onClick={() => setOpen(o => !o)} style={{ padding: "18px 22px", display: "flex", alignItems: "center", gap: 12, cursor: "pointer" }}>
        <span style={{ fontSize: 22 }}>{section.icon}</span>
        <div style={{ flex: 1, fontWeight: 800, fontSize: 15, fontFamily: "'DM Sans',sans-serif" }}>{section.t}</div>
        <span style={{ color: "#444", fontSize: 20, transition: "transform .2s", transform: open ? "rotate(90deg)" : "none" }}>›</span>
      </div>
      {open && (
        <div style={{ borderTop: "1px solid #1a1a2a", padding: "18px 22px", display: "flex", flexDirection: "column", gap: 14 }}>
          {section.content.map((c, i) => (
            <div key={i}>
              <div style={{ color: section.color, fontWeight: 800, fontSize: 13, marginBottom: 5 }}>{c.sub}</div>
              <div style={{ color: "#666", fontSize: 13, lineHeight: 1.75 }}>{c.txt}</div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
