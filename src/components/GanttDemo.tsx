import React, { useState } from "react";
import { Gantt } from "./gantt";
import { GanttTask, ViewMode } from "../utils/gantt/types";

const demoTasks: GanttTask[] = [
  {
    id: "1",
    name: "Send Section drawings",
    startDate: new Date(2025, 2, 6), // March 6, 2025
    endDate: new Date(2025, 2, 7), // March 7, 2025
    progress: 100,
    icons: {
      attachment: true,
    },
  },
  // {
  //   id: "2",
  //   name: "Totlots",
  //   startDate: new Date(2025, 2, 3), // March 3, 2025
  //   endDate: new Date(2025, 2, 5), // March 5, 2025
  //   progress: 85,
  //   icons: {
  //     issue: true,
  //     comment: true,
  //   },
  // },
  // {
  //   id: "3",
  //   name: "djdjd",
  //   startDate: new Date(2025, 2, 4), // March 4, 2025
  //   endDate: new Date(2025, 2, 6), // March 6, 2025
  //   progress: 50,
  // },
  // {
  //   id: "4",
  //   name: "New task",
  //   startDate: new Date(2025, 2, 6), // March 6, 2025
  //   endDate: new Date(2025, 2, 12), // March 12, 2025
  //   progress: 75,
  //   icons: {
  //     attachment: true,
  //     issue: true,
  //   },
  // },
  // {
  //   id: "5",
  //   name: "hshs",
  //   startDate: new Date(2025, 2, 6), // March 6, 2025
  //   endDate: new Date(2025, 2, 7), // March 7, 2025
  //   progress: 25,
  // },
  // {
  //   id: "6",
  //   name: "Arch way",
  //   startDate: new Date(2025, 2, 14), // March 14, 2025
  //   endDate: new Date(2025, 2, 18), // March 18, 2025
  //   progress: 30,
  //   icons: {
  //     comment: true,
  //   },
  // },
  // {
  //   id: "7",
  //   name: "Initial Planning",
  //   startDate: new Date(2025, 0, 10), // January 10, 2025
  //   endDate: new Date(2025, 0, 20), // January 20, 2025
  //   progress: 100,
  //   icons: {
  //     attachment: true,
  //   },
  // },
  // {
  //   id: "8",
  //   name: "Design Phase",
  //   startDate: new Date(2025, 0, 25), // January 25, 2025
  //   endDate: new Date(2025, 1, 15), // February 15, 2025
  //   progress: 90,
  //   icons: {
  //     comment: true,
  //   },
  // },
  // {
  //   id: "9",
  //   name: "Foundation Work",
  //   startDate: new Date(2025, 1, 20), // February 20, 2025
  //   endDate: new Date(2025, 2, 10), // March 10, 2025
  //   progress: 65,
  //   icons: {
  //     issue: true,
  //   },
  // },
  // {
  //   id: "10",
  //   name: "Material Procurement",
  //   startDate: new Date(2025, 1, 5), // February 5, 2025
  //   endDate: new Date(2025, 1, 25), // February 25, 2025
  //   progress: 100,
  //   icons: {
  //     attachment: true,
  //   },
  // },
  // {
  //   id: "11",
  //   name: "Quality Inspection",
  //   startDate: new Date(2025, 3, 5), // April 5, 2025
  //   endDate: new Date(2025, 3, 15), // April 15, 2025
  //   progress: 0,
  //   icons: {
  //     issue: true,
  //     comment: true,
  //   },
  // },
  // {
  //   id: "12",
  //   name: "Final Delivery",
  //   startDate: new Date(2025, 3, 20), // April 20, 2025
  //   endDate: new Date(2025, 3, 30), // April 30, 2025
  //   progress: 0,
  // },
];

export const GanttDemo: React.FC = () => {
  const [tasks, setTasks] = useState<GanttTask[]>(demoTasks);
  const [viewMode, setViewMode] = useState<ViewMode>("week");
  const [selectedTaskId, setSelectedTaskId] = useState<string | null>(null);

  const handleTaskClick = (task: GanttTask) => {
    setSelectedTaskId(task.id);
    console.log("Task clicked:", task);
  };

  const handleTaskDrag = (
    task: GanttTask,
    newStartDate: Date,
    newEndDate: Date
  ) => {
    console.log("Task dragged:", task, newStartDate, newEndDate);
    setTasks((prevTasks) =>
      prevTasks.map((t) =>
        t.id === task.id
          ? { ...t, startDate: newStartDate, endDate: newEndDate }
          : t
      )
    );
  };

  const handleTaskProgress = (task: GanttTask, progress: number) => {
    console.log("Task progress updated:", task, progress);
    setTasks((prevTasks) =>
      prevTasks.map((t) => (t.id === task.id ? { ...t, progress } : t))
    );
  };

  const handleViewModeChange = (newViewMode: ViewMode) => {
    console.log("View mode changed:", newViewMode);
    setViewMode(newViewMode);
  };

  return (
    <div className="w-full h-full ">
      <h1>Gantt Chart Demo</h1>
      <div style={{ height: "calc(100vh - 100px)", width: "100%" }}>
        <Gantt
          tasks={tasks}
          viewMode={viewMode}
          onTaskClick={handleTaskClick}
          onTaskDrag={handleTaskDrag}
          onTaskProgress={handleTaskProgress}
          onViewModeChange={handleViewModeChange}
          showWeekends
          showToday
        />
      </div>
    </div>
  );
};
