import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";
import { INotifyingState } from "../components/mulayout";

export interface ITaskLog {
  id?: number
  taskId: number
  dateIso: string
  slot: number
}

export interface TaskLogState extends INotifyingState {
  taskLogs: ITaskLog[];
}

const initialState: TaskLogState = {
  taskLogs: [],
  notificationMessage: "",
  notificationIsoDt: new Date(0).toISOString()
};

export const taskLogSlice = createSlice({
  name: "tasks",
  initialState,
  reducers: {
    addTaskLog: (state, action: PayloadAction<ITaskLog>) => {
      const lTaskLogs = state.taskLogs;
      const lNewTask = action.payload;
      lNewTask.id = 0
      if (lTaskLogs.length > 1) {
        lNewTask.id = lTaskLogs[lTaskLogs.length-1].id as number + 1
      }
      lTaskLogs.push(lNewTask);
      state.notificationMessage = "New task created successfuly.";
      state.taskLogs = lTaskLogs;
      state.notificationIsoDt = new Date().toISOString()
    },
    removeTaskLog: (state, action: PayloadAction<number>) => {
      const lTaskLogs = state.taskLogs;
      for (let i=0; i<lTaskLogs.length; i++) {
        if (lTaskLogs[i].id === action.payload) {
          lTaskLogs.splice(i,1);
          state.taskLogs = lTaskLogs;
          state.notificationMessage = "Task removed successfuly."
          return
        }
      }
      state.notificationMessage = "No task found with given id."
      state.notificationIsoDt = new Date().toISOString()
    }
  },
});

export const { addTaskLog, removeTaskLog } = taskLogSlice.actions;

export default taskLogSlice.reducer;
