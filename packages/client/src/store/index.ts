import { configureStore, combineSlices } from "@reduxjs/toolkit";
import devices from "./devicesSlice";

export const createStore = () =>
  configureStore({
    reducer: combineSlices({
      devices,
    }),
  });

const store = createStore();

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export default store;
