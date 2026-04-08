import { Badge } from '#/components/ui/badge'
import { Card, CardContent, CardHeader, CardTitle } from '#/components/ui/card'
import type { Publication } from '#/types/publication'
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
              className={a === 'Yujee Chang' ? 'font-semibold' : ''}
            >
              {`${a}${i !== data.authors.length - 1 ? ',' : ''}`}
            </span>
          ))}
        </div>
        <div className="flex flex-row items-center gap-1 text-xs text-muted-foreground">
          <CalendarIcon className="w-3.5 h-3.5" />
          <span>{`${data.publicationYear}.${String(data.publicationMonth).padStart(2, '0')}`}</span>
        </div>
      </CardContent>
    </Card>
  )
}

export { PublicationPreviewCard }
