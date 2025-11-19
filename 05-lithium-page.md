# LithiumPage - Pages

## Introduction

`LithiumPage` is the base class for pages in Lithium. Pages represent complete views or screens associated with specific routes. Unlike components, pages can change the browser title and are designed to be the main content of a route.

## @definePage Decorator

### Syntax

```typescript
@definePage(options: DefinePageOptions)
```

### Options

```typescript
interface DefinePageOptions {
  tag: string;                          // Page HTML tag
  title?: string;                       // Browser title (optional)
  styles?: (CSSResultGroup | string)[]; // Optional styles
}
```

## Basic Example

```typescript
// src/modules/public/pages/home/home.page.ts
import { definePage, LithiumElement, html } from '@lithium';
import style from './home.page.css?inline';

@definePage({ 
  tag: 'home-page',
  title: 'Home - My App',
  styles: [style]
})
export class HomePage extends LithiumElement {
  render() {
    return html`
      <div class="page-container">
        <h1>Welcome Home</h1>
        <p>This is the home page</p>
      </div>
    `;
  }
}
```

## Page Title

### Static Title

```typescript
@definePage({ 
  tag: 'about-page',
  title: 'About Us - My App'
})
export class AboutPage extends LithiumElement {
  render() {
    return html`<h1>About Us</h1>`;
  }
}
```

### Dynamic Title

```typescript
@definePage({ 
  tag: 'product-page',
  title: 'Product' // Default title
})
export class ProductPage extends LithiumElement {
  @property() productId?: string;

  connectedCallback() {
    super.connectedCallback();
    this.loadProduct();
  }

  async loadProduct() {
    if (this.productId) {
      const product = await fetchProduct(this.productId);
      // Update title manually
      document.title = `${product.name} - My App`;
    }
  }

  render() {
    return html`<div>Product: ${this.productId}</div>`;
  }
}
```

## Page Structure

```
pages/home/
├── home.page.ts          # Main component
├── home.page.css         # Page styles
└── components/           # Specific components (optional)
    └── hero-section/
        ├── hero-section.component.ts
        └── hero-section.component.css
```

## Page Composition

### Page with Sections

```typescript
@definePage({ 
  tag: 'home-page',
  title: 'Home',
  styles: [style]
})
export class HomePage extends LithiumElement {
  render() {
    return html`
      <main class="home-page">
        ${this.heroSection}
        ${this.featuresSection}
        ${this.testimonialsSection}
        ${this.ctaSection}
      </main>
    `;
  }

  private get heroSection() {
    return html`
      <section class="hero">
        <h1>Welcome to My App</h1>
        <p>The best solution for your business</p>
        <button-atomic color="primary">Get Started</button-atomic>
      </section>
    `;
  }

  private get featuresSection() {
    return html`
      <section class="features">
        <h2>Features</h2>
        <div class="features-grid">
          <feature-card title="Fast"></feature-card>
          <feature-card title="Secure"></feature-card>
          <feature-card title="Scalable"></feature-card>
        </div>
      </section>
    `;
  }

  private get testimonialsSection() {
    return html`
      <section class="testimonials">
        <h2>What our customers say</h2>
        <testimonials-carousel></testimonials-carousel>
      </section>
    `;
  }

  private get ctaSection() {
    return html`
      <section class="cta">
        <h2>Ready to get started?</h2>
        <button-atomic color="secondary">Sign Up Now</button-atomic>
      </section>
    `;
  }
}
```

### Page with Lazy Loading

```typescript
import { definePage, LithiumElement, html, lazy } from '@lithium';

@definePage({ 
  tag: 'home-page',
  title: 'Home'
})
export class HomePage extends LithiumElement {
  render() {
    return html`
      <main>
        ${this.heroSection}
        ${this.featuresSection}
        ${this.commentsSection}  <!-- Lazy loaded -->
        ${this.footerSection}     <!-- Lazy loaded -->
      </main>
    `;
  }

  private get heroSection() {
    return html`<hero-section></hero-section>`;
  }

  private get featuresSection() {
    return html`<features-section></features-section>`;
  }

  // Load when entering viewport
  @lazy({
    placeholder: html`<div class="loading">Loading comments...</div>`,
    threshold: 0.3
  })
  private get commentsSection() {
    return html`<comments-section></comments-section>`;
  }

  // Load when entering viewport + dynamic import
  @lazy({
    loader: () => import('../../section/footer/footer.component.js'),
    rootMargin: '100px'
  })
  private get footerSection() {
    return html`<footer-section></footer-section>`;
  }
}
```

## Page State

### Using Properties

