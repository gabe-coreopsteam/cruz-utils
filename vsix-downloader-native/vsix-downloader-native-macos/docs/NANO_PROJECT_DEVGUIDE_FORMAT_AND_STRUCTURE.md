# Nano Project Dev Guide: Format and Structure Specification

**Version:** 1.0  
**Last Updated:** 2025-11-27

---

## Purpose

This document defines the standardized format and structure for writing Nano Projects within the **"DEV GUIDE TO YOUR FIRST REACT NATIVE APP EVER"** documentation. It ensures consistency, clarity, and maximum learning value for developers who are new to React Native.

---

## Target Audience

The Dev Guide is written for:
- Junior, mid-level, or senior developers who know how to program
- Developers proficient in other languages (Java, Python, etc.) but new to React Native
- Part-time developers or those returning to coding who need structured guidance
- Anyone who wants to learn React Native through hands-on building

**Key Assumption:** The reader knows **nothing** about React Native, TypeScript, or the JavaScript/Node.js ecosystem. Explain everything.

---

## What is a Nano Project?

A **Nano Project** is a deliberately chunked, quick-to-follow building block of a larger project. Each Nano Project:

1. **Reduces Fear of Failure** - Small, achievable goals build confidence
2. **Produces Working Artifacts** - At the end, you have something that works
3. **Teaches Through Doing** - Learn by building, not just reading
4. **Maps to Development Phases** - Each Phase from the development plan becomes one or more Nano Projects

---

## Document Structure

### 1. Abstract (Top of Document)

The Dev Guide begins with an abstract that explains:
- The importance of structured learning
- What Nano Projects are and why they matter
- How to use this guide effectively
- Prerequisites for the entire guide

### 2. Individual Nano Project Format

Each Nano Project follows this exact structure:

```markdown
---

## Nano Project [N]: [Title]

### Overview

[2-3 sentences describing what this Nano Project accomplishes and why it matters in the bigger picture.]

### What You'll Have at the End

[Bullet list of concrete artifacts/capabilities the reader will have upon completion]

- ✅ [Artifact 1]
- ✅ [Artifact 2]
- ✅ [Artifact 3]

### Prerequisites

[What must be completed/installed before starting this Nano Project]

- [ ] [Prerequisite 1]
- [ ] [Prerequisite 2]

---

### Tasks

#### Task 1: [Task Title]

[Brief explanation of what this task accomplishes]

##### Step 1.1: [Step Description]

[Detailed instructions]

```bash
$ [command to run]
```

**Expected Output:**
```
[What the user should see]
```

📚 **Documentation:** [React Native Docs - Topic](https://reactnative.dev/docs/...)

🔗 **Additional Resources:**
- [Resource Name](URL) - Brief description
- [Resource Name](URL) - Brief description

##### Step 1.2: [Step Description]

[Continue with detailed instructions...]

---

#### Task 2: [Task Title]

[Repeat structure as needed]

---

### Summary & Verification

**Congratulations!** You have completed Nano Project [N].

At this point, you should have:
- ✅ [Completed item 1]
- ✅ [Completed item 2]
- ✅ [Completed item 3]

**Verification Steps:**
1. [How to verify artifact 1 works]
2. [How to verify artifact 2 works]

**Troubleshooting:**
If something isn't working:
1. Go back through each step
2. Check for typos in commands
3. Verify all prerequisites are met
4. [Common issue and solution]

---
```

---

## Formatting Guidelines

### Command Examples

Always use the `$` prompt prefix for terminal commands:

```bash
$ npm install
$ cd macos && pod install
```

### Expected Output

Always show expected terminal output after commands when relevant:

```bash
$ npm --version
```

**Expected Output:**
```
11.6.1
```

### Code Blocks

Use language-specific code blocks with syntax highlighting:

```typescript
// TypeScript/TSX
const greeting: string = "Hello, World!";
```

```json
{
  "name": "example",
  "version": "1.0.0"
}
```

