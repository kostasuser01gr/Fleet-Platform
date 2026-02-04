import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { VehiclePart } from '../types/inventory';
import { mockParts } from '../data/mockInventory';

// Simulated API calls
const fetchParts = async (): Promise<VehiclePart[]> => {
  await new Promise((resolve) => setTimeout(resolve, 500));
  return mockParts;
};

const purchasePart = async (partId: string): Promise<VehiclePart> => {
  await new Promise((resolve) => setTimeout(resolve, 300));
  const part = mockParts.find((p) => p.id === partId);
  if (!part) throw new Error('Part not found');
  return part;
};

const sellPart = async (partId: string): Promise<void> => {
  await new Promise((resolve) => setTimeout(resolve, 300));
};

// Custom hooks
export const useInventory = () => {
  return useQuery({
    queryKey: ['inventory'],
    queryFn: fetchParts,
  });
};

export const usePurchasePart = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: purchasePart,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['inventory'] });
    },
  });
};

export const useSellPart = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: sellPart,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['inventory'] });
    },
  });
};
