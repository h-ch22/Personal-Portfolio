import { useRef, useState } from 'react'
import { format } from 'date-fns'
import { CalendarIcon, ImagePlusIcon, XIcon } from 'lucide-react'

import { MonthRangePicker } from '#/components/common/MonthRangePicker'
import { Button } from '#/components/ui/button'
import { Field, FieldGroup, FieldLabel } from '#/components/ui/field'
import { Input } from '#/components/ui/input'
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '#/components/ui/popover'
import { Textarea } from '#/components/ui/textarea'
import { cn } from '#/lib/utils'
import type { GalleryImage } from '#/types/gallery'
import type { GalleryFormInstance } from '../hooks/useGalleryPage'

const AddGallery = ({
  form,
  isEditMode,
  pendingFiles,
  setPendingFiles,
  existingImages,
  deletedImagePaths,
  onMarkImageForDeletion,
  onUnmarkImageForDeletion,
}: {
  form: GalleryFormInstance
  isEditMode: boolean
  pendingFiles: File[]
  setPendingFiles: React.Dispatch<React.SetStateAction<File[]>>
  existingImages: GalleryImage[]
  deletedImagePaths: string[]
  onMarkImageForDeletion: (path: string) => void
  onUnmarkImageForDeletion: (path: string) => void
}) => {
  const [datePickerOpen, setDatePickerOpen] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files ?? [])
    setPendingFiles((prev) => [...prev, ...files])
    if (fileInputRef.current) fileInputRef.current.value = ''
  }

  const removePendingFile = (index: number) => {
    setPendingFiles((prev) => prev.filter((_, i) => i !== index))
  }

  const pendingPreviews = pendingFiles.map((file) => URL.createObjectURL(file))

  return (
    <div className="w-full flex flex-col gap-4 max-h-[70vh] overflow-y-auto pr-1">
      <form
        noValidate
        onSubmit={(e) => {
          e.preventDefault()
          form.handleSubmit()
        }}
      >
        <div className="w-full flex flex-col gap-4">
          <FieldGroup>
            <form.Field name="title">
              {(field) => (
                <Field>
                  <FieldLabel htmlFor="input-title">
                    Title <span className="text-destructive">*</span>
                  </FieldLabel>
                  <Input
                    id="input-title"
                    placeholder="e.g. Summer Trip 2024"
                    value={field.state.value}
                    onChange={(e) => field.handleChange(e.target.value)}
                    onBlur={field.handleBlur}
                  />
                  {field.state.meta.errors.length > 0 && (
                    <p className="text-destructive text-sm">
                      {field.state.meta.errors[0]?.message}
                    </p>
                  )}
                </Field>
              )}
            </form.Field>

            <form.Field name="description">
              {(field) => (
                <Field>
                  <FieldLabel htmlFor="input-description">
                    Description
                  </FieldLabel>
                  <Textarea
                    id="input-description"
                    placeholder="Brief description..."
                    rows={3}
                    value={field.state.value}
                    onChange={(e) => field.handleChange(e.target.value)}
                    onBlur={field.handleBlur}
                  />
                </Field>
              )}
            </form.Field>

            <form.Field name="date">
              {(field) => (
                <Field>
                  <FieldLabel>
                    Date <span className="text-destructive">*</span>
                  </FieldLabel>
                  <Popover
                    open={datePickerOpen}
                    onOpenChange={setDatePickerOpen}
                  >
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        className={cn(
                          'w-full justify-start text-left font-normal',
                          !field.state.value && 'text-muted-foreground',
                        )}
                      >
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {field.state.value
                          ? format(field.state.value, 'MMM yyyy')
                          : 'Select date'}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <MonthRangePicker
                        from={field.state.value}
                        to={null}
                        isCurrentlyWorking
                        onSelect={({ from }) => {
                          field.handleChange(from)
                          setDatePickerOpen(false)
                        }}
                      />
                    </PopoverContent>
                  </Popover>
                </Field>
              )}
            </form.Field>
          </FieldGroup>

          <Field>
            <FieldLabel>
              Images{' '}
              {!isEditMode && <span className="text-destructive">*</span>}
            </FieldLabel>

            {isEditMode && existingImages.length > 0 && (
              <div className="grid grid-cols-3 gap-2 mb-2">
                {existingImages.map((img) => {
                  const markedForDeletion = deletedImagePaths.includes(img.path)
                  return (
                    <div key={img.path} className="relative group">
                      <img
                        src={img.url}
                        alt=""
                        className={cn(
                          'w-full h-20 object-cover rounded-md border',
                          markedForDeletion && 'opacity-30 grayscale',
                        )}
                      />
                      <button
                        type="button"
                        onClick={() =>
                          markedForDeletion
                            ? onUnmarkImageForDeletion(img.path)
                            : onMarkImageForDeletion(img.path)
                        }
                        className={cn(
                          'absolute top-1 right-1 rounded-full p-0.5 text-white text-xs',
                          markedForDeletion
                            ? 'bg-green-500 hover:bg-green-600'
                            : 'bg-destructive hover:bg-destructive/80',
                        )}
                      >
                        <XIcon className="w-3 h-3" />
                      </button>
                      {markedForDeletion && (
                        <div className="absolute inset-0 flex items-center justify-center">
                          <span className="text-xs text-muted-foreground">
                            Will be removed
                          </span>
                        </div>
                      )}
                    </div>
                  )
                })}
              </div>
            )}

            {pendingFiles.length > 0 && (
              <div className="grid grid-cols-3 gap-2 mb-2">
                {pendingPreviews.map((src, i) => (
                  <div key={src} className="relative group">
                    <img
                      src={src}
                      alt=""
                      className="w-full h-20 object-cover rounded-md border"
                    />
                    <button
                      type="button"
                      onClick={() => removePendingFile(i)}
                      className="absolute top-1 right-1 bg-destructive hover:bg-destructive/80 rounded-full p-0.5 text-white"
                    >
                      <XIcon className="w-3 h-3" />
                    </button>
                  </div>
                ))}
              </div>
            )}

            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              multiple
              className="hidden"
              onChange={handleFileChange}
            />
            <Button
              type="button"
              variant="outline"
              className="w-full"
              onClick={() => fileInputRef.current?.click()}
            >
              <ImagePlusIcon className="w-4 h-4 mr-2" />
              Add Images
            </Button>
          </Field>
        </div>
      </form>

      <Button onClick={() => form.handleSubmit()}>
        {isEditMode ? 'Save Changes' : 'Upload Post'}
      </Button>
    </div>
  )
}

export { AddGallery }
