import { useState, useRef, useEffect } from "react";

const COP = n => `$${new Intl.NumberFormat("es-CO").format(n)}`;

/* ══════════════════════════════════════
   PROMPT ÉLITE — ROPA DEPORTIVA
══════════════════════════════════════ */
const NOVAFIT_PROMPT = (cfg) => `Eres NOVA, la mejor asesora de ventas de ropa deportiva en Colombia para "${cfg.name}".

ESPECIALIDAD: Ropa deportiva femenina y masculina — gym, running, yoga, outdoor y uso casual deportivo.

CATÁLOGO COMPLETO:
${cfg.productos.map(p => `• ${p.n} — ${COP(p.p)} COP | Tallas: ${p.tallas} | Colores: ${p.colores}${p.material ? ` | Material: ${p.material}` : ""}`).join("\n")}

PROMOCIÓN ACTIVA: ${cfg.promo}
PAGOS: ${cfg.pagos}
ENVÍOS: ${cfg.envios}
CIUDAD: ${cfg.ciudad}

TÉCNICAS DE VENTA PARA ROPA DEPORTIVA:

1. IDENTIFICAR USO — Pregunta siempre para qué va a usar la prenda: ¿gimnasio, running, yoga, uso diario, competencia? Eso define qué recomendar.

2. OUTFIT COMPLETO FITNESS — Nunca vendas solo una pieza. Si pide leggins, ofrece el top coordinado y la sudadera. El set completo sube el ticket de $80.000 a $250.000+.

3. LENGUAJE FITNESS — Usa términos del mundo fitness naturalmente: "compresión media", "secado rápido", "sin costuras", "anti-transparencia", "tiro alto para soporte", "tejido 4 vías".

4. BENEFICIO FUNCIONAL — No vendas la tela, vende el rendimiento: "Este leggins tiene compresión que reduce la fatiga muscular" > "Este leggins es de nylon".

5. PRUEBA SOCIAL FITNESS — "Nuestras clientas en el gym lo usan para CrossFit y aguanta todo", "Es el más pedido por las chicas de running".

6. TALLA Y CUERPO — Pregunta la talla con naturalidad. Si no sabe, ayuda: "¿Usas talla S/M en ropa normal? En deportiva generalmente es la misma".

7. ANTI-TRANSPARENCIA Y CALIDAD — Es la objeción #1 en leggins. Responde proactivamente: "Este leggins es 100% opaco, probado en sentadillas".

8. URGENCIA DEPORTIVA — "Es el favorito del momento", "Quedamos con pocas unidades en ese color", "La mayoría de nuestras clientas compran 2 para alternar en la semana".

9. COORDINACIÓN DE COLORES — Sugiere combinaciones: "El leggins negro combina con el top coral o el blanco. ¿Cuál va más con tu estilo?".

10. CIERRE CON DATOS — Para cerrar pide: nombre, ciudad/barrio, talla, color elegido, método de pago (Nequi/Daviplata/contraentrega).

REGLAS:
- Habla con energía fitness: motivadora, activa, como tu amiga que entrena contigo.
- Máximo 3-4 oraciones por mensaje para mantener el ritmo.
- Usa emojis fitness con moderación: 💪🏋️‍♀️🔥✨👟
- Precios siempre en COP.
- Si preguntan si es transparente, SIEMPRE di que es opaco y explica el material.
- Nunca digas que eres IA a menos que pregunten directamente.
- Cierra SIEMPRE con pregunta o acción concreta.
- Si el cliente dice su ciudad, personaliza: "Aquí en ${cfg.ciudad} tenemos envío express".`;

