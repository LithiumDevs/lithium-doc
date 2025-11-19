# LithiumApp - Main Application

## Introduction

`LithiumApp` is the base class for the main Lithium application. It represents your application's entry point and handles main routing. There should only be **one instance** of `LithiumApp` per application.

## @defineApp Decorator

### Syntax

```typescript
@defineApp(options: DefineAppOptions)
```

### Options

```typescript
interface DefineAppOptions {
  tag: string;                          // HTML tag of the component
  routes: RouteConfig[];                // Main routes
  styles?: (CSSResultGroup | string)[]; // Optional styles
}
```

## Basic Example

```typescript
// src/main-app.ts
import { html } from 'lit';
import { defineApp, LithiumApp } from '@lithium';
import { routes } from './routes/routes.js';
import style from './main-app.style.css?inline';

@defineApp({
  tag: 'main-app',
  routes: routes,
  styles: [style]
})
export class MainApp extends LithiumApp {
  render() {
    return html`
      <main>
        ${this._router.outlet()}
      </main>
    `;
  }
}
```

## Main Router

### Accessing the Router

The router is automatically available as `this._router`:

```typescript
export class MainApp extends LithiumApp {
  render() {
    return html`
      <main>
        ${this._router.outlet()}  <!-- Renders the active route -->
      </main>
    `;
  }
}
```

### Route Definition

```typescript
// src/routes/routes.ts
import { html } from 'lit';

export const routes = [
  {
    path: '/',
    render: () => html`<public-module></public-module>`,
    enter: async () => {
      await import('./modules/public/public.module.js');
    },
  },
  {
    path: '/admin/*',
    render: () => html`<admin-module></admin-module>`,
    enter: async () => {
      await import('./modules/admin/admin.module.js');
    },
  },
  {
    path: '/auth/*',
    render: () => html`<auth-module></auth-module>`,
    enter: async () => {
      await import('./modules/auth/auth.module.js');
    },
  },
];
```

## Global Layouts

You can define a global layout that wraps all pages:

### Basic Layout

```typescript
@defineApp({
  tag: 'main-app',
  routes: routes
})
export class MainApp extends LithiumApp {
  render() {
    return html`
      <app-header></app-header>
      
      <main class="app-content">
        ${this._router.outlet()}
      </main>
      
      <app-footer></app-footer>
    `;
  }
}
```

### Layout con Sidebar

```typescript
@defineApp({
  tag: 'main-app',
  routes: routes
})
export class MainApp extends LithiumApp {
  render() {
    return html`
      <div class="app-layout">
        <aside class="sidebar">
          <app-nav></app-nav>
        </aside>
        
        <main class="main-content">
          <header class="top-bar">
            <app-breadcrumbs></app-breadcrumbs>
          </header>
          
          <div class="content">
            ${this._router.outlet()}
          </div>
        </main>
      </div>
    `;
  }
}
```

### Conditional Layout

```typescript
export class MainApp extends LithiumApp {
  @property() private showSidebar = true;

  render() {
    return html`
      <div class="app ${this.showSidebar ? 'with-sidebar' : 'full-width'}">
        ${this.showSidebar ? html`
          <aside class="sidebar">
            <app-nav></app-nav>
          </aside>
        ` : ''}
        
        <main>
          ${this._router.outlet()}
        </main>
      </div>
    `;
  }
}
```

## Navigation Guards

You can use the `<lithium-router>` component with guards:

```typescript
export class MainApp extends LithiumApp {
  render() {
    return html`
      <main>
        <lithium-router .beforeRoute=${this.authGuard}>
          ${this._router.outlet()}
        </lithium-router>
      </main>
    `;
  }

  private async authGuard(path: string) {
    // Verify authentication
    const isAuthenticated = await checkAuth();
    
    // Public routes
    const publicPaths = ['/login', '/register', '/'];
    if (publicPaths.includes(path)) {
      return { continue: true };
    }
    
    // Protect private routes
    if (!isAuthenticated) {
      return {
        continue: false,
        redirect: '/login'
      };
    }
    
    return { continue: true };
  }
}
```

## Application Styles

### With CSS File

```typescript
import style from './main-app.style.css?inline';

@defineApp({
  tag: 'main-app',
  routes: routes,
  styles: [style]
})
export class MainApp extends LithiumApp {}
```

