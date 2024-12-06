import { PerformanceObserver } from "node:perf_hooks";
import { system as logger } from "./logger";

export default async () => {
    const obs = new PerformanceObserver((items) => {
        for (const entry of items.getEntries()) {
            logger.info(`${entry.name} took ${Math.round(entry.duration * 100) / 100}ms`);
        }
    });

    obs.observe({ entryTypes: ["measure"] });
};
