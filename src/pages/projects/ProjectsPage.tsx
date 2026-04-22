import { useEffect, useState } from 'react'
import { format } from 'date-fns'
import { AnimatedItem } from '#/components/common/AnimatedItem'
import { BoardHeader } from '#/components/common/BoardHeader'
import { MonthRangePicker } from '#/components/common/MonthRangePicker'
import { Badge } from '#/components/ui/badge'
import { Button } from '#/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '#/components/ui/dialog'
import { Input } from '#/components/ui/input'
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '#/components/ui/popover'
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '#/components/ui/select'
import { cn } from '#/lib/utils'
import { CalendarIcon, FrownIcon, LaptopMinimalCheckIcon, SearchIcon, XIcon } from 'lucide-react'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '#/components/ui/tabs'
import { AddProject } from './components/AddProject'
import { ProjectCard } from './components/ProjectCard'
import { ProjectDetailDialog } from './components/ProjectDetailDialog'
import { useProjectsPageController } from './hooks/useProjectsPage'
import { Route } from '#/routes/projects'

const ProjectsPage = () => {
  const {
    form,
    showAddDialog,
    showDetailDialog,
    handleAddDialogClose,
    handleDetailDialogClose,
    selectedData,
    detailData,
    filteredData,
    allTechNames,
    searchText,
    setSearchText,
    techFilter,
    setTechFilter,
    dateRangeFilter,
    setDateRangeFilter,
    richDescription,
    setRichDescription,
    pendingFiles,
    setPendingFiles,
    existingImages,
    deletedImagePaths,
    onMarkImageForDeletion,
    onUnmarkImageForDeletion,
    logoFile,
    setLogoFile,
    existingLogoUrl,
    setExistingLogoUrl,
    onCardClick,
    onModifyButtonClick,
    onDeleteButtonClick,
    experienceFilter,
    setExperienceFilter,
    allExperiences,
  } = useProjectsPageController()

  const { experienceId: experienceIdParam } = Route.useSearch()

  useEffect(() => {
    if (experienceIdParam) setExperienceFilter(experienceIdParam)
  }, [experienceIdParam])

  const [datePickerOpen, setDatePickerOpen] = useState(false)
  const clearDateRange = () => setDateRangeFilter({ from: null, to: null })

  const isSearching = searchText.trim() !== '' || techFilter.length > 0 || dateRangeFilter.from !== null || experienceFilter !== ''
  const normalProjects = filteredData.filter((p) => !p.isExperimental)
  const experimentalProjects = filteredData.filter((p) => p.isExperimental)

  const sortByDate = (arr: typeof filteredData) =>
    [...arr].sort((a, b) => new Date(b.startDate).getTime() - new Date(a.startDate).getTime())

  const getLinkedExperience = (experienceId?: string) =>
    experienceId ? allExperiences.find((e) => e.id === experienceId) : undefined

  return (
    <div className="w-full flex flex-1 flex-col px-4">
      <BoardHeader
        title="Projects"
        description="A showcase of things I've built — from side projects to production systems. 🚀"
        Icon={LaptopMinimalCheckIcon}
        onAddButtonClick={() => handleAddDialogClose(true)}
      />

      <div className="flex flex-row justify-end items-center gap-2 mt-2">
        <Popover open={datePickerOpen} onOpenChange={setDatePickerOpen}>
          <PopoverTrigger asChild>
            <Button
              variant="outline"
              className={cn('gap-2', dateRangeFilter.from && 'border-primary text-primary')}
            >
              <CalendarIcon className="h-4 w-4" />
              {dateRangeFilter.from
                ? dateRangeFilter.to
                  ? `${format(dateRangeFilter.from, 'MMM yyyy')} – ${format(dateRangeFilter.to, 'MMM yyyy')}`
                  : `${format(dateRangeFilter.from, 'MMM yyyy')} – …`
                : 'Period'}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0" align="end">
            <MonthRangePicker
              from={dateRangeFilter.from}
              to={dateRangeFilter.to}
              onSelect={({ from, to }) => {
                setDateRangeFilter({ from, to })
                if (to !== null) setDatePickerOpen(false)
              }}
            />
            {dateRangeFilter.from && (
              <div className="px-3 pb-3">
                <Button
                  variant="ghost"
                  size="sm"
                  className="w-full text-muted-foreground"
                  onClick={() => { clearDateRange(); setDatePickerOpen(false) }}
                >
                  Clear
                </Button>
              </div>
            )}
          </PopoverContent>
        </Popover>
        <Input
          className="flex-1 max-w-96"
          placeholder="Search by title or tech stack..."
          value={searchText}
          onChange={(e) => setSearchText(e.target.value)}
        />
        <Button>
          <SearchIcon className="h-4 w-4" />
        </Button>
      </div>

      {allTechNames.length > 0 && (
        <div className="flex flex-wrap gap-1.5 mt-2 justify-end">
          {allTechNames.map((tech) => {
            const active = techFilter.includes(tech)
            return (
              <button
                key={tech}
                type="button"
                onClick={() =>
                  setTechFilter((prev) =>
                    active ? prev.filter((t) => t !== tech) : [...prev, tech],
                  )
                }
              >
                <Badge
                  variant={active ? 'default' : 'outline'}
                  className="cursor-pointer transition-colors"
                >
                  {tech}
                </Badge>
              </button>
            )
          })}
        </div>
      )}

      {allExperiences.length > 0 && (
        <div className="flex items-center gap-2 mt-2 justify-end">
          <Select
            value={experienceFilter || '__all__'}
            onValueChange={(v) => setExperienceFilter(v === '__all__' ? '' : v)}
          >
            <SelectTrigger className={cn('w-64 h-8 text-xs', experienceFilter && 'border-primary text-primary')}>
              <SelectValue placeholder="Filter by experience" />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                <SelectItem value="__all__">All experiences</SelectItem>
                {[...allExperiences]
                  .sort((a, b) => {
                    if (a.isCurrentlyWorking && !b.isCurrentlyWorking) return -1
                    if (!a.isCurrentlyWorking && b.isCurrentlyWorking) return 1
                    const aEnd = a.endDate ? new Date(a.endDate).getTime() : 0
                    const bEnd = b.endDate ? new Date(b.endDate).getTime() : 0
                    return bEnd - aEnd
                  })
                  .map((e) => (
                    <SelectItem key={e.id} value={e.id}>
                      <div className="flex items-center gap-2">
                        {e.logoUrl && (
                          <img src={e.logoUrl} alt={e.title} className="w-4 h-4 rounded-sm object-contain" />
                        )}
                        {e.title} · {e.company}
                      </div>
                    </SelectItem>
                  ))}
              </SelectGroup>
            </SelectContent>
          </Select>
        </div>
      )}

      {(searchText.trim() || techFilter.length > 0 || dateRangeFilter.from || experienceFilter) && (
        <div className="flex items-center gap-2 mt-2 text-xs text-muted-foreground justify-end">
          <span>Filters active</span>
          <button
            type="button"
            className="flex items-center gap-0.5 hover:text-foreground transition-colors"
            onClick={() => { setSearchText(''); setTechFilter([]); clearDateRange(); setExperienceFilter('') }}
          >
            <XIcon className="h-3 w-3" />
            Clear all
          </button>
        </div>
      )}

      {isSearching ? (
        filteredData.length === 0 ? (
          <div className="flex flex-1 flex-col justify-center items-center min-h-0 text-zinc-500 mt-8">
            <FrownIcon />
            <span>No projects found.</span>
          </div>
        ) : (
          <div className="w-full mt-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-4 pb-4">
              {sortByDate(filteredData).map((project, i) => (
                <AnimatedItem key={project.id} index={i}>
                  <ProjectCard
                    data={project}
                    onCardClick={onCardClick}
                    onModifyButtonClick={onModifyButtonClick}
                    onDeleteButtonClick={onDeleteButtonClick}
                    linkedExperience={getLinkedExperience(project.experienceId)}
                  />
                </AnimatedItem>
              ))}
            </div>
          </div>
        )
      ) : (
        <Tabs defaultValue="projects" className="mt-4">
          <TabsList>
            <TabsTrigger value="projects">Projects</TabsTrigger>
            <TabsTrigger value="experimental">Experimental</TabsTrigger>
          </TabsList>

          <TabsContent value="projects">
            {normalProjects.length === 0 ? (
              <div className="flex flex-col justify-center items-center py-16 text-zinc-500">
                <FrownIcon />
                <span>No projects found.</span>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-4 pb-4 mt-4">
                {sortByDate(normalProjects).map((project, i) => (
                  <AnimatedItem key={project.id} index={i}>
                    <ProjectCard
                      data={project}
                      onCardClick={onCardClick}
                      onModifyButtonClick={onModifyButtonClick}
                      onDeleteButtonClick={onDeleteButtonClick}
                    />
                  </AnimatedItem>
                ))}
              </div>
            )}
          </TabsContent>

          <TabsContent value="experimental">
            {experimentalProjects.length === 0 ? (
              <div className="flex flex-col justify-center items-center py-16 text-zinc-500">
                <FrownIcon />
                <span>No experimental projects found.</span>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-4 pb-4 mt-4">
                {sortByDate(experimentalProjects).map((project, i) => (
                  <AnimatedItem key={project.id} index={i}>
                    <ProjectCard
                      data={project}
                      onCardClick={onCardClick}
                      onModifyButtonClick={onModifyButtonClick}
                      onDeleteButtonClick={onDeleteButtonClick}
                    />
                  </AnimatedItem>
                ))}
              </div>
            )}
          </TabsContent>
        </Tabs>
      )}

      <Dialog open={showAddDialog} onOpenChange={handleAddDialogClose}>
        <DialogContent className="max-w-2xl max-h-[90vh] flex flex-col overflow-hidden">
          <DialogHeader className="shrink-0">
            <DialogTitle>
              {selectedData ? 'Edit Project' : 'New Project'}
            </DialogTitle>
          </DialogHeader>
          <AddProject
            form={form}
            isEditMode={selectedData !== null}
            richDescription={richDescription}
            setRichDescription={setRichDescription}
            pendingFiles={pendingFiles}
            setPendingFiles={setPendingFiles}
            existingImages={existingImages}
            deletedImagePaths={deletedImagePaths}
            onMarkImageForDeletion={onMarkImageForDeletion}
            onUnmarkImageForDeletion={onUnmarkImageForDeletion}
            logoFile={logoFile}
            setLogoFile={setLogoFile}
            existingLogoUrl={existingLogoUrl}
            setExistingLogoUrl={setExistingLogoUrl}
            allExperiences={allExperiences}
          />
        </DialogContent>
      </Dialog>

      <ProjectDetailDialog
        project={detailData}
        open={showDetailDialog}
        onOpenChange={handleDetailDialogClose}
        linkedExperience={getLinkedExperience(detailData?.experienceId)}
      />
    </div>
  )
}

export { ProjectsPage }
