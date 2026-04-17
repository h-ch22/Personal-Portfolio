import { Link } from '@tanstack/react-router'
import {
  BookIcon,
  GraduationCapIcon,
  ImageIcon,
  LaptopMinimalCheckIcon,
  NewspaperIcon,
  ShieldIcon,
  SproutIcon,
  TrophyIcon,
} from 'lucide-react'
import { useAuthStore } from '#/stores/use-auth-store'

const MENU_LIST = [
  { name: 'Awards', to: '/awards', icon: TrophyIcon },
  { name: 'Education', to: '/education', icon: GraduationCapIcon },
  { name: 'Experience', to: '/experience', icon: SproutIcon },
  { name: 'Gallery', to: '/gallery', icon: ImageIcon },
  { name: 'News', to: '/news', icon: NewspaperIcon },
  { name: 'Projects', to: '/projects', icon: LaptopMinimalCheckIcon },
  { name: 'Publications', to: '/publications', icon: BookIcon },
]

export default function MenuDialog({ onClose }: { onClose: () => void }) {
  const isAdmin = useAuthStore((s) => s.isAdmin)

  return (
    <div className="grid grid-cols-3 md:grid-cols-7 gap-2">
      {MENU_LIST.map(({ name, to, icon: Icon }) => (
        <Link to={to} key={name} onClick={onClose} viewTransition={true}>
          <div className="flex flex-col justify-center items-center gap-1.5 rounded-lg p-3 text-foreground text-center hover:bg-accent transition-colors">
            <Icon className="w-5 h-5" />
            <span className="text-sm">{name}</span>
          </div>
        </Link>
      ))}

      {isAdmin && (
        <Link to="/admin" onClick={onClose} viewTransition={true}>
          <div className="flex flex-col justify-center items-center gap-1.5 rounded-lg p-3 text-foreground text-center hover:bg-accent transition-colors">
            <ShieldIcon className="w-5 h-5" />
            <span className="text-sm">Admin</span>
          </div>
        </Link>
      )}
    </div>
  )
}
