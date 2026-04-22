import { useState } from 'react'
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
import { cn } from '#/lib/utils'
import type { AwardType } from '#/types/award'
import { CalendarIcon, FrownIcon, SearchIcon, Trophy, XIcon } from 'lucide-react'
import { AddAward } from './components/AddAward'
import { AwardListItem } from './components/AwardListItem'
import { useAwardsPageController } from './hooks/useAwardsPage'
import { ProjectDetailDialog } from '#/pages/projects/components/ProjectDetailDialog'

const AWARD_TYPES = [
  'Competition',
  'Academic',
  'Scholarship',
  'Recognition',
  'Other',
] as const satisfies AwardType[]

const AwardsPage = () => {
  const {
    form,
    groupedData,
    showAddDialog,
    handleDialogClose,
    selectedData,
    searchText,
    setSearchText,
    typeFilter,
    setTypeFilter,
    dateRangeFilter,
    setDateRangeFilter,
    onModifyButtonClick,
    onDeleteButtonClick,
    allProjects,
    detailProject,
    showProjectDetail,
    setShowProjectDetail,
    handleViewProject,
  } = useAwardsPageController()

  const getLinkedProject = (projectId?: string) =>
    projectId ? allProjects.find((p) => p.id === projectId) : undefined

  const [datePickerOpen, setDatePickerOpen] = useState(false)

  const toggleType = (type: AwardType) =>
    setTypeFilter((prev) =>
      prev.includes(type) ? prev.filter((t) => t !== type) : [...prev, type],
    )

  const clearDateRange = () => setDateRangeFilter({ from: null, to: null })

  const hasFilters = searchText.trim() || typeFilter.length > 0 || dateRangeFilter.from

  return (
    <div className="w-full flex flex-1 flex-col px-4">
      <BoardHeader
        title={'Awards'}
        description="The proud results of my hard work and challenges! 🏆 Documenting the passionate moments behind every single award. ✨"
        Icon={Trophy}
        onAddButtonClick={() => handleDialogClose(true)}
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
                  onClick={() => {
                    clearDateRange()
                    setDatePickerOpen(false)
                  }}
                >
                  Clear
                </Button>
              </div>
            )}
          </PopoverContent>
        </Popover>
        <Input
          className="flex-1 max-w-96"
          placeholder="Search awards..."
          value={searchText}
          onChange={(e) => setSearchText(e.target.value)}
        />
        <Button>
          <SearchIcon className="h-4 w-4" />
        </Button>
      </div>

      <div className="flex justify-end flex-wrap gap-1.5 mt-2">
        {AWARD_TYPES.map((type) => {
          const active = typeFilter.includes(type)
          return (
            <button key={type} type="button" onClick={() => toggleType(type)}>
              <Badge
                variant={active ? 'default' : 'outline'}
                className="cursor-pointer transition-colors"
              >
                {type}
              </Badge>
            </button>
          )
        })}
      </div>

      {hasFilters && (
        <div className="flex items-center gap-2 mt-2 text-xs text-muted-foreground">
          <span>Filters active</span>
          <button
            type="button"
            className="flex items-center gap-0.5 hover:text-foreground transition-colors"
            onClick={() => {
              setSearchText('')
              setTypeFilter([])
              clearDateRange()
            }}
          >
            <XIcon className="h-3 w-3" />
            Clear all
          </button>
        </div>
      )}

      {Object.keys(groupedData).length === 0 ? (
        <div className="flex flex-1 flex-col justify-center items-center min-h-0 text-zinc-500">
          <FrownIcon />
          {'No awards found.'}
        </div>
      ) : (
        <div className="w-full mt-4">
          {Object.entries(groupedData)
            .sort(([a], [b]) => Number(b) - Number(a))
            .map(([year, awards]) => (
              <div key={year} className="mb-8">
                <AnimatedItem>
                  <div className="text-3xl font-semibold my-2">{year}</div>
                </AnimatedItem>
                {[...awards]
                  .sort(
                    (a, b) =>
                      new Date(b.date).getTime() - new Date(a.date).getTime(),
                  )
                  .map((d, i) => (
                    <AnimatedItem key={d.id} index={i + 1}>
                      <AwardListItem
                        data={d}
                        onModifyButtonClick={onModifyButtonClick}
                        onDeleteButtonClick={onDeleteButtonClick}
                        onViewProject={getLinkedProject(d.projectId) ? () => handleViewProject(d.projectId!) : undefined}
                      />
                    </AnimatedItem>
                  ))}
              </div>
            ))}
        </div>
      )}

      <Dialog open={showAddDialog} onOpenChange={handleDialogClose}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {selectedData ? 'Edit Award' : 'Add Award'}
            </DialogTitle>
          </DialogHeader>
          <AddAward form={form} isEditMode={selectedData !== null} allProjects={allProjects} />
        </DialogContent>
      </Dialog>

      <ProjectDetailDialog
        project={detailProject}
        open={showProjectDetail}
        onOpenChange={setShowProjectDetail}
      />
    </div>
  )
}

export { AwardsPage }
