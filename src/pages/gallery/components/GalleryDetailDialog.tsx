import { format } from 'date-fns'
import { CalendarIcon, ImagesIcon } from 'lucide-react'

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
import type { Gallery } from '#/types/gallery'

const GalleryDetailDialog = ({
  gallery,
  open,
  onOpenChange,
}: {
  gallery: Gallery | null
  open: boolean
  onOpenChange: (open: boolean) => void
}) => {
  if (!gallery) return null

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl w-full">
        <DialogHeader>
          <DialogTitle className="text-xl">{gallery.title}</DialogTitle>
        </DialogHeader>

        <div className="flex flex-col gap-4">
          {gallery.images.length > 0 ? (
            <div className="px-10">
              <Carousel opts={{ loop: true }}>
                <CarouselContent>
                  {gallery.images.map((img, index) => (
                    <CarouselItem key={img.path}>
                      <div className="flex items-center justify-center bg-muted rounded-md overflow-hidden">
                        <img
                          src={img.url}
                          alt={`${gallery.title} - ${index + 1}`}
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
                {gallery.images.length} photo
                {gallery.images.length !== 1 ? 's' : ''}
              </p>
            </div>
          ) : (
            <div className="flex items-center justify-center h-48 bg-muted rounded-md text-muted-foreground">
              <ImagesIcon className="w-8 h-8" />
            </div>
          )}

          <div className="flex flex-row items-center gap-3 text-sm text-muted-foreground">
            <div className="flex items-center gap-1.5">
              <CalendarIcon className="w-4 h-4" />
              <span>{format(gallery.date, 'MMMM yyyy')}</span>
            </div>
          </div>

          {gallery.description && (
            <p className="text-sm text-foreground whitespace-pre-wrap">
              {gallery.description}
            </p>
          )}
        </div>
      </DialogContent>
    </Dialog>
  )
}

export { GalleryDetailDialog }
