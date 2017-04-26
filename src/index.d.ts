import { Matching } from "./matching";
export interface IResult {
    feedback: string;
    calc_time: number;
}
export declare class Zxcvbn {
    static matching: Matching;
    /**
     * Checks the strength of a password
     * @param password password to check
     * @param user_inputs additional dictionary information
     */
    static check(password: string, user_inputs?: Array<string>): IResult;
}
