import { useState } from "react";

const COP = n => `$${new Intl.NumberFormat("es-CO").format(n)}`;

const MODULOS = [
  {
    id: 1, icon: "🧑", color: "#ec4899",
    titulo: "El perfil ideal del asesor",
    subtitulo: "Quién contratar y qué buscar",
    secciones: [
      {
        t: "Perfil que SÍ funciona", color: "#22c55e",
        items: [
          { e: "✅", t: "Comunicativo y extrovertido", d: "Que le guste hablar con gente y no le dé pena escribirle a desconocidos por Instagram o WhatsApp." },
          { e: "✅", t: "Activo en redes sociales", d: "Que entienda Instagram y WhatsApp. No necesita saber de tecnología ni de bots — solo de redes." },
          { e: "✅", t: "Orientado a comisiones", d: "Que se motive con ganar más según lo que produce. El mejor perfil trabaja por resultados, no solo por fijo." },
          { e: "✅", t: "Constante y disciplinado", d: "Que pueda mandar 20 mensajes diarios sin que lo tengas que perseguir." },
          { e: "✅", t: "Conoce el comercio colombiano", d: "Ideal si ya vendió ropa, accesorios o servicios. Entiende el dolor del cliente porque lo vivió." },
        ]
      },
      {
        t: "Perfil que NO funciona", color: "#ef4444",
        items: [
          { e: "❌", t: "Solo quiere el fijo", d: "Si su primera pregunta es cuánto es el salario base sin preguntar por comisiones, no es el perfil correcto." },
          { e: "❌", t: "Tímido para contactar", d: "Si le da pena escribirle a tiendas en Instagram, no puede vender este servicio." },
          { e: "❌", t: "Sin celular o datos suficientes", d: "Trabaja 100% desde el celular. Sin datos o celular lento, va a fallar operativamente." },
          { e: "❌", t: "Espera que los clientes lleguen solos", d: "Este rol es de prospección activa. Necesitas alguien que salga a buscar, no que espere." },
        ]
      },
      {
        t: "Dónde encontrar asesores en Colombia", color: "#3b82f6",
        items: [
          { e: "📘", t: "Grupos de Facebook", d: "Busca: 'Trabajo ventas Colombia', 'Empleo Bogotá/Medellín/Cali', 'Trabajo freelance Colombia'. Hay cientos de personas buscando trabajo comisionista." },
          { e: "💼", t: "LinkedIn", d: "Publica 'Asesor comercial digital freelance'. Llegan perfiles con experiencia en ventas y más formales." },
          { e: "💻", t: "Computrabajo y Elempleo", d: "Las plataformas más usadas en Colombia. Publica gratis y recibes hojas de vida en 24 horas." },
          { e: "📸", t: "Tus Instagram Stories", d: "Publica: 'Busco asesor de ventas digitales, trabajo desde casa, comisiones hasta $2M'. Sorprende cuánta gente aplica." },
          { e: "🤝", t: "Referidos de confianza", d: "Pídele a conocidos que recomienden a alguien. Los mejores asesores llegan por recomendación personal." },
        ]
      }
    ]
  },
  {
    id: 2, icon: "💰", color: "#22c55e",
    titulo: "Estructura de comisiones",
    subtitulo: "Cuánto pagarle y cómo motivarlo",
    secciones: [
      {
        t: "Modelo de comisiones recomendado", color: "#22c55e",
        items: [
          { e: "🚫", t: "Sin salario fijo al principio", d: "Para arrancar, trabaja 100% por comisiones. Esto filtra a los que realmente quieren trabajar. Cuando tenga 10+ clientes activos, evalúa un fijo bajo." },
          { e: "💵", t: "30% de la primera mensualidad", d: "Por cada cliente nuevo: Básico ($200K) = $60.000 | Pro ($290K) = $87.000 | Premium ($420K) = $126.000 COP." },
          { e: "🔄", t: "10% de renovación mensual", d: "Por cada mes que el cliente siga activo, el asesor gana el 10%. Esto lo incentiva a cuidar sus clientes y no abandonarlos." },
          { e: "🎯", t: "Bono por meta mensual", d: "10+ clientes cerrados: bono $300.000. 20+ clientes: bono $800.000. Crea urgencia y competencia sana." },
        ]
      },
      {
        t: "Proyección de ganancias del asesor", color: "#f59e0b",
        items: [
          { e: "📊", t: "5 clientes Pro (primer mes)", d: "5 × $87.000 = $435.000 en cierres. Desde el mes 2: + $145.000 en renovaciones = $580.000 acumulado." },
          { e: "📊", t: "10 clientes Pro acumulados", d: "$870.000 en cierres + $290.000 en renovaciones = $1.160.000/mes. Ya es ingreso muy atractivo." },
          { e: "📊", t: "20 clientes acumulados", d: "$1.740.000 en cierres nuevos + $580.000 en renovaciones = $2.320.000/mes. Justifica tiempo completo." },
          { e: "💡", t: "Por qué funciona este modelo", d: "Tiene incentivo de cerrar rápido (30% primera vez) y de cuidar clientes (10% renovación). No abandona a nadie después de cerrar." },
        ]
      },
      {
        t: "Cuándo y cómo pagarle", color: "#3b82f6",
        items: [
          { e: "📅", t: "Pago quincenal", d: "Días 15 y último de cada mes. Mantiene la motivación constante, no solo a fin de mes." },
          { e: "🧾", t: "Comprobante primero", d: "El asesor debe mandarte la captura del Nequi del cliente antes de recibir su comisión. Sin comprobante, no hay pago." },
          { e: "📱", t: "Por Nequi o Daviplata", d: "Rápido, sin bancos, el asesor lo recibe inmediato. Ambos lo usan naturalmente." },
          { e: "📋", t: "Registro en el panel", d: "Usa el sistema de operaciones para registrar qué clientes trajo cada asesor. Transparencia total en ambas direcciones." },
        ]
      }
    ]
  },
  {
    id: 3, icon: "🎓", color: "#3b82f6",
    titulo: "Entrenamiento en 3 días",
    subtitulo: "Plan exacto de capacitación",
    secciones: [
      {
        t: "DÍA 1 — Entender el producto", color: "#ec4899",
        items: [
          { e: "🕐", t: "Horas 1-2: El producto en vivo", d: "Muéstrale todas las demos (novamoda-colombia, novabusiness). Que pruebe el chat él mismo. Que vea cómo NOVA responde antes de salir a vender." },
          { e: "🕐", t: "Horas 2-3: Planes y precios", d: "Enséñale los 3 planes, qué incluye cada uno y cuándo recomendar cada uno. Que memorice los precios: $200K, $290K, $420K." },
          { e: "🕐", t: "Horas 3-4: El recomendador de planes", d: "Que practique con el recomendador (novamoda-recomendador) hasta que pueda diagnosticar a un cliente en menos de 5 minutos." },
          { e: "📚", t: "Tarea del día", d: "Que escriba con sus palabras qué es NOVA y qué problema resuelve en máximo 5 líneas. Si no puede explicarlo simple, no lo entendió." },
        ]
      },
      {
        t: "DÍA 2 — Aprender a vender", color: "#f59e0b",
        items: [
          { e: "🕐", t: "Horas 1-2: El guión de ventas", d: "Lee con él cada mensaje del kit de ventas. Explica por qué cada mensaje está escrito así y qué busca generar en el cliente." },
          { e: "🕐", t: "Horas 2-3: Roleplay de objeciones", d: "TÚ haces de cliente difícil. Él practica: 'muy caro', 'ya tengo quien responda', 'déjame pensarlo'. Repite hasta que responda con naturalidad." },
          { e: "🕐", t: "Horas 3-4: La demo en vivo", d: "Practica mostrar la demo a un cliente ficticio. Que domine ese momento — es el que cierra el 70% de las ventas." },
          { e: "📚", t: "Tarea del día", d: "Que haga 3 demos a amigos o familiares y te cuente cómo les fue. Sin presión de vender, solo practicar el pitch." },
        ]
      },
      {
        t: "DÍA 3 — Salir a prospectar", color: "#22c55e",
        items: [
          { e: "🕐", t: "Hora 1: Buscar prospectos", d: "Enséñale a buscar tiendas en Instagram: palabras clave, qué señales buscar (muchos seguidores, preguntas sin responder en comentarios)." },
          { e: "🕐", t: "Hora 2: Primeros mensajes contigo", d: "Que mande los primeros 10 mensajes CON TU SUPERVISIÓN. Corrígele la redacción en tiempo real antes de que salga solo." },
          { e: "🕐", t: "Hora 3: El sistema de registro", d: "Enséñale a registrar cada prospecto en el sistema de prospección y a cambiar estados. Orden desde el día 1." },
          { e: "🎯", t: "Meta primera semana", d: "20 prospectos contactados, 3-5 demos hechas, 1 cliente cerrado. Si no contactó 20, hay un problema de disciplina que debes atender inmediatamente." },
        ]
      }
    ]
  },
  {
    id: 4, icon: "📐", color: "#f59e0b",
    titulo: "Reglas y límites claros",
    subtitulo: "Qué puede y qué no puede hacer",
    secciones: [
      {
        t: "Lo que el asesor PUEDE hacer", color: "#22c55e",
        items: [
          { e: "✅", t: "Contactar prospectos en redes sociales", d: "Instagram, WhatsApp y Facebook. Usa su propio celular y sus propias cuentas — más natural y creíble." },
          { e: "✅", t: "Hacer demos con las apps", d: "Las demos siempre desde las apps que tú creaste. Él nunca modifica ni accede a los sistemas internos." },
          { e: "✅", t: "Usar los guiones con personalización leve", d: "Puede adaptar el tono pero el mensaje base es el que ya está probado. No reinventa el guión." },
          { e: "✅", t: "Ofrecer hasta 1 mes gratis como gancho", d: "Solo con tu autorización previa y en casos específicos donde el cliente está dudando en el cierre." },
          { e: "✅", t: "Recolectar info del cliente", d: "Nombre, tienda, productos, promos, método de pago. Todo eso te lo pasa a ti para configurar el bot." },
        ]
      },
      {
        t: "Lo que el asesor NO puede hacer", color: "#ef4444",
        items: [
          { e: "❌", t: "Cobrar directamente al cliente", d: "El pago SIEMPRE va a TU Nequi o Daviplata. Nunca a la cuenta del asesor. Esto evita fraudes y malentendidos graves." },
          { e: "❌", t: "Prometer funciones que no existen", d: "No puede inventar características, precios especiales o plazos que no están en los planes reales." },
          { e: "❌", t: "Acceder a los sistemas y paneles", d: "Las apps, paneles y contraseñas son tuyas. El asesor no tiene acceso directo a nada técnico." },
          { e: "❌", t: "Configurar los bots", d: "La configuración técnica la haces tú. El asesor solo vende y recolecta la información necesaria." },
          { e: "❌", t: "Hablar mal de la competencia", d: "Nunca debe decir que otro bot es malo. Solo muestra las ventajas de NOVA — eso es más profesional y efectivo." },
        ]
      },
      {
        t: "Causas de terminación inmediata", color: "#ef4444",
        items: [
          { e: "🚫", t: "Cobrar al cliente sin reportar", d: "Tolerancia cero. Si recibe dinero de un cliente y no lo reporta, terminas la relación ese mismo día." },
          { e: "🚫", t: "Prometer resultados irreales", d: "Decirle al cliente que va a triplicar ventas garantizado es engaño. Eso daña tu reputación." },
          { e: "🚫", t: "No cumplir meta por 2 meses seguidos", d: "Sin al menos 1 cliente en 2 meses, el modelo no está funcionando con esa persona. Es hora de cambiar." },
          { e: "🚫", t: "Compartir información confidencial", d: "Precios de costo, estructura del negocio, datos de clientes — todo es confidencial durante y después de la relación." },
        ]
      }
    ]
  },
  {
    id: 5, icon: "📊", color: "#a855f7",
    titulo: "Cómo supervisar resultados",
    subtitulo: "Métricas semanales y seguimiento",
    secciones: [
      {
        t: "Las 4 métricas que revisas cada semana", color: "#a855f7",
        items: [
          { e: "1️⃣", t: "Prospectos contactados", d: "Meta mínima: 20 por semana. Menos de 10 indica un problema de disciplina o motivación que hay que atender." },
          { e: "2️⃣", t: "Demos realizadas", d: "Meta: mínimo 3 por semana. De 20 contactos deben responder 4-5, y de esos debe cerrar demos con al menos 3." },
          { e: "3️⃣", t: "Clientes cerrados", d: "Meta: 1 por semana. Con práctica y buen proceso sube a 2-3 por semana en el segundo mes." },
          { e: "4️⃣", t: "Tasa de conversión demo-cierre", d: "Si hace 10 demos y no cierra ninguno, hay un problema en su pitch. Si hace 3 y cierra 2, va excelente — escálalo." },
        ]
      },
      {
        t: "La reunión semanal de 30 minutos", color: "#3b82f6",
        items: [
          { e: "📅", t: "Cada lunes a la hora acordada", d: "Siempre por videollamada o presencial. Los lunes pone la energía y el foco para toda la semana." },
          { e: "📋", t: "Revisa las métricas de la semana anterior", d: "Prospectos, demos, cierres. Celebra los logros públicamente. Identifica obstáculos sin juzgar al asesor." },
          { e: "🎯", t: "Define metas concretas", d: "No metas vagas como 'vender más'. Específicas: '20 contactos, 3 demos, 1 cierre esta semana'." },
          { e: "🔧", t: "Practica las objeciones difíciles", d: "Que te cuente las conversaciones que no salieron bien. Practican juntos cómo responder mejor la próxima vez." },
          { e: "🏆", t: "Reconocimiento y motivación", d: "Reconoce sus logros, aunque sea en el grupo de WhatsApp. El reconocimiento vale tanto como el dinero para mantener a alguien motivado." },
        ]
      },
      {
        t: "Sistema de seguimiento diario", color: "#22c55e",
        items: [
          { e: "📱", t: "Grupo de WhatsApp de trabajo", d: "Crea un grupo solo de trabajo. Que reporte ahí cada prospecto contactado, demo hecha y cierre. Transparencia total." },
          { e: "📊", t: "El sistema de prospección", d: "Usa la app de prospección para que registre cada prospecto con su estado. Así tú ves en tiempo real cómo avanza." },
          { e: "📸", t: "Capturas de conversaciones clave", d: "Que te mande captura de conversaciones interesantes. Sirve para mejorar guiones y verificar que está trabajando activamente." },
        ]
      }
    ]
  },
  {
    id: 6, icon: "✅", color: "#6b7280",
    titulo: "Lista de verificación — Antes de contratar",
    subtitulo: "Confirma todo esto antes de que arranque",
    secciones: [
      {
        t: "Antes del primer día", color: "#22c55e",
        items: [
          { e: "☐", t: "Enviaste y recibiste el acuerdo firmado (ACEPTO por WhatsApp)", d: "Sin acuerdo no empieza. Es tu protección legal y deja las reglas claras desde el día 1." },
          { e: "☐", t: "Tienes su cédula o foto de ella", d: "Para tus registros y en caso de cualquier inconveniente." },
          { e: "☐", t: "Tiene claro que NO cobra directamente", d: "Repítelo dos veces si es necesario. Este punto es crítico." },
          { e: "☐", t: "Tiene acceso a las demos y materiales", d: "Las apps de demo funcionando en su celular antes del día 1." },
          { e: "☐", t: "Tiene el kit de ventas descargado", d: "Todos los guiones y mensajes disponibles para copiar y pegar." },
        ]
      },
      {
        t: "Al final de la primera semana", color: "#f59e0b",
        items: [
          { e: "☐", t: "Contactó mínimo 20 prospectos", d: "Si no llegó a 20, hay un problema de disciplina. Habla con él de inmediato." },
          { e: "☐", t: "Hizo al menos 2 demos", d: "Si no hizo ninguna demo, necesita más práctica del pitch contigo." },
          { e: "☐", t: "Está reportando en el grupo de WhatsApp", d: "Si no reporta diariamente, no hay visibilidad de su trabajo." },
          { e: "☐", t: "Puede explicar NOVA sin mirar el guión", d: "Después de 5 días debe poder explicarlo con sus propias palabras con naturalidad." },
        ]
      },
      {
        t: "Al final del primer mes", color: "#3b82f6",
        items: [
          { e: "☐", t: "Cerró al menos 3 clientes", d: "Si no cerró ninguno en 4 semanas de trabajo activo, evalúa si el problema es el perfil o el proceso." },
          { e: "☐", t: "Pagaste sus comisiones puntualmente", d: "El pago puntual es lo que mantiene su confianza y motivación. No lo descuides." },
          { e: "☐", t: "Identificaste sus fortalezas y debilidades", d: "¿Es mejor prospectando o cerrando? ¿Dónde necesita más apoyo? Ajusta el entrenamiento." },
          { e: "☐", t: "Decidiste si continuás o no", d: "Si los números están bien, escálalo. Si no hay resultados, toma la decisión con claridad y sin dilatar." },
        ]
      }
    ]
  }
];

