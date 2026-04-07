import { format } from 'date-fns'
import { CalendarIcon, ExternalLinkIcon, ImagesIcon } from 'lucide-react'

import { Badge } from '#/components/ui/badge'
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from '#/components/ui/carousel'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '#/components/ui/dialog'
import type { News, NewsCategory } from '#/types/news'

const CATEGORY_VARIANT: Record<
  NewsCategory,
  'default' | 'secondary' | 'outline'
> = {
  Award: 'default',
  Research: 'secondary',
  Publication: 'secondary',
  Activity: 'outline',
  Press: 'outline',
  Other: 'outline',
}

const NewsDetailDialog = ({
  news,
  open,
  onOpenChange,
}: {
  news: News | null
  open: boolean
  onOpenChange: (open: boolean) => void
}) => {
  if (!news) return null

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl w-full">
        <DialogHeader>
          <div className="flex flex-row items-center gap-2 flex-wrap">
            <Badge variant={CATEGORY_VARIANT[news.category]}>
              {news.category}
            </Badge>
          </div>
          <DialogTitle className="text-xl mt-1">{news.title}</DialogTitle>
        </DialogHeader>

        <div className="flex flex-col gap-4">
          {news.images.length > 0 ? (
            <div className="px-10">
              <Carousel opts={{ loop: true }}>
                <CarouselContent>
                  {news.images.map((img, index) => (
                    <CarouselItem key={img.path}>
                      <div className="flex items-center justify-center bg-muted rounded-md overflow-hidden">
                        <img
                          src={img.url}
                          alt={`${news.title} - ${index + 1}`}
                          className="max-h-[420px] w-full object-contain"
                        />
                      </div>
                    </CarouselItem>
                  ))}
                </CarouselContent>
                <CarouselPrevious />
                <CarouselNext />
              </Carousel>
              <p className="text-center text-xs text-muted-foreground mt-2">
                {news.images.length} photo
                {news.images.length !== 1 ? 's' : ''}
              </p>
            </div>
          ) : (
            <div className="flex items-center justify-center h-32 bg-muted rounded-md text-muted-foreground">
              <ImagesIcon className="w-8 h-8" />
            </div>
          )}

          <div className="flex flex-row items-center gap-3 text-sm text-muted-foreground">
            <div className="flex items-center gap-1.5">
              <CalendarIcon className="w-4 h-4" />
              <span>{format(news.date, 'MMMM yyyy')}</span>
            </div>
          </div>

          <p className="text-sm text-foreground whitespace-pre-wrap">
            {news.description}
          </p>

          {news.link && (
            <a
              href={news.link}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 text-sm text-primary hover:underline"
            >
              <ExternalLinkIcon className="w-3.5 h-3.5" />
              Read more
            </a>
          )}
        </div>
      </DialogContent>
    </Dialog>
  )
}

export { NewsDetailDialog }
