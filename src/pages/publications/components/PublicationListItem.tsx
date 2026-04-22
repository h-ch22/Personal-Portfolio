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
import { CONFIG } from '#/config'
import { useAuthStore } from '#/stores/use-auth-store'
import type { Publication } from '#/types/publication'
import { format } from 'date-fns'
import {
  CalendarIcon,
  EditIcon,
  ExternalLinkIcon,
  FolderGitIcon,
  TrashIcon,
  UsersIcon,
} from 'lucide-react'

const PublicationListItem = ({
  data,
  showType = false,
  onModifyButtonClick,
  onDeleteButtonClick,
  onViewProject,
}: {
  data: Publication
  showType?: boolean
  onModifyButtonClick: (data: Publication) => void
  onDeleteButtonClick: (data: Publication) => void
  onViewProject?: (projectId: string) => void
}) => {
  const user = useAuthStore((state) => state.user)
  const isAdmin = useAuthStore((state) => state.isAdmin)

  return (
    <Card className="mb-2 w-full gap-2">
      <CardHeader>
        <CardTitle>
          <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
            <div className="text-xl">{data.title}</div>

            <div className="flex flex-row items-center gap-1 shrink-0">
              {showType && <Badge variant="outline">{data.type}</Badge>}
              <Badge>{data.journal}</Badge>
            </div>
          </div>
        </CardTitle>
      </CardHeader>

      <CardContent>
        <CardDescription>
          <div className="w-full flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex flex-col gap-2">
              <div className="flex flex-row items-center gap-1 flex-wrap">
                <UsersIcon className="w-4 h-4 shrink-0" />
                {data.authors.map((a, i) => (
                  <div
                    key={i}
                    className={`${a === CONFIG.publications.nameToBold ? 'font-semibold' : ''}`}
                  >
                    {`${a}${i !== data.authors.length - 1 ? ',' : ''}`}
                  </div>
                ))}
              </div>

              <div className="flex flex-row items-center gap-1">
                <CalendarIcon className="w-4 h-4 shrink-0" />
                {format(new Date(data.publicationYear, data.publicationMonth - 1, 1), 'MMM yyyy')}
              </div>
            </div>

            <div className="flex items-center gap-2 self-start sm:self-auto">
              {data.link !== '' && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => window.open(data.link, '_blank')}
                >
                  <ExternalLinkIcon />
                </Button>
              )}
              {data.projectId && onViewProject && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => onViewProject(data.projectId!)}
                >
                  <FolderGitIcon className="w-3.5 h-3.5" />
                  View Project
                </Button>
              )}
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

export { PublicationListItem }
