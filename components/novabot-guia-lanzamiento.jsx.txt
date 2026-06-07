import { useState } from "react";

const STEPS = [
  {
    id: 1,
    icon: "🔑",
    title: "Crear cuenta en Anthropic y obtener API Key",
    subtitle: "La IA que hace funcionar a NOVA",
    tiempo: "15 minutos",
    costo: "$5 USD (~$21.000 COP) una sola vez",
    costoColor: "#22c55e",
    tasks: [
      {
        t: "Abrir la página de Anthropic",
        detail: "Haz clic en el botón de abajo. Se abre en una pestaña nueva.",
        url: "https://console.anthropic.com/login",
        urlLabel: "Abrir Anthropic Console →",
        img: null,
        tip: "Usa tu correo personal o de Gmail. No necesitas tarjeta todavía para registrarte."
      },
      {
        t: "Crear tu cuenta",
        detail: 'En la página que abriste, haz clic en "Sign up" (registrarse). Ingresa tu correo y crea una contraseña. Te llegará un correo de verificación — ábrelo y haz clic en el enlace.',
        tip: "Si tienes cuenta de Google, puedes usar 'Continue with Google' para hacerlo más rápido."
      },
      {
        t: "Ir a 'Settings' → 'Billing' y recargar $5 USD",
        detail: 'Una vez dentro, en el menú izquierdo busca "Settings" (configuración), luego "Billing" (facturación). Haz clic en "Add credits" y recarga $5 USD con tu tarjeta. Eso te da crédito suficiente para los primeros 2-3 meses de operación con varios clientes.',
        tip: "Con $5 USD tienes aproximadamente 1.600 conversaciones completas. Para 5 clientes con uso normal, duran meses."
      },
      {
        t: "Crear tu API Key",
        detail: 'En el menú izquierdo busca "API Keys". Haz clic en "Create Key". Dale el nombre "NOVABot". Copia la clave que aparece — empieza con "sk-ant-...". IMPORTANTE: guárdala en un bloc de notas porque solo la ves una vez.',
        tip: "⚠️ Nunca compartas esta clave con nadie. Es como la contraseña de tu negocio. Si alguien la tiene, puede gastar tus créditos.",
        highlight: true
      }
    ]
  },
  {
    id: 2,
    icon: "💻",
    title: "Crear cuenta en GitHub",
    subtitle: "Aquí vas a guardar el código de tu app",
    tiempo: "10 minutos",
    costo: "GRATIS",
    costoColor: "#22c55e",
    tasks: [
      {
        t: "Abrir GitHub y registrarte",
        detail: "GitHub es donde vas a guardar el código de NOVABot. Es como una carpeta en la nube para código.",
        url: "https://github.com/signup",
        urlLabel: "Abrir GitHub →",
        tip: "Usa el mismo correo que usaste en Anthropic para mantener todo organizado."
      },
      {
        t: "Crear un repositorio nuevo",
        detail: 'Una vez dentro de GitHub, haz clic en el botón verde "New" o "Create repository". En "Repository name" escribe: novabot-colombia. Selecciona "Public". Luego clic en "Create repository".',
        tip: "Un repositorio es simplemente una carpeta donde vive tu proyecto."
      },
      {
        t: "Subir los archivos del proyecto",
        detail: 'En la página del repositorio verás un botón que dice "uploading an existing file". Haz clic ahí. Arrastra los archivos .jsx que descargaste de esta conversación (botventas-colombia.jsx y novabot-admin.jsx). Escribe un mensaje como "Primera versión NOVABot" y haz clic en "Commit changes".',
        tip: "Los archivos .jsx los descargaste en los pasos anteriores de esta conversación. Búscalos en tu carpeta de Descargas."
      }
    ]
  },
  {
    id: 3,
    icon: "🌐",
    title: "Publicar en Vercel (tu app en internet)",
    subtitle: "Para que tus clientes accedan desde cualquier lugar",
    tiempo: "10 minutos",
    costo: "GRATIS",
    costoColor: "#22c55e",
    tasks: [
      {
        t: "Crear cuenta en Vercel con GitHub",
        detail: 'Ve a vercel.com. Haz clic en "Sign Up" y luego en "Continue with GitHub". Autoriza la conexión. Vercel es el servicio que publica tu app en internet gratis.',
        url: "https://vercel.com/signup",
        urlLabel: "Abrir Vercel →",
        tip: "Vercel es usado por millones de empresas en el mundo. Es gratis para lo que necesitas."
      },
      {
        t: "Importar tu proyecto de GitHub",
        detail: 'Dentro de Vercel, haz clic en "Add New Project". Verás tu repositorio "novabot-colombia" en la lista. Haz clic en "Import".',
        tip: "Vercel detecta automáticamente que es un proyecto React y lo configura solo."
      },
      {
        t: "Agregar tu API Key como variable de entorno",
        detail: 'Antes de hacer Deploy, busca la sección "Environment Variables". En "Name" escribe: ANTHROPIC_API_KEY. En "Value" pega la clave que guardaste en el paso 1 (la que empieza con sk-ant-...). Haz clic en "Add".',
        tip: "⚠️ Este paso es CRÍTICO. Así tu API Key queda oculta y segura. Nadie la puede ver desde afuera.",
        highlight: true
      },
      {
        t: "Hacer Deploy",
        detail: 'Haz clic en el botón "Deploy". Vercel va a construir tu app en 1-2 minutos. Cuando termine verás una pantalla de celebración con tu URL. Va a ser algo como: novabot-colombia.vercel.app. ¡Esa es tu app publicada en internet!',
        tip: "Guarda esa URL. Es la dirección donde vive tu negocio. Puedes abrirla desde cualquier celular o computador del mundo."
      }
    ]
  },
  {
    id: 4,
    icon: "🔒",
    title: "Proteger la API Key (backend seguro)",
    subtitle: "Para que nadie pueda robar tu clave de Anthropic",
    tiempo: "20 minutos",
    costo: "GRATIS",
    costoColor: "#22c55e",
    tasks: [
      {
        t: "Entender por qué es necesario",
        detail: "Ahora mismo el código llama a Anthropic directamente desde el navegador del usuario, lo que expone tu API Key. Necesitamos crear un intermediario (función serverless) que haga las llamadas desde el servidor, donde la clave está oculta.",
        tip: "Es como poner un recepcionista entre tus clientes y la cocina. El cliente no entra a la cocina — le pide al recepcionista."
      },
      {
        t: "Crear el archivo api/chat.js en GitHub",
        detail: 'Ve a tu repositorio en GitHub. Haz clic en "Add file" → "Create new file". En el nombre escribe: api/chat.js (exactamente así, con la barra). Copia y pega el código que aparece abajo en esta guía. Luego clic en "Commit new file".',
        code: `export default async function handler(req, res) {
  // Permite solicitudes desde tu app
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Método no permitido' });
  }

  try {
    const { messages, system } = req.body;
    
    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': process.env.ANTHROPIC_API_KEY,
        'anthropic-version': '2023-06-01'
      },
      body: JSON.stringify({
        model: 'claude-sonnet-4-20250514',
        max_tokens: 1000,
        system: system,
        messages: messages
      })
    });
    
    const data = await response.json();
    return res.status(200).json(data);
    
  } catch (error) {
    return res.status(500).json({ 
      error: 'Error del servidor',
      detail: error.message 
    });
  }
}`,
        tip: "Este código recibe los mensajes de tu app, los envía a Anthropic usando tu clave (oculta), y devuelve la respuesta. La clave nunca sale del servidor."
      },
      {
        t: "Actualizar el código del chat para usar /api/chat",
        detail: 'En tus archivos .jsx, busca la línea que dice: fetch("https://api.anthropic.com/v1/messages". Cámbiala por: fetch("/api/chat". Eso hace que el chat use tu función segura en vez de llamar directamente a Anthropic.',
        tip: "Este es el único cambio que necesitas hacer en el código. Solo esa URL cambia."
      },
      {
        t: "Vercel redespliega automáticamente",
        detail: "Cada vez que guardas cambios en GitHub, Vercel actualiza tu app automáticamente en 1-2 minutos. No tienes que hacer nada más. Abre tu URL de Vercel y prueba que el chat siga funcionando.",
        tip: "Si algo no funciona, en Vercel puedes ver los logs de error en la sección 'Functions' de tu proyecto."
      }
    ]
  },
  {
    id: 5,
    icon: "📱",
    title: "Conectar WhatsApp Business API",
    subtitle: "Para que NOVA responda en el WhatsApp real de tus clientes",
    tiempo: "1-2 días (requiere verificación)",
    costo: "$25.000 – $60.000 COP/mes por cliente",
    costoColor: "#f59e0b",
    tasks: [
      {
        t: "Opción recomendada para empezar: Twilio",
        detail: "Twilio es el servicio más fácil para conectar WhatsApp. Tiene sandbox gratis para pruebas. Para producción cuesta ~$0,005 USD por mensaje enviado (~$2 pesos COP). Con 500 mensajes al mes por cliente, son ~$1.000 COP. Casi nada.",
        url: "https://www.twilio.com/try-twilio",
        urlLabel: "Crear cuenta Twilio →",
        tip: "Con la cuenta de Twilio puedes hacer pruebas gratis con el Sandbox de WhatsApp antes de pagar."
      },
      {
        t: "Solicitar acceso a WhatsApp Business API",
        detail: 'Dentro de Twilio, busca "Messaging" → "Try it out" → "Send a WhatsApp message". Sigue las instrucciones del Sandbox. Para producción real, necesitas solicitar aprobación a Meta (Facebook). El proceso tarda 1-3 días hábiles.',
        tip: "Para tus primeros clientes puedes usar el modo Sandbox (pruebas) que activa en minutos. El cliente escanea un QR y listo."
      },
      {
        t: "Alternativa económica: 360dialog",
        detail: "360dialog ofrece conexión oficial a WhatsApp Business API desde $5 USD/mes (~$21.000 COP) por número. Es más económico que Twilio a escala. Ideal cuando tengas 5+ clientes.",
        url: "https://www.360dialog.com",
        urlLabel: "Ver 360dialog →",
        tip: "Cuando tengas más de 5 clientes, compara precios entre Twilio y 360dialog. Con volumen, 360dialog suele ser más barato."
      }
    ]
  },
  {
    id: 6,
    icon: "💳",
    title: "Cobrarle a tus clientes en Colombia",
    subtitle: "Cómo recibir los pagos de tus suscripciones",
    tiempo: "30 minutos",
    costo: "3-4% de comisión por transacción",
    costoColor: "#f59e0b",
    tasks: [
      {
        t: "Para empezar HOY: cobra manual por Nequi o Daviplata",
        detail: "No necesitas pasarela de pagos para arrancar. Los primeros 5-10 clientes puedes cobrarlos manualmente: les mandas tu número de Nequi o Daviplata, ellos te transfieren y tú activas el bot. Simple, rápido, sin comisiones.",
        tip: "El 80% de los emprendedores digitales en Colombia arrancan así. Cuando llegues a 15+ clientes, ahí sí automatizas el cobro."
      },
      {
        t: "Cuando crezcas: ePayco (mejor opción Colombia)",
        detail: "ePayco acepta todas las tarjetas colombianas, PSE, Nequi y Daviplata. La comisión es 3.49% + $900 COP por transacción. Para cobrar $790.000 COP te descuentan ~$28.000 COP. Puedes agregarlo a tu página web para que los clientes paguen solos.",
        url: "https://epayco.co",
        urlLabel: "Ver ePayco →",
        tip: "ePayco es el estándar en Colombia para cobros online. Bancolombia, Falabella y miles de ecommerce lo usan."
      },
      {
        t: "Opción internacional: Stripe",
        detail: "Si quieres cobrarle a clientes fuera de Colombia o en dólares, Stripe es la mejor opción. Necesitas cuenta bancaria en USD o usar una fintech como Bancolombia en Dólares o Nequi USD.",
        url: "https://stripe.com",
        urlLabel: "Ver Stripe →",
        tip: "Para empezar en Colombia, quédate con Nequi manual y ePayco. Stripe es para cuando quieras expandirte."
      }
    ]
  },
  {
    id: 7,
    icon: "🚀",
    title: "Conseguir tu primer cliente",
    subtitle: "El paso más importante de todos",
    tiempo: "Esta semana",
    costo: "GRATIS — solo tu tiempo",
    costoColor: "#22c55e",
    tasks: [
      {
        t: "Haz una lista de 20 negocios locales hoy",
        detail: "Abre Instagram o Google Maps y busca en tu ciudad: restaurantes, boutiques, salones de belleza, tiendas de ropa, servicios. Necesitas negocios que tengan redes sociales activas pero que claramente no responden rápido los mensajes. Anota el nombre y cómo contactarlos.",
        tip: "El mejor prospecto es un negocio con muchos seguidores, buenas fotos, pero que tarda horas en responder o tiene muchos mensajes sin responder en sus comentarios."
      },
      {
        t: "Envía el mensaje de prospección a 10 negocios mañana",
        detail: 'Usa este mensaje (cópialo y personalízalo):\n\n"Hola [Nombre]! 👋 Vi tu negocio en Instagram y me di cuenta que probablemente estás perdiendo ventas porque no puedes responder todos los mensajes a tiempo.\n\nCreamos NOVA, un asesor de ventas con IA que responde por tu negocio 24/7 en WhatsApp e Instagram, con la labia de tu mejor vendedor.\n\nNegocios en [tu ciudad] han aumentado ventas hasta 43% en el primer mes.\n\n¿Te hago una demo gratis de 10 min esta semana? 🚀"',
        tip: "No envíes a todos a la vez. Envía a 10 hoy, otros 10 mañana. Así puedes hacer seguimiento ordenado."
      },
      {
        t: "Cuando respondan: muéstrales la demo",
        detail: "Cuando un negocio responda con interés, pídele 10 minutos por videollamada o en persona. Abre la demo que tienes aquí (botventas-colombia) con el tipo de negocio de ellos. Deja que el dueño le escriba al bot y lo vea responder en tiempo real. Eso cierra el 70% de las demos.",
        tip: "La demo EN VIVO es tu mejor argumento de venta. Ver a NOVA responder como el mejor vendedor de su tipo de negocio impresiona siempre."
      },
      {
        t: "Cierra la venta y cobra",
        detail: 'Cuando el cliente diga que sí:\n1. Cobra el primer mes por Nequi/Daviplata\n2. Pídele: nombre del negocio, productos con precios, promociones, tono deseado, redes sociales\n3. Abre el panel de admin (novabot-admin), crea el cliente, configura el bot con sus datos\n4. En 2 horas tienes el bot listo\n5. Le mandas la URL de su bot personalizado\n\n¡Ya eres un negocio de bots de IA en Colombia!',
        tip: "Tu primer cliente no necesita WhatsApp API ni nada complicado. Con la URL de Vercel ya puede probar el bot. El WhatsApp real lo integras después cuando tenga todo claro.",
        highlight: true
      }
    ]
  }
];

