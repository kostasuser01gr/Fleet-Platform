import { useEffect, useState } from 'react';
import { RealtimeService, RealtimeEvent } from '../services/realtimeService';

export function useRealtime<T = unknown>(event: RealtimeEvent, initialValue?: T) {
  const [data, setData] = useState<T | undefined>(initialValue);
  const [isConnected, setIsConnected] = useState(false);

  useEffect(() => {
    const unsubscribe = RealtimeService.subscribe(event, (newData: T) => {
      setData(newData);
    });

    setIsConnected(RealtimeService.isConnected());

    return () => {
      unsubscribe();
    };
  }, [event]);

  return { data, isConnected };
}
