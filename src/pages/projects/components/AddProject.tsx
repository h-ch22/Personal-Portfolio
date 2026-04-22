import { useRef, useState } from 'react'
import { format } from 'date-fns'
import { CalendarIcon, CheckIcon, GripVerticalIcon, ImagePlusIcon, PencilIcon, PlusIcon, XIcon } from 'lucide-react'
import { Reorder, useDragControls } from 'framer-motion'

import { LogoUploadField } from '#/components/common/LogoUploadField'
import { MonthRangePicker } from '#/components/common/MonthRangePicker'
import { RichTextEditor } from '#/components/common/RichTextEditor'
import { TechStackInput } from '#/components/common/TechStackInput'
import { Button } from '#/components/ui/button'
import { Checkbox } from '#/components/ui/checkbox'
import { Field, FieldGroup, FieldLabel } from '#/components/ui/field'
import { Input } from '#/components/ui/input'
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '#/components/ui/popover'
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '#/components/ui/select'
import { cn } from '#/lib/utils'
import type { GalleryImage } from '#/types/gallery'
import type { ProjectMember } from '#/types/project'
import type { Experience } from '#/types/experience'
import type { ProjectFormInstance } from '../hooks/useProjectsPage'

function DraggableMemberRow({
  member,
  onRemove,
  onEdit,
}: {
  member: ProjectMember
  onRemove: () => void
  onEdit: (updated: ProjectMember) => void
}) {
  const controls = useDragControls()
  const [isEditing, setIsEditing] = useState(false)
  const [editValues, setEditValues] = useState({ name: member.name, role: member.role })

  const confirmEdit = () => {
    if (!editValues.name.trim() || !editValues.role.trim()) return
    onEdit({ name: editValues.name.trim(), role: editValues.role.trim() })
    setIsEditing(false)
  }

  return (
    <Reorder.Item
      value={member}
      dragListener={false}
      dragControls={controls}
      className="flex items-center gap-2"
    >
      <button
        type="button"
        onPointerDown={(e) => { if (!isEditing) controls.start(e) }}
        className={cn(
          'text-muted-foreground hover:text-foreground touch-none',
          isEditing ? 'cursor-default opacity-30' : 'cursor-grab active:cursor-grabbing',
        )}
      >
        <GripVerticalIcon className="w-4 h-4" />
      </button>
      {isEditing ? (
        <>
          <Input
            autoFocus
            value={editValues.name}
            onChange={(e) => setEditValues((prev) => ({ ...prev, name: e.target.value }))}
            onKeyDown={(e) => {
              if (e.key === 'Enter') { e.preventDefault(); confirmEdit() }
              if (e.key === 'Escape') { setIsEditing(false) }
            }}
            className="flex-1"
          />
          <Input
            value={editValues.role}
            onChange={(e) => setEditValues((prev) => ({ ...prev, role: e.target.value }))}
            onKeyDown={(e) => {
              if (e.key === 'Enter') { e.preventDefault(); confirmEdit() }
              if (e.key === 'Escape') { setIsEditing(false) }
            }}
            className="flex-1"
          />
          <Button type="button" variant="outline" size="icon-sm" onClick={confirmEdit}>
            <CheckIcon className="h-3.5 w-3.5" />
          </Button>
        </>
      ) : (
        <>
          <div className="flex-1 flex items-center gap-2 border rounded-md px-3 py-1.5 bg-muted text-sm">
            <span className="font-medium">{member.name}</span>
            <span className="text-muted-foreground text-xs">{member.role}</span>
          </div>
          <Button
            type="button"
            variant="outline"
            size="icon-sm"
            onClick={() => {
              setEditValues({ name: member.name, role: member.role })
              setIsEditing(true)
            }}
          >
            <PencilIcon className="h-3.5 w-3.5" />
          </Button>
          <Button type="button" variant="outline" size="icon-sm" onClick={onRemove}>
            <XIcon className="h-3.5 w-3.5" />
          </Button>
        </>
      )}
    </Reorder.Item>
  )
}

