import { isEqual } from "lodash";

import { ValidatorPredicate } from "../../validator";
import { ValidationErrorMessageFn, stdErrorMsgFn } from "../../message";

export type IsEqualType = ValidatorPredicate<IsEqualOptions>;

export interface IsEqualOptions {
  to: any;
}

export function IsEqual(to: any, messageFn?: ValidationErrorMessageFn): IsEqualType {
  const name = "IsEqual";
  const defaultMessageFn = stdErrorMsgFn(
    ({ validator, value }) =>
      `${JSON.stringify(value)} to be equal to ${JSON.stringify((validator as IsEqualType).options.to)}.`,
  );

  messageFn = messageFn || defaultMessageFn;

  const predicate = (v: any) => isEqual(to, v);

  const extra: IsEqualOptions = { to };

  return new ValidatorPredicate<IsEqualOptions>(name, predicate, messageFn, extra);
}
