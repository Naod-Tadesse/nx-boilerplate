import { useState, useEffect } from 'react'
import { Field, FieldLabel, FieldError } from '../ui/field'
import { Input } from '../ui/input'

/* eslint-disable @typescript-eslint/no-explicit-any */
interface FormTextFieldProps {
  form: any
  name: string
  label: string
  required?: boolean
  placeholder?: string
  autoComplete?: string
  type?: string
  disabled?: boolean
  className?: string
}

export function FormTextField({
  form,
  name,
  label,
  required = false,
  placeholder = '',
  autoComplete,
  type = 'text',
  disabled = false,
  className,
}: FormTextFieldProps) {
  return (
    <form.Field name={name}>
      {(field: any) => (
        <FormTextFieldInner
          field={field}
          label={label}
          required={required}
          placeholder={placeholder}
          autoComplete={autoComplete}
          type={type}
          disabled={disabled}
          className={className}
        />
      )}
    </form.Field>
  )
}

function FormTextFieldInner({
  field,
  label,
  required,
  placeholder,
  autoComplete,
  type,
  disabled,
  className,
}: {
  field: any
  label: string
  required: boolean
  placeholder: string
  autoComplete?: string
  type: string
  disabled: boolean
  className?: string
}) {
  const isInvalid = field.state.meta.isTouched && !field.state.meta.isValid
  const isNumber = type === 'number'
  const [isCleared, setIsCleared] = useState(false)
  const [rawNumberValue, setRawNumberValue] = useState<string>(() => {
    if (!isNumber) return ''
    const value = field.state.value
    if (value === null || value === undefined || Number.isNaN(value)) return ''
    return String(value)
  })

  useEffect(() => {
    if (!isNumber) return
    const value = field.state.value
    if (isCleared && value === 0) return

    const next =
      value === null || value === undefined || Number.isNaN(value)
        ? ''
        : String(value)

    if (next !== rawNumberValue) setRawNumberValue(next)
    if (isCleared && value !== 0) setIsCleared(false)
  }, [field.state.value, isCleared, isNumber, rawNumberValue])

  const inputValue = isNumber
    ? isCleared && field.state.value === 0
      ? ''
      : rawNumberValue
    : (field.state.value ?? '')

  return (
    <Field data-invalid={isInvalid || undefined} className={className}>
      <FieldLabel htmlFor={field.name}>
        {label} {required && <span className="text-destructive">*</span>}
      </FieldLabel>
      <Input
        id={field.name}
        name={field.name}
        type={type}
        step={isNumber ? 'any' : undefined}
        value={inputValue}
        onBlur={field.handleBlur}
        onChange={(e) => {
          if (isNumber) {
            const nextValue = e.target.value
            setRawNumberValue(nextValue)
            if (nextValue === '') {
              setIsCleared(true)
              field.handleChange(0)
              return
            }
            setIsCleared(false)
            const parsed = Number(nextValue)
            field.handleChange(Number.isNaN(parsed) ? 0 : parsed)
            return
          }
          field.handleChange(e.target.value)
        }}
        aria-invalid={isInvalid}
        placeholder={placeholder}
        autoComplete={autoComplete}
        disabled={disabled}
      />
      {isInvalid && (
        <FieldError errors={field.state.meta.errors} />
      )}
    </Field>
  )
}
