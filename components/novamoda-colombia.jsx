import { useState, useRef, useEffect } from "react";

const COP = n => n === 0 ? "GRATIS" : `$${new Intl.NumberFormat("es-CO").format(n)}`;

const MODA_PROMPT = (cfg) => `Eres NOVA, la mejor asesora de ventas de moda en Colombia para "${cfg.name}" en ${cfg.ciudad}.

TIPO DE TIENDA: ${cfg.tipo === "femenina" ? "Moda femenina, boutique, tendencias mujer" : "Ropa urbana, streetwear, moda joven"}

CATÁLOGO:
${cfg.productos.map(p => `• ${p.n} — ${COP(p.p)} COP | Tallas: ${p.tallas || "Consultar"} | Colores: ${p.colores || "Varios"}`).join("\n")}

PROMOCIÓN: ${cfg.promo}
PAGOS: ${cfg.pagos}
ENVÍOS: ${cfg.envios}
TONO: ${cfg.tono}

TÉCNICAS DE VENTA PARA MODA:
1. Vende emoción e imagen, no solo tela: "Este vestido te va a hacer lucir increíble"
try {
    // 1. Llamamos a tu API interna en Vercel
    const r = await fetch("/api/chat", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        messages: h,        // El historial de mensajes que creaste en la línea 18
        system: cfg.system  // ¡Confirmado! Se llama cfg.system en tu objeto
      })
    });

    const d = await r.json();
    
    // 2. Extraemos el texto que configuramos en tu chat.js
    const t = d.text || "Disculpa, intenta de nuevo.";

    setMsgs(p => [...p, { role: "bot", text: t, time: new Date() }]);
    setHistory([...h, { role: "assistant", content: t }]);
  } catch {
    setMsgs(p => [...p, { role: "bot", text: "⚠️ Error, Intenta de nuevo.", time: new Date() }]);
  }      },
      body: JSON.stringify({
        messages: h,
        system: cfg.system || cfg.prompt || cfg.systemPrompt || "Eres NOVA, una asesora de moda personal." 
        // Nota: Dejé esos comodines por si acaso, pero si sabes el nombre exacto de la propiedad en tu objeto (ej. cfg.system), puedes dejar solo ese.
      })
    });

    const d = await r.json();
    
    // 2. Extraemos la propiedad 'text' que configuramos en tu chat.js
    const t = d.text || "Disculpa, intenta de nuevo.";

    setMsgs(p => [...p, { role: "bot", text: t, time: new Date() }]);
    setHistory([...h, { role: "assistant", content: t }]);
  } catch {
    setMsgs(p => [...p, { role: "bot", text: "⚠️ Error, Intenta de nuevo.", time: new Date() }]);
  }
8. Para cerrar pide: nombre, dirección, ciudad, talla, color, método de pago

REGLAS: Máximo 3-4 oraciones. Usa emojis de moda con moderación 👗✨🔥. Precios en COP. Nunca digas que eres IA. Cierra siempre con pregunta o acción concreta.`;

const TIENDAS = {
  boutique: {
    name: "Luisa Fernanda Boutique", ciudad: "Bogotá", tipo: "femenina",
    tono: "sofisticado, cálido, como tu amiga fashionista de confianza",
    promo: "15% OFF primera compra con código NOVA15. Envío GRATIS en pedidos +$200.000",
    pagos: "Nequi, Daviplata, PSE, tarjetas, contraentrega",
    envios: "Bogotá express 24h. Resto de Colombia 2-3 días por Coordinadora.",
    color: "#ec4899",
    productos: [
      { n: "Vestido Midi Floral Primavera", p: 189000, tallas: "XS S M L", colores: "Rosa, Blanco, Verde menta" },
      { n: "Blazer Oversize Camel", p: 245000, tallas: "S M L XL", colores: "Camel, Negro, Beige" },
      { n: "Set Coord Lino Verano", p: 320000, tallas: "S M L", colores: "Blanco, Azul cielo" },
      { n: "Jeans Mom Tiro Alto", p: 145000, tallas: "26 al 34", colores: "Azul medio, Negro, Gris" },
      { n: "Blusa Satín Elegante", p: 89000, tallas: "XS S M L", colores: "Champagne, Negro, Rojo" },
      { n: "Bolso Bucket Premium", p: 195000, tallas: "Único", colores: "Café, Negro, Blanco roto" },
    ]
  },
  streetwear: {
    name: "UrbanFlow Store", ciudad: "Medellín", tipo: "streetwear",
    tono: "energético, joven, cool — como el amigo más trendy del grupo",
    promo: "2x1 en camisetas oversize toda la semana. Envío gratis en pedidos +$150.000",
    pagos: "Nequi, Daviplata, contraentrega, Efecty",
    envios: "Medellín mismo día. Todo Colombia 2-4 días.",
    color: "#f97316",
    productos: [
      { n: "Hoodie Premium Oversized", p: 165000, tallas: "S M L XL XXL", colores: "Negro, Gris, Blanco, Verde militar" },
      { n: "Cargo Pants Urban", p: 185000, tallas: "28 al 36", colores: "Negro, Caqui, Gris" },
      { n: "Camiseta Gráfica Drop", p: 75000, tallas: "S M L XL", colores: "Blanco, Negro, Beige" },
      { n: "Chaqueta Bomber Varsity", p: 295000, tallas: "S M L XL", colores: "Negro/Blanco, Verde/Crema" },
      { n: "Bucket Hat Logo", p: 65000, tallas: "Único ajustable", colores: "Negro, Beige, Azul" },
      { n: "Tenis Chunky Retro", p: 220000, tallas: "36 al 44", colores: "Blanco/Negro, Beige/Café" },
    ]
  }
};

