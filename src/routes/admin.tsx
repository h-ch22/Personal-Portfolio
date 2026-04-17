import { AdminPage } from '#/pages/admin/AdminPage'
import { LoadingPage } from '#/pages/common/LoadingPage'
import { createFileRoute, redirect } from '@tanstack/react-router'
import { useAuthStore } from '#/stores/use-auth-store'

export const Route = createFileRoute('/admin')({
  beforeLoad: () => {
    const { isAdmin } = useAuthStore.getState()
    if (!isAdmin) {
      throw redirect({ to: '/' })
    }
  },
  component: AdminPage,
  pendingComponent: () => <LoadingPage />,
})
