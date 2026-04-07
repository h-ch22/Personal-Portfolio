import { ProjectsPage } from '#/pages/projects/ProjectsPage'
import { LoadingPage } from '#/pages/common/LoadingPage'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/projects')({
  component: ProjectsPage,
  pendingComponent: () => <LoadingPage />,
})
