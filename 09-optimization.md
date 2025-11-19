# Optimization - @lazy, @defer, @delay and @conditional

## Introduction

Lithium provides four decorators to optimize your application's performance through deferred loading and conditional rendering:

- **@lazy**: Loads content when it enters the viewport (IntersectionObserver)
- **@defer**: Renders content after the first render (microtask)
- **@delay**: Renders content after a specific time
- **@conditional**: Renders content only when a condition is true

## @lazy - Lazy Loading with Viewport

The `@lazy` decorator uses IntersectionObserver to load content only when it's about to be visible in the viewport.

### Syntax

```typescript
@lazy(options?: LazyOptions)
```

### Options

```typescript
interface LazyOptions {
  placeholder?: TemplateResult;  // Content while loading
  threshold?: number;             // 0-1, % visible to load (default: 0)
  rootMargin?: string;            // Viewport margin (default: '0px')
  loader?: () => Promise<any>;    // Optional dynamic import
}
```

### Basic Example

```typescript
import { defineElement, LithiumElement, html, lazy } from '@lithium';

@defineElement({ tag: 'product-list' })
export class ProductList extends LithiumElement {
  render() {
    return html`
      <div class="products">
        ${this.productCard1}
        ${this.productCard2}
        ${this.productCard3}  <!-- Lazy loaded -->
        ${this.productCard4}  <!-- Lazy loaded -->
      </div>
    `;
  }

  // Renders immediately
  private get productCard1() {
    return html`<product-card .product=${products[0]}></product-card>`;
  }

  private get productCard2() {
    return html`<product-card .product=${products[1]}></product-card>`;
  }

  // Loads when entering viewport
  @lazy()
  private get productCard3() {
    return html`<product-card .product=${products[2]}></product-card>`;
  }

  @lazy()
  private get productCard4() {
    return html`<product-card .product=${products[3]}></product-card>`;
  }
}
```

### With Placeholder

```typescript
@defineElement({ tag: 'home-page' })
export class HomePage extends LithiumElement {
  render() {
    return html`
      <main>
        ${this.heroSection}
        ${this.featuresSection}
        ${this.testimonialsSection}  <!-- Lazy loaded -->
      </main>
    `;
  }

  // Immediate load (above the fold)
  private get heroSection() {
    return html`<hero-section></hero-section>`;
  }

  private get featuresSection() {
    return html`<features-section></features-section>`;
  }

  // Deferred load with placeholder
  @lazy({
    placeholder: html`
      <div class="loading-section">
        <md-circular-progress indeterminate></md-circular-progress>
        <p>Loading testimonials...</p>
      </div>
    `
  })
  private get testimonialsSection() {
    return html`<testimonials-section></testimonials-section>`;
  }
}
```

### With Threshold

```typescript
@defineElement({ tag: 'gallery-page' })
export class GalleryPage extends LithiumElement {
  render() {
    return html`
      <div class="gallery">
        ${this.images.map(img => this.renderImage(img))}
      </div>
    `;
  }

  // Load when 50% is visible
  @lazy({
    threshold: 0.5,
    placeholder: html`<div class="image-placeholder"></div>`
  })
  private renderImage(src: string) {
    return html`<img src="${src}" alt="Gallery image" />`;
  }
}
```

### With rootMargin

```typescript
@defineElement({ tag: 'infinite-scroll' })
export class InfiniteScroll extends LithiumElement {
  render() {
    return html`
      <div class="content">
        ${this.items.map(item => this.renderItem(item))}
        ${this.loadMoreTrigger}
      </div>
    `;
  }

  private renderItem(item: any) {
    return html`<div class="item">${item.name}</div>`;
  }

  // Load 200px before being visible
  @lazy({
    rootMargin: '200px',
    placeholder: html`<div class="loading">Loading more...</div>`
  })
  private get loadMoreTrigger() {
    // Trigger to load more items
    this.loadMore();
    return html``;
  }

  private async loadMore() {
    const newItems = await fetchMoreItems();
    this.items = [...this.items, ...newItems];
  }
}
```

