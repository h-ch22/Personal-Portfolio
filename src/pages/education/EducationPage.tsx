import { AnimatedItem } from '#/components/common/AnimatedItem'
import { BoardHeader } from '#/components/common/BoardHeader'
import { FrownIcon, GraduationCap, SearchIcon } from 'lucide-react'
import { useEducationPageController } from './hooks/useEducationPage'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '#/components/ui/dialog'
import { AddEducation } from './components/AddEducation'
import { EducationListItem } from './components/EducationListItem'
import { Input } from '#/components/ui/input'
import { Button } from '#/components/ui/button'

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
    onModifyButtonClick,
    onDeleteButtonClick,
  } = useEducationPageController()

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
        <Input
          className="max-w-96"
          placeholder="Search education..."
          value={searchText}
          onChange={(e) => setSearchText(e.target.value)}
        />
        <Button>
          <SearchIcon />
        </Button>
      </div>

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
