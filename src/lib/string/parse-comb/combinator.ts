export interface SuccessResult {
    success: true;
    value: string;
    rest: string;
}

export interface FailureRessult {
    success: false;
}

export type CombinatorResult = SuccessResult | FailureRessult;

export type Combinator = (input: string) => CombinatorResult;
