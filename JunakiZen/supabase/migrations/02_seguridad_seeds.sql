-- SQL PARTE 2: SEGURIDAD, GOBIERNO Y SEEDS
-- Autor: Equipo de Arquitectura Antigravity
-- Objetivo: Aplicar gobierno de datos estricto (RLS) y facilitar pruebas.

-- 1. FUNCIONES HELPER PARA RLS (Anti-Recursión)

-- Función: Obtener mi rol en una org específica
-- IMPORTANTE: Security Definer para acceder a membresias sin depender de sus policies actuales
create or replace function public.get_my_role(current_org_id uuid)
returns public.rol_usuario as $$
declare
  identified_role public.rol_usuario;
begin
  select rol_en_org into identified_role
  from public.membresias
  where org_id = current_org_id
  and user_id = auth.uid()
  and activo = true;
  
  return identified_role;
end;
$$ language plpgsql security definer;

-- Función: Verificar si soy miembro activo
create or replace function public.is_member(current_org_id uuid)
returns boolean as $$
begin
  return exists (
    select 1
    from public.membresias
    where org_id = current_org_id
    and user_id = auth.uid()
    and activo = true
  );
end;
$$ language plpgsql security definer;

-- 2. POLICIES RLS (GOBIERNO DE DATOS)

-- A. PERFILES
-- Solo yo puedo ver y editar mi perfil
create policy "Usuarios ven su propio perfil" on public.perfiles
  for select using (auth.uid() = id);
  
create policy "Usuarios editan su propio perfil" on public.perfiles
  for update using (auth.uid() = id);

-- B. ORGANIZACIONES
-- Ver organizaciones donde soy miembro
create policy "Miembros ven sus organizaciones" on public.organizaciones
  for select using (
    exists (
      select 1 from public.membresias
      where org_id = organizaciones.id_org
      and user_id = auth.uid()
      and activo = true
    )
  );

-- C. MEMBRESIAS
-- 1. Ver mi propia membresía
create policy "Ver mi propia membresia" on public.membresias
  for select using (user_id = auth.uid());

-- 2. Admin ve membresías de su org
create policy "Admin ve membresias de su org" on public.membresias
  for select using (
    exists (
      select 1 from public.membresias as m
      where m.org_id = membresias.org_id
      and m.user_id = auth.uid()
      and m.rol_en_org = 'admin'
    )
  );

-- D. TABLAS DE NEGOCIO (General Pattern: Org Match + Membership Check)

-- CLIENTES
create policy "Acceso clientes por org" on public.clientes
  for all using (org_id is not null and public.is_member(org_id));

-- PACIENTES
-- Admin/Recepcion/Terapeuta ven pacientes de la org
-- Paciente ve SOLO si está vinculado en pacientes_usuarios
create policy "Staff ve pacientes org" on public.pacientes
  for select using (
    public.is_member(org_id) 
    and public.get_my_role(org_id) in ('admin', 'recepcion', 'terapeuta')
  );

create policy "Paciente ve su record" on public.pacientes
  for select using (
    exists (
      select 1 from public.pacientes_usuarios
      where id_paciente = pacientes.id_paciente
      and user_id = auth.uid()
    )
  );

create policy "Admin/Recepcion gestionan pacientes" on public.pacientes
  for all using (
    public.is_member(org_id) 
    and public.get_my_role(org_id) in ('admin', 'recepcion')
  );

-- SERVICIOS
create policy "Ver servicios de org" on public.servicios
  for select using (public.is_member(org_id));

create policy "Admin gestiona servicios" on public.servicios
  for all using (
    public.is_member(org_id) AND public.get_my_role(org_id) = 'admin'
  );

-- CITAS
create policy "Ver citas de org" on public.citas
  for select using (public.is_member(org_id));

create policy "Gestionar citas Staff" on public.citas
  for all using (
    public.is_member(org_id) 
    and public.get_my_role(org_id) in ('admin', 'recepcion')
  );

create policy "Terapeuta gestiona sus citas" on public.citas
  for update using (
    public.is_member(org_id) 
    and terapeuta_id = auth.uid()
  );