function MembersField({
  value,
  onChange,
}: {
  value: ProjectMember[]
  onChange: (members: ProjectMember[]) => void
}) {
  const [memberInput, setMemberInput] = useState({ name: '', role: '' })

  const addMember = () => {
    if (!memberInput.name.trim() || !memberInput.role.trim()) return
    onChange([...value, { name: memberInput.name.trim(), role: memberInput.role.trim() }])
    setMemberInput({ name: '', role: '' })
  }

  return (
    <Field>
      <FieldLabel>People</FieldLabel>
      <div className="flex flex-col gap-2">
        {value.length > 0 && (
          <Reorder.Group
            axis="y"
            values={value}
            onReorder={onChange}
            className="flex flex-col gap-1.5"
          >
            {value.map((member, index) => (
              <DraggableMemberRow
                key={`${member.name}-${member.role}`}
                member={member}
                onRemove={() => onChange(value.filter((_, i) => i !== index))}
                onEdit={(updated) => {
                  const next = [...value]
                  next[index] = updated
                  onChange(next)
                }}
              />
            ))}
          </Reorder.Group>
        )}
        <div className="flex gap-2">
          <Input
            placeholder="Name"
            value={memberInput.name}
            onChange={(e) => setMemberInput((prev) => ({ ...prev, name: e.target.value }))}
            onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); addMember() } }}
          />
          <Input
            placeholder="Role (e.g. Backend)"
            value={memberInput.role}
            onChange={(e) => setMemberInput((prev) => ({ ...prev, role: e.target.value }))}
            onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); addMember() } }}
          />
          <Button type="button" variant="outline" size="icon" onClick={addMember}>
            <PlusIcon className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </Field>
  )
}

