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
import {
  CalendarIcon,
  FrownIcon,
  SearchIcon,
  XIcon,
  Sprout,
} from 'lucide-react'
import { useExperiencePageController } from './hooks/useExperiencePage'
import { AddExperience } from './components/AddExperience'
import { ExperienceListItem } from './components/ExperienceListItem'
import type { ExperienceType } from '#/types/experience'

const EXPERIENCE_TYPES = [
  'Work',
  'Project',
  'Activity',
  'Open Source',
] as const satisfies ExperienceType[]

const ExperiencePage = () => {
  const {
    form,
    groupedData,
    showAddDialog,
    handleDialogClose,
    selectedData,
    searchText,
    setSearchText,
    allTechStacks,
    techStackFilter,
    setTechStackFilter,
    typeFilter,
    setTypeFilter,
    dateRangeFilter,
    setDateRangeFilter,
    onModifyButtonClick,
    onDeleteButtonClick,
  } = useExperiencePageController()

  const [datePickerOpen, setDatePickerOpen] = useState(false)

  const toggleTech = (name: string) =>
    setTechStackFilter((prev) =>
      prev.includes(name) ? prev.filter((t) => t !== name) : [...prev, name],
    )

  const toggleType = (type: (typeof EXPERIENCE_TYPES)[number]) =>
    setTypeFilter((prev) =>
      prev.includes(type) ? prev.filter((t) => t !== type) : [...prev, type],
    )

  const clearDateRange = () => setDateRangeFilter({ from: null, to: null })

  const hasFilters =
    searchText.trim() ||
    techStackFilter.length > 0 ||
    typeFilter.length > 0 ||
    dateRangeFilter.from

  return (
    <div className="w-full flex flex-1 flex-col px-4">
      <BoardHeader
        title={'Experience'}
        description="Stepping beyond theory into practice and research! ⚒️ Valuable hands-on experiences built through lab work and various projects. 💼"
        Icon={Sprout}
        onAddButtonClick={() => handleDialogClose(true)}
      />

      <div className="flex flex-row items-center justify-end gap-2 mt-2">
        <Popover open={datePickerOpen} onOpenChange={setDatePickerOpen}>
          <PopoverTrigger asChild>
            <Button
              variant="outline"
              className={cn(
                'gap-2',
                dateRangeFilter.from && 'border-primary text-primary',
              )}
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
          placeholder="Search experience..."
          value={searchText}
          onChange={(e) => setSearchText(e.target.value)}
        />
        <Button>
          <SearchIcon className="h-4 w-4" />
        </Button>
      </div>

      <div className="flex flex-wrap gap-1.5 mt-2 overflow-x-auto justify-end">
        {EXPERIENCE_TYPES.map((type) => {
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

      {allTechStacks.length > 0 && (
        <div className="flex flex-wrap gap-1.5 mt-2 overflow-x-auto justify-end">
          {allTechStacks.map((name) => {
            const active = techStackFilter.includes(name)
            return (
              <button key={name} type="button" onClick={() => toggleTech(name)}>
                <Badge
                  variant={active ? 'default' : 'outline'}
                  className="cursor-pointer transition-colors"
                >
                  {name}
                </Badge>
              </button>
            )
          })}
        </div>
      )}

      {hasFilters && (
        <div className="flex items-center gap-2 mt-2 text-xs text-muted-foreground">
          <span>Filters active</span>
          <button
            type="button"
            className="flex items-center gap-0.5 hover:text-foreground transition-colors"
            onClick={() => {
              setSearchText('')
              setTechStackFilter([])
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
          {'No experience content found.'}
        </div>
      ) : (
        <div className="w-full mt-4">
          {Object.entries(groupedData)
            .sort(([a], [b]) => Number(b) - Number(a))
            .map(([year, experiences]) => (
              <div key={year} className="mb-8">
                <AnimatedItem>
                  <div className="text-3xl font-semibold my-2">{year}</div>
                </AnimatedItem>
                {[...experiences]
                  .sort(
                    (a, b) =>
                      new Date(b.startDate).getTime() -
                      new Date(a.startDate).getTime(),
                  )
                  .map((d, i) => (
                    <AnimatedItem key={d.id} index={i + 1}>
                      <ExperienceListItem
                        data={d}
                        onModifyButtonClick={onModifyButtonClick}
                        onDeleteButtonClick={onDeleteButtonClick}
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
              {selectedData ? 'Edit Experience' : 'Add Experience'}
            </DialogTitle>
          </DialogHeader>
          <AddExperience form={form} isEditMode={selectedData !== null} />
        </DialogContent>
      </Dialog>
    </div>
  )
}

export { ExperiencePage }
