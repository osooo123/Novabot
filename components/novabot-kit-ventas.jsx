import { useState } from "react";

const COP = n => `$${new Intl.NumberFormat("es-CO").format(n)}`;

/* ══════ DATA ══════ */
const SCRIPTS = [
  {
    momento: "El primer mensaje (WhatsApp / Instagram DM)",
    icon: "📲",
    color: "#25D366",
    cuando: "Cuando encuentras un negocio en redes y quieres contactarlo por primera vez",
    guion: [
      { tipo: "TU MENSAJE", texto: `Hola [Nombre]! 👋 Vi tu negocio [nombre del negocio] en Instagram.\n\nNota que tienes muy buen contenido, pero probablemente estás perdiendo ventas porque no alcanzas a responder todos los mensajes a tiempo — ¿me equivoco?\n\nTengo algo que te puede interesar mucho. ¿Tienes 2 minutos?` },
      { tipo: "SI DICE SÍ", texto: `Perfecto! Creamos NOVA — un asesor de ventas con inteligencia artificial que responde por tu negocio 24/7 en WhatsApp e Instagram.\n\nResponde como tu mejor vendedor: presenta productos, resuelve dudas, toma pedidos y hasta cobra — sin que tú estés pegado al celular.\n\nNegocios en [ciudad] han aumentado sus ventas hasta un 43% en el primer mes.\n\n¿Puedo mostrarte en 10 minutos cómo funcionaría exactamente para [tipo de negocio]? Es gratis y sin compromiso 🚀` },
      { tipo: "SI PREGUNTA EL PRECIO", texto: `Los planes arrancan desde $390.000 pesos al mes.\n\nPero antes de hablar de precio, déjame mostrarte cómo funciona para que veas si tiene sentido para tu negocio.\n\n¿Esta semana tienes 10 minutos? Te hago la demo en vivo con tu tipo de negocio 👇` },
    ]
  },
  {
    momento: "La demo en vivo (el momento clave)",
    icon: "🤖",
    color: "#f59e0b",
    cuando: "Cuando el cliente acepta ver la demo. Aquí se cierra el 70% de las ventas.",
    guion: [
      { tipo: "INTRO (30 segundos)", texto: `"Mira, lo que te voy a mostrar es NOVA funcionando en tiempo real. No es una grabación ni un video — es la IA respondiendo ahorita mismo.\n\nVoy a poner el bot como si fuera tu negocio, con tus productos y tu estilo. Escríbele como si fueras un cliente tuyo y mira cómo responde."` },
      { tipo: "DURANTE LA DEMO", texto: `[Abre botventas-colombia en el tipo de negocio del cliente]\n\n"Mira — responde en segundos, conoce todos los productos, maneja las objeciones de precio, y si el cliente quiere comprar, le pide los datos del pedido solo.\n\nEsto está activo 24/7. A las 2am. Los domingos. Mientras tú duermes o estás ocupado en el negocio."` },
      { tipo: "CIERRE DE DEMO", texto: `"¿Qué te parece? ¿Ves cómo funcionaría para [nombre del negocio]?\n\nEl bot que acabas de ver puede estar listo con TUS productos y TU estilo en menos de 24 horas.\n\n¿Quieres que lo activemos esta semana?"` },
    ]
  },
  {
    momento: "Cuando dice \"Muy caro\"",
    icon: "💰",
    color: "#ef4444",
    cuando: "La objeción más común. Tienes que responder con números, no con argumentos.",
    guion: [
      { tipo: "RESPUESTA INICIAL", texto: `"Entiendo perfectamente, y me parece bien que lo analices.\n\nPero déjame hacerte una pregunta: ¿cuántas ventas pierdes a la semana porque no puedes responder a tiempo?"\n\n[Espera que responda. Cualquier número que digan, úsalo.]` },
      { tipo: "CON SUS NÚMEROS", texto: `"Okay, digamos que pierdes [X ventas] a la semana. Con un ticket promedio de [precio promedio], eso son [X × precio] pesos al mes que no estás recibiendo.\n\nEl bot cuesta $790.000 al mes. Con que cierre [2-3 ventas extras al mes], ya se pagó solo.\n\nLa pregunta real no es si puedes pagar $790.000. Es cuánto te está costando cada mes no tenerlo."` },
      { tipo: "SI INSISTE", texto: `"Mira, por eso tenemos el plan Básico a $390.000 para que lo pruebes un mes sin riesgo.\n\nSi en 30 días no ves resultados, te devuelvo el dinero sin preguntas. ¿Qué pierdes con probarlo un mes?"` },
    ]
  },
  {
    momento: "Cuando dice \"Déjame pensarlo\"",
    icon: "🤔",
    color: "#6b7280",
    cuando: "Cuando el cliente no dice no, pero tampoco dice sí. Aquí muchos vendedores pierden la venta.",
    guion: [
      { tipo: "NO DIGAS \"CLARO, TÓMATE TU TIEMPO\"", texto: `Ese es el error más común. Si dices eso, el cliente nunca vuelve.\n\nEn cambio di esto:` },
      { tipo: "RESPUESTA CORRECTA", texto: `"Claro, entiendo. ¿Qué es específicamente lo que quieres pensar?\n\n¿Es el precio? ¿No estás seguro si funcionaría para tu negocio? ¿Necesitas consultarlo con alguien?\n\nDime qué es y lo resolvemos ahora mismo — prefiero que quedes 100% tranquilo antes de arrancar."` },
      { tipo: "SI DICE QUE NECESITA CONSULTAR", texto: `"Perfecto. ¿Con quién lo vas a consultar — tu socio, tu pareja?\n\n¿Qué tal si los incluimos en la próxima llamada? Así les muestro la demo a los dos y resolvemos todas las dudas de una vez.\n\n¿Mañana o pasado te funciona?"` },
    ]
  },
  {
    momento: "El cierre final",
    icon: "🤝",
    color: "#22c55e",
    cuando: "Cuando el cliente ya está convencido. Muchos vendedores se frenan aquí por miedo.",
    guion: [
      { tipo: "NUNCA PREGUNTES \"¿Qué decides?\"", texto: `Eso pone toda la presión en el cliente y genera fricción.\n\nEn cambio asume el cierre:` },
      { tipo: "CIERRE ASUMIDO", texto: `"Listo, entonces vamos a activar tu NOVA esta semana.\n\nNecesito que me des: el nombre de tu negocio, lista de productos con precios, y tus promociones actuales.\n\nEl pago es por Nequi o Daviplata. ¿A cuál número te queda más fácil?"` },
      { tipo: "SI DUDA EN EL ÚLTIMO MOMENTO", texto: `"Mira, lo peor que puede pasar es que lo pruebes un mes, no te guste y te devuelva el dinero. Lo mejor que puede pasar es que empieces a vender mientras duermes desde esta semana.\n\n¿A qué número te mando los datos para el pago?"` },
    ]
  },
  {
    momento: "Pedir referidos (después de activar)",
    icon: "🌟",
    color: "#a855f7",
    cuando: "A los 15-30 días de que el cliente está activo y contento con resultados.",
    guion: [
      { tipo: "MENSAJE DE REFERIDOS", texto: `"Hola [Nombre]! ¿Cómo va NOVA? ¿Está generando buenas ventas? 🚀\n\nMira, tengo una propuesta: si nos recomiendas con otro negocio y ellos activan su bot, tú ganas 1 mes completamente gratis.\n\nSin formularios. Solo preséntanos con el negocio y cuando ellos activen, te acreditamos el mes.\n\n¿Conoces algún restaurante, boutique o emprendimiento que podría necesitarlo?"` },
      { tipo: "SI TE PASA UN CONTACTO", texto: `"¡Perfecto! ¿Me puedes presentar directamente en un chat grupal o me das su número para mencionarte?\n\nAsí saben que vienes de tu parte y la confianza llega de una."` },
    ]
  }
];

