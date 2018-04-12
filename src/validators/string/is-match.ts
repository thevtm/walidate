import { isRegExp } from "lodash";

import { ValidatorPredicate } from "../../validator";
import { ValidationErrorMessageFn, stdErrorMsgFn } from "../../message";

export type IsMatchType = ValidatorPredicate<IsMatchOptions>;

export interface IsMatchOptions {
  pattern: RegExp;
}

export function IsMatch(pattern: RegExp, messageFn?: ValidationErrorMessageFn): IsMatchType {
  const name = "IsMatch";

  const defaultMessageFn = stdErrorMsgFn(
    ({ validator, value }) =>
      `${JSON.stringify(value)} to match pattern ${(validator as IsMatchType).options.pattern.toString()}.`,
  );

  /* 1. Validate arguments */

  if (!isRegExp(pattern)) {
    throw new TypeError(`Argument values should be an regular expression.`);
  }

  // messageFn is validated by ValidatorPredicate

  /* 2. Arguments default */

  messageFn = messageFn || defaultMessageFn;

  /* 3. Validator */

  const predicate = (v: any, e?: IsMatchOptions) => e!.pattern.test(v);

  const options: IsMatchOptions = { pattern };

  return new ValidatorPredicate<IsMatchOptions>(name, predicate, messageFn, options);
}