function ModuloCard({ modulo, isActive, onClick }) {
  return (
    <button onClick={onClick} style={{ background: isActive ? `${modulo.color}15` : "transparent", border: `1px solid ${isActive ? modulo.color + "55" : "#1a1a2a"}`, borderRadius: 12, padding: "11px 13px", cursor: "pointer", textAlign: "left", width: "100%", transition: "all .2s", display: "flex", alignItems: "center", gap: 10 }}>
      <div style={{ width: 34, height: 34, borderRadius: 10, background: isActive ? `${modulo.color}22` : "#0d0d18", border: `1px solid ${isActive ? modulo.color + "44" : "#2a2a3a"}`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 16, flexShrink: 0 }}>{modulo.icon}</div>
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ color: isActive ? modulo.color : "#555", fontWeight: isActive ? 700 : 500, fontSize: 12, lineHeight: 1.3, fontFamily: "'DM Sans',sans-serif" }}>{modulo.titulo}</div>
        <div style={{ color: "#333", fontSize: 10, marginTop: 1 }}>{modulo.subtitulo}</div>
      </div>
    </button>
  );
}

function SeccionCard({ s }) {
  return (
    <div style={{ background: "#0a0a14", border: `1px solid ${s.color}22`, borderRadius: 16, padding: 20, marginBottom: 12 }}>
      <div style={{ color: s.color, fontSize: 10, fontWeight: 700, textTransform: "uppercase", letterSpacing: 2, marginBottom: 14 }}>{s.t}</div>
      <div style={{ display: "flex", flexDirection: "column", gap: 11 }}>
        {s.items.map((item, i) => (
          <div key={i} style={{ display: "flex", gap: 12, alignItems: "flex-start" }}>
            <div style={{ width: 28, height: 28, borderRadius: 8, background: `${s.color}15`, border: `1px solid ${s.color}30`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 13, flexShrink: 0, marginTop: 1 }}>{item.e}</div>
            <div>
              <div style={{ fontWeight: 700, fontSize: 13, marginBottom: 2, fontFamily: "'DM Sans',sans-serif" }}>{item.t}</div>
              <div style={{ color: "#666", fontSize: 12, lineHeight: 1.65 }}>{item.d}</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function SimuladorComisiones() {
  const [c, setC] = useState({ basico: 2, pro: 5, premium: 1 });
  const [meses, setMeses] = useState(3);
  const precios = { basico: 200000, pro: 290000, premium: 420000 };
  let totalCierre = 0, totalRenovacion = 0;
  Object.entries(c).forEach(([plan, n]) => {
    totalCierre += n * precios[plan] * 0.30;
    totalRenovacion += n * precios[plan] * 0.10;
  });
  const acumulado = totalCierre + totalRenovacion * (meses - 1);
  const totalC = Object.values(c).reduce((s, n) => s + n, 0);

  return (
    <div style={{ background: "#0a0a14", border: "1px solid #22c55e22", borderRadius: 18, padding: 24 }}>
      <div style={{ color: "#22c55e", fontSize: 10, fontWeight: 700, textTransform: "uppercase", letterSpacing: 2, marginBottom: 18 }}>💰 Calculadora de comisiones del asesor</div>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 10, marginBottom: 18 }}>
        {[["basico","Básico","$200K"],["pro","Pro","$290K"],["premium","Premium","$420K"]].map(([plan,label,precio]) => (
          <div key={plan} style={{ background: "#060610", border: "1px solid #1a1a2a", borderRadius: 12, padding: 14 }}>
            <div style={{ color: "#555", fontSize: 11, marginBottom: 10 }}>Clientes {label} ({precio}/mes)</div>
            <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
              <button onClick={() => setC(p => ({ ...p, [plan]: Math.max(0, p[plan] - 1) }))} style={{ width: 28, height: 28, borderRadius: 8, background: "#1a1a2a", border: "none", color: "#fff", cursor: "pointer", fontSize: 18 }}>-</button>
              <span style={{ color: "#22c55e", fontWeight: 900, fontSize: 24, minWidth: 30, textAlign: "center" }}>{c[plan]}</span>
              <button onClick={() => setC(p => ({ ...p, [plan]: p[plan] + 1 }))} style={{ width: 28, height: 28, borderRadius: 8, background: "#1a1a2a", border: "none", color: "#fff", cursor: "pointer", fontSize: 18 }}>+</button>
            </div>
          </div>
        ))}
      </div>
      <div style={{ marginBottom: 16 }}>
        <div style={{ color: "#555", fontSize: 11, marginBottom: 8 }}>Proyectar a:</div>
        <div style={{ display: "flex", gap: 8 }}>
          {[1,3,6,12].map(m => (
            <button key={m} onClick={() => setMeses(m)} style={{ background: meses === m ? "#22c55e18" : "transparent", border: `1px solid ${meses === m ? "#22c55e55" : "#1a1a2a"}`, color: meses === m ? "#22c55e" : "#444", borderRadius: 10, padding: "7px 16px", cursor: "pointer", fontSize: 13, fontWeight: meses === m ? 700 : 500, fontFamily: "'DM Sans',sans-serif" }}>
              {m} mes{m > 1 ? "es" : ""}
            </button>
          ))}
        </div>
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 10 }}>
        {[
          { l: "Comisión mes 1", v: COP(totalCierre), s: `30% · ${totalC} cierres`, c: "#ec4899" },
          { l: "Renovación mensual", v: COP(totalRenovacion), s: "10% · clientes activos", c: "#3b82f6" },
          { l: `Total en ${meses} mes${meses > 1 ? "es" : ""}`, v: COP(acumulado), s: "Ingreso acumulado", c: "#22c55e" },
        ].map(m => (
          <div key={m.l} style={{ background: "#060610", border: `1px solid ${m.c}22`, borderRadius: 12, padding: 16, textAlign: "center" }}>
            <div style={{ color: m.c, fontWeight: 900, fontSize: 20, letterSpacing: -0.5 }}>{m.v}</div>
            <div style={{ color: "#444", fontSize: 11, marginTop: 4 }}>{m.l}</div>
            <div style={{ color: "#2a2a3a", fontSize: 10, marginTop: 2 }}>{m.s}</div>
          </div>
        ))}
      </div>
    </div>
  );
}

function GeneradorOferta() {
  const [tipo, setTipo] = useState("casual");
  const [contacto, setContacto] = useState("");
  const [copied, setCopied] = useState(false);

  const ofertas = {
    casual: `🚀 OPORTUNIDAD — ASESOR COMERCIAL DIGITAL

Empresa: NOVAModa Colombia
Modalidad: Trabajo desde casa, 100% virtual
Aplica: Todo Colombia

¿QUÉ HARÁS?
Contactar tiendas de ropa, accesorios y negocios en Instagram y WhatsApp para ofrecerles nuestro bot de ventas con IA (NOVA).

¿QUÉ OFRECEMOS?
💰 30% de comisión por cada cliente cerrado
💰 10% mensual por renovación (ingreso recurrente)
🎯 Bono $300.000 si cierras 10 clientes en el mes
📱 100% desde tu celular, horario flexible

¿QUÉ NECESITAS?
✅ Celular con datos y WhatsApp
✅ Gusto por hablar con gente y vender
✅ Activo en redes sociales
✅ No se necesita experiencia en tecnología

¿CUÁNTO PUEDES GANAR?
Con 10 clientes: $870.000+ en comisiones
Con 20 clientes: $1.740.000+ mensuales
(+ renovaciones que se acumulan cada mes)

Para aplicar escríbenos al ${contacto || "[TU NÚMERO/CORREO]"} con tu nombre y ciudad.`,
    
    formal: `OFERTA DE TRABAJO — ASESOR COMERCIAL DIGITAL FREELANCE

Empresa: NOVAModa / NOVABusiness Colombia
Tipo: Prestación de servicios — comisiones

DESCRIPCIÓN:
Vendemos bots de ventas con IA para tiendas de ropa y accesorios en Colombia. Buscamos asesor comercial para prospección y cierre de clientes nuevos.

RESPONSABILIDADES:
• Prospección activa en Instagram y WhatsApp (20+ contactos/día)
• Realizar demos del servicio a clientes interesados
• Cerrar ventas y recolectar información de configuración
• Reportar resultados semanalmente

COMPENSACIÓN:
• 30% del primer mes por cada cliente cerrado
• 10% mensual por cliente activo (ingreso recurrente)
• Bonos por metas superadas

REQUISITOS:
• Experiencia en ventas (presencial o digital)
• Celular propio con datos
• Manejo de WhatsApp e Instagram
• Orientado a resultados y comisiones

Interesados: ${contacto || "[TU NÚMERO/CORREO]"}`
  };

  const texto = ofertas[tipo];

  return (
    <div style={{ background: "#0a0a14", border: "1px solid #f59e0b22", borderRadius: 18, padding: 22 }}>
      <div style={{ color: "#f59e0b", fontSize: 10, fontWeight: 700, textTransform: "uppercase", letterSpacing: 2, marginBottom: 16 }}>📢 Generador de oferta de trabajo</div>
      <div style={{ display: "flex", gap: 8, marginBottom: 14 }}>
        {[["casual","Para Facebook e Instagram"],["formal","Para LinkedIn y Computrabajo"]].map(([id,label]) => (
          <button key={id} onClick={() => setTipo(id)} style={{ background: tipo === id ? "#f59e0b18" : "transparent", border: `1px solid ${tipo === id ? "#f59e0b55" : "#1a1a2a"}`, color: tipo === id ? "#f59e0b" : "#444", borderRadius: 10, padding: "7px 14px", cursor: "pointer", fontSize: 12, fontWeight: tipo === id ? 700 : 500, fontFamily: "'DM Sans',sans-serif" }}>{label}</button>
        ))}
      </div>
      <div style={{ marginBottom: 12 }}>
        <div style={{ color: "#444", fontSize: 11, marginBottom: 5 }}>Tu WhatsApp o correo de contacto</div>
        <input value={contacto} onChange={e => setContacto(e.target.value)} placeholder="Ej: 3001234567" style={{ width: "100%", background: "#060610", border: "1px solid #1a1a2a", borderRadius: 10, padding: "9px 12px", color: "#fff", fontSize: 13, outline: "none", fontFamily: "'DM Sans',sans-serif" }} />
      </div>
      <div style={{ background: "#060610", border: "1px solid #1a1a2a", borderRadius: 10, padding: 14, maxHeight: 240, overflowY: "auto", marginBottom: 12 }}>
        <pre style={{ color: "#777", fontSize: 12, lineHeight: 1.8, whiteSpace: "pre-wrap", fontFamily: "'DM Sans',sans-serif" }}>{texto}</pre>
      </div>
      <button onClick={() => { navigator.clipboard.writeText(texto); setCopied(true); setTimeout(() => setCopied(false), 2500); }}
        style={{ width: "100%", background: copied ? "linear-gradient(135deg,#22c55e,#16a34a)" : "linear-gradient(135deg,#f59e0b,#d97706)", border: "none", color: copied ? "#fff" : "#000", borderRadius: 12, padding: "12px", cursor: "pointer", fontSize: 14, fontWeight: 800, fontFamily: "'DM Sans',sans-serif" }}>
        {copied ? "✅ ¡Copiado! Publícalo ahora" : "📋 Copiar oferta de trabajo"}
      </button>
    </div>
  );
}

function AcuerdoTrabajo() {
  const [f, setF] = useState({ nombre: "", cedula: "", ciudad: "Bogotá", inicio: new Date().toISOString().split("T")[0] });
  const [copied, setCopied] = useState(false);
  const set = (k, v) => setF(p => ({ ...p, [k]: v }));
  const fDate = d => new Date(d).toLocaleDateString("es-CO", { day: "numeric", month: "long", year: "numeric" });

  const acuerdo = `══════════════════════════════════
  ACUERDO DE PRESTACIÓN DE SERVICIOS
       NOVAModa / NOVABusiness Colombia
══════════════════════════════════

Fecha: ${fDate(f.inicio)}

CONTRATANTE: NOVAModa Colombia

PRESTADOR:
• Nombre: ${f.nombre || "[Nombre del asesor]"}
• Cédula: ${f.cedula || "[Número de cédula]"}
• Ciudad: ${f.ciudad}

━━━ OBJETO ━━━

El PRESTADOR realizará actividades de
prospección y cierre de ventas del
servicio NOVABot para negocios colombianos.

━━━ COMPENSACIÓN ━━━

Comisión por cierre (30% primera mensualidad):
• Plan Básico $200.000 → $60.000
• Plan Pro $290.000 → $87.000
• Plan Premium $420.000 → $126.000

Comisión renovación: 10% mensual por
cada cliente activo que el PRESTADOR cerró.

Bonos: +$300.000 por 10 cierres/mes
       +$800.000 por 20 cierres/mes

Pago: Días 15 y último de cada mes
      por Nequi/Daviplata + comprobante.

━━━ REGLAS CLAVE ━━━

✅ El PRESTADOR NUNCA cobra al cliente.
   El pago siempre va al CONTRATANTE.

✅ Confidencialidad total sobre precios,
   clientes y estructura del negocio.

✅ No puede vender servicios similares
   de la competencia mientras trabaje aquí.

✅ Meta mínima: 20 prospectos/semana.

━━━ DURACIÓN ━━━

Desde ${fDate(f.inicio)}, mensual renovable.
Terminación con 15 días de aviso por WhatsApp.

══════════════════════════════════
ACEPTACIÓN

Responder "ACEPTO" a este mensaje
confirma la aceptación de todos los términos.

NOVAModa Colombia
${f.nombre || "[Nombre del asesor]"} — C.C. ${f.cedula || "[Cédula]"}
══════════════════════════════════`;

  return (
    <div style={{ background: "#0a0a14", border: "1px solid #6b7280", borderRadius: 18, padding: 22 }}>
      <div style={{ color: "#aaa", fontSize: 10, fontWeight: 700, textTransform: "uppercase", letterSpacing: 2, marginBottom: 16 }}>📄 Generar acuerdo de trabajo</div>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10, marginBottom: 14 }}>
        {[["nombre","Nombre completo","Juan Carlos Pérez"],["cedula","Número de cédula","1234567890"]].map(([k,l,p]) => (
          <div key={k}>
            <div style={{ color: "#444", fontSize: 10, marginBottom: 5 }}>{l}</div>
            <input value={f[k]} onChange={e => set(k, e.target.value)} placeholder={p} style={{ width: "100%", background: "#060610", border: "1px solid #1a1a2a", borderRadius: 9, padding: "9px 12px", color: "#fff", fontSize: 13, outline: "none", fontFamily: "'DM Sans',sans-serif" }} />
          </div>
        ))}
        <div>
          <div style={{ color: "#444", fontSize: 10, marginBottom: 5 }}>Ciudad</div>
          <select value={f.ciudad} onChange={e => set("ciudad", e.target.value)} style={{ width: "100%", background: "#060610", border: "1px solid #1a1a2a", borderRadius: 9, padding: "9px 12px", color: "#fff", fontSize: 13, outline: "none", fontFamily: "'DM Sans',sans-serif" }}>
            {["Bogotá","Medellín","Cali","Barranquilla","Bucaramanga","Pereira","Otra"].map(c => <option key={c}>{c}</option>)}
          </select>
        </div>
        <div>
          <div style={{ color: "#444", fontSize: 10, marginBottom: 5 }}>Fecha inicio</div>
          <input type="date" value={f.inicio} onChange={e => set("inicio", e.target.value)} style={{ width: "100%", background: "#060610", border: "1px solid #1a1a2a", borderRadius: 9, padding: "9px 12px", color: "#fff", fontSize: 13, outline: "none", fontFamily: "'DM Sans',sans-serif" }} />
        </div>
      </div>
      <div style={{ background: "#060610", border: "1px solid #1a1a2a", borderRadius: 10, padding: 14, maxHeight: 200, overflowY: "auto", marginBottom: 12 }}>
        <pre style={{ color: "#666", fontSize: 11, lineHeight: 1.75, whiteSpace: "pre-wrap", fontFamily: "'DM Sans',sans-serif" }}>{acuerdo.substring(0,500)}...</pre>
      </div>
      <button onClick={() => { navigator.clipboard.writeText(acuerdo); setCopied(true); setTimeout(() => setCopied(false), 2500); }}
        style={{ width: "100%", background: copied ? "linear-gradient(135deg,#22c55e,#16a34a)" : "#1a1a2a", border: `1px solid ${copied ? "#22c55e44" : "#2a2a3a"}`, color: "#fff", borderRadius: 12, padding: "12px", cursor: "pointer", fontSize: 14, fontWeight: 800, fontFamily: "'DM Sans',sans-serif" }}>
        {copied ? "✅ ¡Copiado! Envía por WhatsApp al asesor" : "📋 Copiar acuerdo completo"}
      </button>
    </div>
  );
}

