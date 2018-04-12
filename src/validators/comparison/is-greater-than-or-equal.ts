import { gte } from "lodash";

import { ValidatorPredicate } from "../../validator";
import { ValidationErrorMessageFn, stdErrorMsgFn } from "../../message";

export type IsGreaterThanOrEqualType = ValidatorPredicate<IsGreaterThanOrEqualOptions>;

export interface IsGreaterThanOrEqualOptions {
  value: any;
}

export function IsGreaterThanOrEqual(value: any, messageFn?: ValidationErrorMessageFn): IsGreaterThanOrEqualType {
  const name = "IsGreaterThanOrEqual";

  const defaultMessageFn = stdErrorMsgFn(({ validator, value }) => {
    const valueStr = JSON.stringify(value);
    const optionsValueStr = JSON.stringify((validator as IsGreaterThanOrEqualType).options.value);

    return `${valueStr} to be greater than or equal to ${optionsValueStr}.`;
  });

  messageFn = messageFn || defaultMessageFn;

  const predicate = (v: any) => gte(v, value);

  const extra: IsGreaterThanOrEqualOptions = { value };

  return new ValidatorPredicate<IsGreaterThanOrEqualOptions>(name, predicate, messageFn, extra);
}
