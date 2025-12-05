import { Logger } from "winston";

export type Context = {
    logger?: Logger;
    test: boolean;
};

export type Implementation = (input: string[], context: Context) => string;
