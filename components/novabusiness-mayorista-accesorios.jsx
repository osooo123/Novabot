import { useState, useRef, useEffect } from "react";

const COP = n => `$${new Intl.NumberFormat("es-CO").format(n)}`;

/* ══════════════════════════════════════
   PROMPTS ESPECIALIZADOS
══════════════════════════════════════ */
const PROMPTS = {
  mayorista: (cfg) => `Eres NOVA, la mejor asesora de ventas mayoristas de ropa en Colombia para "${cfg.name}" en ${cfg.ciudad}.

ESPECIALIDAD: Venta mayorista de ropa — camisetas, sudaderas, pantalones, ropa básica y personalización.

CATÁLOGO:
${cfg.productos.map(p => `• ${p.n} — Unidad: ${COP(p.p1)} | Desde ${p.min} uds: ${COP(p.p2)} ${p.extra ? `| ${p.extra}` : ""}`).join("\n")}

SERVICIOS ADICIONALES: ${cfg.servicios}
PEDIDO MÍNIMO: ${cfg.minimo}
PAGOS: ${cfg.pagos}
ENVÍOS: ${cfg.envios}
PROMO: ${cfg.promo}

TÉCNICAS DE VENTA MAYORISTA:

1. PRECIO POR VOLUMEN — Siempre presenta los dos precios: unitario Y por volumen. Crea el contraste: "Sola vale $30.000 pero desde 6 unidades queda en $25.000 cada una — ahorras $30.000 en el pedido".

2. CALCULAR EL PEDIDO — Cuando el cliente diga la cantidad, calcula el total automáticamente: "6 camisetas × $25.000 = $150.000. ¿Le agregamos estampado? Con DTF quedarían $210.000 el pedido".

3. UPSELL MAYORISTA — Si pide camisetas de caballero, ofrece también dama. Si pide 6, sugiere que por 12 el precio baja más. "Con 12 unidades te bajan a $22.000 cada una — son $264.000 el pedido vs $300.000 con 6+6".

4. PERSONALIZACIÓN — Ofrece siempre la personalización. Es el upsell más fácil: "¿Las quieres con tu logo o diseño? Con estampado DTF son $8.000 adicionales por prenda — queda muy profesional".

5. URGENCIA MAYORISTA — "Esta semana tenemos disponibilidad en todos los colores", "El precio mayorista aplica hasta agotar el lote".

6. REVENDEDOR — Ayuda al cliente a calcular su margen: "Si las vendes a $50.000 cada una y las compras a $25.000, tu ganancia son $25.000 por camiseta. En un pedido de 12 = $300.000 de ganancia".

7. CIERRE MAYORISTA — Cuando el cliente esté listo: "¿Hacemos el pedido? Necesito: nombre completo, ciudad, dirección de envío y método de pago. ¿Pagas por Nequi, transferencia o contra entrega?".

8. SEGUIMIENTO — Si el cliente dice "lo pienso": "Claro! Para que no pierdas el precio, ¿cuándo crees que decides? Si es esta semana te aparto las unidades sin costo".

REGLAS: Máximo 4 oraciones. Precios en COP. Siempre calcula totales. Tono profesional pero cálido. Nunca digas que eres IA. Cierra con pregunta concreta.`,

  accesorios: (cfg) => `Eres NOVA, el mejor asesor de ventas de accesorios para celular en Colombia para "${cfg.name}" en ${cfg.ciudad}.

ESPECIALIDAD: Accesorios para celular — cases, protectores, cargadores, audífonos, soportes y gadgets.

CATÁLOGO:
${cfg.productos.map(p => `• ${p.n} — ${COP(p.p)} COP | Compatible: ${p.compatible} ${p.stock ? `| Stock: ${p.stock}` : ""}`).join("\n")}

COMBOS ACTIVOS: ${cfg.combos}
GARANTÍA: ${cfg.garantia}
PAGOS: ${cfg.pagos}
ENVÍOS: ${cfg.envios}
PROMO: ${cfg.promo}

TÉCNICAS DE VENTA ACCESORIOS CELULAR:

1. IDENTIFICAR EL CELULAR PRIMERO — Pregunta siempre el modelo exacto antes de recomendar: "¿Qué modelo tienes? ¿iPhone 15, Samsung S24, Xiaomi?" Así evitas confusiones y demuestras que sabes del tema.

2. COMBO PROTECCIÓN COMPLETA — Nunca vendas solo el case. El combo case + vidrio templado es el upsell más natural: "¿Solo el case o quieres el combo completo con vidrio templado? Por $5.000 más te protege la pantalla también — ahorra $80.000 de una rotura".

3. URGENCIA TECH — "Este case es el más pedido para ese modelo esta semana", "Quedan pocas unidades del color negro", "Es el favorito de los que cuidan bien su celular".

4. COMPATIBILIDAD — Siempre confirma compatibilidad: "Sí, este case es exacto para el Samsung S24 FE — los botones y cámara quedan perfectos alineados".

5. COMPARAR CON EL COSTO DE REPARACIÓN — "Un vidrio templado son $15.000. Cambiar la pantalla del iPhone son $400.000+. ¿Vale la pena?".

6. MAYORISTA TECH — Si el cliente pide varios o es revendedor: "Si llevas 5+ cases del mismo modelo te dejo en precio especial. ¿Es para revender o para uso personal?".

7. GARANTÍA Y CONFIANZA — "Todos nuestros cargadores son certificados — no dañan la batería. Muchos venden genéricos peligrosos, los nuestros tienen garantía de 3 meses".

8. CIERRE TECH — "¿Lo pedimos? Necesito el modelo exacto de tu celular para confirmar compatibilidad, tu dirección y método de pago. ¿Nequi o contra entrega?".

REGLAS: Habla como experto en tecnología pero accesible. Máximo 3-4 oraciones. Usa emojis tech con moderación 📱⚡🔋. Precios en COP. Nunca digas que eres IA. Cierra siempre con acción concreta.`,
};