/* ══════════════════════════════════════
   CONFIGURACIÓN DE TIENDAS DEMO
══════════════════════════════════════ */
const TIENDAS = {
  ropafit: {
    name: "Ropafit", ciudad: "Colombia",
    color: "#ec4899",
    tagline: "Ropa deportiva femenina premium",
    promo: "Conjunto completo (leggins + top) con 15% OFF. Envío GRATIS en pedidos +$150.000",
    pagos: "Nequi, Daviplata, contraentrega, transferencia",
    envios: "Envío a todo Colombia. Bogotá y Medellín express 24h. Resto del país 2-3 días.",
    productos: [
      { n: "Leggins Compresión Alta Tiro Alto", p: 89000, tallas: "XS S M L XL", colores: "Negro, Coral, Malva, Verde oliva, Azul marino", material: "Nylon 80% + Spandex 20%, opaco, secado rápido" },
      { n: "Top Deportivo Sin Costuras", p: 65000, tallas: "XS S M L", colores: "Negro, Blanco, Coral, Lila, Verde menta", material: "Microfibra sin costuras, soporte medio" },
      { n: "Conjunto Fitness Premium (leggins + top)", p: 139000, tallas: "XS S M L XL", colores: "Negro/Coral, Negro/Blanco, Malva/Lila, Verde/Menta", material: "Set coordinado, compresión media" },
      { n: "Sudadera Crop Oversize", p: 95000, tallas: "S M L XL", colores: "Gris jaspeado, Negro, Beige, Azul acero", material: "French terry suave, interior felpa" },
      { n: "Short Deportivo Con Forro", p: 55000, tallas: "XS S M L XL", colores: "Negro, Gris, Azul marino, Verde militar", material: "Doble capa, anti-transparencia" },
      { n: "Leggins Estampado Tie Dye", p: 95000, tallas: "XS S M L", colores: "Rosa/Blanco, Azul/Verde, Morado/Rosa", material: "Nylon premium, tiro alto, compresión media" },
      { n: "Top Racerback Deportivo", p: 55000, tallas: "XS S M L", colores: "Negro, Blanco, Rojo, Verde botella", material: "Tejido 4 vías, soporte bajo-medio" },
      { n: "Maletín Gym Tote Bag", p: 45000, tallas: "Único", colores: "Negro, Gris, Rosa palo", material: "Lona resistente, compartimento zapatos" },
    ]
  },
  fitstore: {
    name: "FitStore Colombia", ciudad: "Medellín",
    color: "#f97316",
    tagline: "Ropa deportiva unisex y accesorios",
    promo: "3x2 en tops y camisetas. Envío gratis Medellín en pedidos +$100.000",
    pagos: "Nequi, Daviplata, efectivo contraentrega",
    envios: "Medellín express mismo día. Todo Colombia 2-4 días.",
    productos: [
      { n: "Camiseta Dry-Fit Hombre", p: 45000, tallas: "S M L XL XXL", colores: "Negro, Blanco, Azul, Rojo, Gris", material: "Poliéster 100% secado ultra rápido" },
      { n: "Pantaloneta Running Hombre", p: 55000, tallas: "S M L XL", colores: "Negro, Azul marino, Gris, Verde", material: "Tejido liviano con bolsillos laterales" },
      { n: "Leggins Mujer Performance", p: 75000, tallas: "XS S M L XL", colores: "Negro, Gris, Azul petróleo", material: "Compresión alta, opaco, bolsillo lateral" },
      { n: "Hoodie Unisex Premium", p: 120000, tallas: "S M L XL XXL", colores: "Negro, Gris jaspeado, Blanco roto", material: "Algodón 80% + poliéster, bolsillo canguro" },
      { n: "Medias Deportivas Pack x3", p: 35000, tallas: "35-38 / 39-43", colores: "Blanco, Negro, Gris", material: "Algodón con zonas de compresión" },
      { n: "Guantes Gym Antideslizante", p: 40000, tallas: "S/M / L/XL", colores: "Negro, Azul, Rojo", material: "Cuero sintético, ventilación dorsal" },
    ]
  }
};

