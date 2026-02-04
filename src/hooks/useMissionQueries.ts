import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Mission } from '../types/missions';
import MissionService from '../services/missionService';

const fetchMissions = async (playerLevel: number): Promise<Mission[]> => {
  return MissionService.generateDailyMissions(playerLevel);
};

const startMission = async (missionId: string): Promise<boolean> => {
  return MissionService.startMission(missionId);
};

const completeMission = async (missionId: string): Promise<Mission['rewards'] | null> => {
  return MissionService.completeMission(missionId);
};

export const useMissions = (playerLevel: number) => {
  return useQuery({
    queryKey: ['missions', playerLevel],
    queryFn: () => fetchMissions(playerLevel),
  });
};

export const useStartMission = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: startMission,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['missions'] });
    },
  });
};

export const useCompleteMission = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: completeMission,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['missions'] });
    },
  });
};