### With Dynamic Import

```typescript
@defineElement({ tag: 'admin-page' })
export class AdminPage extends LithiumElement {
  render() {
    return html`
      <div class="admin-page">
        ${this.header}
        ${this.content}
        ${this.footer}  <!-- Lazy loaded con dynamic import -->
      </div>
    `;
  }

  private get header() {
    return html`<admin-header></admin-header>`;
  }

  private get content() {
    return html`<admin-content></admin-content>`;
  }

  // Load component only when visible
  @lazy({
    loader: () => import('../../components/footer/admin-footer.component.js'),
    placeholder: html`<div class="footer-loading">Loading footer...</div>`,
    rootMargin: '100px'
  })
  private get footer() {
    return html`<admin-footer></admin-footer>`;
  }
}
```

## @defer - Deferred Rendering

The `@defer` decorator postpones rendering until after the first render using microtasks (queueMicrotask).

### Syntax

```typescript
@defer(placeholder?: TemplateResult)
```

### Basic Example

```typescript
@defineElement({ tag: 'dashboard-page' })
export class DashboardPage extends LithiumElement {
  render() {
    return html`
      <div class="dashboard">
        ${this.criticalContent}   <!-- Renders immediately -->
        ${this.deferredContent}   <!-- Renders in microtask -->
      </div>
    `;
  }

  // Critical rendering (immediate)
  private get criticalContent() {
    return html`
      <h1>Dashboard</h1>
      <dashboard-stats></dashboard-stats>
    `;
  }

  // Deferred rendering (microtask)
  @defer()
  private get deferredContent() {
    return html`
      <dashboard-charts></dashboard-charts>
      <dashboard-tables></dashboard-tables>
    `;
  }
}
```

### With Placeholder

```typescript
@defineElement({ tag: 'product-page' })
export class ProductPage extends LithiumElement {
  render() {
    return html`
      <div class="product-page">
        ${this.productInfo}     <!-- Immediate -->
        ${this.relatedProducts} <!-- Deferred -->
      </div>
    `;
  }

  private get productInfo() {
    return html`
      <h1>${this.product.name}</h1>
      <p>${this.product.price}€</p>
      <button>Add to Cart</button>
    `;
  }

  @defer(html`<div class="loading">Loading related products...</div>`)
  private get relatedProducts() {
    return html`
      <h2>Related Products</h2>
      <product-carousel .products=${this.related}></product-carousel>
    `;
  }
}
```

### Optimize Initial Rendering

```typescript
@defineElement({ tag: 'home-page' })
export class HomePage extends LithiumElement {
  render() {
    return html`
      <main>
        ${this.hero}            <!-- First impression -->
        ${this.features}        <!-- Deferred -->
        ${this.testimonials}    <!-- Deferred -->
        ${this.footer}          <!-- Deferred -->
      </main>
    `;
  }

  // Render first (above the fold)
  private get hero() {
    return html`
      <section class="hero">
        <h1>Welcome to My App</h1>
        <button-atomic color="primary">Get Started</button-atomic>
      </section>
    `;
  }

  // Diferir contenido below the fold
  @defer()
  private get features() {
    return html`<features-section></features-section>`;
  }

  @defer()
  private get testimonials() {
    return html`<testimonials-section></testimonials-section>`;
  }

  @defer()
  private get footer() {
    return html`<footer-section></footer-section>`;
  }
}
```

## @delay - Rendering with Delay

The `@delay` decorator delays rendering for a specific time using setTimeout.

### Syntax

```typescript
@delay(milliseconds: number, placeholder?: TemplateResult)
```

### Basic Example

