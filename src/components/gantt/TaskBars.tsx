import React from "react";
import { GanttTask, ViewMode } from "../../utils/gantt/types";
import { TimelineConfig } from "../../utils/gantt/dateUtils";
import { TaskBar } from "./TaskBar";

interface TaskBarsProps {
  tasks: GanttTask[];
  timelineConfig: TimelineConfig;
  rowHeight: number;
  barHeight: number;
  barCornerRadius: number;
  listWidth: number;
  selectedTaskId: string | null;
  viewMode: ViewMode;
  dragState: {
    isDragging: boolean;
    taskId: string | null;
    currentLeft?: number;
    currentWidth?: number;
    currentProgress?: number;
  };
  onMouseDown: (
    e: React.MouseEvent,
    task: GanttTask,
    type: "bar" | "left" | "right" | "progress",
    initialProps: {
      left: number;
      width: number;
      progress: number;
    }
  ) => void;
}

export const TaskBars: React.FC<TaskBarsProps> = ({
  tasks,
  timelineConfig,
  rowHeight,
  barHeight,
  barCornerRadius,
  listWidth,
  selectedTaskId,
  viewMode,
  dragState,
  onMouseDown,
}) => {
  return (
    <div className="gantt-task-bars">
      {tasks.map((task, index) => (
        <div
          key={task.id}
          className="gantt-task-bar-wrapper"
          style={{
            position: "absolute",
            top: index * rowHeight,
            left: 0,
            right: 0,
            height: rowHeight,
          }}
        >
          <TaskBar
            task={task}
            timelineConfig={timelineConfig}
            rowHeight={rowHeight}
            barHeight={barHeight}
            barCornerRadius={barCornerRadius}
            listWidth={listWidth}
            isSelected={task.id === selectedTaskId}
            dragState={dragState}
            onMouseDown={onMouseDown}
            viewMode={viewMode}
          />
        </div>
      ))}
    </div>
  );
};
