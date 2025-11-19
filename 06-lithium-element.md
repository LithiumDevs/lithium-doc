# LithiumElement - Components

## Introduction

`LithiumElement` is the base class for **all** elements in Lithium (pages, components, atomic elements). It extends `LitElement` with additional capabilities for communication, navigation, and state management.

## @defineElement Decorator

### Syntax

```typescript
@defineElement(options: DefineElementOptions)
```

### Options

```typescript
interface DefineElementOptions {
  tag: string;                          // Element HTML tag
  styles?: (CSSResultGroup | string)[]; // Optional styles
}
```

## Basic Example

```typescript
// src/components/atomics/button/button.atomic.ts
import { defineElement, LithiumElement, html, property } from '@lithium';
import { ButtonVariant, ColorVariant } from '@core/interfaces/colors.interface';
import style from './button.atomic.css?inline';

@defineElement({ 
  tag: 'button-atomic',
  styles: [style]
})
export class ButtonAtomic extends LithiumElement {
  @property() variant: ButtonVariant = 'filled';
  @property() color: ColorVariant = 'primary';
  @property({ type: Boolean }) disabled = false;

  render() {
    return html`
      <button 
        class="${this.variant} ${this.color}"
        ?disabled=${this.disabled}
        @click=${this.handleClick}>
        <slot></slot>
      </button>
    `;
  }

  private handleClick(e: Event) {
    if (this.disabled) {
      e.stopPropagation();
      return;
    }
    this.output('click', e);
  }
}
```

## Reactive Properties

### @property()

```typescript
@defineElement({ tag: 'user-card' })
export class UserCard extends LithiumElement {
  // String
  @property() name: string = '';
  
  // Number
  @property({ type: Number }) age: number = 0;

  @property({ type: Boolean, reflect: true }) active = false;
  
  // Array/Object (require hasChanged)
  @property({ 
    type: Array,
    hasChanged: () => true
  }) 
  tags: string[] = [];

  @property({ attribute: false }) 
  internalData: any = null;

  render() {
    return html`
      <div class="user-card ${this.active ? 'active' : ''}">
        <h3>${this.name}</h3>
        <p>Age: ${this.age}</p>
        <ul>
          ${this.tags.map(tag => html`<li>${tag}</li>`)}
        </ul>
      </div>
    `;
  }
}
```

### @state()

```typescript
import { state } from 'lit/decorators.js';

@defineElement({ tag: 'counter-element' })
export class CounterElement extends LithiumElement {
  @state() private count = 0;
  @state() private loading = false;

  private increment() {
    this.count++;
  }

  render() {
    return html`
      <div>
        <p>Count: ${this.count}</p>
        <button @click=${this.increment}>+</button>
      </div>
    `;
  }
}
```

## Slots

### Single Slot

```typescript
@defineElement({ tag: 'card-element' })
export class CardElement extends LithiumElement {
  render() {
    return html`
      <div class="card">
        <slot></slot>
      </div>
    `;
  }
}

html`
  <card-element>
    <h2>Card Title</h2>
    <p>Card content</p>
  </card-element>
`
```

### Named Slots

```typescript
@defineElement({ tag: 'article-card' })
export class ArticleCard extends LithiumElement {
  render() {
    return html`
      <article class="article-card">
        <header>
          <slot name="header"></slot>
        </header>
        <div class="content">
          <slot></slot>
        </div>
        <footer>
          <slot name="footer"></slot>
        </footer>
      </article>
    `;
  }
}

html`
  <article-card>
    <h2 slot="header">Article Title</h2>
    <p>This is the main content</p>
    <div slot="footer">
      <button>Like</button>
      <button>Share</button>
    </div>
  </article-card>
`
```

### Multiple Slots (Navbar)

```typescript
@defineElement({ tag: 'nav-bar', styles: [style] })
export class NavBar extends LithiumElement {
  render() {
    return html`
      <nav class="navbar">
        <div class="start">
          <slot name="start"></slot>
        </div>
        <div class="center">
          <slot name="center"></slot>
        </div>
        <div class="end">
          <slot name="end"></slot>
        </div>
      </nav>
    `;
  }
}

html`
  <nav-bar>
    <img slot="start" src="logo.svg" />
    <h1 slot="center">My App</h1>
    <button slot="end">Login</button>
  </nav-bar>
`
```

## Events

### Emitting Events with output()