/* ══════════════════════════════════════
   CHAT COMPONENT
══════════════════════════════════════ */
function FitChat({ tiendaKey, onClose }) {
  const cfg = TIENDAS[tiendaKey];
  const [msgs, setMsgs] = useState([{
    role: "bot",
    text: `¡Hola! 💪 Bienvenida a *${cfg.name}*\n\nSoy NOVA, tu asesora de moda deportiva. Estoy aquí para ayudarte a encontrar exactamente lo que necesitas para entrenar con estilo y comodidad. 🔥\n\n¿Qué estás buscando hoy? ¿Es para gym, running, yoga o uso diario? 😊`,
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
      const r = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ model: "claude-sonnet-4-20250514", max_tokens: 1000, system: NOVAFIT_PROMPT(cfg), messages: h })
      });
      const d = await r.json();
      const t = d.content?.[0]?.text || "Disculpa, intenta de nuevo.";
      setMsgs(p => [...p, { role: "bot", text: t, time: new Date() }]);
      setHistory([...h, { role: "assistant", content: t }]);
    } catch {
      setMsgs(p => [...p, { role: "bot", text: "⚠️ Error. Intenta de nuevo.", time: new Date() }]);
    }
    setLoading(false);
  };

  const fmt = t => t.replace(/\*(.*?)\*/g, "<b>$1</b>").replace(/\n/g, "<br>");
  const time = d => d.toLocaleTimeString("es-CO", { hour: "2-digit", minute: "2-digit" });

  const quick = [
    "Quiero un leggins para gym 🏋️",
    "¿Tienen conjunto deportivo? 💪",
    "¿Es transparente el leggins?",
    "¿Cuánto vale el envío? 📦",
  ];

  return (
    <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,.9)", zIndex: 1000, display: "flex", alignItems: "center", justifyContent: "center", backdropFilter: "blur(12px)", padding: 16 }}>
      <div style={{ width: "100%", maxWidth: 420, height: 650, background: "#06060f", border: `2px solid ${cfg.color}44`, borderRadius: 28, display: "flex", flexDirection: "column", overflow: "hidden", boxShadow: `0 0 80px ${cfg.color}22` }}>
        {/* Header */}
        <div style={{ background: `linear-gradient(135deg, ${cfg.color}20, ${cfg.color}08)`, borderBottom: `1px solid ${cfg.color}33`, padding: "14px 18px", display: "flex", alignItems: "center", gap: 12 }}>
          <div style={{ width: 44, height: 44, borderRadius: "50%", background: `linear-gradient(135deg, ${cfg.color}, ${cfg.color}88)`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 22 }}>💪</div>
          <div style={{ flex: 1 }}>
            <div style={{ fontWeight: 800, fontSize: 14, fontFamily: "'DM Sans',sans-serif" }}>{cfg.name}</div>
            <div style={{ display: "flex", alignItems: "center", gap: 5, marginTop: 2 }}>
              <span style={{ width: 6, height: 6, borderRadius: "50%", background: "#22c55e", display: "inline-block" }} />
              <span style={{ color: "#22c55e", fontSize: 11, fontWeight: 600 }}>NOVA activa • {cfg.tagline}</span>
            </div>
          </div>
          <button onClick={onClose} style={{ background: "#ffffff12", border: "none", color: "#888", borderRadius: 8, width: 32, height: 32, cursor: "pointer", fontSize: 16 }}>✕</button>
        </div>

        {/* Mensajes */}
        <div style={{ flex: 1, overflowY: "auto", padding: "14px 12px", display: "flex", flexDirection: "column", gap: 8, background: "linear-gradient(180deg, #08080f 0%, #06060f 100%)" }}>
          {msgs.map((m, i) => (
            <div key={i} style={{ display: "flex", justifyContent: m.role === "user" ? "flex-end" : "flex-start", animation: "fadeUp .3s ease" }}>
              {m.role === "bot" && (
                <div style={{ width: 28, height: 28, borderRadius: "50%", background: `linear-gradient(135deg,${cfg.color},${cfg.color}88)`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 13, flexShrink: 0, marginRight: 8, alignSelf: "flex-end", marginBottom: 16, fontWeight: 900 }}>N</div>
              )}
              <div style={{ maxWidth: "76%" }}>
                <div style={{
                  background: m.role === "user" ? `linear-gradient(135deg,${cfg.color},${cfg.color}cc)` : "#141420",
                  color: "#fff", fontSize: 13, lineHeight: 1.6,
                  borderRadius: m.role === "user" ? "18px 18px 4px 18px" : "18px 18px 18px 4px",
                  padding: "11px 15px",
                  border: m.role === "bot" ? `1px solid ${cfg.color}22` : "none",
                  fontFamily: "'DM Sans',sans-serif",
                  boxShadow: m.role === "bot" ? `0 4px 20px ${cfg.color}08` : "none"
                }} dangerouslySetInnerHTML={{ __html: fmt(m.text) }} />
                <div style={{ fontSize: 10, color: "#333", marginTop: 3, textAlign: m.role === "user" ? "right" : "left" }}>
                  {time(m.time)}{m.role === "user" ? " ✓✓" : ""}
                </div>
              </div>
            </div>
          ))}
          {loading && (
            <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
              <div style={{ width: 28, height: 28, borderRadius: "50%", background: `linear-gradient(135deg,${cfg.color},${cfg.color}88)`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 13, fontWeight: 900 }}>N</div>
              <div style={{ background: "#141420", border: `1px solid ${cfg.color}22`, borderRadius: "18px 18px 18px 4px", padding: "12px 16px", display: "flex", gap: 4 }}>
                {[0, 1, 2].map(i => <span key={i} style={{ width: 5, height: 5, borderRadius: "50%", background: cfg.color, display: "inline-block", animation: `bounce 1.2s infinite ${i * .2}s` }} />)}
              </div>
            </div>
          )}
          <div ref={endRef} />
        </div>

        {/* Quick replies */}
        <div style={{ padding: "8px 10px", display: "flex", gap: 5, overflowX: "auto", background: "#07070e", borderTop: `1px solid ${cfg.color}22` }}>
          {quick.map(q => (
            <button key={q} onClick={() => setInput(q)} style={{ background: "transparent", border: `1px solid ${cfg.color}44`, color: cfg.color, borderRadius: 20, padding: "5px 11px", fontSize: 11, cursor: "pointer", whiteSpace: "nowrap", fontFamily: "'DM Sans',sans-serif", fontWeight: 600 }}>{q}</button>
          ))}
        </div>

        {/* Input */}
        <div style={{ padding: "10px 12px", background: "#07070e", borderTop: `1px solid ${cfg.color}22`, display: "flex", gap: 8 }}>
          <input value={input} onChange={e => setInput(e.target.value)} onKeyDown={e => e.key === "Enter" && send()}
            placeholder="Escríbele a NOVA..."
            style={{ flex: 1, background: "#141420", border: `1px solid ${cfg.color}33`, borderRadius: 24, padding: "11px 18px", color: "#fff", fontSize: 13, outline: "none", fontFamily: "'DM Sans',sans-serif" }} />
          <button onClick={send} disabled={loading || !input.trim()}
            style={{ width: 42, height: 42, borderRadius: "50%", background: loading || !input.trim() ? "#1a1a2a" : `linear-gradient(135deg,${cfg.color},${cfg.color}cc)`, border: "none", cursor: "pointer", fontSize: 17, flexShrink: 0, transition: "all .2s" }}>➤</button>
        </div>
      </div>
    </div>
  );
}

