# Internationalization (i18n)

This guide covers the internationalization system built for Nakamapp, providing a reactive and easy-to-use API for multilingual support.

## Overview

The i18n system is split into two layers:

- **`i18n.core.ts`**: Internal implementation with reactive state management
- **`index.ts`**: Public API with developer configuration

This separation ensures that developers only interact with the high-level API while keeping the internal logic isolated.

## Architecture

### Reactive Locale Management

The system uses a custom reactive object that notifies subscribers when the locale changes:

```typescript
const currentLocale = {
  value: 'es',
  subscribe(callback) { /* ... */ },
}
```

This enables automatic UI updates when the locale changes, making all components reactive to language switches.

### Translation Storage

Translations are stored in JSON files under `src/i18n/locales/`:

```
src/i18n/
├── index.ts           # Public API
├── i18n.core.ts       # Internal implementation
└── locales/
    ├── es.json        # Spanish translations
    └── en.json        # English translations
```

## Configuration

Edit `src/i18n/index.ts` to configure the i18n system:

```typescript
// Supported locales
export const SUPPORTED_LOCALES: Locale[] = ['es', 'en'];

// Default locale
export const DEFAULT_LOCALE: Locale = 'es';

// localStorage key
export const STORAGE_KEY = 'app:locale';

// Path to translation files
export const LOCALES_PATH = './locales';
```

## Translation Files

Translation files use nested objects with dot notation keys:

**es.json:**
```json
{
  "common": {
    "welcome": "Bienvenido",
    "loading": "Cargando..."
  },
  "login": {
    "title": "Iniciar sesión",
    "email": "Email",
    "password": "Contraseña"
  }
}
```

**en.json:**
```json
{
  "common": {
    "welcome": "Welcome",
    "loading": "Loading..."
  },
  "login": {
    "title": "Sign in",
    "email": "Email",
    "password": "Password"
  }
}
```

## API Reference

### `initI18n()`

Initializes the i18n system. Must be called at application startup.

```typescript
// In my-app.ts
import { initI18n } from '@/i18n';

async connectedCallback() {
  super.connectedCallback();
  await initI18n();
}
```

**What it does:**
1. Checks localStorage for saved locale preference
2. Falls back to browser language detection
3. Uses DEFAULT_LOCALE if neither is available
4. Preloads translations for the initial locale

### `t(key, params?)`

Gets a translation by its key using dot notation.

```typescript
import { t } from '@/i18n';

// Simple translation
t('login.title')  // "Iniciar sesión"

// Nested keys
t('public.welcome.subtitle')  // "Hagamos al Internet grande otra vez"

// With parameters
t('hello', { name: 'Juan' })  // "Hello Juan"
```

**Parameters:**
- `key`: Translation key using dot notation
- `params`: Optional object for parameter interpolation

**Returns:** Translated string, or the key itself if not found

### `setLocale(locale)`

Changes the current application locale and persists it to localStorage.

```typescript
import { setLocale } from '@/i18n';

// Switch to English
setLocale('en');

// Switch to Spanish
setLocale('es');
```

The UI will automatically update thanks to reactive subscriptions.

### `getLocale()`

Gets the current locale.

```typescript
import { getLocale } from '@/i18n';

const current = getLocale();  // 'es' or 'en'
```

### `onLocaleChange(callback)`

Subscribes to locale changes.

```typescript
import { onLocaleChange } from '@/i18n';

const unsubscribe = onLocaleChange((newLocale) => {
  console.log('Locale changed to:', newLocale);
  // Update your component state
});

// Unsubscribe when no longer needed
unsubscribe();
```

**Returns:** Unsubscribe function

## Usage in Components

### Basic Usage

```typescript
import { definePage, html, LithiumPage } from '@lithium';
import { t } from '@/i18n';

@definePage({ tag: 'my-page' })
export class MyPage extends LithiumPage {
  render() {
    return html`
      <h1>${t('home.title')}</h1>
      <p>${t('home.description')}</p>
      <button>${t('home.cta')}</button>
    `;
  }
}
```

### Reactive Locale Switching

Components automatically re-render when the locale changes because `t()` reads from the reactive `currentLocale` object. Lit's reactive system detects this and triggers updates.

```typescript
import { definePage, html, LithiumPage } from '@lithium';
import { t, setLocale } from '@/i18n';

@definePage({ tag: 'my-page' })
export class MyPage extends LithiumPage {
  render() {
    return html`
      <h1>${t('home.title')}</h1>
      
      <button @click=${() => setLocale('es')}>Español</button>
      <button @click=${() => setLocale('en')}>English</button>
    `;
  }
}
```

### HTML Content in Translations

For translations containing HTML tags, use `unsafeHTML` from Lit:

