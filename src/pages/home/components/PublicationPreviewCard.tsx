import { Badge } from '#/components/ui/badge'
import { Card, CardContent, CardHeader, CardTitle } from '#/components/ui/card'
import { CONFIG } from '#/config'
import type { Publication } from '#/types/publication'
import { format } from 'date-fns'
import { CalendarIcon, UsersIcon } from 'lucide-react'

const PublicationPreviewCard = ({ data }: { data: Publication }) => {
  return (
    <Card className="gap-2">
      <CardHeader className="pb-1">
        <CardTitle className="text-base line-clamp-2 leading-snug">
          {data.title}
        </CardTitle>
        <div className="flex flex-row items-center gap-1 flex-wrap">
          <Badge variant="outline">{data.type}</Badge>
          <Badge>{data.journal}</Badge>
        </div>
      </CardHeader>
      <CardContent className="flex flex-col gap-1">
        <div className="flex flex-row items-center gap-1 text-xs text-muted-foreground flex-wrap">
          <UsersIcon className="w-3.5 h-3.5 shrink-0" />
          {data.authors.map((a, i) => (
            <span
              key={i}
              className={
                a === CONFIG.publications.nameToBold ? 'font-semibold' : ''
              }
            >
              {`${a}${i !== data.authors.length - 1 ? ',' : ''}`}
            </span>
          ))}
        </div>
        <div className="flex flex-row items-center gap-1 text-xs text-muted-foreground">
          <CalendarIcon className="w-3.5 h-3.5" />
          <span>{format(new Date(data.publicationYear, data.publicationMonth - 1, 1), 'MMM yyyy')}</span>
        </div>
      </CardContent>
    </Card>
  )
}

export { PublicationPreviewCard }
