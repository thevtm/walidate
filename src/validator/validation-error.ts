import { Validator } from "./index";

/**
 * Validation error description.
 */
export class ValidationError {
  /**
   * Validator that created the error.
   */
  public readonly validator: Validator;

  /**
   * Error message.
   */
  public readonly message: string;

  /**
   * Value that haven"t pass a validation.
   */
  public readonly value: any;

  /**
   * Object"s property path that haven"t pass validation.
   */
  public readonly propertyPath?: string;

  /**
   * Object that was validated.
   */
  public readonly target?: any;

  public constructor(validator: Validator, message: string, value: any, propertyPath?: string, target?: any) {
    this.validator = validator;
    this.message = message;
    this.value = value;
    this.propertyPath = propertyPath;
    this.target = target;
  }
}
