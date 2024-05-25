import { configureStore, combineSlices } from "@reduxjs/toolkit";

export const createStore = () =>
  configureStore({
    reducer: combineSlices({}),
  });

const store = createStore();

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export default store;