/* ══════════════════════════════════════
   TIENDAS DEMO
══════════════════════════════════════ */
const TIENDAS = {
  westbasic: {
    tipo: "mayorista", color: "#f59e0b",
    name: "West Basic Colombia", ciudad: "Medellín",
    emoji: "👕", tagline: "Ropa mayorista — camisetas y básicos",
    minimo: "Mínimo 6 unidades por referencia",
    servicios: "Estampado DTF $8.000/prenda, Alto relieve $6.000 desde 6 uds, Bordado $12.000/prenda, Diseño propio o de West",
    pagos: "Nequi, Daviplata, transferencia bancaria — NO contraentrega",
    envios: "Medellín y área metro envío propio. Nacional por Coordinadora o Servientrega. Internacional disponible.",
    promo: "Desde 24 unidades precio especial. Primera compra con 5% adicional de descuento.",
    productos: [
      { n: "Camiseta Acid Wash Caballero", p1: 30000, p2: 27000, min: 6, extra: "Tallas S-XL, 8 colores" },
      { n: "Camiseta Qatar Dama", p1: 29000, p2: 27000, min: 6, extra: "Tallas XS-L, 6 colores" },
      { n: "Crop Top Qatar Dama", p1: 25000, p2: 22000, min: 6, extra: "Tallas XS-M, 5 colores" },
      { n: "Camisilla Qatar Dama", p1: 20000, p2: 18000, min: 6, extra: "Tallas XS-L, 4 colores" },
      { n: "Camisilla Basic Acid Wash Dama", p1: 27000, p2: 25000, min: 6, extra: "Tallas XS-L, 6 colores" },
      { n: "Sudadera Básica Unisex", p1: 55000, p2: 48000, min: 6, extra: "Tallas S-XL, 5 colores" },
      { n: "Pantaloneta Básica Caballero", p1: 32000, p2: 28000, min: 6, extra: "Tallas S-XL, 4 colores" },
      { n: "Pack Surtido x12 (mix tallas/colores)", p1: 0, p2: 24000, min: 12, extra: "Precio por unidad, surtido a elección" },
    ]
  },
  ropamayorista2: {
    tipo: "mayorista", color: "#8b5cf6",
    name: "StyleMayor CO", ciudad: "Bogotá",
    emoji: "🏭", tagline: "Ropa mayorista — moda urbana y básicos",
    minimo: "Mínimo 12 unidades por pedido",
    servicios: "Estampado serigrafía $7.000/prenda desde 12 uds, Sublimación total $15.000/prenda, Etiqueta personalizada $2.000/prenda",
    pagos: "Transferencia bancaria, Nequi empresarial — pago anticipado",
    envios: "Bogotá mensajería propia $8.000. Nacional por TCC o Coordinadora. Envío gratis en pedidos +$500.000.",
    promo: "Pedidos +$300.000 con 8% descuento. Clientes frecuentes acumulan puntos para descuentos.",
    productos: [
      { n: "Camiseta Oversize Básica", p1: 28000, p2: 22000, min: 12, extra: "Tallas S-XXL, 10 colores" },
      { n: "Hoodie Básico Unisex", p1: 65000, p2: 55000, min: 12, extra: "Tallas S-XL, 8 colores" },
      { n: "Jogger Básico Algodón", p1: 48000, p2: 42000, min: 12, extra: "Tallas S-XL, 6 colores" },
      { n: "Blusa Casual Dama", p1: 25000, p2: 20000, min: 12, extra: "Tallas XS-L, 8 colores" },
      { n: "Conjunto Sudadera + Jogger", p1: 110000, p2: 95000, min: 6, extra: "Tallas S-XL, 5 colores" },
      { n: "Camiseta Polo Básica", p1: 35000, p2: 29000, min: 12, extra: "Tallas S-XL, 6 colores" },
    ]
  },
  celutec: {
    tipo: "accesorios", color: "#3b82f6",
    name: "CeluTec Colombia", ciudad: "Bogotá",
    emoji: "📱", tagline: "Accesorios para celular — cases, cargadores y más",
    combos: "Combo Protección (case + vidrio templado) con 15% OFF. Combo Carga (cargador + cable) $45.000",
    garantia: "3 meses en cargadores y audífonos. 30 días en cases y accesorios.",
    pagos: "Nequi, Daviplata, contraentrega (+$5.000), tarjetas",
    envios: "Bogotá express 4 horas $8.000. Nacional 1-2 días $12.000. Envío gratis en pedidos +$80.000.",
    promo: "Compra 2 cases y lleva el 3ro al 50%. Vidrio templado GRATIS en compras +$60.000",
    productos: [
      { n: "Case Silicona Premium", p: 18000, compatible: "iPhone 13/14/15, Samsung S21-S24, Xiaomi", stock: "Alta disponibilidad" },
      { n: "Case MagSafe iPhone", p: 35000, compatible: "iPhone 12, 13, 14, 15 (todos los modelos)", stock: "Disponible" },
      { n: "Vidrio Templado 9H", p: 12000, compatible: "Todos los modelos populares", stock: "Alta disponibilidad" },
      { n: "Cargador Rápido 65W USB-C", p: 45000, compatible: "Universal USB-C", stock: "Disponible" },
      { n: "Cable USB-C 1.5m Trenzado", p: 18000, compatible: "Universal USB-C", stock: "Alta disponibilidad" },
      { n: "Audífonos Bluetooth TWS", p: 55000, compatible: "Universal Bluetooth 5.0", stock: "Disponible" },
      { n: "Soporte Magnético Carro", p: 28000, compatible: "Universal con imán", stock: "Disponible" },
      { n: "PowerBank 10.000mAh", p: 75000, compatible: "Universal USB-A + USB-C", stock: "Pocas unidades" },
      { n: "Aro de Luz LED Selfie", p: 22000, compatible: "Universal clip", stock: "Disponible" },
      { n: "Case Antigolpes Militar", p: 32000, compatible: "iPhone 13/14/15, Samsung S23/S24", stock: "Disponible" },
    ]
  },
  accetech: {
    tipo: "accesorios", color: "#22c55e",
    name: "AcceTech Medellín", ciudad: "Medellín",
    emoji: "⚡", tagline: "Accesorios tech y mayorista celular",
    combos: "Pack Revendedor x10 cases surtidos $120.000 (ahorra $60.000). Combo Gaming (audífonos + soporte) $65.000",
    garantia: "6 meses cargadores certificados. 3 meses audífonos. Cambio inmediato si falla.",
    pagos: "Nequi, Daviplata, transferencia, efectivo en punto físico Medellín",
    envios: "Medellín gratis en pedidos +$50.000. Nacional Coordinadora 1-2 días. Mismo día en Medellín +$8.000.",
    promo: "Mayorista desde 10 unidades con 30% descuento. Primer pedido con envío gratis.",
    productos: [
      { n: "Case Transparente Antigolpes", p: 15000, compatible: "iPhone 11-15, Samsung A y S series", stock: "Alta disponibilidad" },
      { n: "Case Diseño Fashion Mujer", p: 22000, compatible: "iPhone 13/14/15, Samsung S23/S24", stock: "Disponible" },
      { n: "Vidrio Templado Privacidad", p: 18000, compatible: "iPhone y Samsung principales modelos", stock: "Disponible" },
      { n: "Cargador Inalámbrico 15W", p: 38000, compatible: "MagSafe iPhone, Qi universal", stock: "Pocas unidades" },
      { n: "Audífonos Gaming RGB", p: 85000, compatible: "Universal 3.5mm + Bluetooth", stock: "Disponible" },
      { n: "Soporte Escritorio Ajustable", p: 32000, compatible: "Universal hasta 7 pulgadas", stock: "Alta disponibilidad" },
      { n: "Cable Lightning 2m MFI", p: 28000, compatible: "iPhone 5 al 14 (Lightning)", stock: "Disponible" },
      { n: "Pack Revendedor x10 Cases", p: 120000, compatible: "Surtido modelos populares", stock: "Disponible" },
    ]
  }
};

