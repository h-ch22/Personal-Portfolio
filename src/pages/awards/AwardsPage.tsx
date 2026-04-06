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
import { ScrollArea } from '#/components/ui/scroll-area'
import type { AwardType } from '#/types/award'
import { FrownIcon, SearchIcon, Trophy } from 'lucide-react'
import { AddAward } from './components/AddAward'
import { AwardListItem } from './components/AwardListItem'
import { useAwardsPageController } from './hooks/useAwardsPage'

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
    onModifyButtonClick,
    onDeleteButtonClick,
  } = useAwardsPageController()

  const toggleType = (type: AwardType) =>
    setTypeFilter((prev) =>
      prev.includes(type) ? prev.filter((t) => t !== type) : [...prev, type],
    )

  const hasFilters = searchText.trim() || typeFilter.length > 0

  return (
    <div className="w-full flex flex-1 flex-col px-4">
      <BoardHeader
        title={'Awards'}
        description="The proud results of my hard work and challenges! 🏆 Documenting the passionate moments behind every single award. ✨"
        Icon={Trophy}
        onAddButtonClick={() => handleDialogClose(true)}
      />

      {/* Search */}
      <div className="flex flex-row justify-end items-center gap-2 mt-2">
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

      {/* Type filter badges */}
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

      {/* Active filter indicator */}
      {hasFilters && (
        <div className="flex items-center gap-2 mt-2 text-xs text-muted-foreground">
          <span>Filters active</span>
          <button
            type="button"
            className="underline hover:text-foreground transition-colors"
            onClick={() => {
              setSearchText('')
              setTypeFilter([])
            }}
          >
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
        <ScrollArea className="w-full h-full mt-4">
          {Object.entries(groupedData)
            .sort(([a], [b]) => Number(b) - Number(a))
            .map(([year, awards]) => (
              <div key={year} className="mb-8">
                <div className="text-3xl font-semibold my-2">{year}</div>
                {[...awards]
                  .sort(
                    (a, b) =>
                      new Date(b.date).getTime() - new Date(a.date).getTime(),
                  )
                  .map((d) => (
                    <AwardListItem
                      key={d.id}
                      data={d}
                      onModifyButtonClick={onModifyButtonClick}
                      onDeleteButtonClick={onDeleteButtonClick}
                    />
                  ))}
              </div>
            ))}
        </ScrollArea>
      )}

      <Dialog open={showAddDialog} onOpenChange={handleDialogClose}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {selectedData ? 'Edit Award' : 'Add Award'}
            </DialogTitle>
          </DialogHeader>
          <AddAward form={form} isEditMode={selectedData !== null} />
        </DialogContent>
      </Dialog>
    </div>
  )
}

export { AwardsPage }
