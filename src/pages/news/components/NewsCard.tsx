import { format } from 'date-fns'
import { CalendarIcon, EditIcon, ExternalLinkIcon, FolderGitIcon, ImagesIcon, TrashIcon } from 'lucide-react'

import { Badge } from '#/components/ui/badge'
import { Button } from '#/components/ui/button'
import { ButtonGroup } from '#/components/ui/button-group'
import {
  Card,
  CardAction,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from '#/components/ui/card'
import { useAuthStore } from '#/stores/use-auth-store'
import type { News } from '#/types/news'
import { CATEGORY_VARIANT } from '#/types/news'
import { CATEGORY_ICON } from '#/lib/news'

const NewsCard = ({
  data,
  onCardClick,
  onModifyButtonClick,
  onDeleteButtonClick,
  onViewProject,
}: {
  data: News
  onCardClick: (data: News) => void
  onModifyButtonClick: (data: News) => void
  onDeleteButtonClick: (data: News) => void
  onViewProject?: () => void
}) => {
  const user = useAuthStore((state) => state.user)
  const isAdmin = useAuthStore((state) => state.isAdmin)

  const thumbnail = data.images[0]?.url

  return (
    <Card
      className="overflow-hidden cursor-pointer hover:shadow-md transition-shadow gap-0"
      onClick={() => onCardClick(data)}
    >
      {thumbnail && (
        <div className="w-full h-44 bg-muted overflow-hidden">
          <img
            src={thumbnail}
            alt={data.title}
            className="w-full h-full object-cover"
          />
        </div>
      )}

      <CardHeader className="pt-3 pb-1">
        <div className="flex flex-row items-start justify-between gap-2">
          <CardTitle className="text-base line-clamp-2 leading-snug flex-1">
            {data.title}
          </CardTitle>
          <Badge variant={CATEGORY_VARIANT[data.category]} className="shrink-0 gap-1">
            {CATEGORY_ICON[data.category]}
            {data.category}
          </Badge>
        </div>
      </CardHeader>

      <CardContent className="pb-2 flex flex-col gap-1">
        <div className="flex flex-row items-center gap-3 text-xs text-muted-foreground">
          <div className="flex items-center gap-1">
            <CalendarIcon className="w-3.5 h-3.5" />
            <span>{format(data.date, 'MMM yyyy')}</span>
          </div>
          {data.images.length > 0 && (
            <div className="flex items-center gap-1">
              <ImagesIcon className="w-3.5 h-3.5" />
              <span>{data.images.length}</span>
            </div>
          )}
          {data.link && (
            <div className="flex items-center gap-1">
              <ExternalLinkIcon className="w-3.5 h-3.5" />
              <span>Link</span>
            </div>
          )}
        </div>
        <p className="text-xs text-muted-foreground line-clamp-2">
          {data.description}
        </p>
      </CardContent>

      {(onViewProject || (user && isAdmin)) && (
        <CardFooter onClick={(e) => e.stopPropagation()}>
          <CardAction>
            <ButtonGroup>
              {onViewProject && (
                <Button variant="outline" size="sm" onClick={onViewProject}>
                  <FolderGitIcon className="w-3.5 h-3.5" />
                  View Project
                </Button>
              )}
              {user && isAdmin && (
                <>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => onModifyButtonClick(data)}
                  >
                    <EditIcon className="w-3.5 h-3.5" />
                    Edit
                  </Button>
                  <Button
                    variant="destructive"
                    size="sm"
                    onClick={() => onDeleteButtonClick(data)}
                  >
                    <TrashIcon className="w-3.5 h-3.5" />
                    Delete
                  </Button>
                </>
              )}
            </ButtonGroup>
          </CardAction>
        </CardFooter>
      )}
    </Card>
  )
}

export { NewsCard }
