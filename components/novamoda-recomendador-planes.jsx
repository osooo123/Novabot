import { useState } from "react";

const COP = n => `$${new Intl.NumberFormat("es-CO").format(n)}`;

/* ══════════════════════════════════════
   PREGUNTAS DEL DIAGNÓSTICO
══════════════════════════════════════ */
const PREGUNTAS = [
  {
    id: "mensajes",
    pregunta: "¿Cuántos mensajes de clientas reciben al día preguntando por productos, tallas y precios?",
    emoji: "💬",
    ayuda: "Cuenta WhatsApp + Instagram DM + Facebook juntos",
    opciones: [
      { valor: 1, texto: "Menos de 10 mensajes al día", detalle: "Tienda pequeña o recién arrancando" },
      { valor: 2, texto: "Entre 10 y 30 mensajes al día", detalle: "Tienda activa con clientas regulares" },
      { valor: 3, texto: "Entre 30 y 80 mensajes al día", detalle: "Boutique establecida con buen flujo" },
      { valor: 4, texto: "Más de 80 mensajes al día", detalle: "Alto volumen, difícil de manejar solo" },
    ]
  },
  {
    id: "redes",
    pregunta: "¿Por cuáles redes sociales recibe mensajes y vende actualmente?",
    emoji: "📱",
    ayuda: "Selecciona todas las que uses para atender clientas",
    opciones: [
      { valor: 1, texto: "Solo WhatsApp", detalle: "Un solo canal de ventas" },
      { valor: 2, texto: "Solo Instagram DM", detalle: "Ventas principalmente por Instagram" },
      { valor: 3, texto: "WhatsApp + Instagram", detalle: "Dos canales activos" },
      { valor: 4, texto: "WhatsApp + Instagram + Facebook", detalle: "Presencia en múltiples plataformas" },
    ]
  },
  {
    id: "tiempo",
    pregunta: "¿Cuántas horas al día gasta el dueño o empleado respondiendo mensajes de clientas?",
    emoji: "⏰",
    ayuda: "Sé honesto, incluyendo los mensajes de noche y fines de semana",
    opciones: [
      { valor: 1, texto: "Menos de 1 hora al día", detalle: "Poco tiempo invertido en atención" },
      { valor: 2, texto: "Entre 1 y 2 horas al día", detalle: "Tiempo considerable en mensajes" },
      { valor: 3, texto: "Entre 2 y 4 horas al día", detalle: "Gran parte del día en el celular" },
      { valor: 4, texto: "Más de 4 horas o todo el día", detalle: "El celular consume el negocio" },
    ]
  },
  {
    id: "ventas_perdidas",
    pregunta: "¿Con qué frecuencia pierde ventas por no responder a tiempo o estar ocupado?",
    emoji: "💸",
    ayuda: "Piensa en clientas que preguntaron pero nunca compraron",
    opciones: [
      { valor: 1, texto: "Casi nunca, respondo todo", detalle: "Buen control de mensajes" },
      { valor: 2, texto: "A veces, 2 o 3 por semana", detalle: "Algunas oportunidades perdidas" },
      { valor: 3, texto: "Frecuentemente, casi todos los días", detalle: "Pérdida constante de ventas" },
      { valor: 4, texto: "Siempre, es un problema grave", detalle: "Problema crítico de atención" },
    ]
  },
  {
    id: "catalogo",
    pregunta: "¿Cuántos productos o referencias maneja la tienda?",
    emoji: "🛍️",
    ayuda: "Cuenta tallas y colores diferentes como referencias separadas",
    opciones: [
      { valor: 1, texto: "Menos de 20 referencias", detalle: "Catálogo pequeño y manejable" },
      { valor: 2, texto: "Entre 20 y 50 referencias", detalle: "Catálogo mediano" },
      { valor: 3, texto: "Entre 50 y 150 referencias", detalle: "Catálogo amplio con variedad" },
      { valor: 4, texto: "Más de 150 referencias o drops frecuentes", detalle: "Catálogo grande o colecciones nuevas constantes" },
    ]
  },
  {
    id: "pedidos",
    pregunta: "¿Cómo toma los pedidos actualmente?",
    emoji: "📦",
    ayuda: "El proceso desde que la clienta confirma hasta que empacas",
    opciones: [
      { valor: 1, texto: "Solo muestra productos, no toma pedidos por chat", detalle: "Las clientas vienen a la tienda" },
      { valor: 2, texto: "Anota los pedidos en WhatsApp manualmente", detalle: "Proceso manual y desordenado" },
      { valor: 3, texto: "Tiene un proceso definido con datos y pagos", detalle: "Sistema básico funcionando" },
      { valor: 4, texto: "Quiere automatizar pedidos, pagos y seguimiento completo", detalle: "Listo para escalar" },
    ]
  },
  {
    id: "presupuesto",
    pregunta: "¿Cuánto estaría dispuesto a invertir mensualmente en una herramienta que le aumente las ventas?",
    emoji: "💰",
    ayuda: "Piénsalo como una inversión que se paga sola con ventas extra",
    opciones: [
      { valor: 1, texto: "Hasta $200.000 COP al mes", detalle: "Presupuesto inicial, quiere probar" },
      { valor: 2, texto: "Entre $200.000 y $300.000 COP", detalle: "Dispuesto a invertir si ve resultados" },
      { valor: 3, texto: "Entre $300.000 y $450.000 COP", detalle: "Ve la tecnología como inversión clave" },
      { valor: 4, texto: "Más de $450.000 si le genera más ventas", detalle: "Totalmente enfocado en resultados" },
    ]
  },
  {
    id: "objetivo",
    pregunta: "¿Cuál es el objetivo principal que quiere lograr con NOVA?",
    emoji: "🎯",
    ayuda: "El resultado más importante para el negocio",
    opciones: [
      { valor: 1, texto: "Ahorrar tiempo respondiendo preguntas básicas", detalle: "Liberarse del celular" },
      { valor: 2, texto: "No perder ventas cuando está ocupada o dormida", detalle: "Atención 24/7" },
      { valor: 3, texto: "Aumentar ventas con outfits completos y recomendaciones", detalle: "Subir el ticket promedio" },
      { valor: 4, texto: "Escalar el negocio sin contratar más personal", detalle: "Crecer sin aumentar costos" },
    ]
  },
];

