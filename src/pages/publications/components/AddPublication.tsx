import { useState } from 'react'
import { format } from 'date-fns'
import { CalendarIcon, Plus, Minus } from 'lucide-react'

import { MonthRangePicker } from '#/components/common/MonthRangePicker'
import { Button } from '#/components/ui/button'
import { Field, FieldLabel, FieldGroup } from '#/components/ui/field'
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
import type { PublicationRequest, PublicationType } from '#/types/publication'
import type { PublicationFormInstance } from '../hooks/usePublicationsPage'

const AuthorsField = ({
  value,
  onChange,
  errors,
}: {
  value: string[]
  onChange: (authors: string[]) => void
  errors: { message: string }[]
}) => {
  const [newAuthor, setNewAuthor] = useState('')

  const addAuthor = () => {
    if (newAuthor.trim() === '') return
    onChange([...value, newAuthor.trim()])
    setNewAuthor('')
  }

  const removeAuthor = (index: number) => {
    onChange(value.filter((_, i) => i !== index))
  }

  return (
    <Field>
      <FieldLabel>
        Authors <span className="text-destructive">*</span>
      </FieldLabel>
      <div className="flex flex-col gap-2">
        <div className="flex flex-col gap-2 max-h-40 overflow-y-auto">
          {value.map((author, index) => (
            <div key={index} className="flex items-center gap-2">
              <span className="flex-1 text-sm border rounded-md px-3 py-2 bg-muted">
                {author}
              </span>
              <Button
                type="button"
                variant="outline"
                size="icon-sm"
                onClick={() => removeAuthor(index)}
              >
                <Minus />
              </Button>
            </div>
          ))}
        </div>
        <div className="flex items-center gap-2">
          <Input
            placeholder="Author name"
            value={newAuthor}
            onChange={(e) => setNewAuthor(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                e.preventDefault()
                addAuthor()
              }
            }}
          />
          <Button
            type="button"
            variant="outline"
            size="icon-sm"
            onClick={addAuthor}
          >
            <Plus />
          </Button>
        </div>
      </div>
      {errors.length > 0 && (
        <p className="text-destructive text-sm">{errors[0]?.message}</p>
      )}
    </Field>
  )
}

const PUBLICATION_TYPES: PublicationType[] = [
  'International Journal',
  'International Conference',
  'Domestic Journal',
  'Domestic Conference',
  'Patient',
  'Book',
]

const AddPublication = ({
  form,
  isEditMode,
}: {
  form: PublicationFormInstance
  isEditMode: boolean
}) => {
  const [datePickerOpen, setDatePickerOpen] = useState(false)

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

            <form.Field name="journal">
              {(field) => (
                <Field>
                  <FieldLabel htmlFor="input-journal">
                    Journal <span className="text-destructive">*</span>
                  </FieldLabel>
                  <Input
                    id="input-journal"
                    placeholder="Journal"
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

            <form.Field name="authors">
              {(field) => (
                <AuthorsField
                  value={field.state.value}
                  onChange={(authors) => field.handleChange(authors)}
                  errors={field.state.meta.errors as { message: string }[]}
                />
              )}
            </form.Field>

            <form.Field name="link">
              {(field) => (
                <Field>
                  <FieldLabel htmlFor="input-link">Link</FieldLabel>
                  <Input
                    id="input-link"
                    placeholder="Link"
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

            <form.Field name="publicationYear">
              {(yearField) => (
                <form.Field name="publicationMonth">
                  {(monthField) => {
                    const date = new Date(
                      yearField.state.value,
                      monthField.state.value - 1,
                      1,
                    )
                    return (
                      <Field>
                        <FieldLabel>
                          Publication Date{' '}
                          <span className="text-destructive">*</span>
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
                              )}
                            >
                              <CalendarIcon className="mr-2 h-4 w-4" />
                              {format(date, 'MMM yyyy')}
                            </Button>
                          </PopoverTrigger>
                          <PopoverContent className="w-auto p-0" align="start">
                            <MonthRangePicker
                              from={date}
                              to={null}
                              isCurrentlyWorking
                              onSelect={({ from }) => {
                                yearField.handleChange(from.getFullYear())
                                monthField.handleChange(from.getMonth() + 1)
                                setDatePickerOpen(false)
                              }}
                            />
                          </PopoverContent>
                        </Popover>
                        {yearField.state.meta.errors.length > 0 && (
                          <p className="text-destructive text-sm">
                            {yearField.state.meta.errors[0]?.message}
                          </p>
                        )}
                      </Field>
                    )
                  }}
                </form.Field>
              )}
            </form.Field>

            <form.Field name="type">
              {(field) => (
                <Field>
                  <FieldLabel htmlFor="publication-type">
                    Type <span className="text-destructive">*</span>
                  </FieldLabel>
                  <Select
                    value={field.state.value}
                    onValueChange={(value) =>
                      field.handleChange(value as PublicationRequest['type'])
                    }
                  >
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Select publication type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectGroup>
                        {PUBLICATION_TYPES.map((type) => (
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
          </FieldGroup>
        </div>
      </form>

      <Button onClick={() => form.handleSubmit()}>
        {isEditMode ? 'Modify Publication' : 'Upload Publication'}
      </Button>
    </div>
  )
}

export { AddPublication }
