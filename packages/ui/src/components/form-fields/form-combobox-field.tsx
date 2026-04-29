import { useState } from 'react'
import { CheckIcon, ChevronsUpDownIcon } from 'lucide-react'
import { cn } from '../../lib/utils'
import { Field, FieldLabel, FieldError } from '../ui/field'
import { Button } from '../ui/button'
import { Popover, PopoverContent, PopoverTrigger } from '../ui/popover'
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from '../ui/command'

interface ComboboxOption {
  value: string
  label: string
}

/* eslint-disable @typescript-eslint/no-explicit-any */
interface FormComboboxFieldProps {
  form: any
  name: string
  label: string
  options: ComboboxOption[]
  required?: boolean
  placeholder?: string
  searchPlaceholder?: string
  emptyMessage?: string
  disabled?: boolean
  className?: string
  onValueChange?: (value: string) => void
}

export function FormComboboxField({
  form,
  name,
  label,
  options,
  required = false,
  placeholder = '',
  searchPlaceholder = 'Search...',
  emptyMessage = 'No results found.',
  disabled = false,
  className,
  onValueChange,
}: FormComboboxFieldProps) {
  return (
    <form.Field name={name}>
      {(field: any) => (
        <FormComboboxFieldInner
          field={field}
          label={label}
          options={options}
          required={required}
          placeholder={placeholder}
          searchPlaceholder={searchPlaceholder}
          emptyMessage={emptyMessage}
          disabled={disabled}
          className={className}
          onValueChange={onValueChange}
        />
      )}
    </form.Field>
  )
}

function FormComboboxFieldInner({
  field,
  label,
  options,
  required,
  placeholder,
  searchPlaceholder,
  emptyMessage,
  disabled,
  className,
  onValueChange,
}: {
  field: any
  label: string
  options: ComboboxOption[]
  required: boolean
  placeholder: string
  searchPlaceholder: string
  emptyMessage: string
  disabled: boolean
  className?: string
  onValueChange?: (value: string) => void
}) {
  const isInvalid = field.state.meta.isTouched && !field.state.meta.isValid
  const [open, setOpen] = useState(false)
  const selectedOption = options.find((opt) => opt.value === field.state.value)

  return (
    <Field data-invalid={isInvalid || undefined} className={className}>
      <FieldLabel htmlFor={field.name}>
        {label} {required && <span className="text-destructive">*</span>}
      </FieldLabel>
      <Popover open={open} onOpenChange={setOpen} modal>
        <PopoverTrigger asChild>
          <Button
            id={field.name}
            variant="outline"
            role="combobox"
            aria-expanded={open}
            disabled={disabled}
            className="w-full justify-between font-normal"
          >
            {selectedOption ? (
              selectedOption.label
            ) : (
              <span className="text-muted-foreground">{placeholder}</span>
            )}
            <ChevronsUpDownIcon className="ml-2 h-4 w-4 shrink-0 opacity-50" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="min-w-[var(--radix-popover-trigger-width)] p-0">
          <Command>
            <CommandInput placeholder={searchPlaceholder} />
            <CommandList>
              <CommandEmpty>{emptyMessage}</CommandEmpty>
              <CommandGroup>
                {options.map((opt) => (
                  <CommandItem
                    key={opt.value}
                    value={opt.label}
                    onSelect={() => {
                      const newValue = opt.value === field.state.value ? '' : opt.value
                      field.handleChange(newValue)
                      onValueChange?.(newValue)
                      setOpen(false)
                    }}
                  >
                    <CheckIcon
                      className={cn(
                        'mr-2 h-4 w-4',
                        field.state.value === opt.value
                          ? 'opacity-100'
                          : 'opacity-0'
                      )}
                    />
                    {opt.label}
                  </CommandItem>
                ))}
              </CommandGroup>
            </CommandList>
          </Command>
        </PopoverContent>
      </Popover>
      {isInvalid && (
            <FieldError errors={field.state.meta.errors} />

      )}
    </Field>
  )
}
