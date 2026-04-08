import {
  Navigate,
  createRootRouteWithContext,
} from '@tanstack/react-router'

import RootDocument from '#/components/common/Root'

import type { QueryClient } from '@tanstack/react-query'

interface MyRouterContext {
  queryClient: QueryClient
}

export const Route = createRootRouteWithContext<MyRouterContext>()({
  component: RootDocument,
  notFoundComponent: () => (
    <Navigate
      to="/error"
      state={{
        errorCode: 404,
        errorMessage: "Page not found",
      }}
    />
  )
})