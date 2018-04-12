import { lte } from "lodash";

import { ValidatorPredicate } from "../../validator";
import { ValidationErrorMessageFn, stdErrorMsgFn } from "../../message";

export type IsLessThanOrEqualType = ValidatorPredicate<IsLessThanOrEqualOptions>;

export interface IsLessThanOrEqualOptions {
  value: any;
}

export function IsLessThanOrEqual(value: any, messageFn?: ValidationErrorMessageFn): IsLessThanOrEqualType {
  const name = "IsLessThanOrEqual";

  const defaultMessageFn = stdErrorMsgFn(({ validator, value: v }) => {
    const valueStr = JSON.stringify(v);
    const optionsValueStr = JSON.stringify((validator as IsLessThanOrEqualType).options!.value);

    return `${valueStr} to be less than or equal to ${optionsValueStr}.`;
  });

  messageFn = messageFn || defaultMessageFn;

  const predicate = (v: any) => lte(v, value);

  const options: IsLessThanOrEqualOptions = { value };

  return new ValidatorPredicate<IsLessThanOrEqualOptions>(name, predicate, messageFn, options);
}
