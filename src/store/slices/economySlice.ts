import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { MarketTrend } from '../../types/advancedInventory';

interface EconomyState {
  marketTrends: Record<string, MarketTrend>;
  investmentOpportunities: string[];
  seasonalMultiplier: number;
  lastUpdate: Date;
}

const initialState: EconomyState = {
  marketTrends: {},
  investmentOpportunities: [],
  seasonalMultiplier: 1.0,
  lastUpdate: new Date(),
};

const economySlice = createSlice({
  name: 'economy',
  initialState,
  reducers: {
    updateMarketTrends: (
      state,
      action: PayloadAction<Record<string, MarketTrend>>
    ) => {
      state.marketTrends = action.payload;
      state.lastUpdate = new Date();
    },
    updateMarketTrend: (
      state,
      action: PayloadAction<{ partType: string; trend: MarketTrend }>
    ) => {
      state.marketTrends[action.payload.partType] = action.payload.trend;
    },
    setInvestmentOpportunities: (state, action: PayloadAction<string[]>) => {
      state.investmentOpportunities = action.payload;
    },
    setSeasonalMultiplier: (state, action: PayloadAction<number>) => {
      state.seasonalMultiplier = action.payload;
    },
  },
});

export const {
  updateMarketTrends,
  updateMarketTrend,
  setInvestmentOpportunities,
  setSeasonalMultiplier,
} = economySlice.actions;

export default economySlice.reducer;
