import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { Vehicle } from '../../types/vehicle';
import { VehiclePart } from '../../types/inventory';
import { mockVehicles } from '../../data/mockVehicles';

interface VehicleState {
  vehicles: Vehicle[];
  selectedVehicle: Vehicle | null;
  loading: boolean;
  error: string | null;
}

const initialState: VehicleState = {
  vehicles: mockVehicles,
  selectedVehicle: null,
  loading: false,
  error: null,
};

export const fetchVehicles = createAsyncThunk('vehicles/fetchVehicles', async () => {
  return new Promise<Vehicle[]>((resolve) => {
    setTimeout(() => resolve(mockVehicles), 500);
  });
});

export const installPartOnVehicle = createAsyncThunk(
  'vehicles/installPart',
  async (
    { vehicleId, part }: { vehicleId: string; part: VehiclePart },
    { rejectWithValue }
  ) => {
    try {
      await new Promise((resolve) => setTimeout(resolve, 300));
      return { vehicleId, part };
    } catch (error) {
      return rejectWithValue('Failed to install part');
    }
  }
);

const vehicleSlice = createSlice({
  name: 'vehicles',
  initialState,
  reducers: {
    selectVehicle: (state, action: PayloadAction<string>) => {
      state.selectedVehicle =
        state.vehicles.find((v) => v.id === action.payload) || null;
    },
    addVehicle: (state, action: PayloadAction<Vehicle>) => {
      state.vehicles.push(action.payload);
    },
    removeVehicle: (state, action: PayloadAction<string>) => {
      state.vehicles = state.vehicles.filter((v) => v.id !== action.payload);
    },
    updateVehicleStats: (
      state,
      action: PayloadAction<{ vehicleId: string; stats: Partial<Vehicle['stats']> }>
    ) => {
      const vehicle = state.vehicles.find((v) => v.id === action.payload.vehicleId);
      if (vehicle) {
        vehicle.stats = { ...vehicle.stats, ...action.payload.stats };
      }
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchVehicles.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchVehicles.fulfilled, (state, action) => {
        state.loading = false;
        state.vehicles = action.payload;
      })
      .addCase(fetchVehicles.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to fetch vehicles';
      })
      .addCase(installPartOnVehicle.fulfilled, (state, action) => {
        const vehicle = state.vehicles.find((v) => v.id === action.payload.vehicleId);
        if (vehicle) {
          // Logic to install part on vehicle
          const { part } = action.payload;
          // Add the part to vehicle's installed parts
          // This would depend on your Vehicle type structure
        }
      });
  },
});

export const { selectVehicle, addVehicle, removeVehicle, updateVehicleStats } =
  vehicleSlice.actions;

export default vehicleSlice.reducer;