/* ══════════════════════════════════════
   LÓGICA DE RECOMENDACIÓN
══════════════════════════════════════ */
function calcularPlan(respuestas) {
  const vals = Object.values(respuestas);
  const promedio = vals.reduce((s, v) => s + v, 0) / vals.length;
  const maxVal = Math.max(...vals);

  // Factores críticos que determinan plan
  const mensajes = respuestas.mensajes || 1;
  const redes = respuestas.redes || 1;
  const presupuesto = respuestas.presupuesto || 1;
  const pedidos = respuestas.pedidos || 1;

  let plan, score;

  if (presupuesto === 1 || (promedio <= 1.8 && maxVal <= 2)) {
    plan = "basico";
    score = Math.round(promedio * 20);
  } else if (presupuesto >= 3 || mensajes >= 3 || redes >= 3 || pedidos >= 3 || promedio >= 2.8) {
    plan = "premium";
    score = Math.round(promedio * 25);
  } else {
    plan = "pro";
    score = Math.round(promedio * 22);
  }

  return { plan, score: Math.min(score, 100), promedio: Math.round(promedio * 10) / 10 };
}

function generarArgumentos(respuestas, plan) {
  const args = [];

  if (respuestas.mensajes >= 3) args.push(`Recibe más de 30 mensajes diarios — NOVA los responde todos al instante, sin importar la hora`);
  if (respuestas.redes >= 3) args.push(`Vende en múltiples redes — NOVA unifica la atención en WhatsApp e Instagram`);
  if (respuestas.tiempo >= 3) args.push(`Invierte más de 2 horas diarias en mensajes — NOVA le devuelve ese tiempo para enfocarse en el negocio`);
  if (respuestas.ventas_perdidas >= 3) args.push(`Pierde ventas frecuentemente — NOVA no deja ir ninguna clienta sin respuesta`);
  if (respuestas.catalogo >= 3) args.push(`Maneja un catálogo amplio — NOVA lo conoce todo y recomienda outfits completos`);
  if (respuestas.pedidos >= 3) args.push(`Quiere automatizar pedidos — NOVA recopila nombre, dirección, talla y método de pago sola`);
  if (respuestas.objetivo >= 3) args.push(`Su meta es escalar sin más personal — NOVA es el empleado virtual que trabaja 24/7`);

  // Si tiene pocos argumentos, agrega genéricos
  if (args.length < 2) {
    args.push("NOVA atiende a sus clientas mientras el dueño se ocupa de otras cosas");
    args.push("Bot activo en menos de 24 horas con todo el catálogo configurado");
  }

  return args.slice(0, 4);
}

