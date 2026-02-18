export type Json =
    | string
    | number
    | boolean
    | null
    | { [key: string]: Json | undefined }
    | Json[]

export type Database = {
    public: {
        Tables: {
            citas: {
                Row: {
                    created_at: string | null
                    estado_cita: Database["public"]["Enums"]["estado_cita"] | null
                    fecha_hora: string
                    id_cita: string
                    id_paciente: string
                    id_servicio: string | null
                    observaciones: string | null
                    org_id: string
                    terapeuta_id: string | null
                    updated_at: string | null
                }
                Insert: {
                    created_at?: string | null
                    estado_cita?: Database["public"]["Enums"]["estado_cita"] | null
                    fecha_hora: string
                    id_cita?: string
                    id_paciente: string
                    id_servicio?: string | null
                    observaciones?: string | null
                    org_id: string
                    terapeuta_id?: string | null
                    updated_at?: string | null
                }
                Update: {
                    created_at?: string | null
                    estado_cita?: Database["public"]["Enums"]["estado_cita"] | null
                    fecha_hora?: string
                    id_cita?: string
                    id_paciente?: string
                    id_servicio?: string | null
                    observaciones?: string | null
                    org_id?: string
                    terapeuta_id?: string | null
                    updated_at?: string | null
                }
                Relationships: []
            }
            clientes: {
                Row: {
                    correo: string | null
                    created_at: string | null
                    direccion: string | null
                    distrito: string | null
                    dni: string | null
                    estado: boolean | null
                    fecha_nacimiento: string | null
                    id_cliente: string
                    nombres_completos: string
                    org_id: string
                    pais: string | null
                    provincia: string | null
                    telefono: string | null
                    updated_at: string | null
                }
                Insert: {
                    correo?: string | null
                    created_at?: string | null
                    direccion?: string | null
                    distrito?: string | null
                    dni?: string | null
                    estado?: boolean | null
                    fecha_nacimiento?: string | null
                    id_cliente?: string
                    nombres_completos: string
                    org_id: string
                    pais?: string | null
                    provincia?: string | null
                    telefono?: string | null
                    updated_at?: string | null
                }
                Update: {
                    correo?: string | null
                    created_at?: string | null
                    direccion?: string | null
                    distrito?: string | null
                    dni?: string | null
                    estado?: boolean | null
                    fecha_nacimiento?: string | null
                    id_cliente?: string
                    nombres_completos?: string
                    org_id?: string
                    pais?: string | null
                    provincia?: string | null
                    telefono?: string | null
                    updated_at?: string | null
                }
                Relationships: []
            }
            historial_no_paciente: {
                Row: {
                    correo: string | null
                    created_at: string | null
                    fecha_atencion: string | null
                    id_registro: string
                    nombres_completos: string
                    org_id: string
                    servicio: string | null
                    telefono: string | null
                    tiempo_atencion: number | null
                }
                Insert: {
                    correo?: string | null
                    created_at?: string | null
                    fecha_atencion?: string | null
                    id_registro?: string
                    nombres_completos: string
                    org_id: string
                    servicio?: string | null
                    telefono?: string | null
                    tiempo_atencion?: number | null
                }
                Update: {
                    correo?: string | null
                    created_at?: string | null
                    fecha_atencion?: string | null
                    id_registro?: string
                    nombres_completos?: string
                    org_id?: string
                    servicio?: string | null
                    telefono?: string | null
                    tiempo_atencion?: number | null
                }
                Relationships: []
            }
            historial_paciente: {
                Row: {
                    created_at: string | null
                    fecha_sesion: string | null
                    id_cita: string | null
                    id_historial: string
                    id_paciente: string
                    motivo_consulta: string | null
                    notas_evolucion: string | null
                    observaciones: string | null
                    org_id: string
                    updated_at: string | null
                }
                Insert: {
                    created_at?: string | null
                    fecha_sesion?: string | null
                    id_cita?: string | null
                    id_historial?: string
                    id_paciente: string
                    motivo_consulta?: string | null
                    notas_evolucion?: string | null
                    observaciones?: string | null
                    org_id: string
                    updated_at?: string | null
                }
                Update: {
                    created_at?: string | null
                    fecha_sesion?: string | null
                    id_cita?: string | null
                    id_historial?: string
                    id_paciente?: string
                    motivo_consulta?: string | null
                    notas_evolucion?: string | null
                    observaciones?: string | null
                    org_id?: string
                    updated_at?: string | null
                }
                Relationships: []
            }
            ideas: {
                Row: {
                    autor_id: string | null
                    created_at: string | null
                    detalle_idea: string | null
                    fecha_idea: string | null
                    id_idea: string
                    idea_principal: string
                    impacto: string | null
                    org_id: string
                }
                Insert: {
                    autor_id?: string | null
                    created_at?: string | null
                    detalle_idea?: string | null
                    fecha_idea?: string | null
                    id_idea?: string
                    idea_principal: string
                    impacto?: string | null
                    org_id: string
                }
                Update: {
                    autor_id?: string | null
                    created_at?: string | null
                    detalle_idea?: string | null
                    fecha_idea?: string | null
                    id_idea?: string
                    idea_principal?: string
                    impacto?: string | null
                    org_id?: string
                }
                Relationships: []
            }
            inventario: {
                Row: {
                    cantidad_actual: number | null
                    created_at: string | null
                    estado_stock: Database["public"]["Enums"]["estado_stock"] | null
                    id_producto: string
                    nombre_producto: string
                    org_id: string
                    precio_costo: number | null
                    precio_venta: number | null
                    proveedor: string | null
                    sku_codigo: string | null
                    updated_at: string | null
                }
                Insert: {
                    cantidad_actual?: number | null
                    created_at?: string | null
                    estado_stock?: Database["public"]["Enums"]["estado_stock"] | null
                    id_producto?: string
                    nombre_producto: string
                    org_id: string
                    precio_costo?: number | null
                    precio_venta?: number | null
                    proveedor?: string | null
                    sku_codigo?: string | null
                    updated_at?: string | null
                }
                Update: {
                    cantidad_actual?: number | null
                    created_at?: string | null
                    estado_stock?: Database["public"]["Enums"]["estado_stock"] | null
                    id_producto?: string
                    nombre_producto?: string
                    org_id?: string
                    precio_costo?: number | null
                    precio_venta?: number | null
                    proveedor?: string | null
                    sku_codigo?: string | null
                    updated_at?: string | null
                }
                Relationships: []
            }
            membresias: {
                Row: {
                    activo: boolean | null
                    created_at: string | null
                    id_membresia: string
                    org_id: string
                    rol_en_org: Database["public"]["Enums"]["rol_usuario"]
                    updated_at: string | null
                    user_id: string
                }
                Insert: {
                    activo?: boolean | null
                    created_at?: string | null
                    id_membresia?: string
                    org_id: string
                    rol_en_org: Database["public"]["Enums"]["rol_usuario"]
                    updated_at?: string | null
                    user_id: string
                }
                Update: {
                    activo?: boolean | null
                    created_at?: string | null
                    id_membresia?: string
                    org_id?: string
                    rol_en_org?: Database["public"]["Enums"]["rol_usuario"]
                    updated_at?: string | null
                    user_id?: string
                }
                Relationships: []
            }
            organizaciones: {
                Row: {
                    created_at: string | null
                    estado: Database["public"]["Enums"]["estado_org"] | null
                    id_org: string
                    nombre_org: string
                    updated_at: string | null
                }
                Insert: {
                    created_at?: string | null
                    estado?: Database["public"]["Enums"]["estado_org"] | null
                    id_org?: string
                    nombre_org: string
                    updated_at?: string | null
                }
                Update: {
                    created_at?: string | null
                    estado?: Database["public"]["Enums"]["estado_org"] | null
                    id_org?: string
                    nombre_org?: string
                    updated_at?: string | null
                }
                Relationships: []
            }
            pacientes: {
                Row: {
                    created_at: string | null
                    estado_tratamiento: Database["public"]["Enums"]["estado_tratamiento"] | null
                    fecha_fin_atencion: string | null
                    fecha_inicio_atencion: string | null
                    id_cliente: string
                    id_paciente: string
                    org_id: string
                    tipo_atencion: string | null
                    updated_at: string | null
                }
                Insert: {
                    created_at?: string | null
                    estado_tratamiento?: Database["public"]["Enums"]["estado_tratamiento"] | null
                    fecha_fin_atencion?: string | null
                    fecha_inicio_atencion?: string | null
                    id_cliente: string
                    id_paciente?: string
                    org_id: string
                    tipo_atencion?: string | null
                    updated_at?: string | null
                }
                Update: {
                    created_at?: string | null
                    estado_tratamiento?: Database["public"]["Enums"]["estado_tratamiento"] | null
                    fecha_fin_atencion?: string | null
                    fecha_inicio_atencion?: string | null
                    id_cliente?: string
                    id_paciente?: string
                    org_id?: string
                    tipo_atencion?: string | null
                    updated_at?: string | null
                }
                Relationships: []
            }
            pacientes_terapeutas: {
                Row: {
                    activo: boolean | null
                    created_at: string | null
                    fecha_asignacion: string | null
                    fecha_fin: string | null
                    id_paciente: string
                    org_id: string
                    terapeuta_id: string
                }
                Insert: {
                    activo?: boolean | null
                    created_at?: string | null
                    fecha_asignacion?: string | null
                    fecha_fin?: string | null
                    id_paciente: string
                    org_id: string
                    terapeuta_id: string
                }
                Update: {
                    activo?: boolean | null
                    created_at?: string | null
                    fecha_asignacion?: string | null
                    fecha_fin?: string | null
                    id_paciente?: string
                    org_id?: string
                    terapeuta_id?: string
                }
                Relationships: []
            }
            pacientes_usuarios: {
                Row: {
                    created_at: string | null
                    id_paciente: string
                    org_id: string
                    user_id: string
                }
                Insert: {
                    created_at?: string | null
                    id_paciente: string
                    org_id: string
                    user_id: string
                }
                Update: {
                    created_at?: string | null
                    id_paciente?: string
                    org_id?: string
                    user_id?: string
                }
                Relationships: []
            }
            perfiles: {
                Row: {
                    activo: boolean | null
                    created_at: string | null
                    id: string
                    nombre_completo: string | null
                    updated_at: string | null
                }
                Insert: {
                    activo?: boolean | null
                    created_at?: string | null
                    id: string
                    nombre_completo?: string | null
                    updated_at?: string | null
                }
                Update: {
                    activo?: boolean | null
                    created_at?: string | null
                    id?: string
                    nombre_completo?: string | null
                    updated_at?: string | null
                }
                Relationships: []
            }
            planes_suscripcion: {
                Row: {
                    created_at: string | null
                    estado: Database["public"]["Enums"]["estado_plan"] | null
                    id_plan: string
                    limites_json: Json | null
                    nombre_plan: string
                    precio_mensual: number
                }
                Insert: {
                    created_at?: string | null
                    estado?: Database["public"]["Enums"]["estado_plan"] | null
                    id_plan?: string
                    limites_json?: Json | null
                    nombre_plan: string
                    precio_mensual?: number
                }
                Update: {
                    created_at?: string | null
                    estado?: Database["public"]["Enums"]["estado_plan"] | null
                    id_plan?: string
                    limites_json?: Json | null
                    nombre_plan?: string
                    precio_mensual?: number
                }
                Relationships: []
            }
            servicios: {
                Row: {
                    created_at: string | null
                    descripcion: string | null
                    duracion_min: number | null
                    estado: boolean | null
                    id_servicio: string
                    nombre_servicio: string
                    org_id: string
                    precio_unitario: number | null
                    tipo_servicio: string | null
                    updated_at: string | null
                }
                Insert: {
                    created_at?: string | null
                    descripcion?: string | null
                    duracion_min?: number | null
                    estado?: boolean | null
                    id_servicio?: string
                    nombre_servicio: string
                    org_id: string
                    precio_unitario?: number | null
                    tipo_servicio?: string | null
                    updated_at?: string | null
                }
                Update: {
                    created_at?: string | null
                    descripcion?: string | null
                    duracion_min?: number | null
                    estado?: boolean | null
                    id_servicio?: string
                    nombre_servicio?: string
                    org_id?: string
                    precio_unitario?: number | null
                    tipo_servicio?: string | null
                    updated_at?: string | null
                }
                Relationships: []
            }
            suscripciones: {
                Row: {
                    created_at: string | null
                    estado_suscripcion: Database["public"]["Enums"]["estado_suscripcion"] | null
                    fecha_fin: string | null
                    fecha_inicio: string | null
                    id_plan: string
                    id_suscripcion: string
                    org_id: string
                    updated_at: string | null
                }
                Insert: {
                    created_at?: string | null
                    estado_suscripcion?: Database["public"]["Enums"]["estado_suscripcion"] | null
                    fecha_fin?: string | null
                    fecha_inicio?: string | null
                    id_plan: string
                    id_suscripcion?: string
                    org_id: string
                    updated_at?: string | null
                }
                Update: {
                    created_at?: string | null
                    estado_suscripcion?: Database["public"]["Enums"]["estado_suscripcion"] | null
                    fecha_fin?: string | null
                    fecha_inicio?: string | null
                    id_plan?: string
                    id_suscripcion?: string
                    org_id?: string
                    updated_at?: string | null
                }
                Relationships: []
            }
        }
        Views: {
            vw_agenda_diaria: {
                Row: {
                    estado_cita: Database["public"]["Enums"]["estado_cita"] | null
                    fecha_hora: string | null
                    nombre_paciente: string | null
                    nombre_servicio: string | null
                    nombre_terapeuta: string | null
                    org_id: string | null
                }
                Relationships: []
            }
            vw_pacientes_activos: {
                Row: {
                    estado_tratamiento: Database["public"]["Enums"]["estado_tratamiento"] | null
                    fecha_inicio_atencion: string | null
                    nombres_completos: string | null
                    org_id: string | null
                }
                Relationships: []
            }
        }
        Functions: {
            get_my_role: {
                Args: { current_org_id: string }
                Returns: Database["public"]["Enums"]["rol_usuario"]
            }
            is_member: {
                Args: { current_org_id: string }
                Returns: boolean
            }
        }
        Enums: {
            estado_cita: "pendiente" | "confirmada" | "realizada" | "cancelada" | "no_asistio"
            estado_org: "activo" | "inactivo" | "suspendido"
            estado_plan: "activo" | "obsoleto"
            estado_stock: "disponible" | "bajo" | "agotado"
            estado_suscripcion: "trial" | "activa" | "pausada" | "cancelada"
            estado_tratamiento: "activo" | "alta" | "abandono" | "en_espera"
            rol_usuario: "admin" | "terapeuta" | "recepcion" | "paciente"
        }
        CompositeTypes: {
            [_ in never]: never
        }
    }
}

export type Tables<T extends keyof Database["public"]["Tables"]> = Database["public"]["Tables"][T]["Row"]
export type Enums<T extends keyof Database["public"]["Enums"]> = Database["public"]["Enums"][T]
export type Views<T extends keyof Database["public"]["Views"]> = Database["public"]["Views"][T]["Row"]
