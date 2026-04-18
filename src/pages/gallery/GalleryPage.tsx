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
import { CalendarIcon, FrownIcon, ImagesIcon, SearchIcon, XIcon } from 'lucide-react'
import { AddGallery } from './components/AddGallery'
import { GalleryCard } from './components/GalleryCard'
import { GalleryDetailDialog } from './components/GalleryDetailDialog'
import { useGalleryPageController } from './hooks/useGalleryPage'

const GalleryPage = () => {
  const {
    form,
    showAddDialog,
    showDetailDialog,
    handleAddDialogClose,
    handleDetailDialogClose,
    selectedData,
    detailData,
    filteredData,
    searchText,
    setSearchText,
    dateRangeFilter,
    setDateRangeFilter,
    pendingFiles,
    setPendingFiles,
    existingImages,
    deletedImagePaths,
    onMarkImageForDeletion,
    onUnmarkImageForDeletion,
    onCardClick,
    onModifyButtonClick,
    onDeleteButtonClick,
  } = useGalleryPageController()

  const [datePickerOpen, setDatePickerOpen] = useState(false)
  const clearDateRange = () => setDateRangeFilter({ from: null, to: null })
  const hasFilters = searchText.trim() || dateRangeFilter.from

  return (
    <div className="w-full flex flex-1 flex-col px-4">
      <BoardHeader
        title="Gallery"
        description="A space capturing pieces of inspiration and precious moments! 📸 Enjoy my visual diary filled with design, fashion, and daily life. 🎨"
        Icon={ImagesIcon}
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
          placeholder="Search gallery..."
          value={searchText}
          onChange={(e) => setSearchText(e.target.value)}
        />
        <Button>
          <SearchIcon className="h-4 w-4" />
        </Button>
      </div>

      {hasFilters && (
        <div className="flex items-center gap-2 mt-2 text-xs text-muted-foreground">
          <span>Filters active</span>
          <button
            type="button"
            className="flex items-center gap-0.5 hover:text-foreground transition-colors"
            onClick={() => { setSearchText(''); clearDateRange() }}
          >
            <XIcon className="h-3 w-3" />
            Clear all
          </button>
        </div>
      )}

      {filteredData.length === 0 ? (
        <div className="flex flex-1 flex-col justify-center items-center min-h-0 text-zinc-500">
          <FrownIcon />
          <span>No posts found.</span>
        </div>
      ) : (
        <div className="w-full mt-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 pb-4">
            {[...filteredData]
              .sort(
                (a, b) =>
                  new Date(b.date).getTime() - new Date(a.date).getTime(),
              )
              .map((gallery, i) => (
                <AnimatedItem key={gallery.id} index={i}>
                  <GalleryCard
                    data={gallery}
                    onCardClick={onCardClick}
                    onModifyButtonClick={onModifyButtonClick}
                    onDeleteButtonClick={onDeleteButtonClick}
                  />
                </AnimatedItem>
              ))}
          </div>
        </div>
      )}

      <Dialog open={showAddDialog} onOpenChange={handleAddDialogClose}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {selectedData ? 'Edit Gallery' : 'New Gallery'}
            </DialogTitle>
          </DialogHeader>
          <AddGallery
            form={form}
            isEditMode={selectedData !== null}
            pendingFiles={pendingFiles}
            setPendingFiles={setPendingFiles}
            existingImages={existingImages}
            deletedImagePaths={deletedImagePaths}
            onMarkImageForDeletion={onMarkImageForDeletion}
            onUnmarkImageForDeletion={onUnmarkImageForDeletion}
          />
        </DialogContent>
      </Dialog>

      <GalleryDetailDialog
        gallery={detailData}
        open={showDetailDialog}
        onOpenChange={handleDetailDialogClose}
      />
    </div>
  )
}

export { GalleryPage }
