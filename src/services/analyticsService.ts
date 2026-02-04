import { AnalyticsEvent, PerformanceMetrics } from '../types/advancedInventory';

export class AnalyticsService {
  private static events: AnalyticsEvent[] = [];
  private static metrics: PerformanceMetrics = {
    fps: 60,
    loadTime: 0,
    memoryUsage: 0,
    apiLatency: 0,
    renderTime: 0,
  };
  private static sessionStart: Date = new Date();

  static initialize(): void {
    this.sessionStart = new Date();
    this.startPerformanceMonitoring();
  }

  static trackEvent(
    action: string,
    category: AnalyticsEvent['category'],
    label?: string,
    value?: number
  ): void {
    const event: AnalyticsEvent = {
      action,
      timestamp: new Date(),
      category,
      userId: 'current-user',
      sessionId: this.getSessionId(),
      label,
      value,
    };

    this.events.push(event);

    // Keep only last 1000 events
    if (this.events.length > 1000) {
      this.events = this.events.slice(-1000);
    }
  }

  static trackPageView(pageName: string): void {
    this.trackEvent('page_view', 'navigation', pageName);
  }

  static trackPurchase(itemName: string, amount: number): void {
    this.trackEvent('purchase', 'transaction', itemName, amount);
  }

  static trackMissionComplete(missionId: string, reward: number): void {
    this.trackEvent('mission_complete', 'gameplay', missionId, reward);
  }

  static trackPartInstall(partId: string, vehicleId: string): void {
    this.trackEvent('part_install', 'gameplay', `${partId}:${vehicleId}`);
  }

  static trackError(error: Error, context?: string): void {
    const errorLabel = context ? `${context}: ${error.message}` : error.message;
    this.trackEvent('error', 'system', errorLabel);
  }

  static getEvents(
    category?: AnalyticsEvent['category'],
    limit: number = 100
  ): AnalyticsEvent[] {
    let filtered = this.events;

    if (category) {
      filtered = filtered.filter(e => e.category === category);
    }

    return filtered.slice(-limit);
  }

  static getEventsSince(since: Date): AnalyticsEvent[] {
    return this.events.filter(e => e.timestamp >= since);
  }

  static getMetrics(): PerformanceMetrics {
    return { ...this.metrics };
  }

  static updateMetrics(updates: Partial<PerformanceMetrics>): void {
    this.metrics = { ...this.metrics, ...updates };
  }

  private static startPerformanceMonitoring(): void {
    // FPS monitoring
    let lastTime = performance.now();
    let frames = 0;

    const measureFPS = () => {
      frames++;
      const currentTime = performance.now();

      if (currentTime >= lastTime + 1000) {
        this.metrics.fps = Math.round((frames * 1000) / (currentTime - lastTime));
        frames = 0;
        lastTime = currentTime;
      }

      requestAnimationFrame(measureFPS);
    };

    requestAnimationFrame(measureFPS);

    // Memory monitoring (if available)
    if ((performance as any).memory) {
      setInterval(() => {
        const memory = (performance as any).memory;
        this.metrics.memoryUsage = Math.round(
          (memory.usedJSHeapSize / memory.jsHeapSizeLimit) * 100
        );
      }, 5000);
    }

    // Load time
    if (performance.timing) {
      const loadTime =
        performance.timing.loadEventEnd - performance.timing.navigationStart;
      this.metrics.loadTime = loadTime;
    }
  }

  private static getSessionId(): string {
    return this.sessionStart.getTime().toString();
  }

  static getSessionDuration(): number {
    return Date.now() - this.sessionStart.getTime();
  }

  static getEventCounts(): Record<string, number> {
    const counts: Record<string, number> = {};

    this.events.forEach(event => {
      counts[event.action] = (counts[event.action] || 0) + 1;
    });

    return counts;
  }

  static getCategoryBreakdown(): Record<AnalyticsEvent['category'], number> {
    const breakdown: Record<string, number> = {
      gameplay: 0,
      transaction: 0,
      navigation: 0,
      social: 0,
      system: 0,
    };

    this.events.forEach(event => {
      breakdown[event.category]++;
    });

    return breakdown as Record<AnalyticsEvent['category'], number>;
  }

  static exportData(): string {
    return JSON.stringify({
      events: this.events,
      metrics: this.metrics,
      sessionStart: this.sessionStart,
      sessionDuration: this.getSessionDuration(),
    }, null, 2);
  }

  static clearEvents(): void {
    this.events = [];
  }
}

// Initialize on import
AnalyticsService.initialize();

export default AnalyticsService;
