import { useState } from 'react'
import { format } from 'date-fns'
import { AnimatedItem } from '#/components/common/AnimatedItem'
import { BoardHeader } from '#/components/common/BoardHeader'
import { MonthRangePicker } from '#/components/common/MonthRangePicker'
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
import { CalendarIcon, FrownIcon, GraduationCap, SearchIcon, XIcon } from 'lucide-react'
import { useEducationPageController } from './hooks/useEducationPage'
import { AddEducation } from './components/AddEducation'
import { EducationListItem } from './components/EducationListItem'

const EducationPage = () => {
  const {
    form,
    currentItems,
    groupedData,
    showAddDialog,
    handleDialogClose,
    selectedData,
    searchText,
    setSearchText,
    dateRangeFilter,
    setDateRangeFilter,
    onModifyButtonClick,
    onDeleteButtonClick,
  } = useEducationPageController()

  const [datePickerOpen, setDatePickerOpen] = useState(false)

  const clearDateRange = () => setDateRangeFilter({ from: null, to: null })

  const hasFilters = searchText.trim() || dateRangeFilter.from

  return (
    <div className="w-full flex flex-1 flex-col px-4">
      <BoardHeader
        title={'Education'}
        description={
          'The learning journey that fuels my growth! 📚 A record of my academic life and my continous pursuit of knowledge. 🎓'
        }
        Icon={GraduationCap}
        onAddButtonClick={() => handleDialogClose(true)}
      />

      <div className="flex flex-row items-center justify-end gap-2 mt-2">
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
          placeholder="Search education..."
          value={searchText}
          onChange={(e) => setSearchText(e.target.value)}
        />
        <Button>
          <SearchIcon />
        </Button>
      </div>

      {hasFilters && (
        <div className="flex items-center gap-2 mt-2 text-xs text-muted-foreground">
          <span>Filters active</span>
          <button
            type="button"
            className="flex items-center gap-0.5 hover:text-foreground transition-colors"
            onClick={() => {
              setSearchText('')
              clearDateRange()
            }}
          >
            <XIcon className="h-3 w-3" />
            Clear all
          </button>
        </div>
      )}

      {currentItems.length === 0 && Object.keys(groupedData).length === 0 ? (
        <div className="flex flex-1 flex-col justify-center items-center min-h-0 text-zinc-500">
          <FrownIcon />
          {'No education content found.'}
        </div>
      ) : (
        <div className="w-full">
          {currentItems.length > 0 && (
            <div className="mb-8">
              <AnimatedItem>
                <div className="text-3xl font-semibold my-2">Current</div>
              </AnimatedItem>
              {[...currentItems]
                .sort((a, b) => b.startYear - a.startYear || b.startMonth - a.startMonth)
                .map((d, i) => (
                  <AnimatedItem key={d.id} index={i + 1}>
                    <EducationListItem
                      data={d}
                      onModifyButtonClick={onModifyButtonClick}
                      onDeleteButtonClick={onDeleteButtonClick}
                    />
                  </AnimatedItem>
                ))}
            </div>
          )}
          {Object.entries(groupedData)
            .sort(([a], [b]) => Number(b) - Number(a))
            .map(([year, educations]) => (
              <div key={year} className="mb-8">
                <AnimatedItem>
                  <div className="text-3xl font-semibold my-2">{year}</div>
                </AnimatedItem>
                {[...educations]
                  .sort((a, b) => b.endYear - a.endYear || b.endMonth - a.endMonth)
                  .map((d, i) => (
                    <AnimatedItem key={d.id} index={i + 1}>
                      <EducationListItem
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
              {selectedData
                ? 'Modify Education Content'
                : 'Create New Education Content'}
            </DialogTitle>
          </DialogHeader>

          <AddEducation form={form} isEditMode={selectedData !== null} />
        </DialogContent>
      </Dialog>
    </div>
  )
}

export { EducationPage }
