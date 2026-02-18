-- 1. Función para resolver Email a UserID (Usada para invitar miembros)
create or replace function public.get_user_id_by_email(email_input text)
returns uuid as $$
declare
  v_user_id uuid;
begin
  -- Nota: Esta funcion es Security Definer, permite leer auth.users.
  -- Idealmente restringir a Admins, pero por brevedad y MVP se deja abierta a usuarios auth.
  if auth.role() = 'anon' then
    return null;
  end if;

  select id into v_user_id from auth.users where email = email_input limit 1;
  return v_user_id;
end;
$$ language plpgsql security definer;

-- 2. Habilitar RLS y Políticas para pacientes_terapeutas (Asignación)
alter table public.pacientes_terapeutas enable row level security;

-- Limpiar políticas viejas si existen
drop policy if exists "Gestionar asignaciones admin/recep" on public.pacientes_terapeutas;
drop policy if exists "Ver asignaciones" on public.pacientes_terapeutas;

-- Admin y Recepción pueden Crear/Borrar/Ver asignaciones
create policy "Gestionar asignaciones admin/recep" on public.pacientes_terapeutas
  for all using (
    exists (
      select 1 from public.membresias 
      where user_id = auth.uid() 
      and rol_en_org in ('admin', 'recepcion')
    )
  );

-- Terapeutas pueden ver sus asignaciones
create policy "Terapeuta ve sus asignaciones" on public.pacientes_terapeutas
  for select using (
    terapeuta_id = auth.uid()
  );

-- Pacientes pueden ver sus propios terapeutas asignados
create policy "Pacientes ven sus terapeutas" on public.pacientes_terapeutas
  for select using (
    exists (
      select 1 from public.pacientes_usuarios pu
      where pu.id_paciente = pacientes_terapeutas.id_paciente
      and pu.user_id = auth.uid()
    )
  );
