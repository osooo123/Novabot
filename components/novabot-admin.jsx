import { useState, useRef, useEffect } from "react";

/* ══════════ STORAGE HELPERS ══════════ */
const STORAGE_KEY = "novabot_clients";

const defaultClients = [
  {
    id: "c1", name: "Fogón Paisa", owner: "Juan Camilo R.", phone: "3001234567",
    industry: "Restaurante", city: "Medellín", plan: "pro", status: "active",
    mensajes: 1240, limite: 99999, costoApi: 18600, ingresoMes: 790000,
    fechaInicio: "2025-01-15", bots: ["WhatsApp", "Instagram"],
    products: [
      { n: "Bandeja Paisa", p: 28000 }, { n: "Ajiaco", p: 22000 },
      { n: "Combo Ejecutivo", p: 18000 }, { n: "Picada Familiar", p: 65000 }
    ],
    promo: "2x1 en pedidos +$200.000 los martes",
    tone: "cálido y paisa",
    prompt_extra: "",
    ventas_cerradas: 89, color: "#f59e0b"
  },
  {
    id: "c2", name: "Élite Fashion CO", owner: "Valentina Torres", phone: "3109876543",
    industry: "Moda", city: "Bogotá", plan: "pro", status: "active",
    mensajes: 890, limite: 99999, costoApi: 13350, ingresoMes: 790000,
    fechaInicio: "2025-02-03", bots: ["WhatsApp", "Instagram", "Facebook"],
    products: [
      { n: "Vestido Midi", p: 189000 }, { n: "Blazer Oversize", p: 245000 },
      { n: "Set Accesorios", p: 89000 }, { n: "Bolso Vegano", p: 320000 }
    ],
    promo: "15% OFF primera compra código NOVA15",
    tone: "sofisticado y trendy",
    prompt_extra: "",
    ventas_cerradas: 67, color: "#ec4899"
  },
  {
    id: "c3", name: "Glam Studio", owner: "Daniela Ospina", phone: "3205551234",
    industry: "Belleza", city: "Cali", plan: "basico", status: "active",
    mensajes: 420, limite: 1000, costoApi: 6300, ingresoMes: 390000,
    fechaInicio: "2025-03-10", bots: ["WhatsApp"],
    products: [
      { n: "Corte + Cepillado", p: 85000 }, { n: "Tinte Completo", p: 220000 },
      { n: "Manicure Gel", p: 75000 }, { n: "Facial Premium", p: 120000 }
    ],
    promo: "20% lunes a miércoles",
    tone: "cariñoso y exclusivo",
    prompt_extra: "",
    ventas_cerradas: 34, color: "#a855f7"
  }
];

function loadClients() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : defaultClients;
  } catch { return defaultClients; }
}

function saveClients(clients) {
  try { localStorage.setItem(STORAGE_KEY, JSON.stringify(clients)); } catch {}
}

/* ══════════ FORMATO COP ══════════ */
const COP = (n) => `$${new Intl.NumberFormat("es-CO").format(n)}`;

/* ══════════ ELITE SALES PROMPT ══════════ */
const buildPrompt = (client) => `Eres NOVA, el mejor asesor de ventas de Colombia para el negocio "${client.name}" (${client.industry} en ${client.city}).

PRODUCTOS Y PRECIOS:
${client.products.map(p => `• ${p.n}: ${COP(p.p)} COP`).join("\n")}

PROMOCIÓN ACTIVA: ${client.promo}
TONO: ${client.tone}
${client.prompt_extra ? `INSTRUCCIONES ESPECIALES: ${client.prompt_extra}` : ""}

TÉCNICAS DE VENTA ÉLITE que debes aplicar:
1. BIENVENIDA CÁLIDA — conecta emocionalmente en los primeros 2 mensajes
2. DESCUBRIR NECESIDAD — haz 1 pregunta inteligente antes de ofrecer
3. PRESENTA BENEFICIOS — nunca características, siempre resultados y emociones
4. URGENCIA REAL — "hoy tenemos promo", "últimas unidades", "la oferta vence hoy"
5. PRUEBA SOCIAL — "otros clientes en ${client.city} ya lo tienen y les encantó"
6. MANEJO OBJECIONES — ante "muy caro": justifica valor + ofrece cuotas + compara costo de NO comprarlo
7. CIERRE ACTIVO — propón siempre el siguiente paso concreto
8. MÉTODOS DE PAGO — menciona Nequi, Daviplata, transferencia o contraentrega

REGLAS:
- Habla como colombiano culto: cálido, natural, profesional. Usa jerga suave ocasionalmente.
- Máximo 3-4 oraciones por respuesta para ritmo ágil de chat.
- Precios siempre en pesos colombianos (COP).
- Nunca digas que eres una IA a menos que te pregunten directamente.
- Si el cliente está listo, ve directo al cierre: nombre, dirección, método de pago.
- Cierra SIEMPRE con pregunta o llamada a la acción.`;

/* ══════════ COMPONENTE CHAT ══════════ */
function BotChat({ client, onClose }) {
  const [msgs, setMsgs] = useState([{
    role: "bot",
    text: `¡Hola! 👋 Bienvenido a *${client.name}*\n\nSoy NOVA, tu asesor personal. ¿En qué te puedo ayudar hoy? 😊`,
    time: new Date()
  }]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [history, setHistory] = useState([]);
  const endRef = useRef(null);

  useEffect(() => { endRef.current?.scrollIntoView({ behavior: "smooth" }); }, [msgs, loading]);

  const send = async () => {
    if (!input.trim() || loading) return;
    const txt = input.trim(); setInput("");
    setMsgs(p => [...p, { role: "user", text: txt, time: new Date() }]);
    setLoading(true);
    const h = [...history, { role: "user", content: txt }];
    try {
      const r = await fetch("https://api.anthropic.com/v1/messages", {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ model: "claude-sonnet-4-20250514", max_tokens: 1000, system: buildPrompt(client), messages: h })
      });
      const d = await r.json();
      const t = d.content?.[0]?.text || "Disculpa, intenta de nuevo.";
      setMsgs(p => [...p, { role: "bot", text: t, time: new Date() }]);
      setHistory([...h, { role: "assistant", content: t }]);
    } catch { setMsgs(p => [...p, { role: "bot", text: "⚠️ Error de conexión.", time: new Date() }]); }
    setLoading(false);
  };

  const fmt = t => t.replace(/\*(.*?)\*/g, "<b>$1</b>").replace(/\n/g, "<br>");

  return (
    <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,.85)", zIndex: 1000, display: "flex", alignItems: "center", justifyContent: "center", backdropFilter: "blur(8px)" }}>
      <div style={{ width: 420, height: 620, background: "#08080f", border: `1px solid ${client.color}44`, borderRadius: 24, display: "flex", flexDirection: "column", overflow: "hidden", boxShadow: `0 0 80px ${client.color}22` }}>
        <div style={{ background: `${client.color}15`, borderBottom: `1px solid ${client.color}33`, padding: "14px 18px", display: "flex", alignItems: "center", gap: 12 }}>
          <div style={{ width: 40, height: 40, borderRadius: "50%", background: `linear-gradient(135deg,${client.color},${client.color}88)`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 18, fontWeight: 900 }}>N</div>
          <div style={{ flex: 1 }}>
            <div style={{ fontWeight: 800, fontSize: 14, fontFamily: "'Outfit',sans-serif" }}>{client.name}</div>
            <div style={{ color: "#22c55e", fontSize: 11, display: "flex", alignItems: "center", gap: 4 }}>
              <span style={{ width: 6, height: 6, borderRadius: "50%", background: "#22c55e", display: "inline-block" }} /> NOVA activo
            </div>
          </div>
          <button onClick={onClose} style={{ background: "#ffffff11", border: "none", color: "#888", borderRadius: 8, width: 32, height: 32, cursor: "pointer", fontSize: 16 }}>✕</button>
        </div>

        <div style={{ flex: 1, overflowY: "auto", padding: "14px 12px", display: "flex", flexDirection: "column", gap: 8 }}>
          {msgs.map((m, i) => (
            <div key={i} style={{ display: "flex", justifyContent: m.role === "user" ? "flex-end" : "flex-start" }}>
              {m.role === "bot" && <div style={{ width: 26, height: 26, borderRadius: "50%", background: client.color, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 12, fontWeight: 900, flexShrink: 0, marginRight: 8, alignSelf: "flex-end", marginBottom: 16 }}>N</div>}
              <div style={{ maxWidth: "75%" }}>
                <div style={{ background: m.role === "user" ? `linear-gradient(135deg,${client.color},${client.color}cc)` : "#151520", color: "#fff", borderRadius: m.role === "user" ? "18px 18px 4px 18px" : "18px 18px 18px 4px", padding: "10px 14px", fontSize: 13, lineHeight: 1.6, border: m.role === "bot" ? `1px solid ${client.color}22` : "none", fontFamily: "'Outfit',sans-serif" }} dangerouslySetInnerHTML={{ __html: fmt(m.text) }} />
              </div>
            </div>
          ))}
          {loading && (
            <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
              <div style={{ width: 26, height: 26, borderRadius: "50%", background: client.color, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 12 }}>N</div>
              <div style={{ background: "#151520", border: `1px solid ${client.color}22`, borderRadius: "18px 18px 18px 4px", padding: "12px 16px", display: "flex", gap: 4 }}>
                {[0, 1, 2].map(i => <span key={i} style={{ width: 5, height: 5, borderRadius: "50%", background: client.color, display: "inline-block", animation: `bounce 1.2s infinite ${i * .2}s` }} />)}
              </div>
            </div>
          )}
          <div ref={endRef} />
        </div>

        <div style={{ padding: "10px 12px", background: "#0a0a14", borderTop: `1px solid ${client.color}22`, display: "flex", gap: 8 }}>
          <input value={input} onChange={e => setInput(e.target.value)} onKeyDown={e => e.key === "Enter" && send()} placeholder="Probar como cliente..."
            style={{ flex: 1, background: "#151520", border: `1px solid ${client.color}33`, borderRadius: 24, padding: "10px 16px", color: "#fff", fontSize: 13, outline: "none", fontFamily: "'Outfit',sans-serif" }} />
          <button onClick={send} style={{ width: 40, height: 40, borderRadius: "50%", background: `linear-gradient(135deg,${client.color},${client.color}cc)`, border: "none", cursor: "pointer", fontSize: 16 }}>➤</button>
        </div>
      </div>
    </div>
  );
}

