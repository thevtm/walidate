import { ValidatorFunctor } from "../../index";

describe("ValidatorFunctor", () => {
  it("constructor() should throw when it receives invalid arguments", () => {
    /* 1. name */

    /* 2. validateFn */

    // @ts-ignore
    expect(() => new ValidatorFunctor()).toThrow(`Argument validateFn should be a validator function.`);
    // @ts-ignore
    expect(() => new ValidatorFunctor("bad1", null)).toThrow(`Argument validateFn should be a validator function.`);
  });
});
