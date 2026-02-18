# INSTRUCCIONES CRÍTICAS PARA RESOLVER EL PROBLEMA

## El problema raíz
Tu aplicación no puede acceder porque:
1. No tienes sesión activa en el navegador (USER: No Auth)
2. Probablemente no existen usuarios de prueba en Supabase
3. Posiblemente no existe ninguna organización en la base de datos

## PASO 1: Crear usuarios de prueba en Supabase

Ve a tu Dashboard de Supabase → Authentication → Users → Add User

Crea este usuario:
- Email: `admin@junaki.test`
- Password: `Test1234!`
- Auto Confirm User: ✅ (IMPORTANTE)

## PASO 2: Ejecutar el script SQL de reparación

Ve a SQL Editor en Supabase y ejecuta TODO este código:

```sql
-- 1. Función segura para verificar rol sin recursión
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

-- 2. Corregir política RLS recursiva
drop policy if exists "Admin ve membresias de su org" on public.membresias;

create policy "Admin ve membresias de su org" on public.membresias
  for select using (
    public.get_my_role_unrestricted(org_id) = 'admin'
  );

-- 3. Función de Auto-Reparación Mejorada
create or replace function public.fix_my_user_access()
returns text as $$
declare
  v_org_id uuid;
  v_user_id uuid;
begin
  v_user_id := auth.uid();
  if v_user_id is null then return 'Error: No user authenticated'; end if;

  -- Buscar Org existente
  select id_org into v_org_id from public.organizaciones limit 1;

  -- Si no existe, CREAR UNO
  if v_org_id is null then
    insert into public.organizaciones (nombre_org) 
    values ('Organización Demo')
    returning id_org into v_org_id;
  end if;

  -- Crear Perfil si falta
  insert into public.perfiles (id, nombre_completo) 
  values (v_user_id, 'Usuario Admin')
  on conflict (id) do nothing;

  -- Crear/Actualizar Membresía
  if exists (select 1 from public.membresias where user_id = v_user_id and org_id = v_org_id) then
     update public.membresias 
     set rol_en_org = 'admin', activo = true 
     where user_id = v_user_id and org_id = v_org_id;
     return 'Acceso Admin Restaurado';
  else
     insert into public.membresias (org_id, user_id, rol_en_org)
     values (v_org_id, v_user_id, 'admin');
     return 'Nuevo Acceso Admin Creado';
  end if;
end;
$$ language plpgsql security definer;
```

## PASO 3: Probar el login

1. Ve a http://localhost:3000/login
2. Ingresa con:
   - Email: admin@junaki.test
   - Password: Test1234!
3. Si te redirige a org-selector y sigue sin organizaciones, haz clic en "Reparar mi Cuenta (Demo)"
4. Deberías ver tu organización creada

## Si aún no funciona

Abre la consola del navegador (F12) y mira si hay errores. Copia el mensaje de error exacto.