const OBJECIONES = [
  { o: "\"No necesito un bot, yo mismo respondo\"", r: "¿A las 2am también? ¿Los domingos festivos? ¿Cuando estás ocupado atendiendo 5 clientes a la vez? NOVA no te reemplaza — trabaja cuando tú no puedes." },
  { o: "\"Ya tengo empleado para eso\"", r: "¿Cuánto le pagas? Con ese mismo dinero tienes a NOVA trabajando 24/7 sin vacaciones, sin incapacidades y sin pedir aumento. ¿Qué haría tu empleado si no tuviera que responder mensajes?" },
  { o: "\"¿Y si el bot dice algo mal?\"", r: "Tú lo configuras con tus productos y tus precios. NOVA solo habla de lo que tú le enseñas. Y en cualquier momento puedes actualizar la información en minutos." },
  { o: "\"No tengo tiempo para aprender esto\"", r: "No tienes que aprender nada. Yo lo configuro todo por ti en 24 horas. Tú solo me das la información de tu negocio y yo hago el resto." },
  { o: "\"¿Y si mis clientes prefieren hablar con humano?\"", r: "El 80% de las preguntas son siempre las mismas: precio, disponibilidad, horarios, cómo pagar. NOVA las responde mejor que un humano porque nunca se cansa ni se equivoca. Para lo complejo, el cliente siempre puede pedir hablar contigo." },
  { o: "\"Lo veo muy complicado\"", r: "Para ti no hay nada complicado. Yo me encargo de toda la técnica. Tú solo vas a ver los pedidos llegando. ¿Te muestro en 10 minutos cómo se ve desde el lado del cliente?" },
  { o: "\"¿Esto funciona en Colombia?\"", r: "Todos mis clientes son negocios colombianos. El bot habla en español colombiano, maneja precios en pesos, y funciona con Nequi y Daviplata. Está hecho para el mercado local." },
  { o: "\"Primero lo consulto con mi socio/pareja\"", r: "Perfecto. ¿Cuándo hablan? Los incluyo en la próxima llamada para mostrarles la demo a los dos. Así resuelven todas las dudas de una vez y no pierden más tiempo." },
];

