---
layout: home

hero:
  name: "Lithium"
  text: "Modern Framework for Lit"
  tagline: Build scalable web applications with Web Components and native standards
  actions:
    - theme: brand
      text: Get Started
      link: /01-introduction
    - theme: alt
      text: View on GitHub
      link: https://github.com/your-repo/lithium

features:
  - icon: 🚀
    title: Web Standards First
    details: Built on native Web Components with Lit. No heavy framework dependencies, fully interoperable with any tech stack.
  
  - icon: ⚡
    title: Reactive by Design
    details: Integrated Signals for fine-grained reactivity. Automatic UI updates with minimal boilerplate.
  
  - icon: 🎯
    title: Scalable Architecture
    details: Clear separation between App, Modules, Pages, and Elements. Built-in routing, lazy loading, and code splitting.
  
  - icon: 🎨
    title: Decorator-Based API
    details: Intuitive decorators for components (@defineApp, @definePage, @defineElement) and optimizations (@lazy, @defer, @delay).
  
  - icon: 🌐
    title: Built-in i18n
    details: Reactive internationalization system with automatic UI updates, localStorage persistence, and browser language detection.
  
  - icon: 🔌
    title: Event-Driven Communication
    details: Global and local event bus for component communication. Type-safe events with channel-based organization.
  
  - icon: 📦
    title: Optimized Performance
    details: Automatic lazy loading, deferred rendering, intersection observers, and conditional rendering out of the box.
  
  - icon: 🛠️
    title: Developer Experience
    details: TypeScript-first, hot module replacement, zero-config setup with Vite, and comprehensive documentation.
---

## Quick Example

```typescript
import { defineElement, html, LithiumElement } from '@lithium';

@defineElement({ 
  tag: 'example-component',
  style: [styles]
})
export class ExampleComponent extends LithiumElement {
  render() {
    return html`
      <h1>Welcome to Lithium</h1>
      <p>Modern framework for Web Components</p>
    `;
  }
}
```

## Why Lithium?

### Native Web Components
Leverage the power of Web Components without the complexity. Lithium provides a clean abstraction over Lit while maintaining full compatibility with web standards.

### Framework-Like DX
Get the developer experience of modern frameworks (Angular, Vue) with decorators, routing, and state management, but with smaller bundles and better performance.

### Progressive Enhancement
Start small and scale as needed. Add features like lazy loading, i18n, and optimizations with simple decorators - no configuration required.

### Future-Proof
Built on web standards that will be supported forever. No framework lock-in, no breaking changes every year.

## Get Started

1. **[Introduction](./01-introduction.md)** - Learn about Lithium's philosophy and core concepts
2. **[Project Structure](./02-project-structure.md)** - Understand how to organize your application
3. **[Lithium App](./03-lithium-app.md)** - Create your root application component
4. **[Routing](./07-routing.md)** - Set up navigation and routes
5. **[i18n](./10-internationalization.md)** - Add multilingual support

## Community

- **Discord**: Join our community
- **GitHub**: Contribute to the project
- **Twitter**: Follow for updates