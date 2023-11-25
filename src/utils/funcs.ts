import { addDays, endOfDay, getDay, startOfDay } from "date-fns";
import { ITaskLog } from "../redux/sliceTaskLogs";
import { ITask } from "../redux/sliceTasks";

export interface ITaskAnalytics {
  task: ITask;
  completed: number;
  total: number;
  pct: number;
  dateIso: string;
}

export function calculateSlot(dt: Date) {
    let slotId = 0;
  for (let i = 0; i < 24; i++) {
    if (dt.getHours() === i) {
      const mins = dt.getMinutes();
      slotId = i * 3;
      if (mins > 39) {
        slotId += 2;
      } else if (mins > 19) {
        slotId += 1;
      }
      break;
    }
  }
  return slotId;
}

export function getCurrentSlot(targetDate: Date) {
  const now = new Date();
  if (targetDate < startOfDay(now)) {
    return 24*3+1;
  }
  if (targetDate > endOfDay(now)) {
    return 0;
  }
  return calculateSlot(now);
}

export function convertSlotToTimeString(slotId: number) {
  const hour = Math.floor(slotId / 3);
  const minute = (slotId - hour * 3) * 20;
  const timeString = `${String(hour).padStart(2, "0")}:${String(
    minute
  ).padStart(2, "0")}`;
  return timeString;
}

export function getPossibleTasks(tasks: ITask[], targetDate: Date) {
  const targetIsoDate = targetDate.toISOString();
  return tasks.filter(
    (e) =>
      e.startIsoDate <= targetIsoDate && e.days.includes(getDay(targetDate))
  );
}

export function getPossibleDates(task: ITask) {
    const possibleDays = [];
    let pivotDate = new Date(task.startIsoDate);
    while (possibleDays.length < 30) {
        const weekDay = getDay(pivotDate);
        if (task.days.includes(weekDay)) {
            possibleDays.push(pivotDate.toISOString());
        }
        pivotDate = addDays(pivotDate, 1)
    }
    return possibleDays;
}

export function calculateDailyTaskAnalytics(
  tasks: ITask[],
  taskLogs: ITaskLog[],
  targetDate: Date
) {
  const possibleTasks = getPossibleTasks(tasks, targetDate);
  const targetIsoDate = targetDate.toISOString();
  const dailyTaskLogs = taskLogs.filter((e) => e.dateIso === targetIsoDate);

  const taskAnalyticsList = [] as ITaskAnalytics[];
  for (let i = 0; i < possibleTasks.length; i++) {
    const completed =
      dailyTaskLogs.filter((e) => e.taskId === possibleTasks[i].id).length * 20;
    const total = possibleTasks[i].duration;
    taskAnalyticsList.push({
      task: possibleTasks[i],
      completed,
      total,
      pct: Math.floor(completed/total*100),
      dateIso: targetDate.toISOString()
    });
  }

  return taskAnalyticsList;
}
