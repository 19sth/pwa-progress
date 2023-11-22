import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";
import { INotifyingState } from "../components/mulayout";

export interface ITask {
  id?: number
  name: string
  days: number[]
  duration: number
  color: string
  startIsoDate: string
}

export interface TasksState extends INotifyingState {
  tasks: ITask[];
}

const initialState: TasksState = {
  tasks: [],
  notificationMessage: "",
  notificationIsoDt: new Date(0).toISOString()
};

export const tasksSlice = createSlice({
  name: "tasks",
  initialState,
  reducers: {
    addTask: (state, action: PayloadAction<ITask>) => {
      const lTasks = state.tasks;
      const lNewTask = action.payload;
      lNewTask.id = 0
      if (lTasks.length > 0) {
        lNewTask.id = lTasks[lTasks.length-1].id as number + 1
      }
      lTasks.push(lNewTask);
      state.notificationMessage = "New task created successfuly.";
      state.tasks = lTasks;
      state.notificationIsoDt = new Date().toISOString()
    },
    removeTask: (state, action: PayloadAction<number>) => {
      const lTasks = state.tasks;
      for (let i=0; i<lTasks.length; i++) {
        if (lTasks[i].id === action.payload) {
          lTasks.splice(i,1);
          state.tasks = lTasks;
          state.notificationMessage = "Task removed successfuly."
          return
        }
      }
      state.notificationMessage = "No task found with given id."
      state.notificationIsoDt = new Date().toISOString()
    }
  },
});

export const { addTask, removeTask } = tasksSlice.actions;

export default tasksSlice.reducer;
