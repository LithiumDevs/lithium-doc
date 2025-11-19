# Communication - Signals, EventBus and Channels

## Introduction

Lithium provides three communication systems:

1. **Signals**: Local reactive state with computed values (powered by @lit-labs/signals)
2. **EventBus**: Global events for communication between decoupled components
3. **Channels**: Shared global reactive state (global signals with persistence)

## Signals - Local Reactive State

Lithium uses **@lit-labs/signals** for reactive state. All components that extend `LithiumElement` are `SignalWatcher`, which allows using signals and automatically updating the render when they change.

### Basic Signal

```typescript
import { signal } from '@lit-labs/signals';

@defineElement({ tag: 'counter-component' })
export class CounterComponent extends LithiumElement {
  // Local signal (reactive)
  private count = signal(0);

  render() {
    return html`
      <div>
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

Computed signals automatically recalculate when their dependencies change:

```typescript
import { signal, computed } from '@lit-labs/signals';

@defineElement({ tag: 'shopping-cart' })
export class ShoppingCart extends LithiumElement {
  private items = signal<Product[]>([]);
  
  // Computed: recalculates automatically
  private total = computed(() => {
    return this.items.value.reduce((sum, item) => sum + item.price, 0);
  });

  private itemCount = computed(() => this.items.value.length);

  render() {
    return html`
      <div class="cart">
        <h3>Cart (${this.itemCount.value} items)</h3>
        <p>Total: ${this.total.value}€</p>
      </div>
    `;
  }
}
```

### Shared Signals

You can create global signals to share state between components:

```typescript
// shared-state.ts
import { signal, computed } from '@lit-labs/signals';

export const cartItems = signal<Product[]>([]);
export const cartTotal = computed(() => 
  cartItems.value.reduce((sum, item) => sum + item.price, 0)
);

// product-card.component.ts
import { cartItems } from './shared-state';

@defineElement({ tag: 'product-card' })
export class ProductCard extends LithiumElement {
  private addToCart() {
    // Update shared signal
    cartItems.value = [...cartItems.value, this.product];
  }
}

// cart-badge.component.ts
import { cartItems } from './shared-state';

@defineElement({ tag: 'cart-badge' })
export class CartBadge extends LithiumElement {
  render() {
    // Updates automatically when cartItems changes
    return html`
      <div class="badge">🛒 ${cartItems.value.length}</div>
    `;
  }
}
```

### Signal.peek() - Read Without Observing

```typescript
@defineElement({ tag: 'logger' })
export class Logger extends LithiumElement {
  private count = signal(0);

  private logCount() {
    // peek() reads the value WITHOUT creating reactive dependency
    console.log('Current count:', this.count.peek());
    
    // This method will NOT re-execute when count changes
  }

  render() {
    // value creates reactive dependency (re-renders)
    return html`<p>Count: ${this.count.value}</p>`;
  }
}
```

## EventBus

The EventBus is a pub/sub system for broadcasting and listening to global events.

### Arquitectura

```typescript
// config/lithium/event-bus.ts
export class EventBus {
  private static listeners: Map<string, Set<Function>> = new Map();

  static emit(event: string, data?: any) {
    const callbacks = this.listeners.get(event);
    if (callbacks) {
      callbacks.forEach(callback => callback(data));
    }
  }

  static on(event: string, callback: Function) {
    if (!this.listeners.has(event)) {
      this.listeners.set(event, new Set());
    }
    this.listeners.get(event)!.add(callback);
  }

  static off(event: string, callback: Function) {
    const callbacks = this.listeners.get(event);
    if (callbacks) {
      callbacks.delete(callback);
    }
  }
}
```

### Emitting Events

#### From Components (emit)

```typescript
@defineElement({ tag: 'shopping-cart' })
export class ShoppingCart extends LithiumElement {
  private addToCart(product: Product) {
    // Emit global event
    this.emit('cart:add', { product });
    
    // Show notification
    this.emit('toast:show', { 
      message: 'Product added to cart',
      type: 'success'
    });
  }

  render() {
    return html`
      <button @click=${() => this.addToCart(product)}>
        Add to Cart
      </button>
    `;
  }
}
```

#### Emitting from Anywhere