```typescript
@defineElement({ tag: 'product-card' })
export class ProductCard extends LithiumElement {
  @property() product?: Product;

  render() {
    return html`
      <div class="product-card">
        <h3>${this.product?.name}</h3>
        <button @click=${this.handleAddToCart}>Add to Cart</button>
        <button @click=${this.handleViewDetails}>View Details</button>
      </div>
    `;
  }

  private handleAddToCart() {
    // Emits event that can be listened to by parent
    this.output('addToCart', { product: this.product });
  }

  private handleViewDetails() {
    this.output('viewDetails', { productId: this.product?.id });
  }
}

// Usage:
html`
  <product-card
    .product=${product}
    @addToCart=${(e: CustomEvent) => this.addToCart(e.detail.product)}
    @viewDetails=${(e: CustomEvent) => this.navigate(`/product/${e.detail.productId}`))}>
  </product-card>
`
```

### Listening to Global Events with on()

```typescript
@defineElement({ tag: 'cart-badge' })
export class CartBadge extends LithiumElement {
  @state() private itemCount = 0;

  connectedCallback() {
    super.connectedCallback();
    
    // Listen to global EventBus events
    this.on('cart:update', (data) => {
      this.updateCount(data);
    });
  }

  private updateCount(data: any) {
    if (data.action === 'add') {
      this.itemCount++;
    } else if (data.action === 'remove') {
      this.itemCount--;
    }
  }

  render() {
    return html`
      <div class="cart-badge">
        🛒 ${this.itemCount}
      </div>
    `;
  }
}
```

## Navigation

### navigate() Method

```typescript
@defineElement({ tag: 'product-list' })
export class ProductList extends LithiumElement {
  @property() products: Product[] = [];

  render() {
    return html`
      <div class="products">
        ${this.products.map(product => html`
          <div class="product-item" @click=${() => this.goToProduct(product.id)}>
            <h3>${product.name}</h3>
          </div>
        `)}
      </div>
    `;
  }

  private goToProduct(id: string) {
    this.navigate(`/products/${id}`);
  }
}
```

## Signals - Reactive State

Lithium uses **@lit-labs/signals** for reactive state. All components extend `SignalWatcher(LitElement)`, which allows using signals and automatically updating the render when they change.

### Creating Local Signals

```typescript
import { signal } from '@lit-labs/signals';

@defineElement({ tag: 'counter-signal' })
export class CounterSignal extends LithiumElement {
  // Local signal (reactive)
  private count = signal(0);
  private name = signal('John');

  render() {
    return html`
      <div>
        <h2>Hello, ${this.name.value}!</h2>
        <p>Count: ${this.count.value}</p>
        <button @click=${this.increment}>+</button>
        <button @click=${this.decrement}>-</button>
      </div>
    `;
  }

  private increment() {
    this.count.value++;  // Updates and re-renders automatically
  }

  private decrement() {
    this.count.value--;
  }
}
```

### Computed Signals

```typescript
import { signal, computed } from '@lit-labs/signals';

@defineElement({ tag: 'shopping-cart-signal' })
export class ShoppingCartSignal extends LithiumElement {
  private items = signal<Product[]>([]);
  
  // Computed signal (recalculates automatically)
  private total = computed(() => {
    return this.items.value.reduce((sum, item) => sum + item.price, 0);
  });

  private itemCount = computed(() => this.items.value.length);

  render() {
    return html`
      <div class="cart">
        <h3>Cart (${this.itemCount.value} items)</h3>
        <p>Total: ${this.total.value}€</p>
        <ul>
          ${this.items.value.map(item => html`
            <li>${item.name} - ${item.price}€</li>
          `)}
        </ul>
      </div>
    `;
  }

  private addItem(product: Product) {
    // Update signal with new array
    this.items.value = [...this.items.value, product];
  }
}
```

### Signals vs @state()

```typescript
@defineElement({ tag: 'comparison-example' })
export class ComparisonExample extends LithiumElement {
  // ❌ @state() - Traditional Lit
  @state() private count1 = 0;
  
  // ✅ Signal - Reactive with computed
  private count2 = signal(0);
  private doubled = computed(() => this.count2.value * 2);

  render() {
    return html`
      <div>
        <!-- @state: Only reactive within the component -->
        <p>Count 1: ${this.count1}</p>
        
        <!-- Signal: Reactive + Computed -->
        <p>Count 2: ${this.count2.value}</p>
        <p>Doubled: ${this.doubled.value}</p>
        
        <button @click=${() => this.count1++}>Increment 1</button>
        <button @click=${() => this.count2.value++}>Increment 2</button>
      </div>
    `;
  }
}
```

### Shared Signals Between Components

```typescript
// shared-state.ts
import { signal, computed } from '@lit-labs/signals';

export const cartItems = signal<Product[]>([]);
export const cartTotal = computed(() => 
  cartItems.value.reduce((sum, item) => sum + item.price, 0)
);

// component-a.ts
import { cartItems } from './shared-state';

@defineElement({ tag: 'product-card' })
export class ProductCard extends LithiumElement {
  @property() product?: Product;

  private addToCart() {
    cartItems.value = [...cartItems.value, this.product!];
  }

  render() {
    return html`
      <button @click=${this.addToCart}>Add to Cart</button>
    `;
  }
}

// component-b.ts
import { cartItems, cartTotal } from './shared-state';

@defineElement({ tag: 'cart-summary' })
export class CartSummary extends LithiumElement {
  render() {
    return html`
      <div>
        <h3>Cart (${cartItems.value.length})</h3>
        <p>Total: ${cartTotal.value}€</p>
      </div>
    `;
  }
}
```

