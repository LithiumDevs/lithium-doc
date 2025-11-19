# Project Structure

## Overview

Lithium promotes a clear and organized project structure that separates responsibilities and facilitates scalability. The architecture is based on well-defined hierarchical layers.

## Complete Structure

```
my-lithium-app/
├── config/
│   └── lithium/                    # Framework core
│       ├── index.ts                # Main exports
│       ├── lithium-app.ts          # Base class for application
│       ├── lithium-module.ts       # Base class for modules
│       ├── lithium-page.ts         # Base class for pages
│       ├── lithium-element.ts      # Base class for components
│       ├── lithium-router.ts       # Router component with guards
│       ├── event-bus.ts            # Global event system
│       └── decorators/
│           ├── defer.ts            # @defer decorator
│           ├── lazy.ts             # @lazy decorator
│           └── delay.ts            # @delay decorator
├── src/
│   ├── main-app.ts                   # App entry point
│   ├── routes/
│   │   └── routes.ts               # Main routes
│   ├── modules/                    # Application modules
│   │   ├── public/                 # Public module
│   │   │   ├── public.module.ts    # Module definition
│   │   │   ├── public.routes.ts    # Module routes
│   │   │   ├── pages/              # Module pages
│   │   │   │   ├── home/
│   │   │   │   │   ├── home.page.ts
│   │   │   │   │   └── home.page.css
│   │   │   │   ├── about/
│   │   │   │   │   ├── about.page.ts
│   │   │   │   │   └── about.page.css
│   │   │   │   └── contact/
│   │   │   │       ├── contact.page.ts
│   │   │   │       └── contact.page.css
│   │   │   └── section/            # Reusable module sections
│   │   │       ├── public-header/
│   │   │       │   ├── public-header.component.ts
│   │   │       │   └── public-header.component.css
│   │   │       └── public-footer/
│   │   │           ├── public-footer.component.ts
│   │   │           └── public-footer.component.css
│   │   ├── admin/                  # Administration module
│   │   │   ├── admin.module.ts
│   │   │   ├── admin.routes.ts
│   │   │   └── pages/
│   │   │       ├── dashboard/
│   │   │       ├── users/
│   │   │       └── settings/
│   │   └── auth/                   # Authentication module
│   │       ├── auth.module.ts
│   │       ├── auth.routes.ts
│   │       └── pages/
│   │           ├── login/
│   │           └── register/
│   ├── components/                 # Reusable global components
│   │   ├── atomics/                # Atomic components (Design System)
│   │   │   ├── button/
│   │   │   │   ├── button.atomic.ts
│   │   │   │   ├── button.atomic.css
│   │   │   │   └── button.interface.ts
│   │   │   ├── input/
│   │   │   │   ├── input.atomic.ts
│   │   │   │   └── input.atomic.css
│   │   │   └── card/
│   │   │       ├── card.atomic.ts
│   │   │       └── card.atomic.css
│   │   ├── molecules/              # Molecular components
│   │   │   └── form-field/
│   │   │       ├── form-field.component.ts
│   │   │       └── form-field.component.css
│   │   └── organisms/              # Complex components
│   │       └── nav-bar/
│   │           ├── nav-bar.component.ts
│   │           └── nav-bar.component.css
│   ├── core/                       # Shared business logic
│   │   ├── interfaces/             # Types and interfaces
│   │   │   ├── colors.interface.ts
│   │   │   ├── user.interface.ts
│   │   │   └── api.interface.ts
│   │   ├── services/               # Services
│   │   │   ├── api.service.ts
│   │   │   ├── auth.service.ts
│   │   │   └── storage.service.ts
│   │   └── utils/                  # Utilities
│   │       ├── validators.ts
│   │       └── formatters.ts
│   ├── styles/                     # Global styles
│   │   ├── index.css               # CSS variables and color palette
│   │   ├── global.css              # Base global styles
│   │   └── material-theme.css      # Theme for Material Web
│   └── assets/                     # Static resources
│       ├── images/
│       ├── fonts/
│       └── icons/
├── public/                         # Public files
│   ├── favicon.ico
│   └── robots.txt
├── index.html                      # Main HTML
├── package.json                    # Dependencies
├── tsconfig.json                   # TypeScript configuration
├── vite.config.ts                  # Vite configuration
└── README.md
```

