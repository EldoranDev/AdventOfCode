import { PerformanceObserver } from 'perf_hooks';

export default () => {
    const obs = new PerformanceObserver((items) => {
        const entry = items.getEntries()[0];

        console.log(`${entry.name} took ${entry.duration}ms`);
    });

    obs.observe({ entryTypes: ['measure']});
};