const PLANS_PRESENTACION = [
  {
    nombre: "Plan Básico",
    precio: 390000,
    ideal: "Negocios que están arrancando o quieren probar",
    color: "#6b7280",
    incluye: ["1 red social (WhatsApp o Instagram)", "Hasta 1.000 mensajes al mes", "Catálogo hasta 15 productos", "Respuestas automáticas 24/7", "Soporte por WhatsApp", "Bot activo en 48 horas"],
    no_incluye: ["Toma de pedidos completa", "Múltiples redes", "Panel de métricas"]
  },
  {
    nombre: "Plan Pro ⭐",
    precio: 790000,
    ideal: "Negocios establecidos que quieren vender más",
    color: "#f59e0b",
    popular: true,
    incluye: ["3 redes sociales (WhatsApp + Instagram + Facebook)", "Mensajes ilimitados", "Catálogo ilimitado de productos", "Toma de pedidos completa", "Integración Nequi / Daviplata", "Panel de métricas de ventas", "Soporte prioritario 24/7", "Bot activo en 24 horas"],
    no_incluye: []
  },
  {
    nombre: "Plan Empresarial",
    precio: 1590000,
    ideal: "Cadenas, franquicias y empresas con múltiples puntos",
    color: "#a855f7",
    incluye: ["Todas las redes sociales", "Multi-sucursal / franquicia", "CRM integrado", "Reportes de ventas avanzados", "Manager dedicado", "Onboarding personalizado", "Garantía SLA 99.9%"],
    no_incluye: []
  }
];

/* ══════ PROPUESTA PDF ══════ */
function PropuestaComercial({ cliente, onClose }) {
  const [copied, setCopied] = useState(false);
  const plan = PLANS_PRESENTACION.find(p => p.nombre.includes(cliente.plan)) || PLANS_PRESENTACION[1];

  const texto = `━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
🤖 PROPUESTA COMERCIAL — NOVABOT
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Para: ${cliente.negocio}
Atención: ${cliente.nombre}
Fecha: ${new Date().toLocaleDateString("es-CO", { day: "numeric", month: "long", year: "numeric" })}

━━━ ¿QUÉ ES NOVABOT? ━━━

NOVA es tu asesor de ventas con inteligencia artificial. Responde automáticamente a tus clientes en WhatsApp, Instagram y Facebook — 24 horas al día, 7 días a la semana.

Habla como tu mejor vendedor: presenta productos, resuelve dudas, toma pedidos y cierra ventas, sin que tú estés pegado al celular.

━━━ TU PLAN RECOMENDADO ━━━

${plan.nombre} — ${COP(plan.precio)} COP / mes

✅ ${plan.incluye.join("\n✅ ")}

━━━ ¿QUÉ GANA ${cliente.negocio.toUpperCase()}? ━━━

• Si NOVA cierra solo 2 ventas extras al día con ticket de ${COP(cliente.ticket || 80000)} COP
→ Ingresos adicionales: ${COP((cliente.ticket || 80000) * 2 * 30)} / mes
→ Costo del bot: ${COP(plan.precio)} / mes
→ Ganancia neta extra: ${COP((cliente.ticket || 80000) * 2 * 30 - plan.precio)} / mes

• ROI estimado primer mes: ${Math.round(((cliente.ticket || 80000) * 2 * 30 - plan.precio) / plan.precio * 100)}%

━━━ CÓMO EMPEZAMOS ━━━

1️⃣ Nos confirmas los productos y precios
2️⃣ Realizas el pago del primer mes
3️⃣ En 24 horas NOVA está activo y vendiendo

Pago por: Nequi / Daviplata / Transferencia

━━━ GARANTÍA ━━━

Si en los primeros 30 días no ves resultados, te devolvemos el dinero completo. Sin preguntas.

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
¿Listo para que tu negocio venda solo?
Responde este mensaje y activamos NOVA esta semana 🚀
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━`;

  return (
    <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,.9)", zIndex: 1000, display: "flex", alignItems: "center", justifyContent: "center", padding: 20, backdropFilter: "blur(8px)" }}>
      <div style={{ width: "100%", maxWidth: 600, maxHeight: "90vh", background: "#08080f", border: "1px solid #f59e0b33", borderRadius: 24, overflow: "hidden", display: "flex", flexDirection: "column" }}>
        <div style={{ padding: "18px 24px", borderBottom: "1px solid #1a1a2a", display: "flex", alignItems: "center", gap: 12 }}>
          <div style={{ width: 36, height: 36, borderRadius: 10, background: "linear-gradient(135deg,#f59e0b,#d97706)", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 900 }}>N</div>
          <div style={{ flex: 1 }}>
            <div style={{ fontWeight: 800, fontSize: 15, fontFamily: "'Outfit',sans-serif" }}>Propuesta para {cliente.negocio}</div>
            <div style={{ color: "#555", fontSize: 12 }}>Lista para enviar por WhatsApp</div>
          </div>
          <button onClick={onClose} style={{ background: "#ffffff11", border: "none", color: "#888", borderRadius: 8, width: 32, height: 32, cursor: "pointer", fontSize: 16 }}>✕</button>
        </div>
        <div style={{ flex: 1, overflowY: "auto", padding: 20 }}>
          <pre style={{ color: "#ccc", fontSize: 13, lineHeight: 1.8, whiteSpace: "pre-wrap", fontFamily: "'Outfit', sans-serif" }}>{texto}</pre>
        </div>
        <div style={{ padding: 16, borderTop: "1px solid #1a1a2a", display: "flex", gap: 10 }}>
          <button onClick={() => { navigator.clipboard.writeText(texto); setCopied(true); setTimeout(() => setCopied(false), 2500); }}
            style={{ flex: 1, background: copied ? "linear-gradient(135deg,#22c55e,#16a34a)" : "linear-gradient(135deg,#f59e0b,#d97706)", border: "none", color: "#000", borderRadius: 12, padding: "12px", cursor: "pointer", fontSize: 14, fontWeight: 900, fontFamily: "'Outfit',sans-serif" }}>
            {copied ? "✅ ¡Copiado! Pégalo en WhatsApp" : "📋 Copiar propuesta completa"}
          </button>
        </div>
      </div>
    </div>
  );
}

