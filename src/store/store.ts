import { configureStore } from '@reduxjs/toolkit';
import inventoryReducer from './slices/inventorySlice';
import vehicleReducer from './slices/vehicleSlice';
import cooperatorReducer from './slices/cooperatorSlice';
import playerReducer from './slices/playerSlice';
import missionReducer from './slices/missionSlice';
import economyReducer from './slices/economySlice';

export const store = configureStore({
  reducer: {
    inventory: inventoryReducer,
    vehicles: vehicleReducer,
    cooperators: cooperatorReducer,
    player: playerReducer,
    missions: missionReducer,
    economy: economyReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        // Ignore these action types
        ignoredActions: ['economy/updateMarketTrends', 'missions/generateDaily'],
        // Ignore these field paths in all actions
        ignoredActionPaths: ['payload.timestamp', 'meta.arg', 'meta.baseQueryMeta'],
        // Ignore these paths in the state
        ignoredPaths: ['economy.lastUpdate', 'missions.activeMissions.0.startedAt'],
      },
    }),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
