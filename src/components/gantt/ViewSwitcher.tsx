import React from "react";
import { ViewMode } from "../../utils/gantt/types";

interface ViewSwitcherProps {
  viewMode: ViewMode;
  onViewModeChange: (viewMode: ViewMode) => void;
  customTimeRange?: {
    startDate: Date;
    endDate: Date;
  };
  onCustomTimeRangeChange?: (range: { startDate: Date; endDate: Date }) => void;
}

export const ViewSwitcher: React.FC<ViewSwitcherProps> = ({
  viewMode,
  onViewModeChange,
  customTimeRange,
  onCustomTimeRangeChange,
}) => {
  const handleViewModeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newViewMode = e.target.value as ViewMode;
    onViewModeChange(newViewMode);
  };

  const handleStartDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (onCustomTimeRangeChange && customTimeRange) {
      onCustomTimeRangeChange({
        startDate: new Date(e.target.value),
        endDate: customTimeRange.endDate,
      });
    }
  };

  const handleEndDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (onCustomTimeRangeChange && customTimeRange) {
      onCustomTimeRangeChange({
        startDate: customTimeRange.startDate,
        endDate: new Date(e.target.value),
      });
    }
  };

  return (
    <div
      className="gantt-view-switcher"
      style={{
        display: "flex",
        alignItems: "center",
        gap: "10px",
        padding: "8px",
        borderBottom: "1px solid #e0e0e0",
      }}
    >
      <label htmlFor="view-mode">View Mode:</label>
      <select
        id="view-mode"
        value={viewMode}
        onChange={handleViewModeChange}
        style={{
          padding: "4px 8px",
          borderRadius: "4px",
          border: "1px solid #ccc",
        }}
      >
        <option value="day">Day</option>
        <option value="week">Week</option>
        <option value="month">Month</option>
        <option value="year">Year</option>
        <option value="custom">Custom</option>
      </select>

      {viewMode === "custom" && (
        <>
          <label htmlFor="start-date">Start Date:</label>
          <input
            id="start-date"
            type="date"
            value={customTimeRange?.startDate.toISOString().split("T")[0]}
            onChange={handleStartDateChange}
            style={{
              padding: "4px 8px",
              borderRadius: "4px",
              border: "1px solid #ccc",
            }}
          />

          <label htmlFor="end-date">End Date:</label>
          <input
            id="end-date"
            type="date"
            value={customTimeRange?.endDate.toISOString().split("T")[0]}
            onChange={handleEndDateChange}
            style={{
              padding: "4px 8px",
              borderRadius: "4px",
              border: "1px solid #ccc",
            }}
          />
        </>
      )}
    </div>
  );
};
