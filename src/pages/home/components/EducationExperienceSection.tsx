import { useState } from 'react'
import { AnimatedItem } from '#/components/common/AnimatedItem'
import { Badge } from '#/components/ui/badge'
import { Button } from '#/components/ui/button'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '#/components/ui/tabs'
import type { Education } from '#/types/education'
import type { Experience } from '#/types/experience'
import type { Project } from '#/types/project'
import type { Award } from '#/types/award'
import { ExperienceDetailDialog } from '#/pages/experience/components/ExperienceDetailDialog'
import { AwardListItem } from '#/pages/awards/components/AwardListItem'
import { format } from 'date-fns'
import {
  BookOpenCheckIcon,
  BuildingIcon,
  CalendarIcon,
  ChevronRightIcon,
  FolderGitIcon,
  FrownIcon,
  GraduationCapIcon,
  PresentationIcon,
  ShieldCheckIcon,
  TentIcon,
  UserRoundIcon,
} from 'lucide-react'
import { Link } from '@tanstack/react-router'
import { cn } from '#/lib/utils'
import { TECH_STACK_GROUP_COLORS } from '#/types/techstack'
import type { TechStackGroup } from '#/types/techstack'
import { EXP_TYPE_ICONS } from '#/lib/experience'
import { groupAndOrderTechStack } from '#/lib/techstack'

const EDU_TYPE_ICON: Record<Education['type'], React.ReactNode> = {
  DEGREE: <GraduationCapIcon className="w-3 h-3" />,
  BOOTCAMP: <TentIcon className="w-3 h-3" />,
  CERTIFICATE: <ShieldCheckIcon className="w-3 h-3" />,
  COURSE: <PresentationIcon className="w-3 h-3" />,
}

function EducationCard({ data }: { data: Education }) {
  const period =
    data.type === 'CERTIFICATE'
      ? format(new Date(data.endYear, data.endMonth - 1, 1), 'MMM yyyy')
      : `${format(new Date(data.startYear, data.startMonth - 1, 1), 'MMM yyyy')} – ${
          data.inProgress
            ? 'Present'
            : format(new Date(data.endYear, data.endMonth - 1, 1), 'MMM yyyy')
        }`

  return (
    <div className="flex flex-col gap-1 rounded-lg border bg-card px-4 py-3">
      <div className="flex items-start justify-between gap-2">
        <div className="flex items-center gap-2">
          {data.logoUrl && (
            <img
              src={data.logoUrl}
              alt={data.title}
              className="w-6 h-6 rounded-sm object-contain shrink-0 bg-muted p-0.5"
            />
          )}
          <span className="font-medium leading-snug">{data.title}</span>
        </div>
        <Badge variant="secondary" className="shrink-0 gap-1 text-xs">
          {EDU_TYPE_ICON[data.type]}
          {data.type}
        </Badge>
      </div>
      <div className="flex flex-wrap items-center justify-between gap-x-4 gap-y-1 text-xs text-muted-foreground">
        <span className="flex items-center gap-1">
          <BuildingIcon className="w-3 h-3" />
          {data.organization}
        </span>
        <span className="flex items-center gap-1">
          <CalendarIcon className="w-3 h-3" />
          {period}
        </span>
      </div>
      {data.description && (
        <p className="text-xs text-muted-foreground line-clamp-2 mt-0.5">
          {data.description}
        </p>
      )}
    </div>
  )
}

