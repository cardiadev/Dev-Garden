---
slug: typescript-decorators-guide
title: "TypeScript Decorators: Powerful Patterns for Clean Code"
authors: [cardiadev]
tags: [typescript, best-practices, tutorial]
---

Decorators are one of TypeScript's most powerful features, yet they're often overlooked. They provide a clean way to add functionality to classes, methods, and properties. Let me show you how to use them effectively.

<!-- truncate -->

## What Are Decorators?

Decorators are special functions that can modify classes, methods, properties, or parameters at design time. Think of them as annotations that add behavior.

```typescript
@sealed
class User {
  @readonly
  name: string;

  @validate
  setAge(age: number) {
    // ...
  }
}
```

## Enable Decorators

First, enable them in `tsconfig.json`:

```json
{
  "compilerOptions": {
    "experimentalDecorators": true,
    "emitDecoratorMetadata": true
  }
}
```

## Class Decorators

Class decorators modify or replace class definitions:

```typescript
function sealed(constructor: Function) {
  Object.seal(constructor);
  Object.seal(constructor.prototype);
}

@sealed
class User {
  constructor(public name: string) {}
}

// Now User class cannot be extended
```

### Decorator Factory

For configurable decorators:

```typescript
function Component(config: { selector: string }) {
  return function (constructor: Function) {
    constructor.prototype.selector = config.selector;
  };
}

@Component({ selector: 'app-user' })
class UserComponent {
  // selector property is now available
}
```

## Method Decorators

Add behavior to methods:

```typescript
function log(
  target: any,
  propertyKey: string,
  descriptor: PropertyDescriptor
) {
  const originalMethod = descriptor.value;

  descriptor.value = function (...args: any[]) {
    console.log(`Calling ${propertyKey} with args:`, args);
    const result = originalMethod.apply(this, args);
    console.log(`${propertyKey} returned:`, result);
    return result;
  };

  return descriptor;
}

class Calculator {
  @log
  add(a: number, b: number) {
    return a + b;
  }
}

const calc = new Calculator();
calc.add(2, 3);
// Logs:
// Calling add with args: [2, 3]
// add returned: 5
```

## Property Decorators

Track or validate properties:

```typescript
function MinLength(length: number) {
  return function (target: any, propertyKey: string) {
    let value: string;

    const getter = function () {
      return value;
    };

    const setter = function (newVal: string) {
      if (newVal.length < length) {
        throw new Error(
          `${propertyKey} must be at least ${length} characters`
        );
      }
      value = newVal;
    };

    Object.defineProperty(target, propertyKey, {
      get: getter,
      set: setter,
      enumerable: true,
      configurable: true,
    });
  };
}

class User {
  @MinLength(3)
  username: string;

  constructor(username: string) {
    this.username = username; // Validates on set
  }
}

const user = new User('ab'); // Error: username must be at least 3 characters
```

## Parameter Decorators

Mark parameters for metadata:

```typescript
function required(
  target: any,
  propertyKey: string,
  parameterIndex: number
) {
  const existingRequired = Reflect.getMetadata('required', target, propertyKey) || [];
  existingRequired.push(parameterIndex);
  Reflect.defineMetadata('required', existingRequired, target, propertyKey);
}

class UserService {
  createUser(@required name: string, email?: string) {
    // Metadata about required parameters is stored
  }
}
```

## Real-World Example: API Route Decorators

```typescript
// Route decorator
function Route(path: string) {
  return function (
    target: any,
    propertyKey: string,
    descriptor: PropertyDescriptor
  ) {
    target.routes = target.routes || [];
    target.routes.push({
      path,
      method: propertyKey,
      handler: descriptor.value,
    });
  };
}

// HTTP method decorators
function Get(path: string) {
  return Route(path);
}

function Post(path: string) {
  return Route(path);
}

// Validation decorator
function ValidateBody(schema: any) {
  return function (
    target: any,
    propertyKey: string,
    descriptor: PropertyDescriptor
  ) {
    const originalMethod = descriptor.value;

    descriptor.value = function (req: any, res: any) {
      const errors = validateSchema(req.body, schema);
      if (errors.length > 0) {
        return res.status(400).json({ errors });
      }
      return originalMethod.call(this, req, res);
    };
  };
}

// Controller class
class UserController {
  @Get('/users')
  async getUsers(req: any, res: any) {
    const users = await this.userService.findAll();
    return res.json(users);
  }

  @Post('/users')
  @ValidateBody({
    name: { type: 'string', required: true },
    email: { type: 'email', required: true },
  })
  async createUser(req: any, res: any) {
    const user = await this.userService.create(req.body);
    return res.status(201).json(user);
  }
}
```

## Caching Decorator

Memoize expensive operations:

```typescript
function Memoize() {
  return function (
    target: any,
    propertyKey: string,
    descriptor: PropertyDescriptor
  ) {
    const originalMethod = descriptor.value;
    const cache = new Map();

    descriptor.value = function (...args: any[]) {
      const key = JSON.stringify(args);
      
      if (cache.has(key)) {
        console.log('Cache hit!');
        return cache.get(key);
      }

      const result = originalMethod.apply(this, args);
      cache.set(key, result);
      return result;
    };

    return descriptor;
  };
}

class DataService {
  @Memoize()
  async fetchExpensiveData(id: number) {
    console.log('Fetching from API...');
    // Expensive API call
    return { id, data: 'some data' };
  }
}

const service = new DataService();
await service.fetchExpensiveData(1); // Fetching from API...
await service.fetchExpensiveData(1); // Cache hit!
```

## Retry Decorator

Automatically retry failed operations:

```typescript
function Retry(attempts: number = 3, delay: number = 1000) {
  return function (
    target: any,
    propertyKey: string,
    descriptor: PropertyDescriptor
  ) {
    const originalMethod = descriptor.value;

    descriptor.value = async function (...args: any[]) {
      let lastError: Error;

      for (let i = 0; i < attempts; i++) {
        try {
          return await originalMethod.apply(this, args);
        } catch (error) {
          lastError = error as Error;
          console.log(`Attempt ${i + 1} failed, retrying...`);
          
          if (i < attempts - 1) {
            await new Promise(resolve => setTimeout(resolve, delay));
          }
        }
      }

      throw lastError!;
    };

    return descriptor;
  };
}

class ApiService {
  @Retry(3, 2000)
  async fetchData(url: string) {
    const response = await fetch(url);
    if (!response.ok) throw new Error('Failed to fetch');
    return response.json();
  }
}
```

## Timing Decorator

Measure method execution time:

```typescript
function Measure() {
  return function (
    target: any,
    propertyKey: string,
    descriptor: PropertyDescriptor
  ) {
    const originalMethod = descriptor.value;

    descriptor.value = async function (...args: any[]) {
      const start = performance.now();
      const result = await originalMethod.apply(this, args);
      const end = performance.now();
      
      console.log(`${propertyKey} took ${(end - start).toFixed(2)}ms`);
      return result;
    };

    return descriptor;
  };
}

class DatabaseService {
  @Measure()
  async query(sql: string) {
    // Database query
    await new Promise(resolve => setTimeout(resolve, 100));
    return { rows: [] };
  }
}
```

## Authorization Decorator

Check permissions before execution:

```typescript
function Authorize(roles: string[]) {
  return function (
    target: any,
    propertyKey: string,
    descriptor: PropertyDescriptor
  ) {
    const originalMethod = descriptor.value;

    descriptor.value = function (req: any, res: any) {
      const userRole = req.user?.role;

      if (!roles.includes(userRole)) {
        return res.status(403).json({
          error: 'Forbidden: Insufficient permissions',
        });
      }

      return originalMethod.call(this, req, res);
    };

    return descriptor;
  };
}

class AdminController {
  @Authorize(['admin'])
  async deleteUser(req: any, res: any) {
    // Only admins can execute this
    await this.userService.delete(req.params.id);
    return res.status(204).send();
  }

  @Authorize(['admin', 'moderator'])
  async updateUser(req: any, res: any) {
    // Admins and moderators can execute this
    const user = await this.userService.update(req.params.id, req.body);
    return res.json(user);
  }
}
```

## Combining Decorators

Stack multiple decorators:

```typescript
class UserController {
  @Authorize(['admin'])
  @ValidateBody(createUserSchema)
  @Measure()
  @Retry(3)
  async createUser(req: any, res: any) {
    // All decorators are applied in order
    const user = await this.userService.create(req.body);
    return res.status(201).json(user);
  }
}
```

Decorators are applied from **bottom to top**:
1. `@Retry` wraps the original method
2. `@Measure` wraps the retry decorator
3. `@ValidateBody` wraps the measure decorator
4. `@Authorize` wraps everything

## Best Practices

1. **Keep decorators pure** - No side effects outside their scope
2. **Document behavior** - Decorators are "magic", explain what they do
3. **Type safety** - Use proper TypeScript types
4. **Composition** - Build complex behavior from simple decorators
5. **Error handling** - Handle errors gracefully
6. **Performance** - Be mindful of overhead

## Common Use Cases

- ✅ **Logging & monitoring**
- ✅ **Validation**
- ✅ **Caching**
- ✅ **Authorization**
- ✅ **Rate limiting**
- ✅ **Error handling**
- ✅ **Dependency injection**
- ✅ **Metadata management**

## Conclusion

Decorators are powerful tools for writing clean, maintainable code. They allow you to:

- Separate concerns
- Reuse functionality
- Keep code DRY
- Add behavior declaratively

NestJS, TypeORM, and many other frameworks leverage decorators heavily. Master them, and you'll write cleaner, more expressive TypeScript.

Start simple, experiment, and build your own decorator library! 🎨

---

**Love TypeScript? Follow me on [GitHub](https://github.com/cardiadev) for more advanced patterns!**
