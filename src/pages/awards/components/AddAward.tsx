import { useState } from 'react'
import { format } from 'date-fns'
import { CalendarIcon } from 'lucide-react'

import { MonthRangePicker } from '#/components/common/MonthRangePicker'
import { Button } from '#/components/ui/button'
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
import { Textarea } from '#/components/ui/textarea'
import { cn } from '#/lib/utils'
import type { AwardRequest } from '#/types/award'
import type { AwardFormInstance } from '../hooks/useAwardsPage'

const AddAward = ({
  form,
  isEditMode,
}: {
  form: AwardFormInstance
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
                    placeholder="e.g. Best Paper Award"
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

            <form.Field name="issuer">
              {(field) => (
                <Field>
                  <FieldLabel htmlFor="input-issuer">
                    Issuer <span className="text-destructive">*</span>
                  </FieldLabel>
                  <Input
                    id="input-issuer"
                    placeholder="e.g. IEEE"
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
                      field.handleChange(v as AwardRequest['type'])
                    }
                  >
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Select Type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectGroup>
                        {(
                          [
                            'Competition',
                            'Academic',
                            'Scholarship',
                            'Recognition',
                            'Other',
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

            <form.Field name="date">
              {(field) => (
                <Field>
                  <FieldLabel>
                    Date <span className="text-destructive">*</span>
                  </FieldLabel>
                  <Popover open={datePickerOpen} onOpenChange={setDatePickerOpen}>
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

            <form.Field name="description">
              {(field) => (
                <Field>
                  <FieldLabel htmlFor="input-description">
                    Description
                  </FieldLabel>
                  <Textarea
                    id="input-description"
                    placeholder="Brief description of the award..."
                    rows={3}
                    value={field.state.value}
                    onChange={(e) => field.handleChange(e.target.value)}
                    onBlur={field.handleBlur}
                  />
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

export { AddAward }