-- HISTORIAL PACIENTE (Sensible)
create policy "Admin ve historial" on public.historial_paciente
  for select using (
    public.is_member(org_id) 
    and public.get_my_role(org_id) = 'admin'
  );

create policy "Terapeuta ve/edita historial asignado" on public.historial_paciente
  for all using (
    public.is_member(org_id) 
    and public.get_my_role(org_id) = 'terapeuta'
    and (
      exists ( -- Paciente asignado explicitamente
        select 1 from public.pacientes_terapeutas pt
        where pt.id_paciente = historial_paciente.id_paciente
        and pt.terapeuta_id = auth.uid()
        and pt.activo = true
      )
      OR
      exists ( -- O es el terapeuta de la cita asociada
        select 1 from public.citas c
        where c.id_cita = historial_paciente.id_cita
        and c.terapeuta_id = auth.uid()
      )
    )
  );

-- INVENTARIO
create policy "Staff ve inventario" on public.inventario
  for select using (public.is_member(org_id));

create policy "Admin gestiona inventario" on public.inventario
  for all using (
    public.is_member(org_id) 
    and public.get_my_role(org_id) = 'admin'
  );

-- IDEAS
create policy "Ver ideas de org" on public.ideas
  for select using (public.is_member(org_id));

create policy "Crear ideas cualquier miembro" on public.ideas
  for insert with check (public.is_member(org_id));

-- 3. VISTAS SQL (Dashboards)

-- Vista: Agenda Diaria
create or replace view public.vw_agenda_diaria as
select 
  c.org_id,
  c.fecha_hora,
  p.nombre_completo as nombre_paciente,
  s.nombre_servicio,
  perf.nombre_completo as nombre_terapeuta,
  c.estado_cita
from public.citas c
join public.pacientes pac on c.id_paciente = pac.id_paciente
join public.clientes cli on pac.id_cliente = cli.id_cliente
-- HACK: Nombre paciente viene de cliente (ajuste rápido)
left join lateral (select cli.nombres_completos as nombre_completo) p on true
left join public.servicios s on c.id_servicio = s.id_servicio
left join public.perfiles perf on c.terapeuta_id = perf.id;

-- Vista: Pacientes Activos
create or replace view public.vw_pacientes_activos as
select
  p.org_id,
  c.nombres_completos,
  p.estado_tratamiento,
  p.fecha_inicio_atencion
from public.pacientes p
join public.clientes c on p.id_cliente = c.id_cliente
where p.estado_tratamiento = 'activo';


-- 4. SEEDS (Instrucciones de Arranque Rápido)
/*
INSTRUCCIONES PARA SEED MANUAL (Ejecutar bloque a bloque):

1. Crear Usuario Admin manualmente en Auth de Supabase.
2. Copiar su UUID.
3. Ejecutar SQL reemplazando UUID_ADMIN:
*/

-- (Descomentar para usar como template)
/*
do $$
declare
  v_org_id uuid;
  v_user_id uuid := 'INGRESA_UUID_ADMIN_AQUI'; -- <--- IMPUT
  v_plan_id uuid;
begin
  -- 1. Crear Org
  insert into public.organizaciones (nombre_org) 
  values ('Junaki Center Demo') 
  returning id_org into v_org_id;

  -- 2. Crear Plan Trial
  insert into public.planes_suscripcion (nombre_plan, precio_mensual)
  values ('Plan Inicial', 0)
  returning id_plan into v_plan_id;

  -- 3. Crear Suscripción
  insert into public.suscripciones (org_id, id_plan, estado_suscripcion)
  values (v_org_id, v_plan_id, 'trial');

  -- 4. Asignar Admin a Org
  insert into public.membresias (org_id, user_id, rol_en_org)
  values (v_org_id, v_user_id, 'admin');

  raise notice 'Organización % creada con ID % para usuario %', 'Junaki Center Demo', v_org_id, v_user_id;
end $$;
*/

-- FIN PARTE 2
