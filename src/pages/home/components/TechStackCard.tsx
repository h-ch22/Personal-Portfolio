import { Badge } from '#/components/ui/badge'
import type { TechStack } from '#/types/techstack'
import { XIcon } from 'lucide-react'

export const TechStackCard = ({
  data,
  isAdmin,
  onDelete,
}: {
  data: TechStack
  isAdmin: boolean
  onDelete: (id: string) => void
}) => {
  return (
    <div className="relative group flex flex-col items-center gap-2 p-4 rounded-xl border bg-card hover:shadow-md transition-shadow">
      {isAdmin && (
        <button
          type="button"
          onClick={() => onDelete(data.id)}
          className="absolute top-1.5 right-1.5 opacity-0 group-hover:opacity-100 transition-opacity p-0.5 rounded-full bg-destructive text-destructive-foreground"
        >
          <XIcon className="w-3 h-3" />
        </button>
      )}
      {data.iconType === 'image' ? (
        <img
          src={data.icon}
          alt={data.name}
          className="w-10 h-10 object-contain"
        />
      ) : (
        <span className="text-4xl">{data.icon}</span>
      )}
      <span className="text-sm font-medium text-center">{data.name}</span>
      <Badge variant="outline" className="text-xs">
        {data.category}
      </Badge>
    </div>
  )
}
