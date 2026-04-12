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
  TECH_CATEGORIES,
  type TechStack,
  type TechStackCategory,
  type TechStackRequest,
} from '#/types/techstack'
import { CpuIcon, PlusIcon } from 'lucide-react'
import type { User } from 'firebase/auth'
import { TechStackCard } from './TechStackCard'

interface TechStackSectionProps {
  techStacks: TechStack[]
  groupedTechStacks: Record<TechStackCategory, TechStack[]>
  user: User | null
  isAdmin: boolean
  showAddTechStack: boolean
  setShowAddTechStack: (v: boolean) => void
  techStackForm: TechStackRequest
  setTechStackForm: React.Dispatch<React.SetStateAction<TechStackRequest>>
  isAddingTechStack: boolean
  addTechStack: (form: TechStackRequest) => void
  removeTechStack: (id: string) => void
  muted?: boolean
}

export function TechStackSection({
  techStacks,
  groupedTechStacks,
  user,
  isAdmin,
  showAddTechStack,
  setShowAddTechStack,
  techStackForm,
  setTechStackForm,
  isAddingTechStack,
  addTechStack,
  removeTechStack,
  muted = false,
}: TechStackSectionProps) {
  return (
    <>
      <AnimatedItem>
        <div className={`flex flex-col gap-4 px-6 py-8${muted ? ' bg-muted' : ''}`}>
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

          {techStacks.length === 0 ? (
            <p className="text-muted-foreground text-sm text-center py-8">
              No tech stacks added yet.
            </p>
          ) : (
            <div className="flex flex-col gap-6">
              {TECH_CATEGORIES.filter(
                (cat) => groupedTechStacks[cat]?.length > 0,
              ).map((cat) => (
                <div key={cat} className="flex flex-col gap-3">
                  <div className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">
                    {cat}
                  </div>
                  <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-8 gap-3">
                    {groupedTechStacks[cat]
                      .sort((a, b) => a.name.localeCompare(b.name))
                      .map((item, i) => (
                        <AnimatedItem key={item.id} index={i}>
                          <TechStackCard
                            data={item}
                            isAdmin={!!(user && isAdmin)}
                            onDelete={removeTechStack}
                          />
                        </AnimatedItem>
                      ))}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </AnimatedItem>

      <Dialog open={showAddTechStack} onOpenChange={setShowAddTechStack}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add Tech Stack</DialogTitle>
          </DialogHeader>

          <div className="flex flex-col gap-4">
            <div className="flex flex-col gap-1.5">
              <label className="text-sm font-medium">Icon Type</label>
              <div className="flex rounded-md border overflow-hidden">
                {(['emoji', 'image'] as const).map((type) => (
                  <button
                    key={type}
                    type="button"
                    onClick={() =>
                      setTechStackForm((prev) => ({
                        ...prev,
                        iconType: type,
                        icon: '',
                      }))
                    }
                    className={`flex-1 py-1.5 text-sm transition-colors ${
                      techStackForm.iconType === type
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
              {techStackForm.iconType === 'emoji' ? (
                <>
                  <label className="text-sm font-medium">Emoji</label>
                  <Input
                    placeholder="e.g. ⚛️"
                    value={techStackForm.icon}
                    onChange={(e) =>
                      setTechStackForm((prev) => ({
                        ...prev,
                        icon: e.target.value,
                      }))
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
                        {
                          label: 'Simple Icons',
                          href: 'https://simpleicons.org',
                        },
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
                    value={techStackForm.icon}
                    onChange={(e) =>
                      setTechStackForm((prev) => ({
                        ...prev,
                        icon: e.target.value,
                      }))
                    }
                  />
                </>
              )}
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-sm font-medium">Name</label>
              <Input
                placeholder="e.g. React"
                value={techStackForm.name}
                onChange={(e) =>
                  setTechStackForm((prev) => ({
                    ...prev,
                    name: e.target.value,
                  }))
                }
              />
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-sm font-medium">Category</label>
              <Select
                value={techStackForm.category}
                onValueChange={(val) =>
                  setTechStackForm((prev) => ({
                    ...prev,
                    category: val as TechStackCategory,
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

            {techStackForm.icon && techStackForm.name && (
              <div className="flex items-center gap-3 p-3 rounded-lg border bg-muted">
                {techStackForm.iconType === 'image' ? (
                  <img
                    src={techStackForm.icon}
                    alt={techStackForm.name}
                    className="w-8 h-8 object-contain"
                  />
                ) : (
                  <span className="text-3xl">{techStackForm.icon}</span>
                )}
                <div>
                  <div className="font-medium">{techStackForm.name}</div>
                  <Badge variant="outline" className="text-xs mt-0.5">
                    {techStackForm.category}
                  </Badge>
                </div>
              </div>
            )}
          </div>

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
    </>
  )
}
