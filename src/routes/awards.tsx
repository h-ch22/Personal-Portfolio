import { AwardsPage } from '#/pages/awards/AwardsPage'
import { LoadingPage } from '#/pages/common/LoadingPage'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/awards')({
  component: AwardsPage,
  pendingComponent: () => <LoadingPage />,
})
