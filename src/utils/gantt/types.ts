export type ViewMode = "day" | "week" | "month" | "year" | "custom";

export interface GanttTask {
  id: string;
  name: string;
  startDate: Date;
  endDate: Date;
  progress?: number; // 0-100
  dependencies?: string[];
  parentId?: string;
  isSubtask?: boolean;
  collapsed?: boolean;
  icons?: {
    attachment?: boolean;
    issue?: boolean;
    comment?: boolean;
    custom?: string; // Custom icon URL or class
  };
  color?: string;
  backgroundColor?: string;
}

export interface GanttColumn {
  id: string;
  label: string;
  width?: number;
  minWidth?: number;
  maxWidth?: number;
  formatter?: (task: GanttTask) => React.ReactNode;
}

export interface GanttProps {
  tasks: GanttTask[];
  viewMode?: ViewMode;
  columns?: GanttColumn[];
  onTaskClick?: (task: GanttTask) => void;
  onTaskDoubleClick?: (task: GanttTask) => void;
  onTaskDrag?: (task: GanttTask, newStartDate: Date, newEndDate: Date) => void;
  onTaskProgress?: (task: GanttTask, progress: number) => void;
  onTaskExpand?: (task: GanttTask) => void;
  onTaskCollapse?: (task: GanttTask) => void;
  onDateChange?: (startDate: Date, endDate: Date) => void;
  onViewModeChange?: (viewMode: ViewMode) => void;
  customTimeRange?: {
    startDate: Date;
    endDate: Date;
  };
  className?: string;
  style?: React.CSSProperties;
  headerHeight?: number;
  rowHeight?: number;
  barCornerRadius?: number;
  barHeight?: number;
  columnWidth?: number;
  listWidth?: number;
  rtl?: boolean;
  showWeekends?: boolean;
  showToday?: boolean;
  todayColor?: string;
  weekendColor?: string;
  locale?: string;
}

export interface TimelineConfig {
  viewMode: ViewMode;
  startDate: Date;
  endDate: Date;
  columnWidth: number;
  columnCount: number;
  columnUnit: "hour" | "day" | "week" | "month" | "year";
}
