import React, { useRef, useCallback, useEffect } from "react";
import { GanttProps, GanttTask } from "../../utils/gantt/types";
import { TaskList } from "./TaskList";
import { Timeline } from "./Timeline";
import { TaskBars } from "./TaskBars";
import { ViewSwitcher } from "./ViewSwitcher";
import { useGanttState } from "../../hooks/gantt/useGanttState";
import { useGanttDrag } from "../../hooks/gantt/useGanttDrag";
import { useGanttResponsive } from "../../hooks/gantt/useGanttResponsive";
import { getXFromDate } from "../../utils/gantt";

/**
 * Gantt chart Main component
 * @param {GanttProps} props - The props for the Gantt chart
 * @returns {React.ReactElement} The Gantt chart component
 */
export const Gantt: React.FC<GanttProps> = ({
  tasks: initialTasks,
  viewMode: initialViewMode = "week",
  columns,
  onTaskClick,
  onTaskDoubleClick,
  onTaskDrag,
  onTaskProgress,
  onTaskExpand,
  onTaskCollapse,
  onDateChange,
  onViewModeChange,
  customTimeRange: initialCustomTimeRange,
  className,
  style,
  headerHeight = 60,
  rowHeight = 60,
  barCornerRadius = 6,
  barHeight = 40,
  columnWidth,
  listWidth: initialListWidth = 300,
  rtl = false,
  showWeekends = true,
  showToday = true,
  todayColor = "#0043D820",
  weekendColor = "rgba(0, 0, 0, 0.01)",
  locale = "en-IN",
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const timelineContainerRef = useRef<HTMLDivElement>(null);
  const timelineRef = useRef<HTMLDivElement>(null);

  // Initialize state
  const [state, actions] = useGanttState(
    initialTasks,
    initialViewMode,
    initialListWidth,
    initialCustomTimeRange
  );

  const {
    tasks,
    viewMode,
    timelineConfig,
    listWidth,
    selectedTaskId,
    customTimeRange,
  } = state;

  const {
    setTasks,
    setViewMode,
    setListWidth,
    setSelectedTaskId,
    updateTask,
    setCustomTimeRange,
  } = actions;

  // Handle responsive behavior
  const [responsiveConfig, responsiveListWidth, setResponsiveListWidth] =
    useGanttResponsive(containerRef, initialListWidth);

  // Update list width when responsive width changes
  useEffect(() => {
    setListWidth(responsiveListWidth);
  }, [responsiveListWidth, setListWidth]);

  // Handle drag events
  const {
    dragState,
    handleMouseDown,
    handleMouseMove,
    handleMouseUp,
    handleMouseLeave,
  } = useGanttDrag(
    tasks,
    timelineConfig,
    listWidth,
    (task, newStartDate, newEndDate) => {
      const updatedTask = {
        ...task,
        startDate: newStartDate,
        endDate: newEndDate,
      };
      updateTask(updatedTask);
      onTaskDrag?.(updatedTask, newStartDate, newEndDate);
    },
    (task, progress) => {
      const updatedTask = {
        ...task,
        progress,
      };
      updateTask(updatedTask);
      onTaskProgress?.(updatedTask, progress);
    }
  );

  // Handle task selection
  const handleTaskSelect = useCallback(
    (taskId: string) => {
      setSelectedTaskId(taskId);
      const task = tasks.find((t) => t.id === taskId);
      if (task) {
        onTaskClick?.(task);
      }
    },
    [tasks, setSelectedTaskId, onTaskClick]
  );

  // Handle task double click
  const handleTaskDoubleClick = useCallback(
    (taskId: string) => {
      const task = tasks.find((t) => t.id === taskId);
      if (task) {
        onTaskDoubleClick?.(task);
      }
    },
    [tasks, onTaskDoubleClick]
  );

  // Handle task expand/collapse
  const handleTaskExpand = useCallback(
    (task: GanttTask) => {
      const updatedTask = {
        ...task,
        collapsed: false,
      };
      updateTask(updatedTask);
      onTaskExpand?.(updatedTask);
    },
    [updateTask, onTaskExpand]
  );

  const handleTaskCollapse = useCallback(
    (task: GanttTask) => {
      const updatedTask = {
        ...task,
        collapsed: true,
      };
      updateTask(updatedTask);
      onTaskCollapse?.(updatedTask);
    },
    [updateTask, onTaskCollapse]
  );

  // Handle view mode change
  const handleViewModeChange = useCallback(
    (newViewMode: typeof viewMode) => {
      setViewMode(newViewMode);
      onViewModeChange?.(newViewMode);
    },
    [setViewMode, onViewModeChange]
  );

  // Handle custom time range change
  const handleCustomTimeRangeChange = useCallback(
    (range: { startDate: Date; endDate: Date }) => {
      setCustomTimeRange(range);
      onDateChange?.(range.startDate, range.endDate);
    },
    [setCustomTimeRange, onDateChange]
  );

  // Handle timeline scroll
  const handleTimelineScroll = useCallback(
    (e: React.UIEvent<HTMLDivElement>) => {
      if (timelineContainerRef.current) {
        timelineContainerRef.current.scrollLeft = e.currentTarget.scrollLeft;
      }
    },
    []
  );

  // Calculate dimensions
  const timelineWidth = responsiveConfig.containerWidth - listWidth;

  function scrollToToday() {
    const today = new Date();
    const todayIndex = getXFromDate(
      today,
      timelineConfig,
      timelineConfig.columnWidth * timelineConfig.columnCount
    );
    if (timelineContainerRef.current) {
      timelineContainerRef.current.scrollLeft =
        todayIndex - 5 * (timelineConfig.columnWidth || 0);
    }
  }

  useEffect(() => {
    const scrollTimeout = setTimeout(() => {
      scrollToToday();
    }, 100);
    return () => {
      clearTimeout(scrollTimeout);
    };
  }, [viewMode]);

  return (
    <div
      ref={containerRef}
      className={`gantt-chart ${
        className || ""
      } border border-gray-300  rounded-lg flex flex-col h-full w-full overflow-hidden `}
      style={{
        direction: rtl ? "rtl" : "ltr",
        ...style,
      }}
    >
      {/* View mode switcher */}
      <ViewSwitcher
        viewMode={viewMode}
        onViewModeChange={handleViewModeChange}
        customTimeRange={customTimeRange}
        onCustomTimeRangeChange={handleCustomTimeRangeChange}
      />

      <div
        className="gantt-container"
        style={{
          display: "flex",
          flex: 1,
          overflow: "hidden",
        }}
      >
        {/* Task list */}
        <TaskList
          tasks={tasks}
          columns={columns}
          width={listWidth}
          rowHeight={rowHeight}
          selectedTaskId={selectedTaskId}
          onTaskSelect={handleTaskSelect}
          onTaskExpand={handleTaskExpand}
          onTaskCollapse={handleTaskCollapse}
        />

        {/* Timeline and task bars */}
        <div
          ref={timelineContainerRef}
          className="gantt-timeline-container flex-1 overflow-auto relative "
          onScroll={handleTimelineScroll}
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUp}
          onMouseLeave={handleMouseLeave}
        >
          <div
            ref={timelineRef}
            style={{
              width: timelineConfig.columnWidth * timelineConfig.columnCount,
              height: "100%",
              position: "relative",
            }}
          >
            {/* Timeline header */}
            <Timeline
              timelineConfig={timelineConfig}
              width={timelineConfig.columnWidth * timelineConfig.columnCount}
              height={tasks.length * rowHeight + headerHeight}
              headerHeight={headerHeight}
              showWeekends={showWeekends}
              showToday={showToday}
              todayColor={todayColor}
              weekendColor={weekendColor}
            />

            {/* Task bars */}
            <div
              style={{
                position: "absolute",
                top: headerHeight,
                left: 0,
                right: 0,
                bottom: 0,
              }}
            >
              <TaskBars
                tasks={tasks}
                timelineConfig={timelineConfig}
                rowHeight={rowHeight}
                barHeight={barHeight}
                barCornerRadius={barCornerRadius}
                listWidth={listWidth}
                selectedTaskId={selectedTaskId}
                dragState={dragState}
                viewMode={viewMode}
                onMouseDown={handleMouseDown}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
