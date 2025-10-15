# Dev Garden - Project Structure

## Overview
This Docusaurus project is fully customized for Carlos Diaz (@cardiadev) with a complete LeetCode 75 study plan structure.

## Project Information
- **Owner:** Carlos Diaz
- **Social Media:** @cardiadev (all platforms)
- **Repository:** https://github.com/cardiadev/dev-garden
- **Language:** English

## Documentation Structure

```
docs/
├── intro.md                          # Welcome page with project overview
└── leetcode-75/                      # LeetCode 75 study plan (75 problems total)
    ├── array-string/                 # 9 problems
    ├── two-pointers/                 # 4 problems
    ├── sliding-window/               # 4 problems
    ├── prefix-sum/                   # 2 problems
    ├── hash-map-set/                 # 4 problems
    ├── stack/                        # 3 problems
    ├── queue/                        # 2 problems
    ├── linked-list/                  # 4 problems
    ├── binary-tree-dfs/              # 6 problems
    ├── binary-tree-bfs/              # 2 problems
    ├── binary-search-tree/           # 2 problems
    ├── graphs-dfs/                   # 4 problems
    ├── graphs-bfs/                   # 2 problems
    ├── heap-priority-queue/          # 4 problems
    ├── binary-search/                # 4 problems
    ├── backtracking/                 # 2 problems
    ├── dp-1d/                        # 4 problems
    ├── dp-multidimensional/          # 4 problems
    ├── bit-manipulation/             # 3 problems
    ├── trie/                         # 2 problems
    ├── intervals/                    # 2 problems
    └── monotonic-stack/              # 2 problems
```

## Problem File Template

Each LeetCode problem file follows this structure:

```markdown
---
sidebar_position: [number]
title: "[Problem Title]"
tags: ["Tag1", "Tag2", "Tag3"]
---

# [Problem Title]

> **Difficulty:** Easy/Medium/Hard

[Problem description]

**Problem Link:** [LeetCode - Problem](https://leetcode.com/problems/problem-slug/)

***

### Intuition
[Core idea explanation]

***

### Approach
[Step-by-step solution approach]

***

### Complexity
#### Time complexity: $O(N)$
[Time complexity explanation]

#### Space complexity: $O(1)$
[Space complexity explanation]

***

### Code
```javascript
// Your solution code
```

***

### Notes
[Additional notes, edge cases, or alternative approaches]
```

## Development Commands

### Start Development Server
```bash
npm start
```
Opens browser at http://localhost:3000

### Build for Production
```bash
npm build
```

### Deploy to GitHub Pages
```bash
npm run deploy
```

## Configuration Files

- **docusaurus.config.ts** - Main configuration (updated with @cardiadev info)
- **sidebars.ts** - Sidebar auto-generation (no changes needed)
- **docs/leetcode-75/_category_.json** - Main LeetCode 75 section config
- **docs/leetcode-75/[category]/_category_.json** - Individual category configs

## Next Steps

1. **Fill in problem solutions:** Start with the problems you've already solved
2. **Customize styling:** Modify `src/css/custom.css` if needed
3. **Add blog posts:** Use the `blog/` directory for additional content
4. **Update social links:** Verify all social media links in `docusaurus.config.ts`

## Completed Customizations

✅ Updated site title and tagline  
✅ Changed organization to @cardiadev  
✅ Updated all GitHub links  
✅ Created LeetCode 75 structure (all 75 problems)  
✅ Removed default tutorial content  
✅ Updated navbar and footer with custom links  
✅ Created welcoming intro page  
✅ Set up proper categories with descriptions  

## Problem Status

- **Completed:** 1/75 (Merge Strings Alternately)
- **Ready for solutions:** 74/75

Each problem file has a template ready for you to fill in with your solution!

---

**Happy Coding! 🌱**
