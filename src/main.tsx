import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { RouterProvider } from '@tanstack/react-router'
import { getRouter } from './router'

const user = import.meta.env.VITE_TARGET_USER

if (user === 'changjin') {
  import('./styles.changjin.css')
} else {
  import('./styles.yujee.css')
}

const rootElement = document.getElementById('root')!

if (!rootElement.innerHTML) {
  const root = createRoot(rootElement)
  root.render(
    <StrictMode>
      <RouterProvider router={getRouter()} />
    </StrictMode>,
  )
}