/* ══════════════════════════════════════
   CHAT COMPONENT
══════════════════════════════════════ */
function NovaChat({ tiendaKey, onClose }) {
  const cfg = TIENDAS[tiendaKey];
  const esMayorista = cfg.tipo === "mayorista";
  const [msgs, setMsgs] = useState([{
    role: "bot",
    text: esMayorista
      ? `¡Hola! 👕 Bienvenido a *${cfg.name}*\n\nSoy NOVA, tu asesora mayorista. Tenemos los mejores precios por volumen en Colombia 🇨🇴\n\n¿Qué referencia te interesa? ¿Camisetas, sudaderas, conjuntos? Cuéntame y te doy precios al instante 💼`
      : `¡Hola! 📱 Bienvenido a *${cfg.name}*\n\nSoy NOVA, tu asesor de accesorios para celular. Tenemos todo para proteger y potenciar tu teléfono ⚡\n\n¿Qué modelo de celular tienes? Así te recomiendo exactamente lo que necesitas 😊`,
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
        headers: {
          "Content-Type": "application/json",
          
        },
        body: JSON.stringify({
          model: "claude-sonnet-4-20250514",
          max_tokens: 1000,
          system: (PROMPTS[cfg.tipo] || PROMPTS.mayorista)(cfg),
          messages: h
        })
      });
      const d = await r.json();
      if (d.error) {
        setMsgs(p => [...p, { role: "bot", text: `⚠️ Error: ${d.error.message || "Intenta de nuevo en un momento."}`, time: new Date() }]);
        setLoading(false);
        return;
      }
      const t = d.content?.[0]?.text || "Disculpa, hubo un problema. Escribe de nuevo.";
      setMsgs(p => [...p, { role: "bot", text: t, time: new Date() }]);
      setHistory([...h, { role: "assistant", content: t }]);
    } catch (err) {
      console.error("NOVA error:", err);
      setMsgs(p => [...p, { role: "bot", text: "⚠️ Sin conexión. Verifica tu internet e intenta de nuevo.", time: new Date() }]);
    }
    setLoading(false);
  };

  const fmt = t => t.replace(/\*(.*?)\*/g, "<b>$1</b>").replace(/\n/g, "<br>");
  const time = d => d.toLocaleTimeString("es-CO", { hour: "2-digit", minute: "2-digit" });

  const quickMayorista = ["¿Cuál es el precio por docena? 📦", "¿Hacen estampados? 🎨", "¿Cuál es el mínimo? 🛒", "Quiero cotizar camisetas"];
  const quickAccesorios = ["Tengo iPhone 15 📱", "¿Tienen case para Samsung S24?", "¿Cuánto vale el vidrio templado?", "Quiero el combo protección 🛡️"];
  const quick = esMayorista ? quickMayorista : quickAccesorios;

  return (
    <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,.9)", zIndex: 1000, display: "flex", alignItems: "center", justifyContent: "center", backdropFilter: "blur(12px)", padding: 16 }}>
      <div style={{ width: "100%", maxWidth: 420, height: 650, background: "#06060f", border: `2px solid ${cfg.color}44`, borderRadius: 28, display: "flex", flexDirection: "column", overflow: "hidden", boxShadow: `0 0 80px ${cfg.color}22` }}>
        <div style={{ background: `${cfg.color}15`, borderBottom: `1px solid ${cfg.color}33`, padding: "14px 18px", display: "flex", alignItems: "center", gap: 12 }}>
          <div style={{ width: 44, height: 44, borderRadius: "50%", background: `linear-gradient(135deg,${cfg.color},${cfg.color}88)`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 22 }}>{cfg.emoji}</div>
          <div style={{ flex: 1 }}>
            <div style={{ fontWeight: 800, fontSize: 14, fontFamily: "'DM Sans',sans-serif" }}>{cfg.name}</div>
            <div style={{ display: "flex", alignItems: "center", gap: 5, marginTop: 2 }}>
              <span style={{ width: 6, height: 6, borderRadius: "50%", background: "#22c55e", display: "inline-block" }} />
              <span style={{ color: "#22c55e", fontSize: 11, fontWeight: 600 }}>NOVA activa • {cfg.tagline}</span>
            </div>
          </div>
          <button onClick={onClose} style={{ background: "#ffffff12", border: "none", color: "#888", borderRadius: 8, width: 32, height: 32, cursor: "pointer", fontSize: 16 }}>✕</button>
        </div>

        <div style={{ flex: 1, overflowY: "auto", padding: "14px 12px", display: "flex", flexDirection: "column", gap: 8, background: "#08080f" }}>
          {msgs.map((m, i) => (
            <div key={i} style={{ display: "flex", justifyContent: m.role === "user" ? "flex-end" : "flex-start", animation: "fadeUp .3s ease" }}>
              {m.role === "bot" && <div style={{ width: 28, height: 28, borderRadius: "50%", background: `linear-gradient(135deg,${cfg.color},${cfg.color}88)`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 12, flexShrink: 0, marginRight: 8, alignSelf: "flex-end", marginBottom: 16, fontWeight: 900, color: "#fff" }}>N</div>}
              <div style={{ maxWidth: "76%" }}>
                <div style={{ background: m.role === "user" ? `linear-gradient(135deg,${cfg.color},${cfg.color}cc)` : "#141420", color: "#fff", borderRadius: m.role === "user" ? "18px 18px 4px 18px" : "18px 18px 18px 4px", padding: "11px 15px", fontSize: 13, lineHeight: 1.6, border: m.role === "bot" ? `1px solid ${cfg.color}22` : "none", fontFamily: "'DM Sans',sans-serif" }} dangerouslySetInnerHTML={{ __html: fmt(m.text) }} />
                <div style={{ fontSize: 10, color: "#333", marginTop: 3, textAlign: m.role === "user" ? "right" : "left" }}>{time(m.time)}{m.role === "user" ? " ✓✓" : ""}</div>
              </div>
            </div>
          ))}
          {loading && (
            <div style={{ display: "flex", gap: 8 }}>
              <div style={{ width: 28, height: 28, borderRadius: "50%", background: `linear-gradient(135deg,${cfg.color},${cfg.color}88)`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 12, fontWeight: 900 }}>N</div>
              <div style={{ background: "#141420", border: `1px solid ${cfg.color}22`, borderRadius: "18px 18px 18px 4px", padding: "12px 16px", display: "flex", gap: 4 }}>
                {[0,1,2].map(i => <span key={i} style={{ width: 5, height: 5, borderRadius: "50%", background: cfg.color, display: "inline-block", animation: `bounce 1.2s infinite ${i*.2}s` }} />)}
              </div>
            </div>
          )}
          <div ref={endRef} />
        </div>

        <div style={{ padding: "8px 10px", display: "flex", gap: 5, overflowX: "auto", background: "#07070e", borderTop: `1px solid ${cfg.color}22` }}>
          {quick.map(q => <button key={q} onClick={() => setInput(q)} style={{ background: "transparent", border: `1px solid ${cfg.color}44`, color: cfg.color, borderRadius: 20, padding: "5px 11px", fontSize: 11, cursor: "pointer", whiteSpace: "nowrap", fontFamily: "'DM Sans',sans-serif", fontWeight: 600 }}>{q}</button>)}
        </div>

        <div style={{ padding: "10px 12px", background: "#07070e", borderTop: `1px solid ${cfg.color}22`, display: "flex", gap: 8 }}>
          <input value={input} onChange={e => setInput(e.target.value)} onKeyDown={e => e.key === "Enter" && send()} placeholder="Escríbele a NOVA..."
            style={{ flex: 1, background: "#141420", border: `1px solid ${cfg.color}33`, borderRadius: 24, padding: "11px 18px", color: "#fff", fontSize: 13, outline: "none", fontFamily: "'DM Sans',sans-serif" }} />
          <button onClick={send} disabled={loading || !input.trim()}
            style={{ width: 42, height: 42, borderRadius: "50%", background: loading || !input.trim() ? "#1a1a2a" : `linear-gradient(135deg,${cfg.color},${cfg.color}cc)`, border: "none", cursor: "pointer", fontSize: 17, flexShrink: 0 }}>➤</button>
        </div>
      </div>
    </div>
  );
}

