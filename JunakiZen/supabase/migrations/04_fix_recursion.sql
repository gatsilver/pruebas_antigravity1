-- Corrige la póliza recursiva en membresias
drop policy if exists "Admin ve membresias de su org" on public.membresias;

create policy "Admin ve membresias de su org" on public.membresias
  for select using (
    exists (
      select 1 from public.organizaciones o
      join public.membresias m on m.org_id = o.id_org
      where m.org_id = membresias.org_id
      and m.user_id = auth.uid()
      and m.rol_en_org = 'admin'
    )
  );

-- Opción más segura y simple sin join extra, confiando en auth.uid()
-- Pero el problema era que seleccionaba de 'public.membresias' dentro del policy de 'public.membresias'.
-- La solución robusta es usar security defined functions para romper la recursión.

-- Usamos la funcion publica is_member que ya existe en 02 (si existe) O creamos una nueva.
-- Pero para no depender, usaremos una subquery directa con cuidado o mejor aun, una funcion RPC segura.
-- En el paso 309 creamos 'fix_my_user_access', pero no UNA FUNCION CHECK.

-- Vamos a redefinir la policy para usar una funcion segura si es posible, o simplemente romper el ciclo.
-- El ciclo es: Policy MEMBRESIAS -> Select MEMBRESIAS.
-- Solución: Usar una función security definer `get_my_role` que lea membresias SIN pasar por RLS.

create or replace function public.get_my_role_unrestricted(check_org_id uuid)
returns text as $$
declare
  role_found text;
begin
  select rol_en_org into role_found
  from public.membresias
  where org_id = check_org_id
  and user_id = auth.uid();
  return role_found;
end;
$$ language plpgsql security definer;

drop policy if exists "Admin ve membresias de su org" on public.membresias;

create policy "Admin ve membresias de su org" on public.membresias
  for select using (
    public.get_my_role_unrestricted(org_id) = 'admin'
  );
