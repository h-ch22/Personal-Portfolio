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
import type { Publication } from '#/types/publication'
import {
  CalendarIcon,
  EditIcon,
  ExternalLinkIcon,
  TrashIcon,
  UsersIcon,
} from 'lucide-react'

const PublicationListItem = ({
  data,
  showType = false,
  onModifyButtonClick,
  onDeleteButtonClick,
}: {
  data: Publication
  showType?: boolean
  onModifyButtonClick: (data: Publication) => void
  onDeleteButtonClick: (data: Publication) => void
}) => {
  const user = useAuthStore((state) => state.user)
  const isAdmin = useAuthStore((state) => state.isAdmin)

  return (
    <Card className="mb-2 w-full gap-2">
      <CardHeader>
        <CardTitle>
          <div className="flex flex-row items-center justify-between">
            <div className="text-xl">{data.title}</div>

            <div className="flex flex-row items-center gap-1">
              {showType && <Badge variant="outline">{data.type}</Badge>}
              <Badge>{data.journal}</Badge>
            </div>
          </div>
        </CardTitle>
      </CardHeader>

      <CardContent>
        <CardDescription>
          <div className="w-full flex flex-row items-center justify-between">
            <div className="w-full flex flex-col gap-2">
              <div className="flex flex-row items-center gap-1">
                <UsersIcon className="w-4 h-4" />
                {data.authors.map((a, i) => (
                  <div
                    key={i}
                    className={`${a === 'Yujee Chang' ? 'font-semibold' : ''}`}
                  >
                    {`${a}${i !== data.authors.length - 1 ? ',' : ''}`}
                  </div>
                ))}
              </div>

              <div className="flex flex-row items-center gap-1">
                <CalendarIcon className="w-4 h-4" />
                {`${data.publicationYear}.${String(data.publicationMonth).padStart(2, '0')}`}
              </div>
            </div>

            {data.link !== '' && (
              <Button
                variant="outline"
                size="sm"
                onClick={() => window.open(data.link, '_blank')}
              >
                <ExternalLinkIcon />
              </Button>
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

export { PublicationListItem }
