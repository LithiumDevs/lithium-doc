# LithiumModule - Modules

## Introduction

`LithiumModule` is the base class for modules in Lithium. Modules group related functionality (pages, components, services) and have their own nested routing system. They are fundamental for organizing large applications in a scalable way.

## @defineModule Decorator

### Syntax

```typescript
@defineModule(options: DefineModuleOptions)
```

### Options

```typescript
interface DefineModuleOptions {
  tag: string;                          // Module HTML tag
  routes: RouteConfig[];                // Module routes
  styles?: (CSSResultGroup | string)[]; // Optional styles
}
```

## Basic Example

```typescript
// src/modules/public/public.module.ts
import { defineModule, LithiumModule } from '@lithium';
import { routes } from './public.routes.js';

@defineModule({
  tag: 'public-module',
  routes: routes
})
export class PublicModule extends LithiumModule {}
```

## Module Router

### Accessing the Router

The internal router is available as `this._routes`:

```typescript
export class PublicModule extends LithiumModule {
  render() {
    return html`
      <div class="module-container">
        ${this._routes.outlet()}
      </div>
    `;
  }
}
```

### Module Route Definition

```typescript
// src/modules/public/public.routes.ts
import { html } from 'lit';

export const routes = [
  {
    path: '',  // Relative route (maps to /)
    render: () => html`<home-page></home-page>`,
    enter: async () => {
      await import('./pages/home/home.page.js');
    },
  },
  {
    path: 'about',  // Maps to /about
    render: () => html`<about-page></about-page>`,
    enter: async () => {
      await import('./pages/about/about.page.js');
    },
  },
  {
    path: 'contact',  // Maps to /contact
    render: () => html`<contact-page></contact-page>`,
    enter: async () => {
      await import('./pages/contact/contact.page.js');
    },
  },
];
```

## Nested Routes

Modules allow nested routing. The parent module must use `/*` to pass the path to the child module:

### Main Routes

```typescript
// src/routes/routes.ts
export const routes = [
  {
    path: '/*',  // ← Important: /* to capture subroutes
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
];
```

### Module Routes

```typescript
// src/modules/public/public.routes.ts
export const routes = [
  {
    path: '',           // Maps to /
    render: () => html`<home-page></home-page>`,
  },
  {
    path: 'about',      // Maps to /about
    render: () => html`<about-page></about-page>`,
  },
  {
    path: 'products',   // Maps to /products
    render: () => html`<products-page></products-page>`,
  },
];
```

## Module Layouts

### Basic Layout

```typescript
@defineModule({
  tag: 'public-module',
  routes: routes
})
export class PublicModule extends LithiumModule {
  render() {
    return html`
      <public-header></public-header>
      
      <main class="module-content">
        ${this._routes.outlet()}
      </main>
      
      <public-footer></public-footer>
    `;
  }
}
```

### Layout con Sidebar

```typescript
@defineModule({
  tag: 'admin-module',
  routes: adminRoutes
})
export class AdminModule extends LithiumModule {
  render() {
    return html`
      <div class="admin-layout">
        <aside class="admin-sidebar">
          <admin-nav></admin-nav>
        </aside>
        
        <main class="admin-main">
          <header class="admin-header">
            <admin-breadcrumbs></admin-breadcrumbs>
          </header>
          
          <div class="admin-content">
            ${this._routes.outlet()}
          </div>
        </main>
      </div>
    `;
  }
}
```

### Layout Condicional

```typescript
export class PublicModule extends LithiumModule {
  @property() private showBanner = true;

  render() {
    return html`
      ${this.showBanner ? html`
        <promotional-banner 
          @close=${() => this.showBanner = false}>
        </promotional-banner>
      ` : ''}
      
      <public-header></public-header>
      
      <main>
        ${this._routes.outlet()}
      </main>
      
      <public-footer></public-footer>
    `;
  }
}
```

## Module Styles

### With CSS files

```typescript
import style from './public.module.css?inline';

@defineModule({
  tag: 'public-module',
  routes: routes,
  styles: [style]
})
export class PublicModule extends LithiumModule {}
```

```css
/* public.module.css */
:host {
  display: block;
  min-height: 100vh;
}

.module-content {
  min-height: calc(100vh - 200px);
  padding: var(--spacing-lg);
}
```

## Module State

### Using Properties

```typescript
export class AdminModule extends LithiumModule {
  @property() private isSidebarCollapsed = false;

  toggleSidebar() {
    this.isSidebarCollapsed = !this.isSidebarCollapsed;
  }

  render() {
    return html`
      <div class="admin-layout ${this.isSidebarCollapsed ? 'collapsed' : ''}">
        <aside class="sidebar">
          <button @click=${this.toggleSidebar}>
            Toggle
          </button>
          <admin-nav></admin-nav>
        </aside>
        
        <main>${this._routes.outlet()}</main>
      </div>
    `;
  }
}
```

### Use Channels

