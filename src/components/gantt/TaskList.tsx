import React, { useMemo } from "react";
import { GanttTask, GanttColumn } from "../../utils/gantt/types";

interface TaskListProps {
  tasks: GanttTask[];
  columns?: GanttColumn[];
  width: number;
  rowHeight: number;
  selectedTaskId: string | null;
  onTaskSelect: (taskId: string) => void;
  onTaskExpand?: (task: GanttTask) => void;
  onTaskCollapse?: (task: GanttTask) => void;
}

const DEFAULT_COLUMNS: GanttColumn[] = [
  {
    id: "name",
    label: "Task",
    width: 200,
  },
];

export const TaskList: React.FC<TaskListProps> = ({
  tasks,
  columns = DEFAULT_COLUMNS,
  width,
  rowHeight,
  selectedTaskId,
  onTaskSelect,
  onTaskExpand,
  onTaskCollapse,
}) => {
  const columnsWithWidths = useMemo(() => {
    const totalDefinedWidth = columns.reduce(
      (sum, col) => sum + (col.width || 0),
      0
    );
    const columnsWithoutWidth = columns.filter((col) => !col.width);

    if (columnsWithoutWidth.length === 0) return columns;

    const remainingWidth = Math.max(0, width - totalDefinedWidth);
    const widthPerColumn = remainingWidth / columnsWithoutWidth.length;

    return columns.map((col) => ({
      ...col,
      width: col.width || widthPerColumn,
    }));
  }, [columns, width]);

  const renderCell = (task: GanttTask, column: GanttColumn) => {
    if (column.formatter) {
      return column.formatter(task);
    }

    if (column.id === "name") {
      return (
        <div className="task-name-cell">
          {task.isSubtask && <span className="task-indent" />}
          {task.dependencies && task.dependencies.length > 0 && (
            <button
              className="task-expand-button"
              onClick={(e) => {
                e.stopPropagation();
                if (task.collapsed) {
                  onTaskExpand?.(task);
                } else {
                  onTaskCollapse?.(task);
                }
              }}
            >
              {task.collapsed ? "+" : "-"}
            </button>
          )}
          <span className="task-name">{task.name}</span>
        </div>
      );
    }

    // @ts-ignore - Access task property dynamically
    return task[column.id] !== undefined ? task[column.id] : "";
  };

  return (
    <div
      className="gantt-task-list"
      style={{
        width: `${width}px`,
        overflow: "hidden",
        borderRight: "1px solid #e0e0e0",
      }}
    >
      <div
        className="gantt-task-list-header"
        style={{ height: `${rowHeight}px` }}
      >
        {columnsWithWidths.map((column) => (
          <div
            key={column.id}
            className="gantt-task-list-header-cell"
            style={{
              // width: column.width,
              minWidth: column.minWidth,
              //  maxWidth: column.maxWidth,
              height: `${rowHeight}px`,
              lineHeight: `${rowHeight}px`,
              padding: "0 10px",
              fontWeight: "bold",
              borderBottom: "1px solid #e0e0e0",
              overflow: "hidden",
              textOverflow: "ellipsis",
              whiteSpace: "nowrap",
            }}
          >
            {column.label}
          </div>
        ))}
      </div>
      <div className="gantt-task-list-body">
        {tasks.map((task) => (
          <div
            key={task.id}
            className={`gantt-task-list-row ${
              selectedTaskId === task.id ? "selected" : ""
            }`}
            style={{
              height: `${rowHeight}px`,
              display: "flex",
              cursor: "pointer",
              // backgroundColor:
              //   selectedTaskId === task.id ? "#f0f0f0" : "transparent",
            }}
            onClick={() => onTaskSelect(task.id)}
          >
            {columnsWithWidths.map((column) => (
              <div
                key={`${task.id}-${column.id}`}
                className="gantt-task-list-cell"
                style={{
                  width: "100%",
                  minWidth: column.minWidth,
                  //  maxWidth: column.maxWidth,
                  height: `${rowHeight}px`,
                  lineHeight: `${rowHeight}px`,
                  padding: "0 16px",
                  // borderBottom: "1px solid #e0e0e0",
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                  whiteSpace: "nowrap",
                  textAlign: "start",
                }}
              >
                {renderCell(task, column)}
              </div>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
};
