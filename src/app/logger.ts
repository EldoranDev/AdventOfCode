import { createLogger, transports, format } from "winston";

export const system = createLogger({
    defaultMeta: { source: "system" },
    format: format.combine(
        format.label({
            label: "[SYSTEM]",
        }),
        format.printf((info) => `${info.label}[${info.level}] ${info.message}`),
    ),
    transports: [new transports.Console()],
});

export const implementation = createLogger({
    level: "debug",
    format: format.combine(
        format.label({
            label: "[DAY]",
        }),
        format.printf((info) => `${info.label}[${info.level}] ${info.message}`),
    ),
    transports: [new transports.Console()],
});
