import { Badge } from '#/components/ui/badge'
import { TECH_PROFICIENCY_COLORS, TECH_STACK_GROUP_COLORS, type TechStack } from '#/types/techstack'
import { PencilIcon, XIcon } from 'lucide-react'

export const TechStackCard = ({
  data,
  isAdmin,
  onDelete,
  onEdit,
}: {
  data: TechStack
  isAdmin: boolean
  onDelete: (id: string) => void
  onEdit: (data: TechStack) => void
}) => {
  const proficiencyColor = data.proficiency
    ? TECH_PROFICIENCY_COLORS[data.proficiency]
    : undefined

  const groupColor = data.group
    ? TECH_STACK_GROUP_COLORS[data.group]
    : undefined

  return (
    <div className="relative group flex flex-col items-center gap-2 p-4 rounded-xl border bg-card hover:shadow-md transition-shadow">
      {isAdmin && (
        <div className="absolute top-1.5 right-1.5 flex gap-0.5 opacity-0 group-hover:opacity-100 transition-opacity">
          <button
            type="button"
            onClick={() => onEdit(data)}
            className="p-0.5 rounded-full bg-muted text-muted-foreground hover:bg-secondary hover:text-foreground transition-colors"
          >
            <PencilIcon className="w-3 h-3" />
          </button>
          <button
            type="button"
            onClick={() => onDelete(data.id)}
            className="p-0.5 rounded-full bg-destructive text-destructive-foreground"
          >
            <XIcon className="w-3 h-3" />
          </button>
        </div>
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
      <span className="text-sm font-medium text-center leading-tight">{data.name}</span>
      <div className="flex flex-col items-center gap-1">
        {data.proficiency && (
          <Badge variant="outline" className={`text-xs border-0 ${proficiencyColor}`}>
            {data.proficiency}
          </Badge>
        )}
        {data.group && (
          <Badge variant="outline" className={`text-xs border-0 ${groupColor}`}>
            {data.group}
          </Badge>
        )}
        {!data.proficiency && !data.group && (
          <Badge variant="outline" className="text-xs">
            {data.category}
          </Badge>
        )}
      </div>
    </div>
  )
}
