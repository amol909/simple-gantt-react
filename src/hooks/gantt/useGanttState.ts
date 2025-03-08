import { useState, useCallback, useMemo } from "react";
import { ViewMode, GanttTask } from "../../utils/gantt/types";
import { getTimelineConfig, TimelineConfig } from "../../utils/gantt/dateUtils";

interface GanttState {
  tasks: GanttTask[];
  viewMode: ViewMode;
  timelineConfig: TimelineConfig;
  listWidth: number;
  selectedTaskId: string | null;
  customTimeRange?: {
    startDate: Date;
    endDate: Date;
  };
}

interface GanttActions {
  setTasks: (tasks: GanttTask[]) => void;
  setViewMode: (viewMode: ViewMode) => void;
  setListWidth: (width: number) => void;
  setSelectedTaskId: (id: string | null) => void;
  updateTask: (updatedTask: GanttTask) => void;
  setCustomTimeRange: (
    range: { startDate: Date; endDate: Date } | undefined
  ) => void;
}

/**
 * Hook to manage the state of the Gantt chart
 * @param {GanttTask[]} initialTasks - The initial tasks for the Gantt chart
 * @param {ViewMode} initialViewMode - The initial view mode for the Gantt chart
 * @param {number} initialListWidth - The initial width of the task list
 * @param {Object} initialCustomTimeRange - The initial custom time range for the Gantt chart
 */
export const useGanttState = (
  initialTasks: GanttTask[] = [],
  initialViewMode: ViewMode = "week",
  initialListWidth: number = 300,
  initialCustomTimeRange?: { startDate: Date; endDate: Date }
): [GanttState, GanttActions] => {
  const [tasks, setTasks] = useState<GanttTask[]>(initialTasks);
  const [viewMode, setViewMode] = useState<ViewMode>(initialViewMode);
  const [listWidth, setListWidth] = useState<number>(initialListWidth);
  const [selectedTaskId, setSelectedTaskId] = useState<string | null>(null);
  const [customTimeRange, setCustomTimeRange] = useState<
    { startDate: Date; endDate: Date } | undefined
  >(initialCustomTimeRange);

  const timelineConfig = useMemo(
    () => getTimelineConfig(viewMode, tasks, customTimeRange),
    [viewMode, tasks, customTimeRange]
  );

  const updateTask = useCallback((updatedTask: GanttTask) => {
    setTasks((prevTasks) =>
      prevTasks.map((task) => (task.id === updatedTask.id ? updatedTask : task))
    );
  }, []);

  const state: GanttState = {
    tasks,
    viewMode,
    timelineConfig,
    listWidth,
    selectedTaskId,
    customTimeRange,
  };

  const actions: GanttActions = {
    setTasks,
    setViewMode,
    setListWidth,
    setSelectedTaskId,
    updateTask,
    setCustomTimeRange,
  };

  return [state, actions];
};
