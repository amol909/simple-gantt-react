import {
  addDays,
  addMonths,
  addWeeks,
  addYears,
  isToday,
  isWeekend,
} from "date-fns";
import React from "react";
import {
  TimelineConfig,
  getFormattedDate,
  getHeaderFormattedDate,
} from "../../utils/gantt/dateUtils";

interface TimelineProps {
  timelineConfig: TimelineConfig;
  width: number;
  height: number;
  headerHeight: number;
  showWeekends?: boolean;
  showToday?: boolean;
  todayColor?: string;
  weekendColor?: string;
}

export const Timeline: React.FC<TimelineProps> = ({
  timelineConfig,
  width,
  height,
  headerHeight,
  showWeekends = true,
  showToday = true,
  todayColor = "#0043D8",
  weekendColor = "rgba(0, 0, 0, 0.05)",
}) => {
  const { startDate, columnWidth, columnCount, columnUnit, viewMode } =
    timelineConfig;

  const renderTimelineHeader = () => {
    const cells = [];
    let currentDate = new Date(startDate);
    let prevHeaderDate = null;
    let headerCells = [];

    for (let i = 0; i < columnCount; i++) {
      // Determine the current date for this column
      let date;
      switch (columnUnit) {
        case "hour":
          date = addDays(startDate, i / 24);
          break;
        case "day":
          date = addDays(startDate, i);
          break;
        case "week":
          date = addWeeks(startDate, i);
          break;
        case "month":
          date = addMonths(startDate, i);
          break;
        case "year":
          date = addYears(startDate, i);
          break;
        default:
          date = addDays(startDate, i);
      }
      // Format the date for the column
      const formattedDate = getFormattedDate(date, viewMode, columnUnit);
      // Check if we need a new header cell
      const headerDate = getHeaderFormattedDate(date, viewMode);
      if (headerDate !== prevHeaderDate) {
        headerCells.push({
          date,
          text: headerDate,
          startIndex: i,
          endIndex: i,
        });
        prevHeaderDate = headerDate;
      } else if (headerCells.length > 0) {
        // Extend the previous header cell
        headerCells[headerCells.length - 1].endIndex = i;
      }

      // Create the column cell
      cells.push(
        <div
          key={`col-${i}`}
          className="gantt-timeline-column"
          style={{
            position: "absolute",
            left: i * columnWidth,
            width: columnWidth,
            height: height,
            borderRight: "1px solid #e0e0e0",
            backgroundColor:
              showWeekends && isWeekend(date) ? weekendColor : "transparent",
            ...(showToday && isToday(date)
              ? { backgroundColor: todayColor }
              : {}),
          }}
        />
      );

      // Create the column label
      cells.push(
        <div
          key={`label-${i}`}
          className="gantt-timeline-column-label text-xs"
          style={{
            position: "absolute",
            left: i * columnWidth,
            width: columnWidth,
            height: headerHeight / 2,
            textAlign: "center",
            borderRight: "1px solid #e0e0e0",
            borderBottom: "1px solid #e0e0e0",
            //fontSize: "10px",
            overflow: "hidden",
            textOverflow: "ellipsis",
            whiteSpace: "nowrap",
            top: headerHeight / 2,
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            alignItems: "center",
            borderRadius: "5px",
            backgroundColor: isToday(date) ? todayColor : "transparent",
            color: "black",
            wordSpacing: viewMode !== "day" ? columnWidth / 2 : 0,
          }}
        >
          {formattedDate}
        </div>
      );

      currentDate = date;
    }

    // Render header cells (month/year labels)
    const headerElements = headerCells.map((cell, index) => {
      const width = (cell.endIndex - cell.startIndex + 1) * columnWidth;
      return (
        <div
          key={`header-${index}`}
          className="gantt-timeline-header-cell sticky"
          style={{
            position: "absolute",
            left: cell.startIndex * columnWidth,
            width,
            height: headerHeight / 2,
            lineHeight: `${headerHeight / 2}px`,
            textAlign: "center",
            borderRight: "1px solid #e0e0e0",
            borderBottom: "1px solid #e0e0e0",
            fontSize: "14px",
            fontWeight: "bold",
            overflow: "hidden",
            textOverflow: "ellipsis",
            whiteSpace: "nowrap",
            //backgroundColor: "#f8f9fa",
          }}
        >
          {cell.text}
        </div>
      );
    });

    return [...headerElements, ...cells];
  };

  return (
    <div
      className="gantt-timeline"
      style={{
        position: "relative",
        width: `${width}px`,
        height: `${height}px`,
        overflow: "hidden",
      }}
    >
      {renderTimelineHeader()}
    </div>
  );
};
