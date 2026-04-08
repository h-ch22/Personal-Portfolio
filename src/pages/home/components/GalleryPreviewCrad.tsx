import { Card, CardHeader, CardTitle, CardContent } from '#/components/ui/card'
import type { Gallery } from '#/types/gallery'
import { format } from 'date-fns'
import { ImagesIcon, CalendarIcon } from 'lucide-react'

export const GalleryPreviewCard = ({ data }: { data: Gallery }) => {
  const thumbnail = data.images[0]?.url
  return (
    <Card className="overflow-hidden gap-0">
      <div className="w-full h-44 bg-muted overflow-hidden">
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
        <CardTitle className="text-base line-clamp-1">{data.title}</CardTitle>
      </CardHeader>
      <CardContent className="pb-3">
        <div className="flex flex-row items-center gap-3 text-xs text-muted-foreground">
          <div className="flex items-center gap-1">
            <CalendarIcon className="w-3.5 h-3.5" />
            <span>{format(data.date, 'MMM yyyy')}</span>
          </div>
          <div className="flex items-center gap-1">
            <ImagesIcon className="w-3.5 h-3.5" />
            <span>{data.images.length}</span>
          </div>
        </div>
        {data.description && (
          <p className="text-xs text-muted-foreground mt-1 line-clamp-2">
            {data.description}
          </p>
        )}
      </CardContent>
    </Card>
  )
}