/* ══════ GENERADOR DE PROPUESTA ══════ */
function GeneradorPropuesta() {
  const [form, setForm] = useState({ negocio: "", nombre: "", tipo: "Restaurante", plan: "Pro ⭐", ticket: "80000" });
  const [show, setShow] = useState(false);
  const set = (k, v) => setForm(f => ({ ...f, [k]: v }));
  const inp = { width: "100%", background: "#0d0d18", border: "1px solid #1e1e2e", borderRadius: 10, padding: "11px 14px", color: "#fff", fontSize: 13, outline: "none", fontFamily: "'Outfit',sans-serif", boxSizing: "border-box" };
  const lbl = { color: "#666", fontSize: 11, textTransform: "uppercase", letterSpacing: 1.5, marginBottom: 6, display: "block" };

  return (
    <div>
      <div style={{ background: "#0d0d18", border: "1px solid #1a1a2a", borderRadius: 20, padding: 24, marginBottom: 16 }}>
        <div style={{ color: "#f59e0b", fontSize: 11, fontWeight: 700, textTransform: "uppercase", letterSpacing: 2, marginBottom: 16 }}>Personaliza la propuesta</div>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }}>
          <div><label style={lbl}>Nombre del negocio</label><input style={inp} value={form.negocio} onChange={e => set("negocio", e.target.value)} placeholder="Ej: Tacos El Patrón" /></div>
          <div><label style={lbl}>Nombre del dueño</label><input style={inp} value={form.nombre} onChange={e => set("nombre", e.target.value)} placeholder="Ej: Juan Carlos" /></div>
          <div><label style={lbl}>Tipo de negocio</label>
            <select style={inp} value={form.tipo} onChange={e => set("tipo", e.target.value)}>
              {["Restaurante", "Boutique / Ropa", "Salón de belleza", "Tecnología", "Servicios", "Otro"].map(t => <option key={t}>{t}</option>)}
            </select>
          </div>
          <div><label style={lbl}>Plan recomendado</label>
            <select style={inp} value={form.plan} onChange={e => set("plan", e.target.value)}>
              {["Plan Básico", "Plan Pro ⭐", "Plan Empresarial"].map(p => <option key={p}>{p}</option>)}
            </select>
          </div>
          <div style={{ gridColumn: "1/-1" }}>
            <label style={lbl}>Ticket promedio del negocio (precio promedio de sus ventas en COP)</label>
            <input style={inp} type="number" value={form.ticket} onChange={e => set("ticket", e.target.value)} placeholder="80000" />
          </div>
        </div>
      </div>

      {/* ROI preview */}
      {form.negocio && (
        <div style={{ background: "linear-gradient(135deg,#f59e0b0d,#22c55e0d)", border: "1px solid #f59e0b22", borderRadius: 16, padding: 20, marginBottom: 16 }}>
          <div style={{ color: "#f59e0b", fontSize: 11, fontWeight: 700, textTransform: "uppercase", letterSpacing: 2, marginBottom: 12 }}>Preview del ROI para {form.negocio}</div>
          {(() => {
            const planPrecios = { "Plan Básico": 390000, "Plan Pro ⭐": 790000, "Plan Empresarial": 1590000 };
            const precio = planPrecios[form.plan] || 790000;
            const ticket = Number(form.ticket) || 80000;
            const extraMes = ticket * 2 * 30;
            const ganancia = extraMes - precio;
            return (
              <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 10 }}>
                {[
                  { l: "2 ventas extra/día", v: COP(extraMes), c: "#22c55e" },
                  { l: "Costo del bot", v: COP(precio), c: "#ef4444" },
                  { l: "Ganancia neta", v: COP(ganancia), c: "#f59e0b" },
                ].map(m => (
                  <div key={m.l} style={{ background: "#0a0a14", borderRadius: 10, padding: 14 }}>
                    <div style={{ color: m.c, fontWeight: 900, fontSize: 20 }}>{m.v}</div>
                    <div style={{ color: "#444", fontSize: 11, marginTop: 2 }}>{m.l}/mes</div>
                  </div>
                ))}
              </div>
            );
          })()}
        </div>
      )}

      <button onClick={() => form.negocio && form.nombre && setShow(true)}
        disabled={!form.negocio || !form.nombre}
        style={{ width: "100%", background: form.negocio && form.nombre ? "linear-gradient(135deg,#f59e0b,#d97706)" : "#1a1a2a", border: "none", color: form.negocio && form.nombre ? "#000" : "#333", borderRadius: 14, padding: "14px", cursor: form.negocio && form.nombre ? "pointer" : "default", fontSize: 15, fontWeight: 900, fontFamily: "'Outfit',sans-serif" }}>
        📄 Generar propuesta para enviar →
      </button>

      {show && <PropuestaComercial cliente={{ ...form, ticket: Number(form.ticket) }} onClose={() => setShow(false)} />}
    </div>
  );
}

