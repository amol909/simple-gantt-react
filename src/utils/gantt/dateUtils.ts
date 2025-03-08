import {
  addDays,
  addMonths,
  addWeeks,
  addYears,
  differenceInDays,
  differenceInMonths,
  differenceInWeeks,
  differenceInYears,
  endOfDay,
  endOfMonth,
  endOfWeek,
  endOfYear,
  format,
  isAfter,
  isBefore,
  isSameDay,
  isSameMonth,
  isSameWeek,
  isSameYear,
  isWeekend,
  startOfDay,
  startOfMonth,
  startOfWeek,
  startOfYear,
} from "date-fns";
import { ViewMode } from "./types";

// Define TimelineConfig here to ensure columnUnit types match
export interface TimelineConfig {
  viewMode: ViewMode;
  startDate: Date;
  endDate: Date;
  columnWidth: number;
  columnCount: number;
  columnUnit: "hour" | "day" | "week" | "month" | "year";
}

export const getTimelineConfig = (
  viewMode: ViewMode,
  tasks: { startDate: Date; endDate: Date }[],
  customTimeRange?: { startDate: Date; endDate: Date }
): TimelineConfig => {
  let startDate: Date;
  let endDate: Date;
  let columnUnit: "hour" | "day" | "week" | "month" | "year";
  let columnWidth: number;

  // Determine start and end dates
  if (customTimeRange) {
    startDate = customTimeRange.startDate;
    endDate = customTimeRange.endDate;
  } else if (tasks.length > 0) {
    // Find min start date and max end date from tasks
    startDate = tasks.reduce(
      (min, task) => (isBefore(task.startDate, min) ? task.startDate : min),
      tasks[0].startDate
    );
    endDate = tasks.reduce(
      (max, task) => (isAfter(task.endDate, max) ? task.endDate : max),
      tasks[0].endDate
    );

    // Add some padding
    switch (viewMode) {
      case "day":
        startDate = startOfDay(addDays(startDate, -4));
        endDate = endOfDay(addDays(endDate, 5));
        break;
      case "week":
        startDate = startOfWeek(addDays(startDate, -2));
        endDate = endOfWeek(addDays(endDate, 2));
        break;
      case "month":
        startDate = startOfMonth(addDays(startDate, -1));
        endDate = endOfMonth(addDays(endDate, 1));
        break;
      case "year":
        startDate = startOfYear(startDate);
        endDate = endOfYear(endDate);
        break;
      default:
        startDate = startOfDay(addDays(startDate, -4));
        endDate = endOfDay(addDays(endDate, 5));
    }
  } else {
    // Default dates if no tasks
    startDate = new Date();
    endDate = addMonths(startDate, 3);
  }

  // Configure column settings based on view mode
  switch (viewMode) {
    case "day":
      columnUnit = "day";
      columnWidth = 100;
      break;
    case "week":
      columnUnit = "day";
      columnWidth = 120;
      break;
    case "month":
      columnUnit = "day";
      columnWidth = 100;
      break;
    case "year":
      columnUnit = "month";
      columnWidth = 100;
      break;
    case "custom":
      // Determine appropriate unit based on date range
      const daysDiff = differenceInDays(endDate, startDate);
      if (daysDiff <= 60) {
        columnUnit = "day";
        columnWidth = 50;
      } else if (daysDiff <= 365) {
        columnUnit = "week";
        columnWidth = 70;
      } else {
        columnUnit = "month";
        columnWidth = 100;
      }
      break;
    default:
      columnUnit = "day";
      columnWidth = 60;
  }

  // Calculate column count
  let columnCount: number;

  switch (columnUnit as string) {
    case "hour":
      columnCount = differenceInDays(endDate, startDate) * 24;
      break;
    case "day":
      columnCount = differenceInDays(endDate, startDate) + 1;
      break;
    case "week":
      columnCount = differenceInWeeks(endDate, startDate) + 1;
      break;
    case "month":
      columnCount = differenceInMonths(endDate, startDate) + 1;
      break;
    case "year":
      columnCount = differenceInYears(endDate, startDate) + 1;
      break;
    default:
      columnCount = differenceInDays(endDate, startDate) + 1;
  }

  return {
    viewMode,
    startDate,
    endDate,
    columnWidth,
    columnCount,
    columnUnit,
  };
};

export const getFormattedDate = (
  date: Date,
  viewMode: ViewMode,
  columnUnit: "hour" | "day" | "week" | "month" | "year"
): string => {
  switch (viewMode) {
    case "day":
      return format(date, "d MMM");
    case "week":
      return format(date, "EEEEEE dd");
    case "month":
      return format(date, "EEEEEE dd");
    case "year":
      return format(date, "qqq MMM");
    case "custom":
      switch (columnUnit) {
        case "hour":
          return format(date, "HH:mm");
        case "day":
          return format(date, "d MMM");
        case "week":
          return format(date, "dd/MM");
        case "month":
          return format(date, "MMM");
        case "year":
          return format(date, "yyyy");
        default:
          return format(date, "dd/MM");
      }
    default:
      return format(date, "dd/MM");
  }
};

