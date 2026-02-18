-- SQL PARTE 1: FUNDACIÓN (Estructura, Tablas, Triggers y RLS Enable)
-- Autor: Equipo de Arquitectura Antigravity
-- Objetivo: Crear estructura inmutable multi-tenant sin romper dependencias.

-- 1. EXTENSIONES
create extension if not exists "pgcrypto";

-- 2. TIPOS ENUM (Definiciones estrictas)
create type public.rol_usuario as enum ('admin', 'terapeuta', 'recepcion', 'paciente');
create type public.estado_org as enum ('activo', 'inactivo', 'suspendido');
create type public.estado_plan as enum ('activo', 'obsoleto');
create type public.estado_suscripcion as enum ('trial', 'activa', 'pausada', 'cancelada');
create type public.estado_tratamiento as enum ('activo', 'alta', 'abandono', 'en_espera');
create type public.estado_cita as enum ('pendiente', 'confirmada', 'realizada', 'cancelada', 'no_asistio');
create type public.estado_stock as enum ('disponible', 'bajo', 'agotado');

-- 3. FUNCIONES UTILITARIAS GLOBALES
-- Función para manejar updated_at automáticamente
create or replace function public.handle_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

-- 4. IDENTIDAD Y TENANT
-- Tabla espejo de auth.users
create table public.perfiles (
  id uuid primary key references auth.users(id) on delete cascade,
  nombre_completo text,
  activo boolean default true,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- Trigger para crear perfil automáticamente al registrarse
create or replace function public.on_auth_user_created()
returns trigger as $$
begin
  insert into public.perfiles (id, nombre_completo)
  values (new.id, new.raw_user_meta_data->>'full_name');
  return new;
end;
$$ language plpgsql security definer;

create trigger on_auth_user_created_trigger
  after insert on auth.users
  for each row execute procedure public.on_auth_user_created();

-- Tabla Organizaciones (Multi-tenant Root)
create table public.organizaciones (
  id_org uuid primary key default gen_random_uuid(),
  nombre_org text not null,
  estado public.estado_org default 'activo',
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- Tabla Membresías (Usuario <-> Organización)
create table public.membresias (
  id_membresia uuid primary key default gen_random_uuid(),
  org_id uuid references public.organizaciones(id_org) on delete cascade not null,
  user_id uuid references auth.users(id) on delete cascade not null,
  rol_en_org public.rol_usuario not null,
  activo boolean default true,
  created_at timestamptz default now(),
  updated_at timestamptz default now(),
  unique (org_id, user_id)
);

-- Tabla Planes de Suscripción (SaaS)
create table public.planes_suscripcion (
  id_plan uuid primary key default gen_random_uuid(),
  nombre_plan text not null,
  precio_mensual numeric(10, 2) not null default 0,
  limites_json jsonb default '{}'::jsonb,
  estado public.estado_plan default 'activo',
  created_at timestamptz default now()
);

-- Tabla Suscripciones (Organización <-> Plan)
create table public.suscripciones (
  id_suscripcion uuid primary key default gen_random_uuid(),
  org_id uuid references public.organizaciones(id_org) on delete cascade not null unique,
  id_plan uuid references public.planes_suscripcion(id_plan) not null,
  estado_suscripcion public.estado_suscripcion default 'trial',
  fecha_inicio timestamptz default now(),
  fecha_fin timestamptz,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- 5. TABLAS DE NEGOCIO (BASE + org_id)

-- Clientes (Datos demográficos base)
create table public.clientes (
  id_cliente uuid primary key default gen_random_uuid(),
  org_id uuid references public.organizaciones(id_org) on delete cascade not null,
  nombres_completos text not null,
  dni text, -- Unique por org via constraint abajo
  correo text,
  telefono text,
  fecha_nacimiento date,
  direccion text,
  pais text default 'Peru',
  provincia text,
  distrito text,
  estado boolean default true,
  created_at timestamptz default now(),
  updated_at timestamptz default now(),
  unique (org_id, dni) -- DNI único por organización
);

-- Pacientes (Extiende cliente con datos clínicos)
create table public.pacientes (
  id_paciente uuid primary key default gen_random_uuid(),
  org_id uuid references public.organizaciones(id_org) on delete cascade not null,
  id_cliente uuid references public.clientes(id_cliente) on delete cascade not null,
  fecha_inicio_atencion date default current_date,
  fecha_fin_atencion date,
  tipo_atencion text,
  estado_tratamiento public.estado_tratamiento default 'activo',
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- Servicios (Catálogo)
create table public.servicios (
  id_servicio uuid primary key default gen_random_uuid(),
  org_id uuid references public.organizaciones(id_org) on delete cascade not null,
  tipo_servicio text,
  nombre_servicio text not null,
  descripcion text,
  duracion_min integer default 60,
  precio_unitario numeric(10, 2) default 0,
  estado boolean default true,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- Citas (Agenda)
create table public.citas (
  id_cita uuid primary key default gen_random_uuid(),
  org_id uuid references public.organizaciones(id_org) on delete cascade not null,
  id_paciente uuid references public.pacientes(id_paciente) on delete cascade not null,
  id_servicio uuid references public.servicios(id_servicio),
  terapeuta_id uuid references public.perfiles(id), -- Asignación directa a perfil
  fecha_hora timestamptz not null,
  estado_cita public.estado_cita default 'pendiente',
  observaciones text,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- Historial Paciente (Historias clínicas)
create table public.historial_paciente (
  id_historial uuid primary key default gen_random_uuid(),
  org_id uuid references public.organizaciones(id_org) on delete cascade not null,
  id_paciente uuid references public.pacientes(id_paciente) on delete cascade not null,
  id_cita uuid references public.citas(id_cita),
  fecha_sesion date default current_date,
  motivo_consulta text,
  observaciones text,
  notas_evolucion text,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- Historial No Paciente (Prospectos/Eventuales)
create table public.historial_no_paciente (
  id_registro uuid primary key default gen_random_uuid(),
  org_id uuid references public.organizaciones(id_org) on delete cascade not null,
  nombres_completos text not null,
  correo text,
  telefono text,
  servicio text,
  fecha_atencion timestamptz default now(),
  tiempo_atencion integer, -- minutos
  created_at timestamptz default now()
);

-- Inventario (Productos)
create table public.inventario (
  id_producto uuid primary key default gen_random_uuid(),
  org_id uuid references public.organizaciones(id_org) on delete cascade not null,
  nombre_producto text not null,
  sku_codigo text,
  cantidad_actual integer default 0,
  precio_costo numeric(10, 2) default 0,
  precio_venta numeric(10, 2) default 0,
  proveedor text,
  estado_stock public.estado_stock default 'disponible',
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- Ideas (Innovation management)
create table public.ideas (
  id_idea uuid primary key default gen_random_uuid(),
  org_id uuid references public.organizaciones(id_org) on delete cascade not null,
  idea_principal text not null,
  detalle_idea text,
  impacto text,
  fecha_idea date default current_date,
  autor_id uuid references public.perfiles(id),
  created_at timestamptz default now()
);

-- 6. TABLAS DE GOBIERNO (Relaciones críticas para RLS)

-- Pacientes <-> Usuarios (Portal Paciente: Qué usuario "ve" a qué paciente)
create table public.pacientes_usuarios (
  org_id uuid references public.organizaciones(id_org) on delete cascade not null,
  id_paciente uuid references public.pacientes(id_paciente) on delete cascade not null,
  user_id uuid references auth.users(id) on delete cascade not null,
  created_at timestamptz default now(),
  primary key (org_id, id_paciente, user_id),
  unique (org_id, id_paciente), -- Un paciente solo vinculado a un usuario por org (simplificación)
  unique (org_id, user_id)      -- Un usuario solo es un paciente por org
);

-- Pacientes <-> Terapeutas (Asignación de casos)
create table public.pacientes_terapeutas (
  org_id uuid references public.organizaciones(id_org) on delete cascade not null,
  id_paciente uuid references public.pacientes(id_paciente) on delete cascade not null,
  terapeuta_id uuid references public.perfiles(id) on delete cascade not null,
  activo boolean default true,
  fecha_asignacion timestamptz default now(),
  fecha_fin timestamptz,
  created_at timestamptz default now(),
  primary key (org_id, id_paciente, terapeuta_id)
);

-- 7. ACTIVACIÓN DE RLS Y TRIGGERS DE UPDATE
-- Habilitar RLS en TODO
alter table public.perfiles enable row level security;
alter table public.organizaciones enable row level security;
alter table public.membresias enable row level security;
alter table public.planes_suscripcion enable row level security;
alter table public.suscripciones enable row level security;
alter table public.clientes enable row level security;
alter table public.pacientes enable row level security;
alter table public.servicios enable row level security;
alter table public.citas enable row level security;
alter table public.historial_paciente enable row level security;
alter table public.historial_no_paciente enable row level security;
alter table public.inventario enable row level security;
alter table public.ideas enable row level security;
alter table public.pacientes_usuarios enable row level security;
alter table public.pacientes_terapeutas enable row level security;

-- Aplicar trigger de updated_at
create trigger update_perfiles_modtime before update on public.perfiles for each row execute procedure public.handle_updated_at();
create trigger update_org_modtime before update on public.organizaciones for each row execute procedure public.handle_updated_at();
create trigger update_membresias_modtime before update on public.membresias for each row execute procedure public.handle_updated_at();
create trigger update_suscripciones_modtime before update on public.suscripciones for each row execute procedure public.handle_updated_at();
create trigger update_clientes_modtime before update on public.clientes for each row execute procedure public.handle_updated_at();
create trigger update_pacientes_modtime before update on public.pacientes for each row execute procedure public.handle_updated_at();
create trigger update_servicios_modtime before update on public.servicios for each row execute procedure public.handle_updated_at();
create trigger update_citas_modtime before update on public.citas for each row execute procedure public.handle_updated_at();
create trigger update_historial_paciente_modtime before update on public.historial_paciente for each row execute procedure public.handle_updated_at();
create trigger update_inventario_modtime before update on public.inventario for each row execute procedure public.handle_updated_at();

-- FIN PARTE 1
