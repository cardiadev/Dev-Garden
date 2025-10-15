---
slug: building-with-docusaurus
title: "Building a Developer Portfolio with Docusaurus"
authors: [cardiadev]
tags: [web-dev, tutorial, javascript]
---

Docusaurus is my go-to tool for documentation sites, but it's also perfect for developer portfolios and digital gardens. Let me show you why I chose it for my Dev Garden and how you can use it too.

<!-- truncate -->

## Why Docusaurus?

After trying Jekyll, Hugo, and Gatsby, I settled on Docusaurus because:

- **⚛️ React-based** - Full power of React when you need it
- **📝 Markdown-first** - Write content, not code
- **🎨 Customizable** - Tweak everything with React components
- **🚀 Fast** - Built on modern web tech
- **📱 Mobile-friendly** - Responsive out of the box

## Getting Started

Creating a new Docusaurus site is simple:

```bash
npx create-docusaurus@latest my-website classic --typescript
cd my-website
npm start
```

That's it! Your site is running at `localhost:3000`.

## Project Structure

Here's what you get:

```
my-website/
├── blog/                  # Blog posts
│   ├── 2025-01-15-post.md
│   └── authors.yml
├── docs/                  # Documentation
│   └── intro.md
├── src/
│   ├── components/        # React components
│   ├── css/              # Styles
│   └── pages/            # Custom pages
├── static/               # Static assets
│   └── img/
├── docusaurus.config.ts  # Main config
└── sidebars.ts          # Sidebar config
```

## Customizing Your Site

### 1. Configuration

Edit `docusaurus.config.ts`:

```typescript
import type {Config} from '@docusaurus/types';

const config: Config = {
  title: 'My Dev Portfolio',
  tagline: 'Building cool stuff with code',
  favicon: 'img/favicon.ico',
  url: 'https://yourdomain.com',
  baseUrl: '/',
  organizationName: 'your-github',
  projectName: 'your-repo',
  
  themeConfig: {
    navbar: {
      title: 'My Portfolio',
      logo: {
        alt: 'Logo',
        src: 'img/logo.svg',
      },
      items: [
        {to: '/docs/intro', label: 'Docs', position: 'left'},
        {to: '/blog', label: 'Blog', position: 'left'},
        {
          href: 'https://github.com/your-username',
          label: 'GitHub',
          position: 'right',
        },
      ],
    },
  },
};

export default config;
```

### 2. Custom Theme

Create `src/css/custom.css`:

```css
:root {
  --ifm-color-primary: #2e8555;
  --ifm-color-primary-dark: #29784c;
  --ifm-background-color: #ffffff;
  --ifm-font-color-base: #1a1a1a;
}

[data-theme='dark'] {
  --ifm-color-primary: #25c2a0;
  --ifm-background-color: #1a1a1a;
  --ifm-font-color-base: #e6e6e6;
}

/* Custom button styling */
.button--primary {
  background-color: var(--ifm-color-primary);
  border-radius: 50px;
  padding: 0.75rem 2rem;
}
```

### 3. Custom React Components

Create `src/components/ProjectCard.tsx`:

```tsx
import React from 'react';
import styles from './ProjectCard.module.css';

interface ProjectCardProps {
  title: string;
  description: string;
  githubUrl: string;
  tags: string[];
}

export default function ProjectCard({
  title,
  description,
  githubUrl,
  tags
}: ProjectCardProps) {
  return (
    <div className={styles.card}>
      <h3>{title}</h3>
      <p>{description}</p>
      <div className={styles.tags}>
        {tags.map(tag => (
          <span key={tag} className={styles.tag}>{tag}</span>
        ))}
      </div>
      <a href={githubUrl} target="_blank" rel="noopener noreferrer">
        View on GitHub →
      </a>
    </div>
  );
}
```

### 4. Custom Homepage

Edit `src/pages/index.tsx`:

