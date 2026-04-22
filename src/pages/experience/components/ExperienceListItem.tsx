import { format } from 'date-fns'
import { BuildingIcon, CalendarIcon, EditIcon, FolderGitIcon, TrashIcon, UserRoundIcon } from 'lucide-react'

import { Badge } from '#/components/ui/badge'
import { Button } from '#/components/ui/button'
import { ButtonGroup } from '#/components/ui/button-group'
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '#/components/ui/card'
import { useAuthStore } from '#/stores/use-auth-store'
import type { Experience } from '#/types/experience'
import { TECH_STACK_GROUP_COLORS, type TechStackGroup } from '#/types/techstack'
import { EXP_TYPE_ICONS } from '#/lib/experience'
import { groupAndOrderTechStack } from '#/lib/techstack'

const ExperienceListItem = ({
  data,
  onCardClick,
  onModifyButtonClick,
  onDeleteButtonClick,
  onViewProjects,
  linkedProjectCount = 0,
}: {
  data: Experience
  onCardClick: (data: Experience) => void
  onModifyButtonClick: (data: Experience) => void
  onDeleteButtonClick: (data: Experience) => void
  onViewProjects?: () => void
  linkedProjectCount?: number
}) => {
  const user = useAuthStore((state) => state.user)
  const isAdmin = useAuthStore((state) => state.isAdmin)
  const TypeIcon = EXP_TYPE_ICONS[data.type]

  const periodLabel = `${format(data.startDate, 'MMM yyyy')} – ${
    data.isCurrentlyWorking || !data.endDate
      ? 'Present'
      : format(data.endDate, 'MMM yyyy')
  }`

  return (
    <Card
      className="mb-2 gap-2 cursor-pointer hover:bg-accent/50 transition-colors"
      onClick={() => onCardClick(data)}
    >
      <CardHeader>
        <CardTitle>
          <div className="flex flex-row items-center justify-between gap-2">
            <div className="flex items-center gap-3">
              {data.logoUrl && (
                <img
                  src={data.logoUrl}
                  alt={data.title}
                  className="w-10 h-10 rounded-md object-contain shrink-0 bg-muted p-1"
                />
              )}
              <span className="text-xl">{data.title}</span>
            </div>
            <Badge>
              <TypeIcon />
              {data.type}
            </Badge>
          </div>
        </CardTitle>
      </CardHeader>

      <CardContent>
        <CardDescription>
          <div className="flex flex-col gap-2">
            <div className="flex flex-row items-center justify-between gap-2 flex-wrap">
              <div className="flex flex-col gap-1">
                <div className="flex flex-row items-center gap-1">
                  <BuildingIcon className="w-4 h-4 shrink-0" />
                  <span>{data.company}</span>
                </div>
                <div className="flex flex-row items-center gap-1">
                  <UserRoundIcon className="w-4 h-4 shrink-0" />
                  <span>{data.role}</span>
                </div>
              </div>

              <div className="flex flex-row items-center gap-1">
                <CalendarIcon className="w-4 h-4 shrink-0" />
                <span>{periodLabel}</span>
              </div>
            </div>

            {data.techStack.length > 0 && (() => {
              const { grouped, orderedGroups } = groupAndOrderTechStack(data.techStack)
              return (
                <div className="flex flex-col gap-2 mt-1">
                  {orderedGroups.map((g) => (
                    <div key={g} className="flex flex-wrap items-center gap-1.5">
                      <span className="text-xs font-medium text-muted-foreground w-16 shrink-0">{g}</span>
                      <div className="flex flex-wrap gap-1.5">
                        {grouped[g].map((tech, i) => (
                          <Badge
                            key={i}
                            variant="outline"
                            className={`flex items-center gap-1.5 pl-1.5 border-0 ${TECH_STACK_GROUP_COLORS[g as TechStackGroup] ?? TECH_STACK_GROUP_COLORS.Other}`}
                          >
                            {tech.iconUrl && (
                              <img
                                src={tech.iconUrl}
                                alt={tech.name}
                                className="w-4 h-4 rounded-sm object-contain"
                              />
                            )}
                            <span>{tech.name}</span>
                          </Badge>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              )
            })()}
          </div>
        </CardDescription>
      </CardContent>

      {(onViewProjects && linkedProjectCount > 0 || (user && isAdmin)) && (
        <CardFooter>
          <CardAction>
            <ButtonGroup>
              {onViewProjects && linkedProjectCount > 0 && (
                <Button
                  variant="outline"
                  onClick={(e) => {
                    e.stopPropagation()
                    onViewProjects()
                  }}
                >
                  <FolderGitIcon />
                  View Projects ({linkedProjectCount})
                </Button>
              )}
              {user && isAdmin && (
                <>
                  <Button
                    variant="outline"
                    onClick={(e) => {
                      e.stopPropagation()
                      onModifyButtonClick(data)
                    }}
                  >
                    <EditIcon />
                    Modify
                  </Button>
                  <Button
                    variant="destructive"
                    onClick={(e) => {
                      e.stopPropagation()
                      onDeleteButtonClick(data)
                    }}
                  >
                    <TrashIcon />
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

export { ExperienceListItem }