```typescript
import { EventBus } from '@lithium';

// In services, utilities, etc.
export class CartService {
  static addProduct(product: Product) {
    // Business logic
    const cart = this.getCart();
    cart.push(product);
    
    // Notify change
    EventBus.emit('cart:updated', { cart });
  }
}
```

### Listening to Events

#### In Components (on)

```typescript
@defineElement({ tag: 'cart-badge' })
export class CartBadge extends LithiumElement {
  @state() private itemCount = 0;

  connectedCallback() {
    super.connectedCallback();
    
    // Listen to add to cart event
    this.on('cart:add', (data) => {
      this.itemCount++;
    });
    
    // Listen to remove event
    this.on('cart:remove', (data) => {
      this.itemCount--;
    });
    
    // Listen to complete update
    this.on('cart:updated', (data) => {
      this.itemCount = data.cart.length;
    });
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

#### Cleaning Up Listeners

```typescript
@defineElement({ tag: 'notification-center' })
export class NotificationCenter extends LithiumElement {
  private notificationHandler: Function;

  connectedCallback() {
    super.connectedCallback();
    
    // Save handler reference
    this.notificationHandler = (data: any) => {
      this.showNotification(data);
    };
    
    this.on('toast:show', this.notificationHandler);
  }

  disconnectedCallback() {
    super.disconnectedCallback();
    
    // Clean up listener
    EventBus.off('toast:show', this.notificationHandler);
  }

  private showNotification(data: any) {
    // Show notification
  }

  render() {
    return html`<div class="notification-center"></div>`;
  }
}
```

## Channels

Channels are **global signals** managed by Lithium with support for localStorage/sessionStorage.

### Arquitectura

```typescript
// config/lithium/event-bus.ts
import { signal } from '@lit-labs/signals';

export interface ChannelConfig {
  storage?: 'local' | 'session';
  key?: string;
}

export class Channels {
  private static channels: Map<string, any> = new Map();

  static get(name: string, defaultValue?: any, config?: ChannelConfig) {
    if (!this.channels.has(name)) {
      let initialValue = defaultValue;

      // Cargar desde storage si está configurado
      if (config?.storage) {
        const storageKey = config.key || `channel:${name}`;
        const storage = config.storage === 'local' ? localStorage : sessionStorage;
        const stored = storage.getItem(storageKey);
        
        if (stored !== null) {
          try {
            initialValue = JSON.parse(stored);
          } catch (e) {
            initialValue = stored;
          }
        }
      }

      const channel = signal(initialValue);
      
      // Sincronizar con storage
      if (config?.storage) {
        const storageKey = config.key || `channel:${name}`;
        const storage = config.storage === 'local' ? localStorage : sessionStorage;
        
        // Watch para cambios
        const originalSet = channel.set.bind(channel);
        channel.set = (value: any) => {
          originalSet(value);
          storage.setItem(storageKey, JSON.stringify(value));
        };
      }

      this.channels.set(name, channel);
    }

    return this.channels.get(name);
  }
}
```

### Creating and Using Channels

#### Simple Channel

```typescript
@definePage({ tag: 'home-page' })
export class HomePage extends LithiumElement {
  render() {
    // Leer valor del canal
    const theme = this.channel('theme').value || 'light';
    
    return html`
      <div class="page theme-${theme}">
        <h1>Welcome</h1>
      </div>
    `;
  }
}
```

#### Channel with Initial Value

```typescript
@defineElement({ tag: 'theme-toggle' })
export class ThemeToggle extends LithiumElement {
  @state() private theme = 'light';

  connectedCallback() {
    super.connectedCallback();
    
    // Initialize channel with default value
    this.theme = this.channel('theme', 'light').value;
  }

  private toggleTheme() {
    const newTheme = this.theme === 'light' ? 'dark' : 'light';
    
    // Update channel
    this.channel('theme').value = newTheme;
    
    // Update local state
    this.theme = newTheme;
  }

  render() {
    return html`
      <button @click=${this.toggleTheme}>
        ${this.theme === 'light' ? '🌙 Dark' : '☀️ Light'}
      </button>
    `;
  }
}
```

#### Channel with Persistence

```typescript
@defineElement({ tag: 'user-menu' })
export class UserMenu extends LithiumElement {
  connectedCallback() {
    super.connectedCallback();
    
    // Channel with localStorage
    const userChannel = this.channel('user', null, {
      storage: 'local',
      key: 'app:user'
    });
    
    console.log('Logged user:', userChannel.value);
  }

