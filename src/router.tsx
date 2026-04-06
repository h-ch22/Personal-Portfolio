import {
  createRouter as createTanStackRouter,
  Navigate,
} from '@tanstack/react-router'
import { routeTree } from './routeTree.gen'

import { getContext } from './integrations/tanstack-query/root-provider'

export function getRouter() {
  const router = createTanStackRouter({
    routeTree,

    context: getContext(),

    scrollRestoration: true,
    defaultPreload: 'intent',
    defaultPreloadStaleTime: 0,
    defaultErrorComponent: ({ error }: { error: any }) => {
      let statusCode = 'Unknown'

      if (error.response) {
        statusCode = error.response.status
      } else if (error.code) {
        statusCode = error.code
      }

      return (
        <Navigate
          to="/error"
          state={{
            errorCode: statusCode,
            errorMessage: error.message || 'An unknown error occurred',
          }}
          replace
          viewTransition
        />
      )
    },
  })

  return router
}

declare module '@tanstack/react-router' {
  interface Register {
    router: ReturnType<typeof getRouter>
  }

  interface HistoryState {
    errorCode?: number | string
    errorMessage?: string
  }
}
