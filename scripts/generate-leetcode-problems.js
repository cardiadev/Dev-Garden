const fs = require('fs');
const path = require('path');

const problems = [
  // Array / String
  { folder: 'array-string', position: 1, title: 'Merge Strings Alternately', difficulty: 'Easy', tags: ['Array', 'Two Pointers', 'String'] },
  { folder: 'array-string', position: 2, title: 'Greatest Common Divisor of Strings', difficulty: 'Easy', tags: ['Math', 'String'] },
  { folder: 'array-string', position: 3, title: 'Kids With the Greatest Number of Candies', difficulty: 'Easy', tags: ['Array'] },
  { folder: 'array-string', position: 4, title: 'Can Place Flowers', difficulty: 'Easy', tags: ['Array', 'Greedy'] },
  { folder: 'array-string', position: 5, title: 'Reverse Vowels of a String', difficulty: 'Easy', tags: ['Two Pointers', 'String'] },
  { folder: 'array-string', position: 6, title: 'Reverse Words in a String', difficulty: 'Medium', tags: ['Two Pointers', 'String'] },
  { folder: 'array-string', position: 7, title: 'Product of Array Except Self', difficulty: 'Medium', tags: ['Array', 'Prefix Sum'] },
  { folder: 'array-string', position: 8, title: 'Increasing Triplet Subsequence', difficulty: 'Medium', tags: ['Array', 'Greedy'] },
  { folder: 'array-string', position: 9, title: 'String Compression', difficulty: 'Medium', tags: ['Two Pointers', 'String'] },
  
  // Two Pointers
  { folder: 'two-pointers', position: 1, title: 'Move Zeroes', difficulty: 'Easy', tags: ['Array', 'Two Pointers'] },
  { folder: 'two-pointers', position: 2, title: 'Is Subsequence', difficulty: 'Easy', tags: ['Two Pointers', 'String', 'Dynamic Programming'] },
  { folder: 'two-pointers', position: 3, title: 'Container With Most Water', difficulty: 'Medium', tags: ['Array', 'Two Pointers', 'Greedy'] },
  { folder: 'two-pointers', position: 4, title: 'Max Number of K-Sum Pairs', difficulty: 'Medium', tags: ['Array', 'Hash Table', 'Two Pointers', 'Sorting'] },
  
  // Sliding Window
  { folder: 'sliding-window', position: 1, title: 'Maximum Average Subarray I', difficulty: 'Easy', tags: ['Array', 'Sliding Window'] },
  { folder: 'sliding-window', position: 2, title: 'Maximum Number of Vowels in a Substring of Given Length', difficulty: 'Medium', tags: ['String', 'Sliding Window'] },
  { folder: 'sliding-window', position: 3, title: 'Max Consecutive Ones III', difficulty: 'Medium', tags: ['Array', 'Binary Search', 'Sliding Window', 'Prefix Sum'] },
  { folder: 'sliding-window', position: 4, title: 'Longest Subarray of 1\'s After Deleting One Element', difficulty: 'Medium', tags: ['Array', 'Dynamic Programming', 'Sliding Window'] },
  
  // Prefix Sum
  { folder: 'prefix-sum', position: 1, title: 'Find the Highest Altitude', difficulty: 'Easy', tags: ['Array', 'Prefix Sum'] },
  { folder: 'prefix-sum', position: 2, title: 'Find Pivot Index', difficulty: 'Easy', tags: ['Array', 'Prefix Sum'] },
  
  // Hash Map / Set
  { folder: 'hash-map-set', position: 1, title: 'Find the Difference of Two Arrays', difficulty: 'Easy', tags: ['Array', 'Hash Table'] },
  { folder: 'hash-map-set', position: 2, title: 'Unique Number of Occurrences', difficulty: 'Easy', tags: ['Array', 'Hash Table'] },
  { folder: 'hash-map-set', position: 3, title: 'Determine if Two Strings Are Close', difficulty: 'Medium', tags: ['Hash Table', 'String', 'Sorting'] },
  { folder: 'hash-map-set', position: 4, title: 'Equal Row and Column Pairs', difficulty: 'Medium', tags: ['Array', 'Hash Table', 'Matrix', 'Simulation'] },
  
  // Stack
  { folder: 'stack', position: 1, title: 'Removing Stars From a String', difficulty: 'Medium', tags: ['String', 'Stack', 'Simulation'] },
  { folder: 'stack', position: 2, title: 'Asteroid Collision', difficulty: 'Medium', tags: ['Array', 'Stack', 'Simulation'] },
  { folder: 'stack', position: 3, title: 'Decode String', difficulty: 'Medium', tags: ['String', 'Stack', 'Recursion'] },
  
  // Queue
  { folder: 'queue', position: 1, title: 'Number of Recent Calls', difficulty: 'Easy', tags: ['Design', 'Queue', 'Data Stream'] },
  { folder: 'queue', position: 2, title: 'Dota2 Senate', difficulty: 'Medium', tags: ['String', 'Greedy', 'Queue'] },
  
  // Linked List
  { folder: 'linked-list', position: 1, title: 'Delete the Middle Node of a Linked List', difficulty: 'Medium', tags: ['Linked List', 'Two Pointers'] },
  { folder: 'linked-list', position: 2, title: 'Odd Even Linked List', difficulty: 'Medium', tags: ['Linked List'] },
  { folder: 'linked-list', position: 3, title: 'Reverse Linked List', difficulty: 'Easy', tags: ['Linked List', 'Recursion'] },
  { folder: 'linked-list', position: 4, title: 'Maximum Twin Sum of a Linked List', difficulty: 'Medium', tags: ['Linked List', 'Two Pointers', 'Stack'] },
  
  // Binary Tree - DFS
  { folder: 'binary-tree-dfs', position: 1, title: 'Maximum Depth of Binary Tree', difficulty: 'Easy', tags: ['Tree', 'Depth-First Search', 'Breadth-First Search', 'Binary Tree'] },
  { folder: 'binary-tree-dfs', position: 2, title: 'Leaf-Similar Trees', difficulty: 'Easy', tags: ['Tree', 'Depth-First Search', 'Binary Tree'] },
  { folder: 'binary-tree-dfs', position: 3, title: 'Count Good Nodes in Binary Tree', difficulty: 'Medium', tags: ['Tree', 'Depth-First Search', 'Breadth-First Search', 'Binary Tree'] },
  { folder: 'binary-tree-dfs', position: 4, title: 'Path Sum III', difficulty: 'Medium', tags: ['Tree', 'Depth-First Search', 'Binary Tree'] },
  { folder: 'binary-tree-dfs', position: 5, title: 'Longest ZigZag Path in a Binary Tree', difficulty: 'Medium', tags: ['Dynamic Programming', 'Tree', 'Depth-First Search', 'Binary Tree'] },
  { folder: 'binary-tree-dfs', position: 6, title: 'Lowest Common Ancestor of a Binary Tree', difficulty: 'Medium', tags: ['Tree', 'Depth-First Search', 'Binary Tree'] },
  
  // Binary Tree - BFS
  { folder: 'binary-tree-bfs', position: 1, title: 'Binary Tree Right Side View', difficulty: 'Medium', tags: ['Tree', 'Depth-First Search', 'Breadth-First Search', 'Binary Tree'] },
  { folder: 'binary-tree-bfs', position: 2, title: 'Maximum Level Sum of a Binary Tree', difficulty: 'Medium', tags: ['Tree', 'Depth-First Search', 'Breadth-First Search', 'Binary Tree'] },
  
  // Binary Search Tree
  { folder: 'binary-search-tree', position: 1, title: 'Search in a Binary Search Tree', difficulty: 'Easy', tags: ['Tree', 'Binary Search Tree', 'Binary Tree'] },
  { folder: 'binary-search-tree', position: 2, title: 'Delete Node in a BST', difficulty: 'Medium', tags: ['Tree', 'Binary Search Tree', 'Binary Tree'] },
  
  // Graphs - DFS
  { folder: 'graphs-dfs', position: 1, title: 'Keys and Rooms', difficulty: 'Medium', tags: ['Depth-First Search', 'Breadth-First Search', 'Graph'] },
  { folder: 'graphs-dfs', position: 2, title: 'Number of Provinces', difficulty: 'Medium', tags: ['Depth-First Search', 'Breadth-First Search', 'Union Find', 'Graph'] },
  { folder: 'graphs-dfs', position: 3, title: 'Reorder Routes to Make All Paths Lead to the City Zero', difficulty: 'Medium', tags: ['Depth-First Search', 'Breadth-First Search', 'Graph'] },
  { folder: 'graphs-dfs', position: 4, title: 'Evaluate Division', difficulty: 'Medium', tags: ['Array', 'Depth-First Search', 'Breadth-First Search', 'Union Find', 'Graph', 'Shortest Path'] },
  
  // Graphs - BFS
  { folder: 'graphs-bfs', position: 1, title: 'Nearest Exit from Entrance in Maze', difficulty: 'Medium', tags: ['Array', 'Breadth-First Search', 'Matrix'] },
  { folder: 'graphs-bfs', position: 2, title: 'Rotting Oranges', difficulty: 'Medium', tags: ['Array', 'Breadth-First Search', 'Matrix'] },
  
  // Heap / Priority Queue
  { folder: 'heap-priority-queue', position: 1, title: 'Kth Largest Element in an Array', difficulty: 'Medium', tags: ['Array', 'Divide and Conquer', 'Sorting', 'Heap (Priority Queue)', 'Quickselect'] },
  { folder: 'heap-priority-queue', position: 2, title: 'Smallest Number in Infinite Set', difficulty: 'Medium', tags: ['Hash Table', 'Design', 'Heap (Priority Queue)'] },
  { folder: 'heap-priority-queue', position: 3, title: 'Maximum Subsequence Score', difficulty: 'Medium', tags: ['Array', 'Greedy', 'Sorting', 'Heap (Priority Queue)'] },
  { folder: 'heap-priority-queue', position: 4, title: 'Total Cost to Hire K Workers', difficulty: 'Medium', tags: ['Array', 'Two Pointers', 'Simulation', 'Heap (Priority Queue)'] },
  
  // Binary Search
  { folder: 'binary-search', position: 1, title: 'Guess Number Higher or Lower', difficulty: 'Easy', tags: ['Binary Search', 'Interactive'] },
  { folder: 'binary-search', position: 2, title: 'Successful Pairs of Spells and Potions', difficulty: 'Medium', tags: ['Array', 'Two Pointers', 'Binary Search', 'Sorting'] },
  { folder: 'binary-search', position: 3, title: 'Find Peak Element', difficulty: 'Medium', tags: ['Array', 'Binary Search'] },
  { folder: 'binary-search', position: 4, title: 'Koko Eating Bananas', difficulty: 'Medium', tags: ['Array', 'Binary Search'] },
  
  // Backtracking
  { folder: 'backtracking', position: 1, title: 'Letter Combinations of a Phone Number', difficulty: 'Medium', tags: ['Hash Table', 'String', 'Backtracking'] },
  { folder: 'backtracking', position: 2, title: 'Combination Sum III', difficulty: 'Medium', tags: ['Array', 'Backtracking'] },
  
  // DP - 1D
  { folder: 'dp-1d', position: 1, title: 'N-th Tribonacci Number', difficulty: 'Easy', tags: ['Math', 'Dynamic Programming', 'Memoization'] },
  { folder: 'dp-1d', position: 2, title: 'Min Cost Climbing Stairs', difficulty: 'Easy', tags: ['Array', 'Dynamic Programming'] },
  { folder: 'dp-1d', position: 3, title: 'House Robber', difficulty: 'Medium', tags: ['Array', 'Dynamic Programming'] },
  { folder: 'dp-1d', position: 4, title: 'Domino and Tromino Tiling', difficulty: 'Medium', tags: ['Dynamic Programming'] },
  
  // DP - Multidimensional
  { folder: 'dp-multidimensional', position: 1, title: 'Unique Paths', difficulty: 'Medium', tags: ['Math', 'Dynamic Programming', 'Combinatorics'] },
  { folder: 'dp-multidimensional', position: 2, title: 'Longest Common Subsequence', difficulty: 'Medium', tags: ['String', 'Dynamic Programming'] },
  { folder: 'dp-multidimensional', position: 3, title: 'Best Time to Buy and Sell Stock with Transaction Fee', difficulty: 'Medium', tags: ['Array', 'Dynamic Programming', 'Greedy'] },
  { folder: 'dp-multidimensional', position: 4, title: 'Edit Distance', difficulty: 'Medium', tags: ['String', 'Dynamic Programming'] },
  
  // Bit Manipulation
  { folder: 'bit-manipulation', position: 1, title: 'Counting Bits', difficulty: 'Easy', tags: ['Dynamic Programming', 'Bit Manipulation'] },
  { folder: 'bit-manipulation', position: 2, title: 'Single Number', difficulty: 'Easy', tags: ['Array', 'Bit Manipulation'] },
  { folder: 'bit-manipulation', position: 3, title: 'Minimum Flips to Make a OR b Equal to c', difficulty: 'Medium', tags: ['Bit Manipulation'] },
  
  // Trie
  { folder: 'trie', position: 1, title: 'Implement Trie (Prefix Tree)', difficulty: 'Medium', tags: ['Hash Table', 'String', 'Design', 'Trie'] },
  { folder: 'trie', position: 2, title: 'Search Suggestions System', difficulty: 'Medium', tags: ['Array', 'String', 'Trie', 'Sorting', 'Heap (Priority Queue)'] },
  
  // Intervals
  { folder: 'intervals', position: 1, title: 'Non-overlapping Intervals', difficulty: 'Medium', tags: ['Array', 'Dynamic Programming', 'Greedy', 'Sorting'] },
  { folder: 'intervals', position: 2, title: 'Minimum Number of Arrows to Burst Balloons', difficulty: 'Medium', tags: ['Array', 'Greedy', 'Sorting'] },
  
  // Monotonic Stack
  { folder: 'monotonic-stack', position: 1, title: 'Daily Temperatures', difficulty: 'Medium', tags: ['Array', 'Stack', 'Monotonic Stack'] },
  { folder: 'monotonic-stack', position: 2, title: 'Online Stock Span', difficulty: 'Medium', tags: ['Stack', 'Design', 'Monotonic Stack', 'Data Stream'] },
];

