import { useState, useEffect } from "react";

const COP = n => `$${new Intl.NumberFormat("es-CO").format(n)}`;
const load = (k, d) => { try { const v = localStorage.getItem(k); return v ? JSON.parse(v) : d; } catch { return d; } };
const save = (k, v) => { try { localStorage.setItem(k, JSON.stringify(v)); } catch {} };
const hoy = () => new Date().toLocaleDateString("es-CO", { day: "numeric", month: "long", year: "numeric" });

/* ══════════════════════════════════════
   CONTRATO
══════════════════════════════════════ */
function Contrato() {
  const [f, setF] = useState({ nombre: "", tienda: "", ciudad: "", nit: "", plan: "pro", precio: "290000", fecha: new Date().toISOString().split("T")[0], duracion: "mensual" });
  const [show, setShow] = useState(false);
  const [copied, setCopied] = useState(false);
  const set = (k, v) => setF(p => ({ ...p, [k]: v }));
  const planes = { basico: "200.000", pro: "290.000", premium: "420.000" };

  const contrato = `═══════════════════════════════════════
        CONTRATO DE SERVICIOS DIGITALES
           NOVAModa Colombia
═══════════════════════════════════════

Fecha: ${hoy()}
Número de contrato: NM-${Date.now().toString().slice(-6)}

PARTES DEL CONTRATO:

PROVEEDOR: NOVAModa Colombia
Servicio: Bot de ventas con inteligencia artificial

CLIENTE:
• Nombre / Razón social: ${f.nombre || "[Nombre del cliente]"}
• Nombre del negocio: ${f.tienda || "[Nombre de la tienda]"}
• Ciudad: ${f.ciudad || "[Ciudad]"}
• NIT / Cédula: ${f.nit || "[Documento]"}

═══════════════════════════════════════
1. DESCRIPCIÓN DEL SERVICIO
═══════════════════════════════════════

NOVAModa Colombia se compromete a:

✅ Configurar y mantener activo un bot de ventas 
   con inteligencia artificial (NOVA) para el 
   negocio del CLIENTE.

✅ Personalizar el bot con el catálogo, precios, 
   promociones y tono de comunicación del negocio.

✅ Mantener el servicio activo 24 horas al día, 
   7 días a la semana.

✅ Actualizar el catálogo cuando el CLIENTE lo 
   solicite (máximo 2 actualizaciones por mes 
   incluidas en el plan).

✅ Brindar soporte por WhatsApp en horario 
   8am - 8pm de lunes a sábado.

Plan contratado: ${f.plan.toUpperCase()}
Valor mensual: $${planes[f.plan]} COP
Modalidad de pago: ${f.duracion === "mensual" ? "Mensual" : "Anual"}

═══════════════════════════════════════
2. OBLIGACIONES DEL CLIENTE
═══════════════════════════════════════

El CLIENTE se compromete a:

📋 Suministrar información veraz y actualizada 
   sobre sus productos, precios y servicios.

💳 Realizar el pago de la mensualidad puntualmente 
   antes del vencimiento de cada período.

📱 Proporcionar un número de WhatsApp Business 
   dedicado al negocio (si aplica Plan Pro/Premium).

🔒 No compartir las credenciales de acceso al 
   sistema con terceros.

═══════════════════════════════════════
3. CONDICIONES ECONÓMICAS
═══════════════════════════════════════

• Valor mensual: $${planes[f.plan]} COP
• Forma de pago: Nequi, Daviplata o transferencia
• Fecha límite de pago: El mismo día de cada mes
  en que se activó el servicio

Penalidad por mora: Si el pago no se recibe dentro
de los 5 días hábiles siguientes a la fecha límite,
el servicio será suspendido automáticamente hasta
que el pago sea confirmado.

═══════════════════════════════════════
4. DURACIÓN Y CANCELACIÓN
═══════════════════════════════════════

• El contrato es mensual y se renueva 
  automáticamente cada período.

• El CLIENTE puede cancelar en cualquier momento
  con 5 días de anticipación antes del próximo 
  período de pago.

• NOVAModa Colombia puede terminar el contrato 
  con 30 días de anticipación o de inmediato por 
  uso indebido del servicio.

• No hay reembolso de períodos ya pagados excepto
  por falla técnica comprobable del sistema.

═══════════════════════════════════════
5. GARANTÍA
═══════════════════════════════════════

NOVAModa Colombia ofrece garantía de satisfacción
de 30 días para nuevos clientes. Si durante el 
primer mes el servicio no cumple lo prometido,
se realizará devolución completa del pago.

═══════════════════════════════════════
6. PROPIEDAD DE LA INFORMACIÓN
═══════════════════════════════════════

• El catálogo, precios e información del negocio 
  son propiedad del CLIENTE.

• NOVAModa Colombia no compartirá información 
  confidencial del negocio con terceros.

• Las conversaciones del bot son procesadas por
  la plataforma de IA Anthropic bajo sus propias
  políticas de privacidad.

═══════════════════════════════════════
ACEPTACIÓN DEL CONTRATO
═══════════════════════════════════════

Al responder "ACEPTO" a este mensaje, el CLIENTE
declara haber leído, entendido y aceptado todos 
los términos de este contrato.

Proveedor: NOVAModa Colombia
Cliente: ${f.nombre || "[Nombre del cliente]"}
Fecha de aceptación: ${hoy()}

═══════════════════════════════════════
   ¡Bienvenido a NOVAModa! 🚀
   En 24 horas tu bot estará activo.
═══════════════════════════════════════`;

  const inp = { width: "100%", background: "#0a0a12", border: "1px solid #1e1e2e", borderRadius: 10, padding: "10px 14px", color: "#fff", fontSize: 13, outline: "none", fontFamily: "'DM Sans',sans-serif", boxSizing: "border-box" };
  const lbl = { color: "#555", fontSize: 11, textTransform: "uppercase", letterSpacing: 1.5, marginBottom: 5, display: "block" };

  return (
    <div>
      <div style={{ marginBottom: 20 }}>
        <div style={{ color: "#22c55e", fontSize: 11, fontWeight: 700, letterSpacing: 3, textTransform: "uppercase", marginBottom: 6 }}>Protege tu negocio</div>
        <h2 style={{ fontSize: 24, fontWeight: 900, letterSpacing: -0.5, marginBottom: 6 }}>Generador de contrato 📄</h2>
        <p style={{ color: "#444", fontSize: 14 }}>Completa los datos del cliente y genera el contrato listo para enviar por WhatsApp</p>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20 }}>
        {/* Formulario */}
        <div style={{ background: "#0a0a14", border: "1px solid #1a1a2a", borderRadius: 18, padding: 24 }}>
          <div style={{ color: "#22c55e", fontSize: 11, fontWeight: 700, letterSpacing: 2, textTransform: "uppercase", marginBottom: 16 }}>Datos del cliente</div>
          <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
            <div><label style={lbl}>Nombre completo del dueño</label><input style={inp} value={f.nombre} onChange={e => set("nombre", e.target.value)} placeholder="Ej: María Fernanda Gómez" /></div>
            <div><label style={lbl}>Nombre de la tienda</label><input style={inp} value={f.tienda} onChange={e => set("tienda", e.target.value)} placeholder="Ej: Boutique Valentina" /></div>
            <div><label style={lbl}>Ciudad</label>
              <select style={inp} value={f.ciudad} onChange={e => set("ciudad", e.target.value)}>
                <option value="">Seleccionar...</option>
                {["Bogotá","Medellín","Cali","Barranquilla","Cartagena","Bucaramanga","Pereira","Manizales","Otra"].map(c => <option key={c}>{c}</option>)}
              </select>
            </div>
            <div><label style={lbl}>Cédula o NIT del negocio</label><input style={inp} value={f.nit} onChange={e => set("nit", e.target.value)} placeholder="Ej: 1234567890" /></div>
            <div><label style={lbl}>Plan contratado</label>
              <select style={inp} value={f.plan} onChange={e => set("plan", e.target.value)}>
                <option value="basico">Básico — $200.000/mes</option>
                <option value="pro">Pro — $290.000/mes</option>
                <option value="premium">Premium — $420.000/mes</option>
              </select>
            </div>
          </div>

          <div style={{ marginTop: 20, background: "#22c55e0d", border: "1px solid #22c55e22", borderRadius: 12, padding: 14 }}>
            <div style={{ color: "#22c55e", fontWeight: 700, fontSize: 12, marginBottom: 8 }}>📋 Cómo usar el contrato</div>
            <div style={{ color: "#666", fontSize: 12, lineHeight: 1.7 }}>
              1. Llena los datos del cliente<br />
              2. Genera el contrato<br />
              3. Cópialo y pégalo en WhatsApp al cliente<br />
              4. Espera que responda "ACEPTO"<br />
              5. Toma captura de pantalla del ACEPTO<br />
              6. Esa captura es tu respaldo legal
            </div>
          </div>
        </div>

        {/* Preview */}
        <div style={{ background: "#0a0a14", border: "1px solid #1a1a2a", borderRadius: 18, padding: 24, display: "flex", flexDirection: "column" }}>
          <div style={{ color: "#22c55e", fontSize: 11, fontWeight: 700, letterSpacing: 2, textTransform: "uppercase", marginBottom: 14 }}>Vista previa</div>
          <div style={{ flex: 1, overflowY: "auto", maxHeight: 380, marginBottom: 14 }}>
            <pre style={{ color: "#888", fontSize: 11, lineHeight: 1.7, whiteSpace: "pre-wrap", fontFamily: "'DM Sans',sans-serif" }}>{contrato.substring(0, 800)}...</pre>
          </div>
          <div style={{ display: "flex", gap: 10 }}>
            <button onClick={() => setShow(true)} style={{ flex: 1, background: "transparent", border: "1px solid #22c55e44", color: "#22c55e", borderRadius: 12, padding: "11px", cursor: "pointer", fontSize: 13, fontWeight: 700, fontFamily: "'DM Sans',sans-serif" }}>
              👁️ Ver completo
            </button>
            <button onClick={() => { navigator.clipboard.writeText(contrato); setCopied(true); setTimeout(() => setCopied(false), 2500); }}
              style={{ flex: 2, background: copied ? "linear-gradient(135deg,#16a34a,#22c55e)" : "linear-gradient(135deg,#22c55e,#16a34a)", border: "none", color: "#fff", borderRadius: 12, padding: "11px", cursor: "pointer", fontSize: 13, fontWeight: 800, fontFamily: "'DM Sans',sans-serif" }}>
              {copied ? "✅ ¡Copiado! Pega en WhatsApp" : "📋 Copiar contrato completo"}
            </button>
          </div>
        </div>
      </div>

      {show && (
        <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,.92)", zIndex: 999, display: "flex", alignItems: "center", justifyContent: "center", padding: 20, backdropFilter: "blur(10px)" }}>
          <div style={{ width: "100%", maxWidth: 560, maxHeight: "90vh", background: "#08080f", border: "1px solid #22c55e33", borderRadius: 24, overflow: "hidden", display: "flex", flexDirection: "column" }}>
            <div style={{ padding: "16px 22px", borderBottom: "1px solid #1a1a2a", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <span style={{ fontWeight: 800, fontSize: 15 }}>Contrato completo</span>
              <button onClick={() => setShow(false)} style={{ background: "#ffffff11", border: "none", color: "#666", borderRadius: 8, width: 32, height: 32, cursor: "pointer", fontSize: 16 }}>✕</button>
            </div>
            <div style={{ flex: 1, overflowY: "auto", padding: 22 }}>
              <pre style={{ color: "#ccc", fontSize: 12, lineHeight: 1.8, whiteSpace: "pre-wrap", fontFamily: "'DM Sans',sans-serif" }}>{contrato}</pre>
            </div>
            <div style={{ padding: "14px 22px", borderTop: "1px solid #1a1a2a" }}>
              <button onClick={() => { navigator.clipboard.writeText(contrato); setCopied(true); setShow(false); setTimeout(() => setCopied(false), 2500); }}
                style={{ width: "100%", background: "linear-gradient(135deg,#22c55e,#16a34a)", border: "none", color: "#fff", borderRadius: 12, padding: "13px", cursor: "pointer", fontSize: 14, fontWeight: 800, fontFamily: "'DM Sans',sans-serif" }}>
                📋 Copiar y cerrar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

/* ══════════════════════════════════════
   PROSPECCIÓN INSTAGRAM
══════════════════════════════════════ */
function Prospeccion() {
  const [prospectos, setProspectos] = useState(() => load("nova_prospectos", []));
  const [form, setForm] = useState({ instagram: "", tienda: "", ciudad: "Bogotá", tipo: "boutique", seguidores: "", estado: "sin_contactar", notas: "" });
  const [filtro, setFiltro] = useState("todos");
  const [copiedId, setCopiedId] = useState(null);
  const [showRutina, setShowRutina] = useState(false);

  useEffect(() => { save("nova_prospectos", prospectos); }, [prospectos]);

  const agregar = () => {
    if (!form.instagram) return;
    setProspectos(p => [{ ...form, id: Date.now(), fecha: new Date().toISOString() }, ...p]);
    setForm({ instagram: "", tienda: "", ciudad: "Bogotá", tipo: "boutique", seguidores: "", estado: "sin_contactar", notas: "" });
  };

  const cambiarEstado = (id, estado) => setProspectos(p => p.map(x => x.id === id ? { ...x, estado } : x));
  const eliminar = (id) => setProspectos(p => p.filter(x => x.id !== id));

  const estados = {
    sin_contactar: { label: "Sin contactar", color: "#6b7280" },
    contactado: { label: "Contactado", color: "#3b82f6" },
    respondio: { label: "Respondió", color: "#f59e0b" },
    demo_hecha: { label: "Demo hecha", color: "#a855f7" },
    cliente: { label: "¡Cliente! 🎉", color: "#22c55e" },
    no_intereso: { label: "No interesó", color: "#ef4444" },
  };

  const filtrados = filtro === "todos" ? prospectos : prospectos.filter(p => p.estado === filtro);

  const mensajeFrio = (p) => `Hola! 👋 Vi tu tienda ${p.tienda || p.instagram} en Instagram y me encantó tu estilo 👗

Tengo una pregunta rápida: cuando tus clientas te escriben de noche o un finde preguntando por tallas y precios, ¿alcanzas a responder todas?

Creamos NOVA, una asesora de moda con IA que responde por tu tienda 24/7 en WhatsApp e Instagram. Boutiques en ${p.ciudad} han aumentado ventas hasta 40% en el primer mes.

¿Tienes 10 minutos esta semana para una demo gratis? 🚀`;

  const copy = (text, id) => { navigator.clipboard.writeText(text); setCopiedId(id); setTimeout(() => setCopiedId(null), 2500); };

  const inp = { background: "#0a0a12", border: "1px solid #1e1e2e", borderRadius: 10, padding: "9px 13px", color: "#fff", fontSize: 13, outline: "none", fontFamily: "'DM Sans',sans-serif", boxSizing: "border-box" };

  const stats = Object.entries(estados).map(([k, v]) => ({ ...v, key: k, count: prospectos.filter(p => p.estado === k).length }));

  return (
    <div>
      <div style={{ marginBottom: 20 }}>
        <div style={{ color: "#3b82f6", fontSize: 11, fontWeight: 700, letterSpacing: 3, textTransform: "uppercase", marginBottom: 6 }}>Ventas activas</div>
        <h2 style={{ fontSize: 24, fontWeight: 900, letterSpacing: -0.5, marginBottom: 6 }}>Sistema de prospección Instagram 📱</h2>
        <p style={{ color: "#444", fontSize: 14 }}>Registra y sigue cada tienda que contactas. Nunca pierdas un prospecto.</p>
      </div>

      {/* Stats pipeline */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(6,1fr)", gap: 8, marginBottom: 20 }}>
        {stats.map(s => (
          <div key={s.key} onClick={() => setFiltro(s.key === filtro ? "todos" : s.key)} style={{ background: filtro === s.key ? `${s.color}18` : "#0a0a14", border: `1px solid ${filtro === s.key ? s.color + "55" : "#1a1a2a"}`, borderRadius: 12, padding: "12px 10px", textAlign: "center", cursor: "pointer", transition: "all .2s" }}>
            <div style={{ color: s.color, fontWeight: 900, fontSize: 22 }}>{s.count}</div>
            <div style={{ color: "#444", fontSize: 10, marginTop: 3, lineHeight: 1.3 }}>{s.label}</div>
          </div>
        ))}
      </div>

      {/* Rutina diaria */}
      <div style={{ background: "#3b82f608", border: "1px solid #3b82f622", borderRadius: 14, padding: 16, marginBottom: 20 }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", cursor: "pointer" }} onClick={() => setShowRutina(r => !r)}>
          <div style={{ fontWeight: 800, fontSize: 14 }}>📅 Rutina diaria de prospección</div>
          <span style={{ color: "#3b82f6", fontSize: 20, transition: "transform .2s", transform: showRutina ? "rotate(90deg)" : "none" }}>›</span>
        </div>
        {showRutina && (
          <div style={{ marginTop: 14, display: "flex", flexDirection: "column", gap: 10 }}>
            {[
              { hora: "9:00 AM", accion: "Busca 10 tiendas nuevas en Instagram", como: "Busca: 'boutique bogotá', 'ropa mujer medellín', 'tienda streetwear cali'. Filtra las que tengan 500-50.000 seguidores y publiquen seguido pero tengan preguntas sin responder en comentarios.", icon: "🔍" },
              { hora: "9:30 AM", accion: "Registra las 10 tiendas aquí", como: "Ingresa el @instagram, nombre de la tienda y ciudad. Estado: 'Sin contactar'.", icon: "📝" },
              { hora: "10:00 AM", accion: "Envía mensajes a las 10 tiendas", como: "Para cada una: genera el mensaje personalizado, cópialo y envíalo por Instagram DM o WhatsApp si lo tienen en la bio. Cambia estado a 'Contactado'.", icon: "📲" },
              { hora: "11:00 AM", accion: "Revisa respuestas del día anterior", como: "Las que respondieron: cámbialas a 'Respondió' y agenda la demo. Las que no respondieron en 48h: manda el follow-up.", icon: "💬" },
              { hora: "3:00 PM", accion: "Haz demos a los que aceptaron", como: "Abre novamoda-colombia, sección Demo, escoge el tipo de tienda y muéstrasela. Deja que ELLOS escriban al bot.", icon: "🤖" },
              { hora: "5:00 PM", accion: "Cierra ventas y registra clientes nuevos", como: "Los que dijeron sí: cobra por Nequi, crea el cliente en el panel admin, configura el bot. Cambia estado a '¡Cliente!'.", icon: "🎉" },
            ].map((r, i) => (
              <div key={i} style={{ display: "flex", gap: 12, alignItems: "flex-start" }}>
                <div style={{ background: "#3b82f618", border: "1px solid #3b82f633", borderRadius: 10, padding: "6px 10px", fontSize: 11, color: "#3b82f6", fontWeight: 700, flexShrink: 0, whiteSpace: "nowrap" }}>{r.hora}</div>
                <div>
                  <div style={{ display: "flex", gap: 6, alignItems: "center", marginBottom: 3 }}>
                    <span style={{ fontSize: 16 }}>{r.icon}</span>
                    <span style={{ fontWeight: 700, fontSize: 13 }}>{r.accion}</span>
                  </div>
                  <div style={{ color: "#555", fontSize: 12, lineHeight: 1.6 }}>{r.como}</div>
                </div>
              </div>
            ))}
            <div style={{ background: "#22c55e0d", border: "1px solid #22c55e22", borderRadius: 10, padding: 12, marginTop: 4 }}>
              <div style={{ color: "#22c55e", fontSize: 12, fontWeight: 700 }}>💡 Meta diaria: 10 contactos → 2-3 demos → 1 cliente nuevo</div>
              <div style={{ color: "#555", fontSize: 12, marginTop: 4 }}>Con esta rutina de lunes a viernes, en 1 mes tienes 20+ clientes activos.</div>
            </div>
          </div>
        )}
      </div>

      {/* Agregar prospecto */}
      <div style={{ background: "#0a0a14", border: "1px solid #1a1a2a", borderRadius: 16, padding: 20, marginBottom: 16 }}>
        <div style={{ color: "#3b82f6", fontSize: 11, fontWeight: 700, letterSpacing: 2, textTransform: "uppercase", marginBottom: 14 }}>Agregar prospecto</div>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr 1fr auto", gap: 10, alignItems: "end" }}>
          <div>
            <div style={{ color: "#444", fontSize: 10, marginBottom: 5 }}>@Instagram</div>
            <input style={{ ...inp, width: "100%" }} value={form.instagram} onChange={e => setForm(p => ({ ...p, instagram: e.target.value }))} placeholder="@boutique_ejemplo" />
          </div>
          <div>
            <div style={{ color: "#444", fontSize: 10, marginBottom: 5 }}>Nombre tienda</div>
            <input style={{ ...inp, width: "100%" }} value={form.tienda} onChange={e => setForm(p => ({ ...p, tienda: e.target.value }))} placeholder="Boutique Valentina" />
          </div>
          <div>
            <div style={{ color: "#444", fontSize: 10, marginBottom: 5 }}>Ciudad</div>
            <select style={{ ...inp, width: "100%" }} value={form.ciudad} onChange={e => setForm(p => ({ ...p, ciudad: e.target.value }))}>
              {["Bogotá","Medellín","Cali","Barranquilla","Cartagena","Bucaramanga","Pereira","Otra"].map(c => <option key={c}>{c}</option>)}
            </select>
          </div>
          <div>
            <div style={{ color: "#444", fontSize: 10, marginBottom: 5 }}>Tipo</div>
            <select style={{ ...inp, width: "100%" }} value={form.tipo} onChange={e => setForm(p => ({ ...p, tipo: e.target.value }))}>
              <option value="boutique">Boutique</option>
              <option value="streetwear">Streetwear</option>
              <option value="multimarca">Multimarca</option>
              <option value="online">Solo online</option>
            </select>
          </div>
          <button onClick={agregar} style={{ background: "linear-gradient(135deg,#3b82f6,#2563eb)", border: "none", color: "#fff", borderRadius: 10, padding: "9px 18px", cursor: "pointer", fontSize: 14, fontWeight: 900, fontFamily: "'DM Sans',sans-serif", height: 40 }}>+</button>
        </div>
      </div>

      {/* Lista prospectos */}
      <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
        {filtrados.length === 0 && (
          <div style={{ textAlign: "center", padding: 40, color: "#333" }}>
            <div style={{ fontSize: 32, marginBottom: 10 }}>📱</div>
            <div style={{ fontSize: 14 }}>{filtro === "todos" ? "Agrega tu primer prospecto arriba" : "No hay prospectos en este estado"}</div>
          </div>
        )}
        {filtrados.map(p => (
          <div key={p.id} style={{ background: "#0a0a14", border: `1px solid ${estados[p.estado].color}22`, borderRadius: 14, padding: "14px 18px", display: "flex", alignItems: "center", gap: 12 }}>
            <div style={{ width: 38, height: 38, borderRadius: 10, background: "#3b82f618", border: "1px solid #3b82f633", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 18, flexShrink: 0 }}>👗</div>
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 3 }}>
                <span style={{ fontWeight: 800, fontSize: 13 }}>{p.tienda || p.instagram}</span>
                <span style={{ color: "#3b82f6", fontSize: 12 }}>{p.instagram}</span>
                <span style={{ color: "#444", fontSize: 11 }}>· {p.ciudad}</span>
              </div>
              <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
                {Object.entries(estados).map(([k, v]) => (
                  <button key={k} onClick={() => cambiarEstado(p.id, k)} style={{ background: p.estado === k ? `${v.color}22` : "transparent", border: `1px solid ${p.estado === k ? v.color + "55" : "#1a1a2a"}`, color: p.estado === k ? v.color : "#333", borderRadius: 20, padding: "2px 9px", cursor: "pointer", fontSize: 10, fontWeight: p.estado === k ? 700 : 400, fontFamily: "'DM Sans',sans-serif", transition: "all .15s" }}>
                    {v.label}
                  </button>
                ))}
              </div>
            </div>
            <div style={{ display: "flex", gap: 6, flexShrink: 0 }}>
              <button onClick={() => copy(mensajeFrio(p), p.id)} style={{ background: copiedId === p.id ? "#22c55e18" : "#3b82f618", border: `1px solid ${copiedId === p.id ? "#22c55e44" : "#3b82f633"}`, color: copiedId === p.id ? "#22c55e" : "#3b82f6", borderRadius: 9, padding: "6px 12px", cursor: "pointer", fontSize: 11, fontWeight: 700, fontFamily: "'DM Sans',sans-serif" }}>
                {copiedId === p.id ? "✓ Copiado" : "📋 Mensaje"}
              </button>
              <button onClick={() => eliminar(p.id)} style={{ background: "#ef444412", border: "1px solid #ef444422", color: "#ef4444", borderRadius: 9, width: 32, height: 32, cursor: "pointer", fontSize: 13 }}>🗑</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ══════════════════════════════════════
   CASOS DE ÉXITO
══════════════════════════════════════ */
function CasosExito() {
  const [casos, setCasos] = useState(() => load("nova_casos", [
    { id: 1, tienda: "Luisa Fernanda Boutique", ciudad: "Bogotá", tipo: "boutique", mensajes: 1240, ventas: 89, ingresos: 12450000, ahorro: 40, mes: "Mayo 2025", testimonio: "En el primer mes el bot cerró 89 ventas que yo nunca hubiera podido atender. Ya recuperé 6 meses de suscripción.", foto: "👗" },
    { id: 2, tienda: "UrbanFlow Store", ciudad: "Medellín", tipo: "streetwear", mensajes: 890, ventas: 67, ingresos: 8950000, ahorro: 35, mes: "Mayo 2025", testimonio: "Los domingos el bot toma pedidos solo mientras yo descanso. Ya no pierdo ni una venta.", foto: "🔥" },
  ]));
  const [form, setForm] = useState({ tienda: "", ciudad: "Bogotá", tipo: "boutique", mensajes: "", ventas: "", ingresos: "", ahorro: "", mes: "", testimonio: "", foto: "👗" });
  const [editId, setEditId] = useState(null);
  const [copiedId, setCopiedId] = useState(null);

  useEffect(() => { save("nova_casos", casos); }, [casos]);

  const set = (k, v) => setForm(p => ({ ...p, [k]: v }));

  const guardar = () => {
    if (!form.tienda) return;
    if (editId) {
      setCasos(p => p.map(c => c.id === editId ? { ...form, id: editId } : c));
      setEditId(null);
    } else {
      setCasos(p => [...p, { ...form, id: Date.now() }]);
    }
    setForm({ tienda: "", ciudad: "Bogotá", tipo: "boutique", mensajes: "", ventas: "", ingresos: "", ahorro: "", mes: "", testimonio: "", foto: "👗" });
  };

  const editar = (c) => { setForm(c); setEditId(c.id); };
  const eliminar = (id) => setCasos(p => p.filter(c => c.id !== id));

  const generarPost = (c) => `✨ RESULTADO REAL — ${c.tienda}
📍 ${c.ciudad}

Este mes, el bot NOVA de ${c.tienda} logró:

💬 ${Number(c.mensajes).toLocaleString("es-CO")} mensajes respondidos automáticamente
🛍️ ${c.ventas} ventas cerradas por NOVA sola
💰 ${COP(Number(c.ingresos))} COP en ventas generadas
⏰ ${c.ahorro}% del tiempo del dueño liberado

"${c.testimonio}"

— ${c.tienda}, ${c.ciudad}

¿Tu tienda podría tener estos resultados?
Escríbenos y te hacemos una demo gratis 🚀

#NOVAModa #BotDeVentas #TiendasColombia #ModaColombia`;

  const inp = { background: "#0a0a12", border: "1px solid #1e1e2e", borderRadius: 10, padding: "9px 13px", color: "#fff", fontSize: 13, outline: "none", fontFamily: "'DM Sans',sans-serif", boxSizing: "border-box", width: "100%" };

  return (
    <div>
      <div style={{ marginBottom: 20 }}>
        <div style={{ color: "#a855f7", fontSize: 11, fontWeight: 700, letterSpacing: 3, textTransform: "uppercase", marginBottom: 6 }}>Prueba social</div>
        <h2 style={{ fontSize: 24, fontWeight: 900, letterSpacing: -0.5, marginBottom: 6 }}>Casos de éxito y métricas 📊</h2>
        <p style={{ color: "#444", fontSize: 14 }}>Registra los resultados de tus clientes. Genera posts para Instagram. Tu mejor herramienta de ventas.</p>
      </div>

      {/* Registrar caso */}
      <div style={{ background: "#0a0a14", border: "1px solid #a855f722", borderRadius: 18, padding: 22, marginBottom: 20 }}>
        <div style={{ color: "#a855f7", fontSize: 11, fontWeight: 700, letterSpacing: 2, textTransform: "uppercase", marginBottom: 14 }}>{editId ? "Editar caso" : "Registrar nuevo resultado"}</div>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 12, marginBottom: 12 }}>
          <div><div style={{ color: "#444", fontSize: 10, marginBottom: 5 }}>Nombre tienda</div><input style={inp} value={form.tienda} onChange={e => set("tienda", e.target.value)} placeholder="Boutique Valentina" /></div>
          <div><div style={{ color: "#444", fontSize: 10, marginBottom: 5 }}>Ciudad</div>
            <select style={inp} value={form.ciudad} onChange={e => set("ciudad", e.target.value)}>
              {["Bogotá","Medellín","Cali","Barranquilla","Otra"].map(c => <option key={c}>{c}</option>)}
            </select>
          </div>
          <div><div style={{ color: "#444", fontSize: 10, marginBottom: 5 }}>Mes</div><input style={inp} value={form.mes} onChange={e => set("mes", e.target.value)} placeholder="Mayo 2025" /></div>
          <div><div style={{ color: "#444", fontSize: 10, marginBottom: 5 }}>Mensajes respondidos</div><input style={inp} type="number" value={form.mensajes} onChange={e => set("mensajes", e.target.value)} placeholder="1240" /></div>
          <div><div style={{ color: "#444", fontSize: 10, marginBottom: 5 }}>Ventas cerradas</div><input style={inp} type="number" value={form.ventas} onChange={e => set("ventas", e.target.value)} placeholder="89" /></div>
          <div><div style={{ color: "#444", fontSize: 10, marginBottom: 5 }}>Ingresos generados (COP)</div><input style={inp} type="number" value={form.ingresos} onChange={e => set("ingresos", e.target.value)} placeholder="12450000" /></div>
        </div>
        <div style={{ marginBottom: 12 }}>
          <div style={{ color: "#444", fontSize: 10, marginBottom: 5 }}>Testimonio del cliente (sus palabras exactas)</div>
          <textarea style={{ ...inp, height: 70, resize: "vertical" }} value={form.testimonio} onChange={e => set("testimonio", e.target.value)} placeholder="En el primer mes NOVA cerró 89 ventas que yo nunca hubiera podido atender..." />
        </div>
        <button onClick={guardar} style={{ background: "linear-gradient(135deg,#a855f7,#9333ea)", border: "none", color: "#fff", borderRadius: 12, padding: "11px 24px", cursor: "pointer", fontSize: 14, fontWeight: 800, fontFamily: "'DM Sans',sans-serif" }}>
          {editId ? "💾 Actualizar caso" : "✅ Registrar resultado"}
        </button>
      </div>

      {/* Lista de casos */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(2,1fr)", gap: 16 }}>
        {casos.map(c => (
          <div key={c.id} style={{ background: "#0a0a14", border: "1px solid #a855f722", borderRadius: 18, padding: 24 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 16 }}>
              <div style={{ width: 46, height: 46, borderRadius: 14, background: "#a855f718", border: "1px solid #a855f733", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 24 }}>{c.foto || "👗"}</div>
              <div>
                <div style={{ fontWeight: 800, fontSize: 15 }}>{c.tienda}</div>
                <div style={{ color: "#a855f7", fontSize: 12, fontWeight: 600 }}>{c.ciudad} · {c.mes}</div>
              </div>
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8, marginBottom: 16 }}>
              {[
                { l: "Mensajes respondidos", v: Number(c.mensajes).toLocaleString("es-CO"), e: "💬", c: "#3b82f6" },
                { l: "Ventas cerradas", v: c.ventas, e: "🛍️", c: "#22c55e" },
                { l: "Ingresos generados", v: COP(Number(c.ingresos)), e: "💰", c: "#f59e0b" },
                { l: "Tiempo liberado", v: `${c.ahorro}%`, e: "⏰", c: "#a855f7" },
              ].map(m => (
                <div key={m.l} style={{ background: "#060610", border: `1px solid ${m.c}18`, borderRadius: 10, padding: "10px 12px" }}>
                  <div style={{ color: m.c, fontWeight: 900, fontSize: 18 }}>{m.v}</div>
                  <div style={{ color: "#333", fontSize: 10, marginTop: 2 }}>{m.l}</div>
                </div>
              ))}
            </div>

            {c.testimonio && (
              <div style={{ background: "#a855f70d", border: "1px solid #a855f722", borderRadius: 10, padding: 12, marginBottom: 14 }}>
                <div style={{ color: "#888", fontSize: 12, lineHeight: 1.7, fontStyle: "italic" }}>"{c.testimonio}"</div>
              </div>
            )}

            <div style={{ display: "flex", gap: 8 }}>
              <button onClick={() => { navigator.clipboard.writeText(generarPost(c)); setCopiedId(c.id); setTimeout(() => setCopiedId(null), 2500); }}
                style={{ flex: 2, background: copiedId === c.id ? "#22c55e18" : "#a855f718", border: `1px solid ${copiedId === c.id ? "#22c55e44" : "#a855f733"}`, color: copiedId === c.id ? "#22c55e" : "#a855f7", borderRadius: 10, padding: "9px", cursor: "pointer", fontSize: 12, fontWeight: 800, fontFamily: "'DM Sans',sans-serif" }}>
                {copiedId === c.id ? "✓ Post copiado" : "📸 Copiar post Instagram"}
              </button>
              <button onClick={() => editar(c)} style={{ background: "#ffffff0a", border: "1px solid #1e1e2e", color: "#666", borderRadius: 10, width: 36, cursor: "pointer", fontSize: 14 }}>✏️</button>
              <button onClick={() => eliminar(c.id)} style={{ background: "#ef444411", border: "1px solid #ef444422", color: "#ef4444", borderRadius: 10, width: 36, cursor: "pointer", fontSize: 13 }}>🗑</button>
            </div>
          </div>
        ))}
      </div>

      <div style={{ background: "#a855f70d", border: "1px solid #a855f722", borderRadius: 14, padding: 18, marginTop: 16 }}>
        <div style={{ color: "#a855f7", fontWeight: 700, fontSize: 13, marginBottom: 8 }}>🧠 Cómo usar los casos de éxito para vender más</div>
        <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
          {[
            "Pide permiso al cliente antes de publicar sus datos. La mayoría acepta si les dices que los harás famosos 😄",
            "El post generado está listo para Instagram y WhatsApp. Úsalo 2-3 veces por semana en tus redes.",
            "Cuando hables con un prospecto de boutique, muéstrale el caso de otra boutique. La prueba social específica vende 5x más.",
            "Con 5 casos documentados tienes suficiente contenido para llenar un mes de publicaciones.",
          ].map((t, i) => (
            <div key={i} style={{ display: "flex", gap: 8, fontSize: 13, color: "#666" }}>
              <span style={{ color: "#a855f7", flexShrink: 0 }}>✓</span><span>{t}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

/* ══════════════════════════════════════
   RUTINA SEMANAL
══════════════════════════════════════ */
function RutinaSemanal() {
  const [checks, setChecks] = useState(() => load("nova_checks", {}));
  const semana = ["Lunes","Martes","Miércoles","Jueves","Viernes","Sábado"];

  const toggle = (k) => {
    const nuevo = { ...checks, [k]: !checks[k] };
    setChecks(nuevo);
    save("nova_checks", nuevo);
  };

  const resetSemana = () => { setChecks({}); save("nova_checks", {}); };

  const tareas = {
    ventas: {
      label: "Ventas", color: "#3b82f6",
      items: [
        { id: "v1", t: "Buscar 10 tiendas nuevas en Instagram" },
        { id: "v2", t: "Enviar mensajes a los 10 prospectos del día" },
        { id: "v3", t: "Hacer follow-up a prospectos de hace 2 días" },
        { id: "v4", t: "Hacer demo a quien aceptó esta semana" },
      ]
    },
    cobros: {
      label: "Cobros", color: "#22c55e",
      items: [
        { id: "c1", t: "Revisar qué clientes vencen en 5 días" },
        { id: "c2", t: "Enviar recordatorios de pago" },
        { id: "c3", t: "Confirmar pagos recibidos y marcar en sistema" },
        { id: "c4", t: "Enviar recibo a los que pagaron" },
      ]
    },
    operaciones: {
      label: "Operaciones", color: "#f59e0b",
      items: [
        { id: "o1", t: "Revisar que todos los bots estén respondiendo bien" },
        { id: "o2", t: "Atender solicitudes de actualización de catálogo" },
        { id: "o3", t: "Verificar saldo en cuenta Anthropic" },
        { id: "o4", t: "Revisar logs de errores en Vercel" },
      ]
    },
    crecimiento: {
      label: "Crecimiento", color: "#a855f7",
      items: [
        { id: "g1", t: "Publicar 1 caso de éxito en Instagram" },
        { id: "g2", t: "Pedir referidos a 2 clientes satisfechos" },
        { id: "g3", t: "Registrar métricas de la semana" },
        { id: "g4", t: "Identificar qué funcionó y qué mejorar" },
      ]
    }
  };

  const totalTareas = Object.values(tareas).reduce((s, g) => s + g.items.length, 0) * semana.length;
  const completadas = Object.values(checks).filter(Boolean).length;
  const pct = Math.round((completadas / totalTareas) * 100);

  return (
    <div>
      <div style={{ marginBottom: 20 }}>
        <div style={{ color: "#f59e0b", fontSize: 11, fontWeight: 700, letterSpacing: 3, textTransform: "uppercase", marginBottom: 6 }}>Productividad</div>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <h2 style={{ fontSize: 24, fontWeight: 900, letterSpacing: -0.5 }}>Rutina semanal ✅</h2>
          <button onClick={resetSemana} style={{ background: "transparent", border: "1px solid #1e1e2e", color: "#444", borderRadius: 10, padding: "7px 16px", cursor: "pointer", fontSize: 12, fontFamily: "'DM Sans',sans-serif" }}>
            🔄 Nueva semana
          </button>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 12, marginTop: 12 }}>
          <div style={{ flex: 1, height: 8, background: "#1a1a2a", borderRadius: 4, overflow: "hidden" }}>
            <div style={{ height: "100%", width: `${pct}%`, background: "linear-gradient(90deg,#f59e0b,#22c55e)", borderRadius: 4, transition: "width .4s" }} />
          </div>
          <span style={{ color: "#f59e0b", fontWeight: 800, fontSize: 14, flexShrink: 0 }}>{pct}% esta semana</span>
        </div>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 14 }}>
        {semana.map(dia => (
          <div key={dia} style={{ background: "#0a0a14", border: "1px solid #1a1a2a", borderRadius: 16, padding: 18 }}>
            <div style={{ fontWeight: 800, fontSize: 15, marginBottom: 14, color: "#fff" }}>{dia}</div>
            {Object.entries(tareas).map(([gk, g]) => (
              <div key={gk} style={{ marginBottom: 12 }}>
                <div style={{ color: g.color, fontSize: 10, fontWeight: 700, textTransform: "uppercase", letterSpacing: 1.5, marginBottom: 6 }}>{g.label}</div>
                {g.items.map(item => {
                  const key = `${dia}-${item.id}`;
                  const done = checks[key];
                  return (
                    <div key={item.id} onClick={() => toggle(key)} style={{ display: "flex", gap: 8, alignItems: "flex-start", marginBottom: 6, cursor: "pointer" }}>
                      <div style={{ width: 18, height: 18, borderRadius: 5, background: done ? g.color : "transparent", border: `1.5px solid ${done ? g.color : "#2a2a3a"}`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 11, flexShrink: 0, marginTop: 1, transition: "all .2s" }}>
                        {done && <span style={{ color: "#000", fontWeight: 900 }}>✓</span>}
                      </div>
                      <span style={{ color: done ? "#333" : "#666", fontSize: 11, lineHeight: 1.4, textDecoration: done ? "line-through" : "none", transition: "all .2s" }}>{item.t}</span>
                    </div>
                  );
                })}
              </div>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}

/* ══════════════════════════════════════
   APP PRINCIPAL
══════════════════════════════════════ */
export default function NegocioCompleto() {
  const [tab, setTab] = useState("contrato");

  const tabs = [
    { id: "contrato", icon: "📄", label: "Contrato digital", color: "#22c55e" },
    { id: "prospeccion", icon: "📱", label: "Prospección Instagram", color: "#3b82f6" },
    { id: "casos", icon: "📊", label: "Casos de éxito", color: "#a855f7" },
    { id: "rutina", icon: "✅", label: "Rutina semanal", color: "#f59e0b" },
  ];

  return (
    <div style={{ minHeight: "100vh", background: "#05050d", color: "#fff", fontFamily: "'DM Sans', sans-serif" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@300;400;500;600;700;800;900&display=swap');
        *{box-sizing:border-box;margin:0;padding:0}
        ::-webkit-scrollbar{width:3px}::-webkit-scrollbar-track{background:#0a0a14}::-webkit-scrollbar-thumb{background:#ffffff22;border-radius:2px}
        @keyframes fadeUp{from{opacity:0;transform:translateY(8px)}to{opacity:1;transform:translateY(0)}}
        @keyframes pulse{0%,100%{opacity:1}50%{opacity:.3}}
      `}</style>

      {/* HEADER */}
      <div style={{ background: "#07070e", borderBottom: "1px solid #12121e", padding: "16px 28px", display: "flex", alignItems: "center", gap: 14 }}>
        <div style={{ width: 38, height: 38, borderRadius: 11, background: "linear-gradient(135deg,#ec4899,#f97316)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 20 }}>👗</div>
        <div>
          <div style={{ fontWeight: 900, fontSize: 17, letterSpacing: -0.5 }}>NOVAModa — Kit de negocio completo</div>
          <div style={{ color: "#444", fontSize: 12 }}>Contrato · Prospección · Casos de éxito · Rutina</div>
        </div>
        <div style={{ marginLeft: "auto", display: "flex", alignItems: "center", gap: 6 }}>
          <span style={{ width: 7, height: 7, borderRadius: "50%", background: "#22c55e", display: "inline-block", animation: "pulse 2s infinite" }} />
          <span style={{ color: "#22c55e", fontSize: 12, fontWeight: 700 }}>Listo para usar</span>
        </div>
      </div>

      {/* TABS */}
      <div style={{ background: "#07070e", borderBottom: "1px solid #12121e", padding: "0 28px", display: "flex", gap: 2 }}>
        {tabs.map(t => (
          <button key={t.id} onClick={() => setTab(t.id)} style={{ background: "transparent", border: "none", borderBottom: `3px solid ${tab === t.id ? t.color : "transparent"}`, color: tab === t.id ? t.color : "#444", padding: "14px 20px", cursor: "pointer", fontSize: 14, fontWeight: tab === t.id ? 800 : 500, fontFamily: "'DM Sans',sans-serif", whiteSpace: "nowrap", transition: "all .2s", display: "flex", alignItems: "center", gap: 8 }}>
            <span>{t.icon}</span> {t.label}
          </button>
        ))}
      </div>

      {/* CONTENIDO */}
      <div style={{ maxWidth: 1100, margin: "0 auto", padding: "32px 28px", animation: "fadeUp .3s ease" }}>
        {tab === "contrato" && <Contrato />}
        {tab === "prospeccion" && <Prospeccion />}
        {tab === "casos" && <CasosExito />}
        {tab === "rutina" && <RutinaSemanal />}
      </div>
    </div>
  );
}
