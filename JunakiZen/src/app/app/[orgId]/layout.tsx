import { OrgProvider } from '@/contexts/org-context'
import { Sidebar } from '@/components/layout/sidebar'

interface AppLayoutProps {
    children: React.ReactNode
    params: Promise<{ orgId: string }>
}

export default async function AppLayout({ children, params }: AppLayoutProps) {
    const { orgId } = await params

    return (
        <OrgProvider orgId={orgId}>
            <div className="min-h-screen flex bg-muted/30">
                <Sidebar />
                <main className="flex-1 lg:ml-0 p-4 lg:p-8 pt-16 lg:pt-8">
                    {children}
                </main>
            </div>
        </OrgProvider>
    )
}
