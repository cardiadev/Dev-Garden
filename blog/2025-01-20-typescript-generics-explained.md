---
slug: typescript-generics-explained
title: "TypeScript Generics: From Basics to Advanced Patterns"
authors: [cardiadev]
tags: [typescript, tutorial, best-practices]
---

Generics in TypeScript can seem intimidating at first, but they're one of the most powerful features for writing reusable, type-safe code. Let me break them down with practical examples.

<!-- truncate -->

## What Are Generics?

Generics allow you to create reusable components that work with multiple types while maintaining type safety. Think of them as "type variables" that get filled in when you use the component.

## Starting Simple

### Basic Generic Function

Instead of this:

```typescript
function getFirstString(arr: string[]): string {
  return arr[0];
}

function getFirstNumber(arr: number[]): number {
  return arr[0];
}
```

Use this:

```typescript
function getFirst<T>(arr: T[]): T {
  return arr[0];
}

const firstString = getFirst(['hello', 'world']); // string
const firstNumber = getFirst([1, 2, 3]); // number
const firstUser = getFirst(users); // User
```

## Generic Interfaces

Perfect for API responses:

```typescript
interface ApiResponse<T> {
  data: T;
  status: number;
  message: string;
  timestamp: Date;
}

interface User {
  id: number;
  name: string;
}

// Type-safe API responses
const userResponse: ApiResponse<User> = {
  data: { id: 1, name: 'Carlos' },
  status: 200,
  message: 'Success',
  timestamp: new Date(),
};

const usersResponse: ApiResponse<User[]> = {
  data: [{ id: 1, name: 'Carlos' }],
  status: 200,
  message: 'Success',
  timestamp: new Date(),
};
```

## Constraints: Making Generics Smarter

Sometimes you need to restrict what types can be used:

```typescript
interface HasId {
  id: number;
}

function findById<T extends HasId>(items: T[], id: number): T | undefined {
  return items.find(item => item.id === id);
}

// ✅ Works with any type that has an 'id'
const user = findById(users, 1);
const product = findById(products, 123);

// ❌ Error: number doesn't have 'id'
// const num = findById([1, 2, 3], 1);
```

## Multiple Type Parameters

When one isn't enough:

```typescript
function mapObject<K extends string, V, R>(
  obj: Record<K, V>,
  fn: (value: V) => R
): Record<K, R> {
  const result = {} as Record<K, R>;
  
  for (const key in obj) {
    result[key] = fn(obj[key]);
  }
  
  return result;
}

const numbers = { a: 1, b: 2, c: 3 };
const strings = mapObject(numbers, n => n.toString());
// Result: { a: '1', b: '2', c: '3' }
```

## Real-World Pattern: Repository

Here's how I use generics for database repositories:

```typescript
interface Entity {
  id: number;
  createdAt: Date;
  updatedAt: Date;
}

class Repository<T extends Entity> {
  constructor(private tableName: string) {}

  async findById(id: number): Promise<T | null> {
    // Database query
    return null; // Simplified
  }

  async findAll(): Promise<T[]> {
    // Database query
    return []; // Simplified
  }

  async create(data: Omit<T, 'id' | 'createdAt' | 'updatedAt'>): Promise<T> {
    // Database insert
    return {} as T; // Simplified
  }

  async update(id: number, data: Partial<T>): Promise<T> {
    // Database update
    return {} as T; // Simplified
  }

  async delete(id: number): Promise<boolean> {
    // Database delete
    return true; // Simplified
  }
}

// Usage
interface User extends Entity {
  name: string;
  email: string;
}

const userRepo = new Repository<User>('users');

// All methods are now type-safe!
const user = await userRepo.findById(1); // User | null
const users = await userRepo.findAll(); // User[]
await userRepo.create({ name: 'Carlos', email: 'carlos@example.com' });
```

## Advanced: Conditional Types with Generics

Combine generics with conditional types for powerful patterns:

```typescript
type ApiResult<T, E = Error> = 
  | { success: true; data: T }
  | { success: false; error: E };

async function fetchUser(id: number): Promise<ApiResult<User>> {
  try {
    const user = await getUserFromDB(id);
    return { success: true, data: user };
  } catch (error) {
    return { success: false, error: error as Error };
  }
}

// Usage with type narrowing
const result = await fetchUser(1);

if (result.success) {
  console.log(result.data.name); // TypeScript knows 'data' exists
} else {
  console.error(result.error.message); // TypeScript knows 'error' exists
}
```

## Generic Utility Type Creation

Create your own utility types:

```typescript
// Make specific properties optional
type PartialBy<T, K extends keyof T> = Omit<T, K> & Partial<Pick<T, K>>;

interface User {
  id: number;
  name: string;
  email: string;
  avatar: string;
}

// id and avatar are optional, name and email required
type UserInput = PartialBy<User, 'id' | 'avatar'>;

const newUser: UserInput = {
  name: 'Carlos',
  email: 'carlos@example.com',
  // id and avatar are optional
};
```

## Best Practices

1. **Keep it simple** - Don't over-engineer with generics
2. **Use constraints** - Add `extends` when you know what properties you need
3. **Name meaningfully** - `T` is fine, but `TUser` or `TData` is clearer
4. **Default types** - Provide sensible defaults: `<T = string>`

## Conclusion

Generics transform TypeScript from a type checker into a powerful tool for creating flexible, reusable code. Start with simple examples, build up to complex patterns, and soon they'll become second nature.

The key is practice—every time you find yourself writing similar code for different types, ask yourself: "Could generics help here?"

Happy coding! 🎯

---

**Want to dive deeper into TypeScript? Follow me on [GitHub](https://github.com/cardiadev)!**