```typescript
@defineElement({ tag: 'welcome-page' })
export class WelcomePage extends LithiumElement {
  render() {
    return html`
      <div class="welcome-page">
        ${this.immediateContent}
        ${this.delayedContent}  <!-- Renders after 2s -->
      </div>
    `;
  }

  private get immediateContent() {
    return html`
      <h1>Welcome!</h1>
      <p>Loading your personalized content...</p>
    `;
  }

  @delay(2000)
  private get delayedContent() {
    return html`
      <div class="personalized-content">
        <h2>Recommended for you</h2>
        <product-recommendations></product-recommendations>
      </div>
    `;
  }
}
```

### With Placeholder

```typescript
@defineElement({ tag: 'dashboard-page' })
export class DashboardPage extends LithiumElement {
  render() {
    return html`
      <div class="dashboard">
        ${this.mainContent}
        ${this.notifications}  <!-- Delay 1s -->
      </div>
    `;
  }

  private get mainContent() {
    return html`
      <h1>Dashboard</h1>
      <dashboard-stats></dashboard-stats>
    `;
  }

  @delay(1000, html`
    <div class="notifications-loading">
      <md-circular-progress indeterminate></md-circular-progress>
    </div>
  `)
  private get notifications() {
    return html`
      <notification-panel></notification-panel>
    `;
  }
}
```

### Announcements or Banners

```typescript
@defineElement({ tag: 'home-page' })
export class HomePage extends LithiumElement {
  render() {
    return html`
      <main>
        ${this.content}
        ${this.banner}  <!-- Show after 5s -->
      </main>
    `;
  }

  private get content() {
    return html`<h1>Welcome to the site</h1>`;
  }

  // Show promotional banner after 5 seconds
  @delay(5000)
  private get banner() {
    return html`
      <promo-banner>
        <h2>Special Offer!</h2>
        <p>Get 20% off your first purchase</p>
      </promo-banner>
    `;
  }
}
```

## Decorator Architecture

### LazyController (IntersectionObserver)

```typescript
export class LazyController implements ReactiveController {
  private host: ReactiveControllerHost;
  private observer?: IntersectionObserver;
  private loaded = false;

  constructor(
    host: ReactiveControllerHost,
    private options: LazyOptions = {}
  ) {
    this.host = host;
    host.addController(this);
  }

  hostConnected() {
    this.observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting && !this.loaded) {
            this.loaded = true;
            
            // Cargar dynamic import si existe
            if (this.options.loader) {
              this.options.loader().then(() => {
                this.host.requestUpdate();
              });
            } else {
              this.host.requestUpdate();
            }
            
            this.observer?.disconnect();
          }
        });
      },
      {
        threshold: this.options.threshold || 0,
        rootMargin: this.options.rootMargin || '0px'
      }
    );
  }

  hostDisconnected() {
    this.observer?.disconnect();
  }

  render(content: () => TemplateResult) {
    if (this.loaded) {
      return content();
    }
    return this.options.placeholder || html``;
  }
}
```

### DeferController (queueMicrotask)

```typescript
export class DeferController implements ReactiveController {
  private host: ReactiveControllerHost;
  private deferred = false;

  constructor(
    host: ReactiveControllerHost,
    private placeholder?: TemplateResult
  ) {
    this.host = host;
    host.addController(this);
  }

  hostConnected() {
    queueMicrotask(() => {
      this.deferred = true;
      this.host.requestUpdate();
    });
  }

  render(content: () => TemplateResult) {
    if (this.deferred) {
      return content();
    }
    return this.placeholder || html``;
  }
}
```

### DelayController (setTimeout)

```typescript
export class DelayController implements ReactiveController {
  private host: ReactiveControllerHost;
  private delayed = false;
  private timeoutId?: number;

  constructor(
    host: ReactiveControllerHost,
    private delay: number,
    private placeholder?: TemplateResult
  ) {
    this.host = host;
    host.addController(this);
  }

  hostConnected() {
    this.timeoutId = window.setTimeout(() => {
      this.delayed = true;
      this.host.requestUpdate();
    }, this.delay);
  }

  hostDisconnected() {
    if (this.timeoutId) {
      clearTimeout(this.timeoutId);
    }
  }

  render(content: () => TemplateResult) {
    if (this.delayed) {
      return content();
    }
    return this.placeholder || html``;
  }
}
```

