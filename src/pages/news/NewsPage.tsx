import { AnimatedItem } from '#/components/common/AnimatedItem'
import { BoardHeader } from '#/components/common/BoardHeader'
import { Badge } from '#/components/ui/badge'
import { Button } from '#/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '#/components/ui/dialog'
import { Input } from '#/components/ui/input'
import type { NewsCategory } from '#/types/news'
import { FrownIcon, NewspaperIcon, SearchIcon } from 'lucide-react'
import { AddNews } from './components/AddNews'
import { NewsCard } from './components/NewsCard'
import { NewsDetailDialog } from './components/NewsDetailDialog'
import { useNewsPageController } from './hooks/useNewsPage'

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
    pendingFiles,
    setPendingFiles,
    existingImages,
    deletedImagePaths,
    onMarkImageForDeletion,
    onUnmarkImageForDeletion,
    onCardClick,
    onModifyButtonClick,
    onDeleteButtonClick,
  } = useNewsPageController()

  const toggleCategory = (cat: NewsCategory) =>
    setCategoryFilter((prev) =>
      prev.includes(cat) ? prev.filter((c) => c !== cat) : [...prev, cat],
    )

  const hasFilters = searchText.trim() || categoryFilter.length > 0

  return (
    <div className="w-full flex flex-1 flex-col px-4">
      <BoardHeader
        title="News"
        description="The freshest and most exciting updates! 🎈 Sharing my new challenges, small wins, and daily milestones in real-time. 📢"
        Icon={NewspaperIcon}
        onAddButtonClick={() => handleAddDialogClose(true)}
      />

      <div className="flex flex-row justify-end items-center gap-2 mt-2">
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
          />
        </DialogContent>
      </Dialog>

      <NewsDetailDialog
        news={detailData}
        open={showDetailDialog}
        onOpenChange={handleDetailDialogClose}
      />
    </div>
  )
}

export { NewsPage }
