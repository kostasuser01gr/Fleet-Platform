import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Vehicle } from '../types/vehicle';
import { VehiclePart } from '../types/inventory';
import { mockVehicles } from '../data/mockVehicles';

const fetchVehicles = async (): Promise<Vehicle[]> => {
  await new Promise((resolve) => setTimeout(resolve, 500));
  return mockVehicles;
};

const fetchVehicle = async (id: string): Promise<Vehicle> => {
  await new Promise((resolve) => setTimeout(resolve, 300));
  const vehicle = mockVehicles.find((v) => v.id === id);
  if (!vehicle) throw new Error('Vehicle not found');
  return vehicle;
};

const installPart = async ({
  vehicleId,
  part,
}: {
  vehicleId: string;
  part: VehiclePart;
}): Promise<Vehicle> => {
  await new Promise((resolve) => setTimeout(resolve, 300));
  const vehicle = mockVehicles.find((v) => v.id === vehicleId);
  if (!vehicle) throw new Error('Vehicle not found');
  return vehicle;
};

const uninstallPart = async ({
  vehicleId,
  partId,
}: {
  vehicleId: string;
  partId: string;
}): Promise<Vehicle> => {
  await new Promise((resolve) => setTimeout(resolve, 300));
  const vehicle = mockVehicles.find((v) => v.id === vehicleId);
  if (!vehicle) throw new Error('Vehicle not found');
  return vehicle;
};

export const useVehicles = () => {
  return useQuery({
    queryKey: ['vehicles'],
    queryFn: fetchVehicles,
  });
};

export const useVehicle = (id: string) => {
  return useQuery({
    queryKey: ['vehicles', id],
    queryFn: () => fetchVehicle(id),
    enabled: !!id,
  });
};

export const useInstallPart = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: installPart,
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['vehicles'] });
      queryClient.invalidateQueries({ queryKey: ['vehicles', variables.vehicleId] });
    },
  });
};

export const useUninstallPart = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: uninstallPart,
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['vehicles'] });
      queryClient.invalidateQueries({ queryKey: ['vehicles', variables.vehicleId] });
    },
  });
};
