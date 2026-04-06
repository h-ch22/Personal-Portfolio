import { useState } from 'react'
import { ChevronLeftIcon, ChevronRightIcon } from 'lucide-react'
import { Button } from '#/components/ui/button'
import { cn } from '#/lib/utils'

const MONTH_LABELS = [
  'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
  'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec',
]

const YEAR_RANGE = 12
const THIS_YEAR = new Date().getFullYear()

export type MonthRange = { from: Date; to: Date | null }

const MonthRangePicker = ({
  from,
  to,
  isCurrentlyWorking = false,
  onSelect,
}: {
  from: Date | null
  to: Date | null
  isCurrentlyWorking?: boolean
  onSelect: (range: MonthRange) => void
}) => {
  const [viewYear, setViewYear] = useState(from?.getFullYear() ?? THIS_YEAR)
  const [showYearList, setShowYearList] = useState(false)
  const [yearPageStart, setYearPageStart] = useState(
    Math.floor((from?.getFullYear() ?? THIS_YEAR) / YEAR_RANGE) * YEAR_RANGE,
  )

  const isSameMonth = (d: Date, year: number, month: number) =>
    d.getFullYear() === year && d.getMonth() === month

  const isStart = (month: number) =>
    from ? isSameMonth(from, viewYear, month) : false

  const isEnd = (month: number) =>
    !isCurrentlyWorking && to ? isSameMonth(to, viewYear, month) : false

  const isInRange = (month: number) => {
    if (!from || isCurrentlyWorking || !to) return false
    const date = new Date(viewYear, month, 1)
    return date > from && date < to
  }

  const handleMonthClick = (month: number) => {
    const clicked = new Date(viewYear, month, 1)

    if (isCurrentlyWorking) {
      onSelect({ from: clicked, to: null })
      return
    }

    if (!from || to) {
      onSelect({ from: clicked, to: null })
    } else {
      if (clicked < from) {
        onSelect({ from: clicked, to: from })
      } else if (clicked.getTime() === from.getTime()) {
        onSelect({ from: clicked, to: null })
      } else {
        onSelect({ from, to: clicked })
      }
    }
  }

  const years = Array.from({ length: YEAR_RANGE }, (_, i) => yearPageStart + i)

  return (
    <div className="w-64 p-3 select-none">
      <div className="flex items-center justify-between mb-3">
        <Button
          type="button"
          variant="ghost"
          size="icon"
          onClick={() =>
            showYearList
              ? setYearPageStart((s) => s - YEAR_RANGE)
              : setViewYear((y) => y - 1)
          }
        >
          <ChevronLeftIcon className="h-4 w-4" />
        </Button>
        <button
          type="button"
          className="text-sm font-medium px-2 py-1 rounded-md hover:bg-accent transition-colors"
          onClick={() => {
            setYearPageStart(Math.floor(viewYear / YEAR_RANGE) * YEAR_RANGE)
            setShowYearList((v) => !v)
          }}
        >
          {showYearList
            ? `${yearPageStart} – ${yearPageStart + YEAR_RANGE - 1}`
            : viewYear}
        </button>
        <Button
          type="button"
          variant="ghost"
          size="icon"
          onClick={() =>
            showYearList
              ? setYearPageStart((s) => s + YEAR_RANGE)
              : setViewYear((y) => y + 1)
          }
        >
          <ChevronRightIcon className="h-4 w-4" />
        </Button>
      </div>

      {showYearList ? (
        <div className="grid grid-cols-4 gap-1">
          {years.map((year) => (
            <button
              key={year}
              type="button"
              onClick={() => {
                setViewYear(year)
                setShowYearList(false)
              }}
              className={cn(
                'rounded-md py-1.5 text-sm transition-colors',
                year === viewYear
                  ? 'bg-primary text-primary-foreground font-medium'
                  : 'hover:bg-accent hover:text-accent-foreground',
              )}
            >
              {year}
            </button>
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-4 gap-1">
          {MONTH_LABELS.map((label, month) => {
            const start = isStart(month)
            const end = isEnd(month)
            const inRange = isInRange(month)

            return (
              <button
                key={month}
                type="button"
                onClick={() => handleMonthClick(month)}
                className={cn(
                  'rounded-md py-1.5 text-sm transition-colors',
                  start || end
                    ? 'bg-primary text-primary-foreground font-medium'
                    : inRange
                      ? 'bg-accent text-accent-foreground'
                      : 'hover:bg-accent hover:text-accent-foreground',
                )}
              >
                {label}
              </button>
            )
          })}
        </div>
      )}

      {from && !to && !isCurrentlyWorking && (
        <p className="text-xs text-muted-foreground text-center mt-3">
          Select end month
        </p>
      )}
    </div>
  )
}

export { MonthRangePicker }