## Use Cases

### Optimized Landing Page

```typescript
@definePage({ tag: 'landing-page' })
export class LandingPage extends LithiumElement {
  render() {
    return html`
      <main>
        <!-- Above the fold: Immediate rendering -->
        ${this.hero}
        
        <!-- Below the fold: Deferred -->
        ${this.features}
        
        <!-- Lazy load when visible -->
        ${this.testimonials}
        ${this.pricing}
        ${this.footer}
      </main>
    `;
  }

  // Critical: immediate rendering
  private get hero() {
    return html`
      <hero-section>
        <h1>Transform Your Business</h1>
        <button-atomic color="primary">Get Started</button-atomic>
      </hero-section>
    `;
  }

  // Defer to improve LCP
  @defer()
  private get features() {
    return html`<features-section></features-section>`;
  }

  // Lazy load when entering viewport
  @lazy({
    rootMargin: '200px',
    placeholder: html`<div class="section-loading"></div>`
  })
  private get testimonials() {
    return html`<testimonials-section></testimonials-section>`;
  }

  @lazy({ rootMargin: '200px' })
  private get pricing() {
    return html`<pricing-section></pricing-section>`;
  }

  @lazy({ 
    rootMargin: '100px',
    loader: () => import('../../components/footer/footer.component.js')
  })
  private get footer() {
    return html`<footer-component></footer-component>`;
  }
}
```

### Blog Post with Comments

```typescript
@definePage({ tag: 'blog-post-page' })
export class BlogPostPage extends LithiumElement {
  render() {
    return html`
      <article>
        <!-- Main content: immediate -->
        ${this.postContent}
        
        <!-- Related posts: deferred -->
        ${this.relatedPosts}
        
        <!-- Comments: lazy load -->
        ${this.comments}
      </article>
    `;
  }

  private get postContent() {
    return html`
      <h1>${this.post.title}</h1>
      <div class="content">${unsafeHTML(this.post.content)}</div>
    `;
  }

  @defer()
  private get relatedPosts() {
    return html`
      <section class="related-posts">
        <h2>Related Articles</h2>
        <post-list .posts=${this.related}></post-list>
      </section>
    `;
  }

  @lazy({
    threshold: 0.3,
    placeholder: html`
      <div class="comments-loading">
        <p>Loading comments...</p>
      </div>
    `,
    loader: () => import('../../components/comments/comments.component.js')
  })
  private get comments() {
    return html`
      <comments-section .postId=${this.post.id}></comments-section>
    `;
  }
}
```

### E-commerce Product Page

```typescript
@definePage({ tag: 'product-page' })
export class ProductPage extends LithiumElement {
  render() {
    return html`
      <div class="product-page">
        <!-- Above fold: critical -->
        ${this.productInfo}
        
        <!-- Just below: deferred -->
        ${this.productDescription}
        
        <!-- Lazy load: below the fold -->
        ${this.reviews}
        ${this.recommendations}
      </div>
    `;
  }

  // Critical product information
  private get productInfo() {
    return html`
      <div class="product-info">
        <img src="${this.product.image}" alt="${this.product.name}" />
        <h1>${this.product.name}</h1>
        <p class="price">${this.product.price}€</p>
        <button-atomic color="primary">Add to Cart</button-atomic>
      </div>
    `;
  }

  // Defer description
  @defer()
  private get productDescription() {
    return html`
      <div class="description">
        <h2>Description</h2>
        <p>${this.product.description}</p>
      </div>
    `;
  }

  // Reviews: lazy load when visible
  @lazy({
    threshold: 0.5,
    placeholder: html`<div class="loading-reviews">Loading reviews...</div>`
  })
  private get reviews() {
    return html`
      <reviews-section .productId=${this.product.id}></reviews-section>
    `;
  }

  // Recommendations: lazy with dynamic import
  @lazy({
    rootMargin: '300px',
    loader: () => import('../../components/recommendations/recommendations.component.js')
  })
  private get recommendations() {
    return html`
      <recommendations-section .productId=${this.product.id}></recommendations-section>
    `;
  }
}
```

