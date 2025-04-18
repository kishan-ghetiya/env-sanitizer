
# env-sanitizer

A library to validate, sanitize, and safely load `.env` variables in your Node.js application.

## Installation

You can install `env-sanitizer` via npm:

```bash
npm install env-sanitizer
```

## Features

- **Validation:** Ensure your environment variables meet specific conditions (e.g., required fields, valid types).
- **Sanitization:** Cast values to the expected types (e.g., string, number, boolean, JSON).
- **Default Values:** Provide default values if the environment variable is missing.
- **Error Handling:** Throw descriptive errors when a variable is missing or invalid.
  
## Usage

### 1. Set up your `.env` file

Create a `.env` file in the root of your project with some environment variables:

```
STRING_VAR=hello
NUMBER_VAR=123
BOOLEAN_VAR=true
```

### 2. Define your schema

Use `EnvSchema` to define the types, required status, default values, and optional custom validation for your environment variables.

```typescript
import { sanitizeEnv, EnvSchema, EnvType } from 'env-sanitizer';

const schema: EnvSchema<{
  STRING_VAR: string;
  NUMBER_VAR: number;
  BOOLEAN_VAR: boolean;
}> = {
  STRING_VAR: { type: "string" as EnvType, required: true },
  NUMBER_VAR: { type: "number" as EnvType, required: true },
  BOOLEAN_VAR: { type: "boolean" as EnvType, required: true },
};

const config = sanitizeEnv(schema);

console.log(config.STRING_VAR); // "hello"
console.log(config.NUMBER_VAR); // 123
console.log(config.BOOLEAN_VAR); // true
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

## API

### `sanitizeEnv<T>(schema: EnvSchema<T>): T`

- **Parameters:**
  - `schema`: An object defining the environment variables and their validation rules.
  
- **Returns:**
  - An object where each key corresponds to an environment variable, and its value has been sanitized and validated.

### `EnvSchema<T>`

A schema object used to define the validation rules for your environment variables. It has the following properties:

- `type`: The expected type of the environment variable (e.g., `"string"`, `"number"`, `"boolean"`, `"json"`, `"array"`).
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

## Contributing

If you'd like to contribute, feel free to fork the repository, create a new branch, and submit a pull request. Ensure that you write tests for your changes.

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Author

Kishan Ghetiya  
[GitHub](https://github.com/KishanGhetiya)