/* ══════════ MODAL NUEVO CLIENTE ══════════ */
function ClientModal({ client, onSave, onClose }) {
  const isNew = !client.id;
  const [form, setForm] = useState(client.id ? { ...client } : {
    name: "", owner: "", phone: "", industry: "Restaurante", city: "Bogotá",
    plan: "pro", status: "active", bots: ["WhatsApp"],
    mensajes: 0, costoApi: 0, ingresoMes: 790000, ventas_cerradas: 0,
    fechaInicio: new Date().toISOString().split("T")[0],
    products: [{ n: "", p: "" }],
    promo: "", tone: "cálido y profesional", prompt_extra: "",
    color: "#f59e0b", limite: 99999
  });
  const [newProd, setNewProd] = useState({ n: "", p: "" });

  const planPrices = { basico: 390000, pro: 790000, empresarial: 1590000 };
  const set = (k, v) => setForm(f => ({ ...f, [k]: v }));

  const addProd = () => {
    if (!newProd.n || !newProd.p) return;
    set("products", [...form.products.filter(p => p.n), { n: newProd.n, p: Number(newProd.p) }]);
    setNewProd({ n: "", p: "" });
  };

  const removeProd = (i) => set("products", form.products.filter((_, idx) => idx !== i));

  const toggleBot = (bot) => {
    const bots = form.bots.includes(bot) ? form.bots.filter(b => b !== bot) : [...form.bots, bot];
    set("bots", bots);
  };

  const handleSave = () => {
    const finalForm = { ...form, id: form.id || `c${Date.now()}`, ingresoMes: planPrices[form.plan] };
    onSave(finalForm);
  };

  const inp = { width: "100%", background: "#0d0d18", border: "1px solid #1e1e2e", borderRadius: 10, padding: "10px 14px", color: "#fff", fontSize: 13, outline: "none", fontFamily: "'Outfit',sans-serif", boxSizing: "border-box" };
  const lbl = { color: "#666", fontSize: 11, textTransform: "uppercase", letterSpacing: 1.5, marginBottom: 6, display: "block", fontFamily: "'Outfit',sans-serif" };

  return (
    <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,.9)", zIndex: 1000, display: "flex", alignItems: "center", justifyContent: "center", backdropFilter: "blur(8px)", padding: 20 }}>
      <div style={{ width: "100%", maxWidth: 680, maxHeight: "90vh", background: "#09090f", border: "1px solid #1e1e2e", borderRadius: 24, overflow: "hidden", display: "flex", flexDirection: "column" }}>
        <div style={{ padding: "20px 24px", borderBottom: "1px solid #1e1e2e", display: "flex", alignItems: "center", gap: 12 }}>
          <div style={{ width: 36, height: 36, borderRadius: 10, background: "linear-gradient(135deg,#f59e0b,#d97706)", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 900, fontSize: 16 }}>N</div>
          <div>
            <div style={{ fontWeight: 800, fontSize: 16, fontFamily: "'Outfit',sans-serif" }}>{isNew ? "Nuevo cliente" : `Editar: ${client.name}`}</div>
            <div style={{ color: "#555", fontSize: 12 }}>Configura el bot NOVA para este negocio</div>
          </div>
          <button onClick={onClose} style={{ marginLeft: "auto", background: "#ffffff11", border: "none", color: "#888", borderRadius: 8, width: 34, height: 34, cursor: "pointer", fontSize: 16 }}>✕</button>
        </div>

        <div style={{ flex: 1, overflowY: "auto", padding: "20px 24px", display: "flex", flexDirection: "column", gap: 20 }}>
          {/* Info básica */}
          <div>
            <div style={{ color: "#f59e0b", fontSize: 11, fontWeight: 700, textTransform: "uppercase", letterSpacing: 2, marginBottom: 14 }}>📋 Información del negocio</div>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
              <div><label style={lbl}>Nombre del negocio</label><input style={inp} value={form.name} onChange={e => set("name", e.target.value)} placeholder="Ej: Fogón Paisa" /></div>
              <div><label style={lbl}>Dueño / Contacto</label><input style={inp} value={form.owner} onChange={e => set("owner", e.target.value)} placeholder="Nombre completo" /></div>
              <div><label style={lbl}>WhatsApp de contacto</label><input style={inp} value={form.phone} onChange={e => set("phone", e.target.value)} placeholder="3001234567" /></div>
              <div><label style={lbl}>Ciudad</label>
                <select style={inp} value={form.city} onChange={e => set("city", e.target.value)}>
                  {["Bogotá", "Medellín", "Cali", "Barranquilla", "Cartagena", "Bucaramanga", "Pereira", "Manizales", "Armenia", "Ibagué", "Otra"].map(c => <option key={c}>{c}</option>)}
                </select>
              </div>
              <div><label style={lbl}>Industria</label>
                <select style={inp} value={form.industry} onChange={e => set("industry", e.target.value)}>
                  {["Restaurante", "Moda", "Belleza", "Tecnología", "Salud", "Educación", "Inmobiliaria", "Servicios", "Retail", "Otra"].map(i => <option key={i}>{i}</option>)}
                </select>
              </div>
              <div><label style={lbl}>Plan</label>
                <select style={inp} value={form.plan} onChange={e => { set("plan", e.target.value); set("ingresoMes", planPrices[e.target.value]); }}>
                  <option value="basico">Básico — $390.000/mes</option>
                  <option value="pro">Pro — $790.000/mes</option>
                  <option value="empresarial">Empresarial — $1.590.000/mes</option>
                </select>
              </div>
            </div>
          </div>

          {/* Redes */}
          <div>
            <div style={{ color: "#f59e0b", fontSize: 11, fontWeight: 700, textTransform: "uppercase", letterSpacing: 2, marginBottom: 14 }}>📱 Redes sociales activas</div>
            <div style={{ display: "flex", gap: 10 }}>
              {["WhatsApp", "Instagram", "Facebook", "Telegram"].map(b => (
                <button key={b} onClick={() => toggleBot(b)} style={{ background: form.bots.includes(b) ? "#22c55e22" : "transparent", border: `1px solid ${form.bots.includes(b) ? "#22c55e66" : "#1e1e2e"}`, color: form.bots.includes(b) ? "#22c55e" : "#555", borderRadius: 20, padding: "7px 16px", cursor: "pointer", fontSize: 12, fontWeight: 700, fontFamily: "'Outfit',sans-serif" }}>{b}</button>
              ))}
            </div>
          </div>

          {/* Productos */}
          <div>
            <div style={{ color: "#f59e0b", fontSize: 11, fontWeight: 700, textTransform: "uppercase", letterSpacing: 2, marginBottom: 14 }}>🛍️ Productos / Servicios</div>
            <div style={{ display: "flex", flexDirection: "column", gap: 8, marginBottom: 10 }}>
              {form.products.filter(p => p.n).map((p, i) => (
                <div key={i} style={{ background: "#0d0d18", border: "1px solid #1e1e2e", borderRadius: 10, padding: "10px 14px", display: "flex", alignItems: "center", gap: 10 }}>
                  <span style={{ flex: 1, fontSize: 13, color: "#ccc", fontFamily: "'Outfit',sans-serif" }}>{p.n}</span>
                  <span style={{ color: "#22c55e", fontWeight: 800, fontSize: 13 }}>{COP(p.p)}</span>
                  <button onClick={() => removeProd(i)} style={{ background: "transparent", border: "none", color: "#ff4444", cursor: "pointer", fontSize: 14 }}>✕</button>
                </div>
              ))}
            </div>
            <div style={{ display: "flex", gap: 8 }}>
              <input style={{ ...inp, flex: 2 }} value={newProd.n} onChange={e => setNewProd(p => ({ ...p, n: e.target.value }))} placeholder="Nombre del producto/servicio" />
              <input style={{ ...inp, flex: 1 }} value={newProd.p} onChange={e => setNewProd(p => ({ ...p, p: e.target.value }))} placeholder="Precio COP" type="number" />
              <button onClick={addProd} style={{ background: "linear-gradient(135deg,#f59e0b,#d97706)", border: "none", color: "#000", borderRadius: 10, padding: "0 16px", cursor: "pointer", fontSize: 18, fontWeight: 900 }}>+</button>
            </div>
          </div>

          {/* Config bot */}
          <div>
            <div style={{ color: "#f59e0b", fontSize: 11, fontWeight: 700, textTransform: "uppercase", letterSpacing: 2, marginBottom: 14 }}>🤖 Configuración del bot NOVA</div>
            <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
              <div><label style={lbl}>Promoción activa</label><input style={inp} value={form.promo} onChange={e => set("promo", e.target.value)} placeholder="Ej: 2x1 los martes, envío gratis +$100.000..." /></div>
              <div><label style={lbl}>Tono de comunicación</label>
                <select style={inp} value={form.tone} onChange={e => set("tone", e.target.value)}>
                  <option value="cálido y profesional">Cálido y profesional</option>
                  <option value="casual y divertido con jerga colombiana">Casual y divertido (jerga colombiana)</option>
                  <option value="sofisticado y exclusivo">Sofisticado y exclusivo</option>
                  <option value="técnico y experto pero accesible">Técnico y experto</option>
                  <option value="cariñoso y empático como asesor de confianza">Cariñoso y empático</option>
                  <option value="directo y persuasivo orientado al cierre">Directo y persuasivo</option>
                </select>
              </div>
              <div>
                <label style={lbl}>Instrucciones especiales (opcional)</label>
                <textarea style={{ ...inp, height: 80, resize: "vertical" }} value={form.prompt_extra} onChange={e => set("prompt_extra", e.target.value)} placeholder="Ej: Solo atendemos domicilios en zona norte. Horario 11am-10pm. No hacemos cambios ni devoluciones..." />
              </div>
              <div><label style={lbl}>Color del bot</label>
                <div style={{ display: "flex", gap: 8 }}>
                  {["#f59e0b", "#ec4899", "#3b82f6", "#22c55e", "#a855f7", "#ef4444", "#06b6d4", "#f97316"].map(c => (
                    <div key={c} onClick={() => set("color", c)} style={{ width: 32, height: 32, borderRadius: "50%", background: c, cursor: "pointer", border: form.color === c ? "3px solid #fff" : "3px solid transparent", transition: "all .2s" }} />
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>

        <div style={{ padding: "16px 24px", borderTop: "1px solid #1e1e2e", display: "flex", gap: 10 }}>
          <button onClick={onClose} style={{ flex: 1, background: "transparent", border: "1px solid #1e1e2e", color: "#666", borderRadius: 12, padding: "12px", cursor: "pointer", fontSize: 14, fontWeight: 700, fontFamily: "'Outfit',sans-serif" }}>Cancelar</button>
          <button onClick={handleSave} style={{ flex: 2, background: "linear-gradient(135deg,#f59e0b,#d97706)", border: "none", color: "#000", borderRadius: 12, padding: "12px", cursor: "pointer", fontSize: 14, fontWeight: 900, fontFamily: "'Outfit',sans-serif" }}>
            {isNew ? "✅ Crear cliente y activar bot" : "💾 Guardar cambios"}
          </button>
        </div>
      </div>
    </div>
  );
}

/* ══════════ GUÍA DE DESPLIEGUE ══════════ */
function DeployGuide() {
  const [step, setStep] = useState(0);
  const steps = [
    {
      icon: "🔑", title: "Obtén tu API Key de Anthropic",
      desc: "Esta es la clave que conecta tu app con la IA de NOVA. Tiene un costo real por uso.",
      cost: "~$15.000–$50.000 COP/mes para 10 clientes",
      actions: [
        { label: "1. Ve a console.anthropic.com", url: "https://console.anthropic.com", detail: "Crea una cuenta gratis" },
        { label: "2. Ve a 'API Keys' → 'Create Key'", url: null, detail: "Guarda la clave en un lugar seguro" },
        { label: "3. Agrega créditos (mínimo $5 USD)", url: null, detail: "Con tarjeta de crédito o débito internacional" },
      ],
      tip: "💡 Con $5 USD (~$21.000 COP) tienes aproximadamente 1.600 conversaciones completas. Para 10 clientes con uso normal, gastas unos $30.000 COP/mes. Tus ingresos serán $7.900.000 COP/mes. Margen brutal."
    },
    {
      icon: "🌐", title: "Publica la app en internet (hosting)",
      desc: "Para que tus clientes accedan al bot desde cualquier lugar necesitas publicar la app.",
      cost: "Gratis con Vercel o Netlify",
      actions: [
        { label: "1. Crea cuenta en Vercel.com", url: "https://vercel.com", detail: "100% gratis para empezar" },
        { label: "2. Sube el código a GitHub", url: "https://github.com", detail: "Crea un repositorio y sube los archivos" },
        { label: "3. Conecta GitHub con Vercel → Deploy", url: null, detail: "En 2 minutos tienes tu URL pública" },
      ],
      tip: "💡 Con Vercel tienes dominio gratuito tipo tuapp.vercel.app. Para un dominio propio como novabot.co cuesta ~$35.000 COP/año en NIC.co o ~$60.000 en GoDaddy."
    },
    {
      icon: "🔒", title: "Protege tu API Key (CRÍTICO)",
      desc: "La API Key NO debe estar en el código público. Necesitas un backend mínimo.",
      cost: "Gratis con Vercel Functions o Cloudflare Workers",
      actions: [
        { label: "1. Crea archivo /api/chat.js en tu proyecto", url: null, detail: "Este archivo actúa como intermediario seguro" },
        { label: "2. Agrega la API Key como variable de entorno en Vercel", url: null, detail: "Settings → Environment Variables → ANTHROPIC_API_KEY" },
        { label: "3. El frontend llama a /api/chat en vez de directo a Anthropic", url: null, detail: "Nadie puede ver tu clave" },
      ],
      tip: "💡 Si no tienes conocimientos técnicos, contrata a un desarrollador en Workana.com o freelancer colombiano por $150.000–$300.000 COP para que haga este paso. Es una inversión que se paga con el primer cliente.",
      code: `// /api/chat.js (Vercel Serverless Function)
export default async function handler(req, res) {
  const { messages, system } = req.body;
  
  const response = await fetch('https://api.anthropic.com/v1/messages', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-api-key': process.env.ANTHROPIC_API_KEY, // ← seguro!
      'anthropic-version': '2023-06-01'
    },
    body: JSON.stringify({
      model: 'claude-sonnet-4-20250514',
      max_tokens: 1000,
      system,
      messages
    })
  });
  
  const data = await response.json();
  res.json(data);
}`
    },
    {
      icon: "📱", title: "Conecta WhatsApp Business API (el canal más importante)",
      desc: "Para que NOVA responda de verdad en WhatsApp de tus clientes, necesitas la API oficial.",
      cost: "$50.000–$150.000 COP/mes según proveedor",
      actions: [
        { label: "Opción A: Twilio (más fácil)", url: "https://twilio.com", detail: "Prueba gratis + $0,005 USD por mensaje enviado" },
        { label: "Opción B: Meta Business API directa", url: "https://business.whatsapp.com", detail: "Requiere verificación de negocio, más económico a escala" },
        { label: "Opción C: 360dialog (más económico en Colombia)", url: "https://360dialog.com", detail: "~$5 USD/mes por número de WhatsApp" },
      ],
      tip: "💡 Para empezar, usa el número de WhatsApp Business del cliente (gratis) + Twilio como intermediario. Cuando tengas +5 clientes considera Meta API directa para reducir costos."
    },
    {
      icon: "💳", title: "Cobra a tus clientes (pagos en Colombia)",
      desc: "Configura cómo van a pagarte las suscripciones mensuales.",
      cost: "Gratis (pagas % por transacción)",
      actions: [
        { label: "Opción A: ePayco (mejor para Colombia)", url: "https://epayco.co", detail: "Acepta todas las tarjetas + PSE + Nequi. Comisión ~3.49%" },
        { label: "Opción B: wompi by Bancolombia", url: "https://wompi.co", detail: "Integración fácil, confianza de Bancolombia" },
        { label: "Opción C: Manual (Nequi/Daviplata)", detail: "Para empezar: cobra manual y cuando tengas +10 clientes automatiza" },
      ],
      tip: "💡 Para empezar NO necesitas pasarela de pagos. Cobra por Nequi/Daviplata manualmente. Cuando llegues a 10+ clientes, implementa cobro automático con ePayco o Stripe."
    },
    {
      icon: "🚀", title: "Tu primer cliente — plan de acción HOY",
      desc: "Con lo que tienes ahora mismo puedes conseguir tu primer cliente esta semana.",
      cost: "Inversión inicial: $0",
      actions: [
        { label: "HOY: Instala la demo y pruébala bien", url: null, detail: "Conoce el producto que vas a vender" },
        { label: "MAÑANA: Consigue API Key de Anthropic ($5 USD)", url: "https://console.anthropic.com", detail: "Es tu única inversión inicial" },
        { label: "ESTA SEMANA: Contacta 20 negocios locales", url: null, detail: "Restaurantes, tiendas, salones en tu ciudad" },
      ],
      tip: "💡 Tu primera venta puede venir antes de tener todo configurado. Vende primero, configura después. Cobras $390.000 COP, configuras el bot en 2 horas con esta herramienta, y ya eres rentable desde el día 1."
    }
  ];

  const s = steps[step];

  return (
    <div style={{ display: "flex", gap: 20, height: "100%" }}>
      {/* Steps sidebar */}
      <div style={{ width: 220, flexShrink: 0, display: "flex", flexDirection: "column", gap: 6 }}>
        {steps.map((st, i) => (
          <button key={i} onClick={() => setStep(i)} style={{ background: step === i ? "#f59e0b18" : "transparent", border: `1px solid ${step === i ? "#f59e0b44" : "#1e1e2e"}`, borderRadius: 12, padding: "12px 14px", cursor: "pointer", display: "flex", alignItems: "center", gap: 10, textAlign: "left", transition: "all .2s" }}>
            <span style={{ fontSize: 18, flexShrink: 0 }}>{st.icon}</span>
            <div>
              <div style={{ color: step === i ? "#f59e0b" : "#666", fontWeight: step === i ? 700 : 500, fontSize: 12, fontFamily: "'Outfit',sans-serif", lineHeight: 1.3 }}>{st.title}</div>
              <div style={{ color: step === i ? "#f59e0b66" : "#333", fontSize: 10, marginTop: 2 }}>Paso {i + 1} de {steps.length}</div>
            </div>
          </button>
        ))}
      </div>

      {/* Content */}
      <div style={{ flex: 1, overflowY: "auto" }}>
        <div style={{ background: "#0d0d18", border: "1px solid #1e1e2e", borderRadius: 20, padding: 28, marginBottom: 16 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 14, marginBottom: 20 }}>
            <div style={{ width: 52, height: 52, borderRadius: 16, background: "#f59e0b18", border: "1px solid #f59e0b33", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 26 }}>{s.icon}</div>
            <div>
              <div style={{ color: "#f59e0b", fontSize: 11, fontWeight: 700, textTransform: "uppercase", letterSpacing: 2 }}>Paso {step + 1} de {steps.length}</div>
              <div style={{ fontWeight: 900, fontSize: 20, fontFamily: "'Outfit',sans-serif", marginTop: 2 }}>{s.title}</div>
            </div>
            <div style={{ marginLeft: "auto", background: "#22c55e18", border: "1px solid #22c55e33", borderRadius: 20, padding: "6px 14px", fontSize: 12, color: "#22c55e", fontWeight: 700 }}>{s.cost}</div>
          </div>

          <p style={{ color: "#888", fontSize: 14, lineHeight: 1.7, marginBottom: 20 }}>{s.desc}</p>

          <div style={{ display: "flex", flexDirection: "column", gap: 10, marginBottom: 20 }}>
            {s.actions.map((a, i) => (
              <div key={i} style={{ background: "#0a0a14", border: "1px solid #1a1a2a", borderRadius: 12, padding: "14px 16px", display: "flex", alignItems: "flex-start", gap: 12 }}>
                <div style={{ width: 24, height: 24, borderRadius: "50%", background: "#f59e0b22", border: "1px solid #f59e0b44", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 11, color: "#f59e0b", fontWeight: 900, flexShrink: 0, marginTop: 2 }}>{i + 1}</div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontWeight: 700, fontSize: 13, marginBottom: 4, fontFamily: "'Outfit',sans-serif" }}>{a.label}</div>
                  <div style={{ color: "#555", fontSize: 12 }}>{a.detail}</div>
                </div>
                {a.url && (
                  <a href={a.url} target="_blank" rel="noreferrer" style={{ background: "#f59e0b18", border: "1px solid #f59e0b44", color: "#f59e0b", borderRadius: 8, padding: "6px 12px", fontSize: 11, fontWeight: 700, textDecoration: "none", flexShrink: 0, fontFamily: "'Outfit',sans-serif" }}>Abrir →</a>
                )}
              </div>
            ))}
          </div>

          {s.code && (
            <div style={{ background: "#060610", border: "1px solid #1a1a2a", borderRadius: 12, padding: 16, marginBottom: 16, overflow: "auto" }}>
              <div style={{ color: "#f59e0b", fontSize: 10, fontWeight: 700, letterSpacing: 2, marginBottom: 10 }}>CÓDIGO DE EJEMPLO</div>
              <pre style={{ color: "#88dd88", fontSize: 12, lineHeight: 1.7, fontFamily: "monospace", whiteSpace: "pre-wrap" }}>{s.code}</pre>
            </div>
          )}

          <div style={{ background: "#f59e0b0d", border: "1px solid #f59e0b22", borderRadius: 14, padding: 16 }}>
            <div style={{ color: "#ccc", fontSize: 13, lineHeight: 1.7 }}>{s.tip}</div>
          </div>
        </div>

        <div style={{ display: "flex", gap: 10 }}>
          <button onClick={() => setStep(Math.max(0, step - 1))} disabled={step === 0} style={{ flex: 1, background: "transparent", border: "1px solid #1e1e2e", color: step === 0 ? "#333" : "#888", borderRadius: 12, padding: "12px", cursor: step === 0 ? "default" : "pointer", fontSize: 14, fontWeight: 700, fontFamily: "'Outfit',sans-serif" }}>← Anterior</button>
          <button onClick={() => setStep(Math.min(steps.length - 1, step + 1))} disabled={step === steps.length - 1} style={{ flex: 2, background: step === steps.length - 1 ? "#1a1a2a" : "linear-gradient(135deg,#f59e0b,#d97706)", border: "none", color: step === steps.length - 1 ? "#444" : "#000", borderRadius: 12, padding: "12px", cursor: step === steps.length - 1 ? "default" : "pointer", fontSize: 14, fontWeight: 900, fontFamily: "'Outfit',sans-serif" }}>
            {step === steps.length - 1 ? "✅ Guía completada" : "Siguiente paso →"}
          </button>
        </div>
      </div>
    </div>
  );
}

