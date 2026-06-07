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
        system: cfg.system  // ¡Confirmado! Se llama cfg.system en tu objetos
      })
    });

    const d = await r.json();
    
    // 2. Extraemos el texto que configuramos en tu chat.js
    const t = d.text || "Disculpa, intenta de nuevo.";

    setMsgs(p => [...p, { role: "bot", text: t, time: new Date() }]);
    setHistory([...h, { role: "assistant", content: t }]);
  } catch {
    setMsgs(p => [...p, { role: "bot", text: "⚠️ Error, Intenta de nuevo.", time: new Date() }]);
