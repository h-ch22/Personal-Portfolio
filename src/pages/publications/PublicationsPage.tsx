import { useState } from 'react'
import { format } from 'date-fns'
import { AnimatedItem } from '#/components/common/AnimatedItem'
import { BoardHeader } from '#/components/common/BoardHeader'
import { MonthRangePicker } from '#/components/common/MonthRangePicker'
import { Book, CalendarIcon, FrownIcon, SearchIcon, XIcon } from 'lucide-react'
import { usePublicationsPageController } from './hooks/usePublicationsPage'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '#/components/ui/dialog'
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '#/components/ui/popover'
import { AddPublication } from './components/AddPublication'
import { PublicationListItem } from './components/PublicationListItem'
import { ToggleGroup, ToggleGroupItem } from '#/components/ui/toggle-group'
import type { PublicationType } from '#/types/publication'
import { Button } from '#/components/ui/button'
import { Input } from '#/components/ui/input'
import { cn } from '#/lib/utils'

const PublicationsPage = () => {
  const {
    form,
    groupedData,
    showAddDialog,
    handleDialogClose,
    selectedData,
    selectedFilter,
    setSelectedFilter,
    isSearching,
    onModifyButtonClick,
    onDeleteButtonClick,
    searchText,
    setSearchText,
    dateRangeFilter,
    setDateRangeFilter,
  } = usePublicationsPageController()

  const [datePickerOpen, setDatePickerOpen] = useState(false)

  const clearDateRange = () => setDateRangeFilter({ from: null, to: null })
  const hasFilters = searchText.trim() || dateRangeFilter.from

  return (
    <div className="w-full flex flex-1 flex-col px-4">
      <BoardHeader
        title={'Publications'}
        description="Organizing thoughts and sharing knowledge! 🖋️ A collection of research papers and tech posts I've deeply pondered over. 📝"
        Icon={Book}
        onAddButtonClick={() => handleDialogClose(true)}
      />

      <div className="w-full flex flex-row items-center overflow-x-auto scrollbar-none">
        <ToggleGroup
          type="single"
          className="mt-2 flex-nowrap"
          value={selectedFilter}
          disabled={isSearching}
          onValueChange={(value) => setSelectedFilter(value as PublicationType)}
        >
          {[
            'International Journal',
            'International Conference',
            'Domestic Journal',
            'Domestic Conference',
            'Patent',
            'Book',
          ].map((type) => (
            <ToggleGroupItem
              className="rounded-full shrink-0"
              value={type}
              key={type}
            >
              {type}
            </ToggleGroupItem>
          ))}
        </ToggleGroup>
      </div>

      <div className="flex flex-row mt-2 items-center justify-end gap-2">
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
          placeholder="Search publications..."
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

      {Object.keys(groupedData).length === 0 ? (
        <div className="flex flex-1 flex-col justify-center items-center min-h-0 text-zinc-500">
          <FrownIcon />
          {'No publications content found.'}
        </div>
      ) : (
        <div className="w-full">
          {Object.entries(groupedData)
            .reverse()
            .map(([year, pub]) => {
              const sorted = [...pub].sort(
                (a, b) => b.publicationMonth - a.publicationMonth,
              )

              return (
                <div key={year} className="mb-8">
                  <AnimatedItem>
                    <div className="text-3xl font-semibold my-2">{year}</div>
                  </AnimatedItem>
                  {sorted.map((p, i) => (
                    <AnimatedItem key={p.id} index={i + 1}>
                      <PublicationListItem
                        data={p}
                        showType={isSearching}
                        onModifyButtonClick={onModifyButtonClick}
                        onDeleteButtonClick={onDeleteButtonClick}
                      />
                    </AnimatedItem>
                  ))}
                </div>
              )
            })}
        </div>
      )}

      <Dialog open={showAddDialog} onOpenChange={handleDialogClose}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {selectedData
                ? 'Modify Publication Content'
                : 'Create New Publication Content'}
            </DialogTitle>
          </DialogHeader>

          <AddPublication form={form} isEditMode={selectedData !== null} />
        </DialogContent>
      </Dialog>
    </div>
  )
}

export { PublicationsPage }
