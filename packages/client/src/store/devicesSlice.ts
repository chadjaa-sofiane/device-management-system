import { fetchDevices } from "@/services/devices";
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";

type Status = "idle" | "loading" | "succeeded" | "failed";

type InitialState = {
  status: Status;
  errors: unknown;
  devices: [];
};

const initialState: InitialState = {
  status: "idle",
  errors: null,
  devices: [],
};

export const fetchDevicesAsync = createAsyncThunk(
  "devices/fetchDevices",
  async (_, { rejectWithValue }) => {
    try {
      const devices = await fetchDevices();
      return devices;
    } catch (error) {
      return rejectWithValue(error);
    }
  },
);

const devicesSlice = createSlice({
  name: "devices",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(fetchDevicesAsync.fulfilled, (state, action) => {
      state.status = "succeeded";
      state.devices = action.payload;
    });
    builder.addCase(fetchDevicesAsync.rejected, (state, action) => {
      state.status = "failed";
      if (action.payload) state.errors = action.payload;
    });
    builder.addCase(fetchDevicesAsync.pending, (state) => {
      state.status = "loading";
    });
  },
});

export default devicesSlice.reducer;
