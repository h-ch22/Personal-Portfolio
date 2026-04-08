import type { Theme } from '#/types/theme'
import React, { useEffect, useState } from 'react'
import { SunMoonIcon, SunIcon, MoonIcon } from 'lucide-react'

export function useTheme() {
  const [theme, setTheme] = useState<Theme>(() => {
    return (localStorage.getItem('theme') as Theme) || 'System'
  })

  const SystemIcon = () => <SunMoonIcon />

  const LightIcon = () => <SunIcon />

  const DarkIcon = () => <MoonIcon />

  const IconMap: Record<Theme, React.FC<{}>> = {
    Light: LightIcon,
    Dark: DarkIcon,
    System: SystemIcon,
  }

  useEffect(() => {
    localStorage.setItem('theme', theme)
    const root = window.document.documentElement

    const applyTheme = (isDark: boolean) => {
      if (isDark) {
        root.classList.add('dark')
      } else {
        root.classList.remove('dark')
      }
    }

    if (theme === 'System') {
      const isPrefersDark = window.matchMedia('(prefers-color-scheme: dark)')
      applyTheme(isPrefersDark.matches)

      const handleSystemChange = (e: MediaQueryListEvent) =>
        applyTheme(e.matches)
      isPrefersDark.addEventListener('change', handleSystemChange)

      return () =>
        isPrefersDark.removeEventListener('change', handleSystemChange)
    } else {
      applyTheme(theme === 'Dark')
    }
  }, [theme])

  return { theme, setTheme, IconMap }
}
