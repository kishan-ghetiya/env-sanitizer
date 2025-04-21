
# env-sanitizer

<div align="center">

[![NPM version](https://img.shields.io/npm/v/env-sanitizer.svg?style=flat)](https://www.npmjs.com/package/env-sanitizer)
[![TypeScript](https://badgen.net/npm/types/env-sanitizer)](http://www.typescriptlang.org/)
[![npm downloads](https://img.shields.io/npm/dm/env-sanitizer.svg?style=flat)](https://www.npmjs.com/package/env-sanitizer)
[![Known Vulnerabilities](https://snyk.io//test/github/kishan-ghetiya/env-sanitizer/badge.svg?targetFile=package.json)](https://snyk.io//test/github/kishan-ghetiya/env-sanitizer?targetFile=package.json)
[![License](https://badgen.net/npm/license/env-sanitizer)](https://opensource.org/licenses/MIT)

A library to validate, sanitize, and safely load `.env` variables in your Node.js application. Supports TypeScript!
<br>
<br>
</div>

## Installation

You can install `env-sanitizer` via npm:

```bash
npm install env-sanitizer
```

## Features

- **Validation:** Ensure your environment variables meet specific conditions (e.g., required fields, valid types).
- **Sanitization:** Cast values to the expected types (e.g., string, number, boolean, JSON, array, date, URL, BigInt, UUID).
- **Default Values:** Provide default values if the environment variable is missing.
- **Error Handling:** Throw descriptive errors when a variable is missing or invalid.
- **Custom Validators:** Easily create custom validation logic for any environment variable.

## Usage

### 1. Set up your `.env` file

Create a `.env` file in the root of your project with some environment variables:

```
STRING_VAR=hello
NUMBER_VAR=123
BOOLEAN_VAR=true
CONFIG={"key":"value"}
USERS=one,two,three
LAUNCH_DATE=2025-04-30
API_URL=https://api.example.com
```

### 2. Define your schema

Use `EnvSchema` to define the types, required status, default values, and optional custom validation for your environment variables.

```typescript
import { sanitizeEnv, EnvSchema, EnvType } from 'env-sanitizer';

const schema: EnvSchema<{
  STRING_VAR: string;
  NUMBER_VAR: number;
  BOOLEAN_VAR: boolean;
  CONFIG: object;
  USERS: string[];
  LAUNCH_DATE: Date;
  API_URL: URL;
}> = {
  STRING_VAR: { type: "string" as EnvType, required: true },
  NUMBER_VAR: { type: "number" as EnvType, required: true },
  BOOLEAN_VAR: { type: "boolean" as EnvType, required: true },
  CONFIG: { type: "json" as EnvType, required: true },
  USERS: { type: "array" as EnvType, required: true },
  LAUNCH_DATE: { type: "date" as EnvType, required: true },
  API_URL: { type: "url" as EnvType, required: true },
};

const config = sanitizeEnv(schema);

console.log(config.STRING_VAR); // "hello"
console.log(config.NUMBER_VAR); // 123
console.log(config.BOOLEAN_VAR); // true
console.log(config.CONFIG); // { key: "value" }
console.log(config.USERS); // ["one", "two", "three"]
console.log(config.LAUNCH_DATE); // Date object
console.log(config.API_URL); // URL object
```

### 3. Handle Missing or Invalid Variables

If a required variable is missing or invalid, an error will be thrown:

```typescript
const schema: EnvSchema<{ REQUIRED_MISSING: string }> = {
  REQUIRED_MISSING: { type: "string" as EnvType, required: true },
};

try {
  sanitizeEnv(schema);
} catch (error) {
  console.error(error.message); // "Missing required environment variable: REQUIRED_MISSING"
}
```

### 4. Use Default Values

You can define default values for optional variables:

```typescript
const schema: EnvSchema<{ OPTIONAL_VAR: string }> = {
  OPTIONAL_VAR: { type: "string" as EnvType, default: "default-value" },
};

const config = sanitizeEnv(schema);

console.log(config.OPTIONAL_VAR); // "default-value"
```

### 5. Custom Validators

You can define custom validation logic for your environment variables:

```typescript
const schema: EnvSchema<{ CUSTOM_VAR: string }> = {
  CUSTOM_VAR: {
    type: "string" as EnvType,
    required: true,
    validator: (value) => value.length > 5,
  },
};

try {
  sanitizeEnv(schema);
} catch (error) {
  console.error(error.message); // "Validation failed for environment variable: CUSTOM_VAR"
}
```

### 6. Support for New Types

In addition to basic types such as `string`, `number`, and `boolean`, `env-sanitizer` now supports the following advanced types:

- **JSON:** Automatically parse environment variables as JSON objects.
- **Array:** Parse environment variables as arrays (e.g., comma-separated values).
- **Date:** Convert environment variables to `Date` objects.
- **URL:** Parse environment variables as `URL` objects.
- **BigInt:** Parse environment variables as `BigInt` values.
- **UUID:** Parse environment variables as UUIDs (using regex validation).

```typescript
const schema: EnvSchema<{
  DATE_VAR: Date;
  BIGINT_VAR: BigInt;
  UUID_VAR: string;
}> = {
  DATE_VAR: { type: "date" as EnvType, required: true },
  BIGINT_VAR: { type: "bigint" as EnvType, required: true },
  UUID_VAR: { type: "uuid" as EnvType, required: true },
};

const config = sanitizeEnv(schema);

console.log(config.DATE_VAR); // Date object
console.log(config.BIGINT_VAR); // BigInt object
console.log(config.UUID_VAR); // UUID string
```

## API

### `sanitizeEnv<T>(schema: EnvSchema<T>): T`

- **Parameters:**
  - `schema`: An object defining the environment variables and their validation rules.
  
- **Returns:**
  - An object where each key corresponds to an environment variable, and its value has been sanitized and validated.

### `EnvSchema<T>`

A schema object used to define the validation rules for your environment variables. It has the following properties:

- `type`: The expected type of the environment variable (e.g., `"string"`, `"number"`, `"boolean"`, `"json"`, `"array"`, `"date"`, `"url"`, `"bigint"`, `"uuid"`).
- `required` (optional): Whether the environment variable is required.
- `default` (optional): The default value to use if the environment variable is missing.
- `validator` (optional): A custom validation function for the environment variable.

### `EnvType`

An enum defining the possible types for environment variables:

- `"string"`
- `"number"`
- `"boolean"`
- `"json"`
- `"array"`
- `"date"`
- `"url"`
- `"bigint"`
- `"uuid"`

## Contributing

If you'd like to contribute, feel free to fork the repository, create a new branch, and submit a pull request. Ensure that you write tests for your changes.

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Author

Kishan Ghetiya - [GitHub](https://github.com/KishanGhetiya)