export const getHeaderFormattedDate = (
  date: Date,
  viewMode: ViewMode
): string => {
  switch (viewMode) {
    case "day":
      return format(date, "MMMM yyyy");
    case "week":
      return format(date, "MMMM yyyy");
    case "month":
      return format(date, "MMMM yyyy");
    case "year":
      return format(date, "yyyy");
    default:
      return format(date, "MMMM yyyy");
  }
};

/**
 * Get the date from an x position in the timeline
 * @param x - The x position
 * @param timelineConfig - The timeline configuration
 * @param listWidth - The width of the list
 * @returns The date at the x position
 */
export const getDateFromX = (
  x: number,
  timelineConfig: TimelineConfig,
  listWidth: number
): Date => {
  const { startDate, columnWidth, columnUnit } = timelineConfig;

  // Calculate the exact position in the timeline
  const position = (x - listWidth) / columnWidth;

  // Create a safe copy of the start date
  const safeStartDate = new Date(startDate);

  switch (columnUnit as string) {
    case "hour": {
      const hours = position * 24;
      const days = Math.floor(hours / 24);
      const remainingHours = hours % 24;
      const result = addDays(safeStartDate, days);
      result.setHours(safeStartDate.getHours() + remainingHours);
      return result;
    }
    case "day": {
      const days = Math.floor(position);
      const remainingDay = position - days; // Fraction of a day
      const result = addDays(safeStartDate, days);

      // Add the remaining fraction of a day in hours
      const hoursToAdd = remainingDay * 24;
      result.setHours(safeStartDate.getHours() + hoursToAdd);
      return result;
    }
    case "week": {
      const weeks = Math.floor(position);
      const remainingWeek = position - weeks; // Fraction of a week
      const result = addWeeks(safeStartDate, weeks);

      // Add the remaining fraction of a week in days
      const daysToAdd = remainingWeek * 7;
      return addDays(result, daysToAdd);
    }
    case "month": {
      const months = Math.floor(position);
      const remainingMonth = position - months; // Fraction of a month
      const result = addMonths(safeStartDate, months);

      // Add the remaining fraction of a month in days
      const daysInMonth = new Date(
        result.getFullYear(),
        result.getMonth() + 1,
        0
      ).getDate();
      const daysToAdd = Math.floor(remainingMonth * daysInMonth);
      return addDays(result, daysToAdd);
    }
    case "year": {
      const years = Math.floor(position);
      const remainingYear = position - years; // Fraction of a year
      const result = addYears(safeStartDate, years);

      // Add the remaining fraction of a year in months
      const monthsToAdd = Math.floor(remainingYear * 12);
      return addMonths(result, monthsToAdd);
    }
    default:
      return addDays(safeStartDate, position);
  }
};

/**
 * Get the x position of a date in the timeline
 * @param date - The date to get the x position of
 * @param timelineConfig - The timeline configuration
 * @param listWidth - The width of the list
 * @returns The x position of the date
 */
export const getXFromDate = (
  date: Date,
  timelineConfig: TimelineConfig,
  listWidth: number
): number => {
  const { startDate, columnWidth, columnUnit } = timelineConfig;
  let diff: number;

  const safeDate = new Date(date);
  const safeTimelineStartDate = new Date(startDate);

  switch (columnUnit as string) {
    case "hour":
      diff = differenceInDays(safeDate, safeTimelineStartDate) * 24;
      break;
    case "day":
      const daysDiff = differenceInDays(safeDate, safeTimelineStartDate);
      const startHours =
        safeTimelineStartDate.getHours() +
        safeTimelineStartDate.getMinutes() / 60;
      const dateHours = safeDate.getHours() + safeDate.getMinutes() / 60;
      const hoursFraction = (dateHours - startHours) / 24;
      diff = daysDiff + hoursFraction;
      break;
    case "week":
      diff = differenceInWeeks(safeDate, safeTimelineStartDate);
      const extraDays =
        differenceInDays(safeDate, addWeeks(safeTimelineStartDate, diff)) / 7;
      diff += extraDays;
      break;
    case "month":
      diff = differenceInMonths(safeDate, safeTimelineStartDate);
      const daysInMonth = new Date(
        safeDate.getFullYear(),
        safeDate.getMonth() + 1,
        0
      ).getDate();

      const extraMonthDays =
        (safeDate.getDate() - safeTimelineStartDate.getDate()) / daysInMonth;
      diff += extraMonthDays;

      break;
    case "year":
      diff = differenceInYears(safeDate, safeTimelineStartDate);
      // Add month-level precision for years
      const extraMonths =
        differenceInMonths(safeDate, addYears(safeTimelineStartDate, diff)) /
        12;
      diff += extraMonths;
      break;
    default:
      diff = differenceInDays(safeDate, safeTimelineStartDate);
  }
  return diff * columnWidth;
};

export const isDateInRange = (
  date: Date,
  startDate: Date,
  endDate: Date
): boolean => {
  return (
    (isAfter(date, startDate) || isSameDay(date, startDate)) &&
    (isBefore(date, endDate) || isSameDay(date, endDate))
  );
};

export const getDateComparisonFunc = (viewMode: ViewMode) => {
  switch (viewMode) {
    case "day":
      return isSameDay;
    case "week":
      return isSameWeek;
    case "month":
      return isSameMonth;
    case "year":
      return isSameYear;
    default:
      return isSameDay;
  }
};
