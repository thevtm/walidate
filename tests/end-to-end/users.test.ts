import {
  IsInteger,
  IsGreaterThanOrEqual,
  IsString,
  IsNotEmpty,
  IsArray,
  IsArrayOf,
  validate,
  Constraints,
  IsOptional,
  IsConstraints,
} from "../../src/index";

describe("E2E", () => {
  it("should validate users accordint to spec", () => {
    const productConstraints: Constraints = {
      id: [IsInteger()],
      quantity: [IsInteger(), IsGreaterThanOrEqual(1)],
    };

    const userConstrains: Constraints = {
      name: [IsString(), IsNotEmpty()],
      cart: [IsOptional(), IsArray(), IsNotEmpty(), IsArrayOf([IsConstraints(productConstraints)])],
    };

    const userA = {
      name: "Bob",
    };

    expect(validate(userConstrains, userA).isValid).toBe(true);

    const userB = {
      name: "Alice",
      cart: [],
    };

    expect(validate(userConstrains, userB).isValid).toBe(false);

    const userC = {
      name: "Homer",
      cart: [{ id: 100, quantity: 1 }, { id: 101, quantity: 2 }],
    };

    expect(validate(userConstrains, userC).isValid).toBe(true);
  });
});