```typescript
@definePage({ tag: 'products-page' })
export class ProductsPage extends LithiumElement {
  @property() private products: Product[] = [];
  @property() private loading = true;
  @property() private error: string | null = null;

  async connectedCallback() {
    super.connectedCallback();
    await this.loadProducts();
  }

  async loadProducts() {
    try {
      this.loading = true;
      this.products = await fetchProducts();
      this.loading = false;
    } catch (err) {
      this.error = 'Failed to load products';
      this.loading = false;
    }
  }

  render() {
    if (this.loading) {
      return html`<div class="loading">Loading...</div>`;
    }

    if (this.error) {
      return html`<div class="error">${this.error}</div>`;
    }

    return html`
      <div class="products-page">
        <h1>Products (${this.products.length})</h1>
        <div class="products-grid">
          ${this.products.map(product => html`
            <product-card .product=${product}></product-card>
          `)}
        </div>
      </div>
    `;
  }
}
```

### Use Channels

```typescript
@definePage({ tag: 'dashboard-page' })
export class DashboardPage extends LithiumElement {
  connectedCallback() {
    super.connectedCallback();

    const user = this.channel('user').value;
    console.log('Current user:', user);
    
    this.subscribe('user', (newUser) => {
      console.log('User updated:', newUser);
    });
  }

  render() {
    const user = this.channel('user').value;
    
    return html`
      <div class="dashboard">
        <h1>Welcome, ${user?.name}!</h1>
        <dashboard-stats></dashboard-stats>
      </div>
    `;
  }
}
```

## Navigation

### Programmatic Navigation

```typescript
@definePage({ tag: 'login-page' })
export class LoginPage extends LithiumElement {
  private async handleLogin(e: Event) {
    e.preventDefault();
    
    const success = await doLogin();
    
    if (success) {
      this.navigate('/dashboard');
    }
  }

  private goToRegister() {
    this.navigate('/register', { replace: true });
  }

  render() {
    return html`
      <form @submit=${this.handleLogin}>
        <input type="email" name="email">
        <input type="password" name="password">
        <button type="submit">Login</button>
        <button type="button" @click=${this.goToRegister}>
          Register
        </button>
      </form>
    `;
  }
}
```

### Navigation Links

```typescript
render() {
  return html`
    <nav>
      <!-- Navigate with anchor (page listens and navigates) -->
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
```

## Lifecycle

### connectedCallback

```typescript
@definePage({ tag: 'profile-page' })
export class ProfilePage extends LithiumElement {
  async connectedCallback() {
    super.connectedCallback();
    
    // Executes when the page is mounted
    await this.loadUserProfile();
    this.startPolling();
  }

  disconnectedCallback() {
    super.disconnectedCallback();
    
    // Executes when the page is unmounted
    this.stopPolling();
  }
}
```

## Forms

### Basic Form

```typescript
@definePage({ tag: 'contact-page' })
export class ContactPage extends LithiumElement {
  @property() private formData = {
    name: '',
    email: '',
    message: ''
  };

  @property() private submitting = false;

  private async handleSubmit(e: Event) {
    e.preventDefault();
    
    this.submitting = true;
    
    try {
      await submitContact(this.formData);
      this.emit('toast:show', { 
        message: 'Message sent!', 
        type: 'success' 
      });
      this.navigate('/thank-you');
    } catch (error) {
      this.emit('toast:show', { 
        message: 'Error sending message', 
        type: 'error' 
      });
    } finally {
      this.submitting = false;
    }
  }

  render() {
    return html`
      <form @submit=${this.handleSubmit}>
        <md-outlined-text-field
          label="Name"
          .value=${this.formData.name}
          @input=${(e: any) => this.formData.name = e.target.value}>
        </md-outlined-text-field>

        <md-outlined-text-field
          type="email"
          label="Email"
          .value=${this.formData.email}
          @input=${(e: any) => this.formData.email = e.target.value}>
        </md-outlined-text-field>

        <md-filled-text-field
          type="textarea"
          label="Message"
          rows="5"
          .value=${this.formData.message}
          @input=${(e: any) => this.formData.message = e.target.value}>
        </md-filled-text-field>

        <md-filled-button type="submit" ?disabled=${this.submitting}>
          ${this.submitting ? 'Sending...' : 'Send Message'}
        </md-filled-button>
      </form>
    `;
  }
}
```

## Communication

### Emitting Events

```typescript
@definePage({ tag: 'product-page' })
export class ProductPage extends LithiumElement {
  private addToCart(product: Product) {
    // Emit event upwards
    this.output('product:addedToCart', { product });
    
    // Emit global event
    this.emit('cart:update', { action: 'add', product });
  }
}
```

### Listening to Events

```typescript
@definePage({ tag: 'orders-page' })
export class OrdersPage extends LithiumElement {
  connectedCallback() {
    super.connectedCallback();
    
    // Listen to global event
    this.on('order:created', (order) => {
      this.refreshOrders();
    });
  }
}
```

## Best Practices

### ✅ Do
- One page per file
- Descriptive title for SEO
- Lazy loading of heavy sections
- Clean up listeners in `disconnectedCallback`
- Validate data before submitting forms

### ❌ Avoid
- Complex business logic in the page
- Pages with more than 500 lines
- Loading all data in `connectedCallback`
- Forgetting to handle loading/error states