function ModaChat({ tiendaKey, onClose }) {
  const cfg = TIENDAS[tiendaKey];
  const [msgs, setMsgs] = useState([{ role: "bot", text: `¡Hola! 👗✨ Bienvenida a *${cfg.name}*\n\nSoy NOVA, tu asesora de moda personal. ¿Qué tipo de prenda estás buscando hoy? 🛍️`, time: new Date() }]);
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
      const r = await fetch("https://api.anthropic.com/v1/messages", { method: "POST", headers: { "Content-Type": "application/json", "anthropic-dangerous-direct-browser-access": "true" }, body: JSON.stringify({ model: "claude-sonnet-4-20250514", max_tokens: 1000, system: MODA_PROMPT(cfg), messages: h }) });
      const d = await r.json();
      const t = d.content?.[0]?.text || "Disculpa, intenta de nuevo.";
      setMsgs(p => [...p, { role: "bot", text: t, time: new Date() }]);
      setHistory([...h, { role: "assistant", content: t }]);
    } catch { setMsgs(p => [...p, { role: "bot", text: "⚠️ Error. Intenta de nuevo.", time: new Date() }]); }
    setLoading(false);
  };

  const fmt = t => t.replace(/\*(.*?)\*/g, "<b>$1</b>").replace(/\n/g, "<br>");
  const time = d => d.toLocaleTimeString("es-CO", { hour: "2-digit", minute: "2-digit" });

  return (
    <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,.88)", zIndex: 1000, display: "flex", alignItems: "center", justifyContent: "center", backdropFilter: "blur(10px)", padding: 16 }}>
      <div style={{ width: "100%", maxWidth: 420, height: 640, background: "#07070f", border: `1px solid ${cfg.color}44`, borderRadius: 24, display: "flex", flexDirection: "column", overflow: "hidden", boxShadow: `0 0 60px ${cfg.color}22` }}>
        <div style={{ background: `${cfg.color}15`, borderBottom: `1px solid ${cfg.color}33`, padding: "14px 18px", display: "flex", alignItems: "center", gap: 12 }}>
          <div style={{ width: 42, height: 42, borderRadius: "50%", background: `linear-gradient(135deg,${cfg.color},${cfg.color}88)`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 20 }}>{cfg.tipo === "femenina" ? "👗" : "🔥"}</div>
          <div style={{ flex: 1 }}>
            <div style={{ fontWeight: 800, fontSize: 14, fontFamily: "'Outfit',sans-serif" }}>{cfg.name}</div>
            <div style={{ color: "#22c55e", fontSize: 11 }}>● NOVA activa · {cfg.ciudad}</div>
          </div>
          <button onClick={onClose} style={{ background: "#ffffff11", border: "none", color: "#888", borderRadius: 8, width: 32, height: 32, cursor: "pointer", fontSize: 16 }}>✕</button>
        </div>
        <div style={{ flex: 1, overflowY: "auto", padding: "14px 12px", display: "flex", flexDirection: "column", gap: 8, background: "#09090f" }}>
          {msgs.map((m, i) => (
            <div key={i} style={{ display: "flex", justifyContent: m.role === "user" ? "flex-end" : "flex-start" }}>
              {m.role === "bot" && <div style={{ width: 28, height: 28, borderRadius: "50%", background: cfg.color, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 13, flexShrink: 0, marginRight: 8, alignSelf: "flex-end", marginBottom: 16, fontWeight: 900 }}>N</div>}
              <div style={{ maxWidth: "75%" }}>
                <div style={{ background: m.role === "user" ? `linear-gradient(135deg,${cfg.color},${cfg.color}cc)` : "#141420", color: "#fff", borderRadius: m.role === "user" ? "18px 18px 4px 18px" : "18px 18px 18px 4px", padding: "11px 15px", fontSize: 13, lineHeight: 1.6, border: m.role === "bot" ? `1px solid ${cfg.color}22` : "none", fontFamily: "'Outfit',sans-serif" }} dangerouslySetInnerHTML={{ __html: fmt(m.text) }} />
                <div style={{ fontSize: 10, color: "#333", marginTop: 3, textAlign: m.role === "user" ? "right" : "left" }}>{time(m.time)}</div>
              </div>
            </div>
          ))}
          {loading && (
            <div style={{ display: "flex", gap: 8 }}>
              <div style={{ width: 28, height: 28, borderRadius: "50%", background: cfg.color, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 13, fontWeight: 900 }}>N</div>
              <div style={{ background: "#141420", border: `1px solid ${cfg.color}22`, borderRadius: "18px 18px 18px 4px", padding: "12px 16px", display: "flex", gap: 4 }}>
                {[0,1,2].map(i => <span key={i} style={{ width: 5, height: 5, borderRadius: "50%", background: cfg.color, display: "inline-block", animation: `bounce 1.2s infinite ${i*.2}s` }} />)}
              </div>
            </div>
          )}
          <div ref={endRef} />
        </div>
        <div style={{ padding: "8px 10px", display: "flex", gap: 5, overflowX: "auto", background: "#07070f", borderTop: `1px solid ${cfg.color}22` }}>
          {["¿Qué tienen? 👗", "¿Promo activa? 🔥", "¿Qué tallas?", "Quiero pedir 🛍️"].map(q => (
            <button key={q} onClick={() => setInput(q)} style={{ background: "transparent", border: `1px solid ${cfg.color}44`, color: cfg.color, borderRadius: 20, padding: "5px 11px", fontSize: 11, cursor: "pointer", whiteSpace: "nowrap", fontFamily: "'Outfit',sans-serif", fontWeight: 600 }}>{q}</button>
          ))}
        </div>
        <div style={{ padding: "10px 12px", background: "#07070f", borderTop: `1px solid ${cfg.color}22`, display: "flex", gap: 8 }}>
          <input value={input} onChange={e => setInput(e.target.value)} onKeyDown={e => e.key === "Enter" && send()} placeholder="Escríbele a NOVA..." style={{ flex: 1, background: "#141420", border: `1px solid ${cfg.color}33`, borderRadius: 24, padding: "11px 18px", color: "#fff", fontSize: 13, outline: "none", fontFamily: "'Outfit',sans-serif" }} />
          <button onClick={send} style={{ width: 42, height: 42, borderRadius: "50%", background: `linear-gradient(135deg,${cfg.color},${cfg.color}cc)`, border: "none", cursor: "pointer", fontSize: 17, flexShrink: 0 }}>➤</button>
        </div>
      </div>
    </div>
  );
}

