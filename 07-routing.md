# Routing - Route System

## Introduction

Lithium uses **@lit-labs/router** for client-side routing with support for:
- Nested routes (nested routing)
- Lazy loading of modules and pages
- Guards (route protection)
- Route parameters
- Query strings

## Route Architecture

```
LithiumApp (Router principal)
├── /             → HomeModule
├── /about        → AboutPage
└── /admin/*      → AdminModule (nested routing)
    ├── /admin           → DashboardPage
    ├── /admin/users     → UsersPage
    └── /admin/settings  → SettingsPage
```

## LithiumApp - Main Router

### Basic Configuration

```typescript
// src/my-app.ts
import { defineApp, LithiumApp, html } from '@lithium';
import { Router } from '@lit-labs/router';

@defineApp({ 
  tag: 'my-app',
  styles: [globalStyles]
})
export class MyApp extends LithiumApp {
  private _router = new Router(this, [
    { path: '/', render: () => html`<home-page></home-page>` },
    { path: '/about', render: () => html`<about-page></about-page>` },
    { path: '/contact', render: () => html`<contact-page></contact-page>` }
  ]);

  render() {
    return html`
      <div class="app-container">
        <nav-bar></nav-bar>
        <main>${this._router.outlet()}</main>
        <footer-component></footer-component>
      </div>
    `;
  }
}
```

### Con Guards

```typescript
@defineApp({ tag: 'my-app' })
export class MyApp extends LithiumApp {
  private _router = new Router(this, [
    { path: '/', render: () => html`<home-page></home-page>` },
    { path: '/login', render: () => html`<login-page></login-page>` },
    { 
      path: '/dashboard', 
      render: () => html`<dashboard-page></dashboard-page>`,
      enter: async () => {
        const isAuth = this.channel('user').value;
        if (!isAuth) {
          this.navigate('/login');
          return false;
        }
        return true;
      }
    }
  ]);

  render() {
    return html`<main>${this._router.outlet()}</main>`;
  }
}
```

## LithiumModule - Nested Routes

### Module Structure

```
src/modules/admin/
├── admin.module.ts          # Módulo con Routes
├── admin.routes.ts          # Definición de rutas
├── admin.layout.ts          # Layout del módulo (opcional)
└── pages/
    ├── dashboard/
    │   ├── dashboard.page.ts
    │   └── dashboard.page.css
    ├── users/
    │   ├── users.page.ts
    │   └── users.page.css
    └── settings/
        ├── settings.page.ts
        └── settings.page.css
```

### Module with Routes

```typescript
// src/modules/admin/admin.module.ts
import { defineModule, LithiumModule, html } from '@lithium';
import { Routes } from '@lit-labs/router';
import { adminRoutes } from './admin.routes';
import style from './admin.module.css?inline';

@defineModule({ 
  tag: 'admin-module',
  styles: [style]
})
export class AdminModule extends LithiumModule {
  private _routes = new Routes(this, adminRoutes);

  render() {
    return html`
      <div class="admin-container">
        <aside class="admin-sidebar">
          <nav>
            <a href="/admin" @click=${this.handleNav}>Dashboard</a>
            <a href="/admin/users" @click=${this.handleNav}>Users</a>
            <a href="/admin/settings" @click=${this.handleNav}>Settings</a>
          </nav>
        </aside>
        <main class="admin-content">
          ${this._routes.outlet()}
        </main>
      </div>
    `;
  }

  private handleNav(e: Event) {
    e.preventDefault();
    const href = (e.target as HTMLAnchorElement).href;
    this.navigate(href);
  }
}
```

### Route Definition

```typescript
// src/modules/admin/admin.routes.ts
import { html } from 'lit';

export const adminRoutes = [
  {
    path: '',
    render: () => html`<dashboard-page></dashboard-page>`
  },
  {
    path: 'users',
    render: () => html`<users-page></users-page>`
  },
  {
    path: 'users/:id',
    render: ({ id }: any) => html`<user-detail-page .userId=${id}></user-detail-page>`
  },
  {
    path: 'settings',
    render: () => html`<settings-page></settings-page>`
  }
];
```

### Register Module in App

```typescript
// src/my-app.ts
@defineApp({ tag: 'my-app' })
export class MyApp extends LithiumApp {
  private _router = new Router(this, [
    { path: '/', render: () => html`<home-page></home-page>` },
    { path: '/about', render: () => html`<about-page></about-page>` },
    // Module nested routes
    { 
      path: '/admin/*', 
      render: () => html`<admin-module></admin-module>`,
      enter: async () => this.checkAdminRole()
    }
  ]);

  private async checkAdminRole() {
    const user = this.channel('user').value;
    return user?.role === 'admin';
  }

  render() {
    return html`<main>${this._router.outlet()}</main>`;
  }
}
```

