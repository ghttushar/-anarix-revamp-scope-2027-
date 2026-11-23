import { cn } from '@legacy/lib/utils';
import * as React from 'react';
import { DayPicker } from 'react-day-picker';

export type CalendarProps = React.ComponentProps<typeof DayPicker>;
function Calendar({
  className,
  classNames,
  showOutsideDays = true,
  ...props
}: CalendarProps) {
  return (
    <DayPicker
      className={cn('p-3', className)}
      classNames={{
        months: 'flex flex-col sm:flex-row space-y-4 sm:space-x-4 sm:space-y-0',
        month: 'space-y-2',
        caption: 'flex justify-center pt-1 pb-2 relative items-center',
        caption_label: 'text-xl font-medium text-[#3f4fda] ',
        nav: 'space-x-1 flex items-center',
        nav_button: cn(
          'h-7 w-7 bg-transparent mt-[calc(-1.4 * var(--np-rem))] p-0 opacity-50 hover:opacity-100 disabled:cursor-not-allowed disabled:hover:opacity-50'
        ),
        nav_button_previous: 'absolute left-1',
        nav_button_next: 'absolute right-1',
        table: 'w-full border-collapse space-y-1',
        head_row: 'flex mb-2',
        head_cell:
          'text-[#797d86] text-sm rounded-md flex align-center justify-center px-[calc(0.9 * var(--np-rem))] w-full font-medium ',
        row: 'flex w-92 mt-1 p-1 space-x-2',
        cell: 'h-9 w-9 text-center text-sm p-0 pr-[calc(2.5 * var(--np-rem))] relative [&:has([aria-selected].day-range-end)]:rounded-r-md [&:has([aria-selected].day-outside)]:bg-accent/50 [&:has([aria-selected])]:bg-accent first:[&:has([aria-selected])]:rounded-l-md last:[&:has([aria-selected])]:rounded-r-md focus-within:relative focus-within:z-20',
        day: 'h-12 w-12 p-0 font-normal rounded-lg aria-selected:opacity-100 hover:bg-[#f0f0f0]',
        day_range_start: '!text-white bg-[#3f4fda] rounded-none rounded-l-lg',
        day_range_end: '!text-white bg-[#3f4fda] rounded-none rounded-r-lg',
        day_selected:
          'bg-[#3f4fda] hover:bg-[#3f4fda] focus:bg-[#3f4fda] text-[#7749b] !font-medium !text-[#3f4fda] ',
        day_today: 'text-[#3f4fda] font-bold',
        day_outside:
          'day-outside text-muted-foreground aria-selected:text-muted-foreground',
        day_disabled:
          'text-muted-foreground opacity-50 hover:bg-[white] aria-selected:bg-[rgba(63, 79, 218, 0.5)] aria-selected:hover:bg-[rgba(63, 79, 218, 0.5)]',
        day_range_middle:
          'bg-gray-100 font-medium !rounded-none !text-[#7749b] hover:!bg-[#f0f0f0] hover:text-[#45474a]',
        day_hidden: 'invisible',
        ...classNames,
      }}
      {...props}
    />
  );
}
Calendar.displayName = 'Calendar';

export { Calendar };