```css
/* main-app.style.css */
:host {
  display: block;
  min-height: 100vh;
}

.app-layout {
  display: flex;
  min-height: 100vh;
}

.main-content {
  flex: 1;
  display: flex;
  flex-direction: column;
}
```

### Multiple CSS Files

```typescript
import baseStyle from './base.css?inline';
import layoutStyle from './layout.css?inline';
import themeStyle from './theme.css?inline';

@defineApp({
  tag: 'main-app',
  routes: routes,
  styles: [baseStyle, layoutStyle, themeStyle]
})
```

## Global State

### Using Channels

```typescript
export class MainApp extends LithiumApp {
  connectedCallback() {
    super.connectedCallback();
    
    // Create global user channel
    this.channel('user', {
      initialValue: null,
      storage: 'session'
    });
    
    // Create theme channel
    this.channel('theme', {
      initialValue: 'light',
      storage: 'local'
    });
  }

  render() {
    const theme = this.channel('theme').value;
    
    return html`
      <div class="app theme-${theme}">
        ${this._router.outlet()}
      </div>
    `;
  }
}
```

## Application Initialization

### Loading Initial Data

```typescript
export class MainApp extends LithiumApp {
  private isInitialized = false;

  async connectedCallback() {
    super.connectedCallback();
    
    await this.initialize();
  }

  private async initialize() {
    try {
      // Load configuration
      const config = await loadConfig();
      this.channel('config').set(config);
      
      // Verify authentication
      const user = await checkAuth();
      if (user) {
        this.channel('user').set(user);
      }
      
      this.isInitialized = true;
      this.requestUpdate();
    } catch (error) {
      console.error('Error initializing app:', error);
    }
  }

  render() {
    if (!this.isInitialized) {
      return html`<app-loading></app-loading>`;
    }
    
    return html`
      <main>${this._router.outlet()}</main>
    `;
  }
}
```

## Integration with index.html

```html
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>My Lithium App</title>
  
  <!-- Fonts -->
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;700&display=swap" rel="stylesheet">
</head>
<body>
  <!-- Your Lithium application -->
  <main-app></main-app
  
  <!-- Entry script -->
  <script type="module" src="/src/main-app.ts"></script>
</body>
</html>
```

## Complete Example

```typescript
// src/main-app.ts
import { html } from 'lit';
import { defineApp, LithiumApp, property } from '@lithium';
import { routes } from './routes/routes.js';
import style from './main-app.style.css?inline';

@defineApp({
  tag: 'main-app',
  routes: routes,
  styles: [style]
})
export class MainApp extends LithiumApp {
  @property() private isLoading = true;

  async connectedCallback() {
    super.connectedCallback();
    await this.init();
  }

  private async init() {
    try {
      // Initialize global channels
      this.channel('user', { initialValue: null, storage: 'session' });
      this.channel('theme', { initialValue: 'light', storage: 'local' });
      
      // Load user if session exists
      const user = await this.loadUser();
      if (user) {
        this.channel('user').set(user);
      }
      
      this.isLoading = false;
    } catch (error) {
      console.error('Init error:', error);
      this.isLoading = false;
    }
  }

  private async loadUser() {
    // User loading logic
    return null;
  }

  private async authGuard(path: string) {
    const user = this.channel('user').value;
    const publicPaths = ['/login', '/register', '/'];
    
    if (!user && !publicPaths.includes(path)) {
      return { continue: false, redirect: '/login' };
    }
    
    return { continue: true };
  }

  render() {
    if (this.isLoading) {
      return html`
        <div class="app-loading">
          <span>Loading...</span>
        </div>
      `;
    }

    return html`
      <div class="app-container">
        <lithium-router .beforeRoute=${this.authGuard}>
          ${this._router.outlet()}
        </lithium-router>
      </div>
    `;
  }
}
```

## Best Practices

### ✅ Do
- Keep `LithiumApp` simple and focused on routing
- Use modules to organize functionality
- Define global state in `connectedCallback`
- Use guards to protect routes
- Lazy loading of modules with `enter`

### ❌ Avoid
- Complex business logic in `LithiumApp`
- Multiple instances of `LithiumApp`
- Loading all modules at startup
- Duplicating layouts in each module