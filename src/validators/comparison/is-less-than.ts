import { lt } from "lodash";

import { ValidatorPredicate } from "../../validator";
import { ValidationErrorMessageFn, stdErrorMsgFn } from "../../message";

export type IsLessThanType = ValidatorPredicate<IsLessThanOptions>;

export interface IsLessThanOptions {
  value: any;
}

export function IsLessThan(value: any, messageFn?: ValidationErrorMessageFn): IsLessThanType {
  const name = "IsLessThan";
  const defaultMessageFn = stdErrorMsgFn(
    ({ validator, value: v }) =>
      `${JSON.stringify(v)} to be less than ${JSON.stringify((validator as IsLessThanType).options.value)}.`,
  );

  messageFn = messageFn || defaultMessageFn;

  const predicate = (v: any) => lt(v, value);

  const extra: IsLessThanOptions = { value };

  return new ValidatorPredicate<IsLessThanOptions>(name, predicate, messageFn, extra);
}