```tsx
import React from 'react';
import Layout from '@theme/Layout';
import Link from '@docusaurus/Link';
import styles from './index.module.css';

export default function Home() {
  return (
    <Layout
      title="Home"
      description="My Developer Portfolio">
      <header className={styles.heroBanner}>
        <div className="container">
          <h1>Hi, I'm Carlos 👋</h1>
          <p>Software Developer | TypeScript Enthusiast</p>
          <div className={styles.buttons}>
            <Link
              className="button button--primary button--lg"
              to="/docs/intro">
              View My Work
            </Link>
          </div>
        </div>
      </header>
    </Layout>
  );
}
```

## Blog Setup

### Creating Posts

Create `blog/2025-04-20-my-post.md`:

```markdown
---
slug: my-first-post
title: My First Blog Post
authors: [yourname]
tags: [typescript, tutorial]
---

Your post introduction here.

<!-- truncate -->

Full post content after the truncate marker.
```

### Author Configuration

Edit `blog/authors.yml`:

```yaml
yourname:
  name: Your Name
  title: Software Developer
  url: https://yourwebsite.com
  image_url: /img/profile.jpg
  socials:
    github: yourusername
    x: yourusername
```

## Advanced Features

### MDX Support

Use React components in Markdown files (`.mdx`):

**Example:** Create interactive tabs for code snippets

```typescript
// In your .mdx file:
import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

// Then use them in your content:
<Tabs>
  <TabItem value="js" label="JavaScript">
    Your JavaScript code here
  </TabItem>
  <TabItem value="ts" label="TypeScript">
    Your TypeScript code here
  </TabItem>
</Tabs>
```

This creates tabbed code blocks with different language examples!

### Search Integration

Add Algolia search:

```typescript
themeConfig: {
  algolia: {
    appId: 'YOUR_APP_ID',
    apiKey: 'YOUR_SEARCH_API_KEY',
    indexName: 'YOUR_INDEX_NAME',
  },
}
```

### Versioning

For documentation with versions:

```bash
npm run docusaurus docs:version 1.0.0
```

## Deployment

### GitHub Pages

1. Update `docusaurus.config.ts`:

```typescript
const config: Config = {
  url: 'https://username.github.io',
  baseUrl: '/repo-name/',
  organizationName: 'username',
  projectName: 'repo-name',
  deploymentBranch: 'gh-pages',
};
```

2. Deploy:

```bash
npm run deploy
```

### Vercel/Netlify

Just connect your GitHub repo - they auto-detect Docusaurus!

## Tips from Building My Dev Garden

1. **Start simple** - Don't over-customize initially
2. **Use TypeScript** - Better DX and fewer bugs
3. **Dark mode** - Users love it
4. **Mobile-first** - Test on mobile devices
5. **SEO matters** - Use proper meta tags
6. **Fast images** - Optimize before adding

## Performance Optimizations

```typescript
// Enable compression
const config: Config = {
  webpack: {
    jsLoader: (isServer) => ({
      loader: require.resolve('swc-loader'),
      options: {
        jsc: {
          parser: {
            syntax: 'typescript',
            tsx: true,
          },
          transform: {
            react: {
              runtime: 'automatic',
            },
          },
        },
      },
    }),
  },
};
```

## My Favorite Plugins

- `@docusaurus/plugin-ideal-image` - Image optimization
- `docusaurus-plugin-sass` - SASS support  
- `@docusaurus/plugin-pwa` - Progressive Web App

## Conclusion

Docusaurus strikes the perfect balance between simplicity and power. It's ideal for:

- 📚 Documentation sites
- 📝 Developer blogs
- 🌱 Digital gardens
- 💼 Portfolios
- 📖 Knowledge bases

The React integration means you're never limited—you can always add custom functionality when needed.

This very site you're reading is built with Docusaurus, and I couldn't be happier with the choice!

Give it a try! 🦖

---

**Built something cool with Docusaurus? Share it with me on [X](https://x.com/cardiadev)!**