/* ══════════ APP PRINCIPAL ══════════ */
export default function App() {
  const [view, setView] = useState("dashboard");
  const [clients, setClients] = useState(loadClients);
  const [chatClient, setChatClient] = useState(null);
  const [editClient, setEditClient] = useState(null);
  const [showNew, setShowNew] = useState(false);
  const [notify, setNotify] = useState(null);

  const toast = (msg, type = "success") => {
    setNotify({ msg, type });
    setTimeout(() => setNotify(null), 3500);
  };

  const saveClient = (c) => {
    const updated = clients.find(x => x.id === c.id)
      ? clients.map(x => x.id === c.id ? c : x)
      : [...clients, c];
    setClients(updated);
    saveClients(updated);
    setEditClient(null);
    setShowNew(false);
    toast(c.id ? `✅ ${c.name} actualizado` : `🚀 ${c.name} creado y activo`);
  };

  const deleteClient = (id) => {
    const c = clients.find(x => x.id === id);
    if (!window.confirm(`¿Eliminar ${c?.name}? Esta acción no se puede deshacer.`)) return;
    const updated = clients.filter(x => x.id !== id);
    setClients(updated);
    saveClients(updated);
    toast(`🗑️ ${c?.name} eliminado`, "warn");
  };

  const toggleStatus = (id) => {
    const updated = clients.map(c => c.id === id ? { ...c, status: c.status === "active" ? "paused" : "active" } : c);
    setClients(updated);
    saveClients(updated);
    const c = updated.find(x => x.id === id);
    toast(c.status === "active" ? `▶️ ${c.name} reactivado` : `⏸️ ${c.name} pausado`);
  };

  const totalIngresos = clients.filter(c => c.status === "active").reduce((s, c) => s + c.ingresoMes, 0);
  const totalCostoApi = clients.reduce((s, c) => s + (c.costoApi || 0), 0);
  const totalMensajes = clients.reduce((s, c) => s + c.mensajes, 0);
  const totalVentas = clients.reduce((s, c) => s + c.ventas_cerradas, 0);
  const gananciaReal = totalIngresos - totalCostoApi;

  const planLabel = { basico: "Básico", pro: "Pro", empresarial: "Empresarial" };
  const planColor = { basico: "#6b7280", pro: "#f59e0b", empresarial: "#a855f7" };

  const navItems = [
    { id: "dashboard", icon: "📊", label: "Dashboard" },
    { id: "clients", icon: "🏪", label: "Clientes" },
    { id: "deploy", icon: "🚀", label: "Hacerlo real" },
    { id: "guide", icon: "📋", label: "Guía de ventas" },
  ];

  return (
    <div style={{ minHeight: "100vh", background: "#06060e", color: "#fff", fontFamily: "'Outfit', sans-serif", display: "flex" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Outfit:wght@300;400;500;600;700;800;900&display=swap');
        *{box-sizing:border-box;margin:0;padding:0}
        ::-webkit-scrollbar{width:4px}::-webkit-scrollbar-track{background:#0a0a14}::-webkit-scrollbar-thumb{background:#f59e0b33;border-radius:2px}
        @keyframes bounce{0%,80%,100%{transform:scale(.6);opacity:.4}40%{transform:scale(1);opacity:1}}
        @keyframes fadeUp{from{opacity:0;transform:translateY(10px)}to{opacity:1;transform:translateY(0)}}
        @keyframes pulse{0%,100%{opacity:1}50%{opacity:.3}}
        @keyframes slideIn{from{transform:translateX(100%);opacity:0}to{transform:translateX(0);opacity:1}}
        .row-hover:hover{background:#0d0d1a!important;cursor:pointer}
      `}</style>

      {/* SIDEBAR */}
      <div style={{ width: 220, background: "#08080f", borderRight: "1px solid #1a1a2a", display: "flex", flexDirection: "column", padding: "20px 12px", flexShrink: 0 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10, padding: "4px 8px", marginBottom: 28 }}>
          <div style={{ width: 34, height: 34, borderRadius: 10, background: "linear-gradient(135deg,#f59e0b,#d97706)", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 900, fontSize: 16 }}>N</div>
          <div>
            <div style={{ fontWeight: 900, fontSize: 15, letterSpacing: -0.5 }}>NOVABot</div>
            <div style={{ color: "#f59e0b", fontSize: 9, letterSpacing: 2, fontWeight: 700 }}>ADMIN PANEL</div>
          </div>
        </div>

        <div style={{ flex: 1, display: "flex", flexDirection: "column", gap: 4 }}>
          {navItems.map(n => (
            <button key={n.id} onClick={() => setView(n.id)} style={{ background: view === n.id ? "#f59e0b15" : "transparent", border: `1px solid ${view === n.id ? "#f59e0b33" : "transparent"}`, borderRadius: 12, padding: "11px 14px", display: "flex", alignItems: "center", gap: 10, cursor: "pointer", transition: "all .2s" }}>
              <span style={{ fontSize: 16 }}>{n.icon}</span>
              <span style={{ color: view === n.id ? "#f59e0b" : "#555", fontWeight: view === n.id ? 700 : 500, fontSize: 13, fontFamily: "'Outfit',sans-serif" }}>{n.label}</span>
              {view === n.id && <div style={{ marginLeft: "auto", width: 4, height: 4, borderRadius: "50%", background: "#f59e0b" }} />}
            </button>
          ))}
        </div>

        <div style={{ background: "#f59e0b0d", border: "1px solid #f59e0b22", borderRadius: 14, padding: 14 }}>
          <div style={{ color: "#f59e0b", fontSize: 10, fontWeight: 700, textTransform: "uppercase", letterSpacing: 2, marginBottom: 8 }}>Ganancia neta</div>
          <div style={{ color: "#22c55e", fontWeight: 900, fontSize: 22, letterSpacing: -0.5 }}>{COP(gananciaReal)}</div>
          <div style={{ color: "#444", fontSize: 10, marginTop: 2 }}>este mes</div>
        </div>
      </div>

      {/* MAIN */}
      <div style={{ flex: 1, overflow: "auto", padding: 28 }}>

        {/* TOAST */}
        {notify && (
          <div style={{ position: "fixed", top: 20, right: 20, zIndex: 2000, background: notify.type === "warn" ? "#ff444422" : "#22c55e22", border: `1px solid ${notify.type === "warn" ? "#ff444444" : "#22c55e44"}`, borderRadius: 14, padding: "14px 20px", fontSize: 14, fontWeight: 700, animation: "slideIn .3s ease", backdropFilter: "blur(10px)", color: "#fff" }}>
            {notify.msg}
          </div>
        )}

        {/* ─── DASHBOARD ─── */}
        {view === "dashboard" && (
          <div style={{ animation: "fadeUp .4s ease" }}>
            <div style={{ marginBottom: 28 }}>
              <div style={{ color: "#f59e0b", fontSize: 11, fontWeight: 700, letterSpacing: 3, textTransform: "uppercase", marginBottom: 6 }}>Panel de control</div>
              <h1 style={{ fontSize: 30, fontWeight: 900, letterSpacing: -1 }}>Bienvenido a NOVABot Admin 👋</h1>
              <p style={{ color: "#444", fontSize: 14, marginTop: 4 }}>Gestiona todos tus clientes y bots desde aquí</p>
            </div>

            {/* KPIs */}
            <div style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 14, marginBottom: 24 }}>
              {[
                { l: "Ingresos del mes", v: COP(totalIngresos), sub: `${clients.filter(c => c.status === "active").length} clientes activos`, c: "#f59e0b", e: "💰" },
                { l: "Costo API real", v: COP(totalCostoApi), sub: `${totalMensajes.toLocaleString()} mensajes`, c: "#ef4444", e: "⚡" },
                { l: "Ganancia neta", v: COP(gananciaReal), sub: `Margen ${Math.round(gananciaReal / totalIngresos * 100) || 0}%`, c: "#22c55e", e: "📈" },
                { l: "Ventas cerradas por NOVA", v: totalVentas, sub: "este mes", c: "#3b82f6", e: "🎯" },
              ].map(k => (
                <div key={k.l} style={{ background: "#0d0d18", border: `1px solid ${k.c}22`, borderRadius: 18, padding: 22 }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 12 }}>
                    <span style={{ fontSize: 24 }}>{k.e}</span>
                    <div style={{ width: 8, height: 8, borderRadius: "50%", background: k.c, animation: "pulse 2s infinite" }} />
                  </div>
                  <div style={{ color: k.c, fontWeight: 900, fontSize: 26, letterSpacing: -0.5, marginBottom: 4 }}>{k.v}</div>
                  <div style={{ color: "#444", fontSize: 11 }}>{k.l}</div>
                  <div style={{ color: "#333", fontSize: 10, marginTop: 2 }}>{k.sub}</div>
                </div>
              ))}
            </div>

            {/* Clientes resumen */}
            <div style={{ display: "grid", gridTemplateColumns: "1fr 360px", gap: 14 }}>
              <div style={{ background: "#0d0d18", border: "1px solid #1a1a2a", borderRadius: 18, overflow: "hidden" }}>
                <div style={{ padding: "18px 20px", borderBottom: "1px solid #1a1a2a", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                  <div style={{ fontWeight: 800, fontSize: 15 }}>Clientes activos</div>
                  <button onClick={() => setShowNew(true)} style={{ background: "linear-gradient(135deg,#f59e0b,#d97706)", border: "none", color: "#000", borderRadius: 10, padding: "7px 16px", cursor: "pointer", fontSize: 12, fontWeight: 900, fontFamily: "'Outfit',sans-serif" }}>+ Nuevo</button>
                </div>
                {clients.map(c => (
                  <div key={c.id} className="row-hover" onClick={() => setEditClient(c)} style={{ padding: "14px 20px", borderBottom: "1px solid #0d0d18", display: "flex", alignItems: "center", gap: 12 }}>
                    <div style={{ width: 38, height: 38, borderRadius: 10, background: `${c.color}22`, border: `1px solid ${c.color}44`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 18, flexShrink: 0 }}>
                      {c.industry === "Restaurante" ? "🍲" : c.industry === "Moda" ? "👗" : c.industry === "Belleza" ? "💅" : c.industry === "Tecnología" ? "🎧" : "🏪"}
                    </div>
                    <div style={{ flex: 1 }}>
                      <div style={{ fontWeight: 700, fontSize: 13 }}>{c.name}</div>
                      <div style={{ color: "#555", fontSize: 11, marginTop: 1 }}>{c.city} · {c.bots.join(", ")}</div>
                    </div>
                    <div style={{ textAlign: "right" }}>
                      <div style={{ color: "#22c55e", fontWeight: 800, fontSize: 13 }}>{COP(c.ingresoMes)}</div>
                      <div style={{ color: "#333", fontSize: 10 }}>/mes</div>
                    </div>
                    <div style={{ background: c.status === "active" ? "#22c55e22" : "#ff444422", border: `1px solid ${c.status === "active" ? "#22c55e44" : "#ff444444"}`, borderRadius: 20, padding: "3px 10px", fontSize: 10, color: c.status === "active" ? "#22c55e" : "#ff4444", fontWeight: 700 }}>
                      {c.status === "active" ? "ACTIVO" : "PAUSADO"}
                    </div>
                  </div>
                ))}
              </div>

              {/* Acciones rápidas */}
              <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
                <div style={{ background: "#0d0d18", border: "1px solid #1a1a2a", borderRadius: 18, padding: 20 }}>
                  <div style={{ fontWeight: 800, fontSize: 14, marginBottom: 14 }}>⚡ Acciones rápidas</div>
                  {[
                    { l: "Nuevo cliente", d: "Configura un bot nuevo", e: "➕", action: () => setShowNew(true), c: "#f59e0b" },
                    { l: "Ver guía deploy", d: "Haberlo real paso a paso", e: "🚀", action: () => setView("deploy"), c: "#3b82f6" },
                    { l: "Guión de ventas", d: "Mensajes listos para copiar", e: "📋", action: () => setView("guide"), c: "#a855f7" },
                    { l: "Probar un bot", d: "Test como cliente", e: "🤖", action: () => clients.length && setChatClient(clients[0]), c: "#22c55e" },
                  ].map(a => (
                    <button key={a.l} onClick={a.action} style={{ width: "100%", background: "transparent", border: `1px solid #1a1a2a`, borderRadius: 12, padding: "12px 14px", display: "flex", alignItems: "center", gap: 10, cursor: "pointer", marginBottom: 8, transition: "all .2s", textAlign: "left" }}
                      onMouseEnter={e => e.currentTarget.style.borderColor = a.c + "66"}
                      onMouseLeave={e => e.currentTarget.style.borderColor = "#1a1a2a"}>
                      <span style={{ fontSize: 20 }}>{a.e}</span>
                      <div>
                        <div style={{ color: "#fff", fontWeight: 700, fontSize: 13, fontFamily: "'Outfit',sans-serif" }}>{a.l}</div>
                        <div style={{ color: "#444", fontSize: 11 }}>{a.d}</div>
                      </div>
                    </button>
                  ))}
                </div>

                <div style={{ background: "linear-gradient(135deg,#f59e0b0d,#f970130d)", border: "1px solid #f59e0b22", borderRadius: 18, padding: 20 }}>
                  <div style={{ color: "#f59e0b", fontSize: 11, fontWeight: 700, textTransform: "uppercase", letterSpacing: 2, marginBottom: 10 }}>💡 Tip del día</div>
                  <p style={{ color: "#888", fontSize: 13, lineHeight: 1.7 }}>Con solo <strong style={{ color: "#f59e0b" }}>5 clientes Pro</strong> tienes ingresos de <strong style={{ color: "#22c55e" }}>{COP(790000 * 5)}/mes</strong>. Tu costo real en API es ~{COP(75000)}. Ganancia neta: <strong style={{ color: "#22c55e" }}>{COP(790000 * 5 - 75000)}</strong>.</p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ─── CLIENTES ─── */}
        {view === "clients" && (
          <div style={{ animation: "fadeUp .4s ease" }}>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 24 }}>
              <div>
                <div style={{ color: "#f59e0b", fontSize: 11, fontWeight: 700, letterSpacing: 3, textTransform: "uppercase", marginBottom: 4 }}>Gestión</div>
                <h2 style={{ fontSize: 26, fontWeight: 900, letterSpacing: -0.5 }}>Mis clientes ({clients.length})</h2>
              </div>
              <button onClick={() => setShowNew(true)} style={{ background: "linear-gradient(135deg,#f59e0b,#d97706)", border: "none", color: "#000", borderRadius: 14, padding: "12px 24px", cursor: "pointer", fontSize: 14, fontWeight: 900, fontFamily: "'Outfit',sans-serif" }}>+ Agregar cliente</button>
            </div>

            <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
              {clients.map(c => (
                <div key={c.id} style={{ background: "#0d0d18", border: `1px solid ${c.status === "active" ? c.color + "22" : "#1a1a2a"}`, borderRadius: 18, padding: "18px 22px", display: "flex", alignItems: "center", gap: 16 }}>
                  <div style={{ width: 48, height: 48, borderRadius: 14, background: `${c.color}18`, border: `1px solid ${c.color}44`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 24, flexShrink: 0 }}>
                    {c.industry === "Restaurante" ? "🍲" : c.industry === "Moda" ? "👗" : c.industry === "Belleza" ? "💅" : "🏪"}
                  </div>

                  <div style={{ flex: 1 }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 4 }}>
                      <span style={{ fontWeight: 800, fontSize: 15 }}>{c.name}</span>
                      <span style={{ background: `${planColor[c.plan]}22`, border: `1px solid ${planColor[c.plan]}44`, color: planColor[c.plan], borderRadius: 20, padding: "2px 10px", fontSize: 10, fontWeight: 700 }}>{planLabel[c.plan]}</span>
                      <span style={{ background: c.status === "active" ? "#22c55e22" : "#ff444422", border: `1px solid ${c.status === "active" ? "#22c55e44" : "#ff444444"}`, color: c.status === "active" ? "#22c55e" : "#ff4444", borderRadius: 20, padding: "2px 10px", fontSize: 10, fontWeight: 700 }}>
                        {c.status === "active" ? "● ACTIVO" : "⏸ PAUSADO"}
                      </span>
                    </div>
                    <div style={{ color: "#555", fontSize: 12 }}>{c.owner} · {c.city} · {c.bots.join(" + ")}</div>
                    <div style={{ display: "flex", gap: 16, marginTop: 8 }}>
                      {[
                        { l: "Mensajes", v: c.mensajes.toLocaleString(), c: "#3b82f6" },
                        { l: "Ventas cerradas", v: c.ventas_cerradas, c: "#22c55e" },
                        { l: "Costo API", v: COP(c.costoApi), c: "#ef4444" },
                        { l: "Ingreso mensual", v: COP(c.ingresoMes), c: "#f59e0b" },
                      ].map(m => (
                        <div key={m.l}>
                          <div style={{ color: m.c, fontWeight: 800, fontSize: 14 }}>{m.v}</div>
                          <div style={{ color: "#333", fontSize: 10 }}>{m.l}</div>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div style={{ display: "flex", gap: 8, flexShrink: 0 }}>
                    <button onClick={() => setChatClient(c)} title="Probar bot" style={{ background: `${c.color}18`, border: `1px solid ${c.color}44`, color: c.color, borderRadius: 10, width: 36, height: 36, cursor: "pointer", fontSize: 16 }}>🤖</button>
                    <button onClick={() => setEditClient(c)} title="Editar" style={{ background: "#ffffff0a", border: "1px solid #1e1e2e", color: "#888", borderRadius: 10, width: 36, height: 36, cursor: "pointer", fontSize: 15 }}>✏️</button>
                    <button onClick={() => toggleStatus(c.id)} title={c.status === "active" ? "Pausar" : "Reactivar"} style={{ background: c.status === "active" ? "#ff444411" : "#22c55e11", border: `1px solid ${c.status === "active" ? "#ff444433" : "#22c55e33"}`, color: c.status === "active" ? "#ff4444" : "#22c55e", borderRadius: 10, width: 36, height: 36, cursor: "pointer", fontSize: 15 }}>
                      {c.status === "active" ? "⏸" : "▶"}
                    </button>
                    <button onClick={() => deleteClient(c.id)} title="Eliminar" style={{ background: "#ff444411", border: "1px solid #ff444433", color: "#ff4444", borderRadius: 10, width: 36, height: 36, cursor: "pointer", fontSize: 15 }}>🗑</button>
                  </div>
                </div>
              ))}

              {clients.length === 0 && (
                <div style={{ textAlign: "center", padding: "60px 20px", color: "#333" }}>
                  <div style={{ fontSize: 48, marginBottom: 16 }}>🤖</div>
                  <div style={{ fontSize: 18, fontWeight: 700, marginBottom: 8 }}>Aún no tienes clientes</div>
                  <div style={{ fontSize: 14, marginBottom: 20 }}>Agrega tu primer cliente y activa su bot NOVA</div>
                  <button onClick={() => setShowNew(true)} style={{ background: "linear-gradient(135deg,#f59e0b,#d97706)", border: "none", color: "#000", borderRadius: 12, padding: "12px 28px", cursor: "pointer", fontSize: 14, fontWeight: 900, fontFamily: "'Outfit',sans-serif" }}>Agregar primer cliente</button>
                </div>
              )}
            </div>
          </div>
        )}

        {/* ─── DEPLOY GUIDE ─── */}
        {view === "deploy" && (
          <div style={{ animation: "fadeUp .4s ease", height: "calc(100vh - 80px)" }}>
            <div style={{ marginBottom: 24 }}>
              <div style={{ color: "#f59e0b", fontSize: 11, fontWeight: 700, letterSpacing: 3, textTransform: "uppercase", marginBottom: 4 }}>Guía técnica</div>
              <h2 style={{ fontSize: 26, fontWeight: 900, letterSpacing: -0.5 }}>🚀 De demo a negocio real</h2>
              <p style={{ color: "#444", fontSize: 14, marginTop: 4 }}>Sigue estos pasos para publicar NOVABot y empezar a cobrar</p>
            </div>
            <DeployGuide />
          </div>
        )}

        {/* ─── GUÍA VENTAS ─── */}
        {view === "guide" && (
          <div style={{ animation: "fadeUp .4s ease", maxWidth: 800 }}>
            <div style={{ marginBottom: 28 }}>
              <div style={{ color: "#f59e0b", fontSize: 11, fontWeight: 700, letterSpacing: 3, textTransform: "uppercase", marginBottom: 4 }}>Mensajes listos</div>
              <h2 style={{ fontSize: 26, fontWeight: 900, letterSpacing: -0.5 }}>📋 Guión completo de ventas Colombia</h2>
            </div>

            {[
              { icon: "📲", title: "Mensaje frío — Instagram / WhatsApp", tag: "Primer contacto", content: `Hola [Nombre]! 👋 Vi tu negocio y noté que probablemente estás perdiendo ventas porque no puedes responder todos los mensajes a tiempo.

Nosotros creamos NOVA, un asesor de ventas con IA que responde por tu negocio 24/7 en WhatsApp, Instagram y Facebook — con la labia de tu mejor vendedor, sin que tú estés pegado al celular.

Negocios en [ciudad del cliente] han aumentado sus ventas hasta 43% en el primer mes.

¿Tienes 10 minutos esta semana? Te hago una demo gratis y personalizada para tu tipo de negocio 🚀` },
              { icon: "🔁", title: "Follow-up a los 2 días", tag: "Si no responden", content: `Hola [Nombre]! Te escribí hace 2 días sobre NOVA, el bot de ventas con IA 🤖

Esta semana le configuramos el bot a una [tipo de negocio similar] en [ciudad] y en el primer fin de semana cerró 28 ventas sin que nadie estuviera en el celular.

¿Puedo mostrarte en 10 minutos cómo funcionaría para tu negocio? Sin compromiso, totalmente gratis.` },
              { icon: "💰", title: "Objeción: \"Muy caro\"", tag: "Rebatir precio", content: `Entiendo perfectamente, y me parece bien que lo analices 💯

Mirémoslo con números reales:

Con el plan Pro a $790.000/mes... si NOVA cierra solo 2 ventas extras al día con ticket de $80.000 = $4.800.000 pesos más al mes.

¿Sabes cuánto cuesta contratar alguien para responder mensajes en Colombia? Mínimo $1.200.000/mes — y no trabaja a las 11pm ni los domingos.

NOVA trabaja 24/7 por $790.000. La pregunta no es si puedes pagarlo — es cuánto te está costando cada día que no lo tienes 🎯

¿Empezamos con el plan básico a $390.000 para que lo pruebes?` },
              { icon: "🤝", title: "Cierre de venta", tag: "Cuando están listos", content: `¡Qué bacano! Me alegra mucho que vayas a darle la oportunidad a NOVA 🙌

Para configurar todo necesito:
1️⃣ Nombre de tu negocio y redes donde quieres el bot
2️⃣ Lista de productos/servicios con precios en pesos
3️⃣ Promociones que tengas activas
4️⃣ El estilo de comunicación que quieres (formal, casual, etc.)

El pago es por Nequi, Daviplata o transferencia. Una vez confirmes, en 24 horas tienes tu NOVA activo y vendiendo.

Y recuerda: tienes 30 días de garantía. Si no ves resultados, te devuelvo el dinero sin preguntas.

¿Arrancamos? 🚀` },
              { icon: "🌟", title: "Pedir referidos", tag: "A clientes satisfechos", content: `Hola [Nombre]! Espero que NOVA esté generando muy buenas ventas para [nombre del negocio] 💰

Tengo una propuesta chévere: si nos recomiendas con otro negocio y ellos activan su bot, tú ganas 1 mes completamente gratis en tu suscripción.

Sin formularios ni complicaciones — solo preséntanos con el negocio y cuando ellos activen, te acreditamos el mes gratis.

¿Conoces algún restaurante, tienda, salón u otro emprendimiento que podría necesitarlo? 🙌` },
            ].map(p => <PitchCardGuide key={p.title} pitch={p} />)}

            <div style={{ background: "#0d0d18", border: "1px solid #f59e0b22", borderRadius: 18, padding: 24, marginTop: 8 }}>
              <h3 style={{ fontWeight: 900, fontSize: 18, marginBottom: 16 }}>🎯 Mejores clientes para prospectar en Colombia</h3>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
                {[
                  { e: "🍲", n: "Restaurantes y fondas", d: "Alto volumen de pedidos, sin tiempo para chats. Ticket $15K–$80K COP." },
                  { e: "👗", n: "Boutiques y ropa", d: "Preguntas de talla/color/precio todo el día. Compran de noche." },
                  { e: "💅", n: "Salones y spas", d: "Citas 24/7, venta de paquetes. Alta retención de clientes." },
                  { e: "🌿", n: "Tiendas naturistas", d: "Consultas técnicas frecuentes. Clientes fieles con buen ticket." },
                  { e: "🏋️", n: "Gym y entrenadores", d: "Membresías, planes, reactivación de clientes perdidos." },
                  { e: "📦", n: "Ecommerce / dropshipping", d: "Volumen masivo de mensajes. Necesitan automatizar urgente." },
                ].map(t => (
                  <div key={t.n} style={{ background: "#0a0a14", border: "1px solid #1a1a2a", borderRadius: 12, padding: 14, display: "flex", gap: 10 }}>
                    <span style={{ fontSize: 22, flexShrink: 0 }}>{t.e}</span>
                    <div>
                      <div style={{ fontWeight: 700, fontSize: 13, marginBottom: 3 }}>{t.n}</div>
                      <div style={{ color: "#555", fontSize: 12, lineHeight: 1.5 }}>{t.d}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* MODALS */}
      {(showNew || editClient) && (
        <ClientModal client={editClient || {}} onSave={saveClient} onClose={() => { setShowNew(false); setEditClient(null); }} />
      )}
      {chatClient && <BotChat client={chatClient} onClose={() => setChatClient(null)} />}
    </div>
  );
}

function PitchCardGuide({ pitch }) {
  const [open, setOpen] = useState(false);
  const [copied, setCopied] = useState(false);
  return (
    <div onClick={() => setOpen(o => !o)} style={{ background: "#0d0d18", border: `1px solid ${open ? "#f59e0b44" : "#1a1a2a"}`, borderRadius: 16, overflow: "hidden", cursor: "pointer", marginBottom: 10, transition: "all .2s" }}>
      <div style={{ padding: "16px 20px", display: "flex", alignItems: "center", gap: 12 }}>
        <span style={{ fontSize: 22 }}>{pitch.icon}</span>
        <div style={{ flex: 1 }}>
          <div style={{ fontWeight: 800, fontSize: 14, fontFamily: "'Outfit',sans-serif" }}>{pitch.title}</div>
          <div style={{ color: "#f59e0b", fontSize: 10, fontWeight: 700, textTransform: "uppercase", letterSpacing: 1.5, marginTop: 2 }}>{pitch.tag}</div>
        </div>
        <span style={{ color: "#444", fontSize: 20, transition: "transform .2s", transform: open ? "rotate(90deg)" : "none" }}>›</span>
      </div>
      {open && (
        <div style={{ borderTop: "1px solid #1a1a2a", padding: "16px 20px" }} onClick={e => e.stopPropagation()}>
          <pre style={{ color: "#ccc", fontSize: 13, lineHeight: 1.75, whiteSpace: "pre-wrap", fontFamily: "'Outfit',sans-serif", marginBottom: 12 }}>{pitch.content}</pre>
          <button onClick={() => { navigator.clipboard.writeText(pitch.content); setCopied(true); setTimeout(() => setCopied(false), 2000); }}
            style={{ background: copied ? "#22c55e22" : "#f59e0b18", border: `1px solid ${copied ? "#22c55e44" : "#f59e0b44"}`, color: copied ? "#22c55e" : "#f59e0b", borderRadius: 10, padding: "8px 18px", cursor: "pointer", fontSize: 12, fontWeight: 800, fontFamily: "'Outfit',sans-serif" }}>
            {copied ? "✓ ¡Copiado!" : "📋 Copiar mensaje"}
          </button>
        </div>
      )}
    </div>
  );
}
