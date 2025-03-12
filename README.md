## Simple Gantt Component

### Components 

**Gantt** - The main entry for the Gantt chart. This component will have various config props like tasks, Gantt event handlers like click, drag etc., styles and more.  

**ViewSwitcher** – The view mode switcher dropdown to select different view modes like day, weekly, monthly and custom time range 

**TaskList** – The task list that will be present on the left side of the actual gantt chart 

**Timeline** – The timeline component that will render both the labels and the dates (2 rows) 

**TaskBars** – The actual task bars 

**TaskBar** – The individual task bar that will make up a individual task in gantt. The component is also responsible for rendering the icons like attachments, issue etc for a particular task 

 

### Hooks 

**useGanttState** – Has gantt state and gantt actions.  

**Gantt State** - Will hold state for the following - tasks, viewMode,    timelineConfig,   listWidth,    selectedTaskId,   customTimeRange, 

**Gantt Actions** - actions for the above mentioned states. 

**useGanttResponsive** - Manages container width and height along with resize events 

**useGanttDrag** – all mouse events to handle drag for tasks and gantt 

 

 

### Functions 

**getFormattedDate** will return the date format rendered on the timeline header based on the view mode.  

**getHeaderFormattedDate** will return the timeline header for month/year part. 

**getXFromDate** will help calculate the left position from the date provided 

**The DateUtils** file has all the column size, view mode and column unit configuration that can be changed according to requirements 