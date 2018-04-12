import { isEqual } from "lodash";

import { Validator, ValidatorPredicate } from "../../validator";
import { ValidationErrorMessageFn, stdErrorMsgFn } from "../../message";

export type IsNotEqualType = ValidatorPredicate<IsNotEqualOptions>;

export interface IsNotEqualOptions {
  to: any;
}

export function IsNotEqual(to: any, messageFn?: ValidationErrorMessageFn): Validator {
  const name = "IsNotEqual";
  const defaultMessageFn = stdErrorMsgFn(
    ({ validator, value }) =>
      `${JSON.stringify(value)} to not be equal to ${JSON.stringify((validator as IsNotEqualType).options.to)}.`,
  );

  messageFn = messageFn || defaultMessageFn;

  const predicate = (v: any) => !isEqual(to, v);

  const extra: IsNotEqualOptions = { to };

  return new ValidatorPredicate<IsNotEqualOptions>(name, predicate, messageFn, extra);
}
