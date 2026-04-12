import { AnimatedItem } from '#/components/common/AnimatedItem'
import { Badge } from '#/components/ui/badge'
import { Button } from '#/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '#/components/ui/dialog'
import { Input } from '#/components/ui/input'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '#/components/ui/select'
import {
  PROFICIENCY_EXCLUDED_CATEGORIES,
  TECH_CATEGORIES,
  TECH_PROFICIENCY_COLORS,
  TECH_PROFICIENCY_LEVELS,
  TECH_STACK_GROUP_COLORS,
  TECH_STACK_GROUPS,
  type TechStack,
  type TechStackCategory,
  type TechStackGroup,
  type TechStackProficiency,
  type TechStackRequest,
  type TechStackViewMode,
} from '#/types/techstack'
import { CpuIcon, PlusIcon } from 'lucide-react'
import type { User } from 'firebase/auth'
import { TechStackCard } from './TechStackCard'

function TechStackFormFields({
  form,
  setForm,
}: {
  form: TechStackRequest
  setForm: React.Dispatch<React.SetStateAction<TechStackRequest>>
}) {
  const isProficiencyExcluded = PROFICIENCY_EXCLUDED_CATEGORIES.includes(
    form.category,
  )

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-col gap-1.5">
        <label className="text-sm font-medium">Icon Type</label>
        <div className="flex rounded-md border overflow-hidden">
          {(['emoji', 'image'] as const).map((type) => (
            <button
              key={type}
              type="button"
              onClick={() =>
                setForm((prev) => ({ ...prev, iconType: type, icon: '' }))
              }
              className={`flex-1 py-1.5 text-sm transition-colors ${
                form.iconType === type
                  ? 'bg-primary text-primary-foreground'
                  : 'bg-background text-muted-foreground hover:bg-muted'
              }`}
            >
              {type === 'emoji' ? '😀 Emoji' : '🔗 Image URL'}
            </button>
          ))}
        </div>
      </div>

      <div className="flex flex-col gap-1.5">
        {form.iconType === 'emoji' ? (
          <>
            <label className="text-sm font-medium">Emoji</label>
            <Input
              placeholder="e.g. ⚛️"
              value={form.icon}
              onChange={(e) =>
                setForm((prev) => ({ ...prev, icon: e.target.value }))
              }
            />
          </>
        ) : (
          <>
            <div className="flex items-center justify-between">
              <label className="text-sm font-medium">Icon URL</label>
              <div className="flex items-center gap-2 text-xs text-muted-foreground">
                {[
                  { label: 'Devicon', href: 'https://devicon.dev' },
                  { label: 'Simple Icons', href: 'https://simpleicons.org' },
                  {
                    label: 'Shields.io',
                    href: 'https://shields.io/badges/static-badge',
                  },
                ].map(({ label, href }) => (
                  <a
                    key={href}
                    href={href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="underline underline-offset-2 hover:text-foreground transition-colors"
                  >
                    {label}
                  </a>
                ))}
              </div>
            </div>
            <Input
              placeholder="https://cdn.jsdelivr.net/..."
              value={form.icon}
              onChange={(e) =>
                setForm((prev) => ({ ...prev, icon: e.target.value }))
              }
            />
          </>
        )}
      </div>

      <div className="flex flex-col gap-1.5">
        <label className="text-sm font-medium">Name</label>
        <Input
          placeholder="e.g. React"
          value={form.name}
          onChange={(e) =>
            setForm((prev) => ({ ...prev, name: e.target.value }))
          }
        />
      </div>

      <div className="flex flex-col gap-1.5">
        <label className="text-sm font-medium">Category</label>
        <Select
          value={form.category}
          onValueChange={(val) =>
            setForm((prev) => ({
              ...prev,
              category: val as TechStackCategory,
              proficiency: PROFICIENCY_EXCLUDED_CATEGORIES.includes(
                val as TechStackCategory,
              )
                ? undefined
                : prev.proficiency,
            }))
          }
        >
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {TECH_CATEGORIES.map((cat) => (
              <SelectItem key={cat} value={cat}>
                {cat}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="flex flex-col gap-1.5">
        <label className="text-sm font-medium">Group</label>
        <div className="flex flex-wrap gap-1.5">
          {TECH_STACK_GROUPS.map((g) => {
            const currentGroups = form.groups ?? []
            const isSelected = currentGroups.includes(g)
            return (
              <button
                key={g}
                type="button"
                onClick={() =>
                  setForm((prev) => {
                    const groups = prev.groups ?? []
                    return {
                      ...prev,
                      groups: isSelected
                        ? groups.filter((x) => x !== g)
                        : [...groups, g as TechStackGroup],
                    }
                  })
                }
                className={`px-2.5 py-1 rounded-full text-xs font-medium transition-all border ${
                  isSelected
                    ? `${TECH_STACK_GROUP_COLORS[g]} border-transparent`
                    : 'border-border text-muted-foreground hover:bg-muted'
                }`}
              >
                {g}
              </button>
            )
          })}
        </div>
      </div>

      <div className="flex flex-col gap-1.5">
        <div className="flex items-center gap-2">
          <label className="text-sm font-medium">Proficiency</label>
          {isProficiencyExcluded && (
            <span className="text-xs text-muted-foreground">
              (not available for {form.category})
            </span>
          )}
        </div>
        <div className="flex rounded-md border overflow-hidden">
          {TECH_PROFICIENCY_LEVELS.map((level) => (
            <button
              key={level}
              type="button"
              disabled={isProficiencyExcluded}
              onClick={() =>
                setForm((prev) => ({
                  ...prev,
                  proficiency:
                    prev.proficiency === level
                      ? undefined
                      : (level as TechStackProficiency),
                }))
              }
              className={`flex-1 py-1.5 text-sm transition-colors disabled:opacity-40 disabled:cursor-not-allowed ${
                form.proficiency === level
                  ? 'bg-primary text-primary-foreground'
                  : 'bg-background text-muted-foreground hover:bg-muted'
              }`}
            >
              {level}
            </button>
          ))}
        </div>
      </div>

      {form.icon && form.name && (
        <div className="flex items-center gap-3 p-3 rounded-lg border bg-muted">
          {form.iconType === 'image' ? (
            <img
              src={form.icon}
              alt={form.name}
              className="w-8 h-8 object-contain"
            />
          ) : (
            <span className="text-3xl">{form.icon}</span>
          )}
          <div>
            <div className="font-medium">{form.name}</div>
            <div className="flex flex-wrap gap-1 mt-0.5">
              <Badge variant="outline" className="text-xs">
                {form.category}
              </Badge>
              {(form.groups ?? []).map((g) => (
                <Badge
                  key={g}
                  variant="outline"
                  className={`text-xs border-0 ${TECH_STACK_GROUP_COLORS[g]}`}
                >
                  {g}
                </Badge>
              ))}
              {form.proficiency && (
                <Badge
                  variant="outline"
                  className={`text-xs border-0 ${TECH_PROFICIENCY_COLORS[form.proficiency]}`}
                >
                  {form.proficiency}
                </Badge>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

interface TechStackSectionProps {
  techStacks: TechStack[]
  user: User | null
  isAdmin: boolean
  showAddTechStack: boolean
  setShowAddTechStack: (v: boolean) => void
  techStackForm: TechStackRequest
  setTechStackForm: React.Dispatch<React.SetStateAction<TechStackRequest>>
  isAddingTechStack: boolean
  addTechStack: (form: TechStackRequest) => void
  removeTechStack: (id: string) => void
  showEditTechStack: boolean
  setShowEditTechStack: (v: boolean) => void
  editTechStackForm: TechStackRequest
  setEditTechStackForm: React.Dispatch<React.SetStateAction<TechStackRequest>>
  isEditingTechStack: boolean
  editTechStack: (form: TechStackRequest) => void
  handleEditTechStackOpen: (item: TechStack) => void
  techStackViewMode: TechStackViewMode
  setTechStackViewMode: (v: TechStackViewMode) => void
  muted?: boolean
}

const VIEW_MODES: { value: TechStackViewMode; label: string }[] = [
  { value: 'category', label: 'Category' },
  { value: 'proficiency', label: 'Proficiency' },
  { value: 'group', label: 'Group' },
]

export function TechStackSection({
  techStacks,
  user,
  isAdmin,
  showAddTechStack,
  setShowAddTechStack,
  techStackForm,
  setTechStackForm,
  isAddingTechStack,
  addTechStack,
  removeTechStack,
  showEditTechStack,
  setShowEditTechStack,
  editTechStackForm,
  setEditTechStackForm,
  isEditingTechStack,
  editTechStack,
  handleEditTechStackOpen,
  techStackViewMode,
  setTechStackViewMode,
  muted = false,
}: TechStackSectionProps) {
  const displayedStacks =
    techStackViewMode === 'proficiency'
      ? techStacks.filter(
          (t) => !PROFICIENCY_EXCLUDED_CATEGORIES.includes(t.category),
        )
      : techStacks

  const grouped = (() => {
    if (techStackViewMode === 'category') {
      return displayedStacks.reduce<Record<string, TechStack[]>>(
        (acc, item) => {
          const key = item.category
          if (!acc[key]) acc[key] = []
          acc[key].push(item)
          return acc
        },
        {},
      )
    }
    if (techStackViewMode === 'proficiency') {
      return displayedStacks.reduce<Record<string, TechStack[]>>(
        (acc, item) => {
          const key = item.proficiency ?? 'Unset'
          if (!acc[key]) acc[key] = []
          acc[key].push(item)
          return acc
        },
        {},
      )
    }
    return displayedStacks.reduce<Record<string, TechStack[]>>((acc, item) => {
      const itemGroups =
        item.groups && item.groups.length > 0 ? item.groups : ['Unset']
      itemGroups.forEach((g) => {
        if (!acc[g]) acc[g] = []
        acc[g].push(item)
      })
      return acc
    }, {})
  })()

  const orderedKeys = (() => {
    if (techStackViewMode === 'category')
      return TECH_CATEGORIES.filter((k) => grouped[k]?.length)
    if (techStackViewMode === 'proficiency') {
      const order = [...TECH_PROFICIENCY_LEVELS, 'Unset']
      return order.filter((k) => grouped[k]?.length)
    }
    const order = [...TECH_STACK_GROUPS, 'Unset']
    return order.filter((k) => grouped[k]?.length)
  })()

  const getBadgeClass = (key: string) => {
    if (techStackViewMode === 'proficiency' && key !== 'Unset') {
      return TECH_PROFICIENCY_COLORS[key as TechStackProficiency]
    }
    if (techStackViewMode === 'group' && key !== 'Unset') {
      return TECH_STACK_GROUP_COLORS[key as TechStackGroup]
    }
    return ''
  }

  return (
    <>
      <AnimatedItem>
        <div
          className={`flex flex-col gap-4 px-6 py-8${muted ? ' bg-muted' : ''}`}
        >
          <div className="flex flex-row items-end justify-between">
            <div>
              <div className="flex items-center gap-2 text-3xl font-bold text-foreground">
                <CpuIcon className="w-7 h-7" />
                Tech Stack
              </div>
              <p className="text-muted-foreground mt-1">
                Tools and technologies I work with
              </p>
            </div>
            {user && isAdmin && (
              <Button
                variant="outline"
                size="icon"
                onClick={() => setShowAddTechStack(true)}
              >
                <PlusIcon className="w-4 h-4" />
              </Button>
            )}
          </div>

          {techStacks.length > 0 && (
            <div className="flex rounded-md border overflow-hidden self-start">
              {VIEW_MODES.map(({ value, label }) => (
                <button
                  key={value}
                  type="button"
                  onClick={() => setTechStackViewMode(value)}
                  className={`px-3 py-1.5 text-sm transition-colors ${
                    techStackViewMode === value
                      ? 'bg-primary text-primary-foreground'
                      : 'bg-background text-muted-foreground hover:bg-muted'
                  }`}
                >
                  {label}
                </button>
              ))}
            </div>
          )}

          {techStacks.length === 0 ? (
            <p className="text-muted-foreground text-sm text-center py-8">
              No tech stacks added yet.
            </p>
          ) : (
            <div className="flex flex-col gap-6">
              {orderedKeys.map((key) => {
                const badgeCls = getBadgeClass(key)
                return (
                  <div key={key} className="flex flex-col gap-3">
                    <div className="flex items-center gap-2">
                      <span
                        className={`text-xs font-semibold uppercase tracking-wider px-2 py-0.5 rounded-full ${
                          badgeCls ? badgeCls : 'text-muted-foreground'
                        }`}
                      >
                        {key}
                      </span>
                    </div>
                    <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-8 gap-3">
                      {grouped[key]
                        .sort((a, b) => a.name.localeCompare(b.name))
                        .map((item, i) => (
                          <AnimatedItem key={item.id} index={i}>
                            <TechStackCard
                              data={item}
                              viewMode={techStackViewMode}
                              isAdmin={!!(user && isAdmin)}
                              onDelete={removeTechStack}
                              onEdit={handleEditTechStackOpen}
                            />
                          </AnimatedItem>
                        ))}
                    </div>
                  </div>
                )
              })}
            </div>
          )}
        </div>
      </AnimatedItem>

      <Dialog open={showAddTechStack} onOpenChange={setShowAddTechStack}>
        <DialogContent className="max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Add Tech Stack</DialogTitle>
          </DialogHeader>
          <TechStackFormFields
            form={techStackForm}
            setForm={setTechStackForm}
          />
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setShowAddTechStack(false)}
            >
              Cancel
            </Button>
            <Button
              onClick={() => addTechStack(techStackForm)}
              disabled={
                !techStackForm.name.trim() ||
                !techStackForm.icon.trim() ||
                isAddingTechStack
              }
            >
              Add
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={showEditTechStack} onOpenChange={setShowEditTechStack}>
        <DialogContent className="max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Edit Tech Stack</DialogTitle>
          </DialogHeader>
          <TechStackFormFields
            form={editTechStackForm}
            setForm={setEditTechStackForm}
          />
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setShowEditTechStack(false)}
            >
              Cancel
            </Button>
            <Button
              onClick={() => editTechStack(editTechStackForm)}
              disabled={
                !editTechStackForm.name.trim() ||
                !editTechStackForm.icon.trim() ||
                isEditingTechStack
              }
            >
              Save
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  )
}
