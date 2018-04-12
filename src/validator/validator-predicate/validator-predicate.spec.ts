import { ValidatorPredicate } from "../index";

describe("ValidatorPredicate", () => {
  it("constructor() should throw when it receives invalid arguments", () => {
    // @ts-ignore
    expect(() => new ValidatorPredicate()).toThrow();

    /* 1. name */

    // @ts-ignore
    expect(() => new ValidatorPredicate("", () => true, () => null)).toThrow(
      `Argument name should be a non empty string.`,
    );

    /* 2. messageFn */

    // @ts-ignore
    expect(() => new ValidatorPredicate("bad1", 123, () => false)).toThrow(`Argument predicate should be a function.`);

    /* 2. predicate */

    // @ts-ignore
    expect(() => new ValidatorPredicate("bad1", () => true, 123)).toThrow(
      `Argument messageFn should be a ValidationErrorMessageFn.`,
    );
  });
});
