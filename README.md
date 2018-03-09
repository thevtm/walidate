# walidate

Validation library.

```javascript
validate([IsString()], 23) // ValidationError
validate([IsNumber(), IsNotNaN()], 23) // void

const constraints = {
  name: [IsString(), IsNotEmpty()],
  age: [IsInteger(), IsPositive(), Minimum(120)],
  email: [IsOptional(), IsEmail()],
  job: [union([IsString()], [IsArray([IsString()])])]
};

validate(constraints, { name: "Jeorge Foreman", age: 56 }); // void
validate(constraints, { name: "Bob Wanderman", age: '31' }); // ValidationError
```

## Todo

- [ ] ValidationError
- [ ] Validators
  - [ ] Core
  - [ ] Definition
    - [ ] IsOptional
  - [ ] Types
    - [ ] IsBoolean
    - [ ] IsDate
    - [ ] IsString
    - [ ] IsArray
    - [ ] IsNumber
- [ ] validate()
  - [ ] validate(validators: Validator[], value: any)
  - [ ] validate(constraints: Constraints, value: any)
