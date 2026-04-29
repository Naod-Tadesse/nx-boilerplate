import * as React from 'react'
import { CheckIcon, PlusCircledIcon } from '@radix-ui/react-icons'
import {
  Badge,
  cn,
  Command,
  CommandEmpty,
  Button,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  Separator,
  CommandSeparator,
    Popover,
  PopoverContent,
  PopoverTrigger,
} from '../../index'


type DataTableFacetedFilterProps = {
  title?: string
  options: {
    label: string
    value: string
    icon?: React.ComponentType<{ className?: string }>
  }[]
  /** When true, allows selecting multiple values. Defaults to false (single-select). */
  multiple?: boolean
  selectedValues: Set<string>
  onFilterChange: (values: string[] | undefined) => void
}

export function DataTableFacetedFilter({
  title,
  options,
  multiple = false,
  selectedValues,
  onFilterChange,
}: DataTableFacetedFilterProps) {
  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant='outline' size='sm' className='h-8  border-dashed'>
          <PlusCircledIcon className='size-4' />
          {title}
          {selectedValues?.size > 0 && (
            <>
              <Separator orientation='vertical' className='mx-2 h-4' />
              <Badge
                variant='secondary'
                className='rounded-sm px-1 font-normal lg:hidden'
              >
                {selectedValues.size}
              </Badge>
              <div className='hidden space-x-1 lg:flex'>
                {selectedValues.size > 2 ? (
                  <Badge
                    variant='secondary'
                    className='rounded-sm px-1 font-normal'
                  >
                    {selectedValues.size} selected
                  </Badge>
                ) : (
                  options
                    .filter((option) => selectedValues.has(option.value))
                    .map((option) => (
                      <Badge
                        variant='secondary'
                        key={option.value}
                        className='rounded-sm px-1 font-normal'
                      >
                        {option.label}
                      </Badge>
                    ))
                )}
              </div>
            </>
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent className='w-[200px] p-0' align='start'>
        <Command>
          <CommandInput placeholder={title} />
          <CommandList>
            <CommandEmpty>No results found.</CommandEmpty>
            <CommandGroup>
              {options.map((option) => {
                const isSelected = selectedValues.has(option.value)
                return (
                  <CommandItem
                    key={option.value}
                    onSelect={() => {
                      if (multiple) {
                        const next = new Set(selectedValues)
                        if (isSelected) {
                          next.delete(option.value)
                        } else {
                          next.add(option.value)
                        }
                        const filterValues = Array.from(next)
                        onFilterChange(
                          filterValues.length ? filterValues : undefined
                        )
                      } else {
                        // Single-select: toggle off if already selected, otherwise replace
                        onFilterChange(
                          isSelected ? undefined : [option.value]
                        )
                      }
                    }}
                  >
                    <div
                      className={cn(
                        'flex size-4 items-center justify-center border border-primary',
                        multiple ? 'rounded-sm' : 'rounded-full',
                        isSelected
                          ? 'bg-primary text-primary-foreground'
                          : 'opacity-50 [&_svg]:invisible'
                      )}
                    >
                      <CheckIcon className={cn('h-4 w-4 text-background')} />
                    </div>
                    {option.icon && (
                      <option.icon className='size-4 text-muted-foreground' />
                    )}
                    <span>{option.label}</span>
                  </CommandItem>
                )
              })}
            </CommandGroup>
            {selectedValues.size > 0 && (
              <>
                <CommandSeparator />
                <CommandGroup>
                  <CommandItem
                    onSelect={() => onFilterChange(undefined)}
                    className='justify-center text-center'
                  >
                    Clear filters
                  </CommandItem>
                </CommandGroup>
              </>
            )}
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  )
}