  private logout() {
    // Clear channel
    this.channel('user').value = null;
    
    this.navigate('/login');
  }

  render() {
    const user = this.channel('user').value;
    
    return html`
      <div class="user-menu">
        ${user ? html`
          <span>Hello, ${user.name}</span>
          <button @click=${this.logout}>Logout</button>
        ` : html`
          <a href="/login">Login</a>
        `}
      </div>
    `;
  }
}
```

### Listening to Changes (subscribe)

```typescript
@defineElement({ tag: 'cart-summary' })
export class CartSummary extends LithiumElement {
  @state() private cart: Product[] = [];
  @state() private total = 0;

  connectedCallback() {
    super.connectedCallback();
    
    // Initial value
    this.cart = this.channel('cart', []).value;
    this.updateTotal();
    
    // Listen to channel changes
    this.subscribe('cart', (newCart) => {
      this.cart = newCart;
      this.updateTotal();
    });
  }

  private updateTotal() {
    this.total = this.cart.reduce((sum, item) => sum + item.price, 0);
  }

  render() {
    return html`
      <div class="cart-summary">
        <h3>Cart (${this.cart.length} items)</h3>
        <p>Total: ${this.total}€</p>
      </div>
    `;
  }
}
```

## output() - Component Events

The `output()` method emits CustomEvent events that the parent component can listen to.

### Emitting with output()

```typescript
@defineElement({ tag: 'product-card' })
export class ProductCard extends LithiumElement {
  @property() product?: Product;

  private handleAddToCart() {
    // Emit event to parent
    this.output('addToCart', { 
      product: this.product,
      timestamp: Date.now()
    });
  }

  private handleViewDetails() {
    this.output('viewDetails', { productId: this.product?.id });
  }

  render() {
    return html`
      <div class="product-card">
        <h3>${this.product?.name}</h3>
        <p>${this.product?.price}€</p>
        <button @click=${this.handleAddToCart}>Add to Cart</button>
        <button @click=${this.handleViewDetails}>Details</button>
      </div>
    `;
  }
}
```

### Listening to output()

```typescript
@definePage({ tag: 'products-page' })
export class ProductsPage extends LithiumElement {
  @property() products: Product[] = [];

  render() {
    return html`
      <div class="products-grid">
        ${this.products.map(product => html`
          <product-card
            .product=${product}
            @addToCart=${this.handleAddToCart}
            @viewDetails=${this.handleViewDetails}>
          </product-card>
        `)}
      </div>
    `;
  }

  private handleAddToCart(e: CustomEvent) {
    const { product } = e.detail;
    
    // Add to cart
    const cart = this.channel('cart').value || [];
    cart.push(product);
    this.channel('cart').value = [...cart];
    
    // Show notification
    this.emit('toast:show', { 
      message: `${product.name} added to cart` 
    });
  }

  private handleViewDetails(e: CustomEvent) {
    const { productId } = e.detail;
    this.navigate(`/products/${productId}`);
  }
}
```

## Patrones de Comunicación

### Patrón 1: Estado Local (signal)

```
┌─────────────────┐
│   Component     │
│   signal(...)   │ ← Solo accesible dentro del componente
└─────────────────┘
```

```typescript
// Signal local
private count = signal(0);
```

### Patrón 2: Estado Compartido (signal exportado)

```
┌─────────────────┐
│   ComponentA    │
│   signal.value  │
└────────┬────────┘
         │
         ▼
   Shared Signal
         │
         ▼
┌─────────────────┐
│   ComponentB    │
│   signal.value  │
└─────────────────┘
```

```typescript
// shared-state.ts
export const sharedCount = signal(0);

// Components A & B
sharedCount.value++;
```

### Patrón 3: Componente → Padre (output)

```
┌─────────────────┐
│   ParentPage    │
│  @handleEvent   │
└────────┬────────┘
         │ listens
         ▼
┌─────────────────┐
│  ChildComponent │
│   output(...)   │
└─────────────────┘
```

```typescript
// Child
this.output('save', { data });

