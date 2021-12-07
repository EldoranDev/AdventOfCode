import { PerformanceObserver } from 'perf_hooks';

export default () => {
    const obs = new PerformanceObserver((items) => {
        for (let entry of items.getEntries()) {
          console.log(`${entry.name} took ${entry .duration}ms`);
        }
    });

    obs.observe({ entryTypes: ['measure']});
};