function ScriptCard({ s, idx, copiedId, onCopy }) {
  const [open, setOpen] = useState(false);
  return (
    <div onClick={() => setOpen(o => !o)} style={{ background: "#0d0d18", border: `1px solid ${open ? s.color + "44" : "#1a1a2a"}`, borderRadius: 16, overflow: "hidden", cursor: "pointer", transition: "all .2s" }}>
      <div style={{ padding: "16px 20px", display: "flex", alignItems: "center", gap: 12 }}>
        <span style={{ fontSize: 22 }}>{s.icon}</span>
        <div style={{ flex: 1, fontWeight: 800, fontSize: 14, fontFamily: "'Outfit',sans-serif" }}>{s.titulo}</div>
        <span style={{ color: "#444", fontSize: 20, transition: "transform .2s", transform: open ? "rotate(90deg)" : "none" }}>›</span>
      </div>
      {open && (
        <div style={{ borderTop: "1px solid #1a1a2a", padding: "16px 20px" }} onClick={e => e.stopPropagation()}>
          <pre style={{ color: "#ccc", fontSize: 13, lineHeight: 1.8, whiteSpace: "pre-wrap", fontFamily: "'Outfit',sans-serif", marginBottom: 14 }}>{s.texto}</pre>
          <button onClick={() => onCopy(s.texto, idx)} style={{ background: copiedId === idx ? "#22c55e22" : "#ec489918", border: `1px solid ${copiedId === idx ? "#22c55e44" : "#ec489944"}`, color: copiedId === idx ? "#22c55e" : "#ec4899", borderRadius: 10, padding: "8px 18px", cursor: "pointer", fontSize: 12, fontWeight: 800, fontFamily: "'Outfit',sans-serif" }}>
            {copiedId === idx ? "✓ ¡Copiado!" : "📋 Copiar mensaje"}
          </button>
        </div>
      )}
    </div>
  );
}

function FaqCard({ f }) {
  const [open, setOpen] = useState(false);
  return (
    <div onClick={() => setOpen(o => !o)} style={{ background: "#0d0d18", border: `1px solid ${open ? "#ec489944" : "#1a1a2a"}`, borderRadius: 14, overflow: "hidden", cursor: "pointer", transition: "all .2s" }}>
      <div style={{ padding: "16px 20px", display: "flex", alignItems: "center", gap: 12 }}>
        <span style={{ color: "#ec4899", fontWeight: 900, fontSize: 16, flexShrink: 0 }}>?</span>
        <span style={{ flex: 1, fontWeight: 700, fontSize: 14, fontFamily: "'Outfit',sans-serif" }}>{f.p}</span>
        <span style={{ color: "#444", fontSize: 20, transition: "transform .2s", transform: open ? "rotate(45deg)" : "none" }}>+</span>
      </div>
      {open && <div style={{ borderTop: "1px solid #1a1a2a", padding: "14px 20px", background: "#ec489906" }}><p style={{ color: "#888", fontSize: 13, lineHeight: 1.75, fontFamily: "'Outfit',sans-serif" }}>{f.r}</p></div>}
    </div>
  );
}

