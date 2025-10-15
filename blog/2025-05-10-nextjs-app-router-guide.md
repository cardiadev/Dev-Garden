---
slug: nextjs-app-router-guide
title: "Next.js App Router: A Practical Guide for 2025"
authors: [cardiadev]
tags: [web-dev, typescript, tutorial]
---

The Next.js App Router has revolutionized how we build React applications. After migrating several projects, I've learned what works, what doesn't, and the patterns that make development a breeze.

<!-- truncate -->

## Why App Router?

The App Router (introduced in Next.js 13, stable in 14) brings:

- **🎯 Server Components** - Better performance by default
- **🗂️ File-based routing** - Intuitive folder structure
- **⚡ Streaming & Suspense** - Progressive page loading
- **🔄 Better data fetching** - No more `getServerSideProps`
- **📦 Layouts** - Shared UI across routes

## Project Structure

Here's a typical App Router structure:

```
app/
├── layout.tsx              # Root layout
├── page.tsx               # Home page
├── loading.tsx            # Loading UI
├── error.tsx              # Error UI
├── not-found.tsx          # 404 page
├── blog/
│   ├── layout.tsx         # Blog layout
│   ├── page.tsx          # Blog list
│   └── [slug]/
│       └── page.tsx      # Blog post
└── api/
    └── users/
        └── route.ts      # API endpoint
```

## Server vs Client Components

### Server Components (Default)

```tsx
// app/users/page.tsx
import { db } from '@/lib/db';

// This runs on the server!
async function getUsers() {
  return await db.user.findMany();
}

export default async function UsersPage() {
  const users = await getUsers();

  return (
    <div>
      <h1>Users</h1>
      {users.map(user => (
        <div key={user.id}>
          {user.name} - {user.email}
        </div>
      ))}
    </div>
  );
}
```

### Client Components

```tsx
'use client'; // This directive makes it a client component

import { useState } from 'react';

export default function Counter() {
  const [count, setCount] = useState(0);

  return (
    <div>
      <p>Count: {count}</p>
      <button onClick={() => setCount(count + 1)}>
        Increment
      </button>
    </div>
  );
}
```

## Layouts and Templates

### Root Layout

```tsx
// app/layout.tsx
import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'My App',
  description: 'Built with Next.js',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <nav>
          <a href="/">Home</a>
          <a href="/blog">Blog</a>
        </nav>
        <main>{children}</main>
        <footer>© 2025 My App</footer>
      </body>
    </html>
  );
}
```

### Nested Layout

```tsx
// app/blog/layout.tsx
export default function BlogLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="blog-container">
      <aside>
        <h2>Recent Posts</h2>
        {/* Sidebar content */}
      </aside>
      <article>{children}</article>
    </div>
  );
}
```

## Data Fetching Patterns

### Server-Side Fetching

```tsx
// app/posts/[id]/page.tsx
interface Post {
  id: string;
  title: string;
  content: string;
}

async function getPost(id: string): Promise<Post> {
  const res = await fetch(`https://api.example.com/posts/${id}`, {
    next: { revalidate: 3600 } // Revalidate every hour
  });
  
  if (!res.ok) throw new Error('Failed to fetch post');
  return res.json();
}

export default async function PostPage({
  params,
}: {
  params: { id: string };
}) {
  const post = await getPost(params.id);

  return (
    <article>
      <h1>{post.title}</h1>
      <div>{post.content}</div>
    </article>
  );
}
```

### Parallel Data Fetching

```tsx
// app/dashboard/page.tsx
async function getUser() {
  const res = await fetch('https://api.example.com/user');
  return res.json();
}

async function getStats() {
  const res = await fetch('https://api.example.com/stats');
  return res.json();
}

export default async function Dashboard() {
  // Fetch in parallel!
  const [user, stats] = await Promise.all([
    getUser(),
    getStats()
  ]);

  return (
    <div>
      <h1>Welcome, {user.name}!</h1>
      <div>Total Views: {stats.views}</div>
    </div>
  );
}
```

## Loading States

```tsx
// app/blog/loading.tsx
export default function Loading() {
  return (
    <div className="animate-pulse">
      <div className="h-8 bg-gray-200 rounded w-3/4 mb-4"></div>
      <div className="h-4 bg-gray-200 rounded w-full mb-2"></div>
      <div className="h-4 bg-gray-200 rounded w-full mb-2"></div>
      <div className="h-4 bg-gray-200 rounded w-2/3"></div>
    </div>
  );
}
```

## Error Handling

```tsx
// app/blog/error.tsx
'use client';

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <div>
      <h2>Something went wrong!</h2>
      <p>{error.message}</p>
      <button onClick={reset}>Try again</button>
    </div>
  );
}
```

## API Routes

```tsx
// app/api/users/route.ts
import { NextResponse } from 'next/server';
import { db } from '@/lib/db';

