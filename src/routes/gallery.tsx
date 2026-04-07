import { GalleryPage } from '#/pages/gallery/GalleryPage'
import { LoadingPage } from '#/pages/common/LoadingPage'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/gallery')({
  component: GalleryPage,
  pendingComponent: () => <LoadingPage />,
})
