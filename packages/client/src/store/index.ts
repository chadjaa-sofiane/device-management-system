import { configureStore, createListenerMiddleware } from "@reduxjs/toolkit";
import devices, { fetchDevicesAsync } from "./devicesSlice";

const listenerMiddleware = createListenerMiddleware();

export const createStore = () =>
  configureStore({
    reducer: {
      devices,
    },
    middleware: (getDefaultMiddleware) =>
      getDefaultMiddleware().concat(listenerMiddleware.middleware),
  });

const store = createStore();

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

listenerMiddleware.startListening.withTypes<RootState, AppDispatch>()({
  predicate: (_, currentState, previousState) => {
    return currentState.devices.page !== previousState.devices.page;
  },
  effect: (_, listenerApi) => {
    listenerApi.dispatch(fetchDevicesAsync());
  },
});

export default store;