## Lazy Loading

### Lazy Loading of Pages

```typescript
@defineApp({ tag: 'my-app' })
export class MyApp extends LithiumApp {
  private _router = new Router(this, [
    { path: '/', render: () => html`<home-page></home-page>` },
    { 
      path: '/about',
      enter: async () => {
        // Load page on demand
        await import('./pages/about/about.page.js');
        return true;
      },
      render: () => html`<about-page></about-page>`
    }
  ]);

  render() {
    return html`<main>${this._router.outlet()}</main>`;
  }
}
```

### Lazy Loading of Modules

```typescript
@defineApp({ tag: 'my-app' })
export class MyApp extends LithiumApp {
  private _router = new Router(this, [
    { path: '/', render: () => html`<home-page></home-page>` },
    { 
      path: '/admin/*',
      enter: async () => {
        // Load complete module on demand
        await import('./modules/admin/admin.module.js');
        return true;
      },
      render: () => html`<admin-module></admin-module>`
    }
  ]);

  render() {
    return html`<main>${this._router.outlet()}</main>`;
  }
}
```

### Lazy Loading with Indicator

```typescript
@defineApp({ tag: 'my-app' })
export class MyApp extends LithiumApp {
  @state() private loading = false;

  private _router = new Router(this, [
    { 
      path: '/dashboard/*',
      enter: async () => {
        this.loading = true;
        await import('./modules/dashboard/dashboard.module.js');
        this.loading = false;
        return true;
      },
      render: () => html`<dashboard-module></dashboard-module>`
    }
  ]);

  render() {
    return html`
      <main>
        ${this.loading ? html`
          <div class="loading-overlay">
            <md-circular-progress indeterminate></md-circular-progress>
          </div>
        ` : ''}
        ${this._router.outlet()}
      </main>
    `;
  }
}
```

## Route Parameters

### Simple Parameters

```typescript
// Define route with parameter
const routes = [
  {
    path: 'products/:id',
    render: ({ id }: any) => html`<product-page .productId=${id}></product-page>`
  }
];

// In the page
@definePage({ tag: 'product-page' })
export class ProductPage extends LithiumElement {
  @property() productId?: string;

  async connectedCallback() {
    super.connectedCallback();
    if (this.productId) {
      await this.loadProduct(this.productId);
    }
  }

  render() {
    return html`<div>Product ID: ${this.productId}</div>`;
  }
}
```

### Multiple Parameters

```typescript
const routes = [
  {
    path: 'categories/:category/products/:id',
    render: ({ category, id }: any) => html`
      <product-page 
        .category=${category} 
        .productId=${id}>
      </product-page>
    `
  }
];
```

### Optional Parameters

```typescript
const routes = [
  {
    path: 'search/:query?',
    render: ({ query }: any) => html`
      <search-page .query=${query || ''}></search-page>
    `
  }
];
```

## Query Strings

### Reading Query Parameters

```typescript
@definePage({ tag: 'search-page' })
export class SearchPage extends LithiumElement {
  @property() query = '';

  connectedCallback() {
    super.connectedCallback();
    
    // Leer query strings
    const params = new URLSearchParams(window.location.search);
    this.query = params.get('q') || '';
    const page = params.get('page') || '1';
    const sort = params.get('sort') || 'relevance';
    
    this.search(this.query, parseInt(page), sort);
  }

  render() {
    return html`
      <div>
        <h1>Search results for: ${this.query}</h1>
      </div>
    `;
  }
}
```

### Navigate with Query Strings

```typescript
@defineElement({ tag: 'search-form' })
export class SearchForm extends LithiumElement {
  private handleSearch(e: Event) {
    e.preventDefault();
    const formData = new FormData(e.target as HTMLFormElement);
    const query = formData.get('q');
    const sort = formData.get('sort');
    
    // Navigate with query params
    this.navigate(`/search?q=${query}&sort=${sort}`);
  }

  render() {
    return html`
      <form @submit=${this.handleSearch}>
        <input type="text" name="q" placeholder="Search...">
        <select name="sort">
          <option value="relevance">Relevance</option>
          <option value="date">Date</option>
        </select>
        <button type="submit">Search</button>
      </form>
    `;
  }
}
```

## Guards - Route Protection

### Authentication Guard

