import { useState } from 'react'
import { AnimatedItem } from '#/components/common/AnimatedItem'
import { Button } from '#/components/ui/button'
import { ToggleGroup, ToggleGroupItem } from '#/components/ui/toggle-group'
import { BookOpenIcon, ChevronRightIcon, FrownIcon } from 'lucide-react'
import { Link } from '@tanstack/react-router'
import type { Publication, PublicationType } from '#/types/publication'
import { PublicationPreviewCard } from './PublicationPreviewCard'

const PUBLICATION_TYPES: PublicationType[] = [
  'International Journal',
  'International Conference',
  'Domestic Journal',
  'Domestic Conference',
  'Patent',
  'Book',
]

const TOP_N = 5

function sortByDate(pubs: Publication[]) {
  return [...pubs].sort(
    (a, b) =>
      b.publicationYear - a.publicationYear ||
      b.publicationMonth - a.publicationMonth,
  )
}

interface LatestPublicationsSectionProps {
  publications: Publication[]
  muted?: boolean
}

export function LatestPublicationsSection({
  publications,
  muted = false,
}: LatestPublicationsSectionProps) {
  const [activeType, setActiveType] = useState<PublicationType | 'all'>('all')

  const availableTypes = PUBLICATION_TYPES.filter((t) =>
    publications.some((p) => p.type === t),
  )

  const filtered =
    activeType === 'all'
      ? sortByDate(publications)
      : sortByDate(publications.filter((p) => p.type === activeType))

  const displayed = filtered.slice(0, TOP_N)

  return (
    <AnimatedItem>
      <div className={`flex flex-col gap-4 px-6 py-8${muted ? ' bg-muted' : ''}`}>
        <div className="flex flex-row items-end justify-between">
          <div>
            <div className="flex items-center gap-2 text-3xl font-bold text-foreground">
              <BookOpenIcon className="w-7 h-7" />
              Latest Publications
            </div>
            <p className="text-muted-foreground mt-1">
              Recent research papers and conference proceedings
            </p>
          </div>
          <Button variant="ghost" asChild>
            <Link to="/publications">
              View All
              <ChevronRightIcon className="w-4 h-4" />
            </Link>
          </Button>
        </div>

        {availableTypes.length > 0 && (
          <div className="w-full overflow-x-auto scrollbar-none">
            <ToggleGroup
              type="single"
              className="flex-nowrap justify-start"
              value={activeType}
              onValueChange={(v) =>
                setActiveType((v || 'all') as PublicationType | 'all')
              }
            >
              <ToggleGroupItem className="rounded-full shrink-0" value="all">
                All
              </ToggleGroupItem>
              {availableTypes.map((type) => (
                <ToggleGroupItem
                  key={type}
                  className="rounded-full shrink-0"
                  value={type}
                >
                  {type}
                </ToggleGroupItem>
              ))}
            </ToggleGroup>
          </div>
        )}

        {displayed.length > 0 ? (
          <div className="flex flex-col gap-3 xl:grid xl:grid-cols-2 2xl:grid-cols-3">
            {displayed.map((pub, i) => (
              <AnimatedItem key={pub.id} index={i}>
                <PublicationPreviewCard data={pub} showType={activeType === 'all'} />
              </AnimatedItem>
            ))}
          </div>
        ) : (
          <div className="flex flex-col justify-center items-center py-10 text-muted-foreground text-sm gap-2">
            <FrownIcon className="w-6 h-6" />
            There is no content to display :(
          </div>
        )}
      </div>
    </AnimatedItem>
  )
}
