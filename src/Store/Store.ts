import { configureStore } from "@reduxjs/toolkit";
import musicReducer from "./Player";
export const store = configureStore({
  reducer: { musicReducer },
});

export type RootState = ReturnType<typeof store.getState>;

export type AppDispatch = typeof store.dispatch;
