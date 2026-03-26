import { TanStackRouterDevtoolsPanel } from '@tanstack/react-router-devtools'
import { TanStackDevtools } from '@tanstack/react-devtools'
import { TooltipProvider } from '#/components/ui/tooltip'

import Footer from '#/components/common/Footer'
import Header from '#/components/common/Header'

import StoreDevtools from '@/lib/demo-store-devtools'

import TanStackQueryProvider from '@/integrations/tanstack-query/root-provider'
import TanStackQueryDevtools from '@/integrations/tanstack-query/devtools'
import { HeadContent, Outlet, Scripts } from '@tanstack/react-router'
import { useEffect, useState } from 'react'
import { Dialog, DialogContent, DialogDescription, DialogHeader } from '#/components/ui/dialog'
import ThemeSelectionDialogContents from '#/components/dialogs/ThemeSelectionContents'
import { useTheme } from '#/hooks/use-theme.tsx'
import { Toaster } from '../ui/sonner'
import { auth } from "@/lib/firebase"
import { onAuthStateChanged } from 'firebase/auth'
import { toast } from 'sonner'
import { useAuthStore } from '#/stores/use-auth-store'
import { GlobalAlertDialog } from './GlobalAlertDialog'

export default function RootDocument() {
    const [showThemeDialog, setShowThemeDialog] = useState(false);
    const { theme, setTheme, IconMap } = useTheme();
    const { setUser } = useAuthStore();

    useEffect(() => {
        const unSubscribe = onAuthStateChanged(auth, (user) => {
            if(user) {
                toast.success(`Welcome back, ${user.displayName}!`);
            }

            setUser(user);
        });

        return () => unSubscribe();
    }, []);

    return (
        <html lang="en" suppressHydrationWarning>
            <head>
                <HeadContent />
            </head>
            <body className="font-pretendard antialiased">
                <TooltipProvider>
                <TanStackQueryProvider>
                    <div className='flex flex-col min-h-screen'>
                        <Header
                            onThemeButtonClick={() => setShowThemeDialog((prev) => !prev)}
                            IconMap={IconMap}
                            theme={theme}/>
                        
                        <main className="grow">
                            <Outlet />
                        </main>

                        <GlobalAlertDialog />
                        <Toaster />

                        <Footer />
                    </div>

                    <TanStackDevtools
                        config={{
                            position: 'bottom-right',
                        }}
                        plugins={[
                            {
                            name: 'Tanstack Router',
                            render: <TanStackRouterDevtoolsPanel />,
                            },
                            StoreDevtools,
                            TanStackQueryDevtools,
                        ]}
                    />
                </TanStackQueryProvider>
                </TooltipProvider>
                <Scripts />

                <Dialog open={showThemeDialog} onOpenChange={(open) => setShowThemeDialog(open)}>
                    <DialogContent>
                        <DialogHeader>Theme Selection</DialogHeader>
                        <DialogDescription>You can change the overall appearance of this website through themes. Please select the option below that is most comfortable to view.</DialogDescription>
                        <ThemeSelectionDialogContents
                            theme={theme}
                            setTheme={setTheme} />
                    </DialogContent>
                </Dialog>
            </body>
        </html>
    )
}
