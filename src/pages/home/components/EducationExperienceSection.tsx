import { AnimatedItem } from '#/components/common/AnimatedItem'
import { Badge } from '#/components/ui/badge'
import { Button } from '#/components/ui/button'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '#/components/ui/tabs'
import type { Education } from '#/types/education'
import type { Experience } from '#/types/experience'
import { ExperienceDetailDialog } from '#/pages/experience/components/ExperienceDetailDialog'
import { format } from 'date-fns'
import {
  ActivityIcon,
  BookOpenCheckIcon,
  BriefcaseIcon,
  BuildingIcon,
  CalendarIcon,
  ChevronRightIcon,
  FolderGitIcon,
  FrownIcon,
  GitBranchIcon,
  GraduationCapIcon,
  PresentationIcon,
  ShieldCheckIcon,
  TentIcon,
  UserRoundIcon,
} from 'lucide-react'
import { Link } from '@tanstack/react-router'

const EDU_TYPE_ICON: Record<Education['type'], React.ReactNode> = {
  DEGREE: <GraduationCapIcon className="w-3 h-3" />,
  BOOTCAMP: <TentIcon className="w-3 h-3" />,
  CERTIFICATE: <ShieldCheckIcon className="w-3 h-3" />,
  COURSE: <PresentationIcon className="w-3 h-3" />,
}

function EducationCard({ data }: { data: Education }) {
  const period =
    data.type === 'CERTIFICATE'
      ? `${data.endYear}.${String(data.endMonth).padStart(2, '0')}`
      : `${data.startYear}.${String(data.startMonth).padStart(2, '0')} – ${
          data.inProgress
            ? 'Present'
            : `${data.endYear}.${String(data.endMonth).padStart(2, '0')}`
        }`

  return (
    <div className="flex flex-col gap-1 rounded-lg border bg-card px-4 py-3">
      <div className="flex items-start justify-between gap-2">
        <span className="font-medium leading-snug">{data.title}</span>
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

const EXP_TYPE_ICON: Record<Experience['type'], React.ReactNode> = {
  Work: <BriefcaseIcon className="w-3 h-3" />,
  Project: <FolderGitIcon className="w-3 h-3" />,
  Activity: <ActivityIcon className="w-3 h-3" />,
  'Open Source': <GitBranchIcon className="w-3 h-3" />,
}

function ExperienceCard({ data, onClick }: { data: Experience; onClick?: (d: Experience) => void }) {
  const period = `${format(data.startDate, 'MMM yyyy')} – ${
    data.isCurrentlyWorking || !data.endDate
      ? 'Present'
      : format(data.endDate, 'MMM yyyy')
  }`

  return (
    <div
      className="flex flex-col gap-1 rounded-lg border bg-card px-4 py-3 cursor-pointer hover:bg-accent/50 transition-colors"
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
          {EXP_TYPE_ICON[data.type]}
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
        <div className="flex flex-wrap gap-1 mt-1">
          {data.techStack.slice(0, 4).map((t, i) => (
            <Badge
              key={i}
              variant="outline"
              className="text-xs px-1.5 py-0 h-auto gap-1"
            >
              {t.iconUrl && (
                <img
                  src={t.iconUrl}
                  alt={t.name}
                  className="w-3 h-3 object-contain"
                />
              )}
              {t.name}
            </Badge>
          ))}
          {data.techStack.length > 4 && (
            <Badge variant="outline" className="text-xs px-1.5 py-0 h-auto">
              +{data.techStack.length - 4}
            </Badge>
          )}
        </div>
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

  return (
    <div className="flex flex-col gap-6">
      {currentItems.length > 0 && (
        <div className="flex flex-col gap-2">
          <div className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">
            Current
          </div>
          {currentItems.map((item, i) => (
            <AnimatedItem key={item.id} index={i}>
              {renderCard(item)}
            </AnimatedItem>
          ))}
        </div>
      )}
      {sortedYears.map((year) => (
        <div key={year} className="flex flex-col gap-2">
          <div className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">
            {year}
          </div>
          {grouped[year].map((item, i) => (
            <AnimatedItem key={item.id} index={i}>
              {renderCard(item)}
            </AnimatedItem>
          ))}
        </div>
      ))}
    </div>
  )
}

interface EducationExperienceSectionProps {
  recentEducation: Education[]
  recentExperience: Experience[]
  detailExperience: Experience | null
  showExperienceDetail: boolean
  setShowExperienceDetail: (open: boolean) => void
  onExperienceCardClick: (experience: Experience) => void
  muted?: boolean
}

export function EducationExperienceSection({
  recentEducation,
  recentExperience,
  detailExperience,
  showExperienceDetail,
  setShowExperienceDetail,
  onExperienceCardClick,
  muted = false,
}: EducationExperienceSectionProps) {
  return (
    <>
    <AnimatedItem>
      <div
        className={`flex flex-col gap-4 px-6 py-8${muted ? ' bg-muted' : ''}`}
      >
        <div className="flex items-center gap-2 text-3xl font-bold text-foreground">
          <BookOpenCheckIcon className="w-7 h-7" />
          Education & Experience
        </div>
        <p className="text-muted-foreground -mt-2">
          Academic background and hands-on experience
        </p>

        <Tabs defaultValue="experience">
          <TabsList className="mb-2">
            <TabsTrigger value="experience">Experience</TabsTrigger>
            <TabsTrigger value="education">Education</TabsTrigger>
          </TabsList>

          <TabsContent value="experience">
            <GroupedList
              items={recentExperience}
              groupKey={(e) => (e.endDate ?? e.startDate).getFullYear()}
              renderCard={(e) => <ExperienceCard data={e} onClick={onExperienceCardClick} />}
            />
            <Button variant="ghost" asChild className="mt-4 w-full">
              <Link to="/experience">
                View All Experience
                <ChevronRightIcon className="w-4 h-4" />
              </Link>
            </Button>
          </TabsContent>

          <TabsContent value="education">
            <GroupedList
              items={recentEducation}
              groupKey={(e) => e.endYear ?? e.startYear}
              renderCard={(e) => <EducationCard data={e} />}
            />
            <Button variant="ghost" asChild className="mt-4 w-full">
              <Link to="/education">
                View All Education
                <ChevronRightIcon className="w-4 h-4" />
              </Link>
            </Button>
          </TabsContent>
        </Tabs>
      </div>
    </AnimatedItem>

    <ExperienceDetailDialog
      experience={detailExperience}
      open={showExperienceDetail}
      onOpenChange={setShowExperienceDetail}
    />
  </>
  )
}