const AddProject = ({
  form,
  isEditMode,
  richDescription,
  setRichDescription,
  pendingFiles,
  setPendingFiles,
  existingImages,
  deletedImagePaths,
  onMarkImageForDeletion,
  onUnmarkImageForDeletion,
  logoFile,
  setLogoFile,
  existingLogoUrl,
  setExistingLogoUrl,
  allExperiences = [],
}: {
  form: ProjectFormInstance
  isEditMode: boolean
  richDescription: string
  setRichDescription: (v: string) => void
  pendingFiles: File[]
  setPendingFiles: React.Dispatch<React.SetStateAction<File[]>>
  existingImages: GalleryImage[]
  deletedImagePaths: string[]
  onMarkImageForDeletion: (path: string) => void
  onUnmarkImageForDeletion: (path: string) => void
  logoFile: File | null
  setLogoFile: (f: File | null) => void
  existingLogoUrl?: string
  setExistingLogoUrl: (url: string | undefined) => void
  allExperiences?: Experience[]
}) => {
  const [datePickerOpen, setDatePickerOpen] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files ?? [])
    setPendingFiles((prev) => [...prev, ...files])
    if (fileInputRef.current) fileInputRef.current.value = ''
  }

  const pendingPreviews = pendingFiles.map((f) => URL.createObjectURL(f))

  return (
    <div className="w-full flex flex-col gap-4 overflow-y-auto flex-1 min-h-0 pr-1">
      <form
        noValidate
        onSubmit={(e) => {
          e.preventDefault()
          form.handleSubmit()
        }}
      >
        <FieldGroup>
          <LogoUploadField
            logoFile={logoFile}
            setLogoFile={setLogoFile}
            existingLogoUrl={existingLogoUrl}
            setExistingLogoUrl={setExistingLogoUrl}
          />

          <form.Field name="title">
            {(field) => (
              <Field>
                <FieldLabel htmlFor="input-title">
                  Title <span className="text-destructive">*</span>
                </FieldLabel>
                <Input
                  id="input-title"
                  placeholder="e.g. Portfolio Website"
                  value={field.state.value}
                  onChange={(e) => field.handleChange(e.target.value)}
                  onBlur={field.handleBlur}
                />
              </Field>
            )}
          </form.Field>

          <Field>
            <FieldLabel>
              Description <span className="text-destructive">*</span>
            </FieldLabel>
            <RichTextEditor
              value={richDescription}
              onChange={setRichDescription}
              placeholder="Describe your project..."
            />
          </Field>

          <form.Field name="link">
            {(field) => (
              <Field>
                <FieldLabel htmlFor="input-link">Project Link</FieldLabel>
                <Input
                  id="input-link"
                  placeholder="https://..."
                  value={field.state.value}
                  onChange={(e) => field.handleChange(e.target.value)}
                />
              </Field>
            )}
          </form.Field>

          <form.Field name="githubUrl">
            {(field) => (
              <Field>
                <FieldLabel htmlFor="input-github">GitHub URL</FieldLabel>
                <Input
                  id="input-github"
                  placeholder="https://github.com/..."
                  value={field.state.value}
                  onChange={(e) => field.handleChange(e.target.value)}
                />
              </Field>
            )}
          </form.Field>

          <form.Field name="isOngoing">
            {(isOngoingField) => (
              <form.Field name="startDate">
                {(startField) => (
                  <form.Field name="endDate">
                    {(endField) => (
                      <Field>
                        <FieldLabel>
                          Period <span className="text-destructive">*</span>
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
                                !startField.state.value &&
                                  'text-muted-foreground',
                              )}
                            >
                              <CalendarIcon className="mr-2 h-4 w-4" />
                              {startField.state.value
                                ? isOngoingField.state.value
                                  ? `${format(startField.state.value, 'MMM yyyy')} – Present`
                                  : endField.state.value
                                    ? `${format(startField.state.value, 'MMM yyyy')} – ${format(endField.state.value, 'MMM yyyy')}`
                                    : `${format(startField.state.value, 'MMM yyyy')} – …`
                                : 'Select period'}
                            </Button>
                          </PopoverTrigger>
                          <PopoverContent className="w-auto p-0" align="start">
                            <MonthRangePicker
                              from={startField.state.value}
                              to={endField.state.value}
                              isCurrentlyWorking={isOngoingField.state.value}
                              onSelect={({ from, to }) => {
                                startField.handleChange(from)
                                endField.handleChange(to)
                                if (to !== null || isOngoingField.state.value) {
                                  setDatePickerOpen(false)
                                }
                              }}
                            />
                          </PopoverContent>
                        </Popover>

                        <div className="flex items-center gap-2 mt-1">
                          <Checkbox
                            id="checkbox-ongoing"
                            checked={isOngoingField.state.value}
                            onCheckedChange={(checked) => {
                              isOngoingField.handleChange(checked === true)
                              if (checked === true) endField.handleChange(null)
                            }}
                          />
                          <label
                            htmlFor="checkbox-ongoing"
                            className="text-sm cursor-pointer"
                          >
                            Currently ongoing
                          </label>
                        </div>
                      </Field>
                    )}
                  </form.Field>
                )}
              </form.Field>
            )}
          </form.Field>

          <form.Field name="isExperimental">
            {(field) => (
              <Field>
                <div className="flex items-center gap-2">
                  <Checkbox
                    id="checkbox-experimental"
                    checked={field.state.value}
                    onCheckedChange={(checked) => field.handleChange(checked === true)}
                  />
                  <label htmlFor="checkbox-experimental" className="text-sm cursor-pointer">
                    Conceptual or abandoned project
                  </label>
                </div>
              </Field>
            )}
          </form.Field>

          {allExperiences.length > 0 && (
            <form.Field name="experienceId">
              {(field) => {
                const sorted = [...allExperiences].sort((a, b) => {
                  if (a.isCurrentlyWorking && !b.isCurrentlyWorking) return -1
                  if (!a.isCurrentlyWorking && b.isCurrentlyWorking) return 1
                  const aEnd = a.endDate ? new Date(a.endDate).getTime() : 0
                  const bEnd = b.endDate ? new Date(b.endDate).getTime() : 0
                  return bEnd - aEnd
                })
                return (
                  <Field>
                    <FieldLabel>Related Experience</FieldLabel>
                    <Select
                      value={field.state.value || undefined}
                      onValueChange={(v) => field.handleChange(v === '__none__' ? '' : v)}
                    >
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="Select an experience (optional)" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectGroup>
                          <SelectItem value="__none__">— None —</SelectItem>
                          {sorted.map((e) => (
                            <SelectItem key={e.id} value={e.id}>
                              <div className="flex items-center gap-2">
                                {e.logoUrl && (
                                  <img src={e.logoUrl} alt={e.title} className="w-4 h-4 rounded-sm object-contain" />
                                )}
                                {e.title} · {e.company}
                              </div>
                            </SelectItem>
                          ))}
                        </SelectGroup>
                      </SelectContent>
                    </Select>
                  </Field>
                )
              }}
            </form.Field>
          )}

          <form.Field name="members">
            {(field) => (
              <MembersField
                value={field.state.value}
                onChange={field.handleChange}
              />
            )}
          </form.Field>

          <form.Field name="techStack">
            {(field) => (
              <Field>
                <div className="flex items-center justify-between">
                  <FieldLabel>Tech Stack</FieldLabel>
                  <div className="flex items-center gap-2 text-xs text-muted-foreground">
                    <span>Icon resources:</span>
                    {[
                      { label: 'Devicon', href: 'https://devicon.dev' },
                      { label: 'Simple Icons', href: 'https://simpleicons.org' },
                      { label: 'Shields.io', href: 'https://shields.io/badges/static-badge' },
                    ].map(({ label, href }) => (
                      <a key={href} href={href} target="_blank" rel="noopener noreferrer"
                        className="underline underline-offset-2 hover:text-foreground transition-colors">
                        {label}
                      </a>
                    ))}
                  </div>
                </div>
                <TechStackInput
                  value={field.state.value}
                  onChange={field.handleChange}
                />
              </Field>
            )}
          </form.Field>

          <Field>
            <FieldLabel>
              Images{' '}
              {!isEditMode && <span className="text-destructive">*</span>}
            </FieldLabel>

            {isEditMode && existingImages.length > 0 && (
              <div className="grid grid-cols-3 gap-2 mb-2">
                {existingImages.map((img) => {
                  const marked = deletedImagePaths.includes(img.path)
                  return (
                    <div key={img.path} className="relative">
                      <img
                        src={img.url}
                        alt=""
                        className={cn(
                          'w-full h-20 object-cover rounded-md border',
                          marked && 'opacity-30 grayscale',
                        )}
                      />
                      <button
                        type="button"
                        onClick={() =>
                          marked
                            ? onUnmarkImageForDeletion(img.path)
                            : onMarkImageForDeletion(img.path)
                        }
                        className={cn(
                          'absolute top-1 right-1 rounded-full p-0.5 text-white',
                          marked
                            ? 'bg-green-500 hover:bg-green-600'
                            : 'bg-destructive hover:bg-destructive/80',
                        )}
                      >
                        <XIcon className="w-3 h-3" />
                      </button>
                      {marked && (
                        <div className="absolute inset-0 flex items-center justify-center">
                          <span className="text-xs text-muted-foreground text-center px-1">
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
                  <div key={src} className="relative">
                    <img
                      src={src}
                      alt=""
                      className="w-full h-20 object-cover rounded-md border"
                    />
                    <button
                      type="button"
                      onClick={() =>
                        setPendingFiles((prev) =>
                          prev.filter((_, idx) => idx !== i),
                        )
                      }
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
        </FieldGroup>
      </form>

      <Button onClick={() => form.handleSubmit()}>
        {isEditMode ? 'Save Changes' : 'Create Project'}
      </Button>
    </div>
  )
}

export { AddProject }
