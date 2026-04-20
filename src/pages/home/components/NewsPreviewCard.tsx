import { Badge } from '#/components/ui/badge'
import { Card, CardHeader, CardTitle, CardContent } from '#/components/ui/card'
import { type News, CATEGORY_VARIANT } from '#/types/news'
import { CATEGORY_ICON } from '#/lib/news'
import { format } from 'date-fns'
import { CalendarIcon } from 'lucide-react'

export const NewsPreviewCard = ({ data, onClick }: { data: News; onClick?: (data: News) => void }) => {
  const thumbnail = data.images[0]?.url
  return (
    <Card
      className={`overflow-hidden gap-0${onClick ? ' cursor-pointer hover:shadow-md transition-shadow' : ''}`}
      onClick={() => onClick?.(data)}
    >
      {thumbnail && (
        <div className="w-full h-40 overflow-hidden">
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
      <CardContent className="pb-3 flex flex-col gap-1">
        <div className="flex items-center gap-1 text-xs text-muted-foreground">
          <CalendarIcon className="w-3.5 h-3.5" />
          <span>{format(data.date, 'MMM yyyy')}</span>
        </div>
        <p className="text-xs text-muted-foreground line-clamp-2">
          {data.description}
        </p>
      </CardContent>
    </Card>
  )
}