export async function GET() {
  const users = await db.user.findMany();
  return NextResponse.json(users);
}

export async function POST(request: Request) {
  const body = await request.json();
  const user = await db.user.create({ data: body });
  return NextResponse.json(user, { status: 201 });
}
```

### Dynamic API Routes

```tsx
// app/api/users/[id]/route.ts
import { NextResponse } from 'next/server';

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  const user = await db.user.findUnique({
    where: { id: params.id }
  });
  
  if (!user) {
    return NextResponse.json(
      { error: 'User not found' },
      { status: 404 }
    );
  }
  
  return NextResponse.json(user);
}
```

## Real-World Example: Blog with Search

```tsx
// app/blog/page.tsx
import { Suspense } from 'react';
import PostList from './PostList';
import SearchBar from './SearchBar';

interface SearchParams {
  q?: string;
}

export default function BlogPage({
  searchParams,
}: {
  searchParams: SearchParams;
}) {
  return (
    <div>
      <h1>Blog</h1>
      <SearchBar />
      <Suspense fallback={<div>Loading posts...</div>}>
        <PostList query={searchParams.q} />
      </Suspense>
    </div>
  );
}
```

```tsx
// app/blog/PostList.tsx
async function getPosts(query?: string) {
  const url = query 
    ? `https://api.example.com/posts?q=${query}`
    : 'https://api.example.com/posts';
    
  const res = await fetch(url);
  return res.json();
}

export default async function PostList({ 
  query 
}: { 
  query?: string 
}) {
  const posts = await getPosts(query);

  return (
    <div>
      {posts.map(post => (
        <article key={post.id}>
          <h2>{post.title}</h2>
          <p>{post.excerpt}</p>
        </article>
      ))}
    </div>
  );
}
```

```tsx
// app/blog/SearchBar.tsx
'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import { useState } from 'react';

export default function SearchBar() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [query, setQuery] = useState(searchParams.get('q') || '');

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    router.push(`/blog?q=${encodeURIComponent(query)}`);
  };

  return (
    <form onSubmit={handleSearch}>
      <input
        type="search"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="Search posts..."
      />
      <button type="submit">Search</button>
    </form>
  );
}
```

## Metadata & SEO

```tsx
// app/blog/[slug]/page.tsx
import type { Metadata } from 'next';

export async function generateMetadata({
  params,
}: {
  params: { slug: string };
}): Promise<Metadata> {
  const post = await getPost(params.slug);

  return {
    title: post.title,
    description: post.excerpt,
    openGraph: {
      title: post.title,
      description: post.excerpt,
      images: [post.coverImage],
    },
  };
}
```

## Best Practices I've Learned

1. **Default to Server Components** - Use 'use client' only when needed
2. **Colocate Loading States** - Put loading.tsx near the page
3. **Error Boundaries** - Always add error.tsx for better UX
4. **Parallel Fetching** - Use Promise.all() for independent data
5. **TypeScript Everything** - Catch errors at build time
6. **Streaming** - Use Suspense for better perceived performance

## Common Pitfalls

❌ **Don't:** Use useState in Server Components  
✅ **Do:** Move to a Client Component

❌ **Don't:** Fetch data in Client Components  
✅ **Do:** Pass data as props from Server Components

❌ **Don't:** Import Server-only code in Client Components  
✅ **Do:** Use 'server-only' package to enforce

## Conclusion

The App Router is a paradigm shift, but it's worth it. You get:

- Better performance by default
- Cleaner code organization  
- Built-in optimizations
- Better developer experience

Start with Server Components, add Client Components only when needed, and you'll build faster, better apps.

Happy coding! ▲

---

**Building with Next.js? Let's connect on [GitHub](https://github.com/cardiadev)!**
