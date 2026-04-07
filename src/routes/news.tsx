import { NewsPage } from '#/pages/news/NewsPage'
import { LoadingPage } from '#/pages/common/LoadingPage'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/news')({
  component: NewsPage,
  pendingComponent: () => <LoadingPage />,
})