function calcularROI(respuestas, planKey) {
  const precios = { basico: 200000, pro: 290000, premium: 420000 };
  const precio = precios[planKey];

  // Estimación conservadora de ventas extras
  const ventasDiarias = respuestas.mensajes >= 3 ? 4 : respuestas.mensajes >= 2 ? 2 : 1;
  const ticketEstimado = 150000; // ticket promedio ropa Colombia
  const ingresoExtra = ventasDiarias * ticketEstimado * 30;
  const ganancia = ingresoExtra - precio;
  const roi = Math.round((ganancia / precio) * 100);

  return { ventasDiarias, ingresoExtra, ganancia, roi, precio };
}

/* ══════════════════════════════════════
   PLANES
══════════════════════════════════════ */
const PLANES = {
  basico: {
    nombre: "Plan Básico",
    precio: 200000,
    color: "#6b7280",
    emoji: "🌱",
    tagline: "Para arrancar sin riesgo",
    ideal: "Tiendas pequeñas o emprendedoras que quieren probar el servicio con bajo riesgo.",
    incluye: [
      "1 red social (WhatsApp O Instagram)",
      "Hasta 500 mensajes al mes",
      "Catálogo hasta 20 productos",
      "Respuestas automáticas 24/7",
      "Soporte por WhatsApp en horario hábil",
      "Bot activo en 48 horas",
    ],
    no_incluye: [
      "Múltiples redes sociales",
      "Toma de pedidos completa",
      "Actualizaciones ilimitadas de catálogo",
    ],
    upgrade: "Cuando el negocio crezca y necesite más de 500 mensajes al mes o vender en más redes, pasas automáticamente al Plan Pro.",
  },
  pro: {
    nombre: "Plan Pro ⭐",
    precio: 290000,
    color: "#ec4899",
    emoji: "🚀",
    tagline: "El más elegido por boutiques colombianas",
    ideal: "Boutiques activas que venden por WhatsApp e Instagram y quieren automatizar ventas y pedidos completos.",
    incluye: [
      "WhatsApp + Instagram (2 redes)",
      "Mensajes ilimitados",
      "Catálogo ilimitado de productos",
      "Toma de pedidos completa (nombre, dirección, talla, pago)",
      "Recomendación de outfit completo",
      "2 actualizaciones de catálogo por mes incluidas",
      "Soporte prioritario 24/7",
      "Bot activo en 24 horas",
    ],
    no_incluye: [],
    upgrade: "Si la tienda crece a múltiples sucursales o quiere reportes detallados mensuales, el Plan Premium tiene eso cubierto.",
  },
  premium: {
    nombre: "Plan Premium 💎",
    precio: 420000,
    color: "#a855f7",
    emoji: "💎",
    tagline: "Para tiendas que quieren escalar en serio",
    ideal: "Tiendas con alto volumen de ventas, múltiples catálogos por temporada, o dueños que quieren delegar la operación completa.",
    incluye: [
      "WhatsApp + Instagram + Facebook (3 redes)",
      "Mensajes ilimitados",
      "Multi-catálogo por temporada o colección",
      "WhatsApp Business API real incluida",
      "Toma de pedidos y seguimiento automatizado",
      "Reporte mensual de ventas cerradas por NOVA",
      "Actualizaciones ilimitadas de catálogo",
      "Manager dedicado — atención inmediata",
      "Bot activo en 12 horas",
    ],
    no_incluye: [],
    upgrade: null,
  },
};

/* ══════════════════════════════════════
   COMPONENTES
══════════════════════════════════════ */
function BarraProgreso({ actual, total, color }) {
  return (
    <div style={{ width: "100%", height: 6, background: "#1a1a2a", borderRadius: 3, overflow: "hidden" }}>
      <div style={{ height: "100%", width: `${(actual / total) * 100}%`, background: `linear-gradient(90deg, ${color}, ${color}cc)`, borderRadius: 3, transition: "width .5s ease" }} />
    </div>
  );
}

