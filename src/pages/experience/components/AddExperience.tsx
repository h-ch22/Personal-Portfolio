import { useRef, useState } from 'react'
import { format } from 'date-fns'
import { CalendarIcon, ImagePlusIcon, PlusIcon, XIcon } from 'lucide-react'

import { Badge } from '#/components/ui/badge'
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
import { MonthRangePicker } from '#/components/common/MonthRangePicker'
import { RichTextEditor } from '#/components/common/RichTextEditor'
import { cn } from '#/lib/utils'
import type { ExperienceRequest } from '#/types/experience'
import { TECH_STACK_GROUPS, type TechStackGroup } from '#/types/techstack'
import type { ExperienceFormInstance } from '../hooks/useExperiencePage'

const AddExperience = ({
  form,
  isEditMode,
  richDescription,
  setRichDescription,
  logoFile,
  setLogoFile,
  existingLogoUrl,
}: {
  form: ExperienceFormInstance
  isEditMode: boolean
  richDescription: string
  setRichDescription: (v: string) => void
  logoFile: File | null
  setLogoFile: (file: File | null) => void
  existingLogoUrl?: string
}) => {
  const [techInput, setTechInput] = useState({ name: '', iconUrl: '', group: 'Other' as TechStackGroup })
  const [datePickerOpen, setDatePickerOpen] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const logoPreview = logoFile
    ? URL.createObjectURL(logoFile)
    : existingLogoUrl

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] ?? null
    setLogoFile(file)
    if (fileInputRef.current) fileInputRef.current.value = ''
  }

  return (
    <div className="w-full flex flex-col gap-4">
      <form
        noValidate
        onSubmit={(e) => {
          e.preventDefault()
          form.handleSubmit()
        }}
      >
        <div className="w-full flex flex-col gap-4">
          <FieldGroup>
            {/* Logo upload */}
            <Field>
              <FieldLabel>Logo / Icon</FieldLabel>
              <div className="flex items-center gap-3">
                {logoPreview ? (
                  <div className="relative w-16 h-16 rounded-lg border overflow-hidden bg-muted flex items-center justify-center shrink-0">
                    <img
                      src={logoPreview}
                      alt="logo preview"
                      className="w-full h-full object-contain"
                    />
                    <button
                      type="button"
                      className="absolute top-0.5 right-0.5 bg-background/80 rounded-full p-0.5 hover:bg-background transition-colors"
                      onClick={() => setLogoFile(null)}
                    >
                      <XIcon className="w-3 h-3" />
                    </button>
                  </div>
                ) : (
                  <div className="w-16 h-16 rounded-lg border border-dashed bg-muted flex items-center justify-center shrink-0 text-muted-foreground">
                    <ImagePlusIcon className="w-6 h-6" />
                  </div>
                )}
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={handleFileChange}
                />
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => fileInputRef.current?.click()}
                >
                  {logoPreview ? 'Change' : 'Select Image'}
                </Button>
              </div>
            </Field>

            <form.Field name="title">
              {(field) => (
                <Field>
                  <FieldLabel htmlFor="input-title">
                    Title <span className="text-destructive">*</span>
                  </FieldLabel>
                  <Input
                    id="input-title"
                    placeholder="Title"
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

            <Field>
              <FieldLabel>
                Description <span className="text-destructive">*</span>
              </FieldLabel>
              <RichTextEditor
                value={richDescription}
                onChange={setRichDescription}
                placeholder="Describe your experience..."
              />
            </Field>

            <form.Field name="company">
              {(field) => (
                <Field>
                  <FieldLabel htmlFor="input-company">
                    Company <span className="text-destructive">*</span>
                  </FieldLabel>
                  <Input
                    id="input-company"
                    placeholder="Company"
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

            <form.Field name="role">
              {(field) => (
                <Field>
                  <FieldLabel htmlFor="input-role">
                    Role <span className="text-destructive">*</span>
                  </FieldLabel>
                  <Input
                    id="input-role"
                    placeholder="Role"
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

            <form.Field name="type">
              {(field) => (
                <Field>
                  <FieldLabel htmlFor="select-type">
                    Type <span className="text-destructive">*</span>
                  </FieldLabel>
                  <Select
                    value={field.state.value}
                    onValueChange={(v) =>
                      field.handleChange(v as ExperienceRequest['type'])
                    }
                  >
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Select Type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectGroup>
                        {(
                          [
                            'Work',
                            'Project',
                            'Activity',
                            'Open Source',
                          ] as const
                        ).map((type) => (
                          <SelectItem key={type} value={type}>
                            {type}
                          </SelectItem>
                        ))}
                      </SelectGroup>
                    </SelectContent>
                  </Select>
                </Field>
              )}
            </form.Field>

            <form.Field name="isCurrentlyWorking">
              {(isCurrentlyWorkingField) => (
                <form.Field name="startDate">
                  {(startDateField) => (
                    <form.Field name="endDate">
                      {(endDateField) => (
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
                                  !startDateField.state.value &&
                                    'text-muted-foreground',
                                )}
                              >
                                <CalendarIcon className="mr-2 h-4 w-4" />
                                {startDateField.state.value ? (
                                  isCurrentlyWorkingField.state.value ? (
                                    `${format(startDateField.state.value, 'MMM yyyy')} – Present`
                                  ) : endDateField.state.value ? (
                                    `${format(startDateField.state.value, 'MMM yyyy')} – ${format(endDateField.state.value, 'MMM yyyy')}`
                                  ) : (
                                    `${format(startDateField.state.value, 'MMM yyyy')} – …`
                                  )
                                ) : (
                                  <span>Select period</span>
                                )}
                              </Button>
                            </PopoverTrigger>
                            <PopoverContent
                              className="w-auto p-0"
                              align="start"
                            >
                              <MonthRangePicker
                                from={startDateField.state.value}
                                to={endDateField.state.value}
                                isCurrentlyWorking={
                                  isCurrentlyWorkingField.state.value
                                }
                                onSelect={({ from, to }) => {
                                  startDateField.handleChange(from)
                                  endDateField.handleChange(to)
                                  if (
                                    to !== null ||
                                    isCurrentlyWorkingField.state.value
                                  ) {
                                    setDatePickerOpen(false)
                                  }
                                }}
                              />
                            </PopoverContent>
                          </Popover>

                          <div className="flex items-center gap-2 mt-1">
                            <Checkbox
                              id="checkbox-currently-working"
                              checked={isCurrentlyWorkingField.state.value}
                              onCheckedChange={(checked) => {
                                isCurrentlyWorkingField.handleChange(
                                  checked === true,
                                )
                                if (checked === true) {
                                  endDateField.handleChange(null)
                                }
                              }}
                            />
                            <label
                              htmlFor="checkbox-currently-working"
                              className="text-sm cursor-pointer"
                            >
                              Currently working here
                            </label>
                          </div>
                        </Field>
                      )}
                    </form.Field>
                  )}
                </form.Field>
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
                        {
                          label: 'Simple Icons',
                          href: 'https://simpleicons.org',
                        },
                        {
                          label: 'Shields.io',
                          href: 'https://shields.io/badges/static-badge',
                        },
                      ].map(({ label, href }) => (
                        <a
                          key={href}
                          href={href}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="underline underline-offset-2 hover:text-foreground transition-colors"
                        >
                          {label}
                        </a>
                      ))}
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Input
                      placeholder="Name (e.g. Swift)"
                      value={techInput.name}
                      onChange={(e) =>
                        setTechInput((prev) => ({
                          ...prev,
                          name: e.target.value,
                        }))
                      }
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') {
                          e.preventDefault()
                          if (techInput.name.trim()) {
                            field.handleChange([
                              ...field.state.value,
                              {
                                name: techInput.name.trim(),
                                group: techInput.group,
                                ...(techInput.iconUrl.trim() && {
                                  iconUrl: techInput.iconUrl.trim(),
                                }),
                              },
                            ])
                            setTechInput({ name: '', iconUrl: '', group: 'Other' })
                          }
                        }
                      }}
                    />
                    <Input
                      placeholder="Icon URL (optional)"
                      value={techInput.iconUrl}
                      onChange={(e) =>
                        setTechInput((prev) => ({
                          ...prev,
                          iconUrl: e.target.value,
                        }))
                      }
                    />
                    <Select
                      value={techInput.group}
                      onValueChange={(v) =>
                        setTechInput((prev) => ({ ...prev, group: v as TechStackGroup }))
                      }
                    >
                      <SelectTrigger className="w-36 shrink-0">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectGroup>
                          {TECH_STACK_GROUPS.map((g) => (
                            <SelectItem key={g} value={g}>{g}</SelectItem>
                          ))}
                        </SelectGroup>
                      </SelectContent>
                    </Select>
                    <Button
                      type="button"
                      variant="outline"
                      size="icon"
                      onClick={() => {
                        if (techInput.name.trim()) {
                          field.handleChange([
                            ...field.state.value,
                            {
                              name: techInput.name.trim(),
                              group: techInput.group,
                              ...(techInput.iconUrl.trim() && {
                                iconUrl: techInput.iconUrl.trim(),
                              }),
                            },
                          ])
                          setTechInput({ name: '', iconUrl: '', group: 'Other' })
                        }
                      }}
                    >
                      <PlusIcon className="h-4 w-4" />
                    </Button>
                  </div>

                  {field.state.value.length > 0 && (
                    <div className="flex flex-wrap gap-2 mt-2">
                      {field.state.value.map((tech, index) => (
                        <Badge
                          key={index}
                          variant="secondary"
                          className="flex items-center gap-1.5 pl-1.5 pr-1 py-1 h-auto"
                        >
                          {tech.iconUrl && (
                            <img
                              src={tech.iconUrl}
                              alt={tech.name}
                              className="w-4 h-4 rounded-sm object-contain"
                            />
                          )}
                          <span className="text-xs">{tech.name}</span>
                          <button
                            type="button"
                            className="ml-0.5 rounded-full hover:bg-muted-foreground/20 p-0.5"
                            onClick={() =>
                              field.handleChange(
                                field.state.value.filter((_, i) => i !== index),
                              )
                            }
                          >
                            <XIcon className="h-3 w-3" />
                          </button>
                        </Badge>
                      ))}
                    </div>
                  )}
                </Field>
              )}
            </form.Field>
          </FieldGroup>
        </div>
      </form>

      <Button onClick={() => form.handleSubmit()}>
        {isEditMode ? 'Modify' : 'Upload'}
      </Button>
    </div>
  )
}

export { AddExperience }
