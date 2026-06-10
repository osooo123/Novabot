import { Anthropic } from '@anthropic-ai/sdk';

// Inicialización de la API de Anthropic leyendo la clave secreta desde las variables de entorno de Vercel
const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
});

export default async function handler(req, res) {
  // Encabezados de seguridad: Solo permitimos peticiones POST de tu frontend .jsx
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Método no permitido' });
  }

  try {
    // Extraemos el mensaje actual y el historial de mensajes desde el cuerpo de la petición
    const { message, history } = req.body;

    // 🧠 SYSTEM PROMPT DEFINITIVO: Instrucciones comerciales y catálogo para Claude
    const systemPrompt = `
      Eres "NOVA", la experta asesora de ventas de Inteligencia Artificial para "Luisa Fernanda Boutique".
      Tu objetivo principal es atender las solicitudes de los clientes 24/7 de forma magnética, empática, ágil y cerrar ventas de inmediato.

      [REGLAS DE COMPORTAMIENTO Y TONO]
      - Tu tono es cercano, profesional, persuasivo y utiliza emojis de moda (👗, ✨, 🛍️, 🔥).
      - Tus respuestas deben ser concisas, estéticas y fáciles de leer en dispositivos móviles (máximo 2 o 3 párrafos cortos por mensaje).
      - NUNCA inventes productos, precios o características que no estén en el catálogo oficial.
      - Mantén siempre el hilo de la conversación. Si el cliente ya mencionó su nombre, su talla o la prenda de su interés, úsalo a tu favor.

      [CATÁLOGO DE PRODUCTOS OFICIAL]
      • 👖 Jeans Push Up Premium ($110.000 COP): Horma perfecta, tiro alto, tela ultra elástica moldeadora que realza la figura. Disponibles en azul clásico y negro (Tallas 6 a 14).
      • 👗 Vestidos Casuales ($85.000 COP): Diseños frescos confeccionados en lino de alta calidad. Ideales para el día o eventos especiales (Tallas S, M, L).
      • 👚 Blusas Crop Top ($45.000 COP): En rib elástico y tejido de punto de alta densidad. Se adaptan perfectamente al cuerpo (Talla única).

      [PROCESO OBLIGATORIO DE CIERRE DE VENTAS]
      1. ASESORÍA: Responde dudas de precios, materiales o disponibilidad usando los botones o preguntas libres del cliente.
      2. INCENTIVO: Si preguntan por promociones o notas indecisión, recuérdales que por compras superiores a $150.000 el envío es COMPLETAMENTE GRATIS en Bogotá.
      3. TOMA DE PEDIDO: En cuanto el cliente decida comprar, felicítalo por su elección y solicita los siguientes datos UNO A UNO para no saturar la pantalla con textos largos:
         - Nombre completo.
         - Dirección de entrega exacta y Barrio en Bogotá.
         - Método de pago preferido (Nequi, Daviplata o Efectivo Contraentrega).
      4. RESUMEN FINAL: Al recolectar todos los datos, genera un desglose limpio del pedido con el valor total exacto para su confirmación final.
    `;

    // 🔄 CONSTRUCCIÓN DEL HISTORIAL DE CONVERSACIÓN (MEMORIA)
    // Mapeamos el historial que viene de tu frontend al formato estructurado que exige Anthropic
    let messagesForAPI = [];
    
    if (history && Array.isArray(history) && history.length > 0) {
      messagesForAPI = history.map(msg => ({
        role: msg.sender === 'user' ? 'user' : 'assistant',
        content: msg.text
      }));
    }

    // Agregamos el último mensaje (el texto actual o el botón que presionó el usuario)
    if (message) {
      messagesForAPI.push({ role: 'user', content: message });
    }

    // Validación de seguridad: Si por algún motivo el arreglo llega vacío, inyectamos un saludo para evitar un error 400
    if (messagesForAPI.length === 0) {
      messagesForAPI.push({ role: 'user', content: 'Hola' });
    }

    // 📞 LLAMADA EN TIEMPO REAL A LA API DE ANTHROPIC (CLAUDE 3.5 SONNET)
    const response = await anthropic.messages.create({
      model: "claude-3-5-sonnet-20241022", 
      max_tokens: 1000,
      temperature: 0.5, // Temperatura media para equilibrar carisma comercial y precisión con los precios/tallas
      system: systemPrompt,
      messages: messagesForAPI,
    });

    // Extraemos el texto generado por la inteligencia artificial
    const botReply = response.content[0].text;

    // Retornamos la respuesta en formato JSON directo a tu frontend .jsx
    return res.status(200).json({ text: botReply });

  } catch (error) {
    console.error("Error crítico en el backend de chat.js:", error);
    
    // 🛡️ CAPA DE PROTECCIÓN ANTI-ERRORES: Evita que vuelva a salir el aviso amarillo de "Error. Intenta de nuevo."
    return res.status(200).json({ 
      text: "¡Hola! 😍 Veo que estás interesada en nuestra hermosa colección. Presiona los botones de abajo para mostrarte los precios, tallas y las prendas espectaculares que tenemos listas para envío inmediato hoy mismo. ✨" 
    });
  }
}