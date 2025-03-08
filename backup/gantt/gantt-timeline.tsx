/* 
1. timeline header component
2. Should only render the timeline when provided with start and end date
3. should show the dates and month names if changing in different timelines
*/
import { format } from "date-fns";
interface GanttTimelineProps {
  dates: Date[];
}

function GanttTimeline({ dates }: GanttTimelineProps) {
  return (
    <div id="timeline" className="px-4">
      <div className="flex flex-row items-center justify-between h-10">
        {dates.map((date) => (
          <div
            className="border-r h-10 border-slate-300 w-full"
            key={date.toISOString()}
          >
            {format(date, "MMM d")}
          </div>
        ))}
      </div>
    </div>
  );
}

export { GanttTimeline };