## Layer Architecture

### 1. **LithiumApp** (Root)
- Single file: `main-app.ts`
- Defines main routes
- Can have global layout
- Application entry point

```typescript
// src/main-app.ts
@defineApp({
  tag: 'main-app',
  routes: routes,
  styles: [appStyle]
})
export class MainApp extends LithiumApp {}
```

### 2. **LithiumModule** (Modules)
- Group related functionality
- Have their own routes
- Can have specific layouts
- Examples: `public`, `admin`, `auth`

```typescript
// src/modules/public/public.module.ts
@defineModule({
  tag: 'public-module',
  routes: publicRoutes
})
export class PublicModule extends LithiumModule {}
```

### 3. **LithiumPage** (Pages)
- Represent views/screens
- Associated with a specific route
- Can change browser title
- Compose UI with components

```typescript
// src/modules/public/pages/home/home.page.ts
@definePage({ 
  tag: 'home-page',
  title: 'Home - My App'
})
export class HomePage extends LithiumElement {}
```

### 4. **LithiumElement** (Components)
- Reusable throughout the app
- No route state
- Atomic Design: atomics, molecules, organisms
- Can emit events

```typescript
// src/components/atomics/button/button.atomic.ts
@defineElement({
  tag: 'button-atomic',
  styles: [buttonStyle]
})
export class ButtonAtomic extends LithiumElement {}
```

## Naming Conventions

### Files
```
[name].[type].[extension]

✅ Correct examples:
- home.page.ts          # Page
- button.atomic.ts      # Atomic component
- nav-bar.component.ts  # General component
- public.module.ts      # Module
- auth.service.ts       # Service
- user.interface.ts     # Interface

❌ Avoid:
- HomePage.ts           # Don't use PascalCase for files
- button.ts             # Missing type
- my-component.tsx      # We don't use JSX
```

### Tags HTML
```
Format: [descriptive-name]

✅ Correct examples:
- <button-atomic>
- <nav-bar>
- <home-page>
- <public-module>

❌ Avoid:
- <button>              # Conflict with native HTML
- <MyButton>            # Don't use PascalCase
- <btn>                 # Be descriptive
```

### TypeScript Classes
```
Format: PascalCase + Type

✅ Correct examples:
- class HomePage extends LithiumElement
- class ButtonAtomic extends LithiumElement
- class PublicModule extends LithiumModule
- class ApiService

❌ Avoid:
- class homePage        # Use PascalCase
- class Home            # Add type (HomePage)
```

## Organization by Modules

### Public Module
```
modules/public/
├── public.module.ts
├── public.routes.ts
├── pages/              # Module pages
│   ├── home/
│   ├── about/
│   └── contact/
└── section/           # Module-specific sections
    ├── public-header/
    └── public-footer/
```

### Admin Module
```
modules/admin/
├── admin.module.ts
├── admin.routes.ts
├── pages/
│   ├── dashboard/
│   ├── users/
│   └── settings/
└── components/        # Module-specific components
    └── admin-sidebar/
```

## Import System

### Path Aliases (tsconfig.json)
```json
{
  "compilerOptions": {
    "baseUrl": ".",
    "paths": {
      "@lithium": ["./config/lithium"],
      "@core": ["./src/core"],
      "@core/*": ["./src/core/*"],
      "@components": ["./src/components"],
      "@components/*": ["./src/components/*"]
    }
  }
}
```

### Using Aliases
```typescript
// ✅ With alias (recommended)
import { LithiumElement } from '@lithium';
import { ApiService } from '@core/services/api.service';
import '@components/atomics/button/button.atomic';

// ❌ Without alias (avoid)
import { LithiumElement } from '../../../../../config/lithium';
import { ApiService } from '../../../core/services/api.service';
import '../../../../components/atomics/button/button.atomic';
```

## CSS and Styles

### Global Styles
```
src/styles/
├── index.css           # Variables, colors, tokens
├── global.css          # Reset, typography, animations
└── material-theme.css  # Theming for external libraries
```

### Component Styles
```typescript
import style from './button.atomic.css?inline';

@defineElement({
  tag: 'button-atomic',
  styles: [style]  // Scoped to component
})
```