import { Reorder, useDragControls } from 'framer-motion'
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '#/components/ui/dialog'
import { Button } from '#/components/ui/button'
import { Switch } from '#/components/ui/switch'
import {
  BookOpenIcon,
  BookOpenCheckIcon,
  CpuIcon,
  FolderKanbanIcon,
  GalleryHorizontalEndIcon,
  GripVerticalIcon,
  LinkIcon,
  NewspaperIcon,
} from 'lucide-react'
import { DEFAULT_SECTION_ORDER, DEFAULT_SECTION_VISIBILITY } from '#/api/banner/banner'
import type { SectionId, SectionVisibility } from '#/api/banner/banner'

const SECTION_META: Record<SectionId, { label: string; icon: React.ReactNode }> = {
  techStack: { label: 'Tech Stack', icon: <CpuIcon className="w-4 h-4" /> },
  featuredProjects: { label: 'Featured Projects', icon: <FolderKanbanIcon className="w-4 h-4" /> },
  educationExperience: { label: 'Education & Experience', icon: <BookOpenCheckIcon className="w-4 h-4" /> },
  publications: { label: 'Latest Publications', icon: <BookOpenIcon className="w-4 h-4" /> },
  news: { label: 'Latest News', icon: <NewspaperIcon className="w-4 h-4" /> },
  gallery: { label: 'Latest Gallery', icon: <GalleryHorizontalEndIcon className="w-4 h-4" /> },
  socialLinks: { label: 'Social Links', icon: <LinkIcon className="w-4 h-4" /> },
}

function DraggableRow({
  id,
  visible,
  onToggle,
}: {
  id: SectionId
  visible: boolean
  onToggle: (id: SectionId, value: boolean) => void
}) {
  const controls = useDragControls()
  const { label, icon } = SECTION_META[id]

  return (
    <Reorder.Item
      value={id}
      dragListener={false}
      dragControls={controls}
      className="flex items-center gap-2 rounded-lg px-3 py-2.5 bg-background border select-none"
    >
      <button
        type="button"
        onPointerDown={(e) => controls.start(e)}
        className="cursor-grab active:cursor-grabbing text-muted-foreground hover:text-foreground touch-none"
      >
        <GripVerticalIcon className="w-4 h-4" />
      </button>

      <div className="flex items-center gap-2 flex-1 text-sm font-medium">
        {icon}
        {label}
      </div>

      <Switch
        checked={visible}
        onCheckedChange={(checked) => onToggle(id, checked)}
      />
    </Reorder.Item>
  )
}

interface SectionSettingsDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  order: SectionId[]
  visibility: SectionVisibility
  onReorder: (newOrder: SectionId[]) => void
  onToggle: (id: SectionId, value: boolean) => void
  onReset: () => void
}

export function SectionSettingsDialog({
  open,
  onOpenChange,
  order,
  visibility,
  onReorder,
  onToggle,
  onReset,
}: SectionSettingsDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-sm">
        <DialogHeader>
          <DialogTitle>Manage Sections</DialogTitle>
        </DialogHeader>
        <p className="text-xs text-muted-foreground -mt-2">
          Drag to reorder · Toggle to show/hide
        </p>
        <Reorder.Group
          axis="y"
          values={order}
          onReorder={onReorder}
          className="flex flex-col gap-2"
        >
          {order.map((id) => (
            <DraggableRow
              key={id}
              id={id}
              visible={visibility[id]}
              onToggle={onToggle}
            />
          ))}
        </Reorder.Group>
        <DialogFooter>
          <Button variant="outline" className="w-full" onClick={onReset}>
            Reset to Default
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
