export default function PrivacidadPage() {
  return (
    <div className="bg-page min-h-screen pt-32 pb-24">
      <div className="max-w-4xl mx-auto px-6">
        <div className="bg-white p-10 rounded-2xl border border-slate-200 shadow-sm">
          <h1 className="font-heading font-extrabold text-display-md text-charcoal mb-8 border-b border-slate-100 pb-6">
            Política de Privacidad
          </h1>
          <div className="space-y-8 text-slate-600 text-base leading-relaxed">
            <section>
              <h2 className="font-heading font-bold text-xl text-brand-blue mb-3">1. Información que Recopilamos</h2>
              <p>Recopilamos información que proporcionas directamente a través de formularios de contacto: nombre, correo electrónico, número de teléfono y descripción de tu consulta.</p>
            </section>
            <section>
              <h2 className="font-heading font-bold text-xl text-brand-blue mb-3">2. Uso de la Información</h2>
              <p>La información se utiliza exclusivamente para responder a tus consultas, proporcionarte información sobre nuestros servicios y mejorar tu experiencia.</p>
            </section>
            <section>
              <h2 className="font-heading font-bold text-xl text-brand-blue mb-3">3. Protección de Datos</h2>
              <p>Implementamos medidas de seguridad técnicas y organizativas para proteger tus datos personales contra acceso no autorizado, según la Ley N° 29733 de Protección de Datos Personales del Perú.</p>
            </section>
            <section>
              <h2 className="font-heading font-bold text-xl text-brand-blue mb-3">4. No Compartimos tus Datos</h2>
              <p>No vendemos, intercambiamos ni transferimos tu información personal a terceros sin tu consentimiento, salvo requerimiento legal.</p>
            </section>
            <section>
              <h2 className="font-heading font-bold text-xl text-brand-blue mb-3">5. Cookies</h2>
              <p>Usamos cookies para mejorar tu experiencia de navegación. Puedes configurar tu navegador para rechazarlas, aunque algunas funciones del sitio podrían verse afectadas.</p>
            </section>
            <section>
              <h2 className="font-heading font-bold text-xl text-brand-blue mb-3">6. Tus Derechos</h2>
              <p>Tienes derecho a acceder, rectificar o eliminar tus datos. Contáctanos en <a href="mailto:contacto@transformaccion720.com" className="text-brand-blue hover:underline">contacto@transformaccion720.com</a>.</p>
            </section>
            <p className="text-slate-400 text-sm pt-6 border-t border-slate-100">Última actualización: Febrero 2026</p>
          </div>
        </div>
      </div>
    </div>
  )
}
