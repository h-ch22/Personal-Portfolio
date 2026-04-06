import { format } from 'date-fns'
import {
  BookOpenIcon,
  BuildingIcon,
  CalendarIcon,
  EditIcon,
  GiftIcon,
  MedalIcon,
  SparklesIcon,
  TrashIcon,
  TrophyIcon,
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
import type { Award } from '#/types/award'

const TYPE_ICON = {
  Competition: <TrophyIcon />,
  Academic: <BookOpenIcon />,
  Scholarship: <GiftIcon />,
  Recognition: <SparklesIcon />,
  Other: <MedalIcon />,
}

const AwardListItem = ({
  data,
  onModifyButtonClick,
  onDeleteButtonClick,
}: {
  data: Award
  onModifyButtonClick: (data: Award) => void
  onDeleteButtonClick: (data: Award) => void
}) => {
  const user = useAuthStore((state) => state.user)
  const isAdmin = useAuthStore((state) => state.isAdmin)

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
          <div className="flex flex-col gap-1">
            <div className="flex flex-row items-center justify-between gap-2 flex-wrap">
              <div className="flex flex-row items-center gap-1">
                <BuildingIcon className="w-4 h-4 shrink-0" />
                <span>{data.issuer}</span>
              </div>
              <div className="flex flex-row items-center gap-1">
                <CalendarIcon className="w-4 h-4 shrink-0" />
                <span>{format(data.date, 'MMM yyyy')}</span>
              </div>
            </div>

            {data.description && (
              <p className="text-sm text-muted-foreground mt-1">
                {data.description}
              </p>
            )}
          </div>
        </CardDescription>
      </CardContent>

      {user && isAdmin && (
        <CardFooter>
          <CardAction>
            <ButtonGroup>
              <Button variant="outline" onClick={() => onModifyButtonClick(data)}>
                <EditIcon />
                Modify
              </Button>
              <Button variant="destructive" onClick={() => onDeleteButtonClick(data)}>
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

export { AwardListItem }
