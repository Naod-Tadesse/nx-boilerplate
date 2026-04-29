import { useState } from 'react'
import { format, parseISO } from 'date-fns'
import { Calendar as CalendarIcon } from 'lucide-react'
import { cn } from '../../lib/utils'
import { Field, FieldLabel, FieldError } from '../ui/field'
import { Button } from '../ui/button'
import { Calendar } from '../ui/calendar'
import { Popover, PopoverContent, PopoverTrigger } from '../ui/popover'

/* eslint-disable @typescript-eslint/no-explicit-any */
interface FormDatePickerFieldProps {
  form: any
  name: string
  label: string
  required?: boolean
  placeholder?: string
  disabled?: boolean
  className?: string
}

export function FormDatePickerField({
  form,
  name,
  label,
  required = false,
  placeholder = 'Pick a date',
  disabled = false,
  className,
}: FormDatePickerFieldProps) {
  return (
    <form.Field name={name}>
      {(field: any) => (
        <FormDatePickerFieldInner
          field={field}
          label={label}
          required={required}
          placeholder={placeholder}
          disabled={disabled}
          className={className}
        />
      )}
    </form.Field>
  )
}

function FormDatePickerFieldInner({
  field,
  label,
  required,
  placeholder,
  disabled,
  className,
}: {
  field: any
  label: string
  required: boolean
  placeholder: string
  disabled: boolean
  className?: string
}) {
  const isInvalid = field.state.meta.isTouched && !field.state.meta.isValid
  const [open, setOpen] = useState(false)

  const value = field.state.value as string
  const date = value ? parseISO(value) : undefined

  return (
    <Field data-invalid={isInvalid || undefined} className={className}>
      <FieldLabel htmlFor={field.name}>
        {label} {required && <span className="text-destructive">*</span>}
      </FieldLabel>
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            id={field.name}
            variant="outline"
            disabled={disabled}
            data-empty={!date}
            className={cn(
              'w-full justify-start text-left font-normal',
              'data-[empty=true]:text-muted-foreground'
            )}
          >
            <CalendarIcon className="mr-2 h-4 w-4" />
            {date ? format(date, 'PPP') : <span>{placeholder}</span>}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0" align="start">
          <Calendar
            mode="single"
            selected={date}
            onSelect={(selected) => {
              field.handleChange(selected ? format(selected, 'yyyy-MM-dd') : '')
              setOpen(false)
            }}
          />
        </PopoverContent>
      </Popover>
      {isInvalid && <FieldError errors={field.state.meta.errors} />}
    </Field>
  )
}