function ExperienceCard({
  data,
  onClick,
  linkedProjectCount = 0,
  onViewProjects,
}: {
  data: Experience
  onClick?: (d: Experience) => void
  linkedProjectCount?: number
  onViewProjects?: () => void
}) {
  const TypeIcon = EXP_TYPE_ICONS[data.type]
  const period = `${format(data.startDate, 'MMM yyyy')} – ${
    data.isCurrentlyWorking || !data.endDate
      ? 'Present'
      : format(data.endDate, 'MMM yyyy')
  }`

  return (
    <div
      className="flex flex-col gap-2 rounded-lg border bg-card px-4 py-3 sm:px-5 sm:py-4 cursor-pointer hover:bg-accent/50 transition-colors"
      onClick={() => onClick?.(data)}
    >
      <div className="flex items-start justify-between gap-2">
        <div className="flex items-center gap-2">
          {data.logoUrl && (
            <img
              src={data.logoUrl}
              alt={data.title}
              className="w-8 h-8 rounded-md object-contain shrink-0 bg-muted p-0.5"
            />
          )}
          <span className="font-medium leading-snug">{data.title}</span>
        </div>
        <Badge variant="secondary" className="shrink-0 gap-1 text-xs">
          <TypeIcon className="w-3 h-3" />
          {data.type}
        </Badge>
      </div>
      <div className="flex flex-wrap items-center justify-between gap-x-4 gap-y-1 text-xs text-muted-foreground">
        <div className="flex flex-col gap-0.5">
          <span className="flex items-center gap-1">
            <BuildingIcon className="w-3 h-3" />
            {data.company}
          </span>
          <span className="flex items-center gap-1">
            <UserRoundIcon className="w-3 h-3" />
            {data.role}
          </span>
        </div>
        <span className="flex items-center gap-1">
          <CalendarIcon className="w-3 h-3" />
          {period}
        </span>
      </div>
      {data.techStack.length > 0 && (
        <>
          {(() => {
            const { grouped, orderedGroups } = groupAndOrderTechStack(
              data.techStack,
            )
            return (
              <div className="flex flex-col gap-1 mt-1">
                {orderedGroups.map((g) => (
                  <div key={g} className="flex flex-wrap items-center gap-1">
                    <span className="text-xs font-medium text-muted-foreground w-14 shrink-0">
                      {g}
                    </span>
                    <div className="flex flex-wrap gap-1">
                      {grouped[g].map((tech, i) => (
                        <Badge
                          key={i}
                          variant="outline"
                          className={cn(
                            'text-xs px-1.5 py-0 h-auto gap-1 border-0',
                            TECH_STACK_GROUP_COLORS[g as TechStackGroup] ??
                              TECH_STACK_GROUP_COLORS.Other,
                          )}
                        >
                          {tech.iconUrl && (
                            <img
                              src={tech.iconUrl}
                              alt={tech.name}
                              className="w-3 h-3 object-contain"
                            />
                          )}
                          {tech.name}
                        </Badge>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            )
          })()}
        </>
      )}
      {onViewProjects && linkedProjectCount > 0 && (
        <Button
          variant="outline"
          size="sm"
          className="w-fit mt-1 border-primary/40 text-primary hover:bg-primary/10 hover:border-primary/60"
          onClick={(e) => {
            e.stopPropagation()
            onViewProjects()
          }}
        >
          <FolderGitIcon className="w-3.5 h-3.5" />
          View Projects ({linkedProjectCount})
        </Button>
      )}
    </div>
  )
}

function GroupedList<
  T extends { id: string; inProgress?: boolean; isCurrentlyWorking?: boolean },
>({
  items,
  groupKey,
  renderCard,
}: {
  items: T[]
  groupKey: (item: T) => number
  renderCard: (item: T) => React.ReactNode
}) {
  if (items.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-10 text-muted-foreground gap-2 text-sm">
        <FrownIcon className="w-6 h-6" />
        There is no content to display :(
      </div>
    )
  }

  const currentItems = items.filter(
    (i) => i.inProgress === true || i.isCurrentlyWorking === true,
  )
  const nonCurrentItems = items.filter(
    (i) => !i.inProgress && !i.isCurrentlyWorking,
  )

  const grouped = nonCurrentItems.reduce<Record<number, T[]>>((acc, item) => {
    const key = groupKey(item)
    if (!acc[key]) acc[key] = []
    acc[key].push(item)
    return acc
  }, {})

  const sortedYears = Object.keys(grouped)
    .map(Number)
    .sort((a, b) => b - a)

  const sections = [
    ...(currentItems.length > 0
      ? [{ label: 'Current', isCurrent: true, items: currentItems }]
      : []),
    ...sortedYears.map((year) => ({
      label: String(year),
      isCurrent: false,
      items: grouped[year],
    })),
  ]

  return (
    <div className="flex flex-col gap-5">
      {sections.map(({ label, isCurrent, items: sectionItems }) => (
        <div key={label}>
          <div className="flex items-center gap-2 mb-3">
            <div
              className={cn(
                'w-2.5 h-2.5 rounded-full shrink-0',
                isCurrent
                  ? 'bg-primary'
                  : 'bg-background border-2 border-muted-foreground/40',
              )}
            />
            <span className="text-sm font-semibold uppercase tracking-widest text-muted-foreground">
              {label}
            </span>
            <div className="flex-1 h-px bg-border" />
          </div>
          <div className="ml-1 border-l border-border pl-5 flex flex-col gap-2">
            {sectionItems.map((item, i) => (
              <AnimatedItem key={item.id} index={i}>
                {renderCard(item)}
              </AnimatedItem>
            ))}
          </div>
        </div>
      ))}
    </div>
  )
}

interface EducationExperienceSectionProps {
  recentEducation: Education[]
  recentExperience: Experience[]
  recentAwards?: Award[]
  allProjects?: Project[]
  detailExperience: Experience | null
  showExperienceDetail: boolean
  setShowExperienceDetail: (open: boolean) => void
  onExperienceCardClick: (experience: Experience) => void
  onExperienceViewProjects?: (experienceId: string) => void
  onAwardViewProject?: (projectId: string) => void
  muted?: boolean
}

export function EducationExperienceSection({
  recentEducation,
  recentExperience,
  recentAwards = [],
  allProjects = [],
  detailExperience,
  showExperienceDetail,
  setShowExperienceDetail,
  onExperienceCardClick,
  onExperienceViewProjects,
  onAwardViewProject,
  muted = false,
}: EducationExperienceSectionProps) {
  const [activeTab, setActiveTab] = useState<
    'experience' | 'education' | 'awards'
  >('experience')

  return (
    <>
      <AnimatedItem>
        <div
          className={`flex flex-col gap-4 px-6 py-8${muted ? ' bg-muted' : ''}`}
        >
          <div className="flex flex-row items-end justify-between">
            <div>
              <div className="flex items-center gap-2 text-3xl font-bold text-foreground">
                <BookOpenCheckIcon className="w-7 h-7" />
                Experience & Education
              </div>
              <p className="text-muted-foreground mt-1">
                Hands-on experience, awards, and Academic background
              </p>
            </div>
            <Button variant="ghost" asChild>
              <Link
                to={
                  activeTab === 'experience'
                    ? '/experience'
                    : activeTab === 'education'
                      ? '/education'
                      : '/awards'
                }
              >
                View All
                <ChevronRightIcon className="w-4 h-4" />
              </Link>
            </Button>
          </div>

          <Tabs
            value={activeTab}
            onValueChange={(v) => setActiveTab(v as typeof activeTab)}
          >
            <TabsList className="mb-2">
              <TabsTrigger value="experience">Experience</TabsTrigger>
              <TabsTrigger value="awards">Awards</TabsTrigger>
              <TabsTrigger value="education">Education</TabsTrigger>
            </TabsList>

            <TabsContent value="experience">
              <GroupedList
                items={recentExperience}
                groupKey={(e) => (e.endDate ?? e.startDate).getFullYear()}
                renderCard={(e) => {
                  const count = allProjects.filter(
                    (p) => p.experienceId === e.id,
                  ).length
                  return (
                    <ExperienceCard
                      data={e}
                      onClick={onExperienceCardClick}
                      linkedProjectCount={count}
                      onViewProjects={
                        count > 0 && onExperienceViewProjects
                          ? () => onExperienceViewProjects(e.id)
                          : undefined
                      }
                    />
                  )
                }}
              />
            </TabsContent>

            <TabsContent value="education">
              <GroupedList
                items={recentEducation}
                groupKey={(e) => e.endYear ?? e.startYear}
                renderCard={(e) => <EducationCard data={e} />}
              />
            </TabsContent>

            <TabsContent value="awards">
              {recentAwards.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-10 text-muted-foreground gap-2 text-sm">
                  <FrownIcon className="w-6 h-6" />
                  There is no content to display :(
                </div>
              ) : (
                <div className="flex flex-col">
                  {recentAwards.map((award, i) => (
                    <AnimatedItem key={award.id} index={i}>
                      <AwardListItem
                        data={award}
                        showAdminActions={false}
                        onViewProject={
                          award.projectId &&
                          allProjects.some((p) => p.id === award.projectId) &&
                          onAwardViewProject
                            ? () => onAwardViewProject(award.projectId!)
                            : undefined
                        }
                      />
                    </AnimatedItem>
                  ))}
                </div>
              )}
            </TabsContent>
          </Tabs>
        </div>
      </AnimatedItem>

      <ExperienceDetailDialog
        experience={detailExperience}
        open={showExperienceDetail}
        onOpenChange={setShowExperienceDetail}
        linkedProjectCount={
          detailExperience
            ? allProjects.filter((p) => p.experienceId === detailExperience.id)
                .length
            : 0
        }
        onViewProjects={
          detailExperience && onExperienceViewProjects
            ? () => {
                setShowExperienceDetail(false)
                onExperienceViewProjects(detailExperience.id)
              }
            : undefined
        }
      />
    </>
  )
}
