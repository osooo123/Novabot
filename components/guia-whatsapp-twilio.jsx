import { useState } from "react";

const COP = n => `$${new Intl.NumberFormat("es-CO").format(n)}`;

const STEPS = [
  {
    id: 1, icon: "📱", color: "#25D366",
    title: "Qué necesitas antes de empezar",
    subtitle: "Prepara todo esto con tu cliente",
    tiempo: "1 día antes",
    costo: "Gratis",
    tipo: "prep",
    sections: [
      {
        title: "Lo que TÚ necesitas tener listo",
        items: [
          { icon: "✅", text: "Tu cuenta de Twilio creada (la creas en el paso 2)" },
          { icon: "✅", text: "La app de NOVAModa publicada en Vercel con tu API Key de Anthropic" },
          { icon: "✅", text: "El catálogo del cliente configurado en el panel admin" },
        ]
      },
      {
        title: "Lo que el CLIENTE necesita tener",
        items: [
          { icon: "📱", text: "Un número de WhatsApp Business dedicado al negocio — NO el número personal del dueño. Si no tiene, debe comprar una SIM nueva o usar un número secundario." },
          { icon: "📲", text: "Ese número registrado como WhatsApp Business (gratis, se descarga la app WhatsApp Business en ese celular)" },
          { icon: "🔓", text: "Acceso a ese número para recibir un código de verificación que llegará por SMS o llamada" },
        ]
      },
      {
        title: "⚠️ Puntos críticos que debes explicarle al cliente",
        color: "#f59e0b",
        items: [
          { icon: "⚠️", text: "El número que conectes a NOVA NO puede usarse manualmente al mismo tiempo. Cuando NOVA está activa, ella responde todos los mensajes." },
          { icon: "⚠️", text: "Si el cliente quiere responder él mismo a veces, debe pausar el bot primero desde tu panel." },
          { icon: "⚠️", text: "El número debe tener WhatsApp Business instalado, no WhatsApp normal." },
        ]
      }
    ]
  },
  {
    id: 2, icon: "🔧", color: "#f59e0b",
    title: "Crear cuenta en Twilio",
    subtitle: "La plataforma que conecta NOVA con WhatsApp",
    tiempo: "20 minutos",
    costo: "Gratis para empezar",
    tipo: "tecnico",
    url: "https://www.twilio.com/try-twilio",
    urlLabel: "Crear cuenta Twilio →",
    sections: [
      {
        title: "Paso a paso en Twilio",
        items: [
          { icon: "1️⃣", text: "Ve a twilio.com/try-twilio. Ingresa tu nombre, correo y crea una contraseña." },
          { icon: "2️⃣", text: "Te pide verificar tu número de celular — ingresa tu número colombiano y recibe el código." },
          { icon: "3️⃣", text: "Te pregunta para qué vas a usar Twilio. Selecciona: 'WhatsApp' y 'Build something for my company'." },
          { icon: "4️⃣", text: "Llegas al Dashboard principal. Aquí verás tu ACCOUNT SID y AUTH TOKEN — guárdalos en un bloc de notas, los necesitas después." },
          { icon: "5️⃣", text: "Recarga $15 USD (~$63.000 COP) en Billing → Add Money. Esto cubre aproximadamente 3.000 mensajes." },
        ]
      },
      {
        title: "Dónde encontrar tus credenciales",
        color: "#f59e0b",
        items: [
          { icon: "🔑", text: "ACCOUNT SID: empieza con 'AC...' — es como tu usuario de Twilio" },
          { icon: "🔑", text: "AUTH TOKEN: una cadena larga de letras y números — es tu contraseña de Twilio" },
          { icon: "📋", text: "Los encuentras en: Console Dashboard → la primera pantalla que ves al entrar" },
        ]
      }
    ],
    code: {
      title: "Guarda estas credenciales así:",
      content: `TWILIO_ACCOUNT_SID=ACxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
TWILIO_AUTH_TOKEN=xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
TWILIO_WHATSAPP_NUMBER=whatsapp:+14155238886`
    }
  },
  {
    id: 3, icon: "💬", color: "#25D366",
    title: "Activar WhatsApp Sandbox en Twilio",
    subtitle: "Para hacer pruebas antes de ir a producción",
    tiempo: "15 minutos",
    costo: "Gratis",
    tipo: "tecnico",
    sections: [
      {
        title: "Qué es el Sandbox",
        items: [
          { icon: "📌", text: "El Sandbox es un número de WhatsApp de prueba que Twilio te da gratis. Es el +1 (415) 523-8886." },
          { icon: "📌", text: "Sirve para probar que todo funciona ANTES de conectar el número real del cliente." },
          { icon: "📌", text: "El cliente (o tú) debe enviar un mensaje de activación una sola vez para habilitarse." },
        ]
      },
      {
        title: "Cómo activar el Sandbox",
        items: [
          { icon: "1️⃣", text: "En Twilio Console: ve a Messaging → Try it out → Send a WhatsApp message" },
          { icon: "2️⃣", text: "Verás el número +1 (415) 523-8886 y un código de activación como 'join silver-tiger'" },
          { icon: "3️⃣", text: "Desde tu celular (o el del cliente), guarda ese número en contactos como 'Twilio Sandbox'" },
          { icon: "4️⃣", text: "Envía el mensaje de activación exactamente como aparece: 'join silver-tiger' (el tuyo será diferente)" },
          { icon: "5️⃣", text: "Twilio responde confirmando que estás en el Sandbox. ¡Ya puedes probar!" },
        ]
      },
      {
        title: "Limitaciones del Sandbox (importantes)",
        color: "#ef4444",
        items: [
          { icon: "⚠️", text: "El Sandbox expira cada 72 horas — el cliente debe reactivarse enviando el código de nuevo." },
          { icon: "⚠️", text: "Solo funciona con números que hayan enviado el código de activación." },
          { icon: "⚠️", text: "Por eso el Sandbox es SOLO para pruebas. Para el cliente real necesitas el paso 5." },
        ]
      }
    ]
  },
  {
    id: 4, icon: "💻", color: "#3b82f6",
    title: "Crear el webhook (el puente entre WhatsApp y NOVA)",
    subtitle: "El código que conecta los mensajes de WhatsApp con la IA",
    tiempo: "30 minutos",
    costo: "Gratis (va en tu Vercel)",
    tipo: "tecnico",
    sections: [
      {
        title: "Qué es un webhook y para qué sirve",
        items: [
          { icon: "📌", text: "Un webhook es una URL especial en tu app. Cuando alguien le escribe al WhatsApp del cliente, Twilio envía ese mensaje a tu webhook." },
          { icon: "📌", text: "Tu webhook toma el mensaje, se lo manda a NOVA (Anthropic), recibe la respuesta y la envía de vuelta por WhatsApp." },
          { icon: "📌", text: "Es el intermediario invisible que hace que todo funcione en menos de 3 segundos." },
        ]
      },
      {
        title: "Cómo crear el webhook en Vercel",
        items: [
          { icon: "1️⃣", text: "En tu proyecto de GitHub, crea un archivo nuevo: api/whatsapp.js" },
          { icon: "2️⃣", text: "Copia el código de abajo completo en ese archivo" },
          { icon: "3️⃣", text: "En Vercel → Settings → Environment Variables agrega las 3 variables de Twilio que guardaste" },
          { icon: "4️⃣", text: "Guarda el archivo en GitHub → Vercel hace el deploy automático en 2 minutos" },
          { icon: "5️⃣", text: "Tu URL del webhook queda: https://tuapp.vercel.app/api/whatsapp" },
        ]
      }
    ],
    code: {
      title: "Copia este código completo en api/whatsapp.js",
      content: `// api/whatsapp.js — Webhook para WhatsApp + NOVA
const twilio = require('twilio');

// Historial de conversaciones por número
const conversaciones = {};

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).send('Method not allowed');
  }

  // Datos del mensaje entrante de WhatsApp
  const mensajeCliente = req.body.Body || '';
  const numeroCliente = req.body.From || '';
  const numeroNegocio = req.body.To || '';

  // Obtener o crear historial de esta conversación
  if (!conversaciones[numeroCliente]) {
    conversaciones[numeroCliente] = [];
  }
  
  const historial = conversaciones[numeroCliente];
  historial.push({ role: 'user', content: mensajeCliente });

  // Mantener solo los últimos 20 mensajes para no sobrecargar
  if (historial.length > 20) historial.splice(0, historial.length - 20);

  try {
    // Llamar a NOVA (Anthropic)
    const respuestaIA = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': process.env.ANTHROPIC_API_KEY,
        'anthropic-version': '2023-06-01'
      },
      body: JSON.stringify({
        model: 'claude-sonnet-4-20250514',
        max_tokens: 1000,
        system: obtenerPromptCliente(numeroNegocio),
        messages: historial
      })
    });

    const datos = await respuestaIA.json();
    const respuestaNova = datos.content?.[0]?.text || 
      'Disculpa, hubo un error. Por favor escríbenos de nuevo.';

    // Guardar respuesta en historial
    historial.push({ role: 'assistant', content: respuestaNova });

    // Enviar respuesta por WhatsApp con Twilio
    const clienteTwilio = twilio(
      process.env.TWILIO_ACCOUNT_SID,
      process.env.TWILIO_AUTH_TOKEN
    );

    await clienteTwilio.messages.create({
      from: numeroNegocio,
      to: numeroCliente,
      body: respuestaNova
    });

    res.status(200).send('OK');

  } catch (error) {
    console.error('Error NOVA webhook:', error);
    res.status(500).send('Error interno');
  }
}

// Aquí van los prompts de cada cliente según su número de WhatsApp
function obtenerPromptCliente(numero) {
  const clientes = {
    // Número WhatsApp del negocio : prompt personalizado
    'whatsapp:+573001234567': \`Eres NOVA, asesora de ventas de Luisa Fernanda Boutique en Bogotá.
Productos: Vestido Midi $189.000, Blazer Oversize $245.000, Jeans Mom $145.000.
Promo: 15% OFF primera compra con código NOVA15.
Tono: sofisticado y cálido. Máximo 3 oraciones. Precios en COP.\`,

    'whatsapp:+573109876543': \`Eres NOVA, asesora de ventas de UrbanFlow Store en Medellín.
Productos: Hoodie Premium $165.000, Cargo Pants $185.000, Camiseta Gráfica $75.000.
Promo: 2x1 en camisetas oversize esta semana.
Tono: energético y cool. Máximo 3 oraciones. Precios en COP.\`,
  };

  // Prompt genérico si no encuentra el número
  return clientes[numero] || \`Eres NOVA, asesora de ventas con IA. 
Responde amablemente y pide al cliente que espere mientras conectamos al asesor correcto.\`;
}`
    }
  },
  {
    id: 5, icon: "🔗", color: "#25D366",
    title: "Conectar el webhook con Twilio Sandbox",
    subtitle: "Le dices a Twilio dónde está tu NOVA",
    tiempo: "5 minutos",
    costo: "Gratis",
    tipo: "tecnico",
    sections: [
      {
        title: "Configurar el webhook en Twilio",
        items: [
          { icon: "1️⃣", text: "En Twilio Console ve a: Messaging → Settings → WhatsApp Sandbox Settings" },
          { icon: "2️⃣", text: "En el campo 'WHEN A MESSAGE COMES IN' escribe tu URL: https://tuapp.vercel.app/api/whatsapp" },
          { icon: "3️⃣", text: "Selecciona método: HTTP POST" },
          { icon: "4️⃣", text: "Haz clic en Save" },
          { icon: "5️⃣", text: "¡Listo! Ahora cuando alguien escriba al Sandbox, Twilio llama a tu NOVA." },
        ]
      },
      {
        title: "Probar que funciona",
        items: [
          { icon: "📱", text: "Desde tu celular escríbele al número Sandbox (+1 415 523-8886)" },
          { icon: "✍️", text: "Escribe: 'Hola, ¿qué tienen disponible?'" },
          { icon: "⏱️", text: "En 2-5 segundos NOVA debe responder automáticamente" },
          { icon: "✅", text: "Si responde: ¡todo funciona! Si no responde, revisa los logs en Vercel → Functions" },
        ]
      }
    ]
  },
  {
    id: 6, icon: "🚀", color: "#a855f7",
    title: "Pasar a WhatsApp real del cliente (Producción)",
    subtitle: "Del número de prueba al número real del negocio",
    tiempo: "2-5 días hábiles",
    costo: "$25.000 – $60.000 COP/mes",
    tipo: "produccion",
    sections: [
      {
        title: "Por qué tarda 2-5 días",
        items: [
          { icon: "📌", text: "Meta (dueño de WhatsApp) debe aprobar que ese número se use con API. Es un proceso de verificación oficial." },
          { icon: "📌", text: "No es complicado, pero no es instantáneo. Por eso haces las pruebas primero con el Sandbox." },
        ]
      },
      {
        title: "Opciones para el número real del cliente",
        items: [
          { icon: "A", text: "OPCIÓN MÁS FÁCIL — 360dialog ($5 USD/mes): Ve a 360dialog.com, creas una cuenta, conectas el número del cliente. Ellos manejan la aprobación de Meta. En 24-48h está listo." },
          { icon: "B", text: "OPCIÓN TWILIO ($15 USD/mes): En Twilio Console → Senders → WhatsApp Senders → Request Access. Ingresas el número del cliente y esperas aprobación de Meta." },
          { icon: "C", text: "OPCIÓN META DIRECTA (más económica a escala): Ve a business.whatsapp.com, creas una cuenta de negocio y solicitas la API directamente. Más burocrático pero sin intermediarios." },
        ]
      },
      {
        title: "Lo que necesitas del cliente para el proceso",
        color: "#a855f7",
        items: [
          { icon: "📱", text: "El número de WhatsApp Business del negocio (que no esté siendo usado en otro dispositivo)" },
          { icon: "📋", text: "Nombre oficial del negocio (como aparece en su RUT o registro Cámara de Comercio)" },
          { icon: "🌐", text: "Página web o perfil de Instagram del negocio (para verificar que es un negocio real)" },
          { icon: "📧", text: "Correo electrónico del negocio" },
        ]
      },
      {
        title: "Qué pasa con el número durante el proceso",
        color: "#ef4444",
        items: [
          { icon: "⚠️", text: "El número se desregistra de WhatsApp normal durante la migración — el cliente no puede usarlo por 24-48h." },
          { icon: "⚠️", text: "Programa esto un día entre semana de bajo tráfico para el cliente." },
          { icon: "⚠️", text: "Avísale al cliente con 3 días de anticipación para que no tenga sorpresas." },
        ]
      }
    ]
  },
  {
    id: 7, icon: "⚙️", color: "#f59e0b",
    title: "Administrar múltiples clientes desde un solo Twilio",
    subtitle: "Cómo manejar 10, 20 o 50 tiendas desde tu cuenta",
    tiempo: "Una vez configurado",
    costo: "Sin costo adicional",
    tipo: "admin",
    sections: [
      {
        title: "Cómo funciona con varios clientes",
        items: [
          { icon: "📌", text: "Cada cliente tiene su propio número de WhatsApp conectado a TU cuenta de Twilio." },
          { icon: "📌", text: "Tu webhook recibe todos los mensajes. Identifica de qué número vienen y aplica el prompt correcto." },
          { icon: "📌", text: "Es como tener 50 bots corriendo desde un solo sistema — tú controlas todo desde un lugar." },
        ]
      },
      {
        title: "Cómo agregar un cliente nuevo al sistema",
        items: [
          { icon: "1️⃣", text: "El cliente conecta su número a tu Twilio (siguiendo el paso 6)" },
          { icon: "2️⃣", text: "Abres el archivo api/whatsapp.js en GitHub" },
          { icon: "3️⃣", text: "En la función 'obtenerPromptCliente' agregas el número y el prompt del nuevo cliente (como ves en el código del paso 4)" },
          { icon: "4️⃣", text: "Guardas el archivo → Vercel actualiza automáticamente" },
          { icon: "5️⃣", text: "En 2 minutos el bot del nuevo cliente ya está activo" },
        ]
      },
      {
        title: "Cómo pausar o desactivar un cliente",
        items: [
          { icon: "⏸️", text: "Si un cliente no paga: en el archivo whatsapp.js comenta su número (agrega // al inicio de su línea). El bot deja de responder inmediatamente." },
          { icon: "▶️", text: "Si vuelve a pagar: quitas el // y el bot se reactiva en 2 minutos." },
          { icon: "🗑️", text: "Si cancela definitivamente: eliminas su número del archivo y desconectas su número en Twilio Console." },
        ]
      }
    ],
    code: {
      title: "Así se ve el archivo con múltiples clientes:",
      content: `function obtenerPromptCliente(numero) {
  const clientes = {

    // ✅ ACTIVO — Luisa Fernanda Boutique
    'whatsapp:+573001234567': \`Eres NOVA para Luisa Fernanda Boutique...
    Productos: Vestido $189.000, Blazer $245.000...\`,

    // ✅ ACTIVO — UrbanFlow Store  
    'whatsapp:+573109876543': \`Eres NOVA para UrbanFlow Store...
    Productos: Hoodie $165.000, Cargo $185.000...\`,

    // ⏸️ PAUSADO — no pago (agregar // para pausar)
    // 'whatsapp:+573205551234': \`Eres NOVA para Valeria Moda...\`,

    // ✅ ACTIVO — Nuevo cliente
    'whatsapp:+573001112233': \`Eres NOVA para Glamour Store Cali...
    Productos: Vestido de noche $320.000...\`,

  };

  return clientes[numero] || 'Servicio no disponible.';
}`
    }
  },
  {
    id: 8, icon: "💰", color: "#22c55e",
    title: "Cuánto cobrarle al cliente por WhatsApp real",
    subtitle: "Estructura de precios con WhatsApp incluido",
    tiempo: "Para tener claro antes de vender",
    costo: "Tus costos reales",
    tipo: "negocio",
    sections: [
      {
        title: "Tus costos reales por cliente con WhatsApp",
        items: [
          { icon: "💸", text: "API Anthropic (mensajes IA): ~$8.000 COP/mes" },
          { icon: "💸", text: "Twilio WhatsApp (mensajes enviados): ~$12.000–$25.000 COP/mes según volumen" },
          { icon: "💸", text: "Número en 360dialog o Twilio: ~$21.000 COP/mes" },
          { icon: "💸", text: "Vercel hosting: $0" },
          { icon: "💰", text: "TOTAL tu costo: ~$41.000–$54.000 COP/mes por cliente" },
        ]
      },
      {
        title: "Qué cobrarle tú al cliente",
        color: "#22c55e",
        items: [
          { icon: "🟢", text: "Plan Básico (solo web): $200.000/mes → Tu ganancia: $192.000/cliente" },
          { icon: "🟡", text: "Plan Pro (web + WhatsApp): $290.000/mes → Tu ganancia: ~$240.000/cliente" },
          { icon: "🟣", text: "Plan Premium (web + WhatsApp + Instagram): $420.000/mes → Tu ganancia: ~$350.000/cliente" },
        ]
      },
      {
        title: "Proyección con WhatsApp activo",
        items: [
          { icon: "📊", text: "10 clientes Plan Pro: ingresos $2.900.000 — costos $540.000 — ganancia neta $2.360.000/mes" },
          { icon: "📊", text: "20 clientes Plan Pro: ingresos $5.800.000 — costos $1.080.000 — ganancia neta $4.720.000/mes" },
          { icon: "📊", text: "40 clientes Plan Pro: ingresos $11.600.000 — costos $2.160.000 — ganancia neta $9.440.000/mes" },
        ]
      }
    ]
  },
  {
    id: 9, icon: "📋", color: "#ec4899",
    title: "Proceso completo de activación — paso a paso con el cliente",
    subtitle: "Exactamente qué haces desde que paga hasta que NOVA está viva",
    tiempo: "24-48 horas total",
    costo: "Tu tiempo: ~2 horas",
    tipo: "proceso",
    sections: [
      {
        title: "DÍA 1 — Después de recibir el pago",
        items: [
          { icon: "✅", text: "DÍA 1, hora 1: Confirmas el pago por WhatsApp: 'Recibido! Empezamos la configuración de tu NOVA ahora mismo 🚀'" },
          { icon: "📋", text: "DÍA 1, hora 1: Le pides por WhatsApp: lista de productos+precios, promos activas, tono deseado, redes sociales" },
          { icon: "⚙️", text: "DÍA 1, hora 2: Abres el panel admin → creas el cliente → ingresas toda su información → configuras el prompt" },
          { icon: "🧪", text: "DÍA 1, hora 2: Pruebas el bot 10 veces con preguntas típicas de clientas de moda" },
          { icon: "🌐", text: "DÍA 1, hora 2: Le envías la URL web de su bot: 'Tu NOVA ya está lista! Pruébala aquí: [URL]'" },
        ]
      },
      {
        title: "DÍA 1-2 — Activación de WhatsApp (Plan Pro)",
        items: [
          { icon: "📱", text: "Le explicas: 'Para activar WhatsApp necesito que me compartas el número que usarás para el negocio (no el personal)'" },
          { icon: "🔗", text: "Entras a 360dialog.com → Connect Number → ingresas el número del cliente → sigues el proceso de verificación" },
          { icon: "📲", text: "El cliente recibe un código por SMS en ese número — te lo comparte" },
          { icon: "✅", text: "Ingresas el código en 360dialog → WhatsApp queda conectado en 24-48h" },
          { icon: "💬", text: "Actualizas el webhook con el nuevo número del cliente (paso 7)" },
        ]
      },
      {
        title: "DÍA 2 — Entrega final y capacitación",
        items: [
          { icon: "🎉", text: "Le confirmas: '¡Tu NOVA está 100% activa en WhatsApp! Desde ahora responde automáticamente a todas tus clientas'" },
          { icon: "📖", text: "Le explicas 3 cosas: 1) Cómo pausar el bot si quiere responder él mismo (te escribe a ti), 2) Cómo pedirte actualizaciones de catálogo, 3) Cuándo es el próximo pago" },
          { icon: "📊", text: "Le dices que en 2 semanas le mandas un reporte de cuántos mensajes respondió NOVA y cuántas ventas cerró" },
        ]
      }
    ]
  }
];

