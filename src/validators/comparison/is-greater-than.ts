import { gt } from "lodash";

import { ValidatorPredicate } from "../../validator";
import { ValidationErrorMessageFn, stdErrorMsgFn } from "../../message";

export type IsGreaterThanType = ValidatorPredicate<IsGreaterThanOptions>;

export interface IsGreaterThanOptions {
  value: any;
}

export function IsGreaterThan(value: any, messageFn?: ValidationErrorMessageFn): IsGreaterThanType {
  const name = "IsGreaterThan";
  const defaultMessageFn = stdErrorMsgFn(
    ({ validator, value: v }) =>
      `${JSON.stringify(v)} to be greater than ${JSON.stringify((validator as IsGreaterThanType).options.value)}.`,
  );

  messageFn = messageFn || defaultMessageFn;

  const predicate = (v: any) => gt(v, value);

  const options: IsGreaterThanOptions = { value };

  return new ValidatorPredicate<IsGreaterThanOptions>(name, predicate, messageFn, options);
}
