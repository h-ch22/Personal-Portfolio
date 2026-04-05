import { BoardHeader } from '#/components/common/BoardHeader'
import { FrownIcon, GraduationCap } from 'lucide-react'
import { useEducationPageController } from './hooks/useEducationPage'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '#/components/ui/dialog'
import { AddEducation } from './components/AddEducation'

const EducationPage = () => {
  const {
    data,
    showAddDialog,
    setShowAddDialog,
    formData,
    handleInputChange,
    handleSelectionChange,
    toggleInProgress,
    onAddEducation,
  } = useEducationPageController()

  return (
    <div className="w-full flex flex-1 flex-col px-4">
      <BoardHeader
        title={'Education'}
        Icon={GraduationCap}
        onAddButtonClick={() => setShowAddDialog(true)}
      />

      {data.length === 0 && (
        <div className="flex flex-1 flex-col justify-center items-center min-h-0 text-zinc-500">
          <FrownIcon />
          {'No education content found.'}
        </div>
      )}

      <Dialog open={showAddDialog} onOpenChange={setShowAddDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Create New Education Content</DialogTitle>
          </DialogHeader>

          <AddEducation
            formData={formData}
            onContentChange={handleInputChange}
            onSelectItemChange={handleSelectionChange}
            toggleInProgress={toggleInProgress}
            onAddEducation={onAddEducation}
          />
        </DialogContent>
      </Dialog>
    </div>
  )
}

export { EducationPage }
