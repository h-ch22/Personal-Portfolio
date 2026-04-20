import { AnimatedItem } from '#/components/common/AnimatedItem'
import { Button } from '#/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '#/components/ui/dialog'
import { FolderKanbanIcon, Settings2Icon, ImagesIcon, CheckIcon } from 'lucide-react'
import { Link } from '@tanstack/react-router'
import { ChevronRightIcon, FrownIcon } from 'lucide-react'
import type { User } from 'firebase/auth'
import type { Project } from '#/types/project'
import { ProjectDetailDialog } from '#/pages/projects/components/ProjectDetailDialog'
import { ProjectPreviewCard } from './ProjectPreviewCard'

interface FeaturedProjectsSectionProps {
  featuredProjects: Project[]
  allProjects: Project[]
  featuredSelectedIds: string[]
  user: User | null
  isAdmin: boolean
  isSavingFeatured: boolean
  maxFeatured: number
  showSelectDialog: boolean
  setShowSelectDialog: (open: boolean) => void
  onOpenSelectDialog: () => void
  onToggle: (id: string) => void
  onSave: () => void
  detailProject: Project | null
  showDetail: boolean
  setShowDetail: (open: boolean) => void
  onCardClick: (project: Project) => void
  muted?: boolean
}

export function FeaturedProjectsSection({
  featuredProjects,
  allProjects,
  featuredSelectedIds,
  user,
  isAdmin,
  isSavingFeatured,
  maxFeatured,
  showSelectDialog,
  setShowSelectDialog,
  onOpenSelectDialog,
  onToggle,
  onSave,
  detailProject,
  showDetail,
  setShowDetail,
  onCardClick,
  muted = false,
}: FeaturedProjectsSectionProps) {
  return (
    <>
      <AnimatedItem>
        <div className={`flex flex-col gap-4 px-6 py-8${muted ? ' bg-muted' : ''}`}>
          <div className="flex flex-row items-end justify-between">
            <div>
              <div className="flex items-center gap-2 text-3xl font-bold text-foreground">
                <FolderKanbanIcon className="w-7 h-7" />
                Featured Projects
              </div>
              <p className="text-muted-foreground mt-1">
                Highlighted work and key projects
              </p>
            </div>
            <div className="flex items-center gap-2">
              {user && isAdmin && (
                <Button
                  variant="outline"
                  size="icon"
                  onClick={onOpenSelectDialog}
                >
                  <Settings2Icon className="w-4 h-4" />
                </Button>
              )}
              <Button variant="ghost" asChild>
                <Link to="/projects">
                  View All
                  <ChevronRightIcon className="w-4 h-4" />
                </Link>
              </Button>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-4">
            {featuredProjects.length > 0 ? (
              featuredProjects.map((project, i) => (
                <AnimatedItem key={project.id} index={i}>
                  <ProjectPreviewCard data={project} onClick={onCardClick} />
                </AnimatedItem>
              ))
            ) : (
              <div className="flex flex-col justify-center items-center w-full col-span-3 text-muted-foreground text-sm py-8 gap-2">
                <FrownIcon />
                {user && isAdmin
                  ? 'No featured projects. Click the settings icon to select projects.'
                  : 'There is no content to display :('}
              </div>
            )}
          </div>
        </div>
      </AnimatedItem>

      <Dialog open={showSelectDialog} onOpenChange={setShowSelectDialog}>
        <DialogContent className="max-w-2xl w-full max-h-[80vh] flex flex-col">
          <DialogHeader>
            <DialogTitle>Select Featured Projects</DialogTitle>
            <p className="text-sm text-muted-foreground">
              Select up to {maxFeatured} projects to feature on the home page.{' '}
              <span className="font-medium text-foreground">
                {featuredSelectedIds.length}/{maxFeatured}
              </span>{' '}
              selected.
            </p>
          </DialogHeader>

          <div className="flex-1 overflow-y-auto">
            {allProjects.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-12 text-muted-foreground gap-2">
                <FrownIcon className="w-8 h-8" />
                <span className="text-sm">No projects available.</span>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 p-1">
                {[...allProjects]
                  .sort(
                    (a, b) =>
                      new Date(b.startDate).getTime() -
                      new Date(a.startDate).getTime(),
                  )
                  .map((project) => {
                    const isSelected = featuredSelectedIds.includes(project.id)
                    const isDisabled = !isSelected && featuredSelectedIds.length >= maxFeatured
                    const thumbnail = project.images[0]?.url

                    return (
                      <button
                        key={project.id}
                        type="button"
                        onClick={() => onToggle(project.id)}
                        disabled={isDisabled}
                        className={`flex items-center gap-3 rounded-lg border p-3 text-left transition-colors ${
                          isSelected
                            ? 'border-primary bg-primary/5'
                            : isDisabled
                              ? 'opacity-40 cursor-not-allowed border-border'
                              : 'border-border hover:border-primary/50 hover:bg-muted/50'
                        }`}
                      >
                        <div className="w-14 h-14 rounded-md bg-muted overflow-hidden shrink-0">
                          {thumbnail ? (
                            <img
                              src={thumbnail}
                              alt={project.title}
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center text-muted-foreground">
                              <ImagesIcon className="w-5 h-5" />
                            </div>
                          )}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="font-medium text-sm line-clamp-1">
                            {project.title}
                          </div>
                          {project.techStack.length > 0 && (
                            <div className="text-xs text-muted-foreground mt-0.5 line-clamp-1">
                              {project.techStack
                                .slice(0, 3)
                                .map((t) => t.name)
                                .join(', ')}
                              {project.techStack.length > 3 && ` +${project.techStack.length - 3}`}
                            </div>
                          )}
                        </div>
                        <div
                          className={`w-5 h-5 rounded-full border-2 flex items-center justify-center shrink-0 transition-colors ${
                            isSelected
                              ? 'border-primary bg-primary text-primary-foreground'
                              : 'border-muted-foreground'
                          }`}
                        >
                          {isSelected && <CheckIcon className="w-3 h-3" />}
                        </div>
                      </button>
                    )
                  })}
              </div>
            )}
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setShowSelectDialog(false)}>
              Cancel
            </Button>
            <Button onClick={onSave} disabled={isSavingFeatured}>
              Save
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <ProjectDetailDialog
        project={detailProject}
        open={showDetail}
        onOpenChange={setShowDetail}
      />
    </>
  )
}