// Parent
html`
  <child-component @save=${this.handleSave}>
  </child-component>
`
```

### Patrón 4: Comunicación Global (emit/EventBus)

```
┌─────────────────┐
│   ComponentA    │
│   emit('...')   │
└────────┬────────┘
         │
         ▼
     EventBus
         │
         ▼
┌─────────────────┐
│   ComponentB    │
│    on('...')    │
└─────────────────┘
```

```typescript
// Component A
this.emit('user:login', { user });

// Component B
this.on('user:login', (data) => {
  console.log('User logged in:', data.user);
});
```

### Patrón 5: Estado Global Persistente (channel)

```
┌─────────────────┐
│   ComponentA    │
│  channel.value  │
└────────┬────────┘
         │
         ▼
 Channel (localStorage)
         │
         ▼
┌─────────────────┐
│   ComponentB    │
│  subscribe(...) │
└─────────────────┘
```

```typescript
// Component A
this.channel('cart').value = newCart;

// Component B
this.subscribe('cart', (newCart) => {
  this.updateUI(newCart);
});
```

## Complete Examples

### Shopping Cart

```typescript
// product-card.component.ts
@defineElement({ tag: 'product-card' })
export class ProductCard extends LithiumElement {
  @property() product?: Product;

  private addToCart() {
    // 1. Update channel
    const cart = this.channel('cart', []).value;
    cart.push(this.product);
    this.channel('cart').value = [...cart];
    
    // 2. Emit global event
    this.emit('cart:updated', { cart });
    
    // 3. Emit event to parent
    this.output('addedToCart', { product: this.product });
  }

  render() {
    return html`
      <button @click=${this.addToCart}>Add to Cart</button>
    `;
  }
}

// cart-badge.component.ts
@defineElement({ tag: 'cart-badge' })
export class CartBadge extends LithiumElement {
  @state() private count = 0;

  connectedCallback() {
    super.connectedCallback();
    
    // Read initial value
    this.count = this.channel('cart', []).value.length;
    
    // Listen to changes
    this.subscribe('cart', (cart) => {
      this.count = cart.length;
    });
  }

  render() {
    return html`
      <div class="badge">🛒 ${this.count}</div>
    `;
  }
}
```

### Notification System

```typescript
// notification-service.ts
export class NotificationService {
  static show(message: string, type: 'success' | 'error' | 'warning' = 'success') {
    EventBus.emit('toast:show', { message, type });
  }

  static success(message: string) {
    this.show(message, 'success');
  }

  static error(message: string) {
    this.show(message, 'error');
  }
}

// toast-container.component.ts
@defineElement({ tag: 'toast-container' })
export class ToastContainer extends LithiumElement {
  @state() private toasts: Toast[] = [];

  connectedCallback() {
    super.connectedCallback();
    
    this.on('toast:show', (data) => {
      const toast = { ...data, id: Date.now() };
      this.toasts = [...this.toasts, toast];
      
      // Auto-hide after 3s
      setTimeout(() => this.removeToast(toast.id), 3000);
    });
  }

  private removeToast(id: number) {
    this.toasts = this.toasts.filter(t => t.id !== id);
  }

  render() {
    return html`
      <div class="toast-container">
        ${this.toasts.map(toast => html`
          <div class="toast toast-${toast.type}">
            ${toast.message}
            <button @click=${() => this.removeToast(toast.id)}>×</button>
          </div>
        `)}
      </div>
    `;
  }
}

// Use from any component
NotificationService.success('Product added to cart!');
NotificationService.error('Failed to save changes');
```

## Best Practices

### ✅ Do
- Use `signal()` for local reactive state
- Use `computed()` for derived values
- Use `output()` for direct parent-child communication
- Use `emit()` for global events between decoupled components
- Use `channel()` for shared reactive state with persistence
- Export signals when you need to share them between components
- Clean up listeners in `disconnectedCallback`
- Create new arrays/objects when updating signals (immutability)
- Use `peek()` when you don't want to create reactive dependencies

### ❌ Avoid
- Overusing global events (can make debugging difficult)
- Forgetting to clean up listeners
- Using channels for temporary data
- Mutating signal values directly (use `signal.value = ...`)
- Creating too many shared signals (prefer channels for global state)
- Using `@state()` when you need computed values (better to use signals)