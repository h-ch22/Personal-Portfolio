import { LoadingPage } from '#/pages/common/LoadingPage'
import { ExperiencePage } from '#/pages/experience/ExperiencePage'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/experience')({
  component: ExperiencePage,
  pendingComponent: () => <LoadingPage />,
})
