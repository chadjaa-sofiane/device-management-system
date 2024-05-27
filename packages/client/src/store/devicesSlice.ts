import {
  extractErrorsFromIssues,
  extractMongooseErrors,
  isMongooseError,
  isZodError,
} from "@/lib/utils";
import {
  createDevice,
  fetchDevices,
  deleteDevice,
  type CreateDeviceInputs,
  type CustomError,
  type Device,
} from "@/services/devices";
import { PayloadAction, createAsyncThunk, createSlice } from "@reduxjs/toolkit";

type Status = "idle" | "loading" | "succeeded" | "failed";

type InitialState = {
  status: Status;
  errors: unknown;
  page: number;
  devices: Device[];
  totalCount: number;
  createDevice: {
    status: Status;
    errors: unknown;
  };
};

const initialState: InitialState = {
  status: "idle",
  errors: null,
  page: 1,
  devices: [],
  totalCount: 0,
  createDevice: {
    status: "idle",
    errors: null,
  },
};

export const fetchDevicesAsync = createAsyncThunk(
  "devices/fetchDevices",
  async (_, { rejectWithValue, getState }) => {
    try {
      const { devices } = getState() as { devices: InitialState };
      const result = await fetchDevices({ page: devices.page, limit: 5 });
      return result;
    } catch (error) {
      return rejectWithValue(error);
    }
  },
);

export const createDeviceAsync = createAsyncThunk(
  "devices/createDevice",
  async (inputs: CreateDeviceInputs, { rejectWithValue }) => {
    try {
      const result = await createDevice(inputs);
      return result;
    } catch (error) {
      return rejectWithValue(error);
    }
  },
);

export const deleteDeviceAsync = createAsyncThunk(
  "devices/deleteDevice",
  async (id: string, { rejectWithValue }) => {
    try {
      await deleteDevice(id);
    } catch (error) {
      return rejectWithValue(error);
    }
  },
);

const devicesSlice = createSlice({
  name: "devices",
  initialState,
  reducers: {
    resetCreateDevice: (state) => {
      state.createDevice.status = "idle";
      state.createDevice.errors = null;
    },
    setPage: (state, action: PayloadAction<number>) => {
      if (action.payload > 0 && action.payload <= state.totalCount)
        state.page = action.payload;
    },
  },
  extraReducers: (builder) => {
    // Fetch Devices
    builder.addCase(fetchDevicesAsync.fulfilled, (state, action) => {
      state.status = "succeeded";
      state.devices = action.payload.data;
      state.totalCount = action.payload.totalCount;
    });
    builder.addCase(fetchDevicesAsync.rejected, (state, action) => {
      state.status = "failed";
      if (action.payload) state.errors = action.payload;
    });
    builder.addCase(fetchDevicesAsync.pending, (state) => {
      state.status = "loading";
    });

    // create device
    builder.addCase(createDeviceAsync.fulfilled, (state, action) => {
      state.createDevice.status = "succeeded";
      const newDevice = action.payload.data;
      state.devices = [...state.devices, newDevice];
    });
    builder.addCase(createDeviceAsync.rejected, (state, action) => {
      const { payload } = action as PayloadAction<CustomError>;
      const { error } = payload;

      if (isZodError(error)) {
        state.createDevice.errors = extractErrorsFromIssues(error.issues);
      }
      console.log("test: ", isMongooseError(error));
      if (isMongooseError(error)) {
        console.log("mongoose error", extractMongooseErrors(error));
        state.createDevice.errors = extractMongooseErrors(error);
      }

      state.createDevice.status = "failed";
    });

    // delete device
    builder.addCase(deleteDeviceAsync.fulfilled, (state, action) => {
      state.devices = state.devices.filter(
        (device) => device._id !== action.meta.arg,
      );
    });
  },
});
export const { resetCreateDevice, setPage } = devicesSlice.actions;
export default devicesSlice.reducer;
