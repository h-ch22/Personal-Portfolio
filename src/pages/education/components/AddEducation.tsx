import { Button } from '#/components/ui/button'
import { Checkbox } from '#/components/ui/checkbox'
import { Field, FieldGroup, FieldLabel, FieldSet } from '#/components/ui/field'
import { Input } from '#/components/ui/input'
import { ScrollArea } from '#/components/ui/scroll-area'
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '#/components/ui/select'
import type { EducationRequest } from '#/types/education'

const AddEducation = ({
  formData,
  onContentChange,
  onSelectItemChange,
  toggleInProgress,
  onAddEducation,
}: {
  formData: EducationRequest
  onContentChange: (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>,
  ) => void
  onSelectItemChange: (value: string) => void
  toggleInProgress: () => void
  onAddEducation: () => void
}) => {
  return (
    <div className="w-full flex flex-col gap-4">
      <form noValidate>
        <div className="w-full flex flex-col gap-4">
          <FieldGroup>
            <Field>
              <FieldLabel htmlFor="input-title">
                Title <span className="text-destructive">*</span>
              </FieldLabel>

              <Input
                id="input-title"
                name="title"
                placeholder="Title"
                value={formData.title}
                onChange={onContentChange}
              />
            </Field>

            <Field>
              <FieldLabel htmlFor="input-organization">
                Organization <span className="text-destructive">*</span>
              </FieldLabel>

              <Input
                id="input-organization"
                name="organization"
                placeholder="Organization"
                value={formData.organization}
                onChange={onContentChange}
              />
            </Field>

            <Field>
              <FieldLabel htmlFor="select-type">
                Type <span className="text-destructive">*</span>
              </FieldLabel>

              <Select
                name="type"
                value={formData.type}
                onValueChange={onSelectItemChange}
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select Type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    {['DEGREE', 'BOOTCAMP', 'CERTIFICATE', 'COURSE'].map(
                      (type) => (
                        <SelectItem key={type} value={type}>
                          {type}
                        </SelectItem>
                      ),
                    )}
                  </SelectGroup>
                </SelectContent>
              </Select>
            </Field>

            <Field>
              <FieldLabel htmlFor="input-description">Description</FieldLabel>

              <Input
                id="input-description"
                name="description"
                placeholder="Description"
                value={formData.description}
                onChange={onContentChange}
              />
            </Field>

            <FieldLabel>Period</FieldLabel>
            <div className="grid grid-cols-2 gap-2">
              <Field>
                <FieldLabel htmlFor="input-start-year">Start Year</FieldLabel>
                <Input
                  id="input-start-year"
                  type="number"
                  min="2001"
                  name="startYear"
                  placeholder="Start Year"
                  value={formData.startYear}
                  onChange={onContentChange}
                />
              </Field>

              <Field>
                <FieldLabel htmlFor="input-start-month">Start Month</FieldLabel>
                <Input
                  id="input-start-month"
                  type="number"
                  name="startMonth"
                  min="1"
                  max="12"
                  placeholder="Start Month"
                  value={formData.startMonth}
                  onChange={onContentChange}
                />
              </Field>
            </div>

            <div className="grid grid-cols-2 gap-2">
              <Field>
                <FieldLabel htmlFor="input-end-year">End Year</FieldLabel>
                <Input
                  id="input-end-year"
                  type="number"
                  disabled={formData.inProgress}
                  min={formData.startYear}
                  name="endYear"
                  placeholder="End Year"
                  value={formData.endYear!}
                  onChange={onContentChange}
                />
              </Field>

              <Field>
                <FieldLabel htmlFor="input-end-month">End Month</FieldLabel>
                <Input
                  id="input-end-month"
                  type="number"
                  name="endMonth"
                  disabled={formData.inProgress}
                  min="1"
                  max="12"
                  placeholder="End Month"
                  value={formData.endMonth!}
                  onChange={onContentChange}
                />
              </Field>
            </div>

            <div className="w-full flex flex-row items-center gap-2">
              <Checkbox
                id="checkbox-in-progress"
                checked={formData.inProgress}
                onCheckedChange={() => toggleInProgress()}
              />
              <label htmlFor="checkbox-in-progress">
                It is currently in progress
              </label>
            </div>
          </FieldGroup>
        </div>
      </form>

      <Button onClick={() => onAddEducation()}>Upload</Button>
    </div>
  )
}

export { AddEducation }
