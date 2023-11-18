import { Action, Dispatch, configureStore } from "@reduxjs/toolkit";
import pageReducer from "./slicePage";

const localStorageMiddleware = ({ getState }: { getState: () => any }) => {
  return (next: Dispatch) => (action: Action) => {
    const result = next(action);
    localStorage.setItem("applicationState", JSON.stringify(getState()));
    return result;
  };
};

const reHydrateStore = () => {
  let strJson = "{}";

  if (typeof window !== "undefined") {
    strJson = localStorage.getItem("applicationState") || "{}";
  }
  return JSON.parse(strJson);
};

export const store = configureStore({
  reducer: {
    page: pageReducer,
  },
  preloadedState: reHydrateStore(),
  middleware: (getDefaultMiddleware: any) =>
    getDefaultMiddleware().concat(localStorageMiddleware),
});

// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>;
// Inferred type: {posts: PostsState, comments: CommentsState, users: UsersState}
export type AppDispatch = typeof store.dispatch;
