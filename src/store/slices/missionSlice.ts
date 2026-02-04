import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { Mission, Campaign, DailyChallenge } from '../../types/missions';
import MissionService from '../../services/missionService';

interface MissionState {
  missions: Mission[];
  activeMissions: Mission[];
  completedMissions: Mission[];
  campaigns: Campaign[];
  dailyChallenges: DailyChallenge[];
  loading: boolean;
  error: string | null;
}

const initialState: MissionState = {
  missions: [],
  activeMissions: [],
  completedMissions: [],
  campaigns: [],
  dailyChallenges: [],
  loading: false,
  error: null,
};

export const generateDailyMissions = createAsyncThunk(
  'missions/generateDaily',
  async (playerLevel: number) => {
    return MissionService.generateDailyMissions(playerLevel);
  }
);

export const generateDailyChallenges = createAsyncThunk(
  'missions/generateChallenges',
  async () => {
    return MissionService.generateDailyChallenges(3);
  }
);

const missionSlice = createSlice({
  name: 'missions',
  initialState,
  reducers: {
    startMission: (state, action: PayloadAction<string>) => {
      const mission = state.missions.find((m) => m.id === action.payload);
      if (mission && mission.status === 'available') {
        mission.status = 'active';
        mission.startedAt = new Date();
        state.activeMissions.push(mission);
      }
    },
    updateMissionProgress: (
      state,
      action: PayloadAction<{ missionId: string; progress: number }>
    ) => {
      const mission = state.activeMissions.find(
        (m) => m.id === action.payload.missionId
      );
      if (mission) {
        mission.progress = action.payload.progress;
        
        if (mission.progress >= 100) {
          mission.status = 'completed';
          mission.completedAt = new Date();
          state.completedMissions.push(mission);
          state.activeMissions = state.activeMissions.filter(
            (m) => m.id !== mission.id
          );
        }
      }
    },
    completeMission: (state, action: PayloadAction<string>) => {
      const mission = state.activeMissions.find((m) => m.id === action.payload);
      if (mission) {
        mission.status = 'completed';
        mission.completedAt = new Date();
        state.completedMissions.push(mission);
        state.activeMissions = state.activeMissions.filter(
          (m) => m.id !== mission.id
        );
      }
    },
    abandonMission: (state, action: PayloadAction<string>) => {
      state.activeMissions = state.activeMissions.filter(
        (m) => m.id !== action.payload
      );
      const mission = state.missions.find((m) => m.id === action.payload);
      if (mission) {
        mission.status = 'available';
        mission.progress = 0;
      }
    },
    addCampaign: (state, action: PayloadAction<Campaign>) => {
      state.campaigns.push(action.payload);
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(generateDailyMissions.pending, (state) => {
        state.loading = true;
      })
      .addCase(generateDailyMissions.fulfilled, (state, action) => {
        state.loading = false;
        state.missions = action.payload;
      })
      .addCase(generateDailyMissions.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to generate missions';
      })
      .addCase(generateDailyChallenges.fulfilled, (state, action) => {
        state.dailyChallenges = action.payload;
      });
  },
});

export const {
  startMission,
  updateMissionProgress,
  completeMission,
  abandonMission,
  addCampaign,
} = missionSlice.actions;

export default missionSlice.reducer;
