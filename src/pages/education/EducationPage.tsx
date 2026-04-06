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
import { ScrollArea } from '#/components/ui/scroll-area'
import { EducationListItem } from './components/EducationListItem'
import { Input } from '#/components/ui/input'
import { Button } from '#/components/ui/button'

const EducationPage = () => {
  const {
    form,
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
          'The learning journey tha fuels my growth! 📚 A record of my academic life and my continous pursuit of knowledge. 🎓'
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

      {Object.keys(groupedData).length === 0 ? (
        <div className="flex flex-1 flex-col justify-center items-center min-h-0 text-zinc-500">
          <FrownIcon />
          {'No education content found.'}
        </div>
      ) : (
        <ScrollArea className="w-full h-full">
          {Object.entries(groupedData)
            .reverse()
            .map(([year, educations]) => (
              <div key={year} className="mb-8">
                <div className="text-3xl font-semibold my-2">{year}</div>
                {[...educations]
                  .sort((a, b) => b.startMonth - a.startMonth)
                  .map((d) => (
                    <EducationListItem
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