function TarjetaResultado({ planKey, respuestas, onReset, onCopyPitch }) {
  const plan = PLANES[planKey];
  const args = generarArgumentos(respuestas, planKey);
  const roi = calcularROI(respuestas, planKey);
  const [copied, setCopied] = useState(false);
  const [copiedPitch, setCopiedPitch] = useState(false);

  const pitch = `Hola! Basándonos en tu negocio, te recomiendo el ${plan.nombre} de NOVAModa.

¿Por qué? ${args.slice(0, 2).join(". ")}.

Con el ${plan.nombre} a ${COP(plan.precio)}/mes:
${plan.incluye.slice(0, 4).map(i => `✅ ${i}`).join("\n")}

Si NOVA cierra solo ${roi.ventasDiarias} ventas extra al día con ticket de $150.000, eso son ${COP(roi.ingresoExtra)} adicionales al mes. El bot se paga solo en los primeros días.

Tienes garantía de 30 días — si no ves resultados, te devuelvo el dinero completo.

¿Arrancamos esta semana? 🚀`;

  return (
    <div style={{ animation: "fadeUp .5s ease" }}>
      {/* Header resultado */}
      <div style={{ textAlign: "center", marginBottom: 28 }}>
        <div style={{ fontSize: 52, marginBottom: 12 }}>{plan.emoji}</div>
        <div style={{ color: plan.color, fontSize: 12, fontWeight: 700, textTransform: "uppercase", letterSpacing: 3, marginBottom: 8 }}>
          Plan recomendado
        </div>
        <h2 style={{ fontSize: 32, fontWeight: 900, letterSpacing: -1, marginBottom: 6 }}>{plan.nombre}</h2>
        <p style={{ color: "#666", fontSize: 15, marginBottom: 16 }}>{plan.tagline}</p>
        <div style={{ display: "inline-flex", alignItems: "baseline", gap: 6, background: `${plan.color}15`, border: `1px solid ${plan.color}44`, borderRadius: 20, padding: "10px 24px" }}>
          <span style={{ color: plan.color, fontWeight: 900, fontSize: 32, letterSpacing: -1 }}>{COP(plan.precio)}</span>
          <span style={{ color: "#444", fontSize: 14 }}>COP / mes</span>
        </div>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16, marginBottom: 16 }}>
        {/* Por qué este plan */}
        <div style={{ background: "#0a0a14", border: `1px solid ${plan.color}22`, borderRadius: 18, padding: 22 }}>
          <div style={{ color: plan.color, fontSize: 11, fontWeight: 700, textTransform: "uppercase", letterSpacing: 2, marginBottom: 14 }}>
            Por qué este plan es ideal
          </div>
          <p style={{ color: "#777", fontSize: 13, lineHeight: 1.7, marginBottom: 14 }}>{plan.ideal}</p>
          <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
            {args.map((a, i) => (
              <div key={i} style={{ display: "flex", gap: 10, alignItems: "flex-start" }}>
                <span style={{ color: plan.color, flexShrink: 0, fontWeight: 900, marginTop: 1 }}>✓</span>
                <span style={{ color: "#666", fontSize: 13, lineHeight: 1.6 }}>{a}</span>
              </div>
            ))}
          </div>
        </div>

        {/* ROI */}
        <div style={{ background: "#0a0a14", border: "1px solid #22c55e22", borderRadius: 18, padding: 22 }}>
          <div style={{ color: "#22c55e", fontSize: 11, fontWeight: 700, textTransform: "uppercase", letterSpacing: 2, marginBottom: 14 }}>
            Retorno de inversión estimado
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
            {[
              { l: "Ventas extra que NOVA puede cerrar", v: `+${roi.ventasDiarias} al día`, c: "#3b82f6" },
              { l: "Ingresos adicionales al mes", v: COP(roi.ingresoExtra), c: "#22c55e" },
              { l: "Costo del plan", v: `- ${COP(roi.precio)}`, c: "#ef4444" },
              { l: "Ganancia neta extra", v: COP(roi.ganancia), c: "#f59e0b" },
            ].map(m => (
              <div key={m.l} style={{ display: "flex", justifyContent: "space-between", padding: "8px 12px", background: "#060610", borderRadius: 10 }}>
                <span style={{ color: "#444", fontSize: 12 }}>{m.l}</span>
                <span style={{ color: m.c, fontWeight: 800, fontSize: 13 }}>{m.v}</span>
              </div>
            ))}
            <div style={{ background: "#22c55e0d", border: "1px solid #22c55e33", borderRadius: 10, padding: "10px 12px", textAlign: "center" }}>
              <span style={{ color: "#22c55e", fontWeight: 900, fontSize: 18 }}>ROI {roi.roi}%</span>
              <div style={{ color: "#555", fontSize: 11, marginTop: 2 }}>primer mes estimado</div>
            </div>
          </div>
        </div>
      </div>

      {/* Qué incluye */}
      <div style={{ background: "#0a0a14", border: "1px solid #1a1a2a", borderRadius: 18, padding: 22, marginBottom: 16 }}>
        <div style={{ color: "#fff", fontSize: 13, fontWeight: 700, marginBottom: 14 }}>✅ Qué incluye el {plan.nombre}</div>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 }}>
          {plan.incluye.map(f => (
            <div key={f} style={{ display: "flex", gap: 8, alignItems: "flex-start" }}>
              <span style={{ color: plan.color, flexShrink: 0, fontWeight: 700 }}>✓</span>
              <span style={{ color: "#888", fontSize: 13 }}>{f}</span>
            </div>
          ))}
        </div>
        {plan.no_incluye.length > 0 && (
          <div style={{ marginTop: 14, paddingTop: 14, borderTop: "1px solid #1a1a2a" }}>
            <div style={{ color: "#333", fontSize: 11, marginBottom: 8 }}>No incluye (disponible en plan superior):</div>
            {plan.no_incluye.map(f => (
              <div key={f} style={{ display: "flex", gap: 8, alignItems: "center", marginBottom: 4 }}>
                <span style={{ color: "#2a2a3a", flexShrink: 0 }}>✕</span>
                <span style={{ color: "#2a2a3a", fontSize: 12 }}>{f}</span>
              </div>
            ))}
          </div>
        )}
        {plan.upgrade && (
          <div style={{ marginTop: 14, background: `${plan.color}0d`, border: `1px solid ${plan.color}22`, borderRadius: 10, padding: "10px 14px" }}>
            <span style={{ color: plan.color, fontSize: 12 }}>⬆️ {plan.upgrade}</span>
          </div>
        )}
      </div>

      {/* Pitch listo */}
      <div style={{ background: "#0a0a14", border: "1px solid #f59e0b22", borderRadius: 18, padding: 22, marginBottom: 16 }}>
        <div style={{ color: "#f59e0b", fontSize: 11, fontWeight: 700, textTransform: "uppercase", letterSpacing: 2, marginBottom: 14 }}>
          💬 Argumento de venta listo para usar
        </div>
        <pre style={{ color: "#888", fontSize: 13, lineHeight: 1.8, whiteSpace: "pre-wrap", fontFamily: "'DM Sans',sans-serif", marginBottom: 14 }}>{pitch}</pre>
        <button onClick={() => { navigator.clipboard.writeText(pitch); setCopiedPitch(true); setTimeout(() => setCopiedPitch(false), 2500); }}
          style={{ background: copiedPitch ? "linear-gradient(135deg,#22c55e,#16a34a)" : "linear-gradient(135deg,#f59e0b,#d97706)", border: "none", color: copiedPitch ? "#fff" : "#000", borderRadius: 12, padding: "11px 24px", cursor: "pointer", fontSize: 13, fontWeight: 800, fontFamily: "'DM Sans',sans-serif" }}>
          {copiedPitch ? "✅ ¡Copiado! Pégalo en WhatsApp" : "📋 Copiar argumento de venta"}
        </button>
      </div>

      {/* Comparativa con otros planes */}
      <div style={{ background: "#0a0a14", border: "1px solid #1a1a2a", borderRadius: 18, padding: 22, marginBottom: 20 }}>
        <div style={{ color: "#fff", fontSize: 13, fontWeight: 700, marginBottom: 14 }}>📊 Comparativa de planes</div>
        <table style={{ width: "100%", borderCollapse: "collapse" }}>
          <thead>
            <tr>
              <th style={{ textAlign: "left", padding: "8px 12px", color: "#333", fontSize: 11, fontFamily: "'DM Sans',sans-serif" }}></th>
              {Object.entries(PLANES).map(([k, p]) => (
                <th key={k} style={{ padding: "8px 12px", fontSize: 12, color: k === planKey ? p.color : "#444", background: k === planKey ? `${p.color}12` : "transparent", borderRadius: 8, fontFamily: "'DM Sans',sans-serif", fontWeight: k === planKey ? 800 : 500 }}>
                  {k === planKey ? `⭐ ${p.nombre}` : p.nombre}
                  <div style={{ fontWeight: 700, fontSize: 11, marginTop: 2 }}>{COP(p.precio)}/mes</div>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {[
              ["Redes sociales", "1 red", "2 redes", "3 redes"],
              ["Mensajes", "500/mes", "Ilimitados", "Ilimitados"],
              ["Toma de pedidos", "❌", "✅", "✅"],
              ["WhatsApp real API", "❌", "❌ (+$90K)", "✅ incluida"],
              ["Reporte mensual", "❌", "❌", "✅"],
              ["Tiempo activación", "48 horas", "24 horas", "12 horas"],
            ].map((r, i) => (
              <tr key={i} style={{ borderTop: "1px solid #0d0d18" }}>
                <td style={{ padding: "9px 12px", color: "#555", fontSize: 12 }}>{r[0]}</td>
                {["basico", "pro", "premium"].map((k, j) => (
                  <td key={k} style={{ padding: "9px 12px", textAlign: "center", fontSize: 12, background: k === planKey ? `${PLANES[k].color}08` : "transparent", color: r[j + 1] === "✅" ? "#22c55e" : r[j + 1] === "❌" ? "#333" : k === planKey ? PLANES[k].color : "#666", fontWeight: k === planKey ? 700 : 400 }}>
                    {r[j + 1]}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Botones */}
      <div style={{ display: "flex", gap: 12 }}>
        <button onClick={onReset} style={{ flex: 1, background: "transparent", border: "1px solid #1a1a2a", color: "#666", borderRadius: 14, padding: "14px", cursor: "pointer", fontSize: 14, fontWeight: 700, fontFamily: "'DM Sans',sans-serif" }}>
          🔄 Nuevo diagnóstico
        </button>
        <button onClick={() => { navigator.clipboard.writeText(pitch); setCopied(true); setTimeout(() => setCopied(false), 2500); }}
          style={{ flex: 2, background: `linear-gradient(135deg,${PLANES[planKey].color},${PLANES[planKey].color}cc)`, border: "none", color: "#fff", borderRadius: 14, padding: "14px", cursor: "pointer", fontSize: 14, fontWeight: 900, fontFamily: "'DM Sans',sans-serif" }}>
          {copied ? "✅ ¡Listo para vender!" : `🚀 Vender ${PLANES[planKey].nombre} ahora`}
        </button>
      </div>
    </div>
  );
}

/* ══════════════════════════════════════
   APP PRINCIPAL
══════════════════════════════════════ */
export default function DiagnosticoPlan() {
  const [paso, setPaso] = useState(0); // 0 = intro, 1-8 = preguntas, 9 = resultado
  const [respuestas, setRespuestas] = useState({});
  const [seleccion, setSeleccion] = useState(null);
  const [modo, setModo] = useState("cliente"); // cliente | tutor

  const preguntaActual = PREGUNTAS[paso - 1];
  const esResultado = paso > PREGUNTAS.length;
  const resultado = esResultado ? calcularPlan(respuestas) : null;

  const elegir = (valor) => {
    setSeleccion(valor);
    setTimeout(() => {
      const nuevas = { ...respuestas, [preguntaActual.id]: valor };
      setRespuestas(nuevas);
      setSeleccion(null);
      if (paso >= PREGUNTAS.length) {
        setPaso(PREGUNTAS.length + 1);
      } else {
        setPaso(paso + 1);
      }
    }, 400);
  };

  const reset = () => { setPaso(0); setRespuestas({}); setSeleccion(null); };

  const coloresPasos = ["#ec4899", "#f97316", "#f59e0b", "#22c55e", "#3b82f6", "#a855f7", "#ec4899", "#f97316"];

  return (
    <div style={{ minHeight: "100vh", background: "#05050d", color: "#fff", fontFamily: "'DM Sans', sans-serif", display: "flex", flexDirection: "column" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@300;400;500;600;700;800;900&display=swap');
        * { box-sizing: border-box; margin: 0; padding: 0; }
        ::-webkit-scrollbar { width: 3px; } ::-webkit-scrollbar-track { background: #0a0a14; } ::-webkit-scrollbar-thumb { background: #ec489955; border-radius: 2px; }
        @keyframes fadeUp { from { opacity:0; transform:translateY(12px); } to { opacity:1; transform:translateY(0); } }
        @keyframes pulse { 0%,100%{opacity:1} 50%{opacity:.3} }
        @keyframes pop { 0%{transform:scale(.95);opacity:.7} 100%{transform:scale(1);opacity:1} }
        .opcion:hover { transform: translateY(-2px) !important; }
      `}</style>

      {/* HEADER */}
      <div style={{ background: "#07070e", borderBottom: "1px solid #12121e", padding: "14px 28px", display: "flex", alignItems: "center", gap: 14, flexShrink: 0 }}>
        <div style={{ width: 36, height: 36, borderRadius: 10, background: "linear-gradient(135deg,#ec4899,#f97316)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 18 }}>👗</div>
        <div>
          <div style={{ fontWeight: 900, fontSize: 16, letterSpacing: -0.5 }}>NOVAModa — Recomendador de planes</div>
          <div style={{ color: "#444", fontSize: 12 }}>Diagnóstico inteligente para tiendas de ropa</div>
        </div>
        {paso > 0 && !esResultado && (
          <div style={{ marginLeft: "auto", display: "flex", alignItems: "center", gap: 12 }}>
            <span style={{ color: "#444", fontSize: 13 }}>Pregunta {paso} de {PREGUNTAS.length}</span>
            <button onClick={reset} style={{ background: "transparent", border: "1px solid #1a1a2a", color: "#444", borderRadius: 8, padding: "5px 12px", cursor: "pointer", fontSize: 12, fontFamily: "'DM Sans',sans-serif" }}>
              Reiniciar
            </button>
          </div>
        )}
      </div>

      {/* PROGRESO */}
      {paso > 0 && !esResultado && (
        <div style={{ padding: "10px 28px", background: "#07070e", borderBottom: "1px solid #12121e" }}>
          <BarraProgreso actual={paso} total={PREGUNTAS.length} color={coloresPasos[paso - 1]} />
        </div>
      )}

      {/* CONTENIDO */}
      <div style={{ flex: 1, overflow: "auto", display: "flex", alignItems: paso === 0 ? "center" : "flex-start", justifyContent: "center", padding: "32px 24px" }}>
        <div style={{ width: "100%", maxWidth: esResultado ? 900 : 680 }}>

          {/* INTRO */}
          {paso === 0 && (
            <div style={{ textAlign: "center", animation: "fadeUp .5s ease" }}>
              <div style={{ fontSize: 56, marginBottom: 20 }}>🎯</div>
              <div style={{ color: "#ec4899", fontSize: 11, fontWeight: 700, letterSpacing: 3, textTransform: "uppercase", marginBottom: 12 }}>
                Diagnóstico inteligente
              </div>
              <h1 style={{ fontSize: 34, fontWeight: 900, letterSpacing: -1, lineHeight: 1.1, marginBottom: 16 }}>
                Descubre qué plan es perfecto<br />
                <span style={{ background: "linear-gradient(135deg,#ec4899,#f97316)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>para tu tienda de ropa</span>
              </h1>
              <p style={{ color: "#555", fontSize: 16, lineHeight: 1.7, maxWidth: 480, margin: "0 auto 32px" }}>
                Responde {PREGUNTAS.length} preguntas sobre tu negocio y en menos de 2 minutos sabrás exactamente qué plan necesitas y cuánto vas a ganar.
              </p>

              <div style={{ display: "flex", gap: 12, justifyContent: "center", marginBottom: 28 }}>
                {[
                  { e: "⏱️", t: "2 minutos", d: "Para completar" },
                  { e: "🎯", t: "100% personalizado", d: "Según tu negocio" },
                  { e: "💰", t: "ROI calculado", d: "Para tu tienda" },
                ].map(c => (
                  <div key={c.t} style={{ background: "#0a0a14", border: "1px solid #1a1a2a", borderRadius: 14, padding: "16px 20px", minWidth: 130 }}>
                    <div style={{ fontSize: 24, marginBottom: 6 }}>{c.e}</div>
                    <div style={{ fontWeight: 800, fontSize: 13 }}>{c.t}</div>
                    <div style={{ color: "#444", fontSize: 11, marginTop: 2 }}>{c.d}</div>
                  </div>
                ))}
              </div>

              <div style={{ display: "flex", gap: 12, justifyContent: "center", marginBottom: 20 }}>
                <button onClick={() => { setModo("cliente"); setPaso(1); }}
                  style={{ background: "linear-gradient(135deg,#ec4899,#f97316)", border: "none", color: "#fff", borderRadius: 14, padding: "16px 36px", cursor: "pointer", fontSize: 15, fontWeight: 900, fontFamily: "'DM Sans',sans-serif" }}>
                  🛍️ Soy dueño de una tienda
                </button>
                <button onClick={() => { setModo("tutor"); setPaso(1); }}
                  style={{ background: "transparent", border: "1.5px solid #ec489944", color: "#ec4899", borderRadius: 14, padding: "16px 36px", cursor: "pointer", fontSize: 15, fontWeight: 700, fontFamily: "'DM Sans',sans-serif" }}>
                  💼 Estoy asesorando a un cliente
                </button>
              </div>
              <p style={{ color: "#333", fontSize: 12 }}>Sin registro · Sin datos personales · Resultado inmediato</p>
            </div>
          )}

          {/* PREGUNTAS */}
          {paso >= 1 && !esResultado && preguntaActual && (
            <div style={{ animation: "fadeUp .4s ease" }}>
              {/* Indicadores de paso */}
              <div style={{ display: "flex", gap: 6, marginBottom: 28, justifyContent: "center" }}>
                {PREGUNTAS.map((_, i) => (
                  <div key={i} style={{ width: i < paso ? 28 : 8, height: 8, borderRadius: 4, background: i < paso ? coloresPasos[i] : i === paso - 1 ? coloresPasos[i] : "#1a1a2a", transition: "all .3s", opacity: i <= paso - 1 ? 1 : 0.4 }} />
                ))}
              </div>

              {/* Tarjeta pregunta */}
              <div style={{ background: "#0a0a14", border: `1px solid ${coloresPasos[paso - 1]}33`, borderRadius: 24, padding: 32, marginBottom: 20 }}>
                <div style={{ display: "flex", alignItems: "center", gap: 14, marginBottom: 20 }}>
                  <div style={{ width: 52, height: 52, borderRadius: 16, background: `${coloresPasos[paso - 1]}18`, border: `1px solid ${coloresPasos[paso - 1]}44`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 28, flexShrink: 0 }}>
                    {preguntaActual.emoji}
                  </div>
                  <div>
                    <div style={{ color: coloresPasos[paso - 1], fontSize: 10, fontWeight: 700, textTransform: "uppercase", letterSpacing: 2, marginBottom: 4 }}>
                      Pregunta {paso} de {PREGUNTAS.length}
                    </div>
                    <h3 style={{ fontSize: 18, fontWeight: 800, lineHeight: 1.3 }}>{preguntaActual.pregunta}</h3>
                  </div>
                </div>
                {preguntaActual.ayuda && (
                  <div style={{ background: "#ffffff06", border: "1px solid #ffffff0a", borderRadius: 10, padding: "10px 14px", marginBottom: 4, fontSize: 12, color: "#555" }}>
                    💡 {preguntaActual.ayuda}
                  </div>
                )}
              </div>

              {/* Opciones */}
              <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                {preguntaActual.opciones.map((op) => {
                  const isSelected = seleccion === op.valor;
                  return (
                    <button key={op.valor} className="opcion" onClick={() => elegir(op.valor)}
                      style={{ background: isSelected ? `${coloresPasos[paso - 1]}18` : "#0a0a14", border: `1.5px solid ${isSelected ? coloresPasos[paso - 1] + "88" : "#1a1a2a"}`, borderRadius: 16, padding: "16px 20px", cursor: "pointer", display: "flex", alignItems: "center", gap: 14, transition: "all .2s", textAlign: "left", animation: isSelected ? "pop .3s ease" : "none" }}>
                      <div style={{ width: 36, height: 36, borderRadius: "50%", background: isSelected ? `${coloresPasos[paso - 1]}22` : "#151520", border: `1.5px solid ${isSelected ? coloresPasos[paso - 1] + "66" : "#2a2a3a"}`, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, fontSize: 16, transition: "all .2s" }}>
                        {isSelected ? <span style={{ color: coloresPasos[paso - 1], fontWeight: 900, fontSize: 14 }}>✓</span> : <span style={{ color: "#333", fontWeight: 700, fontSize: 13 }}>{op.valor}</span>}
                      </div>
                      <div style={{ flex: 1 }}>
                        <div style={{ fontWeight: 700, fontSize: 14, color: isSelected ? "#fff" : "#ccc", fontFamily: "'DM Sans',sans-serif", marginBottom: 3 }}>{op.texto}</div>
                        <div style={{ fontSize: 12, color: "#444" }}>{op.detalle}</div>
                      </div>
                      {isSelected && <div style={{ width: 8, height: 8, borderRadius: "50%", background: coloresPasos[paso - 1], flexShrink: 0, animation: "pulse 1s infinite" }} />}
                    </button>
                  );
                })}
              </div>

              {/* Botón atrás */}
              {paso > 1 && (
                <button onClick={() => setPaso(paso - 1)} style={{ marginTop: 16, background: "transparent", border: "none", color: "#333", cursor: "pointer", fontSize: 13, fontFamily: "'DM Sans',sans-serif", display: "flex", alignItems: "center", gap: 6 }}>
                  ← Pregunta anterior
                </button>
              )}
            </div>
          )}

          {/* RESULTADO */}
          {esResultado && resultado && (
            <TarjetaResultado planKey={resultado.plan} respuestas={respuestas} onReset={reset} />
          )}
        </div>
      </div>
    </div>
  );
}
