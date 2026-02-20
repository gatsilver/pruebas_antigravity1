export default function TerminosPage() {
  return (
    <div className="bg-page min-h-screen pt-32 pb-24">
      <div className="max-w-4xl mx-auto px-6">
        <div className="bg-white p-10 rounded-2xl border border-slate-200 shadow-sm">
          <h1 className="font-heading font-extrabold text-display-md text-charcoal mb-8 border-b border-slate-100 pb-6">
            Términos y Condiciones
          </h1>
          <div className="space-y-8 text-slate-600 text-base leading-relaxed">
            <section>
              <h2 className="font-heading font-bold text-xl text-brand-blue mb-3">1. Uso del Sitio</h2>
              <p>El acceso y uso de este sitio web está sujeto a los presentes términos. Al utilizarlo, aceptas cumplir con estas condiciones.</p>
            </section>
            <section>
              <h2 className="font-heading font-bold text-xl text-brand-blue mb-3">2. Servicios</h2>
              <p>TransformAcción 720 ofrece servicios de consultoría en transformación digital, soluciones tecnológicas y programas de capacitación. Los detalles específicos de cada servicio se acordarán mediante propuesta formal.</p>
            </section>
            <section>
              <h2 className="font-heading font-bold text-xl text-brand-blue mb-3">3. Propiedad Intelectual</h2>
              <p>Todo el contenido de este sitio, incluyendo textos, gráficos y metodologías, es propiedad de TransformAcción 720 y está protegido por las leyes de propiedad intelectual aplicables en Perú y LATAM.</p>
            </section>
            <section>
              <h2 className="font-heading font-bold text-xl text-brand-blue mb-3">4. Limitación de Responsabilidad</h2>
              <p>TransformAcción 720 no se responsabiliza por daños indirectos derivados del uso de este sitio o de la información contenida en él.</p>
            </section>
            <section>
              <h2 className="font-heading font-bold text-xl text-brand-blue mb-3">5. Contacto</h2>
              <p>Para consultas sobre estos términos: <a href="mailto:contacto@transformaccion720.com" className="text-brand-blue hover:underline">contacto@transformaccion720.com</a></p>
            </section>
            <p className="text-slate-400 text-sm pt-6 border-t border-slate-100">Última actualización: Febrero 2026</p>
          </div>
        </div>
      </div>
    </div>
  )
}
