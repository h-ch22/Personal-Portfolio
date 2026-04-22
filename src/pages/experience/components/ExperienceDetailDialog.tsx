import { format } from 'date-fns'
import { BuildingIcon, CalendarIcon, FolderGitIcon, ImageIcon, UserRoundIcon } from 'lucide-react'

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '#/components/ui/dialog'
import { Badge } from '#/components/ui/badge'
import { Button } from '#/components/ui/button'
import { ScrollArea } from '#/components/ui/scroll-area'
import { TECH_STACK_GROUP_COLORS, type TechStackGroup } from '#/types/techstack'
import type { Experience } from '#/types/experience'
import { EXP_TYPE_ICONS } from '#/lib/experience'
import { groupAndOrderTechStack } from '#/lib/techstack'

const ExperienceDetailDialog = ({
  experience,
  open,
  onOpenChange,
  linkedProjectCount = 0,
  onViewProjects,
}: {
  experience: Experience | null
  open: boolean
  onOpenChange: (open: boolean) => void
  linkedProjectCount?: number
  onViewProjects?: () => void
}) => {
  const TypeIcon = experience ? EXP_TYPE_ICONS[experience.type] : null
  const periodLabel = experience
    ? `${format(experience.startDate, 'MMM yyyy')} – ${
        experience.isCurrentlyWorking || !experience.endDate
          ? 'Present'
          : format(experience.endDate, 'MMM yyyy')
      }`
    : ''

  return (
    <Dialog open={open && experience !== null} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl w-full p-0 overflow-hidden max-h-[90vh] flex flex-col">
        {experience ? (
          <>
            {experience.logoUrl ? (
              <div className="flex items-center justify-center h-40 bg-muted">
                <img
                  src={experience.logoUrl}
                  alt={experience.title}
                  className="h-28 w-28 object-contain"
                />
              </div>
            ) : (
              <div className="flex items-center justify-center h-32 bg-muted text-muted-foreground">
                <ImageIcon className="w-10 h-10" />
              </div>
            )}

            <ScrollArea className="flex-1 overflow-y-auto">
              <div className="px-6 py-5 flex flex-col gap-5">
                <DialogHeader>
                  <div className="flex items-start justify-between gap-3">
                    <DialogTitle className="text-2xl font-bold leading-tight">
                      {experience.title}
                    </DialogTitle>
                    <Badge className="shrink-0 flex items-center gap-1.5">
                      {TypeIcon && <TypeIcon className="w-4 h-4" />}
                      {experience.type}
                    </Badge>
                  </div>
                </DialogHeader>

                <div className="flex flex-col gap-1.5 text-sm text-muted-foreground">
                  <div className="flex items-center gap-1.5">
                    <BuildingIcon className="w-4 h-4 shrink-0" />
                    <span>{experience.company}</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <UserRoundIcon className="w-4 h-4 shrink-0" />
                    <span>{experience.role}</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <CalendarIcon className="w-4 h-4 shrink-0" />
                    <span>{periodLabel}</span>
                  </div>
                </div>

                {onViewProjects && linkedProjectCount > 0 && (
                  <Button
                    variant="outline"
                    className="w-fit border-primary/40 text-primary hover:bg-primary/10 hover:border-primary/60"
                    onClick={() => {
                      onOpenChange(false)
                      onViewProjects()
                    }}
                  >
                    <FolderGitIcon className="w-4 h-4" />
                    View Projects ({linkedProjectCount})
                  </Button>
                )}

                {experience.techStack.length > 0 && (() => {
                  const { grouped, orderedGroups } = groupAndOrderTechStack(experience.techStack)
                  return (
                    <div className="flex flex-col gap-3">
                      <span className="text-sm font-semibold">Tech Stack</span>
                      {orderedGroups.map((g) => (
                        <div key={g} className="flex flex-wrap items-center gap-1.5">
                          <span className="text-xs font-medium text-muted-foreground w-16 shrink-0">{g}</span>
                          <div className="flex flex-wrap gap-1.5">
                            {grouped[g].map((tech, i) => (
                              <Badge
                                key={i}
                                variant="outline"
                                className={`flex items-center gap-1.5 px-2 py-1 h-auto border-0 ${TECH_STACK_GROUP_COLORS[(g as TechStackGroup)] ?? TECH_STACK_GROUP_COLORS.Other}`}
                              >
                                {tech.iconUrl && (
                                  <img
                                    src={tech.iconUrl}
                                    alt={tech.name}
                                    className="w-4 h-4 object-contain"
                                  />
                                )}
                                <span className="text-xs">{tech.name}</span>
                              </Badge>
                            ))}
                          </div>
                        </div>
                      ))}
                    </div>
                  )
                })()}

                <div
                  className="prose prose-sm dark:prose-invert max-w-none"
                  dangerouslySetInnerHTML={{ __html: experience.description }}
                />
              </div>
            </ScrollArea>
          </>
        ) : null}
      </DialogContent>
    </Dialog>
  )
}

export { ExperienceDetailDialog }
