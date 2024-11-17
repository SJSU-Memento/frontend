import * as React from 'react'
import { DateTime } from 'luxon'
import { Check, ChevronsUpDown } from 'lucide-react'

import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from '@/components/ui/command'
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover'

import { recentFilters } from './helpers'

interface RecentFiltersDropdownProps {
  value: string
  onChange: (value: string) => void
}

export default function RecentFiltersDropdown({ value, onChange }: RecentFiltersDropdownProps) {
  const [open, setOpen] = React.useState(false)

  // Ensure recentFilters is defined and not empty
  const filters = React.useMemo(() => {
    return Array.isArray(recentFilters) && recentFilters.length > 0
      ? recentFilters
      : [{ label: "No filters available", value: "" }]
  }, [])

  const selectedFilter = React.useMemo(() => {
    return filters.find((filter) => filter.value === value) || filters[0]
  }, [filters, value])

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className="w-[200px] justify-between"
        >
          {selectedFilter.label}
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[200px] p-0">
        <Command>
          <CommandInput placeholder="Search filter..." />
          <CommandEmpty>No filter found.</CommandEmpty>
          <CommandList>
            <CommandGroup>
              {filters.map((filter) => (
                <CommandItem
                  key={filter.value}
                  value={filter.value}
                  onSelect={(currentValue) => {
                    onChange(currentValue === value ? "" : currentValue)
                    setOpen(false)
                  }}
                >
                  <Check
                    className={cn(
                      "mr-2 h-4 w-4",
                      value === filter.value ? "opacity-100" : "opacity-0"
                    )}
                  />
                  {filter.label}
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  )
}