/* ══════════════════════════════════════
   APP PRINCIPAL
══════════════════════════════════════ */
export default function NovaBusiness() {
  const [chat, setChat] = useState(null);
  const [nicho, setNicho] = useState("todos");
  const [tab, setTab] = useState("demos");
  const [copiedId, setCopiedId] = useState(null);
  const copy = (text, id) => { navigator.clipboard.writeText(text); setCopiedId(id); setTimeout(() => setCopiedId(null), 2500); };

  const tiendas = Object.entries(TIENDAS).filter(([_, t]) => nicho === "todos" || t.tipo === nicho);

  const nichoColor = { mayorista: "#f59e0b", accesorios: "#3b82f6", todos: "#ec4899" };
  const tipoLabel = { mayorista: "Mayorista ropa", accesorios: "Accesorios celular" };

  const scripts = {
    mayorista: [
      {
        titulo: "Primer contacto — tiendas mayoristas", icon: "📲", color: "#f59e0b", tag: "Para arrancar",
        texto: `Hola [Nombre]! 👋 Vi que manejas venta de ropa al por mayor en Instagram.

Una pregunta rápida: cuando te escriben compradores preguntando precios, tallas y cantidades disponibles — ¿alcanzas a responder todos a tiempo, incluyendo los que llegan de noche o fin de semana?

Creamos NOVA, una asesora mayorista con IA que conoce todo tu catálogo, calcula precios por volumen automáticamente y cierra pedidos sola, 24/7.

Distribuidoras en Colombia han aumentado sus pedidos hasta 38% en el primer mes.

¿Te hago una demo de 10 min con TU tipo de ropa? Gratis y sin compromiso 🚀`
      },
      {
        titulo: "Ventaja vs West Basic y competidores", icon: "⚔️", color: "#ef4444", tag: "Diferenciación",
        texto: `La diferencia entre NOVA y otros bots mayoristas es simple:

Los bots básicos solo responden preguntas. NOVA vende activamente:

✅ Calcula el total del pedido automáticamente
✅ Sugiere aumentar la cantidad cuando hay descuento por volumen
✅ Ofrece personalización (estampados) como upsell natural
✅ Ayuda al comprador a calcular SU margen de reventa
✅ Cierra el pedido completo sin mandarte al catálogo externo

Es la diferencia entre un bot que informa y un vendedor que cierra.

¿Quieres que te muestre la diferencia en vivo? 🎯`
      },
      {
        titulo: "Objeción: Ya tenemos catálogo en PDF/link", icon: "📋", color: "#22c55e", tag: "Objeción común",
        texto: `El catálogo es excelente para que el cliente vea las opciones 📋

Pero el problema es lo que pasa DESPUÉS: el comprador ve el catálogo, tiene dudas sobre tallas, precios por volumen, tiempo de entrega... y tiene que esperar a que alguien le responda.

NOVA responde esas dudas al instante, calcula el precio exacto para la cantidad que quieren y cierra el pedido en el mismo chat.

¿Cuántos compradores te escriben después de ver el catálogo y no cierran porque nadie les responde a tiempo? 💰`
      },
      {
        titulo: "Cierre para mayorista", icon: "🤝", color: "#a855f7", tag: "Para cerrar",
        texto: `¡Perfecto! Tu NOVA mayorista va a quedar increíble 💼

Para configurarla necesito:
1️⃣ Lista completa de referencias con precio unitario y por volumen
2️⃣ Mínimo por referencia y por pedido total
3️⃣ Servicios de personalización que ofreces y precios
4️⃣ Métodos de pago y política de envíos
5️⃣ Tono: ¿formal/corporativo o más cercano?

Pago del primer mes por Nequi o transferencia. En 24h tienes NOVA cotizando y cerrando pedidos mayoristas sola.

Garantía 30 días completa. ¿Arrancamos? 🚀`
      },
    ],
    accesorios: [
      {
        titulo: "Primer contacto — accesorios celular", icon: "📲", color: "#3b82f6", tag: "Para arrancar",
        texto: `Hola [Nombre]! 👋 Vi tu tienda de accesorios para celular en Instagram — tienen muy buen catálogo 📱

Una pregunta: cuando alguien escribe "¿tienen case para iPhone 15 Pro Max negro?" a las 10pm... ¿quién les responde?

Creamos NOVA, un asesor tech con IA que conoce compatibilidad de todos los modelos, recomienda el combo completo (case + vidrio + cargador) y cierra la venta solo, 24/7.

Tiendas de accesorios han aumentado su ticket promedio 65% porque NOVA siempre ofrece el combo de protección completo.

¿Te hago una demo rápida? 🚀`
      },
      {
        titulo: "Objeción: Mis productos son muy específicos por modelo", icon: "📱", color: "#22c55e", tag: "Objeción técnica",
        texto: `Exactamente por eso NOVA es perfecta para tu negocio 🎯

Lo primero que hace es preguntar el modelo exacto del celular. Con eso filtra y muestra solo los accesorios compatibles — sin confusiones ni devoluciones por incompatibilidad.

Además recuerda el modelo durante toda la conversación. Si el cliente pregunta por un case y después por un vidrio, NOVA ya sabe para qué celular es sin que lo repita.

¿Cuántas devoluciones tienes por compatibilidad? Con NOVA eso se elimina casi por completo. 📦`
      },
      {
        titulo: "Argumento ticket promedio", icon: "💰", color: "#f59e0b", tag: "Aumentar ventas",
        texto: `La magia de NOVA en accesorios está en el upsell automático 💡

Cuando alguien pide un case por $18.000, NOVA dice:
"¿Solo el case o quieres el combo completo? Con el vidrio templado son $5.000 más pero proteges también la pantalla — te ahorras $300.000 de un cambio de pantalla si se te cae."

Ese combo pasa el ticket de $18.000 a $30.000. Si tienes 10 ventas al día, son $120.000 pesos más diarios — $3.600.000 al mes extra solo con ese upsell.

¿Cuánto te cobra tu bot actual por hacer eso? 🎯`
      },
      {
        titulo: "Cierre para accesorios", icon: "🤝", color: "#a855f7", tag: "Para cerrar",
        texto: `¡Listo! Tu NOVA tech va a ser increíble para tu tienda 📱⚡

Para configurarla necesito:
1️⃣ Lista de productos con precio y modelos compatibles
2️⃣ Combos que manejas y sus precios especiales
3️⃣ Política de garantía y cambios
4️⃣ Envíos: ¿contraentrega, domicilio propio, nacional?
5️⃣ ¿Manejas mayorista también? (para configurar precios por volumen)

Pago primer mes por Nequi o Daviplata. En 24h NOVA está vendiendo combos y calculando compatibilidades sola.

Garantía 30 días. ¿Arrancamos? 🚀`
      },
    ]
  };

  const vsData = [
    { aspecto: "Calcula total del pedido automáticamente", nova: true, basico: false, manual: false },
    { aspecto: "Sugiere upsell / combo sin que pregunten", nova: true, basico: false, manual: false },
    { aspecto: "Responde 24/7 sin descanso", nova: true, basico: true, manual: false },
    { aspecto: "Conoce compatibilidad por modelo de celular", nova: true, basico: false, manual: true },
    { aspecto: "Cierra venta en el chat sin link externo", nova: true, basico: false, manual: true },
    { aspecto: "Maneja precios por volumen mayorista", nova: true, basico: false, manual: true },
    { aspecto: "Ayuda al revendedor a calcular su margen", nova: true, basico: false, manual: false },
    { aspecto: "Costo mensual", nova: "$290K COP", basico: "$500K+", manual: "$1.2M+ nómina" },
  ];

  return (
    <div style={{ minHeight: "100vh", background: "#05050d", color: "#fff", fontFamily: "'DM Sans', sans-serif" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@300;400;500;600;700;800;900&display=swap');
        *{box-sizing:border-box;margin:0;padding:0}
        ::-webkit-scrollbar{width:3px}::-webkit-scrollbar-track{background:#0a0a14}::-webkit-scrollbar-thumb{background:#ffffff22;border-radius:2px}
        @keyframes bounce{0%,80%,100%{transform:scale(.6);opacity:.4}40%{transform:scale(1);opacity:1}}
        @keyframes fadeUp{from{opacity:0;transform:translateY(8px)}to{opacity:1;transform:translateY(0)}}
        @keyframes pulse{0%,100%{opacity:1}50%{opacity:.3}}
        @keyframes float{0%,100%{transform:translateY(0)}50%{transform:translateY(-8px)}}
        .card{background:#0a0a14;border:1px solid #1a1a2a;border-radius:18px;transition:all .25s}
        .card:hover{transform:translateY(-3px)}
      `}</style>

      {/* HEADER */}
      <div style={{ background: "#07070e", borderBottom: "1px solid #12121e", padding: "14px 24px", display: "flex", alignItems: "center", gap: 14 }}>
        <div style={{ width: 38, height: 38, borderRadius: 11, background: "linear-gradient(135deg,#f59e0b,#3b82f6)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 20 }}>🤖</div>
        <div>
          <div style={{ fontWeight: 900, fontSize: 17, letterSpacing: -0.5 }}>NOVABusiness — Mayorista & Accesorios</div>
          <div style={{ color: "#444", fontSize: 12 }}>Bots especializados para dos nichos de alto volumen en Colombia</div>
        </div>
      </div>

      {/* TABS */}
      <div style={{ background: "#07070e", borderBottom: "1px solid #12121e", padding: "0 24px", display: "flex", gap: 2 }}>
        {[["demos","🤖","Demos en vivo"],["scripts","📋","Guiones de venta"],["ventajas","⚔️","NOVA vs competencia"],["nichos","🎯","Análisis de nichos"]].map(([id,icon,label]) => (
          <button key={id} onClick={() => setTab(id)} style={{ background: "transparent", border: "none", borderBottom: `2px solid ${tab === id ? "#ec4899" : "transparent"}`, color: tab === id ? "#ec4899" : "#444", padding: "13px 18px", cursor: "pointer", fontSize: 13, fontWeight: tab === id ? 800 : 500, fontFamily: "'DM Sans',sans-serif", whiteSpace: "nowrap" }}>
            {icon} {label}
          </button>
        ))}
      </div>

      <div style={{ maxWidth: 1060, margin: "0 auto", padding: "28px 20px" }}>

        {/* ══ DEMOS ══ */}
        {tab === "demos" && (
          <div style={{ animation: "fadeUp .3s ease" }}>
            <div style={{ marginBottom: 24 }}>
              <h2 style={{ fontSize: 26, fontWeight: 900, letterSpacing: -0.5, marginBottom: 8 }}>🤖 Demos en vivo — 4 tiendas reales</h2>
              <div style={{ display: "flex", gap: 8 }}>
                {[["todos","🌐","Todos"],["mayorista","👕","Mayorista ropa"],["accesorios","📱","Accesorios celular"]].map(([id,icon,label]) => (
                  <button key={id} onClick={() => setNicho(id)} style={{ background: nicho === id ? `${nichoColor[id]}18` : "transparent", border: `1px solid ${nicho === id ? nichoColor[id] + "55" : "#1a1a2a"}`, color: nicho === id ? nichoColor[id] : "#444", borderRadius: 20, padding: "6px 16px", cursor: "pointer", fontSize: 13, fontWeight: nicho === id ? 700 : 500, fontFamily: "'DM Sans',sans-serif" }}>
                    {icon} {label}
                  </button>
                ))}
              </div>
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "repeat(2,1fr)", gap: 16 }}>
              {tiendas.map(([key, t]) => (
                <div key={key} className="card" style={{ padding: 24, border: `1px solid ${t.color}33`, cursor: "pointer" }} onClick={() => setChat(key)}>
                  <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 14 }}>
                    <div style={{ width: 48, height: 48, borderRadius: 14, background: `${t.color}18`, border: `1px solid ${t.color}44`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 24, animation: "float 4s infinite" }}>{t.emoji}</div>
                    <div>
                      <div style={{ fontWeight: 800, fontSize: 15 }}>{t.name}</div>
                      <div style={{ color: t.color, fontSize: 11, fontWeight: 600, marginTop: 2 }}>
                        {t.ciudad} · {tipoLabel[t.tipo]}
                      </div>
                    </div>
                    <div style={{ marginLeft: "auto", background: `${t.color}18`, border: `1px solid ${t.color}33`, borderRadius: 20, padding: "3px 10px", fontSize: 10, color: t.color, fontWeight: 700 }}>
                      {t.tipo === "mayorista" ? "MAYORISTA" : "RETAIL"}
                    </div>
                  </div>

                  <div style={{ marginBottom: 12 }}>
                    {(t.productos || []).slice(0, 3).map(p => (
                      <div key={p.n} style={{ display: "flex", justifyContent: "space-between", padding: "5px 0", borderBottom: "1px solid #0d0d18", fontSize: 12 }}>
                        <span style={{ color: "#666" }}>{p.n.substring(0, 28)}{p.n.length > 28 ? "..." : ""}</span>
                        <span style={{ color: "#22c55e", fontWeight: 700 }}>{t.tipo === "mayorista" ? `${COP(p.p2)}/u x${p.min}` : COP(p.p)}</span>
                      </div>
                    ))}
                    <div style={{ color: "#333", fontSize: 11, marginTop: 5 }}>+ {t.productos.length - 3} referencias más...</div>
                  </div>

                  <div style={{ background: `${t.color}0d`, border: `1px solid ${t.color}22`, borderRadius: 10, padding: "9px 12px", fontSize: 12, color: t.color, marginBottom: 14 }}>
                    🎁 {t.promo}
                  </div>

                  <button style={{ width: "100%", background: `linear-gradient(135deg,${t.color},${t.color}cc)`, border: "none", color: "#fff", borderRadius: 12, padding: "12px", cursor: "pointer", fontSize: 14, fontWeight: 900, fontFamily: "'DM Sans',sans-serif" }}>
                    💬 Probar NOVA ahora →
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ══ SCRIPTS ══ */}
        {tab === "scripts" && (
          <div style={{ animation: "fadeUp .3s ease" }}>
            <div style={{ marginBottom: 24 }}>
              <h2 style={{ fontSize: 26, fontWeight: 900, letterSpacing: -0.5, marginBottom: 6 }}>📋 Guiones por nicho</h2>
              <p style={{ color: "#444", fontSize: 14 }}>Mensajes personalizados para cada tipo de negocio</p>
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20 }}>
              <div>
                <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 14, padding: "10px 16px", background: "#f59e0b12", border: "1px solid #f59e0b33", borderRadius: 12 }}>
                  <span style={{ fontSize: 22 }}>👕</span>
                  <div style={{ fontWeight: 800, fontSize: 15, color: "#f59e0b" }}>Mayorista de Ropa</div>
                </div>
                <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                  {scripts.mayorista.map((s, i) => <ScriptCard key={i} s={s} idx={`m${i}`} copiedId={copiedId} onCopy={copy} />)}
                </div>
              </div>
              <div>
                <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 14, padding: "10px 16px", background: "#3b82f612", border: "1px solid #3b82f633", borderRadius: 12 }}>
                  <span style={{ fontSize: 22 }}>📱</span>
                  <div style={{ fontWeight: 800, fontSize: 15, color: "#3b82f6" }}>Accesorios Celular</div>
                </div>
                <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                  {scripts.accesorios.map((s, i) => <ScriptCard key={i} s={s} idx={`a${i}`} copiedId={copiedId} onCopy={copy} />)}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ══ VENTAJAS ══ */}
        {tab === "ventajas" && (
          <div style={{ animation: "fadeUp .3s ease" }}>
            <div style={{ marginBottom: 24 }}>
              <h2 style={{ fontSize: 26, fontWeight: 900, letterSpacing: -0.5, marginBottom: 6 }}>⚔️ NOVA vs la competencia</h2>
              <p style={{ color: "#444", fontSize: 14 }}>Por qué NOVA gana frente a West Basic y otros bots del mercado</p>
            </div>

            <div className="card" style={{ padding: 28, marginBottom: 20, overflowX: "auto" }}>
              <table style={{ width: "100%", borderCollapse: "collapse", minWidth: 600 }}>
                <thead>
                  <tr>
                    <th style={{ textAlign: "left", padding: "10px 14px", color: "#333", fontSize: 12, fontFamily: "'DM Sans',sans-serif" }}></th>
                    <th style={{ padding: "10px 14px", fontSize: 13, color: "#22c55e", background: "#22c55e10", borderRadius: 8, fontFamily: "'DM Sans',sans-serif", fontWeight: 800 }}>✨ NOVA</th>
                    <th style={{ padding: "10px 14px", fontSize: 12, color: "#f59e0b", fontFamily: "'DM Sans',sans-serif" }}>Bot básico (West Basic style)</th>
                    <th style={{ padding: "10px 14px", fontSize: 12, color: "#555", fontFamily: "'DM Sans',sans-serif" }}>Atención manual</th>
                  </tr>
                </thead>
                <tbody>
                  {vsData.map((r, i) => (
                    <tr key={i} style={{ borderTop: "1px solid #0d0d18" }}>
                      <td style={{ padding: "10px 14px", color: "#777", fontSize: 13 }}>{r.aspecto}</td>
                      {["nova","basico","manual"].map(k => (
                        <td key={k} style={{ padding: "10px 14px", textAlign: "center", background: k === "nova" ? "#22c55e06" : "transparent" }}>
                          {typeof r[k] === "boolean"
                            ? <span style={{ color: r[k] ? "#22c55e" : "#333", fontWeight: 700, fontSize: 16 }}>{r[k] ? "✓" : "✕"}</span>
                            : <span style={{ color: k === "nova" ? "#22c55e" : k === "basico" ? "#ef4444" : "#f59e0b", fontWeight: 700, fontSize: 12 }}>{r[k]}</span>
                          }
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }}>
              {[
                { t: "Por qué NOVA supera a West Basic", color: "#f59e0b", icon: "👕", puntos: ["West Basic manda al catálogo externo — NOVA responde todo en el chat", "West Basic solo informa precios — NOVA calcula totales y upsell automático", "West Basic no cierra ventas activamente — NOVA propone el pedido", "West Basic no ayuda al revendedor con sus márgenes — NOVA sí"] },
                { t: "Por qué NOVA supera a los bots de accesorios", color: "#3b82f6", icon: "📱", puntos: ["Los bots básicos no conocen compatibilidad por modelo — NOVA sí", "No ofrecen combo de protección automáticamente — NOVA siempre lo hace", "No manejan precios mayoristas para revendedores — NOVA sí", "No calculan el ahorro vs costo de reparación — NOVA lo usa para cerrar"] },
              ].map(s => (
                <div key={s.t} className="card" style={{ padding: 22, border: `1px solid ${s.color}22` }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 14 }}>
                    <span style={{ fontSize: 24 }}>{s.icon}</span>
                    <span style={{ color: s.color, fontWeight: 800, fontSize: 14 }}>{s.t}</span>
                  </div>
                  {s.puntos.map((p, i) => (
                    <div key={i} style={{ display: "flex", gap: 8, marginBottom: 8 }}>
                      <span style={{ color: s.color, flexShrink: 0 }}>✓</span>
                      <span style={{ color: "#666", fontSize: 13, lineHeight: 1.6 }}>{p}</span>
                    </div>
                  ))}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ══ ANÁLISIS DE NICHOS ══ */}
        {tab === "nichos" && (
          <div style={{ animation: "fadeUp .3s ease" }}>
            <div style={{ marginBottom: 24 }}>
              <h2 style={{ fontSize: 26, fontWeight: 900, letterSpacing: -0.5, marginBottom: 6 }}>🎯 Análisis de nichos</h2>
              <p style={{ color: "#444", fontSize: 14 }}>Por qué mayorista y accesorios son dos de los mejores nichos para NOVA en Colombia</p>
            </div>

            {[
              {
                nicho: "Ropa Mayorista", icon: "👕", color: "#f59e0b",
                oportunidad: "🔥 Alta",
                mercado: "Miles de distribuidores y fabricantes en Medellín, Bogotá y Cali que venden por WhatsApp",
                dolores: ["Comprador pregunta precio + cantidad + personalización en el mismo mensaje — complejo de responder rápido", "Cálculo de precios por volumen es tedioso y propenso a errores", "No pueden mostrar catálogo completo en el chat — mandan links que el cliente no siempre abre", "Pierden pedidos cuando el comprador escribe fuera de horario"],
                novaPropuesta: ["Calcula automáticamente: 12 camisetas × $27.000 = $324.000 + estampado = $420.000", "Conoce todos los descuentos por volumen y los aplica sin errores", "Responde catálogo completo en el chat — sin links externos", "Activa 24/7 incluyendo madrugadas cuando compradores de otras ciudades escriben"],
                planRecomendado: "Pro $290.000/mes",
                roi: "Con 3 pedidos mayoristas adicionales/semana de $150.000 cada uno = $1.800.000 extra/mes"
              },
              {
                nicho: "Accesorios Celular", icon: "📱", color: "#3b82f6",
                oportunidad: "🔥🔥 Muy alta",
                mercado: "Mercado masivo — cada colombiano cambia de celular y accesorios frecuentemente. Alta competencia pero bajo nivel de automatización",
                dolores: ["Preguntas de compatibilidad son el 60% de los mensajes — requieren conocimiento técnico", "Cliente pregunta por un case y compra solo eso — perdiendo el upsell de vidrio y cargador", "Devoluciones por incompatibilidad son costosas", "Compiten con Mercado Libre y Amazon — necesitan servicio superior"],
                novaPropuesta: ["Confirma compatibilidad exacta por modelo antes de vender — cero devoluciones", "Ofrece combo protección siempre — sube ticket de $18K a $45K+", "Compara costo accesorio vs costo reparación — argumento de cierre poderoso", "Atiende consultas técnicas complejas que un bot básico no puede"],
                planRecomendado: "Pro $290.000/mes",
                roi: "Con upsell de combo en 5 ventas diarias: +$135.000/día = +$4.050.000/mes extra"
              },
            ].map(n => (
              <div key={n.nicho} className="card" style={{ padding: 28, marginBottom: 16, border: `1px solid ${n.color}22` }}>
                <div style={{ display: "flex", alignItems: "center", gap: 14, marginBottom: 20 }}>
                  <div style={{ width: 52, height: 52, borderRadius: 16, background: `${n.color}18`, border: `1px solid ${n.color}44`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 28 }}>{n.icon}</div>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontWeight: 900, fontSize: 20, letterSpacing: -0.5 }}>{n.nicho}</div>
                    <div style={{ color: n.color, fontSize: 13, marginTop: 2 }}>Oportunidad: {n.oportunidad}</div>
                  </div>
                  <div style={{ background: "#22c55e12", border: "1px solid #22c55e33", borderRadius: 12, padding: "8px 16px", textAlign: "right" }}>
                    <div style={{ color: "#22c55e", fontWeight: 800, fontSize: 13 }}>{n.planRecomendado}</div>
                    <div style={{ color: "#333", fontSize: 10 }}>plan recomendado</div>
                  </div>
                </div>

                <p style={{ color: "#666", fontSize: 13, lineHeight: 1.7, marginBottom: 20 }}>{n.mercado}</p>

                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14, marginBottom: 16 }}>
                  <div style={{ background: "#0d0d18", border: "1px solid #ef444422", borderRadius: 12, padding: 16 }}>
                    <div style={{ color: "#ef4444", fontSize: 11, fontWeight: 700, textTransform: "uppercase", letterSpacing: 1.5, marginBottom: 10 }}>😤 Sus dolores actuales</div>
                    {n.dolores.map((d, i) => (
                      <div key={i} style={{ display: "flex", gap: 8, marginBottom: 8 }}>
                        <span style={{ color: "#ef4444", flexShrink: 0 }}>✕</span>
                        <span style={{ color: "#666", fontSize: 12, lineHeight: 1.6 }}>{d}</span>
                      </div>
                    ))}
                  </div>
                  <div style={{ background: "#0d0d18", border: `1px solid ${n.color}22`, borderRadius: 12, padding: 16 }}>
                    <div style={{ color: n.color, fontSize: 11, fontWeight: 700, textTransform: "uppercase", letterSpacing: 1.5, marginBottom: 10 }}>✨ Cómo NOVA lo resuelve</div>
                    {n.novaPropuesta.map((p, i) => (
                      <div key={i} style={{ display: "flex", gap: 8, marginBottom: 8 }}>
                        <span style={{ color: n.color, flexShrink: 0 }}>✓</span>
                        <span style={{ color: "#888", fontSize: 12, lineHeight: 1.6 }}>{p}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div style={{ background: `${n.color}0d`, border: `1px solid ${n.color}33`, borderRadius: 10, padding: "12px 16px" }}>
                  <span style={{ color: n.color, fontWeight: 700, fontSize: 13 }}>💰 ROI estimado: </span>
                  <span style={{ color: "#888", fontSize: 13 }}>{n.roi}</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {chat && <NovaChat tiendaKey={chat} onClose={() => setChat(null)} />}
    </div>
  );
}

function ScriptCard({ s, idx, copiedId, onCopy }) {
  const [open, setOpen] = useState(false);
  return (
    <div onClick={() => setOpen(o => !o)} style={{ background: "#0a0a14", border: `1px solid ${open ? s.color + "44" : "#1a1a2a"}`, borderRadius: 14, overflow: "hidden", cursor: "pointer", transition: "all .2s" }}>
      <div style={{ padding: "14px 18px", display: "flex", alignItems: "center", gap: 10 }}>
        <span style={{ fontSize: 20 }}>{s.icon}</span>
        <div style={{ flex: 1 }}>
          <div style={{ fontWeight: 700, fontSize: 13, fontFamily: "'DM Sans',sans-serif" }}>{s.titulo}</div>
          <div style={{ color: s.color, fontSize: 10, fontWeight: 700, textTransform: "uppercase", letterSpacing: 1.5, marginTop: 2 }}>{s.tag}</div>
        </div>
        <span style={{ color: "#444", fontSize: 18, transition: "transform .2s", transform: open ? "rotate(90deg)" : "none" }}>›</span>
      </div>
      {open && (
        <div style={{ borderTop: "1px solid #1a1a2a", padding: "14px 18px" }} onClick={e => e.stopPropagation()}>
          <pre style={{ color: "#ccc", fontSize: 12, lineHeight: 1.8, whiteSpace: "pre-wrap", fontFamily: "'DM Sans',sans-serif", marginBottom: 12 }}>{s.texto}</pre>
          <button onClick={() => onCopy(s.texto, idx)} style={{ background: copiedId === idx ? "#22c55e22" : `${s.color}18`, border: `1px solid ${copiedId === idx ? "#22c55e44" : s.color + "44"}`, color: copiedId === idx ? "#22c55e" : s.color, borderRadius: 9, padding: "7px 16px", cursor: "pointer", fontSize: 12, fontWeight: 800, fontFamily: "'DM Sans',sans-serif" }}>
            {copiedId === idx ? "✓ ¡Copiado!" : "📋 Copiar mensaje"}
          </button>
        </div>
      )}
    </div>
  );
}
