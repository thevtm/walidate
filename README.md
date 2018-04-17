# walidate

![Travis](https://img.shields.io/travis/thevtm/walidate.svg) ![npm](https://img.shields.io/npm/v/walidate.svg) [![Coverage Status](https://coveralls.io/repos/github/thevtm/walidate/badge.svg)](https://coveralls.io/github/thevtm/walidate)

Validation library. **WIP**

```javascript
const vrA = validate([IsString()], 23)
// vrA.isValid() => true

const vrB = validate([IsNumber(), IsInteger()], 23.3)
// vrB.isValid() => false
// vrB.error.message => "Invalid value, expected 23.3 to be an integer."

const constraints = {
  name: [IsString(), IsNotEmpty()],
  age: [IsInteger(), IsPositive(), IsLessThanOrEqual(120)],
  email: [IsOptional(), IsEmail()],
  job: [IsEither([IsString()], [IsArrayOf([IsString()])])]
};

const vrC = validate(constraints, {
  name: "Jeorge Foreman",
  age: 56,
  job: ["Boxer", "Griller"],
});
// vrC.isValid() => true

const vrD = validate(constraints, {
  name: "Bob Wanderman",
  age: "31",
  email: "bob@bob.com",
  job: "Wanderer",
});
// vrD.isValid() => false
// vrB.error.message => "Invalid property "age" value, expected "31" to be a number."
```