### Signal.peek() - Read Without Observing

```typescript
@defineElement({ tag: 'logger-component' })
export class LoggerComponent extends LithiumElement {
  private count = signal(0);

  private logCount() {
    // peek() reads the value WITHOUT creating reactive dependency
    console.log('Current count:', this.count.peek());
    
    // This method will NOT re-execute when count changes
  }

  render() {
    // value creates reactive dependency
    return html`
      <div>
        <p>Count: ${this.count.value}</p>
        <button @click=${() => this.count.value++}>+</button>
        <button @click=${this.logCount}>Log Count</button>
      </div>
    `;
  }
}
```

### Signals with Arrays and Objects

```typescript
@defineElement({ tag: 'todo-list-signal' })
export class TodoListSignal extends LithiumElement {
  private todos = signal<Todo[]>([
    { id: 1, text: 'Task 1', completed: false }
  ]);

  private addTodo(text: string) {
    // ✅ Create new array (immutability)
    this.todos.value = [
      ...this.todos.value,
      { id: Date.now(), text, completed: false }
    ];
  }

  private toggleTodo(id: number) {
    // ✅ Map and create new array
    this.todos.value = this.todos.value.map(todo =>
      todo.id === id ? { ...todo, completed: !todo.completed } : todo
    );
  }

  private removeTodo(id: number) {
    // ✅ Filter and create new array
    this.todos.value = this.todos.value.filter(todo => todo.id !== id);
  }

  // ❌ DON'T do this (mutates directly)
  private badToggle(id: number) {
    const todo = this.todos.value.find(t => t.id === id);
    if (todo) {
      todo.completed = !todo.completed;  // ❌ Doesn't trigger re-render
    }
  }

  render() {
    return html`
      <ul>
        ${this.todos.value.map(todo => html`
          <li>
            <input 
              type="checkbox" 
              .checked=${todo.completed}
              @change=${() => this.toggleTodo(todo.id)}>
            <span>${todo.text}</span>
            <button @click=${() => this.removeTodo(todo.id)}>×</button>
          </li>
        `)}
      </ul>
    `;
  }
}
```

## Channels (Global State)

Channels are **global signals** managed by Lithium with persistence support.

### Reading Channel

```typescript
@defineElement({ tag: 'user-greeting' })
export class UserGreeting extends LithiumElement {
  render() {
    // channel() devuelve un signal
    const user = this.channel('user').value;
    
    return html`
      <div>
        ${user ? html`Hello, ${user.name}!` : html`Please login`}
      </div>
    `;
  }
}
```

### Writing to Channel

```typescript
@defineElement({ tag: 'login-form' })
export class LoginForm extends LithiumElement {
  private async handleLogin(e: Event) {
    e.preventDefault();
    
    const user = await doLogin();
    
    this.channel('user').value = user;
    
    this.navigate('/dashboard');
  }

  render() {
    return html`
      <form @submit=${this.handleLogin}>
        <input type="email" name="email">
        <input type="password" name="password">
        <button type="submit">Login</button>
      </form>
    `;
  }
}
```

### Listen to Channel

```typescript
@defineElement({ tag: 'theme-toggle' })
export class ThemeToggle extends LithiumElement {
  @state() private theme = 'light';

  connectedCallback() {
    super.connectedCallback();

    this.theme = this.channel('theme').value || 'light';

    this.subscribe('theme', (newTheme) => {
      this.theme = newTheme;
      document.body.className = newTheme;
    });
  }

  private toggleTheme() {
    const newTheme = this.theme === 'light' ? 'dark' : 'light';
    this.channel('theme').value = newTheme;
  }

  render() {
    return html`
      <button @click=${this.toggleTheme}>
        ${this.theme === 'light' ? '🌙' : '☀️'}
      </button>
    `;
  }
}
```

## Lifecycle

