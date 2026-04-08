import { AnimatedItem } from '#/components/common/AnimatedItem'
import { Button } from '#/components/ui/button'
import { FrownIcon, ChevronRightIcon } from 'lucide-react'
import { Link } from '@tanstack/react-router'
import type { LucideIcon } from 'lucide-react'
import type { LinkProps } from '@tanstack/react-router'

interface LatestSectionProps {
  icon: LucideIcon
  title: string
  description: string
  viewAllTo: LinkProps['to']
  items: { id: string }[]
  gridClassName?: string
  muted?: boolean
  renderItem: (item: any, index: number) => React.ReactNode
}

export function LatestSection({
  icon: Icon,
  title,
  description,
  viewAllTo,
  items,
  gridClassName = 'flex flex-col gap-3',
  muted = false,
  renderItem,
}: LatestSectionProps) {
  return (
    <AnimatedItem>
      <div className={`flex flex-col gap-4 px-6 py-8 ${muted ? 'bg-muted' : ''}`}>
        <div className="flex flex-row items-end justify-between">
          <div>
            <div className="flex items-center gap-2 text-3xl font-bold text-foreground">
              <Icon className="w-7 h-7" />
              {title}
            </div>
            <p className="text-muted-foreground mt-1">{description}</p>
          </div>
          <Button variant="ghost" asChild>
            <Link to={viewAllTo}>
              View All
              <ChevronRightIcon className="w-4 h-4" />
            </Link>
          </Button>
        </div>

        <div className={gridClassName}>
          {items.length > 0 ? (
            items.map((item, i) => (
              <AnimatedItem key={item.id} index={i}>
                {renderItem(item, i)}
              </AnimatedItem>
            ))
          ) : (
            <div className="flex flex-col justify-center items-center w-full col-span-3 text-muted-foreground text-sm">
              <FrownIcon />
              {'There is no content to display :('}
            </div>
          )}
        </div>
      </div>
    </AnimatedItem>
  )
}
