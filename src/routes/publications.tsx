import { LoadingPage } from '#/pages/common/LoadingPage'
import { PublicationsPage } from '#/pages/publications/PublicationsPage'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/publications')({
  component: PublicationsPage,
  pendingComponent: () => <LoadingPage />,
})
