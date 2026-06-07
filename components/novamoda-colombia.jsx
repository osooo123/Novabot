import { useState, useRef, useEffect } from "react";

const COP = n => n === 0 ? "GRATIS" : `$${new Intl.NumberFormat("es-CO").format(n)}`;

export const MODA_PROMPT = (cfg) => `Eres NOVA, la mejor asesora de ventas de moda en Colombia para "${cfg.name}" en ${cfg.ciudad}.

TIPO DE TIENDA: ${cfg.tipo === "femenina" ? "Moda femenina, boutique, tendencias mujer" : "Ropa urbana, streetwear, moda joven"}

CATÁLOGO:
${cfg.productos.map(p => `- 👗 ${p.n} 💰 ${COP(p.p)} COP | Tallas: ${p.tallas || "Consultar"} | Colores: ${p.colores || "Varios"}`).join("\n")}

PROMOCIÓN: ${cfg.promo}
PAGOS: ${cfg.pagos}
ENVÍOS: ${cfg.envios}
TONO: ${cfg.tono}

TÉCNICAS DE VENTA PARA MODA:
1. Vende emoción e imagen, no solo tela: "Este vestido te va a hacer lucir increíble"`;

export default function NovaModaColombia({ cfg }) {
  const [msgs, setMsgs] = useState([
    {
      role: "bot",
      text: `¡Hola! 👗✨ Bienvenida a ${cfg.name}. Soy NOVA, tu asesora de moda personal. ¿Qué tipo de prenda estás buscando hoy? 🛍️`,
      time: new Date()
    }
  ]);
  const [history, setHistory] = useState([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const chatEndRef = useRef(null);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [msgs]);

  const handleSend = async (e) => {
    e.preventDefault();
    if (!input.trim() || loading) return;

    const userText = input.trim();
    setInput("");
    setLoading(true);

    const newMsgs = [...msgs, { role: "user", text: userText, time: new Date() }];
    setMsgs(newMsgs);

    const h = [...history, { role: "user", content: userText }];

    try {
      // 1. Llamamos a tu API interna segura en Vercel
      const r = await fetch("/api/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          messages: h,
          system: cfg.system
        })
      });

      const d = await r.json();
      
      // 2. Extraemos el texto configurado en tu chat.js
      const t = d.text || "Disculpa, intenta de nuevo.";

      setMsgs(p => [...p, { role: "bot", text: t, time: new Date() }]);
      setHistory([...h, { role: "assistant", content: t }]);
    } catch {
      setMsgs(p => [...p, { role: "bot", text: "⚠️ Error, Intenta de nuevo.", time: new Date() }]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-screen bg-slate-950 text-white max-w-md mx-auto shadow-2xl overflow-hidden font-sans border border-slate-800 rounded-2xl my-2">
      {/* Encabezado */}
      <div className="bg-gradient-to-r from-pink-600 to-purple-600 p-4 flex items-center justify-between border-b border-purple-500/20">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center border border-white/20 shadow-inner">
            <span className="text-xl">🛍️</span>
          </div>
          <div>
            <h1 className="font-bold text-base tracking-wide">{cfg.name}</h1>
            <p className="text-xs text-pink-200 flex items-center gap-1">
              <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse"></span>
              NOVA activa • {cfg.ciudad}
            </p>
          </div>
        </div>
      </div>

      {/* Área de Mensajes */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4 scrollbar-thin scrollbar-thumb-slate-800">
        {msgs.map((m, i) => (
          <div key={i} className={`flex ${m.role === "user" ? "justify-end" : "justify-start"} animate-fade-in`}>
            <div className={`max-w-[85%] rounded-2xl p-3 shadow-md ${
              m.role === "user" 
                ? "bg-gradient-to-br from-pink-500 to-rose-500 text-white rounded-br-none" 
                : "bg-slate-900 text-slate-100 rounded-bl-none border border-slate-800"
            }`}>
              <p className="text-sm leading-relaxed whitespace-pre-wrap">{m.text}</p>
              <span className="text-[10px] block text-right mt-1 opacity-60">
                {new Date(m.time).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
              </span>
            </div>
          </div>
        ))}
        {loading && (
          <div className="flex justify-start">
            <div className="bg-slate-900 border border-slate-800 rounded-2xl rounded-bl-none p-3 shadow-md flex items-center gap-1">
              <span className="w-2 h-2 rounded-full bg-pink-500 animate-bounce"></span>
              <span className="w-2 h-2 rounded-full bg-pink-500 animate-bounce [animation-delay:0.2s]"></span>
              <span className="w-2 h-2 rounded-full bg-pink-500 animate-bounce [animation-delay:0.4s]"></span>
            </div>
          </div>
        )}
        <div ref={chatEndRef} />
      </div>

      {/* Formulario de Entrada */}
      <form onSubmit={handleSend} className="p-4 bg-slate-900/50 border-t border-slate-800/60 backdrop-blur-md flex gap-2 items-center">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Escribe a NOVA..."
          disabled={loading}
          className="flex-1 bg-slate-900 border border-slate-800 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-pink-500 transition-all text-slate-100 placeholder-slate-500 disabled:opacity-50"
        />
        <button
          type="submit"
          disabled={loading || !input.trim()}
          className="bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700 text-white p-3 rounded-xl transition-all shadow-md disabled:opacity-40 disabled:pointer-events-none active:scale-95 flex items-center justify-center"
        >
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5 transform rotate-90">
            <path d="M3.478 2.405a.75.75 0 00-.926.94l2.432 7.905H13.5a.75.75 0 010 1.5H4.984l-2.432 7.905a.75.75 0 00.926.94 60.519 60.519 0 0018.445-8.986.75.75 0 000-1.218A60.517 60.517 0 003.478 2.405z" />
          </svg>
        </button>
      </form>
    </div>
  );
}