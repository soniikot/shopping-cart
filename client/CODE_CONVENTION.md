# Code Convention Document

## Naming Conventions

- Use PascalCase for type names, interface names, and enum names.
- Use camelCase for variable names, function names, and property names.
- Use uppercase letters with underscores for constant names.

## File Organization

- Each file should contain a single module or class.
- Files should be named with the same name as the module or class they contain.
- Files should be organized into folders based on their functionality or feature area.

## Code Formatting

- Use a consistent spacing scheme throughout the code.

## TypeScript Specifics

- Use the interface keyword to define interfaces.
- Use the type keyword to define type aliases.
- Use the enum keyword to define enumerations.
- Use the class keyword to define classes.
- Use the extends keyword to indicate inheritance.

## Best Practices

- Keep functions short and focused on a single task.
- Use descriptive variable names and avoid single-letter variable names.
- Use type annotations to specify the types of variables, function parameters, and return types.
- Use the any type only when necessary, and prefer to use more specific types instead.
- Avoid using var and instead use let or const to declare variables.

## \* Error Handling

- Use try-catch blocks to handle errors and exceptions.
- Use the throw keyword to throw custom errors.
- Use the Error class to create custom error objects.

## Code Comments

- Use JSDoc-style comments to document functions, classes, and interfaces.
- Use // for single-line comments and /\* \*/ for multi-line comments.
- Avoid using comments to explain what the code is doing, instead focus on explaining why the code is doing it.

## Exports

- Use the export keyword to export modules, classes, interfaces, and variables.
- Don't use export default to keep consistent.
- Avoid exporting variables or functions that are not intended to be used outside of the module.
- Use a consistent naming convention for exported modules and classes.