```typescript
@defineElement({ tag: 'data-component' })
export class DataComponent extends LithiumElement {
  // 1. Constructor
  constructor() {
    super();
    console.log('Constructor: Basic initialization');
  }

  // 2. connectedCallback - Mounting
  connectedCallback() {
    super.connectedCallback();
    console.log('connectedCallback: Element added to DOM');
    
    // Start data fetch
    this.loadData();
    
    // Listen to global events
    this.on('data:refresh', () => this.loadData());
  }

  // 3. firstUpdated - First complete render
  firstUpdated() {
    console.log('firstUpdated: First time rendered');
    
    // Safe DOM access
    const element = this.shadowRoot?.querySelector('.target');
  }

  // 4. updated - After each update
  updated(changedProperties: Map<string, any>) {
    console.log('updated: Properties changed', changedProperties);
    
    if (changedProperties.has('productId')) {
      this.loadProduct();
    }
  }

  // 5. disconnectedCallback - Unmounting
  disconnectedCallback() {
    super.disconnectedCallback();
    console.log('disconnectedCallback: Element removed from DOM');
    
    // Clean up listeners, timers, etc.
    this.cleanup();
  }

  private async loadData() {
    // Load data
  }

  private cleanup() {
    // Clean up resources
  }

  render() {
    return html`<div>Component</div>`;
  }
}
```

## Common Patterns

### List Component

```typescript
@defineElement({ tag: 'todo-list' })
export class TodoList extends LithiumElement {
  @property({ type: Array }) todos: Todo[] = [];

  render() {
    return html`
      <ul class="todo-list">
        ${this.todos.map((todo, index) => html`
          <li class="${todo.completed ? 'completed' : ''}">
            <input 
              type="checkbox" 
              .checked=${todo.completed}
              @change=${() => this.toggleTodo(index)}>
            <span>${todo.text}</span>
            <button @click=${() => this.deleteTodo(index)}>×</button>
          </li>
        `)}
      </ul>
    `;
  }

  private toggleTodo(index: number) {
    this.output('toggle', { index });
  }

  private deleteTodo(index: number) {
    this.output('delete', { index });
  }
}
```

### Conditional Component

```typescript
@defineElement({ tag: 'alert-box' })
export class AlertBox extends LithiumElement {
  @property() type: 'success' | 'error' | 'warning' | 'info' = 'info';
  @property() message = '';
  @property({ type: Boolean }) visible = false;

  render() {
    if (!this.visible) return html``;

    return html`
      <div class="alert alert-${this.type}">
        <span class="icon">${this.getIcon()}</span>
        <span class="message">${this.message}</span>
        <button @click=${this.close}>×</button>
      </div>
    `;
  }

  private getIcon() {
    switch (this.type) {
      case 'success': return '✓';
      case 'error': return '✗';
      case 'warning': return '⚠';
      default: return 'ℹ';
    }
  }

  private close() {
    this.visible = false;
    this.output('close');
  }
}
```

### Component with Deferred Loading

```typescript
@defineElement({ tag: 'image-gallery' })
export class ImageGallery extends LithiumElement {
  @property({ type: Array }) images: string[] = [];

  render() {
    return html`
      <div class="gallery">
        ${this.images.map(img => this.renderImage(img))}
      </div>
    `;
  }

  @lazy({
    placeholder: html`<div class="placeholder">Loading...</div>`,
    threshold: 0.5
  })
  private renderImage(src: string) {
    return html`
      <img src="${src}" alt="Gallery image" />
    `;
  }
}
```

## Atomic vs Molecular Components

### Atomic (Button)

```typescript
// Basic, reusable component, no business logic
@defineElement({ tag: 'button-atomic' })
export class ButtonAtomic extends LithiumElement {
  @property() variant: ButtonVariant = 'filled';
  @property() color: ColorVariant = 'primary';
  @property({ type: Boolean }) disabled = false;

  render() {
    return html`
      <button class="${this.variant} ${this.color}">
        <slot></slot>
      </button>
    `;
  }
}
```

### Molecular (Card with Button)

```typescript
// Composition of atomics with specific logic
@defineElement({ tag: 'product-card-molecular' })
export class ProductCardMolecular extends LithiumElement {
  @property() product?: Product;

  render() {
    return html`
      <div class="product-card">
        <img src="${this.product?.image}" />
        <h3>${this.product?.name}</h3>
        <p>${this.product?.price}€</p>
        <button-atomic 
          color="primary" 
          @click=${this.handleBuy}>
          Buy Now
        </button-atomic>
      </div>
    `;
  }

  private handleBuy() {
    this.output('buy', { product: this.product });
  }
}
```

## Best Practices

### ✅ Do
- Use `@property()` for public props
- Use `@state()` for simple internal state
- Use `signal()` for reactive state with computed
- Use `channel()` for shared global state
- Emit events with `output()` for parent-child communication
- Clean up listeners in `disconnectedCallback`
- Keep components small and focused
- Create new arrays/objects when updating signals (immutability)

### ❌ Avoid
- Mutating props directly
- Mutating signal values directly (use `.value = ...`)
- Accessing DOM before `firstUpdated`
- Forgetting `super.connectedCallback()`
- Components with more than 300 lines
- Complex business logic in UI components
- Sharing @state() between components (use signals or channels)