/* ══════ APP PRINCIPAL ══════ */
export default function KitVentas() {
  const [tab, setTab] = useState("scripts");
  const [scriptIdx, setScriptIdx] = useState(0);
  const [objecionIdx, setObjecionIdx] = useState(null);
  const [planIdx, setPlanIdx] = useState(1);
  const [copiedIdx, setCopiedIdx] = useState(null);

  const copyText = (text, idx) => {
    navigator.clipboard.writeText(text);
    setCopiedIdx(idx);
    setTimeout(() => setCopiedIdx(null), 2500);
  };

  const tabs = [
    { id: "scripts", icon: "🎙️", label: "Guión de ventas" },
    { id: "objeciones", icon: "🛡️", label: "Objeciones" },
    { id: "planes", icon: "💎", label: "Presentar planes" },
    { id: "propuesta", icon: "📄", label: "Generar propuesta" },
    { id: "tips", icon: "🧠", label: "Tips psicológicos" },
  ];

  return (
    <div style={{ minHeight: "100vh", background: "#06060e", color: "#fff", fontFamily: "'Outfit', sans-serif" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Outfit:wght@300;400;500;600;700;800;900&display=swap');
        * { box-sizing: border-box; margin: 0; padding: 0; }
        ::-webkit-scrollbar { width: 4px; } ::-webkit-scrollbar-track { background: #0a0a14; } ::-webkit-scrollbar-thumb { background: #f59e0b33; border-radius: 2px; }
        @keyframes fadeUp { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }
        @keyframes pulse { 0%,100%{opacity:1} 50%{opacity:.3} }
        pre { white-space: pre-wrap; }
      `}</style>

      {/* HEADER */}
      <div style={{ background: "#08080f", borderBottom: "1px solid #1a1a2a", padding: "16px 24px", display: "flex", alignItems: "center", gap: 14 }}>
        <div style={{ width: 38, height: 38, borderRadius: 10, background: "linear-gradient(135deg,#f59e0b,#d97706)", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 900, fontSize: 18 }}>N</div>
        <div>
          <div style={{ fontWeight: 900, fontSize: 18, letterSpacing: -0.5 }}>Kit de Ventas NOVABot</div>
          <div style={{ color: "#555", fontSize: 12 }}>Todo lo que necesitas para vender y cerrar clientes en Colombia</div>
        </div>
        <div style={{ marginLeft: "auto", display: "flex", alignItems: "center", gap: 6 }}>
          <span style={{ width: 7, height: 7, borderRadius: "50%", background: "#22c55e", display: "inline-block", animation: "pulse 2s infinite" }} />
          <span style={{ color: "#22c55e", fontSize: 12, fontWeight: 700 }}>Listo para usar</span>
        </div>
      </div>

      {/* TABS */}
      <div style={{ background: "#08080f", borderBottom: "1px solid #1a1a2a", padding: "0 24px", display: "flex", gap: 4, overflowX: "auto" }}>
        {tabs.map(t => (
          <button key={t.id} onClick={() => setTab(t.id)} style={{ background: "transparent", border: "none", borderBottom: `2px solid ${tab === t.id ? "#f59e0b" : "transparent"}`, color: tab === t.id ? "#f59e0b" : "#555", padding: "14px 18px", cursor: "pointer", fontSize: 13, fontWeight: tab === t.id ? 800 : 500, fontFamily: "'Outfit',sans-serif", whiteSpace: "nowrap", transition: "all .2s" }}>
            {t.icon} {t.label}
          </button>
        ))}
      </div>

      <div style={{ maxWidth: 1000, margin: "0 auto", padding: 28 }}>

        {/* ══ GUIÓN DE VENTAS ══ */}
        {tab === "scripts" && (
          <div style={{ animation: "fadeUp .3s ease" }}>
            <div style={{ marginBottom: 24 }}>
              <h2 style={{ fontSize: 26, fontWeight: 900, letterSpacing: -0.5, marginBottom: 6 }}>🎙️ Guión completo de ventas</h2>
              <p style={{ color: "#555", fontSize: 14 }}>Exactamente qué decir en cada momento del proceso de venta</p>
            </div>

            <div style={{ display: "flex", gap: 16 }}>
              {/* Sidebar momentos */}
              <div style={{ width: 220, flexShrink: 0, display: "flex", flexDirection: "column", gap: 6 }}>
                {SCRIPTS.map((s, i) => (
                  <button key={i} onClick={() => setScriptIdx(i)} style={{ background: scriptIdx === i ? `${s.color}15` : "transparent", border: `1px solid ${scriptIdx === i ? s.color + "44" : "#1a1a2a"}`, borderRadius: 12, padding: "12px 14px", cursor: "pointer", textAlign: "left", transition: "all .2s" }}>
                    <div style={{ fontSize: 18, marginBottom: 4 }}>{s.icon}</div>
                    <div style={{ color: scriptIdx === i ? s.color : "#666", fontWeight: scriptIdx === i ? 700 : 500, fontSize: 12, lineHeight: 1.4, fontFamily: "'Outfit',sans-serif" }}>{s.momento}</div>
                  </button>
                ))}
              </div>

              {/* Contenido */}
              <div style={{ flex: 1 }}>
                {(() => {
                  const s = SCRIPTS[scriptIdx];
                  return (
                    <div style={{ animation: "fadeUp .2s ease" }}>
                      <div style={{ background: `${s.color}12`, border: `1px solid ${s.color}33`, borderRadius: 16, padding: "14px 18px", marginBottom: 16, display: "flex", alignItems: "center", gap: 12 }}>
                        <span style={{ fontSize: 24 }}>{s.icon}</span>
                        <div>
                          <div style={{ color: s.color, fontWeight: 800, fontSize: 15 }}>{s.momento}</div>
                          <div style={{ color: "#666", fontSize: 12, marginTop: 2 }}>{s.cuando}</div>
                        </div>
                      </div>
                      <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                        {s.guion.map((g, i) => (
                          <div key={i} style={{ background: "#0d0d18", border: `1px solid ${g.tipo.includes("NO") || g.tipo.includes("ERROR") ? "#ef444433" : "#1a1a2a"}`, borderRadius: 16, overflow: "hidden" }}>
                            <div style={{ padding: "10px 16px", borderBottom: "1px solid #1a1a2a", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                              <span style={{ color: g.tipo.includes("NO") ? "#ef4444" : g.tipo.includes("TU") || g.tipo.includes("CIERRE") || g.tipo.includes("RESPUESTA") ? s.color : "#888", fontWeight: 800, fontSize: 11, textTransform: "uppercase", letterSpacing: 1.5 }}>{g.tipo}</span>
                              {!g.tipo.includes("NO") && (
                                <button onClick={() => copyText(g.texto, `${scriptIdx}-${i}`)} style={{ background: copiedIdx === `${scriptIdx}-${i}` ? "#22c55e22" : "#f59e0b18", border: `1px solid ${copiedIdx === `${scriptIdx}-${i}` ? "#22c55e44" : "#f59e0b44"}`, color: copiedIdx === `${scriptIdx}-${i}` ? "#22c55e" : "#f59e0b", borderRadius: 8, padding: "4px 12px", cursor: "pointer", fontSize: 11, fontWeight: 700, fontFamily: "'Outfit',sans-serif" }}>
                                  {copiedIdx === `${scriptIdx}-${i}` ? "✓ Copiado" : "Copiar"}
                                </button>
                              )}
                            </div>
                            <div style={{ padding: "14px 16px" }}>
                              <pre style={{ color: g.tipo.includes("NO") ? "#ef4444" : "#ccc", fontSize: 13, lineHeight: 1.8, fontFamily: "'Outfit',sans-serif" }}>{g.texto}</pre>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  );
                })()}
              </div>
            </div>
          </div>
        )}

        {/* ══ OBJECIONES ══ */}
        {tab === "objeciones" && (
          <div style={{ animation: "fadeUp .3s ease" }}>
            <div style={{ marginBottom: 24 }}>
              <h2 style={{ fontSize: 26, fontWeight: 900, letterSpacing: -0.5, marginBottom: 6 }}>🛡️ Manejo de objeciones</h2>
              <p style={{ color: "#555", fontSize: 14 }}>Las 8 objeciones más comunes en Colombia y cómo responderlas</p>
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
              {OBJECIONES.map((o, i) => (
                <div key={i} style={{ background: "#0d0d18", border: `1px solid ${objecionIdx === i ? "#f59e0b44" : "#1a1a2a"}`, borderRadius: 16, overflow: "hidden", cursor: "pointer", transition: "all .2s" }} onClick={() => setObjecionIdx(objecionIdx === i ? null : i)}>
                  <div style={{ padding: "16px 20px", display: "flex", alignItems: "center", gap: 12 }}>
                    <div style={{ width: 32, height: 32, borderRadius: "50%", background: "#ef444418", border: "1px solid #ef444433", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 14, flexShrink: 0 }}>😤</div>
                    <div style={{ flex: 1, fontWeight: 700, fontSize: 14, color: "#ef4444", fontFamily: "'Outfit',sans-serif" }}>{o.o}</div>
                    <span style={{ color: "#444", fontSize: 20, transition: "transform .2s", transform: objecionIdx === i ? "rotate(90deg)" : "none" }}>›</span>
                  </div>
                  {objecionIdx === i && (
                    <div style={{ borderTop: "1px solid #1a1a2a", padding: "16px 20px", background: "#22c55e08", animation: "fadeUp .2s ease" }}>
                      <div style={{ display: "flex", gap: 10, alignItems: "flex-start", marginBottom: 12 }}>
                        <div style={{ width: 28, height: 28, borderRadius: "50%", background: "#22c55e22", border: "1px solid #22c55e44", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 14, flexShrink: 0 }}>✓</div>
                        <div style={{ color: "#888", fontSize: 13, lineHeight: 1.7, fontFamily: "'Outfit',sans-serif" }}>{o.r}</div>
                      </div>
                      <button onClick={e => { e.stopPropagation(); copyText(o.r, `obj-${i}`); }} style={{ background: copiedIdx === `obj-${i}` ? "#22c55e22" : "#f59e0b18", border: `1px solid ${copiedIdx === `obj-${i}` ? "#22c55e44" : "#f59e0b44"}`, color: copiedIdx === `obj-${i}` ? "#22c55e" : "#f59e0b", borderRadius: 10, padding: "8px 18px", cursor: "pointer", fontSize: 12, fontWeight: 800, fontFamily: "'Outfit',sans-serif" }}>
                        {copiedIdx === `obj-${i}` ? "✓ ¡Copiado!" : "📋 Copiar respuesta"}
                      </button>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ══ PRESENTAR PLANES ══ */}
        {tab === "planes" && (
          <div style={{ animation: "fadeUp .3s ease" }}>
            <div style={{ marginBottom: 24 }}>
              <h2 style={{ fontSize: 26, fontWeight: 900, letterSpacing: -0.5, marginBottom: 6 }}>💎 Cómo presentar los planes</h2>
              <p style={{ color: "#555", fontSize: 14 }}>Usa esto para mostrarle al cliente las opciones de forma visual</p>
            </div>

            <div style={{ background: "#0d0d18", border: "1px solid #f59e0b22", borderRadius: 16, padding: 20, marginBottom: 20 }}>
              <div style={{ color: "#f59e0b", fontWeight: 700, fontSize: 12, textTransform: "uppercase", letterSpacing: 2, marginBottom: 10 }}>💡 Estrategia de presentación de precios</div>
              <p style={{ color: "#888", fontSize: 13, lineHeight: 1.8 }}>
                Siempre muestra los 3 planes. La mayoría elige el del medio (Pro). El Empresarial hace que el Pro parezca económico. El Básico da tranquilidad de que hay opción más barata.<br /><br />
                <strong style={{ color: "#fff" }}>Nunca empieces por el precio.</strong> Primero muestra el valor y los resultados. El precio lo mencionas al final, después de que el cliente ya vio lo que obtiene.
              </p>
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 14, marginBottom: 24 }}>
              {PLANS_PRESENTACION.map((p, i) => (
                <div key={i} onClick={() => setPlanIdx(i)} style={{ background: planIdx === i ? `${p.color}12` : "#0d0d18", border: `2px solid ${planIdx === i ? p.color + "66" : "#1a1a2a"}`, borderRadius: 20, padding: 24, cursor: "pointer", transition: "all .25s", position: "relative", transform: p.popular && planIdx === i ? "scale(1.02)" : "none" }}>
                  {p.popular && <div style={{ position: "absolute", top: -12, left: "50%", transform: "translateX(-50%)", background: `linear-gradient(135deg,${p.color},${p.color}cc)`, borderRadius: 20, padding: "4px 16px", fontSize: 10, fontWeight: 900, color: "#000", whiteSpace: "nowrap" }}>⭐ MÁS VENDIDO</div>}
                  <div style={{ color: p.color, fontWeight: 800, fontSize: 12, textTransform: "uppercase", letterSpacing: 2, marginBottom: 8 }}>{p.nombre}</div>
                  <div style={{ fontWeight: 900, fontSize: 28, letterSpacing: -0.5, color: p.color, marginBottom: 4 }}>{COP(p.precio)}</div>
                  <div style={{ color: "#444", fontSize: 11, marginBottom: 12 }}>COP / mes</div>
                  <div style={{ color: "#666", fontSize: 12, marginBottom: 16, fontStyle: "italic" }}>{p.ideal}</div>
                  <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
                    {p.incluye.map(f => <div key={f} style={{ display: "flex", gap: 8, fontSize: 12 }}><span style={{ color: p.color }}>✓</span><span style={{ color: "#aaa" }}>{f}</span></div>)}
                    {p.no_incluye.map(f => <div key={f} style={{ display: "flex", gap: 8, fontSize: 12 }}><span style={{ color: "#333" }}>✕</span><span style={{ color: "#333" }}>{f}</span></div>)}
                  </div>
                </div>
              ))}
            </div>

            <div style={{ background: "#0d0d18", border: "1px solid #1a1a2a", borderRadius: 16, padding: 20 }}>
              <div style={{ color: "#f59e0b", fontWeight: 700, fontSize: 12, textTransform: "uppercase", letterSpacing: 2, marginBottom: 14 }}>Guión para presentar el plan {PLANS_PRESENTACION[planIdx].nombre}</div>
              {(() => {
                const p = PLANS_PRESENTACION[planIdx];
                const texto = `"Para tu tipo de negocio, te recomiendo el ${p.nombre}.\n\nPor ${COP(p.precio)} al mes tienes:\n${p.incluye.map(f => `✅ ${f}`).join("\n")}\n\nEso significa que NOVA va a responder a tus clientes, presentar tus productos, tomar los pedidos y ayudar a cerrar las ventas — todo sin que tú estés disponible.\n\nConsidera que el plan más completo (Empresarial) está a ${COP(1590000)}. Comparado con eso, el ${p.nombre} te da el 90% de las funcionalidades que realmente necesitas.\n\n¿Tiene sentido para lo que estás buscando?"`;
                return (
                  <div>
                    <pre style={{ color: "#ccc", fontSize: 13, lineHeight: 1.8, fontFamily: "'Outfit',sans-serif", marginBottom: 14 }}>{texto}</pre>
                    <button onClick={() => copyText(texto, "plan-script")} style={{ background: copiedIdx === "plan-script" ? "#22c55e22" : "#f59e0b18", border: `1px solid ${copiedIdx === "plan-script" ? "#22c55e44" : "#f59e0b44"}`, color: copiedIdx === "plan-script" ? "#22c55e" : "#f59e0b", borderRadius: 10, padding: "8px 18px", cursor: "pointer", fontSize: 12, fontWeight: 800, fontFamily: "'Outfit',sans-serif" }}>
                      {copiedIdx === "plan-script" ? "✓ Copiado" : "📋 Copiar guión"}
                    </button>
                  </div>
                );
              })()}
            </div>
          </div>
        )}

        {/* ══ PROPUESTA ══ */}
        {tab === "propuesta" && (
          <div style={{ animation: "fadeUp .3s ease" }}>
            <div style={{ marginBottom: 24 }}>
              <h2 style={{ fontSize: 26, fontWeight: 900, letterSpacing: -0.5, marginBottom: 6 }}>📄 Generar propuesta comercial</h2>
              <p style={{ color: "#555", fontSize: 14 }}>Crea una propuesta personalizada lista para enviar por WhatsApp en segundos</p>
            </div>
            <GeneradorPropuesta />
          </div>
        )}

        {/* ══ TIPS PSICOLÓGICOS ══ */}
        {tab === "tips" && (
          <div style={{ animation: "fadeUp .3s ease" }}>
            <div style={{ marginBottom: 24 }}>
              <h2 style={{ fontSize: 26, fontWeight: 900, letterSpacing: -0.5, marginBottom: 6 }}>🧠 Psicología de ventas</h2>
              <p style={{ color: "#555", fontSize: 14 }}>Las técnicas que usan los mejores vendedores del mundo — aplicadas a NOVABot</p>
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }}>
              {[
                { icon: "😮", titulo: "El efecto WOW en la demo", color: "#f59e0b", tip: "Cuando hagas la demo, deja que el CLIENTE escriba, no tú. Cuando ve al bot respondiendo en tiempo real a SUS preguntas, el impacto es 10 veces mayor. El cerebro valora más lo que experimenta que lo que le explican.", accion: "Abre la demo, dale el celular al cliente y di: 'Escríbele como si fueras tu cliente'." },
                { icon: "📊", titulo: "Vende con números, no con palabras", color: "#3b82f6", tip: "El cerebro rechaza argumentos subjetivos ('es muy bueno', 'funciona muy bien') pero acepta números ('3 ventas extras al día × $80.000 = $7.200.000 al mes'). Siempre traduce los beneficios a pesos colombianos.", accion: "Antes de cada reunión, calcula el ROI específico para ese negocio y tenlo listo." },
                { icon: "⏰", titulo: "Urgencia real (no falsa)", color: "#ef4444", tip: "La urgencia falsa destruye la confianza. La urgencia real cierra ventas. Usa: 'Tengo 2 configuraciones disponibles esta semana' o 'La promo de instalación gratis vence el viernes'. Si no es verdad, no lo digas.", accion: "Limita genuinamente tus onboardings a 3-4 por semana para crear urgencia real." },
                { icon: "🤝", titulo: "La garantía elimina el miedo", color: "#22c55e", tip: "El mayor freno para comprar es el miedo a perder dinero. Tu garantía de 30 días convierte una decisión arriesgada en una sin riesgo. Menciona la garantía SIEMPRE en el cierre, no como defensa sino como ventaja.", accion: "Di: 'Y lo mejor: si en 30 días no ves resultados, te devuelvo el dinero completo. Sin preguntas.'" },
                { icon: "👥", titulo: "Prueba social colombiana", color: "#a855f7", tip: "Los colombianos compramos lo que compran otras personas de nuestra ciudad o sector. 'Un restaurante en [misma ciudad]' funciona 3 veces mejor que 'un negocio'. Siempre especifica la ciudad y el tipo de negocio similar.", accion: "Guarda los resultados de cada cliente (ventas cerradas, ingresos extra) y úsalos como casos de éxito locales." },
                { icon: "🎯", titulo: "El cliente que dice 'no' hoy puede decir 'sí' mañana", color: "#f97316", tip: "El 80% de las ventas se cierran entre el contacto 5 y 12. La mayoría de vendedores se rinden en el 2. Crea un sistema de seguimiento: día 1 (demo), día 3 (caso de éxito), día 7 (oferta especial), día 14 (último intento).", accion: "Usa una libreta o el app de notas para llevar seguimiento de cada prospecto con fecha de próximo contacto." },
                { icon: "💬", titulo: "Habla menos, escucha más", color: "#06b6d4", tip: "El vendedor promedio habla 70% del tiempo. El vendedor élite escucha 70%. Haz preguntas que descubran el dolor real: '¿Cuántas ventas pierdes a la semana por no poder responder?' Deja que el cliente se convenza solo.", accion: "En la próxima reunión, habla máximo 40% del tiempo. Haz preguntas y escucha activamente." },
                { icon: "🌟", titulo: "El referido vale 10 veces más", color: "#22c55e", tip: "Un cliente referido cierra 5 veces más fácil y paga más. Un cliente satisfecho es tu mejor vendedor. Pide el referido en el momento de máxima satisfacción: cuando el cliente te muestra sus primeros resultados.", accion: "Programa un mensaje de seguimiento a los 15 días de cada nuevo cliente para pedirle el referido." },
              ].map(t => (
                <div key={t.titulo} style={{ background: "#0d0d18", border: `1px solid ${t.color}22`, borderRadius: 18, padding: 22, transition: "all .25s" }}
                  onMouseEnter={e => e.currentTarget.style.borderColor = t.color + "55"}
                  onMouseLeave={e => e.currentTarget.style.borderColor = t.color + "22"}>
                  <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 12 }}>
                    <span style={{ fontSize: 26 }}>{t.icon}</span>
                    <span style={{ color: t.color, fontWeight: 800, fontSize: 14 }}>{t.titulo}</span>
                  </div>
                  <p style={{ color: "#888", fontSize: 13, lineHeight: 1.75, marginBottom: 14 }}>{t.tip}</p>
                  <div style={{ background: `${t.color}0d`, border: `1px solid ${t.color}22`, borderRadius: 10, padding: "10px 14px", fontSize: 12, color: t.color, lineHeight: 1.6 }}>
                    ▶ <strong>Acción:</strong> {t.accion}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
