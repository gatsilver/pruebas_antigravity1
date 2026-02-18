-- VERSIÓN SEGURA SIN DROP (Solo CREATE OR REPLACE)
-- Copia y pega este bloque en el SQL Editor de Supabase

-- 1. Función segura para verificar rol sin recursión
CREATE OR REPLACE FUNCTION public.get_my_role_unrestricted(check_org_id uuid)
RETURNS text AS $$
DECLARE
  role_found text;
BEGIN
  SELECT rol_en_org INTO role_found
  FROM public.membresias
  WHERE org_id = check_org_id
  AND user_id = auth.uid();
  RETURN role_found;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 2. Función de Auto-Reparación Mejorada (Crea Org si no existe)
CREATE OR REPLACE FUNCTION public.fix_my_user_access()
RETURNS text AS $$
DECLARE
  v_org_id uuid;
  v_user_id uuid;
BEGIN
  v_user_id := auth.uid();
  IF v_user_id IS NULL THEN 
    RETURN 'Error: No user authenticated'; 
  END IF;

  -- Buscar Org existente
  SELECT id_org INTO v_org_id FROM public.organizaciones LIMIT 1;

  -- Si no existe, CREAR UNO
  IF v_org_id IS NULL THEN
    INSERT INTO public.organizaciones (nombre_org) 
    VALUES ('Organización Demo')
    RETURNING id_org INTO v_org_id;
  END IF;

  -- Crear Perfil si falta
  INSERT INTO public.perfiles (id, nombre_completo) 
  VALUES (v_user_id, 'Usuario Admin')
  ON CONFLICT (id) DO NOTHING;

  -- Crear/Actualizar Membresía
  IF EXISTS (SELECT 1 FROM public.membresias WHERE user_id = v_user_id AND org_id = v_org_id) THEN
     UPDATE public.membresias 
     SET rol_en_org = 'admin', activo = true 
     WHERE user_id = v_user_id AND org_id = v_org_id;
     RETURN 'Acceso Admin Restaurado';
  ELSE
     INSERT INTO public.membresias (org_id, user_id, rol_en_org)
     VALUES (v_org_id, v_user_id, 'admin');
     RETURN 'Nuevo Acceso Admin Creado';
  END IF;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
