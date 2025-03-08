import React from "react";
import { GanttTask, ViewMode } from "../../utils/gantt/types";
import { TimelineConfig, getXFromDate } from "../../utils/gantt/dateUtils";

const TASK_ICON_SIZE = 20;
const TASK_ICON_STROKE_COLOR = "#000";
const TASK_ICON_STROKE_WIDTH = 2;

interface TaskBarProps {
  task: GanttTask;
  timelineConfig: TimelineConfig;
  rowHeight: number;
  barHeight: number;
  barCornerRadius: number;
  listWidth: number;
  isSelected: boolean;
  viewMode: ViewMode;
  dragState?: {
    isDragging: boolean;
    taskId: string | null;
    currentLeft?: number;
    currentWidth?: number;
    currentProgress?: number;
  };
  onMouseDown: (
    e: React.MouseEvent,
    task: GanttTask,
    type: "bar" | "left" | "right" | "progress"
  ) => void;
}

export const TaskBar: React.FC<TaskBarProps> = ({
  task,
  timelineConfig,
  rowHeight,
  barHeight,
  barCornerRadius,
  listWidth,
  isSelected,
  dragState,
  onMouseDown,
  viewMode,
}) => {
  // Calculate position based on dates or drag state
  const isDragging = dragState?.isDragging && dragState.taskId === task.id;

  // Use drag state values if this task is being dragged
  let left: number;
  let width: number;
  let progressWidth: number;

  if (isDragging) {
    // If we have current values from drag state, use them
    if (dragState.currentLeft !== undefined) {
      left = dragState.currentLeft;
    } else {
      // Fall back to calculated position
      left = getXFromDate(task.startDate, timelineConfig, listWidth);
    }

    if (dragState.currentWidth !== undefined) {
      width = dragState.currentWidth;
    } else {
      // Calculate width from dates
      const startX = getXFromDate(task.startDate, timelineConfig, listWidth);
      const endX = getXFromDate(task.endDate, timelineConfig, listWidth);
      width = Math.max(endX - startX, 1);
    }

    if (dragState.currentProgress !== undefined) {
      progressWidth = width * (dragState.currentProgress / 100);
    } else {
      progressWidth = width * ((task.progress || 0) / 100);
    }
  } else {
    // Normal calculation for non-dragging state
    const startX = getXFromDate(task.startDate, timelineConfig, listWidth);
    const endX = getXFromDate(task.endDate, timelineConfig, listWidth);
    left = startX;
    width = Math.max(endX - startX, 1);
    progressWidth = width * ((task.progress || 0) / 100);
  }

  const top = (rowHeight - barHeight) / 2;

  // Render task icons
  const renderIcons = () => {
    if (!task.icons || viewMode === "year") return null;

    const icons = [];
    const iconSize = barHeight - 4;
    let offsetRight = 4;

    if (task.icons.attachment) {
      icons.push(
        <div
          key="attachment"
          className="gantt-task-icon attachment"
          style={{
            position: "absolute",
            right: offsetRight,
            top: "50%",
            transform: "translateY(-50%)",
            width: iconSize,
            height: iconSize,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
          title="Attachment"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width={TASK_ICON_SIZE}
            height={TASK_ICON_SIZE}
            viewBox="0 0 24 24"
            fill="none"
            stroke={TASK_ICON_STROKE_COLOR}
            strokeWidth={TASK_ICON_STROKE_WIDTH}
            strokeLinecap="round"
            strokeLinejoin="round"
            className="lucide lucide-paperclip"
          >
            <path d="M13.234 20.252 21 12.3" />
            <path d="m16 6-8.414 8.586a2 2 0 0 0 0 2.828 2 2 0 0 0 2.828 0l8.414-8.586a4 4 0 0 0 0-5.656 4 4 0 0 0-5.656 0l-8.415 8.585a6 6 0 1 0 8.486 8.486" />
          </svg>
        </div>
      );
      offsetRight += iconSize + 4;
    }

    if (task.icons.issue) {
      icons.push(
        <div
          key="issue"
          className="gantt-task-icon issue"
          style={{
            position: "absolute",
            right: offsetRight,
            top: "50%",
            transform: "translateY(-50%)",
            width: iconSize,
            height: iconSize,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
          title="Issue"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width={TASK_ICON_SIZE}
            height={TASK_ICON_SIZE}
            viewBox="0 0 24 24"
            fill="none"
            stroke={TASK_ICON_STROKE_COLOR}
            strokeWidth={TASK_ICON_STROKE_WIDTH}
            strokeLinecap="round"
            strokeLinejoin="round"
            className="lucide lucide-triangle-alert"
          >
            <path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3" />
            <path d="M12 9v4" />
            <path d="M12 17h.01" />
          </svg>
        </div>
      );
      offsetRight += iconSize + 4;
    }

    if (task.icons.comment) {
      icons.push(
        <div
          key="comment"
          className="gantt-task-icon comment"
          style={{
            position: "absolute",
            right: offsetRight,
            top: "50%",
            transform: "translateY(-50%)",
            width: iconSize,
            height: iconSize,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
          title="Comment"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width={TASK_ICON_SIZE}
            height={TASK_ICON_SIZE}
            viewBox="0 0 24 24"
            fill="none"
            stroke={TASK_ICON_STROKE_COLOR}
            strokeWidth={TASK_ICON_STROKE_WIDTH}
            strokeLinecap="round"
            strokeLinejoin="round"
            className="lucide lucide-message-circle"
          >
            <path d="M7.9 20A9 9 0 1 0 4 16.1L2 22Z" />
          </svg>
        </div>
      );
      offsetRight += iconSize + 4;
    }

    if (task.icons.custom) {
      icons.push(
        <div
          key="custom"
          className="gantt-task-icon custom"
          style={{
            position: "absolute",
            right: offsetRight,
            top: "50%",
            transform: "translateY(-50%)",
            width: iconSize,
            height: iconSize,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
          title="Custom"
        >
          {task.icons.custom}
        </div>
      );
    }

    return icons;
  };
  return (
    <div
      className={`gantt-task-bar ${isSelected ? "selected" : ""} ${
        isDragging ? "dragging" : ""
      }`}
      style={{
        position: "absolute",
        left,
        top,
        width,
        height: barHeight,
        backgroundColor: task.backgroundColor || "#68737DFF",
        borderRadius: barCornerRadius,
        boxShadow: isSelected ? "0 0 0 2px rgba(0, 0, 0, 0.2)" : "none",
        cursor: "move",
        overflow: "visible",
        opacity: isDragging ? 0.8 : 1,
        zIndex: isDragging ? 100 : 1,
      }}
      onMouseDown={(e) => onMouseDown(e, task, "bar")}
    >
      {/* Progress bar */}
      <div
        className="gantt-task-progress"
        style={{
          position: "absolute",
          left: 0,
          top: 0,
          width: progressWidth,
          height: barHeight,
          backgroundColor: task.color || "#22BB33",
          borderRadius: barCornerRadius,
          opacity: 1,
        }}
      />

      {/* Progress handle */}
      {/* <div
        className="gantt-task-progress-handle"
        style={{
          position: "absolute",
          left: progressWidth - 4,
          top: 0,
          width: 8,
          height: barHeight,
          cursor: "ew-resize",
          zIndex: 1,
        }}
        onMouseDown={(e) => {
          e.stopPropagation();
          onMouseDown(e, task, "progress");
        }}
      /> */}

      {/* Left resize handle */}
      <div
        className="gantt-task-left-handle hover:bg-gray-500 hover:border-white hover:border-2"
        style={{
          position: "absolute",
          left: -4,
          top: 0,
          width: 8,
          height: barHeight,
          cursor: "ew-resize",
          zIndex: 1,
        }}
        onMouseDown={(e) => {
          e.stopPropagation();
          onMouseDown(e, task, "left");
        }}
      />

      {/* Right resize handle */}
      <div
        className="gantt-task-right-handle hover:bg-gray-500 hover:border-white hover:border-2"
        style={{
          position: "absolute",
          right: -4,
          top: 0,
          width: 8,
          height: barHeight,
          cursor: "ew-resize",
          zIndex: 1,
        }}
        onMouseDown={(e) => {
          e.stopPropagation();
          onMouseDown(e, task, "right");
        }}
      />

      {/* Task label */}
      <div
        className="gantt-task-label"
        style={{
          position: "absolute",
          left: 8,
          top: 0,
          height: barHeight,
          lineHeight: `${barHeight}px`,
          color: "#fff",
          fontSize: "12px",
          fontWeight: "bold",
          whiteSpace: "nowrap",
          overflow: "hidden",
          textOverflow: "ellipsis",
          maxWidth: width - 16,
        }}
      >
        {task.name}
      </div>

      {/* Task icons */}
      {/* {renderIcons()} */}
    </div>
  );
};
