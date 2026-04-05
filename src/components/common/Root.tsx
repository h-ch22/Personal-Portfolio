import { TanStackRouterDevtoolsPanel } from '@tanstack/react-router-devtools'
import { TanStackDevtools } from '@tanstack/react-devtools'
import { TooltipProvider } from '#/components/ui/tooltip'

import Footer from '#/components/common/Footer'
import Header from '#/components/common/Header'

import TanStackQueryProvider from '@/integrations/tanstack-query/root-provider'
import TanStackQueryDevtools from '@/integrations/tanstack-query/devtools'
import { HeadContent, Outlet, Scripts } from '@tanstack/react-router'
import { useEffect, useState } from 'react'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
} from '#/components/ui/dialog'
import ThemeSelectionDialogContents from '#/components/dialogs/ThemeSelectionContents'
import { useTheme } from '#/hooks/use-theme.tsx'
import { Toaster } from '../ui/sonner'
import { auth } from '@/lib/firebase'
import { onAuthStateChanged } from 'firebase/auth'
import { useAuthStore } from '#/stores/use-auth-store'
import { GlobalAlertDialog } from './GlobalAlertDialog'
import { getUserInfo } from '#/api/auth/auth'

export default function RootDocument() {
  const [showThemeDialog, setShowThemeDialog] = useState(false)
  const { theme, setTheme, IconMap } = useTheme()

  useEffect(() => {
    if (auth === null) return

    const unSubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        const userData = await getUserInfo(user.uid)
        useAuthStore.setState({
          user: user,
          isAdmin: userData?.isAdmin || false,
          userName: userData?.displayName || null,
        })
      } else {
        useAuthStore.setState({
          user: null,
          isAdmin: false,
          userName: null,
        })
      }
    })

    return () => unSubscribe()
  }, [])

  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <HeadContent />
      </head>
      <body className="font-pretendard antialiased">
        <TooltipProvider>
          <TanStackQueryProvider>
            <div className="flex flex-col min-h-screen pt-32">
              <Header
                onThemeButtonClick={() => setShowThemeDialog((prev) => !prev)}
                IconMap={IconMap}
                theme={theme}
              />

              <main className="grow flex flex-col">
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
                TanStackQueryDevtools,
              ]}
            />
          </TanStackQueryProvider>
        </TooltipProvider>
        <Scripts />

        <Dialog
          open={showThemeDialog}
          onOpenChange={(open) => setShowThemeDialog(open)}
        >
          <DialogContent>
            <DialogHeader>Theme Selection</DialogHeader>
            <DialogDescription>
              You can change the overall appearance of this website through
              themes. Please select the option below that is most comfortable to
              view.
            </DialogDescription>
            <ThemeSelectionDialogContents theme={theme} setTheme={setTheme} />
          </DialogContent>
        </Dialog>
      </body>
    </html>
  )
}