function slugify(title) {
  return title
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '');
}

function generateProblemTemplate(problem) {
  const slug = slugify(problem.title);
  const tagsString = problem.tags.map(tag => `"${tag}"`).join(', ');
  
  return `---
sidebar_position: ${problem.position}
title: "${problem.title}"
tags: [${tagsString}]
---

# ${problem.title}

> **Difficulty:** ${problem.difficulty}

[View on LeetCode](https://leetcode.com/problems/${slug}/)

***

### Problem Statement

_Add problem description here._

***

### Intuition

_Explain the core idea behind your solution._

***

### Approach

1. _Step 1 description_
2. _Step 2 description_
3. _Step 3 description_

***

### Complexity

#### Time complexity: $O(N)$

_Explain time complexity._

#### Space complexity: $O(1)$

_Explain space complexity._

***

### Code

\`\`\`javascript
/**
 * Solution for ${problem.title}
 */
function solution() {
    // Your code here
}
\`\`\`

***

### Notes

_Add any additional notes, edge cases, or alternative approaches here._
`;
}

// Generate all problem files
problems.forEach(problem => {
  const docsPath = path.join(__dirname, '..', 'docs', 'leetcode-75', problem.folder);
  const slug = slugify(problem.title);
  const filename = `${slug}.mdx`;
  const filepath = path.join(docsPath, filename);
  
  // Skip if file already exists (don't overwrite existing solutions)
  if (fs.existsSync(filepath)) {
    console.log(`⏭️  Skipping (already exists): ${filepath}`);
    return;
  }
  
  const content = generateProblemTemplate(problem);
  
  fs.writeFileSync(filepath, content, 'utf8');
  console.log(`✅ Created: ${filepath}`);
});

console.log('\n🎉 All LeetCode 75 problem files generated!');
