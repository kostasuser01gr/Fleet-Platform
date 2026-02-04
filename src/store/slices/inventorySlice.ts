import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { VehiclePart } from '../../types/inventory';
import { mockParts } from '../../data/mockInventory';

interface InventoryState {
  parts: VehiclePart[];
  loading: boolean;
  error: string | null;
  filter: {
    type: string;
    rarity: string;
    minPrice: number;
    maxPrice: number;
  };
}

const initialState: InventoryState = {
  parts: mockParts,
  loading: false,
  error: null,
  filter: {
    type: 'all',
    rarity: 'all',
    minPrice: 0,
    maxPrice: 100000,
  },
};

// Async thunks
export const fetchParts = createAsyncThunk('inventory/fetchParts', async () => {
  // Simulate API call
  return new Promise<VehiclePart[]>((resolve) => {
    setTimeout(() => resolve(mockParts), 500);
  });
});

export const purchasePart = createAsyncThunk(
  'inventory/purchasePart',
  async (partId: string, { rejectWithValue }) => {
    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 300));
      return partId;
    } catch (error) {
      return rejectWithValue('Failed to purchase part');
    }
  }
);

const inventorySlice = createSlice({
  name: 'inventory',
  initialState,
  reducers: {
    addPart: (state, action: PayloadAction<VehiclePart>) => {
      state.parts.push(action.payload);
    },
    removePart: (state, action: PayloadAction<string>) => {
      state.parts = state.parts.filter((p) => p.id !== action.payload);
    },
    updatePartCondition: (
      state,
      action: PayloadAction<{ partId: string; condition: number }>
    ) => {
      const part = state.parts.find((p) => p.id === action.payload.partId);
      if (part) {
        part.condition = action.payload.condition;
      }
    },
    setFilter: (state, action: PayloadAction<Partial<InventoryState['filter']>>) => {
      state.filter = { ...state.filter, ...action.payload };
    },
    resetFilter: (state) => {
      state.filter = initialState.filter;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchParts.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchParts.fulfilled, (state, action) => {
        state.loading = false;
        state.parts = action.payload;
      })
      .addCase(fetchParts.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to fetch parts';
      })
      .addCase(purchasePart.fulfilled, (state, action) => {
        const part = state.parts.find((p) => p.id === action.payload);
        if (part) {
          part.installed = true;
        }
      });
  },
});

export const { addPart, removePart, updatePartCondition, setFilter, resetFilter } =
  inventorySlice.actions;

export default inventorySlice.reducer;