function StepCard({ step, isActive, onClick }) {
  const completedColor = "#22c55e";
  return (
    <button onClick={onClick} style={{ background: isActive ? `${step.color}15` : "transparent", border: `1px solid ${isActive ? step.color + "55" : "#1a1a2a"}`, borderRadius: 14, padding: "12px 14px", cursor: "pointer", textAlign: "left", transition: "all .2s", width: "100%" }}>
      <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
        <div style={{ width: 36, height: 36, borderRadius: "50%", background: isActive ? `${step.color}22` : "#0d0d18", border: `2px solid ${isActive ? step.color + "66" : "#1e1e2e"}`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 18, flexShrink: 0 }}>{step.icon}</div>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ color: isActive ? step.color : "#555", fontWeight: isActive ? 700 : 500, fontSize: 12, lineHeight: 1.3, fontFamily: "'DM Sans',sans-serif" }}>{step.title}</div>
          <div style={{ color: "#333", fontSize: 10, marginTop: 2 }}>{step.tiempo}</div>
        </div>
      </div>
    </button>
  );
}

export default function GuiaTwilio() {
  const [activeStep, setActiveStep] = useState(0);
  const [copiedCode, setCopiedCode] = useState(false);
  const step = STEPS[activeStep];

  const tipoColors = { prep: "#6b7280", tecnico: "#3b82f6", produccion: "#a855f7", admin: "#f59e0b", negocio: "#22c55e", proceso: "#ec4899" };
  const tipoLabels = { prep: "Preparación", tecnico: "Técnico", produccion: "Producción", admin: "Administración", negocio: "Negocio", proceso: "Proceso" };

  return (
    <div style={{ minHeight: "100vh", background: "#05050d", color: "#fff", fontFamily: "'DM Sans', sans-serif" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@300;400;500;600;700;800;900&display=swap');
        * { box-sizing: border-box; margin: 0; padding: 0; }
        ::-webkit-scrollbar { width: 3px; } ::-webkit-scrollbar-track { background: #0a0a14; } ::-webkit-scrollbar-thumb { background: #25D36655; border-radius: 2px; }
        @keyframes fadeUp { from { opacity:0; transform:translateY(8px); } to { opacity:1; transform:translateY(0); } }
        @keyframes pulse { 0%,100%{opacity:1} 50%{opacity:.3} }
        pre { white-space: pre-wrap; word-break: break-all; }
      `}</style>

      {/* HEADER */}
      <div style={{ background: "#07070e", borderBottom: "1px solid #12121e", padding: "16px 24px", display: "flex", alignItems: "center", gap: 14 }}>
        <div style={{ width: 38, height: 38, borderRadius: 11, background: "linear-gradient(135deg,#25D366,#128C7E)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 20 }}>💬</div>
        <div>
          <div style={{ fontWeight: 900, fontSize: 17, letterSpacing: -0.5 }}>Guía WhatsApp Real — NOVAModa</div>
          <div style={{ color: "#444", fontSize: 12 }}>Conecta el bot al WhatsApp de tus clientes paso a paso</div>
        </div>
        <div style={{ marginLeft: "auto", display: "flex", gap: 8, alignItems: "center" }}>
          <div style={{ background: "#25D36622", border: "1px solid #25D36644", borderRadius: 20, padding: "5px 14px", fontSize: 12, color: "#25D366", fontWeight: 700 }}>
            Paso {activeStep + 1} de {STEPS.length}
          </div>
        </div>
      </div>

      {/* PROGRESO */}
      <div style={{ background: "#07070e", borderBottom: "1px solid #12121e", padding: "10px 24px", display: "flex", alignItems: "center", gap: 12 }}>
        <div style={{ flex: 1, height: 5, background: "#1a1a2a", borderRadius: 3, overflow: "hidden" }}>
          <div style={{ height: "100%", width: `${((activeStep + 1) / STEPS.length) * 100}%`, background: "linear-gradient(90deg,#25D366,#128C7E)", borderRadius: 3, transition: "width .5s ease" }} />
        </div>
        <div style={{ color: "#25D366", fontWeight: 800, fontSize: 12, flexShrink: 0 }}>{Math.round(((activeStep + 1) / STEPS.length) * 100)}%</div>
      </div>

      <div style={{ display: "flex", maxWidth: 1100, margin: "0 auto", padding: 24, gap: 20 }}>

        {/* SIDEBAR */}
        <div style={{ width: 230, flexShrink: 0, display: "flex", flexDirection: "column", gap: 5 }}>
          {STEPS.map((s, i) => (
            <StepCard key={s.id} step={s} isActive={activeStep === i} onClick={() => setActiveStep(i)} />
          ))}
        </div>

        {/* CONTENIDO */}
        <div style={{ flex: 1, animation: "fadeUp .3s ease" }}>

          {/* Header del paso */}
          <div style={{ background: "#0a0a14", border: `1px solid ${step.color}33`, borderRadius: 20, padding: 28, marginBottom: 16 }}>
            <div style={{ display: "flex", alignItems: "flex-start", gap: 16, marginBottom: 16 }}>
              <div style={{ width: 58, height: 58, borderRadius: 18, background: `${step.color}18`, border: `1px solid ${step.color}44`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 30, flexShrink: 0 }}>{step.icon}</div>
              <div style={{ flex: 1 }}>
                <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 4 }}>
                  <span style={{ background: `${tipoColors[step.tipo]}18`, border: `1px solid ${tipoColors[step.tipo]}33`, color: tipoColors[step.tipo], borderRadius: 20, padding: "3px 12px", fontSize: 10, fontWeight: 700 }}>{tipoLabels[step.tipo]}</span>
                  <span style={{ color: "#333", fontSize: 11 }}>Paso {step.id} de {STEPS.length}</span>
                </div>
                <h2 style={{ fontSize: 22, fontWeight: 900, letterSpacing: -0.5, lineHeight: 1.2, marginBottom: 4 }}>{step.title}</h2>
                <p style={{ color: "#555", fontSize: 14 }}>{step.subtitle}</p>
              </div>
              <div style={{ display: "flex", flexDirection: "column", gap: 6, flexShrink: 0, textAlign: "right" }}>
                <div style={{ background: "#1a1a2a", borderRadius: 10, padding: "6px 14px", fontSize: 12 }}>
                  <span style={{ color: "#555" }}>⏱ </span><span style={{ color: "#aaa", fontWeight: 600 }}>{step.tiempo}</span>
                </div>
                <div style={{ background: "#22c55e12", border: "1px solid #22c55e22", borderRadius: 10, padding: "6px 14px", fontSize: 12 }}>
                  <span style={{ color: "#22c55e", fontWeight: 700 }}>💰 {step.costo}</span>
                </div>
              </div>
            </div>

            {step.url && (
              <a href={step.url} target="_blank" rel="noreferrer" style={{ display: "inline-flex", alignItems: "center", gap: 8, background: `${step.color}18`, border: `1px solid ${step.color}44`, color: step.color, borderRadius: 12, padding: "10px 18px", fontSize: 13, fontWeight: 700, textDecoration: "none", fontFamily: "'DM Sans',sans-serif" }}>
                🔗 {step.urlLabel}
              </a>
            )}
          </div>

          {/* Secciones */}
          <div style={{ display: "flex", flexDirection: "column", gap: 14, marginBottom: 16 }}>
            {step.sections.map((sec, si) => (
              <div key={si} style={{ background: "#0a0a14", border: `1px solid ${sec.color ? sec.color + "33" : "#1a1a2a"}`, borderRadius: 16, padding: 22 }}>
                <div style={{ fontWeight: 800, fontSize: 14, marginBottom: 14, color: sec.color || "#fff" }}>{sec.title}</div>
                <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                  {sec.items.map((item, ii) => (
                    <div key={ii} style={{ display: "flex", gap: 12, alignItems: "flex-start" }}>
                      <div style={{ width: 28, height: 28, borderRadius: "50%", background: `${step.color}18`, border: `1px solid ${step.color}33`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 13, flexShrink: 0, marginTop: 1 }}>{item.icon}</div>
                      <p style={{ color: "#777", fontSize: 13, lineHeight: 1.7, flex: 1 }}>{item.text}</p>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>

          {/* Código si hay */}
          {step.code && (
            <div style={{ background: "#060610", border: "1px solid #1a1a2a", borderRadius: 16, padding: 22, marginBottom: 16, position: "relative" }}>
              <div style={{ color: "#f59e0b", fontSize: 10, fontWeight: 700, letterSpacing: 2, textTransform: "uppercase", marginBottom: 12 }}>{step.code.title}</div>
              <pre style={{ color: "#7dd3a8", fontSize: 12, lineHeight: 1.8, fontFamily: "monospace" }}>{step.code.content}</pre>
              <button onClick={() => { navigator.clipboard.writeText(step.code.content); setCopiedCode(true); setTimeout(() => setCopiedCode(false), 2500); }}
                style={{ position: "absolute", top: 16, right: 16, background: copiedCode ? "#22c55e22" : "#f59e0b18", border: `1px solid ${copiedCode ? "#22c55e44" : "#f59e0b44"}`, color: copiedCode ? "#22c55e" : "#f59e0b", borderRadius: 8, padding: "6px 14px", cursor: "pointer", fontSize: 11, fontWeight: 700, fontFamily: "'DM Sans',sans-serif" }}>
                {copiedCode ? "✓ Copiado" : "Copiar código"}
              </button>
            </div>
          )}

          {/* Navegación */}
          <div style={{ display: "flex", gap: 10 }}>
            <button onClick={() => setActiveStep(Math.max(0, activeStep - 1))} disabled={activeStep === 0}
              style={{ background: "transparent", border: "1px solid #1a1a2a", color: activeStep === 0 ? "#222" : "#666", borderRadius: 14, padding: "13px 24px", cursor: activeStep === 0 ? "default" : "pointer", fontSize: 14, fontWeight: 700, fontFamily: "'DM Sans',sans-serif" }}>
              ← Anterior
            </button>
            {activeStep < STEPS.length - 1 ? (
              <button onClick={() => setActiveStep(activeStep + 1)}
                style={{ flex: 1, background: `linear-gradient(135deg,${step.color},${step.color}cc)`, border: "none", color: "#fff", borderRadius: 14, padding: "13px", cursor: "pointer", fontSize: 14, fontWeight: 900, fontFamily: "'DM Sans',sans-serif" }}>
                Siguiente paso →
              </button>
            ) : (
              <div style={{ flex: 1, background: "linear-gradient(135deg,#22c55e,#16a34a)", borderRadius: 14, padding: "13px", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 14, fontWeight: 900 }}>
                🎉 ¡WhatsApp real configurado! NOVA está viva.
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
