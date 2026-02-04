import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { ServiceCooperator } from '../../types/inventory';
import { mockCooperators } from '../../data/mockCooperators';

interface CooperatorState {
  cooperators: ServiceCooperator[];
  loading: boolean;
  error: string | null;
  filter: {
    service: string;
    status: 'all' | 'unlocked' | 'locked';
    sortBy: 'name' | 'price' | 'distance' | 'rating';
  };
}

const initialState: CooperatorState = {
  cooperators: mockCooperators,
  loading: false,
  error: null,
  filter: {
    service: 'all',
    status: 'all',
    sortBy: 'name',
  },
};

export const fetchCooperators = createAsyncThunk(
  'cooperators/fetchCooperators',
  async () => {
    return new Promise<ServiceCooperator[]>((resolve) => {
      setTimeout(() => resolve(mockCooperators), 500);
    });
  }
);

export const unlockCooperator = createAsyncThunk(
  'cooperators/unlock',
  async (cooperatorId: string, { rejectWithValue }) => {
    try {
      await new Promise((resolve) => setTimeout(resolve, 300));
      return cooperatorId;
    } catch (error) {
      return rejectWithValue('Failed to unlock cooperator');
    }
  }
);

const cooperatorSlice = createSlice({
  name: 'cooperators',
  initialState,
  reducers: {
    setFilter: (state, action: PayloadAction<Partial<CooperatorState['filter']>>) => {
      state.filter = { ...state.filter, ...action.payload };
    },
    resetFilter: (state) => {
      state.filter = initialState.filter;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchCooperators.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchCooperators.fulfilled, (state, action) => {
        state.loading = false;
        state.cooperators = action.payload;
      })
      .addCase(fetchCooperators.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to fetch cooperators';
      })
      .addCase(unlockCooperator.fulfilled, (state, action) => {
        const cooperator = state.cooperators.find((c) => c.id === action.payload);
        if (cooperator) {
          cooperator.unlocked = true;
        }
      });
  },
});

export const { setFilter, resetFilter } =
  cooperatorSlice.actions;

export default cooperatorSlice.reducer;
