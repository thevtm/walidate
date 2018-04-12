import { isFunction } from "lodash";
import { Validator } from "../validator";

export interface ValidationErrorMessageFnParams {
  validator: Validator;
  value: any;
  propertyPath?: string;
  target?: any;
}

export type ValidationErrorMessageFn = (args: ValidationErrorMessageFnParams) => string;

export function isValidationErrorMessageFn(value: any) {
  return isFunction(value);
}
