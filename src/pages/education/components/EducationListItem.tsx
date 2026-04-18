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
import type { Education } from '#/types/education'
import { format } from 'date-fns'
import {
  BuildingIcon,
  CalendarIcon,
  EditIcon,
  GraduationCapIcon,
  PresentationIcon,
  ShieldCheckIcon,
  TentIcon,
  TrashIcon,
} from 'lucide-react'

const EducationListItem = ({
  data,
  onModifyButtonClick,
  onDeleteButtonClick,
}: {
  data: Education
  onModifyButtonClick: (data: Education) => void
  onDeleteButtonClick: (data: Education) => void
}) => {
  const getIcon = () => {
    switch (data.type) {
      case 'BOOTCAMP':
        return <TentIcon />

      case 'CERTIFICATE':
        return <ShieldCheckIcon />

      case 'DEGREE':
        return <GraduationCapIcon />

      case 'COURSE':
        return <PresentationIcon />
    }
  }

  const user = useAuthStore((state) => state.user)
  const isAdmin = useAuthStore((state) => state.isAdmin)

  return (
    <Card className="mb-2 gap-2">
      <CardHeader>
        <CardTitle>
          <div className="flex flex-row items-center justify-between">
            <div className="flex items-center gap-2">
              {data.logoUrl && (
                <img src={data.logoUrl} alt={data.title} className="w-8 h-8 rounded-md object-contain shrink-0 bg-muted p-0.5" />
              )}
              <div className="text-xl">{data.title}</div>
            </div>

            <Badge>
              {getIcon()}
              {data.type}
            </Badge>
          </div>
        </CardTitle>
      </CardHeader>

      <CardContent>
        <CardDescription>
          <div className="w-full justify-between flex flex-row items-center gap-1 text-muted-foreground">
            <div className="flex flex-col gap-1">
              <div className="flex flex-row items-center gap-1 text-muted-foreground">
                <BuildingIcon className="w-4 h-4" />
                {data.organization}
              </div>

              {data.description && (
                <p className="text-sm text-muted-foreground">
                  {data.description}
                </p>
              )}
            </div>

            <div className="flex flex-row gap-1 items-center">
              <CalendarIcon className="w-4 h-4" />
              {data.type === 'CERTIFICATE'
                ? format(new Date(data.endYear, data.endMonth - 1, 1), 'MMM yyyy')
                : `${format(new Date(data.startYear, data.startMonth - 1, 1), 'MMM yyyy')} – ${data.inProgress ? 'Present' : format(new Date(data.endYear, data.endMonth - 1, 1), 'MMM yyyy')}`}
            </div>
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
                {'Modify'}
              </Button>

              <Button
                variant="destructive"
                onClick={() => onDeleteButtonClick(data)}
              >
                <TrashIcon />
                {'Delete'}
              </Button>
            </ButtonGroup>
          </CardAction>
        </CardFooter>
      )}
    </Card>
  )
}

export { EducationListItem }