export default function GuiaAsesor() {
  const [moduloActivo, setModuloActivo] = useState(0);
  const [tab, setTab] = useState("guia");
  const modulo = MODULOS[moduloActivo];
  const pct = Math.round(((moduloActivo + 1) / MODULOS.length) * 100);

  return (
    <div style={{ minHeight: "100vh", background: "#05050d", color: "#fff", fontFamily: "'DM Sans', sans-serif" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@300;400;500;600;700;800;900&display=swap');
        *{box-sizing:border-box;margin:0;padding:0}
        ::-webkit-scrollbar{width:3px}::-webkit-scrollbar-track{background:#0a0a14}::-webkit-scrollbar-thumb{background:#ec489944;border-radius:2px}
        @keyframes fadeUp{from{opacity:0;transform:translateY(8px)}to{opacity:1;transform:translateY(0)}}
        @keyframes pulse{0%,100%{opacity:1}50%{opacity:.3}}
      `}</style>

      <div style={{ background: "#07070e", borderBottom: "1px solid #12121e", padding: "14px 28px", display: "flex", alignItems: "center", gap: 14 }}>
        <div style={{ width: 38, height: 38, borderRadius: 11, background: "linear-gradient(135deg,#ec4899,#f97316)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 20 }}>👥</div>
        <div>
          <div style={{ fontWeight: 900, fontSize: 17, letterSpacing: -0.5 }}>Guía para contratar asesores de ventas</div>
          <div style={{ color: "#444", fontSize: 12 }}>NOVAModa / NOVABusiness Colombia</div>
        </div>
      </div>

      <div style={{ background: "#07070e", borderBottom: "1px solid #12121e", padding: "0 28px", display: "flex", gap: 2 }}>
        {[["guia","📋","Guía completa"],["simulador","💰","Simulador"],["oferta","📢","Oferta de trabajo"],["acuerdo","📄","Acuerdo"]].map(([id,icon,label]) => (
          <button key={id} onClick={() => setTab(id)} style={{ background: "transparent", border: "none", borderBottom: `2px solid ${tab === id ? "#ec4899" : "transparent"}`, color: tab === id ? "#ec4899" : "#444", padding: "13px 18px", cursor: "pointer", fontSize: 13, fontWeight: tab === id ? 800 : 500, fontFamily: "'DM Sans',sans-serif", whiteSpace: "nowrap" }}>
            {icon} {label}
          </button>
        ))}
      </div>

      <div style={{ maxWidth: 1060, margin: "0 auto", padding: "28px 20px" }}>

        {tab === "guia" && (
          <div style={{ display: "flex", gap: 20, animation: "fadeUp .3s ease" }}>
            <div style={{ width: 215, flexShrink: 0 }}>
              <div style={{ color: "#333", fontSize: 10, textTransform: "uppercase", letterSpacing: 2, marginBottom: 10 }}>Módulos</div>
              <div style={{ display: "flex", flexDirection: "column", gap: 5, marginBottom: 14 }}>
                {MODULOS.map((m, i) => <ModuloCard key={m.id} modulo={m} isActive={moduloActivo === i} onClick={() => setModuloActivo(i)} />)}
              </div>
              <div style={{ height: 5, background: "#1a1a2a", borderRadius: 3, overflow: "hidden", marginBottom: 5 }}>
                <div style={{ height: "100%", width: `${pct}%`, background: "linear-gradient(90deg,#ec4899,#f97316)", borderRadius: 3, transition: "width .4s" }} />
              </div>
              <div style={{ color: "#333", fontSize: 10, textAlign: "center" }}>Módulo {moduloActivo + 1} de {MODULOS.length}</div>
            </div>

            <div style={{ flex: 1, animation: "fadeUp .2s ease" }}>
              <div style={{ background: "#0a0a14", border: `1px solid ${modulo.color}33`, borderRadius: 18, padding: 24, marginBottom: 14 }}>
                <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
                  <div style={{ width: 50, height: 50, borderRadius: 15, background: `${modulo.color}18`, border: `1px solid ${modulo.color}44`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 26, flexShrink: 0 }}>{modulo.icon}</div>
                  <div>
                    <div style={{ color: modulo.color, fontSize: 10, fontWeight: 700, textTransform: "uppercase", letterSpacing: 2, marginBottom: 3 }}>Módulo {modulo.id} de {MODULOS.length}</div>
                    <h2 style={{ fontSize: 20, fontWeight: 900, letterSpacing: -0.5, lineHeight: 1.2 }}>{modulo.titulo}</h2>
                    <p style={{ color: "#555", fontSize: 13, marginTop: 3 }}>{modulo.subtitulo}</p>
                  </div>
                </div>
              </div>

              {modulo.secciones.map((s, i) => <SeccionCard key={i} s={s} />)}

              <div style={{ display: "flex", gap: 10, marginTop: 8 }}>
                <button onClick={() => setModuloActivo(Math.max(0, moduloActivo - 1))} disabled={moduloActivo === 0}
                  style={{ background: "transparent", border: "1px solid #1a1a2a", color: moduloActivo === 0 ? "#222" : "#555", borderRadius: 12, padding: "12px 22px", cursor: moduloActivo === 0 ? "default" : "pointer", fontSize: 14, fontWeight: 700, fontFamily: "'DM Sans',sans-serif" }}>
                  ← Anterior
                </button>
                {moduloActivo < MODULOS.length - 1 ? (
                  <button onClick={() => setModuloActivo(moduloActivo + 1)}
                    style={{ flex: 1, background: `linear-gradient(135deg,${modulo.color},${modulo.color}cc)`, border: "none", color: "#fff", borderRadius: 12, padding: "12px", cursor: "pointer", fontSize: 14, fontWeight: 900, fontFamily: "'DM Sans',sans-serif" }}>
                    Siguiente →
                  </button>
                ) : (
                  <div style={{ flex: 1, background: "linear-gradient(135deg,#22c55e,#16a34a)", borderRadius: 12, padding: "12px", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 14, fontWeight: 900 }}>
                    🎉 ¡Listo para contratar tu primer asesor!
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {tab === "simulador" && (
          <div style={{ animation: "fadeUp .3s ease", maxWidth: 680 }}>
            <h2 style={{ fontSize: 24, fontWeight: 900, letterSpacing: -0.5, marginBottom: 6 }}>💰 Simulador de comisiones</h2>
            <p style={{ color: "#444", fontSize: 14, marginBottom: 22 }}>Ajusta los sliders y mira cuánto ganaría el asesor — y cuánto te costaría a ti.</p>
            <SimuladorComisiones />
            <div style={{ background: "#0a0a14", border: "1px solid #f59e0b22", borderRadius: 14, padding: 18, marginTop: 16 }}>
              <div style={{ color: "#f59e0b", fontWeight: 700, fontSize: 13, marginBottom: 10 }}>💡 Lo que significan los números</div>
              {[
                "El asesor empieza a ganar bien desde el primer mes si cierra 5+ clientes.",
                "Las renovaciones son ingreso pasivo — gana sin hacer nada nuevo cada mes.",
                "A ti te cuesta el 30% del primer mes. El 70% restante es tu ganancia neta.",
                "Con 10 clientes que renueven el asesor gana $290.000/mes sin cerrar nada nuevo — eso lo mantiene motivado.",
              ].map((t, i) => <div key={i} style={{ display: "flex", gap: 8, marginBottom: 6, fontSize: 13, color: "#666" }}><span style={{ color: "#f59e0b", flexShrink: 0 }}>✓</span>{t}</div>)}
            </div>
          </div>
        )}

        {tab === "oferta" && (
          <div style={{ animation: "fadeUp .3s ease", maxWidth: 680 }}>
            <h2 style={{ fontSize: 24, fontWeight: 900, letterSpacing: -0.5, marginBottom: 6 }}>📢 Oferta de trabajo lista</h2>
            <p style={{ color: "#444", fontSize: 14, marginBottom: 18 }}>Publícala hoy y empieza a recibir aplicaciones.</p>
            <div style={{ background: "#0a0a14", border: "1px solid #f59e0b22", borderRadius: 14, padding: 16, marginBottom: 16 }}>
              <div style={{ color: "#f59e0b", fontWeight: 700, fontSize: 13, marginBottom: 10 }}>📍 Dónde publicar HOY</div>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 }}>
                {[["📘","Grupos Facebook","Trabajo ventas Colombia"],["💼","LinkedIn","Asesor comercial digital"],["💻","Computrabajo","Asesor ventas comisiones"],["📸","Instagram Stories","Oferta directa a tu audiencia"]].map(([e,red,q]) => (
                  <div key={red} style={{ background: "#060610", borderRadius: 10, padding: "10px 12px", display: "flex", gap: 8 }}>
                    <span style={{ fontSize: 18 }}>{e}</span>
                    <div>
                      <div style={{ fontWeight: 700, fontSize: 12 }}>{red}</div>
                      <div style={{ color: "#444", fontSize: 10, marginTop: 1 }}>"{q}"</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            <GeneradorOferta />
          </div>
        )}

        {tab === "acuerdo" && (
          <div style={{ animation: "fadeUp .3s ease", maxWidth: 680 }}>
            <h2 style={{ fontSize: 24, fontWeight: 900, letterSpacing: -0.5, marginBottom: 6 }}>📄 Acuerdo de trabajo</h2>
            <p style={{ color: "#444", fontSize: 14, marginBottom: 16 }}>Genera y envía antes de que empiece. El "ACEPTO" por WhatsApp es tu respaldo.</p>
            <div style={{ background: "#22c55e0d", border: "1px solid #22c55e22", borderRadius: 12, padding: 14, marginBottom: 16 }}>
              <div style={{ color: "#22c55e", fontWeight: 700, fontSize: 13, marginBottom: 8 }}>✅ Pasos</div>
              {["Llena los datos del asesor.","Copia el acuerdo completo.","Pégalo en WhatsApp al asesor.","Pídele que responda 'ACEPTO'.","Toma captura de pantalla — ese es tu respaldo legal."].map((t, i) => (
                <div key={i} style={{ color: "#666", fontSize: 13, marginBottom: 4, display: "flex", gap: 8 }}>
                  <span style={{ color: "#22c55e", flexShrink: 0 }}>{i + 1}.</span>{t}
                </div>
              ))}
            </div>
            <AcuerdoTrabajo />
          </div>
        )}
      </div>
    </div>
  );
}
