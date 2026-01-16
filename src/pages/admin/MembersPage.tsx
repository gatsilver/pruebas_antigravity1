import { useEffect, useState } from 'react'
import { supabase } from '../../supabaseClient'
import { Button } from '../../components/ui/button'
import { Input } from '../../components/ui/input'
import { Plus, Search, Loader2, User, X } from 'lucide-react'

type Profile = {
    id: string
    full_name: string
    role: string
    phone: string | null
}

export default function MembersPage() {
    const [members, setMembers] = useState<Profile[]>([])
    const [loading, setLoading] = useState(true)
    const [searchTerm, setSearchTerm] = useState('')
    const [isModalOpen, setIsModalOpen] = useState(false)
    const [newMember, setNewMember] = useState({ full_name: '', email: '', phone: '', password: '' })
    const [creating, setCreating] = useState(false)

    useEffect(() => {
        fetchMembers()
    }, [])

    const fetchMembers = async () => {
        setLoading(true)
        const { data, error } = await supabase
            .from('profiles')
            .select('*')
            //.eq('role', 'cliente') // Show all users to allow admin promotion/demotion
            .order('created_at', { ascending: false })

        if (error) console.error(error)
        else setMembers(data || [])

        setLoading(false)
    }

    const handleCreateMember = async (e: React.FormEvent) => {
        e.preventDefault()
        setCreating(true)

        try {
            const tempPassword = newMember.password || Math.random().toString(36).slice(-8)

            const { error } = await supabase.functions.invoke('create-user', {
                body: {
                    email: newMember.email,
                    password: tempPassword,
                    full_name: newMember.full_name,
                    phone: newMember.phone
                }
            })

            if (error) throw new Error(error.message || 'Error creating user')

            setTimeout(fetchMembers, 1000)
            setIsModalOpen(false)
            setNewMember({ full_name: '', email: '', phone: '', password: '' })
            console.log('TEST_CREATED_PASSWORD:', tempPassword)
            alert(`Usuario creado exitosamente.\n\nEmail: ${newMember.email}\nContraseña: ${tempPassword}`)
        } catch (err: any) {
            alert('Error: ' + err.message)
        } finally {
            setCreating(false)
        }
    }

    const filteredMembers = members.filter(member =>
        member.full_name.toLowerCase().includes(searchTerm.toLowerCase())
    )



    // ... inside MembersPage component
    const [isMembershipModalOpen, setIsMembershipModalOpen] = useState(false)
    const [selectedMember, setSelectedMember] = useState<Profile | null>(null)
    const [membershipForm, setMembershipForm] = useState({
        type: 'Mensual Estándar',
        months: 1,
        startDate: new Date().toISOString().split('T')[0],
        customEndDate: ''
    })
    const [loadingMembership, setLoadingMembership] = useState(false)

    // ... existing functions ...

    const openMembershipModal = (member: Profile) => {
        setSelectedMember(member)
        setMembershipForm({
            type: 'Mensual Estándar',
            months: 1,
            startDate: new Date().toISOString().split('T')[0],
            customEndDate: ''
        })
        setIsMembershipModalOpen(true)
    }

    const handleAssignMembership = async (e: React.FormEvent) => {
        e.preventDefault()
        if (!selectedMember) return

        setLoadingMembership(true)
        try {
            const startDate = new Date(membershipForm.startDate)
            let endDate = new Date(startDate)

            if (membershipForm.customEndDate) {
                endDate = new Date(membershipForm.customEndDate)
            } else {
                endDate.setMonth(endDate.getMonth() + membershipForm.months)
            }

            const { error } = await supabase.from('memberships').insert({
                user_id: selectedMember.id,
                type: membershipForm.type,
                start_date: startDate.toISOString(),
                end_date: endDate.toISOString(),
                status: 'active'
            })

            if (error) throw error

            alert(`Membresía asignada a ${selectedMember.full_name} correctamente.`)
            setIsMembershipModalOpen(false)
        } catch (err: any) {
            alert('Error al asignar membresía: ' + err.message)
        } finally {
            setLoadingMembership(false)
        }
    }

    const toggleRole = async (member: Profile) => {
        const newRole = member.role === 'admin' ? 'cliente' : 'admin'
        if (!confirm(`¿Estás seguro de cambiar el rol de ${member.full_name} a ${newRole.toUpperCase()}?\n\n(Esto cambiará sus permisos de acceso)`)) return

        try {
            const { error } = await supabase
                .from('profiles')
                .update({ role: newRole })
                .eq('id', member.id)

            if (error) throw error
            fetchMembers() // Refresh list
        } catch (err: any) {
            alert('Error al cambiar rol: ' + err.message)
        }
    }

    // Filter Logic adjustment to show admins too if needed, or just keep filtering clients.
    // Ideally user might want to see Admins too to demote them.
    // Let's modify fetchMembers to get all users or allow filtering.
    // For now, let's keep it simple as currently filtered by 'cliente'. 
    // I will remove the filter .eq('role', 'cliente') in fetchMembers to allow seeing/managing all users.

    return (
        <div className="space-y-6 relative">
            <div className="flex items-center justify-between">
                <h1 className="text-3xl font-bold tracking-tight">Gestión de Miembros</h1>
                <Button onClick={() => setIsModalOpen(true)}>
                    <Plus className="mr-2 h-4 w-4" />
                    Nuevo Miembro
                </Button>
            </div>

            {/* Create Member Modal (Existing) */}
            {isModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
                    <div className="bg-white p-6 rounded-lg w-full max-w-md shadow-xl relative animate-in fade-in zoom-in duration-200">
                        <button
                            onClick={() => setIsModalOpen(false)}
                            className="absolute top-4 right-4 text-slate-400 hover:text-slate-600"
                        >
                            <X className="h-4 w-4" />
                        </button>
                        <h2 className="text-xl font-bold mb-4 text-slate-900">Registrar Nuevo Miembro</h2>
                        <form onSubmit={handleCreateMember} className="space-y-4">
                            <div className="space-y-2">
                                <label className="text-sm font-medium">Nombre Completo</label>
                                <Input required value={newMember.full_name} onChange={(e) => setNewMember({ ...newMember, full_name: e.target.value })} />
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm font-medium">Email</label>
                                <Input type="email" required value={newMember.email} onChange={(e) => setNewMember({ ...newMember, email: e.target.value })} />
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm font-medium">Teléfono</label>
                                <Input value={newMember.phone} onChange={(e) => setNewMember({ ...newMember, phone: e.target.value })} />
                            </div>
                            <div className="pt-4 flex justify-end gap-2">
                                <Button type="button" variant="ghost" onClick={() => setIsModalOpen(false)}>Cancelar</Button>
                                <Button type="submit" disabled={creating} className="bg-slate-900 hover:bg-slate-800">
                                    {creating && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                                    Crear Miembro
                                </Button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* Assign Membership Modal (NEW) */}
            {isMembershipModalOpen && selectedMember && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
                    <div className="bg-white p-6 rounded-lg w-full max-w-md shadow-xl relative animate-in fade-in zoom-in duration-200">
                        <button onClick={() => setIsMembershipModalOpen(false)} className="absolute top-4 right-4 text-slate-400 hover:text-slate-600"><X className="h-4 w-4" /></button>

                        <h2 className="text-xl font-bold mb-4">Asignar Membresía</h2>
                        <h3 className="text-sm text-slate-500 mb-4">Para: <span className="font-semibold text-slate-900">{selectedMember.full_name}</span></h3>

                        <form onSubmit={handleAssignMembership} className="space-y-4">
                            <div className="space-y-2">
                                <label className="text-sm font-medium">Tipo de Plan</label>
                                <select
                                    className="flex h-10 w-full rounded-md border border-slate-200 bg-white px-3 py-2 text-sm"
                                    value={membershipForm.type}
                                    onChange={e => setMembershipForm({ ...membershipForm, type: e.target.value })}
                                >
                                    <option value="Mensual Estándar">Mensual Estándar</option>
                                    <option value="Mensual Ilimitado">Mensual Ilimitado</option>
                                    <option value="Pack 10 Clases">Pack 10 Clases</option>
                                    <option value="Pack 5 Clases">Pack 5 Clases</option>
                                    <option value="Semestral">Semestral</option>
                                </select>
                            </div>

                            <div className="space-y-2">
                                <label className="text-sm font-medium">Fecha de Inicio</label>
                                <Input type="date" value={membershipForm.startDate} onChange={e => setMembershipForm({ ...membershipForm, startDate: e.target.value })} required />
                            </div>

                            <div className="space-y-2">
                                <label className="text-sm font-medium">Duración</label>
                                <div className="flex gap-4">
                                    <label className="flex items-center gap-2 text-sm cursor-pointer">
                                        <input type="radio" name="duration" checked={!membershipForm.customEndDate} onChange={() => setMembershipForm({ ...membershipForm, customEndDate: '' })} />
                                        Por Meses
                                    </label>
                                    <label className="flex items-center gap-2 text-sm cursor-pointer">
                                        <input type="radio" name="duration" checked={!!membershipForm.customEndDate} onChange={() => setMembershipForm({ ...membershipForm, customEndDate: new Date().toISOString().split('T')[0] })} />
                                        Fecha Fin
                                    </label>
                                </div>
                            </div>

                            {!membershipForm.customEndDate ? (
                                <div className="space-y-2">
                                    <label className="text-sm font-medium">Cantidad de Meses</label>
                                    <Input type="number" min="1" value={membershipForm.months} onChange={e => setMembershipForm({ ...membershipForm, months: parseInt(e.target.value) })} required />
                                </div>
                            ) : (
                                <div className="space-y-2">
                                    <label className="text-sm font-medium">Fecha de Finalización</label>
                                    <Input type="date" value={membershipForm.customEndDate} onChange={e => setMembershipForm({ ...membershipForm, customEndDate: e.target.value })} required />
                                </div>
                            )}

                            <div className="pt-4 flex justify-end gap-2">
                                <Button type="button" variant="ghost" onClick={() => setIsMembershipModalOpen(false)}>Cancelar</Button>
                                <Button type="submit" disabled={loadingMembership} className="bg-green-600 hover:bg-green-700">
                                    {loadingMembership && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                                    Confirmar Asignación
                                </Button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            <div className="bg-white rounded-lg border border-slate-200 shadow-sm overflow-hidden">
                <div className="p-4 border-b border-slate-200 flex items-center gap-4">
                    <div className="relative flex-1 max-w-sm">
                        <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-slate-500" />
                        <Input
                            placeholder="Buscar por nombre..."
                            className="pl-9"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>
                </div>

                <div className="relative w-full overflow-auto">
                    <table className="w-full text-sm text-left">
                        <thead className="text-xs text-slate-500 uppercase bg-slate-50 border-b border-slate-200">
                            <tr>
                                <th className="px-6 py-3 font-medium">Miembro</th>
                                <th className="px-6 py-3 font-medium">Rol</th>
                                <th className="px-6 py-3 font-medium">Estado</th>
                                <th className="px-6 py-3 font-medium text-right">Acciones</th>
                            </tr>
                        </thead>
                        <tbody>
                            {loading ? (
                                <tr>
                                    <td colSpan={4} className="px-6 py-8 text-center">
                                        <Loader2 className="h-6 w-6 animate-spin mx-auto text-slate-400" />
                                    </td>
                                </tr>
                            ) : filteredMembers.length === 0 ? (
                                <tr>
                                    <td colSpan={4} className="px-6 py-8 text-center text-slate-500">
                                        No se encontraron miembros
                                    </td>
                                </tr>
                            ) : (
                                filteredMembers.map((member) => (
                                    <tr key={member.id} className="bg-white border-b border-slate-100 hover:bg-slate-50 transition-colors">
                                        <td className="px-6 py-4 font-medium text-slate-900 flex items-center gap-3">
                                            <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center text-slate-500">
                                                <User className="h-4 w-4" />
                                            </div>
                                            <div>
                                                <div className="font-medium">{member.full_name}</div>
                                                <div className="text-xs text-slate-400">{member.phone || 'Sin teléfono'}</div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${member.role === 'admin' ? 'bg-purple-100 text-purple-800' : 'bg-slate-100 text-slate-800'}`}>
                                                {member.role === 'admin' ? 'Administrador' : 'Cliente'}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                                                Activo
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 text-right flex items-center justify-end gap-2">
                                            <Button
                                                variant="outline"
                                                size="sm"
                                                onClick={() => openMembershipModal(member)}
                                            >
                                                Membresía
                                            </Button>
                                            <Button
                                                variant="ghost"
                                                size="sm"
                                                onClick={() => toggleRole(member)}
                                                className="text-xs text-slate-400 hover:text-slate-900"
                                            >
                                                {member.role === 'admin' ? '↓ Cliente' : '↑ Admin'}
                                            </Button>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    )
}
