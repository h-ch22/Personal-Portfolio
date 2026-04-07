import yujee from '@/assets/images/yujee.png'

import { Link } from '@tanstack/react-router'
import { Button } from '../ui/button'
import { LogOutIcon, MenuIcon, SearchIcon, UserIcon, XIcon } from 'lucide-react'
import type { Theme } from '#/types/theme'
import { useState } from 'react'
import AuthDialog from '../auth/AuthDialog'
import { useAuthStore } from '#/stores/use-auth-store'
import MenuDialog from './MenuDialog'

export default function Header({
  theme,
  IconMap,
  onThemeButtonClick,
}: {
  theme: Theme
  IconMap: Record<Theme, React.FC<{}>>
  onThemeButtonClick: () => void
}) {
  const [showAuthDialog, setShowAuthDialog] = useState(false)
  const [showMenu, setShowMenu] = useState(false)

  const user = useAuthStore((user) => user.user)

  const CurrentIcon = IconMap[theme]

  return (
    <header className="fixed left-0 right-0 top-4 z-50 mx-auto w-[calc(100%-2rem)] rounded-2xl bg-background/50 px-4 py-2 shadow-lg backdrop-blur-lg transition-all">
      <div className="flex flex-row justify-between items-center w-full">
        <Link to="/">
          <div className="flex flex-row tracking-widest items-center font-semibold">
            <img src={yujee} alt="Yujee Catherine" className="h-16 w-16" />

            <div className="hidden font-great-vibes text-xl sm:inline-flex">
              {'Yujee Catherine'}
            </div>
          </div>
        </Link>

        <div className="flex flex-row items-center gap-4">
          <Button className="hidden sm:inline-flex" variant="ghost" size="icon">
            <SearchIcon />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => {
              setShowMenu(false)
              setShowAuthDialog((prev) => !prev)
            }}
          >
            {showAuthDialog ? (
              <XIcon />
            ) : user === null ? (
              <UserIcon />
            ) : (
              <LogOutIcon />
            )}
          </Button>

          <Button
            variant="ghost"
            size="icon"
            onClick={() => onThemeButtonClick()}
          >
            <CurrentIcon />
          </Button>

          <Button
            variant="ghost"
            size="icon"
            onClick={() => {
              setShowAuthDialog(false)
              setShowMenu((prev) => !prev)
            }}
          >
            {showMenu ? <XIcon /> : <MenuIcon />}
          </Button>
        </div>
      </div>

      {showAuthDialog && (
        <div className="absolute top-full right-4 mt-2 bg-background rounded-xl shadow-lg p-4 backdrop-blur-lg">
          <AuthDialog />
        </div>
      )}

      {showMenu && (
        <div className="absolute top-full right-0 mt-2 bg-background rounded-xl shadow-lg p-4 backdrop-blur-lg">
          <MenuDialog onClose={() => setShowMenu(false)} />
        </div>
      )}
    </header>
  )
}
