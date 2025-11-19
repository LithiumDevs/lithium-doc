# Introduction to Lithium

## What is Lithium?

Lithium is a modern, lightweight web framework built on top of **Lit** (Web Components) that provides an opinionated architecture for scalable web applications. It's designed to offer a development experience similar to frameworks like Angular or Vue, but leveraging native web standards.

## Philosophy

Lithium is based on three fundamental pillars:

### 1. **Web Standards**
- Built on native Web Components
- No heavy framework dependencies
- Compatible with any tech stack
- Interoperable with other libraries

### 2. **Declarative Simplicity**
- Decorators for defining components
- Integrated routing system
- Reactive state management with Signals
- Intuitive and expressive API

### 3. **Scalable Architecture**
- Clear separation between App, Modules, Pages, and Components
- Global and local event system
- Automatic lazy loading
- Built-in performance optimization

## Main Features

### 🎯 Layered Architecture
```
LithiumApp (Main application)
  └─ LithiumModule (Modules with routes)
      └─ LithiumPage (Pages)
          └─ LithiumElement (Reusable components)
```

### 🚀 Routing System
- Main router in the application
- Nested routers in modules
- Lazy loading of modules and pages
- Navigation guards with `beforeRoute`

### 📡 Communication System
- **EventBus**: Global events for component communication
- **Channels**: Shared reactive state with Signals (@lit-labs/signals)
- **Signals**: Local reactive state with computed values
- **Output**: Custom events upward in the tree

### ⚡ Performance Optimization
- **@defer**: Deferred loading after initial render
- **@lazy**: Load when element enters viewport
- **@delay**: Load with time delay
- Automatic dynamic imports

### 🎨 Styles and Theming
- CSS Modules with `?inline`
- Global styles inherited automatically
- Scoped styles per component
- Compatible with Material Web and other libraries

## When to Use Lithium?

### ✅ Ideal for:
- **Modern web applications** requiring scalable architecture
- **Projects that value web standards** and interoperability
- **Teams seeking simplicity** without sacrificing power
- **Micro-frontends** that need reusable components
- **Enterprise applications** with multiple modules

### ⚠️ Consider other options if:
- You need SSR/SSG immediately (use Next.js, Nuxt, etc.)
- Your team already masters another framework and the project is urgent
- You require a very mature ecosystem with thousands of specific libraries

## Requirements

### Prerequisites
- **JavaScript/TypeScript** basic-intermediate
- **HTML/CSS** fundamentals
- **Web Components concepts** (optional but helpful)
- **Lit** basics (learn along the way)

### Dependencies
```json
{
  "lit": "^3.0.0",
  "@lit-labs/signals": "^1.0.0",
  "@lit-labs/router": "^0.1.0"
}
```

### Development Tools
- **Node.js** 18+ (recommended 22+)
- **TypeScript** 5+
- **Vite** as bundler (recommended)
- Editor with TypeScript support (VS Code, WebStorm)

## Quick Installation

```bash
# Coming soon with CLI
npm create lithium-app my-app
cd my-app
npm install
npm run dev
```

## Lithium Project Structure

```
my-app/
├── src/
│   ├── my-app.ts              # Main application
│   ├── routes/
│   │   └── routes.ts          # Main routes
│   ├── modules/
│   │   ├── public/
│   │   │   ├── public.module.ts
│   │   │   ├── public.routes.ts
│   │   │   └── pages/
│   │   │       └── home/
│   │   │           ├── home.page.ts
│   │   │           └── home.page.css
│   │   └── admin/
│   │       └── ...
│   ├── components/
│   │   └── atomics/
│   │       └── button/
│   │           ├── button.atomic.ts
│   │           └── button.atomic.css
│   └── styles/
│       └── global.css
├── config/
│   └── lithium/               # Framework core
│       ├── lithium-app.ts
│       ├── lithium-module.ts
│       ├── lithium-page.ts
│       ├── lithium-element.ts
│       └── ...
├── index.html
├── package.json
├── tsconfig.json
└── vite.config.ts
```

## Community and Support

- **GitHub**: [github.com/lithium-js](https://github.com/lithium-js) _(coming soon)_
- **Discord**: [discord.gg/lithium](https://discord.gg/lithium) _(coming soon)_
- **Twitter**: [@lithiumjs](https://twitter.com/lithiumjs) _(coming soon)_

---

**Ready to start?** Continue with [Project Structure →](./02-project-structure.md)