```typescript
export class PublicModule extends LithiumModule {
  connectedCallback() {
    super.connectedCallback();
    
    this.channel('publicState', {
      initialValue: { showPromo: true },
      storage: 'session'
    });
  }

  render() {
    const state = this.channel('publicState').value;
    
    return html`
      ${state.showPromo ? html`<promo-banner></promo-banner>` : ''}
      <main>${this._routes.outlet()}</main>
    `;
  }
}
```

## Module Structure

```
modules/public/
├── public.module.ts        # Module definition
├── public.module.css       # Module styles
├── public.routes.ts        # Module routes
├── pages/                  # Module pages
│   ├── home/
│   │   ├── home.page.ts
│   │   └── home.page.css
│   ├── about/
│   │   ├── about.page.ts
│   │   └── about.page.css
│   └── contact/
│       ├── contact.page.ts
│       └── contact.page.css
└── section/               # Module-specific sections
    ├── public-header/
    │   ├── public-header.component.ts
    │   └── public-header.component.css
    └── public-footer/
        ├── public-footer.component.ts
        └── public-footer.component.css
```

## Module Examples

### Public Module

```typescript
// src/modules/public/public.module.ts
import { defineModule, LithiumModule, html } from '@lithium';
import { routes } from './public.routes.js';
import style from './public.module.css?inline';

import './section/public-header/public-header.component.js';
import './section/public-footer/public-footer.component.js';

@defineModule({
  tag: 'public-module',
  routes: routes,
  styles: [style]
})
export class PublicModule extends LithiumModule {
  render() {
    return html`
      <public-header></public-header>
      <main class="public-content">
        ${this._routes.outlet()}
      </main>
      <public-footer></public-footer>
    `;
  }
}
```

### Admin Module with Guards

```typescript
// src/modules/admin/admin.module.ts
import { defineModule, LithiumModule, html } from '@lithium';
import { routes } from './admin.routes.js';

@defineModule({
  tag: 'admin-module',
  routes: routes
})
export class AdminModule extends LithiumModule {
  connectedCallback() {
    super.connectedCallback();
    this.checkAdminAccess();
  }

  private async checkAdminAccess() {
    const user = this.channel('user').value;
    
    if (!user || user.role !== 'admin') {
      this.navigate('/login', { 
        replace: true,
        state: { message: 'Admin access required' }
      });
    }
  }

  render() {
    return html`
      <div class="admin-layout">
        <aside class="admin-sidebar">
          <admin-nav></admin-nav>
        </aside>
        <main class="admin-main">
          ${this._routes.outlet()}
        </main>
      </div>
    `;
  }
}
```

### Authentication Module

```typescript
// src/modules/auth/auth.module.ts
import { defineModule, LithiumModule, html } from '@lithium';
import { routes } from './auth.routes.js';
import style from './auth.module.css?inline';

@defineModule({
  tag: 'auth-module',
  routes: routes,
  styles: [style]
})
export class AuthModule extends LithiumModule {
  render() {
    return html`
      <div class="auth-layout">
        <div class="auth-sidebar">
          <img src="/logo.svg" alt="Logo">
          <h1>Welcome to MyApp</h1>
          <p>Manage your business efficiently</p>
        </div>
        
        <div class="auth-content">
          ${this._routes.outlet()}
        </div>
      </div>
    `;
  }
}
```

## Module Communication

### Using EventBus

```typescript
// Module A emits event
export class ModuleA extends LithiumModule {
  private notify() {
    this.emit('moduleA:dataUpdated', { id: 123 });
  }
}

// Module B listens to event
export class ModuleB extends LithiumModule {
  connectedCallback() {
    super.connectedCallback();
    
    this.on('moduleA:dataUpdated', (data) => {
      console.log('Module A updated:', data);
      this.refreshData();
    });
  }
}
```

### Using Shared Channels

```typescript
// Any module can access
export class AnyModule extends LithiumModule {
  connectedCallback() {
    super.connectedCallback();
    
    // Read global channel
    const user = this.channel('user').value;
    
    // Listen to changes
    this.subscribe('user', (newUser) => {
      console.log('User changed:', newUser);
    });
  }
}
```

## Module Lazy Loading

### In Main Routes

```typescript
// src/routes/routes.ts
export const routes = [
  {
    path: '/*',
    render: () => html`<public-module></public-module>`,
    enter: async () => {
      // Dynamic module loading
      await import('./modules/public/public.module.js');
    },
  },
  {
    path: '/admin/*',
    render: () => html`<admin-module></admin-module>`,
    enter: async () => {
      // Only loads when navigating to /admin
      await import('./modules/admin/admin.module.js');
    },
  },
];
```

## Best Practices

### ✅ Do
- One module per functionality/domain
- Specific layouts in each module
- Lazy loading of large modules
- Relative routes within the module
- Shared components in `section/` folder

### ❌ Avoid
- Modules that are too large (split into sub-modules)
- Circular dependencies between modules
- Complex business logic in the module
- Duplicating components between modules