import { ProjectsPage } from '#/pages/projects/ProjectsPage'
import { LoadingPage } from '#/pages/common/LoadingPage'
import { createFileRoute } from '@tanstack/react-router'
import { z } from 'zod'

const searchSchema = z.object({
  experienceId: z.string().optional(),
})

export const Route = createFileRoute('/projects')({
  component: ProjectsPage,
  pendingComponent: () => <LoadingPage />,
  validateSearch: searchSchema,
})
