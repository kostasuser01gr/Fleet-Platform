import { useState, useEffect } from 'react';
import { Integration } from '../types/integration';
import { APIService } from '../services/apiService';

export function useIntegration(integrationId?: string) {
  const [integrations, setIntegrations] = useState<Integration[]>([]);
  const [selectedIntegration, setSelectedIntegration] = useState<Integration | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadIntegrations();
  }, []);

  useEffect(() => {
    if (integrationId) {
      const integration = integrations.find(i => i.id === integrationId);
      setSelectedIntegration(integration || null);
    }
  }, [integrationId, integrations]);

  const loadIntegrations = async () => {
    setIsLoading(true);
    setError(null);
    
    try {
      const data = await APIService.get<Integration[]>('/integrations');
      setIntegrations(data);
    } catch (err: unknown) {
      const error = err as { message?: string };
      setError(error.message || 'Failed to load integrations');
      // Use mock data
      setIntegrations([
        {
          id: 'int1',
          name: 'Google Maps',
          type: 'maps',
          provider: 'Google',
          status: 'active',
          config: {},
          credentials: { encrypted: true, fields: ['apiKey'] },
          lastSync: new Date(),
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  const connectIntegration = async (integration: Omit<Integration, 'id' | 'status' | 'lastSync'>) => {
    try {
      const created = await APIService.post<Integration>('/integrations', integration);
      setIntegrations([...integrations, created]);
      return created;
    } catch (err: unknown) {
      const error = err as { message?: string };
      throw new Error(error.message || 'Failed to connect integration');
    }
  };

  const updateIntegration = async (id: string, updates: Partial<Integration>) => {
    try {
      const updated = await APIService.put<Integration>(`/integrations/${id}`, updates);
      setIntegrations(integrations.map(i => i.id === id ? updated : i));
      return updated;
    } catch (err: unknown) {
      const error = err as { message?: string };
      throw new Error(error.message || 'Failed to update integration');
    }
  };

  const disconnectIntegration = async (id: string) => {
    try {
      await APIService.delete(`/integrations/${id}`);
      setIntegrations(integrations.filter(i => i.id !== id));
    } catch (err: unknown) {
      const error = err as { message?: string };
      throw new Error(error.message || 'Failed to disconnect integration');
    }
  };

  const testIntegration = async (id: string) => {
    try {
      const result = await APIService.post(`/integrations/${id}/test`, {});
      return result;
    } catch (err: unknown) {
      const error = err as { message?: string };
      throw new Error(error.message || 'Integration test failed');
    }
  };

  return {
    integrations,
    selectedIntegration,
    isLoading,
    error,
    connectIntegration,
    updateIntegration,
    disconnectIntegration,
    testIntegration,
    refresh: loadIntegrations,
  };
}
