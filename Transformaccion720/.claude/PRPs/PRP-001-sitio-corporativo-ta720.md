# PRP-001: Sitio Corporativo TransformAccion 720

> **Estado**: EN PROGRESO 🏎️
> **Fecha**: 2026-02-19
> **Proyecto**: TransformAccion 720
> **Versión**: 1.0 — Fases 1-4 completadas

---

## 🎯 Objetivo

Construir el **Sitio Web Corporativo "El Paddock de la Innovación"** para TransformAccion 720. Una experiencia digital B2B de alto impacto que simule entrar a los headquarters de una escudería de F1: tecnología, velocidad y estrategia pura.

## 💡 Por Qué

| Problema Actual | Solución Propuesta |
|-----------------|---------------------|
| Falta de presencia digital de alto impacto. | Sitio web con narrativa visual de "Mecánicos de Negocios". |
| Confusión sobre los servicios ofrecidos. | Segmentación clara por perfil (Empresas, Emprendedores, Pros). |
| Percepción genérica de consultoría. | Estética única "Racing/Tech" que diferencia la marca. |

**Valor de negocio**: Posicionamiento premium, generación de leads cualificados y claridad inmediata de la propuesta de valor.

---

## 🛠️ Qué (Especificaciones)

### Criterios de Éxito
- [ ] **Performance**: Score > 90 en Lighthouse (Mobile/Desktop).
- [ ] **Estética**: Implementación fiel del sistema de diseño "Racing" (Dark mode, Neil, Glassmorphism).
- [ ] **Conversión**: Funcionalidad de contacto y agenda clara en todas las páginas.
- [ ] **SEO**: Meta tags optimizados para consultoría de transformación digital.

### Comportamiento (Happy Path)
1.  **Home**: Usuario selecciona su "pista" (perfil) en < 3 segundos.
2.  **Navegación**: Transiciones fluidas entre secciones (Nosotros, Servicios, Metodología).
3.  **Conversión**: Formulario de contacto inteligente o agenda de llamada al final del funnel.

### Reglas de Negocio
-   Estética "Dark Mode" por defecto (navy-deep).
-   Animaciones de entrada (fadeUp) en todos los elementos principales.
-   Tipografía Display (800 weight) para impactos visuales.
-   Componentes reutilizables para consistencia (`card-racing`, `btn-racing`).

---

## 🏗️ Contexto Técnico

### Stack (Golden Path SaaS Factory)
-   **Framework**: Next.js 16 (App Router)
-   **Estilos**: Tailwind CSS 3.4 (Variables CSS para HSL)
-   **Animaciones**: Framer Motion
-   **Iconos**: Lucide React
-   **Deploy**: Vercel (previsto)

### Sistema de Diseño (Tokens)
```css
:root {
  --navy-deep: 220 25% 8%;       /* Fondo principal */
  --navy-medium: 220 20% 14%;    /* Tarjetas */
  --navy-light: 220 15% 22%;     /* Bordes */
  --cyan-glow: 185 85% 55%;      /* Acentos */
  --cyan-muted: 185 40% 35%;     /* Texto secundario */
  --orange-racing: 25 95% 55%;   /* Alertas/Badges */
}
```

### Arquitectura de Páginas (App Router)
```
src/app/
├── (public)/
│   ├── page.tsx               # Home "La Parrilla de Salida"
│   ├── nosotros/page.tsx      # "El Laboratorio"
│   ├── servicios/
│   │   ├── consultoria/page.tsx
│   │   ├── digital/page.tsx
│   │   └── academia/page.tsx
│   ├── metodologia/page.tsx   # "El Circuito TA720"
│   └── contacto/page.tsx      # "Pit Wall"
└── layout.tsx                 # Navbar Sticky + Footer
```

---

## 🚀 Blueprint (Assembly Line)

### Fase 1: Setup & Design Foundations
**Objetivo**: Establecer la base visual y el sistema de diseño.
**Validación**:
-   [ ] Configuración de Tailwind con colores HSL personalizados.
-   [ ] Configuración de fuentes (Google Fonts).
-   [ ] Instalación de Framer Motion y Lucide React.
-   [ ] Componentes base creados: `RacingCard`, `RacingBtn`, `SectionHeader`.

### Fase 2: Layout & Navegación Global
**Objetivo**: Estructura general del sitio operativa.
**Validación**:
-   [ ] Navbar sticky con efecto blur y menú móvil funcional.
-   [ ] Footer con links y redes sociales.
-   [ ] Layout principal envolviendo todas las rutas.

### Fase 3: Home Page "Parrilla de Salida"
**Objetivo**: Página de inicio de alto impacto para distribución de tráfico.
**Validación**:
-   [ ] Hero Section con video/imagen de fondo y CTAs.
-   [ ] Selector de Perfil (3 tarjetas interactivas).
-   [ ] Sección de Pain Points con contador animado.

### Fase 4: Páginas Internas Core
**Objetivo**: Contenido detallado de la oferta de valor.
**Validación**:
-   [ ] Página "Nosotros" con grid de pilares y social proof.
-   [ ] Páginas de Servicios (Consultoría, Digital, Academia) con sus estilos específicos.
-   [ ] Página "Metodología" con visual del circuito (no lista).

### Fase 5: Contacto & Optimización Final
**Objetivo**: Captura de leads y pulido final.
**Validación**:
-   [ ] Formulario de contacto funcional (integración preliminar o UI final).
-   [ ] Revisión de SEO (Meta etiquetas básicas).
-   [ ] Auditoría de Performance (imágenes optimizadas).
-   [ ] Ajustes finales de animaciones y responsive.

---

## 🧠 Aprendizajes (Self-Annealing)

### [2026-02-19]: Inicio del Proyecto
-   **Nota**: Se adopta la metodología "Feature-First" para la organización de componentes específicos de cada página si crecen en complejidad.
-   **Nota**: Mantener el archivo `TA720.md` como referencia creativa constante.

---

## 🚨 Gotchas / Riesgos
-   [ ] **Performance de Animaciones**: Asegurar que Framer Motion no impacte negativamente el LCP (Largest Contentful Paint). Usar `layoutId` con cuidado.
-   [ ] **Contraste**: Verificar accesibilidad en combinaciones de cián sobre azul oscuro.
-   [ ] **Imágenes**: Optimizar assets pesados del hero para carga rápida.
