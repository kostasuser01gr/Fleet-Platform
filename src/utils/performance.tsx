import React, { Suspense, lazy, useState, useEffect, useMemo, useCallback } from 'react';
import { LoadingSpinner } from '../components/ui/loading-spinner';

// Lazy load heavy components for code splitting
const EnhancedDashboard = lazy(() => import('../components/EnhancedDashboard').then(m => ({ default: m.EnhancedDashboard })));
const AnalyticsDashboard = lazy(() => import('../components/AnalyticsDashboard').then(m => ({ default: m.AnalyticsDashboard })));
const AdvancedAnalytics = lazy(() => import('../components/AdvancedAnalytics').then(m => ({ default: m.AdvancedAnalytics })));
const VehicleAssemblyGame = lazy(() => import('../components/VehicleAssemblyGame').then(m => ({ default: m.VehicleAssemblyGame })));
const GPSPartnerFinder = lazy(() => import('../components/GPSPartnerFinder').then(m => ({ default: m.GPSPartnerFinder })));
const ChatSystem = lazy(() => import('../components/ChatSystem').then(m => ({ default: m.ChatSystem })));
const QuestSystem = lazy(() => import('../components/QuestSystem').then(m => ({ default: m.QuestSystem })));
const AchievementGallery = lazy(() => import('../components/AchievementGallery').then(m => ({ default: m.AchievementGallery })));
const Leaderboard = lazy(() => import('../components/Leaderboard').then(m => ({ default: m.Leaderboard })));
const SkillTree = lazy(() => import('../components/SkillTree').then(m => ({ default: m.SkillTree })));

interface LazyComponentWrapperProps {
  children: React.ReactNode;
  fallback?: React.ReactNode;
}

export function LazyComponentWrapper({ children, fallback }: LazyComponentWrapperProps) {
  return (
    <Suspense fallback={fallback || (
      <div className="flex items-center justify-center min-h-[400px]">
        <LoadingSpinner size="lg" />
      </div>
    )}>
      {children}
    </Suspense>
  );
}

// Performance monitoring hook
export function usePerformance(componentName: string) {
  useEffect(() => {
    const startTime = performance.now();
    
    return () => {
      const endTime = performance.now();
      const renderTime = endTime - startTime;
      
      if (renderTime > 100) {
        console.warn(`${componentName} took ${renderTime.toFixed(2)}ms to render`);
      }
    };
  }, [componentName]);
}

// Debounce hook for search and input optimization
export function useDebounce<T>(value: T, delay: number = 300): T {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);

  return debouncedValue;
}

// Throttle hook for scroll and resize events
export function useThrottle<T>(value: T, limit: number = 200): T {
  const [throttledValue, setThrottledValue] = useState<T>(value);
  const lastRan = React.useRef(Date.now());

  useEffect(() => {
    const handler = setTimeout(() => {
      if (Date.now() - lastRan.current >= limit) {
        setThrottledValue(value);
        lastRan.current = Date.now();
      }
    }, limit - (Date.now() - lastRan.current));

    return () => {
      clearTimeout(handler);
    };
  }, [value, limit]);

  return throttledValue;
}

// Intersection observer hook for lazy loading
export function useIntersectionObserver(
  ref: React.RefObject<Element>,
  options: IntersectionObserverInit = {}
): boolean {
  const [isIntersecting, setIsIntersecting] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(([entry]) => {
      setIsIntersecting(entry.isIntersecting);
    }, options);

    const currentRef = ref.current;
    if (currentRef) {
      observer.observe(currentRef);
    }

    return () => {
      if (currentRef) {
        observer.unobserve(currentRef);
      }
    };
  }, [ref, options]);

  return isIntersecting;
}

// Memoized components export
export const LazyComponents = {
  EnhancedDashboard,
  AnalyticsDashboard,
  AdvancedAnalytics,
  VehicleAssemblyGame,
  GPSPartnerFinder,
  ChatSystem,
  QuestSystem,
  AchievementGallery,
  Leaderboard,
  SkillTree,
};
