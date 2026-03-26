import yujee from '@/assets/images/yujee.png'

import { Link } from '@tanstack/react-router'
import { Button } from '../ui/button'
import { LogOutIcon, MenuIcon, UserIcon, XIcon } from 'lucide-react'
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
  onThemeButtonClick: () => void,
}) {
  const [showAuthDialog, setShowAuthDialog] = useState(false);
  const [showMenu, setShowMenu] = useState(false);

  const user = useAuthStore((user) => user.user);
  
  const CurrentIcon = IconMap[theme];

  return (
    <header className="w-full relative flex flex-row justify-between items-center z-50">
      <Link to="/">
        <div className='flex flex-row items-center font-semibold text-primary'>
          <img src={yujee} alt="Yujee Catherine" className="h-16 w-16" />
          { "Yujee Catherine" }
        </div>
      </Link>

      <div className="flex flex-row items-center gap-4">
        <Button variant="ghost" size="icon" onClick={() => setShowAuthDialog((prev) => !prev)}>
          { showAuthDialog
            ? <XIcon />
            : user === null
              ? <UserIcon />
              : <LogOutIcon />
          }
        </Button>

        <Button variant="ghost" size="icon" onClick={() => onThemeButtonClick()}>
          <CurrentIcon />
        </Button>

        <Button variant="ghost" size="icon" onClick={() => setShowMenu((prev) => !prev)}>
          { showMenu
            ? <XIcon />
            : <MenuIcon />
          }
        </Button>
      </div>


      { showAuthDialog && (
          <div className="absolute top-full right-4 mt-2 bg-background rounded-xl shadow-lg p-4 backdrop-blur-lg">
              <AuthDialog />
          </div>
      )}

      { showMenu && (
            <div className="absolute top-full right-4 mt-2 w-96 max-w-96 bg-background rounded-xl shadow-lg p-4 backdrop-blur-lg">
              <MenuDialog />
          </div>
      )}

    </header>
  )
}
