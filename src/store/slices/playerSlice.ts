import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface PlayerState {
  id: string;
  name: string;
  level: number;
  experience: number;
  currency: number;
  reputation: number;
  tokens: number;
  isPremium: boolean;
  achievements: string[];
  stats: {
    totalDistance: number;
    totalEarnings: number;
    partsInstalled: number;
    missionsCompleted: number;
  };
}

const initialState: PlayerState = {
  id: 'player-1',
  name: 'Player',
  level: 1,
  experience: 0,
  currency: 10000,
  reputation: 0,
  tokens: 0,
  isPremium: false,
  achievements: [],
  stats: {
    totalDistance: 0,
    totalEarnings: 0,
    partsInstalled: 0,
    missionsCompleted: 0,
  },
};

const playerSlice = createSlice({
  name: 'player',
  initialState,
  reducers: {
    addExperience: (state, action: PayloadAction<number>) => {
      state.experience += action.payload;
      
      // Level up logic
      const requiredXP = state.level * 1000;
      if (state.experience >= requiredXP) {
        state.level += 1;
        state.experience -= requiredXP;
      }
    },
    addCurrency: (state, action: PayloadAction<number>) => {
      state.currency += action.payload;
      state.stats.totalEarnings += action.payload;
    },
    spendCurrency: (state, action: PayloadAction<number>) => {
      if (state.currency >= action.payload) {
        state.currency -= action.payload;
      }
    },
    addReputation: (state, action: PayloadAction<number>) => {
      state.reputation += action.payload;
    },
    addTokens: (state, action: PayloadAction<number>) => {
      state.tokens += action.payload;
    },
    spendTokens: (state, action: PayloadAction<number>) => {
      if (state.tokens >= action.payload) {
        state.tokens -= action.payload;
      }
    },
    unlockAchievement: (state, action: PayloadAction<string>) => {
      if (!state.achievements.includes(action.payload)) {
        state.achievements.push(action.payload);
      }
    },
    setPremium: (state, action: PayloadAction<boolean>) => {
      state.isPremium = action.payload;
    },
    updateStats: (
      state,
      action: PayloadAction<Partial<PlayerState['stats']>>
    ) => {
      state.stats = { ...state.stats, ...action.payload };
    },
    incrementStat: (
      state,
      action: PayloadAction<{ stat: keyof PlayerState['stats']; value: number }>
    ) => {
      state.stats[action.payload.stat] += action.payload.value;
    },
  },
});

export const {
  addExperience,
  addCurrency,
  spendCurrency,
  addReputation,
  addTokens,
  spendTokens,
  unlockAchievement,
  setPremium,
  updateStats,
  incrementStat,
} = playerSlice.actions;

export default playerSlice.reducer;