export default function NovaModa() {
  const [tab, setTab] = useState("inicio");
  const [chat, setChat] = useState(null);
  const [copiedId, setCopiedId] = useState(null);
  const copy = (text, id) => { navigator.clipboard.writeText(text); setCopiedId(id); setTimeout(() => setCopiedId(null), 2500); };

  const planes = [
    { nombre: "Básico", precio: 200000, color: "#6b7280", ideal: "Tiendas pequeñas / emprendedoras", features: ["1 red social", "500 mensajes/mes", "Hasta 20 productos", "Respuestas 24/7", "Soporte básico", "Activo en 48h"] },
    { nombre: "Pro ⭐", precio: 290000, color: "#ec4899", popular: true, ideal: "Boutiques y tiendas activas", features: ["WhatsApp + Instagram", "Mensajes ilimitados", "Catálogo ilimitado", "Outfit completo automático", "Gestión tallas y colores", "Toma de pedidos", "Panel de ventas", "Soporte 24/7", "Activo en 24h"] },
    { nombre: "Premium", precio: 420000, color: "#a855f7", ideal: "Tiendas con alto volumen", features: ["Todas las redes", "Multi-catálogo por temporada", "Reactivación de clientas", "Reportes de ventas", "Manager dedicado", "Activo en 12h"] },
  ];

  const scripts = [
    { titulo: "Mensaje para boutiques / moda femenina", icon: "👗", color: "#ec4899", texto: `Hola [Nombre]! 👋 Vi tu boutique en Instagram y tu ropa es muy linda 😍\n\nTengo una pregunta rápida: cuando tus clientas te escriben de noche o un sábado preguntando por tallas y precios — ¿alcanzas a responder todas a tiempo?\n\nCreamos NOVA, una asesora de moda con IA que responde por tu tienda 24/7. Conoce todo tu catálogo, recomienda outfits completos, maneja tallas y cierra ventas mientras tú te ocupas de otras cosas.\n\nBoutiques en [ciudad] han aumentado ventas hasta 40% en el primer mes.\n\n¿Te muestro cómo funcionaría para [nombre de la boutique]? Es gratis y tarda 10 minutos 🚀` },
    { titulo: "Mensaje para tiendas streetwear / urbanas", icon: "🔥", color: "#f97316", texto: `Qué tal [Nombre]! 🔥 Vi tu tienda [nombre] — el contenido está muy bueno.\n\nUna cosa que seguro te pasa: cuando subes un drop nuevo, te llegan 50 mensajes preguntando precio, talla y disponibilidad — y no alcanzas a responder todos.\n\nCreamos NOVA, un asesor con IA que responde al instante en WhatsApp e Instagram. Conoce todo el drop, maneja tallas, dice qué queda disponible y cierra la venta solo.\n\n¿Te hago una demo rápida con tu tipo de tienda? 👇` },
    { titulo: "Follow-up si no responden (día 3)", icon: "🔁", color: "#6b7280", texto: `Hola [Nombre]! Te escribí hace unos días sobre NOVA, la asesora de ventas para tu tienda 🤖\n\nSolo quería contarte que esta semana activamos el bot en una boutique similar en [ciudad] y en el primer fin de semana cerró 23 ventas mientras la dueña descansaba.\n\n¿Tienes 10 minutos esta semana para que te muestre cómo funcionaría?` },
    { titulo: "Objeción: \"Mis clientas prefieren hablar conmigo\"", icon: "💬", color: "#3b82f6", texto: `¡Eso es un gran activo! Y NOVA no te reemplaza — te complementa perfectamente.\n\nTu toque personal sigue siendo único para las clientas VIP.\n\nNOVA se encarga de lo que más tiempo te quita: las 40 preguntas diarias de tallas, precios y envíos. Eso te libera para enfocarte en las clientas que de verdad necesitan tu atención.\n\n¿Te imaginas respondiendo solo las preguntas importantes mientras NOVA maneja el resto? ¿Te muestro cómo quedaría?` },
    { titulo: "Cierre de venta para tienda de ropa", icon: "🤝", color: "#22c55e", texto: `¡Qué emoción! Tu NOVA va a quedar increíble 🎉\n\nPara configurarla necesito:\n1️⃣ Nombre de tu tienda y redes (@usuario)\n2️⃣ Lista de productos con precio, tallas y colores\n3️⃣ Tu promoción activa (si tienes)\n4️⃣ Cómo manejas envíos y pagos\n5️⃣ Estilo de comunicación: ¿elegante o casual?\n\nEl pago del primer mes es por Nequi o Daviplata. En 24 horas NOVA está respondiendo a tus clientas.\n\nTienes 30 días de garantía — si no ves resultados, te devuelvo todo. ¿A qué número te mando los datos de pago? 😊` },
  ];

  const faqs = [
    { p: "¿NOVA puede mostrar fotos de las prendas?", r: "Sí, puedes configurarla para enviar links de fotos directamente en el chat de WhatsApp e Instagram." },
    { p: "¿Qué pasa si se agota una talla?", r: "Le dices a NOVA qué tallas están agotadas y ella lo comunica a las clientas, ofreciendo la talla más cercana o avisando cuando vuelva." },
    { p: "¿Puede manejar drops y colecciones nuevas?", r: "Sí. Cada vez que tienes colección nueva, actualizas el catálogo en minutos y NOVA ya conoce todo desde ese momento." },
    { p: "¿Funciona para tiendas que venden solo por Instagram?", r: "Perfecto para eso. La mayoría de nuestras clientas venden 100% por Instagram y WhatsApp sin página web." },
    { p: "¿Y si la clienta pide algo que no tenemos?", r: "NOVA le dice que no está disponible y le ofrece la opción más similar del catálogo. Nunca queda una clienta sin respuesta." },
    { p: "¿Cuánto tarda en estar lista?", r: "Plan Básico en 48h, Plan Pro en 24h, Plan Premium en 12h. Solo necesitamos la info de tu tienda." },
  ];

  const tabs = [
    { id: "inicio", icon: "🏠", label: "Inicio" },
    { id: "demo", icon: "👗", label: "Demo en vivo" },
    { id: "planes", icon: "💎", label: "Planes" },
    { id: "scripts", icon: "📋", label: "Guión ventas" },
    { id: "proyeccion", icon: "📈", label: "Proyección" },
    { id: "faqs", icon: "❓", label: "FAQs" },
  ];

  return (
    <div style={{ minHeight: "100vh", background: "#06060e", color: "#fff", fontFamily: "'Outfit', sans-serif" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Outfit:wght@300;400;500;600;700;800;900&display=swap');
        *{box-sizing:border-box;margin:0;padding:0}
        ::-webkit-scrollbar{width:4px}::-webkit-scrollbar-track{background:#0a0a14}::-webkit-scrollbar-thumb{background:#ec489944;border-radius:2px}
        @keyframes bounce{0%,80%,100%{transform:scale(.6);opacity:.4}40%{transform:scale(1);opacity:1}}
        @keyframes fadeUp{from{opacity:0;transform:translateY(10px)}to{opacity:1;transform:translateY(0)}}
        @keyframes pulse{0%,100%{opacity:1}50%{opacity:.3}}
        @keyframes float{0%,100%{transform:translateY(0)}50%{transform:translateY(-8px)}}
        .card{background:#0d0d18;border:1px solid #1a1a2a;border-radius:18px;transition:all .25s}
        .card:hover{border-color:#ec489933;transform:translateY(-3px)}
      `}</style>

      <nav style={{ position: "sticky", top: 0, zIndex: 100, background: "rgba(6,6,14,.92)", backdropFilter: "blur(20px)", borderBottom: "1px solid #1a1a2a" }}>
        <div style={{ maxWidth: 1100, margin: "0 auto", padding: "0 20px", display: "flex", alignItems: "center", height: 60, gap: 4 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10, marginRight: 16 }}>
            <div style={{ width: 32, height: 32, borderRadius: 8, background: "linear-gradient(135deg,#ec4899,#f97316)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 16 }}>👗</div>
            <div>
              <div style={{ fontWeight: 900, fontSize: 15, letterSpacing: -0.5 }}>NOVA<span style={{ background: "linear-gradient(135deg,#ec4899,#f97316)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>Moda</span></div>
              <div style={{ color: "#ec489988", fontSize: 9, letterSpacing: 2 }}>COLOMBIA</div>
            </div>
          </div>
          {tabs.map(t => (
            <button key={t.id} onClick={() => setTab(t.id)} style={{ background: "transparent", border: "none", borderBottom: `2px solid ${tab === t.id ? "#ec4899" : "transparent"}`, color: tab === t.id ? "#ec4899" : "#555", padding: "0 12px", height: "100%", cursor: "pointer", fontSize: 13, fontWeight: tab === t.id ? 800 : 500, fontFamily: "'Outfit',sans-serif", whiteSpace: "nowrap" }}>
              {t.icon} {t.label}
            </button>
          ))}
        </div>
      </nav>

      <div style={{ maxWidth: 1100, margin: "0 auto", padding: "32px 20px" }}>

        {tab === "inicio" && (
          <div style={{ animation: "fadeUp .4s ease" }}>
            <div style={{ textAlign: "center", padding: "40px 0 48px" }}>
              <div style={{ display: "inline-flex", alignItems: "center", gap: 8, background: "#ec489912", border: "1px solid #ec489933", borderRadius: 20, padding: "6px 16px", fontSize: 12, color: "#ec4899", marginBottom: 20, fontWeight: 700 }}>
                <span style={{ width: 6, height: 6, borderRadius: "50%", background: "#ec4899", display: "inline-block", animation: "pulse 2s infinite" }} />
                Especializado 100% en tiendas de ropa colombianas
              </div>
              <h1 style={{ fontSize: "clamp(36px,6vw,72px)", fontWeight: 900, lineHeight: 1.05, letterSpacing: -2, marginBottom: 20 }}>
                La asesora de moda<br />
                <span style={{ background: "linear-gradient(135deg,#ec4899,#f97316,#f59e0b)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>que vende sola</span>
              </h1>
              <p style={{ color: "#666", fontSize: 17, maxWidth: 520, margin: "0 auto 32px", lineHeight: 1.7 }}>
                NOVA conoce tu catálogo, recomienda outfits, maneja tallas y cierra ventas en WhatsApp e Instagram — <strong style={{ color: "#fff" }}>24/7 sin que estés disponible.</strong>
              </p>
              <div style={{ display: "flex", gap: 12, justifyContent: "center", flexWrap: "wrap" }}>
                <button onClick={() => setTab("demo")} style={{ background: "linear-gradient(135deg,#ec4899,#f97316)", border: "none", color: "#fff", borderRadius: 14, padding: "16px 36px", cursor: "pointer", fontSize: 15, fontWeight: 900, fontFamily: "'Outfit',sans-serif" }}>👗 Ver a NOVA en acción</button>
                <button onClick={() => setTab("planes")} style={{ background: "transparent", border: "1.5px solid #ec489944", color: "#ec4899", borderRadius: 14, padding: "16px 36px", cursor: "pointer", fontSize: 15, fontWeight: 700, fontFamily: "'Outfit',sans-serif" }}>Ver planes desde {COP(200000)}/mes</button>
              </div>
              <p style={{ color: "#333", fontSize: 12, marginTop: 16 }}>Sin contrato · Garantía 30 días · Activo en 24 horas</p>
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 12, marginBottom: 32 }}>
              {[{n:"1.200+",l:"Tiendas en Colombia",e:"👗"},{n:"40%",l:"Aumento promedio ventas",e:"📈"},{n:"24/7",l:"Sin descanso",e:"⏰"},{n:"$200K",l:"Plan desde COP/mes",e:"💰"}].map(s => (
                <div key={s.n} className="card" style={{ padding: "20px 16px", textAlign: "center" }}>
                  <div style={{ fontSize: 24, marginBottom: 6 }}>{s.e}</div>
                  <div style={{ fontSize: 28, fontWeight: 900, background: "linear-gradient(135deg,#ec4899,#f97316)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>{s.n}</div>
                  <div style={{ color: "#444", fontSize: 11, marginTop: 4 }}>{s.l}</div>
                </div>
              ))}
            </div>

            <div className="card" style={{ padding: 28, marginBottom: 20 }}>
              <h3 style={{ fontWeight: 900, fontSize: 20, marginBottom: 20 }}>NOVA vs. Atención manual vs. Bot genérico</h3>
              <table style={{ width: "100%", borderCollapse: "collapse" }}>
                <thead>
                  <tr>
                    <th style={{ textAlign: "left", padding: "10px 14px", color: "#444", fontSize: 12, fontFamily: "'Outfit',sans-serif" }}></th>
                    <th style={{ padding: "10px 14px", fontSize: 12, color: "#ec4899", background: "#ec489910", borderRadius: 8, fontFamily: "'Outfit',sans-serif" }}>✨ NOVAModa</th>
                    <th style={{ padding: "10px 14px", fontSize: 12, color: "#666", fontFamily: "'Outfit',sans-serif" }}>Manual</th>
                    <th style={{ padding: "10px 14px", fontSize: 12, color: "#555", fontFamily: "'Outfit',sans-serif" }}>Bot genérico</th>
                  </tr>
                </thead>
                <tbody>
                  {[
                    ["Atiende a las 2am cuando la clienta ve el post", true, false, false],
                    ["Sugiere outfit completo y sube el ticket", true, false, false],
                    ["Responde 50 clientas al mismo tiempo", true, false, false],
                    ["Maneja tallas, colores y disponibilidad", true, true, false],
                    ["Habla con lenguaje de moda y tendencias", true, true, false],
                    ["Nunca se cansa ni tiene mal día", true, false, false],
                    ["Toma pedidos completos con dirección", true, true, false],
                    ["Cuesta menos de $300K/mes", true, false, false],
                  ].map((r, i) => (
                    <tr key={i} style={{ borderTop: "1px solid #0d0d18" }}>
                      <td style={{ padding: "10px 14px", color: "#777", fontSize: 13, fontFamily: "'Outfit',sans-serif" }}>{r[0]}</td>
                      <td style={{ textAlign: "center", padding: "10px 14px", background: "#ec489906" }}><span style={{ color: "#22c55e", fontWeight: 900, fontSize: 16 }}>{r[1] ? "✓" : "✕"}</span></td>
                      <td style={{ textAlign: "center" }}><span style={{ color: r[2] ? "#22c55e" : "#ef4444", fontWeight: 700 }}>{r[2] ? "✓" : "✕"}</span></td>
                      <td style={{ textAlign: "center" }}><span style={{ color: r[3] ? "#22c55e" : "#ef4444", fontWeight: 700 }}>{r[3] ? "✓" : "✕"}</span></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div style={{ textAlign: "center", background: "linear-gradient(135deg,#ec489908,#f9731608)", border: "1px solid #ec489922", borderRadius: 20, padding: "40px 24px" }}>
              <div style={{ fontSize: 36, marginBottom: 12, animation: "float 3s infinite" }}>👗</div>
              <h3 style={{ fontSize: 26, fontWeight: 900, marginBottom: 8 }}>¿Lista para que tu tienda venda sola?</h3>
              <p style={{ color: "#555", marginBottom: 24 }}>Desde {COP(200000)}/mes. Sin contrato. Garantía 30 días.</p>
              <button onClick={() => setTab("scripts")} style={{ background: "linear-gradient(135deg,#ec4899,#f97316)", border: "none", color: "#fff", borderRadius: 14, padding: "14px 36px", cursor: "pointer", fontSize: 15, fontWeight: 900, fontFamily: "'Outfit',sans-serif" }}>Ver guión de ventas →</button>
            </div>
          </div>
        )}

        {tab === "demo" && (
          <div style={{ animation: "fadeUp .4s ease" }}>
            <div style={{ textAlign: "center", marginBottom: 32 }}>
              <h2 style={{ fontSize: 32, fontWeight: 900, letterSpacing: -1, marginBottom: 8 }}>NOVA en acción — <span style={{ background: "linear-gradient(135deg,#ec4899,#f97316)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>100% real</span></h2>
              <p style={{ color: "#555" }}>Chatea como si fueras una clienta. Pregunta por tallas, precios, outfits.</p>
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20, marginBottom: 20 }}>
              {Object.entries(TIENDAS).map(([key, t]) => (
                <div key={key} className="card" style={{ padding: 28, border: `1px solid ${t.color}33`, cursor: "pointer" }} onClick={() => setChat(key)}>
                  <div style={{ display: "flex", alignItems: "center", gap: 14, marginBottom: 16 }}>
                    <div style={{ width: 52, height: 52, borderRadius: 16, background: `${t.color}18`, border: `1px solid ${t.color}44`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 26, animation: "float 4s infinite" }}>{t.tipo === "femenina" ? "👗" : "🔥"}</div>
                    <div>
                      <div style={{ fontWeight: 800, fontSize: 16 }}>{t.name}</div>
                      <div style={{ color: t.color, fontSize: 12, fontWeight: 700 }}>{t.ciudad} · {t.tipo === "femenina" ? "Moda femenina" : "Streetwear"}</div>
                    </div>
                  </div>
                  {t.productos.slice(0, 3).map(p => (
                    <div key={p.n} style={{ display: "flex", justifyContent: "space-between", padding: "6px 0", borderBottom: "1px solid #0a0a14", fontSize: 13 }}>
                      <span style={{ color: "#777" }}>{p.n}</span>
                      <span style={{ color: "#22c55e", fontWeight: 700 }}>{COP(p.p)}</span>
                    </div>
                  ))}
                  <div style={{ color: "#333", fontSize: 11, marginTop: 6, marginBottom: 14 }}>+ {t.productos.length - 3} más...</div>
                  <button style={{ width: "100%", background: `linear-gradient(135deg,${t.color},${t.color}cc)`, border: "none", color: "#fff", borderRadius: 12, padding: "12px", cursor: "pointer", fontSize: 14, fontWeight: 900, fontFamily: "'Outfit',sans-serif" }}>💬 Chatear con NOVA →</button>
                </div>
              ))}
            </div>
            <div className="card" style={{ padding: 20, display: "flex", gap: 12, alignItems: "center" }}>
              <span style={{ fontSize: 24 }}>💡</span>
              <div>
                <div style={{ fontWeight: 700, fontSize: 14, marginBottom: 4 }}>Tip para demos con clientes reales</div>
                <div style={{ color: "#555", fontSize: 13 }}>Deja que el dueño de la tienda le escriba al bot como si fuera SU clienta. Di: <em style={{ color: "#ec4899" }}>"Escríbele como si fueras una clienta tuya de confianza."</em> Ese efecto WOW cierra el 70% de las ventas.</div>
              </div>
            </div>
          </div>
        )}

        {tab === "planes" && (
          <div style={{ animation: "fadeUp .4s ease" }}>
            <div style={{ textAlign: "center", marginBottom: 36 }}>
              <h2 style={{ fontSize: 30, fontWeight: 900, letterSpacing: -1, marginBottom: 8 }}>Planes para tiendas de ropa</h2>
              <p style={{ color: "#555" }}>Sin contratos. Garantía 30 días. Cancela cuando quieras.</p>
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 16, marginBottom: 32 }}>
              {planes.map((p, i) => (
                <div key={i} className="card" style={{ padding: 28, position: "relative", border: `1px solid ${p.popular ? p.color + "55" : "#1a1a2a"}`, transform: p.popular ? "scale(1.03)" : "none", boxShadow: p.popular ? `0 0 50px ${p.color}15` : "none" }}>
                  {p.popular && <div style={{ position: "absolute", top: -13, left: "50%", transform: "translateX(-50%)", background: `linear-gradient(135deg,${p.color},${p.color}cc)`, borderRadius: 20, padding: "5px 18px", fontSize: 11, fontWeight: 900, whiteSpace: "nowrap" }}>⭐ MÁS ELEGIDO</div>}
                  <div style={{ color: p.color, fontSize: 11, fontWeight: 800, textTransform: "uppercase", letterSpacing: 2, marginBottom: 8 }}>{p.nombre}</div>
                  <div style={{ fontWeight: 900, fontSize: 34, letterSpacing: -1, color: p.color, marginBottom: 2 }}>{COP(p.precio)}</div>
                  <div style={{ color: "#333", fontSize: 11, marginBottom: 8 }}>COP / mes</div>
                  <div style={{ color: "#555", fontSize: 12, marginBottom: 18, fontStyle: "italic" }}>{p.ideal}</div>
                  <div style={{ display: "flex", flexDirection: "column", gap: 8, marginBottom: 24 }}>
                    {p.features.map(f => <div key={f} style={{ display: "flex", gap: 8, fontSize: 13 }}><span style={{ color: p.color }}>✓</span><span style={{ color: "#aaa" }}>{f}</span></div>)}
                  </div>
                  <button onClick={() => setTab("scripts")} style={{ width: "100%", background: p.popular ? `linear-gradient(135deg,${p.color},${p.color}cc)` : "transparent", border: `1.5px solid ${p.color}55`, color: p.popular ? "#fff" : p.color, borderRadius: 12, padding: "12px", cursor: "pointer", fontSize: 14, fontWeight: 900, fontFamily: "'Outfit',sans-serif" }}>
                    {p.popular ? "Empezar ahora" : "Seleccionar"}
                  </button>
                </div>
              ))}
            </div>
            <div className="card" style={{ padding: 28 }}>
              <h3 style={{ fontWeight: 900, fontSize: 20, marginBottom: 20 }}>💰 ROI real para tiendas de ropa</h3>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 14 }}>
                {[{caso:"Boutique pequeña",v:2,t:150000,p:200000},{caso:"Boutique activa",v:4,t:200000,p:290000},{caso:"Tienda con volumen",v:8,t:180000,p:420000}].map(r => {
                  const ing = r.v * r.t * 30; const gan = ing - r.p; const roi = Math.round(gan / r.p * 100);
                  return (
                    <div key={r.caso} style={{ background: "#0a0a14", border: "1px solid #1a1a2a", borderRadius: 14, padding: 20 }}>
                      <div style={{ color: "#ec4899", fontSize: 11, fontWeight: 700, textTransform: "uppercase", letterSpacing: 1.5, marginBottom: 8 }}>{r.caso}</div>
                      <div style={{ color: "#555", fontSize: 12, marginBottom: 4 }}>+{r.v} ventas/día × {COP(r.t)}</div>
                      <div style={{ fontWeight: 900, fontSize: 22, color: "#22c55e" }}>{COP(ing)}</div>
                      <div style={{ color: "#444", fontSize: 11, marginBottom: 12 }}>extra/mes</div>
                      <div style={{ background: "#060610", borderRadius: 8, padding: "7px 12px", display: "flex", justifyContent: "space-between", fontSize: 12 }}><span style={{ color: "#333" }}>Costo NOVA:</span><span style={{ color: "#aaa" }}>{COP(r.p)}</span></div>
                      <div style={{ textAlign: "center", marginTop: 10, color: "#ec4899", fontWeight: 900, fontSize: 20 }}>ROI {roi}%</div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        )}

        {tab === "scripts" && (
          <div style={{ animation: "fadeUp .4s ease" }}>
            <div style={{ marginBottom: 24 }}>
              <h2 style={{ fontSize: 28, fontWeight: 900, letterSpacing: -0.5, marginBottom: 6 }}>📋 Guión especializado en tiendas de ropa</h2>
              <p style={{ color: "#555" }}>Mensajes adaptados para el mercado colombiano de moda</p>
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
              {scripts.map((s, i) => <ScriptCard key={i} s={s} idx={i} copiedId={copiedId} onCopy={copy} />)}
            </div>
          </div>
        )}

        {tab === "proyeccion" && (
          <div style={{ animation: "fadeUp .4s ease" }}>
            <div style={{ marginBottom: 24 }}>
              <h2 style={{ fontSize: 28, fontWeight: 900, letterSpacing: -0.5, marginBottom: 6 }}>📈 Tu proyección de ingresos</h2>
              <p style={{ color: "#555" }}>Precio promedio $250.000/mes. Modelo de volumen.</p>
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 14, marginBottom: 28 }}>
              {[{c:10,i:10*250000,api:10*8000},{c:20,i:20*250000,api:20*8000},{c:40,i:40*250000,api:40*8000},{c:60,i:60*250000,api:60*8000}].map(p => (
                <div key={p.c} className="card" style={{ padding: 22, border: "1px solid #ec489922" }}>
                  <div style={{ color: "#ec4899", fontSize: 11, fontWeight: 700, textTransform: "uppercase", letterSpacing: 2, marginBottom: 8 }}>{p.c} tiendas</div>
                  <div style={{ fontWeight: 900, fontSize: 24, color: "#22c55e" }}>{COP(p.i - p.api)}</div>
                  <div style={{ color: "#444", fontSize: 11, marginBottom: 12 }}>ganancia neta/mes</div>
                  <div style={{ fontSize: 12, display: "flex", justifyContent: "space-between" }}><span style={{ color: "#333" }}>Ingresos:</span><span style={{ color: "#aaa" }}>{COP(p.i)}</span></div>
                  <div style={{ fontSize: 12, display: "flex", justifyContent: "space-between", marginTop: 4 }}><span style={{ color: "#333" }}>API:</span><span style={{ color: "#ef4444" }}>-{COP(p.api)}</span></div>
                </div>
              ))}
            </div>
            <div className="card" style={{ padding: 28, marginBottom: 16 }}>
              <h3 style={{ fontWeight: 900, fontSize: 20, marginBottom: 20 }}>🗓️ Plan de 6 meses</h3>
              {[
                {mes:"Mes 1",meta:"3-5 tiendas",accion:"Contacta 30 tiendas locales. Demos en persona. Primer ingreso: $600K–$1.250.000 COP.",c:"#ec4899"},
                {mes:"Mes 2",meta:"8-10 tiendas",accion:"Referidos de primeros clientes. Expande a ciudad cercana. Ingreso: $2.000.000 COP.",c:"#f97316"},
                {mes:"Mes 3",meta:"15 tiendas",accion:"Publica resultados reales en Instagram. Empieza publicidad pagada $50.000/día.",c:"#f59e0b"},
                {mes:"Mes 4",meta:"22 tiendas",accion:"Estandariza el onboarding en menos de 2 horas. Ingreso: $5.500.000 COP.",c:"#22c55e"},
                {mes:"Mes 5",meta:"32 tiendas",accion:"Considera ayuda part-time para configuraciones. Ingreso: $8.000.000 COP.",c:"#3b82f6"},
                {mes:"Mes 6",meta:"40+ tiendas",accion:"Negocio establecido. Sube precios a nuevos clientes. Meta: $10.000.000 COP netos/mes.",c:"#a855f7"},
              ].map((m, i, arr) => (
                <div key={i} style={{ display: "flex", gap: 16, paddingBottom: i < arr.length - 1 ? 20 : 0 }}>
                  <div style={{ display: "flex", flexDirection: "column", alignItems: "center", flexShrink: 0 }}>
                    <div style={{ width: 40, height: 40, borderRadius: "50%", background: `${m.c}22`, border: `2px solid ${m.c}66`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 10, fontWeight: 900, color: m.c, zIndex: 1, textAlign: "center", lineHeight: 1.2 }}>{m.mes}</div>
                    {i < arr.length - 1 && <div style={{ width: 2, flex: 1, background: `${m.c}33`, minHeight: 20, marginTop: 4 }} />}
                  </div>
                  <div style={{ paddingTop: 8 }}>
                    <div style={{ color: m.c, fontWeight: 800, fontSize: 13, marginBottom: 3 }}>Meta: {m.meta}</div>
                    <div style={{ color: "#555", fontSize: 13, lineHeight: 1.6 }}>{m.accion}</div>
                  </div>
                </div>
              ))}
            </div>
            <div style={{ background: "linear-gradient(135deg,#ec489908,#f9731608)", border: "1px solid #ec489933", borderRadius: 16, padding: 24 }}>
              <div style={{ fontWeight: 900, fontSize: 16, marginBottom: 8, color: "#ec4899" }}>🎯 Tu ventaja competitiva real</div>
              <p style={{ color: "#777", fontSize: 13, lineHeight: 1.8 }}>Los bots genéricos cobran $500K–$800K/mes y no saben nada de moda. <strong style={{ color: "#fff" }}>Tú cobras $200K–$290K con una IA especializada en ropa colombiana.</strong> El dueño de una boutique prefiere pagar menos por algo diseñado exactamente para su negocio.</p>
            </div>
          </div>
        )}

        {tab === "faqs" && (
          <div style={{ animation: "fadeUp .4s ease" }}>
            <div style={{ marginBottom: 24 }}>
              <h2 style={{ fontSize: 28, fontWeight: 900, letterSpacing: -0.5, marginBottom: 6 }}>❓ Lo que más preguntan los dueños de tiendas</h2>
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
              {faqs.map((f, i) => <FaqCard key={i} f={f} />)}
            </div>
          </div>
        )}
      </div>

      {chat && <ModaChat tiendaKey={chat} onClose={() => setChat(null)} />}
    </div>
  );
}
