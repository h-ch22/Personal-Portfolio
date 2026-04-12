import { Badge } from '#/components/ui/badge'
import { useAlertDialogStore } from '#/stores/use-alert-dialog-store'
import {
  TECH_PROFICIENCY_COLORS,
  TECH_STACK_GROUP_COLORS,
  type TechStack,
  type TechStackGroup,
  type TechStackViewMode,
} from '#/types/techstack'
import { PencilIcon, XIcon } from 'lucide-react'

function CategoryBadge({ category }: { category: string }) {
  return (
    <Badge variant="outline" className="text-xs h-5 px-1.5">
      {category}
    </Badge>
  )
}

function ProficiencyBadge({ proficiency }: { proficiency?: string }) {
  if (!proficiency) return null
  return (
    <Badge
      variant="outline"
      className={`text-xs h-5 px-1.5 border-0 ${TECH_PROFICIENCY_COLORS[proficiency as keyof typeof TECH_PROFICIENCY_COLORS]}`}
    >
      {proficiency}
    </Badge>
  )
}

function GroupBadges({ groups }: { groups?: TechStackGroup[] }) {
  if (!groups || groups.length === 0) return null
  const visible = groups.slice(0, 1)
  const rest = groups.length - 1
  return (
    <>
      {visible.map((g) => (
        <Badge
          key={g}
          variant="outline"
          className={`text-xs h-5 px-1.5 border-0 ${TECH_STACK_GROUP_COLORS[g]}`}
        >
          {g}
        </Badge>
      ))}
      {rest > 0 && (
        <Badge variant="outline" className="text-xs h-5 px-1.5">
          +{rest}
        </Badge>
      )}
    </>
  )
}

export const TechStackCard = ({
  data,
  isAdmin,
  viewMode = 'category',
  onDelete,
  onEdit,
}: {
  data: TechStack
  isAdmin: boolean
  viewMode?: TechStackViewMode
  onDelete: (id: string) => void
  onEdit: (data: TechStack) => void
}) => {
  const openDialog = useAlertDialogStore((state) => state.openDialog)

  const groups = data.groups ?? []

  const showProficiency = viewMode === 'category' || viewMode === 'group'
  const showGroups = viewMode === 'category' || viewMode === 'proficiency'
  const showCategory = viewMode === 'proficiency' || viewMode === 'group'

  const hasBadges =
    (showProficiency && !!data.proficiency) ||
    (showGroups && groups.length > 0) ||
    showCategory

  const handleDeleteClick = () => {
    openDialog({
      title: 'Delete Tech Stack',
      description: `"Are you sure to delete "${data.name}"? This action cannot be undone.`,
      confirmButtonText: 'Delete',
      dismissButtonText: 'Cancel',
      isDestructive: true,
      onConfirm: () => onDelete(data.id),
    })
  }

  return (
    <div className="relative group flex flex-col items-center gap-2 p-3 rounded-xl border bg-card hover:shadow-md transition-shadow">
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
            onClick={handleDeleteClick}
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
          className="w-9 h-9 object-contain mt-1"
        />
      ) : (
        <span className="text-3xl mt-1">{data.icon}</span>
      )}

      <span className="text-xs font-semibold text-center leading-tight line-clamp-2 w-full">
        {data.name}
      </span>

      {hasBadges && (
        <div className="w-full border-t border-border/50 pt-2 flex flex-col gap-1">
          {showCategory && (
            <div className="flex flex-wrap justify-center gap-1">
              <CategoryBadge category={data.category} />
            </div>
          )}
          {showProficiency && data.proficiency && (
            <div className="flex flex-wrap justify-center gap-1">
              <ProficiencyBadge proficiency={data.proficiency} />
            </div>
          )}
          {showGroups && groups.length > 0 && (
            <div className="flex flex-wrap justify-center gap-1">
              <GroupBadges groups={groups} />
            </div>
          )}
        </div>
      )}
    </div>
  )
}
