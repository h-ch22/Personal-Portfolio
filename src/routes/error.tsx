import ErrorPage from '#/pages/common/ErrorPage'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/error')({
    component: ErrorPage,
})