```typescript
@defineApp({ tag: 'my-app' })
export class MyApp extends LithiumApp {
  private _router = new Router(this, [
    { path: '/', render: () => html`<home-page></home-page>` },
    { path: '/login', render: () => html`<login-page></login-page>` },
    { 
      path: '/profile',
      enter: async () => {
        const user = this.channel('user').value;
        if (!user) {
          this.navigate('/login');
          return false;
        }
        return true;
      },
      render: () => html`<profile-page></profile-page>`
    }
  ]);

  render() {
    return html`<main>${this._router.outlet()}</main>`;
  }
}
```

### Role Guard

```typescript
private _router = new Router(this, [
  { 
    path: '/admin/*',
    enter: async () => {
      const user = this.channel('user').value;
      
      if (!user) {
        this.navigate('/login');
        return false;
      }
      
      if (user.role !== 'admin') {
        this.navigate('/unauthorized');
        return false;
      }
      
      return true;
    },
    render: () => html`<admin-module></admin-module>`
  }
]);
```

### Guard con Carga de Datos

```typescript
{ 
  path: '/dashboard',
  enter: async () => {
    try {
      const data = await fetchDashboardData();
      this.channel('dashboardData').value = data;
      return true;
    } catch (error) {
      this.navigate('/error');
      return false;
    }
  },
  render: () => html`<dashboard-page></dashboard-page>`
}
```

## Programmatic Navigation

### navigate() Method

```typescript
@definePage({ tag: 'login-page' })
export class LoginPage extends LithiumElement {
  private async handleLogin(e: Event) {
    e.preventDefault();
    
    const success = await doLogin();
    
    if (success) {
      // Navigate to dashboard
      this.navigate('/dashboard');
    }
  }

  private goToRegister() {
    // Navigate without adding to history
    this.navigate('/register', { replace: true });
  }

  render() {
    return html`
      <form @submit=${this.handleLogin}>
        <button type="submit">Login</button>
        <button type="button" @click=${this.goToRegister}>Register</button>
      </form>
    `;
  }
}
```

### Navigation with Parameters

```typescript
// Navigate with route parameters
this.navigate('/products/12345');

// Navigate with query strings
this.navigate('/search?q=laptop&sort=price');

// Navigate with hash
this.navigate('/docs#installation');
```

## Navigation Links

### Reactive Links

```typescript
@defineElement({ tag: 'nav-menu' })
export class NavMenu extends LithiumElement {
  render() {
    return html`
      <nav>
        <a href="/" @click=${this.handleNav}>Home</a>
        <a href="/about" @click=${this.handleNav}>About</a>
        <a href="/contact" @click=${this.handleNav}>Contact</a>
      </nav>
    `;
  }

  private handleNav(e: Event) {
    e.preventDefault();
    const href = (e.target as HTMLAnchorElement).href;
    this.navigate(href);
  }
}
```

### Active Link

```typescript
@defineElement({ tag: 'nav-menu' })
export class NavMenu extends LithiumElement {
  @state() private currentPath = window.location.pathname;

  connectedCallback() {
    super.connectedCallback();
    
    // Actualizar path cuando cambia la ruta
    this.on('lithium:navigate', (data: any) => {
      this.currentPath = data.url;
    });
  }

  render() {
    return html`
      <nav>
        <a 
          href="/" 
          class="${this.currentPath === '/' ? 'active' : ''}"
          @click=${this.handleNav}>
          Home
        </a>
        <a 
          href="/about" 
          class="${this.currentPath === '/about' ? 'active' : ''}"
          @click=${this.handleNav}>
          About
        </a>
      </nav>
    `;
  }

  private handleNav(e: Event) {
    e.preventDefault();
    const href = (e.target as HTMLAnchorElement).href;
    this.navigate(href);
  }
}
```

## Routes with Fallback (404)

```typescript
@defineApp({ tag: 'my-app' })
export class MyApp extends LithiumApp {
  private _router = new Router(this, [
    { path: '/', render: () => html`<home-page></home-page>` },
    { path: '/about', render: () => html`<about-page></about-page>` },
    // Fallback for routes not found
    { path: '(.*)', render: () => html`<not-found-page></not-found-page>` }
  ]);

  render() {
    return html`<main>${this._router.outlet()}</main>`;
  }
}
```

## Best Practices

### ✅ Do
- Use lazy loading for large modules
- Protect private routes with guards
- Centralize routes in `.routes.ts` files
- Use route parameters for IDs
- Handle 404 routes with fallback

### ❌ Avoid
- Loading all modules at startup
- Forgetting to validate access in guards
- Links that reload the entire page
- Hardcoded routes in multiple places