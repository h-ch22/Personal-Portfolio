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
import type { NewsCategory } from '#/types/news'
import { CalendarIcon, FrownIcon, NewspaperIcon, SearchIcon } from 'lucide-react'
import { AddNews } from './components/AddNews'
import { NewsCard } from './components/NewsCard'
import { NewsDetailDialog } from './components/NewsDetailDialog'
import { useNewsPageController } from './hooks/useNewsPage'
import { ProjectDetailDialog } from '#/pages/projects/components/ProjectDetailDialog'

const NEWS_CATEGORIES: NewsCategory[] = [
  'Award',
  'Research',
  'Publication',
  'Activity',
  'Press',
  'Other',
]

const NewsPage = () => {
  const {
    form,
    showAddDialog,
    showDetailDialog,
    handleAddDialogClose,
    handleDetailDialogClose,
    selectedData,
    detailData,
    sortedData,
    searchText,
    setSearchText,
    categoryFilter,
    setCategoryFilter,
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
    allProjects,
    detailProject,
    showProjectDetail,
    setShowProjectDetail,
    handleViewProject,
  } = useNewsPageController()

  const getLinkedProject = (projectId?: string) =>
    projectId ? allProjects.find((p) => p.id === projectId) : undefined

  const [datePickerOpen, setDatePickerOpen] = useState(false)
  const clearDateRange = () => setDateRangeFilter({ from: null, to: null })

  const toggleCategory = (cat: NewsCategory) =>
    setCategoryFilter((prev) =>
      prev.includes(cat) ? prev.filter((c) => c !== cat) : [...prev, cat],
    )

  const hasFilters = searchText.trim() || categoryFilter.length > 0 || dateRangeFilter.from

  return (
    <div className="w-full flex flex-1 flex-col px-4">
      <BoardHeader
        title="News"
        description="The freshest and most exciting updates! 🎈 Sharing my new challenges, small wins, and daily milestones in real-time. 📢"
        Icon={NewspaperIcon}
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
          placeholder="Search news..."
          value={searchText}
          onChange={(e) => setSearchText(e.target.value)}
        />
        <Button>
          <SearchIcon className="h-4 w-4" />
        </Button>
      </div>

      <div className="flex justify-end flex-wrap gap-1.5 mt-2">
        {NEWS_CATEGORIES.map((cat) => {
          const active = categoryFilter.includes(cat)
          return (
            <button key={cat} type="button" onClick={() => toggleCategory(cat)}>
              <Badge
                variant={active ? 'default' : 'outline'}
                className="cursor-pointer transition-colors"
              >
                {cat}
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
            className="underline hover:text-foreground transition-colors"
            onClick={() => {
              setSearchText('')
              setCategoryFilter([])
              clearDateRange()
            }}
          >
            Clear all
          </button>
        </div>
      )}

      {sortedData.length === 0 ? (
        <div className="flex flex-1 flex-col justify-center items-center min-h-0 text-zinc-500">
          <FrownIcon />
          <span>No news found.</span>
        </div>
      ) : (
        <div className="w-full mt-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 pb-4">
            {sortedData.map((news, i) => (
              <AnimatedItem key={news.id} index={i}>
                <NewsCard
                  data={news}
                  onCardClick={onCardClick}
                  onModifyButtonClick={onModifyButtonClick}
                  onDeleteButtonClick={onDeleteButtonClick}
                  onViewProject={getLinkedProject(news.projectId) ? () => handleViewProject(news.projectId!) : undefined}
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
              {selectedData ? 'Edit News' : 'Post News'}
            </DialogTitle>
          </DialogHeader>
          <AddNews
            form={form}
            isEditMode={selectedData !== null}
            pendingFiles={pendingFiles}
            setPendingFiles={setPendingFiles}
            existingImages={existingImages}
            deletedImagePaths={deletedImagePaths}
            onMarkImageForDeletion={onMarkImageForDeletion}
            onUnmarkImageForDeletion={onUnmarkImageForDeletion}
            allProjects={allProjects}
          />
        </DialogContent>
      </Dialog>

      <NewsDetailDialog
        news={detailData}
        open={showDetailDialog}
        onOpenChange={handleDetailDialogClose}
        linkedProject={getLinkedProject(detailData?.projectId)}
        onViewProject={getLinkedProject(detailData?.projectId) ? () => handleViewProject(detailData!.projectId!) : undefined}
      />

      <ProjectDetailDialog
        project={detailProject}
        open={showProjectDetail}
        onOpenChange={setShowProjectDetail}
      />
    </div>
  )
}

export { NewsPage }