### Documentation Links

Every significant concept should link to official documentation:

📚 **Documentation:** [React Native - Getting Started](https://reactnative.dev/docs/getting-started)

### Additional Resources

Group supplementary resources with brief descriptions:

🔗 **Additional Resources:**
- [Node.js Downloads](https://nodejs.org/) - Download and install Node.js
- [Homebrew](https://brew.sh/) - Package manager for macOS

### Checkboxes

Use checkboxes for prerequisites and verification:

- [ ] Uncompleted item
- [x] Completed item

### Emoji Usage

Use emojis sparingly for visual cues:
- ✅ Success/completed items
- ⚠️ Warnings or important notes
- 📚 Documentation links
- 🔗 Additional resource links
- 💡 Tips and best practices
- 🛠️ Troubleshooting sections

---

## Section Order Within Each Nano Project

1. **Overview** - What and why
2. **What You'll Have at the End** - Concrete outcomes
3. **Prerequisites** - What's needed before starting
4. **Tasks** - The main content
   - Task N
     - Step N.1
     - Step N.2
     - ...
5. **Summary & Verification** - Recap and how to verify success
6. **Troubleshooting** - Common issues and solutions

---

## Phase-to-Nano-Project Mapping

Each Phase from the development plan maps to one or more Nano Projects:

| Development Phase | Nano Project(s) |
|-------------------|-----------------|
| Phase 1: Project Foundation | Nano Project 1 (may split if complex) |
| Phase 2: Core Logic | Nano Project 2, 3, ... |
| Phase 3: UI Implementation | Nano Project N, N+1, ... |
| Phase 4: Polish & Testing | Nano Project M, M+1, ... |

**Note:** A single Phase may be split into multiple Nano Projects if:
- The artifacts don't have natural cohesion
- The instructions would be too long for a single Nano Project
- Breaking it up improves the learning experience

When splitting occurs, report this to maintain alignment between the dev plan and the guide.

---

## Writing Style Guidelines

1. **Be Explicit** - Never assume the reader knows something
2. **Be Conversational** - Write as if explaining to a colleague
3. **Be Encouraging** - Acknowledge that learning is hard
4. **Be Practical** - Focus on what works, not theory
5. **Be Complete** - Include every command, every file, every step

---

## Example: Abbreviated Nano Project

```markdown
---

## Nano Project 1: Setting Up Your Development Environment

### Overview

Before building any React Native application, you need the right tools installed on your machine. This Nano Project walks you through installing Node.js, npm, Xcode, and verifying everything works correctly.

### What You'll Have at the End

- ✅ Node.js and npm installed and verified
- ✅ Xcode installed with Command Line Tools
- ✅ A terminal ready for React Native development

### Prerequisites

- [ ] A Mac running macOS 12.0 or later
- [ ] Administrator access to install software
- [ ] At least 20GB of free disk space (for Xcode)

---

### Tasks

#### Task 1: Install Node.js and npm

Node.js is a JavaScript runtime that allows you to run JavaScript outside of a browser. npm (Node Package Manager) comes bundled with Node.js and is used to install libraries and tools.

##### Step 1.1: Download and Install Node.js

Visit the official Node.js website and download the LTS (Long Term Support) version.

📚 **Documentation:** [Node.js Downloads](https://nodejs.org/en/download/)

##### Step 1.2: Verify Installation

Open your terminal and run:

```bash
$ node --version
```

**Expected Output:**
```
v22.18.0
```

Then verify npm:

```bash
$ npm --version
```

**Expected Output:**
```
11.6.1
```

---

### Summary & Verification

**Congratulations!** You have completed Nano Project 1.

At this point, you should have:
- ✅ Node.js version 22.x or higher installed
- ✅ npm version 11.x or higher installed
- ✅ Both commands working in your terminal

---
```

---

## Revision History

| Version | Date | Changes |
|---------|------|---------|
| 1.0 | 2025-11-27 | Initial specification |


