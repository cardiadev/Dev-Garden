---
slug: typescript-types-vs-interfaces
title: "TypeScript: Types vs Interfaces - When to Use Each"
authors: [cardiadev]
tags: [typescript, best-practices, tutorial]
---

When working with TypeScript, one of the most common questions is: **Should I use `type` or `interface`?** Both can define object shapes, but they have subtle differences that matter.

<!-- truncate -->

## The Basics

### Interfaces

Interfaces are traditionally used to define object shapes and can be extended or implemented:

```typescript
interface User {
  id: number;
  name: string;
  email: string;
}

interface Admin extends User {
  role: 'admin';
  permissions: string[];
}
```

### Types

Types are more flexible and can represent any type, including primitives, unions, and intersections:

```typescript
type ID = number | string;

type User = {
  id: ID;
  name: string;
  email: string;
};

type Admin = User & {
  role: 'admin';
  permissions: string[];
};
```

## Key Differences

### 1. **Declaration Merging**

Interfaces support declaration merging, types don't:

```typescript
interface Window {
  title: string;
}

interface Window {
  version: number;
}

// Result: Window has both title and version
```

### 2. **Union Types**

Types can represent unions, interfaces cannot:

```typescript
type Status = 'pending' | 'approved' | 'rejected';

type Response = SuccessResponse | ErrorResponse;
```

### 3. **Computed Properties**

Types are better for computed property names:

```typescript
type Keys = 'name' | 'email';

type UserFields = {
  [K in Keys]: string;
};
```

## My Recommendation

After working with both, here's my rule of thumb:

- **Use `interface`** for object shapes that might be extended (especially in public APIs)
- **Use `type`** for unions, intersections, tuples, and complex type manipulations
- **Stay consistent** within your codebase

## Real-World Example

```typescript
// Public API - use interface
interface UserDTO {
  id: number;
  name: string;
  email: string;
}

// Internal types - use type
type UserStatus = 'active' | 'inactive' | 'pending';

type UserWithStatus = UserDTO & {
  status: UserStatus;
  lastLogin: Date;
};
```

## Conclusion

Both `type` and `interface` are powerful tools in TypeScript. Understanding their differences helps you write cleaner, more maintainable code. The key is consistency and knowing when each shines.

Happy coding! 🚀

---

**What's your preference? Types or interfaces? Let me know on [Twitter/X](https://x.com/cardiadev)!**
