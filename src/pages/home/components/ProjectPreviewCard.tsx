import { format } from 'date-fns'
import {
  CalendarIcon,
  ExternalLinkIcon,
  GithubIcon,
  ImagesIcon,
} from 'lucide-react'
import { Badge } from '#/components/ui/badge'
import { Card, CardContent, CardHeader, CardTitle } from '#/components/ui/card'
import {
  TECH_STACK_GROUP_COLORS,
  TECH_STACK_GROUPS,
  type TechStackGroup,
} from '#/types/techstack'
import type { Project } from '#/types/project'

const ProjectPreviewCard = ({
  data,
  onClick,
}: {
  data: Project
  onClick: (data: Project) => void
}) => {
  const thumbnail = data.images[0]?.url

  return (
    <Card
      className="overflow-hidden cursor-pointer hover:shadow-md transition-shadow gap-0 flex flex-col"
      onClick={() => onClick(data)}
    >
      <div className="w-full h-48 bg-muted overflow-hidden shrink-0">
        {thumbnail ? (
          <img
            src={thumbnail}
            alt={data.title}
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-muted-foreground">
            <ImagesIcon className="w-8 h-8" />
          </div>
        )}
      </div>

      <CardHeader className="pt-3 pb-1">
        <CardTitle className="text-base">
          <div className="flex items-center gap-2">
            {data.logoUrl && (
              <img
                src={data.logoUrl}
                alt={data.title}
                className="w-7 h-7 rounded-md object-contain shrink-0 bg-muted p-0.5"
              />
            )}
            <span className="line-clamp-1 flex-1">{data.title}</span>
            {data.isExperimental && (
              <Badge
                variant="outline"
                className="shrink-0 text-xs border-amber-400 text-amber-600 dark:text-amber-400"
              >
                Experimental
              </Badge>
            )}
          </div>
        </CardTitle>
      </CardHeader>

      <CardContent className="pb-3 flex flex-col gap-2 flex-1">
        <div className="flex flex-row items-center gap-3 text-xs text-muted-foreground flex-wrap">
          <div className="flex items-center gap-1">
            <CalendarIcon className="w-3.5 h-3.5" />
            <span>
              {format(data.startDate, 'MMM yyyy')}
              {' – '}
              {data.isOngoing
                ? 'Present'
                : data.endDate
                  ? format(data.endDate, 'MMM yyyy')
                  : '…'}
            </span>
          </div>
          {data.link && (
            <div className="flex items-center gap-1">
              <ExternalLinkIcon className="w-3.5 h-3.5" />
              <span>Link</span>
            </div>
          )}
          {data.githubUrl && (
            <div className="flex items-center gap-1">
              <GithubIcon className="w-3.5 h-3.5" />
              <span>GitHub</span>
            </div>
          )}
        </div>

        {data.techStack.length > 0 && (
          <>
            <div className="flex flex-wrap gap-1 sm:hidden">
              {data.techStack.slice(0, 5).map((tech, i) => {
                const groupColor =
                  TECH_STACK_GROUP_COLORS[
                    (tech.group ?? 'Other') as TechStackGroup
                  ] ?? TECH_STACK_GROUP_COLORS.Other
                return (
                  <Badge
                    key={i}
                    variant="outline"
                    className={`flex items-center gap-1 px-1.5 py-0.5 h-auto text-xs border-0 ${groupColor}`}
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
                )
              })}
              {data.techStack.length > 5 && (
                <Badge
                  variant="outline"
                  className="text-xs px-1.5 py-0.5 h-auto"
                >
                  +{data.techStack.length - 5}
                </Badge>
              )}
            </div>

            {(() => {
              const grouped = data.techStack.reduce<
                Record<string, typeof data.techStack>
              >((acc, tech) => {
                const g = tech.group ?? 'Other'
                if (!acc[g]) acc[g] = []
                acc[g].push(tech)
                return acc
              }, {})
              const orderedGroups = [
                ...TECH_STACK_GROUPS.filter((g) => grouped[g]),
                ...Object.keys(grouped).filter(
                  (g) => !TECH_STACK_GROUPS.includes(g as TechStackGroup),
                ),
              ]
              return (
                <div className="hidden sm:flex flex-col gap-1">
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
                            className={`flex items-center gap-1 px-1.5 py-0.5 h-auto text-xs border-0 ${TECH_STACK_GROUP_COLORS[g as TechStackGroup] ?? TECH_STACK_GROUP_COLORS.Other}`}
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
      </CardContent>
    </Card>
  )
}

export { ProjectPreviewCard }