```typescript
import { unsafeHTML } from 'lit/directives/unsafe-html.js';

render() {
  return html`
    <p>${unsafeHTML(t('sections.magazine.description'))}</p>
  `;
}
```

**Translation with HTML:**
```json
{
  "sections": {
    "magazine": {
      "description": "Inmortalizados en nuestra <strong>Revista Anual</strong>."
    }
  }
}
```

### Parameter Interpolation

Use `{paramName}` in translations for dynamic values:

**Translation:**
```json
{
  "greeting": "Hello {name}, you have {count} messages"
}
```

**Usage:**
```typescript
t('greeting', { name: 'Juan', count: 5 })
// "Hello Juan, you have 5 messages"
```

## Language Switcher Component

Example of a language switcher component:

```typescript
import { defineElement, html, LithiumElement } from '@lithium';
import { setLocale, getLocale, onLocaleChange } from '@/i18n';
import '@material/web/button/text-button.js';

@defineElement({ tag: 'language-switcher' })
export class LanguageSwitcher extends LithiumElement {
  private currentLocale = getLocale();

  connectedCallback() {
    super.connectedCallback();
    
    // Subscribe to locale changes
    onLocaleChange((locale) => {
      this.currentLocale = locale;
      this.requestUpdate();
    });
  }

  render() {
    return html`
      <md-text-button 
        @click=${() => setLocale('es')}
        ?disabled=${this.currentLocale === 'es'}
      >
        Español
      </md-text-button>
      
      <md-text-button 
        @click=${() => setLocale('en')}
        ?disabled=${this.currentLocale === 'en'}
      >
        English
      </md-text-button>
    `;
  }
}
```

## Best Practices

### 1. Organize by Feature

Structure translations by feature or section:

```json
{
  "common": { /* shared strings */ },
  "nav": { /* navigation */ },
  "login": { /* login page */ },
  "register": { /* register page */ },
  "home": { /* home page */ }
}
```

### 2. Use Descriptive Keys

Prefer descriptive keys over generic ones:

```typescript
// Good
t('login.emailLabel')
t('register.passwordConfirm')

// Bad
t('label1')
t('text2')
```

### 3. Keep Translations Synced

Ensure all locale files have the same structure:

```bash
# Both files should have identical keys
src/i18n/locales/es.json
src/i18n/locales/en.json
```

### 4. Initialize Early

Call `initI18n()` in your root component before rendering:

```typescript
@defineApp({ tag: 'my-app' })
export class MyApp extends LithiumApp {
  async connectedCallback() {
    super.connectedCallback();
    await initI18n();  // Load translations first
  }
}
```

### 5. Fallback Strategy

The system gracefully handles missing translations by returning the key itself, making it easy to spot missing translations during development.

## Adding a New Language

1. Create a new JSON file in `src/i18n/locales/`:

```bash
touch src/i18n/locales/fr.json
```

2. Add the locale to `SUPPORTED_LOCALES`:

```typescript
// src/i18n/index.ts
export const SUPPORTED_LOCALES: Locale[] = ['es', 'en', 'fr'];
```

3. Update the `Locale` type in `i18n.core.ts`:

```typescript
export type Locale = 'es' | 'en' | 'fr';
```

4. Copy the structure from `es.json` and translate:

```json
{
  "common": {
    "welcome": "Bienvenue"
  }
}
```

## Performance Considerations

### Lazy Loading

Translations are loaded only when needed. The system caches them after the first load:

```typescript
// First call: loads from network
await loadTranslations('es');

// Subsequent calls: returns from cache
await loadTranslations('es');
```

### Bundle Size

Translation files are loaded as separate chunks, not included in the main bundle. This keeps your initial bundle size small.

## Troubleshooting

### Translations Not Updating

Ensure you're calling `initI18n()` before rendering:

```typescript
async connectedCallback() {
  super.connectedCallback();
  await initI18n();  // Required
}
```

### Missing Translations

Check the browser console for warnings about missing translations:

```
Failed to load translations for locale: fr
```

### UI Not Re-rendering

Make sure you're using `t()` inside your `render()` method, not storing the result in a property:

```typescript
// Good - Reactive
render() {
  return html`<h1>${t('home.title')}</h1>`;
}

// Bad - Not reactive
title = t('home.title');
render() {
  return html`<h1>${this.title}</h1>`;
}
```

## Summary

The i18n system provides:

- **Reactive locale switching** with automatic UI updates
- **Simple API** with just 5 functions
- **Type-safe** locale definitions
- **Lazy loading** of translation files
- **localStorage persistence** of user preference
- **Browser language detection** as fallback
- **Parameter interpolation** for dynamic content
- **Developer-friendly** separation of concerns

By following this guide, you can easily add multilingual support to your Nakamapp application.