# walidate

Validation library.

```javascript
const constraints = {
  name: [IsString, IsNotEmpty],
  age: [IsInteger, IsPositive, IsSmallerThan(120)],
  email: [IsOptional, IsEmail],
  job: [union([IsString], [IsArray([IsString])])]
};

validate(constraints, { name: "Jeorge Foreman", age: 56 }); // []
validate(constraints, { name: "Bob Wanderman", age: '31' }); // [ValidationError]
```
