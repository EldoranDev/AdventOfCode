import { Logger } from "winston";

export type Context = {
    logger?: Logger;
    test: boolean;
};
