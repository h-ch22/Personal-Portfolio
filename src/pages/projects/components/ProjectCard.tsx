import { format } from 'date-fns'
import {
  CalendarIcon,
  EditIcon,
  ExternalLinkIcon,
  GithubIcon,
  ImagesIcon,
  TrashIcon,
} from 'lucide-react'

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
import { TECH_STACK_GROUP_COLORS, type TechStackGroup } from '#/types/techstack'
import type { Project } from '#/types/project'

const ProjectCard = ({
  data,
  onCardClick,
  onModifyButtonClick,
  onDeleteButtonClick,
}: {
  data: Project
  onCardClick: (data: Project) => void
  onModifyButtonClick: (data: Project) => void
  onDeleteButtonClick: (data: Project) => void
}) => {
  const user = useAuthStore((state) => state.user)
  const isAdmin = useAuthStore((state) => state.isAdmin)

  const thumbnail = data.images[0]?.url

  return (
    <Card
      className="overflow-hidden cursor-pointer hover:shadow-md transition-shadow gap-0 flex flex-col"
      onClick={() => onCardClick(data)}
    >
      <div className="w-full h-48 bg-muted overflow-hidden shrink-0">
        {thumbnail ? (
          <img
            src={thumbnail}
            alt={data.title}
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-muted-foreground">
            <ImagesIcon className="w-8 h-8" />
          </div>
        )}
      </div>

      <CardHeader className="pt-3 pb-1">
        <CardTitle className="text-base">
          <div className="flex items-center gap-2">
            {data.logoUrl && (
              <img src={data.logoUrl} alt={data.title} className="w-7 h-7 rounded-md object-contain shrink-0 bg-muted p-0.5" />
            )}
            <span className="line-clamp-1">{data.title}</span>
          </div>
        </CardTitle>
      </CardHeader>

      <CardContent className="pb-2 flex flex-col gap-2 flex-1">
        <div className="flex flex-row items-center gap-3 text-xs text-muted-foreground flex-wrap">
          <div className="flex items-center gap-1">
            <CalendarIcon className="w-3.5 h-3.5" />
            <span>
              {format(data.startDate, 'MMM yyyy')}
              {' – '}
              {data.isOngoing
                ? 'Present'
                : data.endDate
                  ? format(data.endDate, 'MMM yyyy')
                  : '…'}
            </span>
          </div>
          {data.link && (
            <div className="flex items-center gap-1">
              <ExternalLinkIcon className="w-3.5 h-3.5" />
              <span>Link</span>
            </div>
          )}
          {data.githubUrl && (
            <div className="flex items-center gap-1">
              <GithubIcon className="w-3.5 h-3.5" />
              <span>GitHub</span>
            </div>
          )}
        </div>

        {data.techStack.length > 0 && (
          <div className="flex flex-wrap gap-1">
            {data.techStack.slice(0, 5).map((tech, i) => {
              const groupColor = TECH_STACK_GROUP_COLORS[(tech.group ?? 'Other') as TechStackGroup] ?? TECH_STACK_GROUP_COLORS.Other
              return (
                <Badge
                  key={i}
                  variant="outline"
                  className={`flex items-center gap-1 px-1.5 py-0.5 h-auto text-xs border-0 ${groupColor}`}
                >
                  {tech.iconUrl && (
                    <img
                      src={tech.iconUrl}
                      alt={tech.name}
                      className="w-3 h-3 object-contain"
                    />
                  )}
                  {tech.name}
                </Badge>
              )
            })}
            {data.techStack.length > 5 && (
              <Badge variant="outline" className="text-xs px-1.5 py-0.5 h-auto">
                +{data.techStack.length - 5}
              </Badge>
            )}
          </div>
        )}
      </CardContent>

      {user && isAdmin && (
        <CardFooter onClick={(e) => e.stopPropagation()}>
          <CardAction>
            <ButtonGroup>
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
            </ButtonGroup>
          </CardAction>
        </CardFooter>
      )}
    </Card>
  )
}

export { ProjectCard }
