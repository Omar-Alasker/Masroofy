import { X } from "lucide-react"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { CalendarIcon } from "lucide-react"
import { format } from "date-fns"
import { cn } from "@/lib/utils"
import { buttonVariants , Button } from "@/components/ui/button"
import useDateStore from "@/store/dateStore"

export default function DateRangeFilter() {
    const dateRange = useDateStore((state) => state.dateRange)
    const setDate = useDateStore((state) => state.setDateRange)
  return (
    <div className="flex mb-6">
        <Popover>
          <PopoverTrigger
            className={cn(
              buttonVariants({ variant: "outline" }),
              "justify-start text-left font-normal bg-accent"
            )}
          >
            <CalendarIcon className="mr-2 h-4 w-4" />
            {dateRange?.from ? (
              dateRange.to ? (
                <>
                  {format(dateRange.from, "LLL d, y")} - {format(dateRange.to, "LLL d, y")}
                </>
              ) : (
                format(dateRange.from, "LLL d, y")
              )
            ) : (
              "Pick a date range"
            )}
          </PopoverTrigger>

          <PopoverContent className="w-auto p-0" align="start">
            <Calendar
              mode="range"
              selected={dateRange}
              onSelect={(range) => setDate(range)}
              numberOfMonths={2}
            />
          </PopoverContent>
        </Popover>
        {dateRange?.from && (
          <Button
            variant="ghost"
            size="icon"
            type="button"
            onClick={() => setDate({ from: undefined, to: undefined })}
          >
            <X className="h-4 w-4" />
          </Button>
        )}
      </div>
  )
}
