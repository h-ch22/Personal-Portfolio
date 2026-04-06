import { format } from 'date-fns'
import {
  ActivityIcon,
  BriefcaseIcon,
  BuildingIcon,
  CalendarIcon,
  EditIcon,
  FolderGitIcon,
  GitBranchIcon,
  TrashIcon,
  UserRoundIcon,
} from 'lucide-react'

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

const TYPE_ICON = {
  Work: <BriefcaseIcon />,
  Project: <FolderGitIcon />,
  Activity: <ActivityIcon />,
  'Open Source': <GitBranchIcon />,
}

const ExperienceListItem = ({
  data,
  onModifyButtonClick,
  onDeleteButtonClick,
}: {
  data: Experience
  onModifyButtonClick: (data: Experience) => void
  onDeleteButtonClick: (data: Experience) => void
}) => {
  const user = useAuthStore((state) => state.user)
  const isAdmin = useAuthStore((state) => state.isAdmin)

  const periodLabel = `${format(data.startDate, 'MMM yyyy')} – ${
    data.isCurrentlyWorking || !data.endDate
      ? 'Present'
      : format(data.endDate, 'MMM yyyy')
  }`

  return (
    <Card className="mb-2 gap-2">
      <CardHeader>
        <CardTitle>
          <div className="flex flex-row items-center justify-between gap-2">
            <span className="text-xl">{data.title}</span>
            <Badge>
              {TYPE_ICON[data.type]}
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

            {data.description && (
              <p className="text-sm text-muted-foreground">
                {data.description}
              </p>
            )}

            {data.techStack.length > 0 && (
              <div className="flex flex-wrap gap-1.5 mt-1">
                {data.techStack.map((tech, i) => (
                  <Badge
                    key={i}
                    variant="secondary"
                    className="flex items-center gap-1.5 pl-1.5"
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
            )}
          </div>
        </CardDescription>
      </CardContent>

      {user && isAdmin && (
        <CardFooter>
          <CardAction>
            <ButtonGroup>
              <Button
                variant="outline"
                onClick={() => onModifyButtonClick(data)}
              >
                <EditIcon />
                Modify
              </Button>
              <Button
                variant="destructive"
                onClick={() => onDeleteButtonClick(data)}
              >
                <TrashIcon />
                Delete
              </Button>
            </ButtonGroup>
          </CardAction>
        </CardFooter>
      )}
    </Card>
  )
}

export { ExperienceListItem }
