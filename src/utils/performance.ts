export const measurePerformance = () => {
  if (window.performance) {
    const navigation = performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming;
    const paint = performance.getEntriesByType('paint');
    
    console.log('Page Load Time:', navigation.loadEventEnd - navigation.startTime, 'ms');
    console.log('First Paint:', paint[0]?.startTime, 'ms');
    console.log('First Contentful Paint:', paint[1]?.startTime, 'ms');
  }
};

export const measureCardOperation = (operation: string, startTime: number) => {
  const duration = performance.now() - startTime;
  console.log(`${operation} took ${duration.toFixed(2)}ms`);
};