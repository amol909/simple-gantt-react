//this component should ideally have the context and hold the state for the gantt chart
//first we build individual components for the gantt chart
// we start with the gantt timeline
// then we build the gantt chart task bar

import { eachDayOfInterval, addDays, subDays, format } from "date-fns";
import { GanttTimeline } from "./gantt-timeline";

const taskBarHeight = 30;

const tasks = [
  {
    start: new Date(), //today
    end: addDays(new Date(), 2), //2 days from today 4 march
  },
];

const getTimelineWidth = (
  timelineStartDate: Date,
  timelineEndDate: Date,
  pixelsPerDay: number
) => {
  const start = new Date(timelineStartDate).getTime();
  const end = new Date(timelineEndDate).getTime();
  const differenceInDays = Math.floor((end - start) / (1000 * 60 * 60 * 24));
  console.log("getTimelineWidth", differenceInDays * pixelsPerDay);
  return differenceInDays * pixelsPerDay;
};

const getOffsetBetweenTimelineAndTask = (
  taskStart: Date,
  timelineStart: Date,
  pixelsPerDay: number
) => {
  const start = new Date(taskStart).getTime();
  const startTimeline = new Date(timelineStart).getTime();
  const differenceInDays = Math.ceil(
    (start - startTimeline) / (1000 * 60 * 60 * 24)
  );
  console.log(
    "getOffset between timeline and task",
    differenceInDays,
    differenceInDays * pixelsPerDay
  );
  return differenceInDays * pixelsPerDay;
};

const getTaskWidth = (taskStart: Date, taskEnd: Date, pixelsPerDay: number) => {
  const start = new Date(taskStart);
  const end = new Date(taskEnd);
  const differenceInDays =
    Math.floor((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24)) + 1;
  console.log("getTaskWidth", differenceInDays * pixelsPerDay);
  return differenceInDays * pixelsPerDay;
};

function GanttContainer() {
  const timelineStartDate = subDays(new Date(), 4);
  const timelineEndDate = addDays(new Date(), 5);
  const dates = eachDayOfInterval({
    start: timelineStartDate,
    end: timelineEndDate,
  });
  const timelineWidth = document.getElementById("timeline")?.offsetWidth;
  const PIXELS_PER_DAY = timelineWidth! / 10;
  console.log("PIXELS_PER_DAY", PIXELS_PER_DAY);
  const left = getOffsetBetweenTimelineAndTask(
    tasks[0].start,
    timelineStartDate,
    PIXELS_PER_DAY
  );
  const width = getTaskWidth(tasks[0].start, tasks[0].end, PIXELS_PER_DAY);

  return (
    <div
      className="border h-full"
      style={{
        width: timelineWidth,
      }}
    >
      <GanttTimeline dates={dates} />
      <svg className="w-full h-full bg-slate-100 rounded-md">
        <g>
          <rect
            width={width}
            height={taskBarHeight}
            fill="red"
            x={left}
            rx={8}
            ry={8}
          />
          <text
            onClick={() => {
              console.log("clicked text");
              alert("clicked text");
            }}
            x={left + width / 2}
            fill="white"
            color={"blue"}
            fontSize={12}
            y={20}
            textAnchor="middle"
          >
            {format(tasks[0].start, "MMM d")}
          </text>
        </g>
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="transparent"
          x={left + 2 * PIXELS_PER_DAY}
          stroke="white"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="lucide lucide-file"
          onClick={() => {
            console.log("clicked svg");
            alert("clicked svg");
          }}
        >
          <path d="M15 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7Z" />
          <path d="M14 2v4a2 2 0 0 0 2 2h4" />
        </svg>
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="24"
          height="24"
          viewBox="0 0 24 24"
          //x={left + 2 * PIXELS_PER_DAY + 28}
          fill="none"
          stroke="currentColor"
          onClick={() => {
            console.log("clicked error");
            alert("clicked error");
          }}
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="lucide lucide-triangle-alert"
        >
          <path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3" />
          <path d="M12 9v4  " />
          <path d="M12 17h.01" />
        </svg>
        <rect
          width={timelineWidth}
          height={taskBarHeight}
          fill="blue"
          x={PIXELS_PER_DAY}
          y={40}
          rx={8}
          ry={8}
        />
      </svg>
    </div>
  );
}

export { GanttContainer };