const COSTOS = [
  { item: "API Anthropic (5 clientes)", cop: "~$60.000", periodo: "mes", tipo: "obligatorio", color: "#ef4444" },
  { item: "Hosting Vercel", cop: "$0", periodo: "mes", tipo: "gratis", color: "#22c55e" },
  { item: "Dominio .co (opcional)", cop: "$35.000", periodo: "año", tipo: "opcional", color: "#f59e0b" },
  { item: "WhatsApp API Twilio", cop: "$25.000–$60.000", periodo: "mes/cliente", tipo: "cuando tengas clientes", color: "#f59e0b" },
  { item: "Pasarela de pagos ePayco", cop: "3.49% + $900", periodo: "por transacción", tipo: "cuando escales", color: "#f59e0b" },
  { item: "GitHub", cop: "$0", periodo: "siempre", tipo: "gratis", color: "#22c55e" },
];

export default function GuiaCompleta() {
  const [step, setStep] = useState(0);
  const [completedTasks, setCompletedTasks] = useState({});
  const [completedSteps, setCompletedSteps] = useState({});
  const [view, setView] = useState("guia"); // guia | costos | resumen

  const currentStep = STEPS[step];
  const totalTasks = currentStep.tasks.length;
  const doneTasks = currentStep.tasks.filter((_, i) => completedTasks[`${step}-${i}`]).length;
  const progress = Math.round((doneTasks / totalTasks) * 100);

  const toggleTask = (stepIdx, taskIdx) => {
    const key = `${stepIdx}-${taskIdx}`;
    setCompletedTasks(prev => ({ ...prev, [key]: !prev[key] }));
  };

  const markStepDone = () => {
    setCompletedSteps(prev => ({ ...prev, [step]: true }));
    if (step < STEPS.length - 1) setStep(step + 1);
  };

  const totalCompleted = Object.values(completedSteps).filter(Boolean).length;

  return (
    <div style={{ minHeight: "100vh", background: "#06060e", color: "#fff", fontFamily: "'Outfit', sans-serif" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Outfit:wght@300;400;500;600;700;800;900&display=swap');
        * { box-sizing: border-box; margin: 0; padding: 0; }
        ::-webkit-scrollbar { width: 4px; } ::-webkit-scrollbar-track { background: #0a0a14; } ::-webkit-scrollbar-thumb { background: #f59e0b44; border-radius: 2px; }
        @keyframes fadeUp { from { opacity: 0; transform: translateY(12px); } to { opacity: 1; transform: translateY(0); } }
        @keyframes pulse { 0%,100% { opacity: 1; } 50% { opacity: 0.4; } }
        @keyframes checkPop { 0% { transform: scale(0); } 70% { transform: scale(1.2); } 100% { transform: scale(1); } }
        pre { white-space: pre-wrap; word-break: break-all; }
      `}</style>

      {/* HEADER */}
      <div style={{ background: "#08080f", borderBottom: "1px solid #1a1a2a", padding: "14px 24px", display: "flex", alignItems: "center", gap: 14 }}>
        <div style={{ width: 36, height: 36, borderRadius: 10, background: "linear-gradient(135deg,#f59e0b,#d97706)", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 900, fontSize: 18 }}>N</div>
        <div>
          <div style={{ fontWeight: 900, fontSize: 16 }}>NOVABot — Guía de Lanzamiento</div>
          <div style={{ color: "#555", fontSize: 12 }}>De cero a negocio real en Colombia</div>
        </div>
        <div style={{ marginLeft: "auto", display: "flex", gap: 8 }}>
          {["guia", "costos", "resumen"].map(v => (
            <button key={v} onClick={() => setView(v)} style={{ background: view === v ? "#f59e0b18" : "transparent", border: `1px solid ${view === v ? "#f59e0b44" : "#1a1a2a"}`, color: view === v ? "#f59e0b" : "#555", borderRadius: 10, padding: "7px 16px", cursor: "pointer", fontSize: 12, fontWeight: 700, fontFamily: "'Outfit',sans-serif" }}>
              {v === "guia" ? "📋 Guía paso a paso" : v === "costos" ? "💰 Costos reales" : "✅ Mi progreso"}
            </button>
          ))}
        </div>
      </div>

      {/* PROGRESO GLOBAL */}
      <div style={{ background: "#08080f", borderBottom: "1px solid #1a1a2a", padding: "10px 24px", display: "flex", alignItems: "center", gap: 16 }}>
        <div style={{ flex: 1, height: 6, background: "#1a1a2a", borderRadius: 3, overflow: "hidden" }}>
          <div style={{ height: "100%", width: `${(totalCompleted / STEPS.length) * 100}%`, background: "linear-gradient(90deg,#f59e0b,#22c55e)", borderRadius: 3, transition: "width .5s ease" }} />
        </div>
        <div style={{ color: "#f59e0b", fontWeight: 800, fontSize: 13, flexShrink: 0 }}>{totalCompleted}/{STEPS.length} pasos completados</div>
      </div>

      <div style={{ display: "flex", maxWidth: 1100, margin: "0 auto", padding: 24, gap: 20 }}>

        {/* ── GUÍA ── */}
        {view === "guia" && <>
          {/* Sidebar pasos */}
          <div style={{ width: 240, flexShrink: 0 }}>
            <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
              {STEPS.map((s, i) => (
                <button key={s.id} onClick={() => setStep(i)} style={{ background: step === i ? "#f59e0b12" : "transparent", border: `1px solid ${step === i ? "#f59e0b44" : completedSteps[i] ? "#22c55e33" : "#1a1a2a"}`, borderRadius: 12, padding: "12px 14px", cursor: "pointer", display: "flex", alignItems: "center", gap: 10, textAlign: "left", transition: "all .2s" }}>
                  <div style={{ width: 32, height: 32, borderRadius: "50%", background: completedSteps[i] ? "#22c55e22" : step === i ? "#f59e0b22" : "#1a1a2a", border: `1px solid ${completedSteps[i] ? "#22c55e55" : step === i ? "#f59e0b55" : "#2a2a3a"}`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: completedSteps[i] ? 14 : 16, flexShrink: 0 }}>
                    {completedSteps[i] ? "✓" : s.icon}
                  </div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ color: step === i ? "#f59e0b" : completedSteps[i] ? "#22c55e" : "#666", fontWeight: step === i ? 700 : 500, fontSize: 12, lineHeight: 1.3, fontFamily: "'Outfit',sans-serif" }}>{s.title.split("(")[0]}</div>
                    <div style={{ color: "#333", fontSize: 10, marginTop: 2 }}>{s.tiempo}</div>
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Contenido paso actual */}
          <div style={{ flex: 1, minWidth: 0, animation: "fadeUp .3s ease" }}>
            {/* Header del paso */}
            <div style={{ background: "#0d0d18", border: "1px solid #1a1a2a", borderRadius: 20, padding: 24, marginBottom: 16 }}>
              <div style={{ display: "flex", alignItems: "flex-start", gap: 16, marginBottom: 16 }}>
                <div style={{ width: 56, height: 56, borderRadius: 16, background: "#f59e0b18", border: "1px solid #f59e0b33", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 28, flexShrink: 0 }}>{currentStep.icon}</div>
                <div style={{ flex: 1 }}>
                  <div style={{ color: "#f59e0b", fontSize: 10, fontWeight: 700, letterSpacing: 2, textTransform: "uppercase", marginBottom: 4 }}>Paso {step + 1} de {STEPS.length}</div>
                  <div style={{ fontWeight: 900, fontSize: 22, letterSpacing: -0.5, lineHeight: 1.2 }}>{currentStep.title}</div>
                  <div style={{ color: "#555", fontSize: 13, marginTop: 4 }}>{currentStep.subtitle}</div>
                </div>
                <div style={{ display: "flex", flex: "column", gap: 8, flexShrink: 0, textAlign: "right" }}>
                  <div style={{ background: "#1a1a2a", borderRadius: 10, padding: "6px 14px", fontSize: 12 }}>
                    <span style={{ color: "#555" }}>⏱ </span><span style={{ color: "#aaa", fontWeight: 600 }}>{currentStep.tiempo}</span>
                  </div>
                  <div style={{ background: `${currentStep.costoColor}18`, border: `1px solid ${currentStep.costoColor}33`, borderRadius: 10, padding: "6px 14px", fontSize: 12, marginTop: 6 }}>
                    <span style={{ color: currentStep.costoColor, fontWeight: 700 }}>💰 {currentStep.costo}</span>
                  </div>
                </div>
              </div>

              {/* Barra de progreso del paso */}
              <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                <div style={{ flex: 1, height: 6, background: "#1a1a2a", borderRadius: 3, overflow: "hidden" }}>
                  <div style={{ height: "100%", width: `${progress}%`, background: progress === 100 ? "linear-gradient(90deg,#22c55e,#16a34a)" : "linear-gradient(90deg,#f59e0b,#d97706)", borderRadius: 3, transition: "width .4s ease" }} />
                </div>
                <div style={{ color: progress === 100 ? "#22c55e" : "#f59e0b", fontWeight: 700, fontSize: 12, flexShrink: 0 }}>{doneTasks}/{totalTasks} tareas</div>
              </div>
            </div>

            {/* Tareas */}
            <div style={{ display: "flex", flexDirection: "column", gap: 12, marginBottom: 16 }}>
              {currentStep.tasks.map((task, i) => {
                const key = `${step}-${i}`;
                const done = completedTasks[key];
                return (
                  <div key={i} style={{ background: done ? "#22c55e08" : "#0d0d18", border: `1px solid ${done ? "#22c55e33" : task.highlight ? "#f59e0b33" : "#1a1a2a"}`, borderRadius: 16, overflow: "hidden", transition: "all .3s" }}>
                    <div style={{ padding: "16px 18px", display: "flex", gap: 14, alignItems: "flex-start" }}>
                      {/* Checkbox */}
                      <button onClick={() => toggleTask(step, i)} style={{ width: 26, height: 26, borderRadius: "50%", background: done ? "#22c55e" : "#1a1a2a", border: `2px solid ${done ? "#22c55e" : "#2a2a3a"}`, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 13, flexShrink: 0, marginTop: 2, transition: "all .2s", animation: done ? "checkPop .3s ease" : "none" }}>
                        {done ? "✓" : ""}
                      </button>

                      <div style={{ flex: 1 }}>
                        <div style={{ fontWeight: 800, fontSize: 14, marginBottom: 6, color: done ? "#888" : "#fff", textDecoration: done ? "line-through" : "none", fontFamily: "'Outfit',sans-serif" }}>
                          {task.highlight && !done && <span style={{ color: "#f59e0b" }}>⚠️ </span>}
                          {task.t}
                        </div>
                        <div style={{ color: "#666", fontSize: 13, lineHeight: 1.7 }}>{task.detail}</div>

                        {task.url && (
                          <a href={task.url} target="_blank" rel="noreferrer" style={{ display: "inline-flex", alignItems: "center", gap: 6, background: "#f59e0b18", border: "1px solid #f59e0b44", color: "#f59e0b", borderRadius: 10, padding: "8px 16px", fontSize: 12, fontWeight: 700, textDecoration: "none", marginTop: 10, fontFamily: "'Outfit',sans-serif", transition: "all .2s" }}>
                            🔗 {task.urlLabel}
                          </a>
                        )}

                        {task.code && (
                          <div style={{ background: "#060610", border: "1px solid #1a1a2a", borderRadius: 10, padding: 14, marginTop: 12, position: "relative" }}>
                            <div style={{ color: "#f59e0b", fontSize: 9, fontWeight: 700, letterSpacing: 2, marginBottom: 8 }}>CÓDIGO — COPIA TODO ESTO</div>
                            <pre style={{ color: "#88dd88", fontSize: 11, lineHeight: 1.7, fontFamily: "monospace" }}>{task.code}</pre>
                            <button onClick={() => navigator.clipboard.writeText(task.code)} style={{ position: "absolute", top: 10, right: 10, background: "#f59e0b22", border: "1px solid #f59e0b44", color: "#f59e0b", borderRadius: 8, padding: "4px 10px", cursor: "pointer", fontSize: 10, fontWeight: 700, fontFamily: "'Outfit',sans-serif" }}>
                              Copiar
                            </button>
                          </div>
                        )}

                        <div style={{ background: task.highlight ? "#f59e0b0d" : "#0a0a14", border: `1px solid ${task.highlight ? "#f59e0b22" : "#1a1a2a"}`, borderRadius: 10, padding: "10px 14px", marginTop: 10, fontSize: 12, color: "#888", lineHeight: 1.6 }}>
                          💡 {task.tip}
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Botones navegación */}
            <div style={{ display: "flex", gap: 10 }}>
              <button onClick={() => setStep(Math.max(0, step - 1))} disabled={step === 0} style={{ background: "transparent", border: "1px solid #1a1a2a", color: step === 0 ? "#333" : "#888", borderRadius: 14, padding: "13px 24px", cursor: step === 0 ? "default" : "pointer", fontSize: 14, fontWeight: 700, fontFamily: "'Outfit',sans-serif" }}>← Anterior</button>
              <button onClick={markStepDone} style={{ flex: 1, background: progress === 100 ? "linear-gradient(135deg,#22c55e,#16a34a)" : "linear-gradient(135deg,#f59e0b,#d97706)", border: "none", color: "#000", borderRadius: 14, padding: "13px", cursor: "pointer", fontSize: 14, fontWeight: 900, fontFamily: "'Outfit',sans-serif" }}>
                {progress === 100 ? "✅ Marcar como completado y seguir →" : step === STEPS.length - 1 ? "🎉 ¡Terminar guía!" : "Marcar completado y continuar →"}
              </button>
            </div>
          </div>
        </>}

        {/* ── COSTOS ── */}
        {view === "costos" && (
          <div style={{ flex: 1, animation: "fadeUp .3s ease" }}>
            <h2 style={{ fontSize: 26, fontWeight: 900, marginBottom: 6 }}>💰 Costos reales del negocio</h2>
            <p style={{ color: "#555", fontSize: 14, marginBottom: 24 }}>Todo en pesos colombianos. Sin sorpresas.</p>

            <div style={{ display: "flex", flexDirection: "column", gap: 10, marginBottom: 28 }}>
              {COSTOS.map(c => (
                <div key={c.item} style={{ background: "#0d0d18", border: "1px solid #1a1a2a", borderRadius: 14, padding: "16px 20px", display: "flex", alignItems: "center", gap: 14 }}>
                  <div style={{ width: 10, height: 10, borderRadius: "50%", background: c.color, flexShrink: 0 }} />
                  <div style={{ flex: 1 }}>
                    <div style={{ fontWeight: 700, fontSize: 14 }}>{c.item}</div>
                    <div style={{ color: "#444", fontSize: 11, marginTop: 2 }}>por {c.periodo}</div>
                  </div>
                  <div style={{ textAlign: "right" }}>
                    <div style={{ color: c.color, fontWeight: 900, fontSize: 18 }}>{c.cop}</div>
                    <div style={{ background: `${c.color}18`, border: `1px solid ${c.color}33`, borderRadius: 20, padding: "2px 10px", fontSize: 10, color: c.color, fontWeight: 700, marginTop: 4, display: "inline-block" }}>{c.tipo}</div>
                  </div>
                </div>
              ))}
            </div>

            <h3 style={{ fontSize: 20, fontWeight: 900, marginBottom: 16 }}>📊 Proyección de ingresos reales</h3>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 14, marginBottom: 24 }}>
              {[
                { clientes: 3, plan: "Básico", precio: 390000 },
                { clientes: 5, plan: "Pro", precio: 790000 },
                { clientes: 10, plan: "Pro", precio: 790000 },
              ].map(e => {
                const ingreso = e.clientes * e.precio;
                const costoApi = e.clientes * 15000;
                const ganancia = ingreso - costoApi;
                return (
                  <div key={e.clientes} style={{ background: "#0d0d18", border: "1px solid #f59e0b22", borderRadius: 16, padding: 20 }}>
                    <div style={{ color: "#f59e0b", fontSize: 11, fontWeight: 700, textTransform: "uppercase", letterSpacing: 2, marginBottom: 10 }}>{e.clientes} clientes {e.plan}</div>
                    <div style={{ color: "#fff", fontWeight: 900, fontSize: 24, letterSpacing: -0.5 }}>${(ingreso).toLocaleString("es-CO")}</div>
                    <div style={{ color: "#555", fontSize: 11, marginBottom: 12 }}>ingresos brutos/mes</div>
                    <div style={{ background: "#0a0a14", borderRadius: 8, padding: "8px 12px", display: "flex", justifyContent: "space-between", fontSize: 12, marginBottom: 4 }}>
                      <span style={{ color: "#444" }}>Costo API:</span>
                      <span style={{ color: "#ef4444" }}>-${costoApi.toLocaleString("es-CO")}</span>
                    </div>
                    <div style={{ background: "#0a0a14", borderRadius: 8, padding: "8px 12px", display: "flex", justifyContent: "space-between", fontSize: 13 }}>
                      <span style={{ color: "#444" }}>Ganancia neta:</span>
                      <span style={{ color: "#22c55e", fontWeight: 800 }}>${ganancia.toLocaleString("es-CO")}</span>
                    </div>
                  </div>
                );
              })}
            </div>

            <div style={{ background: "linear-gradient(135deg,#f59e0b0d,#22c55e0d)", border: "1px solid #f59e0b22", borderRadius: 16, padding: 22 }}>
              <div style={{ fontWeight: 900, fontSize: 16, marginBottom: 10 }}>🎯 Resumen ejecutivo</div>
              <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                {[
                  "Inversión inicial total para lanzar: $21.000 COP ($5 USD en API Anthropic)",
                  "Primer cliente necesario para ser rentable: 1 (pagas la API con el 5% del primer ingreso)",
                  "Tiempo estimado para conseguir el primer cliente: 3–7 días con prospectar activo",
                  "Margen neto con 5 clientes Pro: ~97% (casi todo es ganancia)",
                  "No necesitas oficina, empleados ni inventario. Solo tu tiempo y esta herramienta.",
                ].map((t, i) => (
                  <div key={i} style={{ display: "flex", gap: 10, alignItems: "flex-start", fontSize: 13, color: "#888" }}>
                    <span style={{ color: "#22c55e", flexShrink: 0, fontWeight: 900 }}>✓</span>
                    <span>{t}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* ── RESUMEN / PROGRESO ── */}
        {view === "resumen" && (
          <div style={{ flex: 1, animation: "fadeUp .3s ease" }}>
            <h2 style={{ fontSize: 26, fontWeight: 900, marginBottom: 6 }}>✅ Tu progreso</h2>
            <p style={{ color: "#555", fontSize: 14, marginBottom: 24 }}>Marca cada paso a medida que lo completes</p>

            <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
              {STEPS.map((s, i) => {
                const done = completedSteps[i];
                const tasksDone = s.tasks.filter((_, ti) => completedTasks[`${i}-${ti}`]).length;
                return (
                  <div key={i} style={{ background: done ? "#22c55e08" : "#0d0d18", border: `1px solid ${done ? "#22c55e33" : "#1a1a2a"}`, borderRadius: 16, padding: "16px 20px", display: "flex", gap: 14, alignItems: "center", cursor: "pointer", transition: "all .2s" }}
                    onClick={() => { setStep(i); setView("guia"); }}>
                    <div style={{ width: 44, height: 44, borderRadius: "50%", background: done ? "#22c55e22" : "#1a1a2a", border: `2px solid ${done ? "#22c55e55" : "#2a2a3a"}`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: done ? 18 : 22, flexShrink: 0 }}>
                      {done ? "✓" : s.icon}
                    </div>
                    <div style={{ flex: 1 }}>
                      <div style={{ fontWeight: 800, fontSize: 14, color: done ? "#888" : "#fff", fontFamily: "'Outfit',sans-serif" }}>{s.title}</div>
                      <div style={{ color: "#444", fontSize: 11, marginTop: 2 }}>{s.tiempo} · {s.costo}</div>
                      <div style={{ marginTop: 6, height: 4, background: "#1a1a2a", borderRadius: 2, overflow: "hidden", maxWidth: 200 }}>
                        <div style={{ height: "100%", width: `${(tasksDone / s.tasks.length) * 100}%`, background: done ? "#22c55e" : "#f59e0b", borderRadius: 2, transition: "width .4s" }} />
                      </div>
                    </div>
                    <div style={{ color: done ? "#22c55e" : "#333", fontWeight: 700, fontSize: 13 }}>{tasksDone}/{s.tasks.length}</div>
                    <div style={{ color: "#333", fontSize: 16 }}>›</div>
                  </div>
                );
              })}
            </div>

            {totalCompleted === STEPS.length && (
              <div style={{ marginTop: 20, background: "linear-gradient(135deg,#22c55e18,#16a34a18)", border: "1px solid #22c55e44", borderRadius: 20, padding: 28, textAlign: "center" }}>
                <div style={{ fontSize: 48, marginBottom: 12 }}>🎉</div>
                <div style={{ fontWeight: 900, fontSize: 22, marginBottom: 8 }}>¡NOVABot está listo para generar ingresos!</div>
                <div style={{ color: "#888", fontSize: 14 }}>Completaste todos los pasos. Tu negocio de bots de IA en Colombia está operando.</div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
