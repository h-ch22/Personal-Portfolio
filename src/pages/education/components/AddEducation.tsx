import { useState } from 'react'
import { format } from 'date-fns'
import { CalendarIcon } from 'lucide-react'

import type { EducationFormInstance } from '../hooks/useEducationPage'
import type { EducationRequest } from '#/types/education'

import { MonthRangePicker } from '#/components/common/MonthRangePicker'
import { Button } from '#/components/ui/button'
import { Checkbox } from '#/components/ui/checkbox'
import { Field, FieldGroup, FieldLabel } from '#/components/ui/field'
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
import { Input } from '#/components/ui/input'
import { cn } from '#/lib/utils'

const AddEducation = ({
  form,
  isEditMode,
}: {
  form: EducationFormInstance
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

            <form.Field name="organization">
              {(field) => (
                <Field>
                  <FieldLabel htmlFor="input-organization">
                    Organization <span className="text-destructive">*</span>
                  </FieldLabel>
                  <Input
                    id="input-organization"
                    placeholder="Organization"
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
                      field.handleChange(v as EducationRequest['type'])
                    }
                  >
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Select Type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectGroup>
                        {(
                          [
                            'DEGREE',
                            'BOOTCAMP',
                            'CERTIFICATE',
                            'COURSE',
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

            <form.Field name="description">
              {(field) => (
                <Field>
                  <FieldLabel htmlFor="input-description">
                    Description
                  </FieldLabel>
                  <Input
                    id="input-description"
                    placeholder="Description"
                    value={field.state.value}
                    onChange={(e) => field.handleChange(e.target.value)}
                    onBlur={field.handleBlur}
                  />
                </Field>
              )}
            </form.Field>

            {/* Period — MonthRangePicker */}
            <form.Field name="inProgress">
              {(inProgressField) => (
                <form.Field name="startYear">
                  {(startYearField) => (
                    <form.Field name="startMonth">
                      {(startMonthField) => (
                        <form.Field name="endYear">
                          {(endYearField) => (
                            <form.Field name="endMonth">
                              {(endMonthField) => {
                                const startDate = new Date(
                                  startYearField.state.value,
                                  startMonthField.state.value - 1,
                                  1,
                                )
                                const endDate = inProgressField.state.value
                                  ? null
                                  : endYearField.state.value > 0
                                    ? new Date(
                                        endYearField.state.value,
                                        endMonthField.state.value - 1,
                                        1,
                                      )
                                    : null

                                return (
                                  <Field>
                                    <FieldLabel>
                                      Period{' '}
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
                                            !startDate && 'text-muted-foreground',
                                          )}
                                        >
                                          <CalendarIcon className="mr-2 h-4 w-4" />
                                          {startDate ? (
                                            inProgressField.state.value ? (
                                              `${format(startDate, 'MMM yyyy')} – Present`
                                            ) : endDate ? (
                                              `${format(startDate, 'MMM yyyy')} – ${format(endDate, 'MMM yyyy')}`
                                            ) : (
                                              `${format(startDate, 'MMM yyyy')} – …`
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
                                          from={startDate}
                                          to={endDate}
                                          isCurrentlyWorking={
                                            inProgressField.state.value
                                          }
                                          onSelect={({ from, to }) => {
                                            startYearField.handleChange(
                                              from.getFullYear(),
                                            )
                                            startMonthField.handleChange(
                                              from.getMonth() + 1,
                                            )
                                            if (to) {
                                              endYearField.handleChange(
                                                to.getFullYear(),
                                              )
                                              endMonthField.handleChange(
                                                to.getMonth() + 1,
                                              )
                                            } else {
                                              // to=null means a fresh start was selected;
                                              // clear end so picker enters "pick end" mode next click
                                              endYearField.handleChange(0)
                                              endMonthField.handleChange(0)
                                            }
                                            if (
                                              to !== null ||
                                              inProgressField.state.value
                                            ) {
                                              setDatePickerOpen(false)
                                            }
                                          }}
                                        />
                                      </PopoverContent>
                                    </Popover>

                                    <div className="flex items-center gap-2 mt-1">
                                      <Checkbox
                                        id="checkbox-in-progress"
                                        checked={inProgressField.state.value}
                                        onCheckedChange={(checked) =>
                                          inProgressField.handleChange(
                                            checked === true,
                                          )
                                        }
                                      />
                                      <label
                                        htmlFor="checkbox-in-progress"
                                        className="text-sm cursor-pointer"
                                      >
                                        It is currently in progress
                                      </label>
                                    </div>
                                  </Field>
                                )
                              }}
                            </form.Field>
                          )}
                        </form.Field>
                      )}
                    </form.Field>
                  )}
                </form.Field>
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

export { AddEducation }
