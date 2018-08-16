import { TimeHandlr } from "timehandlr";

export const createTimeHandler = () =>
    new TimeHandlr({
        timingDefault: 9,
    });
