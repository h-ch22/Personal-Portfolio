import { format } from 'date-fns'
import {
  BookOpenIcon,
  BuildingIcon,
  CalendarIcon,
  EditIcon,
  FolderGitIcon,
  GiftIcon,
  MedalIcon,
  SparklesIcon,
  TrashIcon,
  TrophyIcon,
} from 'lucide-react'

import { Badge } from '#/components/ui/badge'
import { Button } from '#/components/ui/button'
import { useAuthStore } from '#/stores/use-auth-store'
import type { Award, AwardType } from '#/types/award'

const TYPE_ICON: Record<AwardType, React.ReactNode> = {
  Competition: <TrophyIcon className="w-4 h-4" />,
  Academic: <BookOpenIcon className="w-4 h-4" />,
  Scholarship: <GiftIcon className="w-4 h-4" />,
  Recognition: <SparklesIcon className="w-4 h-4" />,
  Other: <MedalIcon className="w-4 h-4" />,
}

const TYPE_COLOR: Record<AwardType, string> = {
  Competition: 'text-yellow-600 bg-yellow-50 dark:bg-yellow-950 dark:text-yellow-400',
  Academic: 'text-blue-600 bg-blue-50 dark:bg-blue-950 dark:text-blue-400',
  Scholarship: 'text-green-600 bg-green-50 dark:bg-green-950 dark:text-green-400',
  Recognition: 'text-purple-600 bg-purple-50 dark:bg-purple-950 dark:text-purple-400',
  Other: 'text-zinc-600 bg-zinc-100 dark:bg-zinc-800 dark:text-zinc-400',
}

const AwardListItem = ({
  data,
  onModifyButtonClick,
  onDeleteButtonClick,
  onViewProject,
  showAdminActions = true,
}: {
  data: Award
  onModifyButtonClick?: (data: Award) => void
  onDeleteButtonClick?: (data: Award) => void
  onViewProject?: () => void
  showAdminActions?: boolean
}) => {
  const user = useAuthStore((state) => state.user)
  const isAdmin = useAuthStore((state) => state.isAdmin)

  return (
    <div className="flex items-start gap-3 rounded-lg border bg-card px-4 py-3 mb-2">
      <div className={`mt-0.5 shrink-0 rounded-md p-1.5 ${TYPE_COLOR[data.type]}`}>
        {TYPE_ICON[data.type]}
      </div>

      <div className="flex-1 min-w-0">
        <div className="flex items-start justify-between gap-2">
          <span className="font-semibold text-sm leading-snug">{data.title}</span>
          <Badge variant="secondary" className="shrink-0 text-xs hidden sm:flex">
            {data.type}
          </Badge>
        </div>

        <div className="flex flex-wrap items-center gap-x-3 gap-y-0.5 text-xs text-muted-foreground mt-1">
          <span className="flex items-center gap-1">
            <BuildingIcon className="w-3 h-3" />
            {data.issuer}
          </span>
          <span className="flex items-center gap-1">
            <CalendarIcon className="w-3 h-3" />
            {format(data.date, 'MMM yyyy')}
          </span>
        </div>

        {data.description && (
          <p className="text-xs text-muted-foreground mt-1.5 line-clamp-2">
            {data.description}
          </p>
        )}

        {(onViewProject || (showAdminActions && user && isAdmin)) && (
          <div className="flex items-center gap-1.5 mt-2">
            {onViewProject && (
              <Button variant="outline" size="sm" className="h-7 text-xs gap-1" onClick={onViewProject}>
                <FolderGitIcon className="w-3 h-3" />
                View Project
              </Button>
            )}
            {showAdminActions && user && isAdmin && (
              <>
                <Button
                  variant="outline"
                  size="sm"
                  className="h-7 text-xs gap-1"
                  onClick={() => onModifyButtonClick?.(data)}
                >
                  <EditIcon className="w-3 h-3" />
                  Edit
                </Button>
                <Button
                  variant="destructive"
                  size="sm"
                  className="h-7 text-xs gap-1"
                  onClick={() => onDeleteButtonClick?.(data)}
                >
                  <TrashIcon className="w-3 h-3" />
                  Delete
                </Button>
              </>
            )}
          </div>
        )}
      </div>
    </div>
  )
}

export { AwardListItem }
