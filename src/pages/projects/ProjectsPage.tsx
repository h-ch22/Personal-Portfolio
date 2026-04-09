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
import { FrownIcon, LaptopMinimalCheckIcon, SearchIcon } from 'lucide-react'
import { AddProject } from './components/AddProject'
import { ProjectCard } from './components/ProjectCard'
import { ProjectDetailDialog } from './components/ProjectDetailDialog'
import { useProjectsPageController } from './hooks/useProjectsPage'

const ProjectsPage = () => {
  const {
    form,
    showAddDialog,
    showDetailDialog,
    handleAddDialogClose,
    handleDetailDialogClose,
    selectedData,
    detailData,
    filteredData,
    allTechNames,
    searchText,
    setSearchText,
    techFilter,
    setTechFilter,
    richDescription,
    setRichDescription,
    pendingFiles,
    setPendingFiles,
    existingImages,
    deletedImagePaths,
    onMarkImageForDeletion,
    onUnmarkImageForDeletion,
    onCardClick,
    onModifyButtonClick,
    onDeleteButtonClick,
  } = useProjectsPageController()

  return (
    <div className="w-full flex flex-1 flex-col px-4">
      <BoardHeader
        title="Projects"
        description="A showcase of things I've built — from side projects to production systems. 🚀"
        Icon={LaptopMinimalCheckIcon}
        onAddButtonClick={() => handleAddDialogClose(true)}
      />

      <div className="flex flex-row justify-end items-center gap-2 mt-2">
        <Input
          className="flex-1 max-w-96"
          placeholder="Search by title or tech stack..."
          value={searchText}
          onChange={(e) => setSearchText(e.target.value)}
        />
        <Button>
          <SearchIcon className="h-4 w-4" />
        </Button>
      </div>

      {allTechNames.length > 0 && (
        <div className="flex flex-wrap gap-1.5 mt-2 justify-end">
          {allTechNames.map((tech) => {
            const active = techFilter.includes(tech)
            return (
              <button
                key={tech}
                type="button"
                onClick={() =>
                  setTechFilter((prev) =>
                    active ? prev.filter((t) => t !== tech) : [...prev, tech],
                  )
                }
              >
                <Badge
                  variant={active ? 'default' : 'outline'}
                  className="cursor-pointer transition-colors"
                >
                  {tech}
                </Badge>
              </button>
            )
          })}
        </div>
      )}

      {(searchText.trim() || techFilter.length > 0) && (
        <div className="flex items-center gap-2 mt-2 text-xs text-muted-foreground justify-end">
          <span>Filters active</span>
          <button
            type="button"
            className="underline hover:text-foreground transition-colors"
            onClick={() => {
              setSearchText('')
              setTechFilter([])
            }}
          >
            Clear all
          </button>
        </div>
      )}

      {filteredData.length === 0 ? (
        <div className="flex flex-1 flex-col justify-center items-center min-h-0 text-zinc-500">
          <FrownIcon />
          <span>No projects found.</span>
        </div>
      ) : (
        <div className="w-full mt-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 pb-4">
            {[...filteredData]
              .sort(
                (a, b) =>
                  new Date(b.startDate).getTime() -
                  new Date(a.startDate).getTime(),
              )
              .map((project, i) => (
                <AnimatedItem key={project.id} index={i}>
                  <ProjectCard
                    data={project}
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
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>
              {selectedData ? 'Edit Project' : 'New Project'}
            </DialogTitle>
          </DialogHeader>
          <AddProject
            form={form}
            isEditMode={selectedData !== null}
            richDescription={richDescription}
            setRichDescription={setRichDescription}
            pendingFiles={pendingFiles}
            setPendingFiles={setPendingFiles}
            existingImages={existingImages}
            deletedImagePaths={deletedImagePaths}
            onMarkImageForDeletion={onMarkImageForDeletion}
            onUnmarkImageForDeletion={onUnmarkImageForDeletion}
          />
        </DialogContent>
      </Dialog>

      <ProjectDetailDialog
        project={detailData}
        open={showDetailDialog}
        onOpenChange={handleDetailDialogClose}
      />
    </div>
  )
}

export { ProjectsPage }
