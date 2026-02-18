# 📋 BUSINESS_LOGIC.md - Holistic Center SaaS

> Generado por SaaS Factory | Fecha: 2026-02-18

## 1. Problema de Negocio
**Dolor:** El centro holístico pierde tiempo (~4 horas/día) y sufre frustración gestionando pacientes, citas, terapeutas, productos e información mediante procesos manuales dispersos en Excel y Google Drive.
**Costo actual:** ~4 horas diarias de operación manual y alta frustración del equipo.

## 2. Solución
**Propuesta de valor:** Una plataforma SaaS All-in-One para centros holísticos que centraliza la gestión de pacientes, agenda inteligente, inventario, expedientes clínicos, notificaciones, asignación de terapeutas, acceso de pacientes a documentos y seguimiento comercial (CRM).

**Flujo principal (Happy Path - Dueño):**
1. Inicia sesión y visualiza dashboard con citas del día y métricas.
2. Recibe solicitud de nuevo paciente (ej. vía WhatsApp).
3. Registra el prospecto en el CRM (Pipeline Comercial).
4. Convierte prospecto a Paciente y completa ficha base.
5. Agenda cita, asigna terapeuta y reserva sala/recursos.
6. Sistema envía confirmación automática al paciente y terapeuta.
7. Registra y descuenta insumos del inventario (aceites, etc.).
8. Asigna usuario/contraseña al paciente para el Portal de Paciente.

## 3. Usuario Objetivo
**Roles:**
- **Dueño (Super Admin):** Gestión total, métricas, asignación de recursos.
- **Terapeuta:** Ve su agenda, registra evolución, notas clínicas.
- **Paciente:** Accede a su historial, documentos y próximos turnos.
- **Recepcionista:** Gestión de agenda y primer contacto.
- **Estudiante:** Acceso limitado a cursos/materiales.

**Contexto:** Centros de terapia holística que buscan profesionalizar su gestión y mejorar la experiencia del paciente, dejando atrás herramientas genéricas.

## 4. Arquitectura de Datos
**Input:**
- **Paciente:** Datos personales, historial clínico, formularios, preferencias.
- **Inventario:** Productos físicos, aceites, equipos, stock, proveedores.
- **Terapia:** Tipo de sesión, duración, precio, terapeuta asignado.
- **Cursos:** Links a videos pre-grabados, PDFs (repositorios externos).
- **CRM:** Estado del lead (Nuevo, Contactado, Cita Agendada, Cliente).

**Output:**
- **Agenda:** Vista diaria/semanal por terapeuta.
- **Historial:** Expediente clínico digital y evoluciones.
- **Accesos:** Credenciales para portal paciente.
- **Reportes:** Resumen de atenciones, terapias más vendidas, estado de inventario.

**Storage (Supabase tables sugeridas):**
- `profiles`: Usuarios del sistema (Admin, Terapeuta, Paciente, Staff).
- `patients`: Datos médicos y administrativos extendidos.
- `appointments`: Citas vinculando Paciente + Terapeuta + Sala.
- `inventory`: Productos, insumos y control de stock.
- `crm_leads`: Pipeline de ventas y seguimiento.
- `courses`: Catálogo de cursos y links a materiales.
- `clinical_records`: Notas de evolución e historia clínica.

## 5. KPI de Éxito
**Métricas principales:**
1. Autonomía del terapeuta: Ver agenda sin depender de recepción.
2. Trazabilidad comercial: Historial completo de leads del último mes.
3. Control de Inventario: Estado real de insumos y productos.
4. Centralización: Acceso inmediato al historial detallado del paciente.
5. Inteligencia de Negocio: Reporte de terapias top y resumen de atenciones.

## 6. Especificación Técnica (Para el Agente)

### Features a Implementar (Feature-First)
```
src/features/
├── auth/           # Login unificado (Email/Pass)
├── dashboard/      # Vistas según rol (Dueño, Terapeuta, Paciente)
├── crm/            # Gestión de leads y pipeline
├── patients/       # Directorio y Expediente Clínico
├── appointments/   # Agenda y Calendar
├── inventory/      # Stock y asignación de recursos
├── courses/        # Galería de cursos (links externos)
└── portal/         # Vista específica del paciente
```

### Stack Confirmado
- **Frontend:** Next.js 16 + React 19 + TypeScript + Tailwind 3.4 + shadcn/ui
- **Backend:** Supabase (Auth + Database + Storage)
- **Validación:** Zod
- **State:** Zustand
- **MCPs:** Next.js DevTools + Playwright + Supabase

### Próximos Pasos (Implementación)
1. [ ] Setup proyecto base con SaaS Factory
2. [ ] Configurar Tablas en Supabase (Schema)
3. [ ] Implementar Auth con Roles (Admin, Terapeuta, Paciente)
4. [ ] Feature: Dashboard & Layout Base
5. [ ] Feature: CRM (Leads)
6. [ ] Feature: Pacientes & Expediente
7. [ ] Feature: Agenda & Citas
8. [ ] Feature: Inventario Simplificado
