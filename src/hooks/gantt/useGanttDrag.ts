import { useState, useCallback, useRef, useEffect } from "react";
import { GanttTask } from "../../utils/gantt/types";
import { TimelineConfig, getDateFromX } from "../../utils/gantt/dateUtils";
import { useGanttState } from "./useGanttState";

type DragType = "bar" | "left" | "right" | "progress" | null;

interface DragState {
  isDragging: boolean;
  dragType: DragType;
  taskId: string | null;
  initialX: number;
  initialWidth: number;
  initialLeft: number;
  initialProgress: number;
  currentLeft?: number;
  currentWidth?: number;
  currentProgress?: number;
}

interface UseDragResult {
  dragState: DragState;
  handleMouseDown: (
    e: React.MouseEvent,
    task: GanttTask,
    dragType: DragType,
    initialProps: {
      left: number;
      width: number;
      progress: number;
    }
  ) => void;
  handleMouseMove: (e: React.MouseEvent) => void;
  handleMouseUp: () => void;
  handleMouseLeave: () => void;
}

export const useGanttDrag = (
  tasks: GanttTask[],
  timelineConfig: TimelineConfig,
  listWidth: number,
  onTaskDrag?: (task: GanttTask, newStartDate: Date, newEndDate: Date) => void,
  onTaskProgress?: (task: GanttTask, progress: number) => void
): UseDragResult => {
  const [dragState, setDragState] = useState<DragState>({
    isDragging: false,
    dragType: null,
    taskId: null,
    initialX: 0,
    initialWidth: 0,
    initialLeft: 0,
    initialProgress: 0,
  });

  const taskRef = useRef<GanttTask | null>(null);
  const dragTimeoutRef = useRef<number | null>(null);

  useEffect(() => {
    return () => {
      if (dragTimeoutRef.current) {
        window.clearTimeout(dragTimeoutRef.current);
      }
    };
  }, []);

  const handleMouseDown = useCallback(
    (
      e: React.MouseEvent,
      task: GanttTask,
      dragType: DragType,
      initialProps: { left: number; width: number; progress: number }
    ) => {
      e.preventDefault();
      const rect = (e.currentTarget as HTMLElement).getBoundingClientRect();
      const initialLeft = rect.left - listWidth;
      setDragState({
        isDragging: true,
        dragType,
        taskId: task.id,
        initialX: e.clientX,
        initialWidth: initialProps.width,
        initialLeft: initialProps.left,
        initialProgress: initialProps.progress,
        //currentLeft: initialLeft,
        //currentWidth: rect.width,
        //currentProgress: task.progress || 0,
      });
      taskRef.current = task;

      document.addEventListener("mousemove", handleGlobalMouseMove);
      document.addEventListener("mouseup", handleGlobalMouseUp);
    },
    []
  );
  const handleGlobalMouseMove = useCallback((e: MouseEvent) => {
    const event = { clientX: e.clientX } as React.MouseEvent;
    handleMouseMove(event);
  }, []);

  const handleGlobalMouseUp = useCallback(() => {
    handleMouseUp();
    document.removeEventListener("mousemove", handleGlobalMouseMove);
    document.removeEventListener("mouseup", handleGlobalMouseUp);
  }, []);

  const handleMouseMove = useCallback(
    (e: React.MouseEvent) => {
      if (!dragState.isDragging || !taskRef.current) return;

      const task = taskRef.current;
      const deltaX = e.clientX - dragState.initialX;

      if (dragTimeoutRef.current) {
        window.clearTimeout(dragTimeoutRef.current);
        dragTimeoutRef.current = null;
      }

      switch (dragState.dragType) {
        case "bar": {
          const newLeft = Math.max(0, dragState.initialLeft + deltaX);
          const newStartDate = getDateFromX(
            newLeft + listWidth,
            timelineConfig,
            listWidth
          );
          const taskDuration =
            task.endDate.getTime() - task.startDate.getTime();
          const newEndDate = new Date(newStartDate.getTime() + taskDuration);

          setDragState((prev) => ({
            ...prev,
            currentLeft: newLeft,
          }));

          dragTimeoutRef.current = window.setTimeout(() => {
            onTaskDrag?.(task, newStartDate, newEndDate);
          }, 50);
          break;
        }
        case "left": {
          const newLeft = Math.max(0, dragState.initialLeft + deltaX);
          console.log("newLeft", newLeft, deltaX, dragState.initialWidth);
          const newStartDate = getDateFromX(
            newLeft + listWidth,
            timelineConfig,
            listWidth
          );

          setDragState((prev) => ({
            ...prev,
            currentLeft: newLeft,
            currentWidth: prev.currentWidth
              ? prev.initialWidth + Math.abs(deltaX)
              : Math.abs(deltaX),
          }));

          if (newStartDate < task.endDate) {
            dragTimeoutRef.current = window.setTimeout(() => {
              onTaskDrag?.(task, newStartDate, task.endDate);
            }, 50);
          }
          break;
        }
        case "right": {
          const newWidth = Math.max(10, dragState.initialWidth + deltaX);
          const rightEdge = dragState.initialLeft + newWidth;
          const newEndDate = getDateFromX(
            rightEdge + listWidth,
            timelineConfig,
            listWidth
          );

          setDragState((prev) => ({
            ...prev,
            currentWidth: newWidth,
          }));

          if (newEndDate > task.startDate) {
            dragTimeoutRef.current = window.setTimeout(() => {
              onTaskDrag?.(task, task.startDate, newEndDate);
            }, 50);
          }
          break;
        }
        case "progress": {
          const progressDelta = (deltaX / dragState.initialWidth) * 100;
          const newProgress = Math.min(
            100,
            Math.max(0, dragState.initialProgress + progressDelta)
          );

          setDragState((prev) => ({
            ...prev,
            currentProgress: newProgress,
          }));

          dragTimeoutRef.current = window.setTimeout(() => {
            onTaskProgress?.(task, newProgress);
          }, 50);
          break;
        }
      }
    },
    [dragState, listWidth, onTaskDrag, onTaskProgress, timelineConfig]
  );

  const handleMouseUp = useCallback(() => {
    if (!dragState.isDragging || !taskRef.current) return;

    const task = taskRef.current;

    if (dragTimeoutRef.current) {
      window.clearTimeout(dragTimeoutRef.current);
      dragTimeoutRef.current = null;
    }

    switch (dragState.dragType) {
      case "bar": {
        if (dragState.currentLeft !== undefined) {
          const newStartDate = getDateFromX(
            dragState.currentLeft + listWidth,
            timelineConfig,
            listWidth
          );
          const taskDuration =
            task.endDate.getTime() - task.startDate.getTime();
          const newEndDate = new Date(newStartDate.getTime() + taskDuration);
          onTaskDrag?.(task, newStartDate, newEndDate);
        }
        break;
      }
      case "left": {
        if (dragState.currentLeft !== undefined) {
          const newStartDate = getDateFromX(
            dragState.currentLeft + listWidth,
            timelineConfig,
            listWidth
          );
          if (newStartDate < task.endDate) {
            onTaskDrag?.(task, newStartDate, task.endDate);
          }
        }
        break;
      }
      case "right": {
        if (dragState.currentWidth !== undefined) {
          const rightEdge = dragState.initialLeft + dragState.currentWidth;
          const newEndDate = getDateFromX(
            rightEdge + listWidth,
            timelineConfig,
            listWidth
          );
          if (newEndDate > task.startDate) {
            onTaskDrag?.(task, task.startDate, newEndDate);
          }
        }
        break;
      }
      case "progress": {
        if (dragState.currentProgress !== undefined) {
          onTaskProgress?.(task, dragState.currentProgress);
        }
        break;
      }
    }

    setDragState((prev) => ({
      ...prev,
      isDragging: false,
    }));
    taskRef.current = null;
  }, [dragState, listWidth, onTaskDrag, onTaskProgress, timelineConfig]);

  const handleMouseLeave = useCallback(() => {
    if (dragState.isDragging) {
      // Don't end the drag on mouse leave - we'll handle it with global events
      // handleMouseUp();
    }
  }, [dragState.isDragging]);

  return {
    dragState,
    handleMouseDown,
    handleMouseMove,
    handleMouseUp,
    handleMouseLeave,
  };
};