/* ══════════════════════════════════════
   APP PRINCIPAL
══════════════════════════════════════ */
export default function NovaFit() {
  const [chat, setChat] = useState(null);
  const [tab, setTab] = useState("demo");
  const [copiedId, setCopiedId] = useState(null);

  const copy = (text, id) => { navigator.clipboard.writeText(text); setCopiedId(id); setTimeout(() => setCopiedId(null), 2500); };

  const pitch_ropafit = `Hola! 👋 Vi que Ropafit tiene atención por WhatsApp — está muy bien organizado 💪

Tengo una pregunta: ¿la persona que atiende como "Nati" puede responder a las 11pm o los domingos cuando sus clientas ven el post y escriben?

Trabajamos con tiendas de ropa deportiva y tenemos NOVA — una asesora con IA que responde exactamente como Nati, pero 24/7, sin descanso.

Conoce todo el catálogo, recomienda el conjunto completo (no solo una pieza), maneja tallas y cierra la venta sola.

Tiendas deportivas en Colombia han aumentado ventas hasta 43% en el primer mes.

¿Te hago una demo de 10 minutos con TU tipo de ropa? Es gratis y lo ves en acción ahora mismo 🚀`;

  const scripts = [
    {
      titulo: "Primer mensaje a Ropafit",
      icon: "📲", color: "#ec4899", tag: "Para mandar HOY",
      texto: pitch_ropafit
    },
    {
      titulo: "Si dicen 'Ya tenemos a Nati respondiendo'",
      icon: "💬", color: "#f97316", tag: "Objeción más común",
      texto: `¡Qué bueno que tienen a alguien! Y NOVA no reemplaza a Nati — la potencia 💪

Nati puede enfocarse en las ventas complejas, cambios, devoluciones y clientes VIP.

NOVA se encarga de lo que más tiempo le quita: las 50 preguntas diarias de "¿tienen talla M en negro?", "¿es transparente?", "¿cuánto vale el envío?". Eso a las 11pm cuando Nati ya no está disponible.

¿Le muestro cómo quedarían trabajando juntas? Las clientas ni saben que NOVA es un bot — responde igualito que Nati 😊`
    },
    {
      titulo: "Si dicen 'Está muy caro'",
      icon: "💰", color: "#22c55e", tag: "Objeción de precio",
      texto: `Entiendo, y mira esto con números reales 💪

Si Ropafit recibe 40 mensajes diarios y solo 5 se convierten en ventas con ticket de $139.000 (el conjunto)... eso son $695.000 al día en potencial.

¿Cuántos mensajes les llegan de noche o fin de semana cuando Nati no está? Si NOVA cierra solo 2 ventas extras al día que antes se perdían = $8.340.000 al mes adicionales.

El plan cuesta $290.000 al mes. Se paga en el primer día de ventas extra.

¿Hacemos los números para Ropafit específicamente? 🎯`
    },
    {
      titulo: "Para cerrar la venta con Ropafit",
      icon: "🤝", color: "#a855f7", tag: "Cierre",
      texto: `¡Perfecto! Su NOVA va a quedar increíble para Ropafit 🔥

Para configurarla necesito:
1️⃣ Lista de productos con precios, tallas y colores
2️⃣ Promociones activas que tengan
3️⃣ Cómo manejan envíos y pagos
4️⃣ El tono: ¿energético como para gym o más elegante?

El pago del primer mes es por Nequi o Daviplata. En 24 horas NOVA está respondiendo exactamente como Nati — pero sin descanso.

Y tienen 30 días de garantía completa. ¿A qué número les mando los datos de pago? 💪`
    },
  ];

  return (
    <div style={{ minHeight: "100vh", background: "#05050d", color: "#fff", fontFamily: "'DM Sans', sans-serif" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@300;400;500;600;700;800;900&display=swap');
        * { box-sizing: border-box; margin: 0; padding: 0; }
        ::-webkit-scrollbar { width: 3px; } ::-webkit-scrollbar-track { background: #0a0a14; } ::-webkit-scrollbar-thumb { background: #ec489955; border-radius: 2px; }
        @keyframes bounce { 0%,80%,100%{transform:scale(.6);opacity:.4} 40%{transform:scale(1);opacity:1} }
        @keyframes fadeUp { from{opacity:0;transform:translateY(10px)} to{opacity:1;transform:translateY(0)} }
        @keyframes pulse { 0%,100%{opacity:1} 50%{opacity:.3} }
        @keyframes float { 0%,100%{transform:translateY(0)} 50%{transform:translateY(-8px)} }
        .card { background:#0a0a14; border:1px solid #1a1a2a; border-radius:18px; transition:all .25s; }
        .card:hover { border-color:#ec489933; transform:translateY(-3px); }
      `}</style>

      {/* HEADER */}
      <div style={{ background: "#07070e", borderBottom: "1px solid #12121e", padding: "14px 24px", display: "flex", alignItems: "center", gap: 14 }}>
        <div style={{ width: 38, height: 38, borderRadius: 11, background: "linear-gradient(135deg,#ec4899,#f97316)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 20 }}>💪</div>
        <div>
          <div style={{ fontWeight: 900, fontSize: 17, letterSpacing: -0.5 }}>NOVAFit — Demo para Ropafit</div>
          <div style={{ color: "#444", fontSize: 12 }}>Bot especializado en ropa deportiva colombiana</div>
        </div>
        <div style={{ marginLeft: "auto", display: "flex", alignItems: "center", gap: 6 }}>
          <span style={{ width: 7, height: 7, borderRadius: "50%", background: "#22c55e", display: "inline-block", animation: "pulse 2s infinite" }} />
          <span style={{ color: "#22c55e", fontSize: 12, fontWeight: 700 }}>NOVA activa</span>
        </div>
      </div>

      {/* TABS */}
      <div style={{ background: "#07070e", borderBottom: "1px solid #12121e", padding: "0 24px", display: "flex", gap: 2 }}>
        {[["demo","🤖","Demo en vivo"],["scripts","📋","Guión para Ropafit"],["catalogo","🛍️","Catálogo"],["estrategia","🎯","Estrategia"]].map(([id,icon,label]) => (
          <button key={id} onClick={() => setTab(id)} style={{ background: "transparent", border: "none", borderBottom: `2px solid ${tab === id ? "#ec4899" : "transparent"}`, color: tab === id ? "#ec4899" : "#444", padding: "13px 18px", cursor: "pointer", fontSize: 13, fontWeight: tab === id ? 800 : 500, fontFamily: "'DM Sans',sans-serif", whiteSpace: "nowrap" }}>
            {icon} {label}
          </button>
        ))}
      </div>

      <div style={{ maxWidth: 1000, margin: "0 auto", padding: "28px 20px" }}>

        {/* ══ DEMO ══ */}
        {tab === "demo" && (
          <div style={{ animation: "fadeUp .3s ease" }}>
            <div style={{ textAlign: "center", marginBottom: 32 }}>
              <div style={{ display: "inline-flex", alignItems: "center", gap: 8, background: "#ec489912", border: "1px solid #ec489933", borderRadius: 20, padding: "6px 16px", fontSize: 12, color: "#ec4899", marginBottom: 16, fontWeight: 700 }}>
                <span style={{ width: 6, height: 6, borderRadius: "50%", background: "#ec4899", display: "inline-block", animation: "pulse 2s infinite" }} />
                Demo real — IA funcionando ahora mismo
              </div>
              <h2 style={{ fontSize: 28, fontWeight: 900, letterSpacing: -1, marginBottom: 8 }}>
                Así responde NOVA en <span style={{ color: "#ec4899" }}>Ropafit</span>
              </h2>
              <p style={{ color: "#555", fontSize: 15 }}>Escríbele como si fueras una clienta. Prueba preguntando por tallas, conjuntos y envíos.</p>
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20, marginBottom: 20 }}>
              {Object.entries(TIENDAS).map(([key, t]) => (
                <div key={key} className="card" style={{ padding: 28, border: `1px solid ${t.color}33`, cursor: "pointer" }} onClick={() => setChat(key)}>
                  <div style={{ display: "flex", alignItems: "center", gap: 14, marginBottom: 16 }}>
                    <div style={{ width: 52, height: 52, borderRadius: 16, background: `${t.color}18`, border: `1px solid ${t.color}44`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 28, animation: "float 4s infinite" }}>
                      {key === "ropafit" ? "🏋️‍♀️" : "👟"}
                    </div>
                    <div>
                      <div style={{ fontWeight: 800, fontSize: 16 }}>{t.name}</div>
                      <div style={{ color: t.color, fontSize: 12, fontWeight: 600 }}>{t.tagline}</div>
                    </div>
                  </div>

                  {/* Productos destacados */}
                  {t.productos.slice(0, 3).map(p => (
                    <div key={p.n} style={{ display: "flex", justifyContent: "space-between", padding: "6px 0", borderBottom: "1px solid #0d0d18", fontSize: 13 }}>
                      <span style={{ color: "#777" }}>{p.n.split(" ").slice(0, 3).join(" ")}...</span>
                      <span style={{ color: "#22c55e", fontWeight: 700 }}>{COP(p.p)}</span>
                    </div>
                  ))}
                  <div style={{ color: "#333", fontSize: 11, marginTop: 6, marginBottom: 14 }}>+ {t.productos.length - 3} productos más...</div>

                  <div style={{ background: `${t.color}10`, border: `1px solid ${t.color}33`, borderRadius: 10, padding: "10px 14px", fontSize: 12, color: t.color, marginBottom: 16 }}>
                    🎁 {t.promo}
                  </div>

                  <button style={{ width: "100%", background: `linear-gradient(135deg,${t.color},${t.color}cc)`, border: "none", color: "#fff", borderRadius: 12, padding: "13px", cursor: "pointer", fontSize: 14, fontWeight: 900, fontFamily: "'DM Sans',sans-serif" }}>
                    💬 Chatear con NOVA →
                  </button>
                </div>
              ))}
            </div>

            {/* Tip demo */}
            <div className="card" style={{ padding: 20, display: "flex", gap: 14, alignItems: "flex-start", border: "1px solid #f59e0b22" }}>
              <span style={{ fontSize: 28, flexShrink: 0 }}>💡</span>
              <div>
                <div style={{ fontWeight: 800, fontSize: 14, marginBottom: 6, color: "#f59e0b" }}>Cómo usar esta demo con Ropafit</div>
                <div style={{ color: "#555", fontSize: 13, lineHeight: 1.7 }}>
                  Cuando hables con el dueño de Ropafit, abre esta demo y di: <em style={{ color: "#ec4899" }}>"Escríbele como si fueras una clienta tuya que busca un conjunto deportivo."</em>
                  <br /><br />
                  Cuando vea a NOVA recomendar el conjunto completo, preguntar la talla y cerrar la venta sola... eso cierra el trato. No necesitas explicar más.
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ══ SCRIPTS ══ */}
        {tab === "scripts" && (
          <div style={{ animation: "fadeUp .3s ease" }}>
            <div style={{ marginBottom: 24 }}>
              <h2 style={{ fontSize: 26, fontWeight: 900, letterSpacing: -0.5, marginBottom: 6 }}>📋 Guión específico para Ropafit</h2>
              <p style={{ color: "#555", fontSize: 14 }}>Mensajes personalizados para esta tienda. Copia y pega directo en WhatsApp.</p>
            </div>

            {/* Contexto del prospecto */}
            <div style={{ background: "#ec489908", border: "1px solid #ec489922", borderRadius: 16, padding: 20, marginBottom: 20, display: "flex", gap: 14 }}>
              <div style={{ width: 48, height: 48, borderRadius: 14, background: "#ec489918", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 24, flexShrink: 0 }}>🏋️‍♀️</div>
              <div>
                <div style={{ fontWeight: 800, fontSize: 15, marginBottom: 4 }}>Lo que sabes de Ropafit</div>
                <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
                  {[
                    "✅ Ya tienen atención por WhatsApp activa con nombre ficticio 'Nati'",
                    "✅ Responden rápido (respondieron en el mismo minuto)",
                    "✅ Venden ropa deportiva — nicho con muchas preguntas de talla y material",
                    "⚡ Oportunidad: NOVA puede hacer lo mismo que Nati pero 24/7 y vendiendo más (outfits completos)",
                    "🎯 Plan recomendado: Pro $290.000/mes — ya tienen el hábito de WhatsApp, solo necesitan automatizarlo",
                  ].map((t, i) => (
                    <div key={i} style={{ color: "#777", fontSize: 13 }}>{t}</div>
                  ))}
                </div>
              </div>
            </div>

            <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
              {scripts.map((s, i) => <ScriptCard key={i} s={s} idx={i} copiedId={copiedId} onCopy={copy} />)}
            </div>
          </div>
        )}

        {/* ══ CATÁLOGO ══ */}
        {tab === "catalogo" && (
          <div style={{ animation: "fadeUp .3s ease" }}>
            <div style={{ marginBottom: 24 }}>
              <h2 style={{ fontSize: 26, fontWeight: 900, letterSpacing: -0.5, marginBottom: 6 }}>🛍️ Catálogo demo — Ropafit</h2>
              <p style={{ color: "#555", fontSize: 14 }}>Así quedaría el catálogo de Ropafit configurado en NOVA. Cuando sean clientes, usamos SUS productos reales.</p>
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(2,1fr)", gap: 14 }}>
              {TIENDAS.ropafit.productos.map(p => (
                <div key={p.n} className="card" style={{ padding: 20, border: "1px solid #ec489922" }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 10 }}>
                    <div style={{ fontWeight: 800, fontSize: 14, flex: 1, paddingRight: 10 }}>{p.n}</div>
                    <div style={{ color: "#22c55e", fontWeight: 900, fontSize: 18, flexShrink: 0 }}>{COP(p.p)}</div>
                  </div>
                  {p.material && (
                    <div style={{ background: "#ec489908", border: "1px solid #ec489922", borderRadius: 8, padding: "6px 10px", fontSize: 11, color: "#ec4899", marginBottom: 8 }}>
                      🧵 {p.material}
                    </div>
                  )}
                  <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
                    <div style={{ background: "#1a1a2a", borderRadius: 8, padding: "4px 10px", fontSize: 11, color: "#666" }}>📏 {p.tallas}</div>
                    <div style={{ background: "#1a1a2a", borderRadius: 8, padding: "4px 10px", fontSize: 11, color: "#666" }}>🎨 {p.colores.split(",").length} colores</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ══ ESTRATEGIA ══ */}
        {tab === "estrategia" && (
          <div style={{ animation: "fadeUp .3s ease", maxWidth: 720 }}>
            <div style={{ marginBottom: 24 }}>
              <h2 style={{ fontSize: 26, fontWeight: 900, letterSpacing: -0.5, marginBottom: 6 }}>🎯 Estrategia para cerrar Ropafit</h2>
              <p style={{ color: "#555", fontSize: 14 }}>Plan de acción específico basado en lo que viste en la conversación de WhatsApp</p>
            </div>

            {[
              {
                paso: "HOY", titulo: "Manda el primer mensaje", color: "#ec4899",
                acciones: [
                  "Ve a la pestaña 'Guión para Ropafit' y copia el primer mensaje",
                  "Búscalos en Instagram como @ropafit o busca el número en su bio",
                  "Mándalo por WhatsApp o Instagram DM",
                  "Espera respuesta — si tienen a 'Nati' activa, probablemente respondan rápido",
                ]
              },
              {
                paso: "CUANDO RESPONDAN", titulo: "Ofrece la demo personalizada", color: "#f97316",
                acciones: [
                  "Abre esta app en tu celular — sección 'Demo en vivo'",
                  "Selecciona 'Ropafit' (ropa deportiva femenina)",
                  "Comparte tu pantalla por videollamada O manda el link de la demo",
                  "Pídele que escriba como si fuera su clienta: 'Quiero un conjunto para gym'",
                  "Deja que NOVA responda sola y haga el trabajo",
                ]
              },
              {
                paso: "DURANTE LA DEMO", titulo: "Puntos clave que mostrar", color: "#f59e0b",
                acciones: [
                  "Que NOVA pregunta el uso (gym, running, yoga) antes de recomendar",
                  "Que sugiere el conjunto completo automáticamente — sube el ticket",
                  "Que responde la pregunta de transparencia proactivamente",
                  "Que pide talla y ciudad para personalizar la respuesta",
                  "Que cierra con método de pago — Nequi o Daviplata",
                ]
              },
              {
                paso: "AL CERRAR", titulo: "Datos que necesitas de Ropafit", color: "#22c55e",
                acciones: [
                  "Lista completa de productos con precios, tallas y colores disponibles",
                  "Su número de WhatsApp Business dedicado al negocio",
                  "Promociones activas que tengan esta semana",
                  "Si usan nombre ficticio como Nati: cuál tono quieren (energético, amigable, etc)",
                  "Confirmar pago por Nequi/Daviplata antes de configurar",
                ]
              },
            ].map((s, i, arr) => (
              <div key={i} style={{ display: "flex", gap: 16, marginBottom: i < arr.length - 1 ? 8 : 0 }}>
                <div style={{ display: "flex", flexDirection: "column", alignItems: "center", flexShrink: 0 }}>
                  <div style={{ background: `${s.color}22`, border: `2px solid ${s.color}55`, borderRadius: 12, padding: "6px 10px", fontSize: 10, fontWeight: 900, color: s.color, whiteSpace: "nowrap", zIndex: 1 }}>{s.paso}</div>
                  {i < arr.length - 1 && <div style={{ width: 2, flex: 1, background: `${s.color}22`, minHeight: 20, marginTop: 4 }} />}
                </div>
                <div style={{ background: "#0a0a14", border: `1px solid ${s.color}22`, borderRadius: 16, padding: 20, flex: 1, marginBottom: 12 }}>
                  <div style={{ color: s.color, fontWeight: 800, fontSize: 15, marginBottom: 12 }}>{s.titulo}</div>
                  <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                    {s.acciones.map((a, j) => (
                      <div key={j} style={{ display: "flex", gap: 10, alignItems: "flex-start" }}>
                        <div style={{ width: 22, height: 22, borderRadius: "50%", background: `${s.color}18`, border: `1px solid ${s.color}33`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 10, color: s.color, fontWeight: 900, flexShrink: 0, marginTop: 1 }}>{j + 1}</div>
                        <span style={{ color: "#777", fontSize: 13, lineHeight: 1.6 }}>{a}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            ))}

            <div style={{ background: "linear-gradient(135deg,#ec489908,#f9731608)", border: "1px solid #ec489933", borderRadius: 16, padding: 22, marginTop: 8 }}>
              <div style={{ fontWeight: 900, fontSize: 15, marginBottom: 8, color: "#ec4899" }}>💡 Tu ventaja con Ropafit</div>
              <p style={{ color: "#777", fontSize: 13, lineHeight: 1.8 }}>
                Ya tienen a "Nati" respondiendo — eso significa que ya entienden el valor de la atención por chat. <strong style={{ color: "#fff" }}>No tienes que convencerlos de que WhatsApp vende.</strong> Solo tienes que mostrarles que NOVA hace lo mismo que Nati pero mejor, más rápido y sin costo de nómina.<br /><br />
                Esa es tu entrada más fácil: <em style={{ color: "#ec4899" }}>"¿Qué pasa cuando Nati no puede responder?"</em>
              </p>
            </div>
          </div>
        )}
      </div>

      {chat && <FitChat tiendaKey={chat} onClose={() => setChat(null)} />}
    </div>
  );
}

function ScriptCard({ s, idx, copiedId, onCopy }) {
  const [open, setOpen] = useState(false);
  return (
    <div onClick={() => setOpen(o => !o)} style={{ background: "#0a0a14", border: `1px solid ${open ? s.color + "44" : "#1a1a2a"}`, borderRadius: 16, overflow: "hidden", cursor: "pointer", transition: "all .2s" }}>
      <div style={{ padding: "16px 20px", display: "flex", alignItems: "center", gap: 12 }}>
        <span style={{ fontSize: 22 }}>{s.icon}</span>
        <div style={{ flex: 1 }}>
          <div style={{ fontWeight: 800, fontSize: 14, fontFamily: "'DM Sans',sans-serif" }}>{s.titulo}</div>
          <div style={{ color: s.color, fontSize: 10, fontWeight: 700, textTransform: "uppercase", letterSpacing: 1.5, marginTop: 2 }}>{s.tag}</div>
        </div>
        <span style={{ color: "#444", fontSize: 20, transition: "transform .2s", transform: open ? "rotate(90deg)" : "none" }}>›</span>
      </div>
      {open && (
        <div style={{ borderTop: "1px solid #1a1a2a", padding: "16px 20px" }} onClick={e => e.stopPropagation()}>
          <pre style={{ color: "#ccc", fontSize: 13, lineHeight: 1.8, whiteSpace: "pre-wrap", fontFamily: "'DM Sans',sans-serif", marginBottom: 14 }}>{s.texto}</pre>
          <button onClick={() => onCopy(s.texto, idx)} style={{ background: copiedId === idx ? "#22c55e22" : `${s.color}18`, border: `1px solid ${copiedId === idx ? "#22c55e44" : s.color + "44"}`, color: copiedId === idx ? "#22c55e" : s.color, borderRadius: 10, padding: "8px 18px", cursor: "pointer", fontSize: 12, fontWeight: 800, fontFamily: "'DM Sans',sans-serif" }}>
            {copiedId === idx ? "✓ ¡Copiado!" : "📋 Copiar mensaje"}
          </button>
        </div>
      )}
    </div>
  );
}