## @conditional - Conditional Rendering

The `@conditional` decorator renders content only when a specific property is true. Ideal for modals, tooltips, collapsible panels, or content that depends on user actions.

### Syntax

```typescript
@conditional(propertyKey: string, placeholder?: TemplateResult)
```

### Parameters

- **propertyKey**: Name of the reactive property that controls the condition
- **placeholder**: Optional template to show when the condition is `false`

### Basic Example

```typescript
import { defineElement, LithiumElement, html, conditional } from '@lithium';
import { state } from 'lit/decorators.js';

@defineElement({ tag: 'welcome-page' })
export class WelcomePage extends LithiumElement {
  @state() private showModal = false;

  render() {
    return html`
      <main>
        <button @click=${() => this.showModal = true}>
          Open Modal
        </button>
        ${this.modal}
      </main>
    `;
  }

  // Only renders when showModal = true
  @conditional('showModal')
  private get modal() {
    return html`
      <md-dialog open @closed=${() => this.showModal = false}>
        <div slot="headline">Hello!</div>
        <form id="form" slot="content" method="dialog">
          <p>This modal only renders when you open it.</p>
        </form>
        <div slot="actions">
          <md-filled-button form="form">Close</md-filled-button>
        </div>
      </md-dialog>
    `;
  }
}
```

### With Placeholder

```typescript
@defineElement({ tag: 'feature-component' })
export class FeatureComponent extends LithiumElement {
  @state() private isLoaded = false;

  connectedCallback() {
    super.connectedCallback();
    // Simulate data loading
    setTimeout(() => this.isLoaded = true, 2000);
  }

  render() {
    return html`
      <div class="feature">
        ${this.content}
      </div>
    `;
  }

  @conditional('isLoaded', html`
    <div class="loading">
      <md-circular-progress indeterminate></md-circular-progress>
      <p>Loading content...</p>
    </div>
  `)
  private get content() {
    return html`
      <h2>Loaded Content</h2>
      <p>This content appears after loading.</p>
    `;
  }
}
```

### Tabs with @conditional

```typescript
@defineElement({ tag: 'tabs-component' })
export class TabsComponent extends LithiumElement {
  @state() private activeTab: 'home' | 'profile' | 'settings' = 'home';

  render() {
    return html`
      <div class="tabs">
        <button @click=${() => this.activeTab = 'home'}>Home</button>
        <button @click=${() => this.activeTab = 'profile'}>Profile</button>
        <button @click=${() => this.activeTab = 'settings'}>Settings</button>
      </div>
      
      <div class="tab-content">
        ${this.homeTab}
        ${this.profileTab}
        ${this.settingsTab}
      </div>
    `;
  }

  // Each tab only renders when active
  @conditional('activeTab', html``)
  private get homeTab() {
    return this.activeTab === 'home' ? html`
      <div class="tab-panel">
        <h2>Home</h2>
        <p>Home content</p>
      </div>
    ` : html``;
  }

  @conditional('activeTab', html``)
  private get profileTab() {
    return this.activeTab === 'profile' ? html`
      <div class="tab-panel">
        <h2>Profile</h2>
        <user-profile></user-profile>
      </div>
    ` : html``;
  }

  @conditional('activeTab', html``)
  private get settingsTab() {
    return this.activeTab === 'settings' ? html`
      <div class="tab-panel">
        <h2>Settings</h2>
        <settings-panel></settings-panel>
      </div>
    ` : html``;
  }
}
```

### Collapsible Panel

```typescript
@defineElement({ tag: 'accordion-item' })
export class AccordionItem extends LithiumElement {
  @state() private expanded = false;

  render() {
    return html`
      <div class="accordion">
        <button 
          class="accordion-header"
          @click=${() => this.expanded = !this.expanded}>
          <span>Accordion Title</span>
          <md-icon>${this.expanded ? 'expand_less' : 'expand_more'}</md-icon>
        </button>
        ${this.content}
      </div>
    `;
  }

  @conditional('expanded')
  private get content() {
    return html`
      <div class="accordion-content">
        <p>This content only renders when the accordion is expanded.</p>
        <p>Saving resources if never opened.</p>
      </div>
    `;
  }
}
```

