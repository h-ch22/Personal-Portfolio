import { PlusIcon, type LucideIcon } from 'lucide-react'
import { Separator } from '../ui/separator'
import { Button } from '../ui/button'
import { useAuthStore } from '#/stores/use-auth-store'

const BoardHeader = ({
  title,
  Icon,
  onAddButtonClick,
}: {
  title: string
  Icon: LucideIcon
  onAddButtonClick: () => void
}) => {
  const user = useAuthStore((state) => state.user)
  const isAdmin = useAuthStore((state) => state.isAdmin)

  return (
    <div className="w-full flex flex-col justify-center text-4xl font-bold gap-4">
      <div className="flex flex-row items-center justify-between text-foreground">
        <div className="flex flex-row items-center gap-2">
          <Icon className="w-8 h-8" />
          {title}
        </div>

        {user && isAdmin && (
          <Button variant="outline" onClick={onAddButtonClick}>
            <PlusIcon />
          </Button>
        )}
      </div>

      <Separator />
    </div>
  )
}

export { BoardHeader }
