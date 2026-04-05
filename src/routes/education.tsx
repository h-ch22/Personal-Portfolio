import { EducationPage } from '#/pages/education/EducationPage'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/education')({
  component: EducationPage,
})