### Permission Control

```typescript
@defineElement({ tag: 'dashboard-page' })
export class DashboardPage extends LithiumElement {
  @property({ type: Boolean }) isAdmin = false;
  @property({ type: Boolean }) isPremium = false;

  render() {
    return html`
      <main>
        <h1>Dashboard</h1>
        ${this.adminPanel}
        ${this.premiumFeatures}
        ${this.standardContent}
      </main>
    `;
  }

  // Only visible for administrators
  @conditional('isAdmin')
  private get adminPanel() {
    return html`
      <section class="admin-panel">
        <h2>Administration Panel</h2>
        <admin-controls></admin-controls>
      </section>
    `;
  }

  // Only visible for premium users
  @conditional('isPremium')
  private get premiumFeatures() {
    return html`
      <section class="premium">
        <h2>Premium Features</h2>
        <premium-tools></premium-tools>
      </section>
    `;
  }

  private get standardContent() {
    return html`
      <section class="standard">
        <h2>Standard Content</h2>
        <p>Visible to all users</p>
      </section>
    `;
  }
}
```

### Combining @conditional with other decorators

```typescript
@defineElement({ tag: 'product-page' })
export class ProductPage extends LithiumElement {
  @state() private showReviews = false;
  @property() productId?: string;

  render() {
    return html`
      <main>
        ${this.productInfo}
        
        <button @click=${() => this.showReviews = true}>
          Ver Reseñas
        </button>
        
        ${this.reviewsSection}
      </main>
    `;
  }

  private get productInfo() {
    return html`
      <div class="product-info">
        <h1>Producto</h1>
      </div>
    `;
  }

  // Combine @conditional with @lazy
  // Only loads when showReviews = true AND enters viewport
  @conditional('showReviews')
  @lazy({
    loader: () => import('./components/reviews.js'),
    placeholder: html`<div class="loading">Loading reviews...</div>`
  })
  private get reviewsSection() {
    return html`
      <reviews-section .productId=${this.productId}></reviews-section>
    `;
  }
}
```

## Decorator Comparison

| Decorator | When it renders | Use case | Performance |
|-----------|-----------------|-------------|-------------|
| `@defer` | After the first render (microtask) | Content below the fold | ⭐⭐⭐ |
| `@lazy` | When entering viewport | Content out of initial view | ⭐⭐⭐⭐⭐ |
| `@delay` | After X milliseconds | Non-critical banners, ads | ⭐⭐⭐ |
| `@conditional` | When condition = true | Modals, tabs, permissions | ⭐⭐⭐⭐ |

## Best Practices

### ✅ Do
- Use `@lazy` for content below the fold
- Use `@defer` to improve First Contentful Paint (FCP)
- Use `@delay` for ads or non-critical content
- Use `@conditional` for modals, tabs and action-based content
- Combine decorators for advanced optimizations
- Combine with dynamic imports to reduce bundle size
- Provide informative placeholders

### ❌ Avoid
- Lazy loading of critical content (above the fold)
- Decorating everything with @lazy (unnecessary overhead)
- Forgetting placeholders on @lazy with slow loads
- Using @delay for important content
- Using @conditional with frequently changing properties

## Performance Metrics

### Before Optimization
```
First Contentful Paint: 2.5s
Largest Contentful Paint: 4.2s
Time to Interactive: 5.8s
Bundle Size: 450KB
```

### After Optimization
```
First Contentful Paint: 1.2s  ⬇️ -52%
Largest Contentful Paint: 2.1s ⬇️ -50%
Time to Interactive: 2.8s     ⬇️ -52%
Bundle Size: 180KB           ⬇️ -60%
```