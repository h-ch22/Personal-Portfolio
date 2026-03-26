import {
  Navigate,
  createRootRouteWithContext,
} from '@tanstack/react-router'

import appCss from '../styles.css?url'
import RootDocument from '#/components/common/Root'

import type { QueryClient } from '@tanstack/react-query'

interface MyRouterContext {
  queryClient: QueryClient
}

export const Route = createRootRouteWithContext<MyRouterContext>()({
  head: () => ({
    meta: [
      {
        charSet: 'utf-8',
      },
      {
        name: 'viewport',
        content: 'width=device-width, initial-scale=1',
      },
      {
        title: 'Yujee Catherine',
      },
    ],
    links: [
      {
        rel: 'stylesheet',
        href: appCss,
      },
    ],
  }),
  shellComponent: () => <RootDocument />,
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