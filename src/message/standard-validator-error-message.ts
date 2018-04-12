import { ValidationErrorMessageFn } from "./validator-error-message";

export function stdErrorMsgFn(sufixFn: ValidationErrorMessageFn): ValidationErrorMessageFn {
  return (args) => {
    const { propertyPath } = args;
    const sufix = sufixFn(args);

    return propertyPath != null
      ? `Invalid property "${propertyPath}" value, expected ${sufix}`
      : `Invalid value, expected ${sufix}`;
  };
}
