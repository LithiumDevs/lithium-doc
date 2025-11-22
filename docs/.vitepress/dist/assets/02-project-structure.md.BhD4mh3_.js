import{_ as a,c as n,o as i,ah as p}from"./chunks/framework.CgVAxXO8.js";const d=JSON.parse('{"title":"Project Structure","description":"","frontmatter":{},"headers":[],"relativePath":"02-project-structure.md","filePath":"02-project-structure.md"}'),e={name:"02-project-structure.md"};function l(t,s,h,c,r,o){return i(),n("div",null,[...s[0]||(s[0]=[p(`<h1 id="project-structure" tabindex="-1">Project Structure <a class="header-anchor" href="#project-structure" aria-label="Permalink to “Project Structure”">​</a></h1><h2 id="overview" tabindex="-1">Overview <a class="header-anchor" href="#overview" aria-label="Permalink to “Overview”">​</a></h2><p>Lithium promotes a clear and organized project structure that separates responsibilities and facilitates scalability. The architecture is based on well-defined hierarchical layers.</p><h2 id="complete-structure" tabindex="-1">Complete Structure <a class="header-anchor" href="#complete-structure" aria-label="Permalink to “Complete Structure”">​</a></h2><div class="language-"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark" style="--shiki-light:#24292e;--shiki-dark:#e1e4e8;--shiki-light-bg:#fff;--shiki-dark-bg:#24292e;" tabindex="0" dir="ltr"><code><span class="line"><span>my-lithium-app/</span></span>
<span class="line"><span>├── config/</span></span>
<span class="line"><span>│   └── lithium/                    # Framework core</span></span>
<span class="line"><span>│       ├── index.ts                # Main exports</span></span>
<span class="line"><span>│       ├── lithium-app.ts          # Base class for application</span></span>
<span class="line"><span>│       ├── lithium-module.ts       # Base class for modules</span></span>
<span class="line"><span>│       ├── lithium-page.ts         # Base class for pages</span></span>
<span class="line"><span>│       ├── lithium-element.ts      # Base class for components</span></span>
<span class="line"><span>│       ├── lithium-router.ts       # Router component with guards</span></span>
<span class="line"><span>│       ├── event-bus.ts            # Global event system</span></span>
<span class="line"><span>│       └── decorators/</span></span>
<span class="line"><span>│           ├── defer.ts            # @defer decorator</span></span>
<span class="line"><span>│           ├── lazy.ts             # @lazy decorator</span></span>
<span class="line"><span>│           └── delay.ts            # @delay decorator</span></span>
<span class="line"><span>├── src/</span></span>
<span class="line"><span>│   ├── main-app.ts                   # App entry point</span></span>
<span class="line"><span>│   ├── routes/</span></span>
<span class="line"><span>│   │   └── routes.ts               # Main routes</span></span>
<span class="line"><span>│   ├── modules/                    # Application modules</span></span>
<span class="line"><span>│   │   ├── public/                 # Public module</span></span>
<span class="line"><span>│   │   │   ├── public.module.ts    # Module definition</span></span>
<span class="line"><span>│   │   │   ├── public.routes.ts    # Module routes</span></span>
<span class="line"><span>│   │   │   ├── pages/              # Module pages</span></span>
<span class="line"><span>│   │   │   │   ├── home/</span></span>
<span class="line"><span>│   │   │   │   │   ├── home.page.ts</span></span>
<span class="line"><span>│   │   │   │   │   └── home.page.css</span></span>
<span class="line"><span>│   │   │   │   ├── about/</span></span>
<span class="line"><span>│   │   │   │   │   ├── about.page.ts</span></span>
<span class="line"><span>│   │   │   │   │   └── about.page.css</span></span>
<span class="line"><span>│   │   │   │   └── contact/</span></span>
<span class="line"><span>│   │   │   │       ├── contact.page.ts</span></span>
<span class="line"><span>│   │   │   │       └── contact.page.css</span></span>
<span class="line"><span>│   │   │   └── section/            # Reusable module sections</span></span>
<span class="line"><span>│   │   │       ├── public-header/</span></span>
<span class="line"><span>│   │   │       │   ├── public-header.component.ts</span></span>
<span class="line"><span>│   │   │       │   └── public-header.component.css</span></span>
<span class="line"><span>│   │   │       └── public-footer/</span></span>
<span class="line"><span>│   │   │           ├── public-footer.component.ts</span></span>
<span class="line"><span>│   │   │           └── public-footer.component.css</span></span>
<span class="line"><span>│   │   ├── admin/                  # Administration module</span></span>
<span class="line"><span>│   │   │   ├── admin.module.ts</span></span>
<span class="line"><span>│   │   │   ├── admin.routes.ts</span></span>
<span class="line"><span>│   │   │   └── pages/</span></span>
<span class="line"><span>│   │   │       ├── dashboard/</span></span>
<span class="line"><span>│   │   │       ├── users/</span></span>
<span class="line"><span>│   │   │       └── settings/</span></span>
<span class="line"><span>│   │   └── auth/                   # Authentication module</span></span>
<span class="line"><span>│   │       ├── auth.module.ts</span></span>
<span class="line"><span>│   │       ├── auth.routes.ts</span></span>
<span class="line"><span>│   │       └── pages/</span></span>
<span class="line"><span>│   │           ├── login/</span></span>
<span class="line"><span>│   │           └── register/</span></span>
<span class="line"><span>│   ├── components/                 # Reusable global components</span></span>
<span class="line"><span>│   │   ├── atomics/                # Atomic components (Design System)</span></span>
<span class="line"><span>│   │   │   ├── button/</span></span>
<span class="line"><span>│   │   │   │   ├── button.atomic.ts</span></span>
<span class="line"><span>│   │   │   │   ├── button.atomic.css</span></span>
<span class="line"><span>│   │   │   │   └── button.interface.ts</span></span>
<span class="line"><span>│   │   │   ├── input/</span></span>
<span class="line"><span>│   │   │   │   ├── input.atomic.ts</span></span>
<span class="line"><span>│   │   │   │   └── input.atomic.css</span></span>
<span class="line"><span>│   │   │   └── card/</span></span>
<span class="line"><span>│   │   │       ├── card.atomic.ts</span></span>
<span class="line"><span>│   │   │       └── card.atomic.css</span></span>
<span class="line"><span>│   │   ├── molecules/              # Molecular components</span></span>
<span class="line"><span>│   │   │   └── form-field/</span></span>
<span class="line"><span>│   │   │       ├── form-field.component.ts</span></span>
<span class="line"><span>│   │   │       └── form-field.component.css</span></span>
<span class="line"><span>│   │   └── organisms/              # Complex components</span></span>
<span class="line"><span>│   │       └── nav-bar/</span></span>
<span class="line"><span>│   │           ├── nav-bar.component.ts</span></span>
<span class="line"><span>│   │           └── nav-bar.component.css</span></span>
<span class="line"><span>│   ├── core/                       # Shared business logic</span></span>
<span class="line"><span>│   │   ├── interfaces/             # Types and interfaces</span></span>
<span class="line"><span>│   │   │   ├── colors.interface.ts</span></span>
<span class="line"><span>│   │   │   ├── user.interface.ts</span></span>
<span class="line"><span>│   │   │   └── api.interface.ts</span></span>
<span class="line"><span>│   │   ├── services/               # Services</span></span>
<span class="line"><span>│   │   │   ├── api.service.ts</span></span>
<span class="line"><span>│   │   │   ├── auth.service.ts</span></span>
<span class="line"><span>│   │   │   └── storage.service.ts</span></span>
<span class="line"><span>│   │   └── utils/                  # Utilities</span></span>
<span class="line"><span>│   │       ├── validators.ts</span></span>
<span class="line"><span>│   │       └── formatters.ts</span></span>
<span class="line"><span>│   ├── styles/                     # Global styles</span></span>
<span class="line"><span>│   │   ├── index.css               # CSS variables and color palette</span></span>
<span class="line"><span>│   │   ├── global.css              # Base global styles</span></span>
<span class="line"><span>│   │   └── material-theme.css      # Theme for Material Web</span></span>
<span class="line"><span>│   └── assets/                     # Static resources</span></span>
<span class="line"><span>│       ├── images/</span></span>
<span class="line"><span>│       ├── fonts/</span></span>
<span class="line"><span>│       └── icons/</span></span>
<span class="line"><span>├── public/                         # Public files</span></span>
<span class="line"><span>│   ├── favicon.ico</span></span>
<span class="line"><span>│   └── robots.txt</span></span>
<span class="line"><span>├── index.html                      # Main HTML</span></span>
<span class="line"><span>├── package.json                    # Dependencies</span></span>
<span class="line"><span>├── tsconfig.json                   # TypeScript configuration</span></span>
<span class="line"><span>├── vite.config.ts                  # Vite configuration</span></span>
<span class="line"><span>└── README.md</span></span></code></pre></div><h2 id="layer-architecture" tabindex="-1">Layer Architecture <a class="header-anchor" href="#layer-architecture" aria-label="Permalink to “Layer Architecture”">​</a></h2><h3 id="_1-lithiumapp-root" tabindex="-1">1. <strong>LithiumApp</strong> (Root) <a class="header-anchor" href="#_1-lithiumapp-root" aria-label="Permalink to “1. LithiumApp (Root)”">​</a></h3><ul><li>Single file: <code>main-app.ts</code></li><li>Defines main routes</li><li>Can have global layout</li><li>Application entry point</li></ul><div class="language-typescript"><button title="Copy Code" class="copy"></button><span class="lang">typescript</span><pre class="shiki shiki-themes github-light github-dark" style="--shiki-light:#24292e;--shiki-dark:#e1e4e8;--shiki-light-bg:#fff;--shiki-dark-bg:#24292e;" tabindex="0" dir="ltr"><code><span class="line"><span style="--shiki-light:#6A737D;--shiki-dark:#6A737D;">// src/main-app.ts</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">@</span><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;">defineApp</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">({</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">  tag: </span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;">&#39;main-app&#39;</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">,</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">  routes: routes,</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">  styles: [appStyle]</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">})</span></span>
<span class="line"><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">export</span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;"> class</span><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;"> MainApp</span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;"> extends</span><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;"> LithiumApp</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;"> {}</span></span></code></pre></div><h3 id="_2-lithiummodule-modules" tabindex="-1">2. <strong>LithiumModule</strong> (Modules) <a class="header-anchor" href="#_2-lithiummodule-modules" aria-label="Permalink to “2. LithiumModule (Modules)”">​</a></h3><ul><li>Group related functionality</li><li>Have their own routes</li><li>Can have specific layouts</li><li>Examples: <code>public</code>, <code>admin</code>, <code>auth</code></li></ul><div class="language-typescript"><button title="Copy Code" class="copy"></button><span class="lang">typescript</span><pre class="shiki shiki-themes github-light github-dark" style="--shiki-light:#24292e;--shiki-dark:#e1e4e8;--shiki-light-bg:#fff;--shiki-dark-bg:#24292e;" tabindex="0" dir="ltr"><code><span class="line"><span style="--shiki-light:#6A737D;--shiki-dark:#6A737D;">// src/modules/public/public.module.ts</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">@</span><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;">defineModule</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">({</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">  tag: </span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;">&#39;public-module&#39;</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">,</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">  routes: publicRoutes</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">})</span></span>
<span class="line"><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">export</span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;"> class</span><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;"> PublicModule</span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;"> extends</span><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;"> LithiumModule</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;"> {}</span></span></code></pre></div><h3 id="_3-lithiumpage-pages" tabindex="-1">3. <strong>LithiumPage</strong> (Pages) <a class="header-anchor" href="#_3-lithiumpage-pages" aria-label="Permalink to “3. LithiumPage (Pages)”">​</a></h3><ul><li>Represent views/screens</li><li>Associated with a specific route</li><li>Can change browser title</li><li>Compose UI with components</li></ul><div class="language-typescript"><button title="Copy Code" class="copy"></button><span class="lang">typescript</span><pre class="shiki shiki-themes github-light github-dark" style="--shiki-light:#24292e;--shiki-dark:#e1e4e8;--shiki-light-bg:#fff;--shiki-dark-bg:#24292e;" tabindex="0" dir="ltr"><code><span class="line"><span style="--shiki-light:#6A737D;--shiki-dark:#6A737D;">// src/modules/public/pages/home/home.page.ts</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">@</span><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;">definePage</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">({ </span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">  tag: </span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;">&#39;home-page&#39;</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">,</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">  title: </span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;">&#39;Home - My App&#39;</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">})</span></span>
<span class="line"><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">export</span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;"> class</span><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;"> HomePage</span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;"> extends</span><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;"> LithiumElement</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;"> {}</span></span></code></pre></div><h3 id="_4-lithiumelement-components" tabindex="-1">4. <strong>LithiumElement</strong> (Components) <a class="header-anchor" href="#_4-lithiumelement-components" aria-label="Permalink to “4. LithiumElement (Components)”">​</a></h3><ul><li>Reusable throughout the app</li><li>No route state</li><li>Atomic Design: atomics, molecules, organisms</li><li>Can emit events</li></ul><div class="language-typescript"><button title="Copy Code" class="copy"></button><span class="lang">typescript</span><pre class="shiki shiki-themes github-light github-dark" style="--shiki-light:#24292e;--shiki-dark:#e1e4e8;--shiki-light-bg:#fff;--shiki-dark-bg:#24292e;" tabindex="0" dir="ltr"><code><span class="line"><span style="--shiki-light:#6A737D;--shiki-dark:#6A737D;">// src/components/atomics/button/button.atomic.ts</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">@</span><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;">defineElement</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">({</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">  tag: </span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;">&#39;button-atomic&#39;</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">,</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">  styles: [buttonStyle]</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">})</span></span>
<span class="line"><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">export</span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;"> class</span><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;"> ButtonAtomic</span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;"> extends</span><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;"> LithiumElement</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;"> {}</span></span></code></pre></div><h2 id="naming-conventions" tabindex="-1">Naming Conventions <a class="header-anchor" href="#naming-conventions" aria-label="Permalink to “Naming Conventions”">​</a></h2><h3 id="files" tabindex="-1">Files <a class="header-anchor" href="#files" aria-label="Permalink to “Files”">​</a></h3><div class="language-"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark" style="--shiki-light:#24292e;--shiki-dark:#e1e4e8;--shiki-light-bg:#fff;--shiki-dark-bg:#24292e;" tabindex="0" dir="ltr"><code><span class="line"><span>[name].[type].[extension]</span></span>
<span class="line"><span></span></span>
<span class="line"><span>✅ Correct examples:</span></span>
<span class="line"><span>- home.page.ts          # Page</span></span>
<span class="line"><span>- button.atomic.ts      # Atomic component</span></span>
<span class="line"><span>- nav-bar.component.ts  # General component</span></span>
<span class="line"><span>- public.module.ts      # Module</span></span>
<span class="line"><span>- auth.service.ts       # Service</span></span>
<span class="line"><span>- user.interface.ts     # Interface</span></span>
<span class="line"><span></span></span>
<span class="line"><span>❌ Avoid:</span></span>
<span class="line"><span>- HomePage.ts           # Don&#39;t use PascalCase for files</span></span>
<span class="line"><span>- button.ts             # Missing type</span></span>
<span class="line"><span>- my-component.tsx      # We don&#39;t use JSX</span></span></code></pre></div><h3 id="tags-html" tabindex="-1">Tags HTML <a class="header-anchor" href="#tags-html" aria-label="Permalink to “Tags HTML”">​</a></h3><div class="language-"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark" style="--shiki-light:#24292e;--shiki-dark:#e1e4e8;--shiki-light-bg:#fff;--shiki-dark-bg:#24292e;" tabindex="0" dir="ltr"><code><span class="line"><span>Format: [descriptive-name]</span></span>
<span class="line"><span></span></span>
<span class="line"><span>✅ Correct examples:</span></span>
<span class="line"><span>- &lt;button-atomic&gt;</span></span>
<span class="line"><span>- &lt;nav-bar&gt;</span></span>
<span class="line"><span>- &lt;home-page&gt;</span></span>
<span class="line"><span>- &lt;public-module&gt;</span></span>
<span class="line"><span></span></span>
<span class="line"><span>❌ Avoid:</span></span>
<span class="line"><span>- &lt;button&gt;              # Conflict with native HTML</span></span>
<span class="line"><span>- &lt;MyButton&gt;            # Don&#39;t use PascalCase</span></span>
<span class="line"><span>- &lt;btn&gt;                 # Be descriptive</span></span></code></pre></div><h3 id="typescript-classes" tabindex="-1">TypeScript Classes <a class="header-anchor" href="#typescript-classes" aria-label="Permalink to “TypeScript Classes”">​</a></h3><div class="language-"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark" style="--shiki-light:#24292e;--shiki-dark:#e1e4e8;--shiki-light-bg:#fff;--shiki-dark-bg:#24292e;" tabindex="0" dir="ltr"><code><span class="line"><span>Format: PascalCase + Type</span></span>
<span class="line"><span></span></span>
<span class="line"><span>✅ Correct examples:</span></span>
<span class="line"><span>- class HomePage extends LithiumElement</span></span>
<span class="line"><span>- class ButtonAtomic extends LithiumElement</span></span>
<span class="line"><span>- class PublicModule extends LithiumModule</span></span>
<span class="line"><span>- class ApiService</span></span>
<span class="line"><span></span></span>
<span class="line"><span>❌ Avoid:</span></span>
<span class="line"><span>- class homePage        # Use PascalCase</span></span>
<span class="line"><span>- class Home            # Add type (HomePage)</span></span></code></pre></div><h2 id="organization-by-modules" tabindex="-1">Organization by Modules <a class="header-anchor" href="#organization-by-modules" aria-label="Permalink to “Organization by Modules”">​</a></h2><h3 id="public-module" tabindex="-1">Public Module <a class="header-anchor" href="#public-module" aria-label="Permalink to “Public Module”">​</a></h3><div class="language-"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark" style="--shiki-light:#24292e;--shiki-dark:#e1e4e8;--shiki-light-bg:#fff;--shiki-dark-bg:#24292e;" tabindex="0" dir="ltr"><code><span class="line"><span>modules/public/</span></span>
<span class="line"><span>├── public.module.ts</span></span>
<span class="line"><span>├── public.routes.ts</span></span>
<span class="line"><span>├── pages/              # Module pages</span></span>
<span class="line"><span>│   ├── home/</span></span>
<span class="line"><span>│   ├── about/</span></span>
<span class="line"><span>│   └── contact/</span></span>
<span class="line"><span>└── section/           # Module-specific sections</span></span>
<span class="line"><span>    ├── public-header/</span></span>
<span class="line"><span>    └── public-footer/</span></span></code></pre></div><h3 id="admin-module" tabindex="-1">Admin Module <a class="header-anchor" href="#admin-module" aria-label="Permalink to “Admin Module”">​</a></h3><div class="language-"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark" style="--shiki-light:#24292e;--shiki-dark:#e1e4e8;--shiki-light-bg:#fff;--shiki-dark-bg:#24292e;" tabindex="0" dir="ltr"><code><span class="line"><span>modules/admin/</span></span>
<span class="line"><span>├── admin.module.ts</span></span>
<span class="line"><span>├── admin.routes.ts</span></span>
<span class="line"><span>├── pages/</span></span>
<span class="line"><span>│   ├── dashboard/</span></span>
<span class="line"><span>│   ├── users/</span></span>
<span class="line"><span>│   └── settings/</span></span>
<span class="line"><span>└── components/        # Module-specific components</span></span>
<span class="line"><span>    └── admin-sidebar/</span></span></code></pre></div><h2 id="import-system" tabindex="-1">Import System <a class="header-anchor" href="#import-system" aria-label="Permalink to “Import System”">​</a></h2><h3 id="path-aliases-tsconfig-json" tabindex="-1">Path Aliases (tsconfig.json) <a class="header-anchor" href="#path-aliases-tsconfig-json" aria-label="Permalink to “Path Aliases (tsconfig.json)”">​</a></h3><div class="language-json"><button title="Copy Code" class="copy"></button><span class="lang">json</span><pre class="shiki shiki-themes github-light github-dark" style="--shiki-light:#24292e;--shiki-dark:#e1e4e8;--shiki-light-bg:#fff;--shiki-dark-bg:#24292e;" tabindex="0" dir="ltr"><code><span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">{</span></span>
<span class="line"><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;">  &quot;compilerOptions&quot;</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">: {</span></span>
<span class="line"><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;">    &quot;baseUrl&quot;</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">: </span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;">&quot;.&quot;</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">,</span></span>
<span class="line"><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;">    &quot;paths&quot;</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">: {</span></span>
<span class="line"><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;">      &quot;@lithium&quot;</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">: [</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;">&quot;./config/lithium&quot;</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">],</span></span>
<span class="line"><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;">      &quot;@core&quot;</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">: [</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;">&quot;./src/core&quot;</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">],</span></span>
<span class="line"><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;">      &quot;@core/*&quot;</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">: [</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;">&quot;./src/core/*&quot;</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">],</span></span>
<span class="line"><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;">      &quot;@components&quot;</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">: [</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;">&quot;./src/components&quot;</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">],</span></span>
<span class="line"><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;">      &quot;@components/*&quot;</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">: [</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;">&quot;./src/components/*&quot;</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">]</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">    }</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">  }</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">}</span></span></code></pre></div><h3 id="using-aliases" tabindex="-1">Using Aliases <a class="header-anchor" href="#using-aliases" aria-label="Permalink to “Using Aliases”">​</a></h3><div class="language-typescript"><button title="Copy Code" class="copy"></button><span class="lang">typescript</span><pre class="shiki shiki-themes github-light github-dark" style="--shiki-light:#24292e;--shiki-dark:#e1e4e8;--shiki-light-bg:#fff;--shiki-dark-bg:#24292e;" tabindex="0" dir="ltr"><code><span class="line"><span style="--shiki-light:#6A737D;--shiki-dark:#6A737D;">// ✅ With alias (recommended)</span></span>
<span class="line"><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">import</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;"> { LithiumElement } </span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">from</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;"> &#39;@lithium&#39;</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">;</span></span>
<span class="line"><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">import</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;"> { ApiService } </span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">from</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;"> &#39;@core/services/api.service&#39;</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">;</span></span>
<span class="line"><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">import</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;"> &#39;@components/atomics/button/button.atomic&#39;</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">;</span></span>
<span class="line"></span>
<span class="line"><span style="--shiki-light:#6A737D;--shiki-dark:#6A737D;">// ❌ Without alias (avoid)</span></span>
<span class="line"><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">import</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;"> { LithiumElement } </span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">from</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;"> &#39;../../../../../config/lithium&#39;</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">;</span></span>
<span class="line"><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">import</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;"> { ApiService } </span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">from</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;"> &#39;../../../core/services/api.service&#39;</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">;</span></span>
<span class="line"><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">import</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;"> &#39;../../../../components/atomics/button/button.atomic&#39;</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">;</span></span></code></pre></div><h2 id="css-and-styles" tabindex="-1">CSS and Styles <a class="header-anchor" href="#css-and-styles" aria-label="Permalink to “CSS and Styles”">​</a></h2><h3 id="global-styles" tabindex="-1">Global Styles <a class="header-anchor" href="#global-styles" aria-label="Permalink to “Global Styles”">​</a></h3><div class="language-"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark" style="--shiki-light:#24292e;--shiki-dark:#e1e4e8;--shiki-light-bg:#fff;--shiki-dark-bg:#24292e;" tabindex="0" dir="ltr"><code><span class="line"><span>src/styles/</span></span>
<span class="line"><span>├── index.css           # Variables, colors, tokens</span></span>
<span class="line"><span>├── global.css          # Reset, typography, animations</span></span>
<span class="line"><span>└── material-theme.css  # Theming for external libraries</span></span></code></pre></div><h3 id="component-styles" tabindex="-1">Component Styles <a class="header-anchor" href="#component-styles" aria-label="Permalink to “Component Styles”">​</a></h3><div class="language-typescript"><button title="Copy Code" class="copy"></button><span class="lang">typescript</span><pre class="shiki shiki-themes github-light github-dark" style="--shiki-light:#24292e;--shiki-dark:#e1e4e8;--shiki-light-bg:#fff;--shiki-dark-bg:#24292e;" tabindex="0" dir="ltr"><code><span class="line"><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">import</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;"> style </span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">from</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;"> &#39;./button.atomic.css?inline&#39;</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">;</span></span>
<span class="line"></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">@</span><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;">defineElement</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">({</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">  tag: </span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;">&#39;button-atomic&#39;</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">,</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">  styles: [style]  </span><span style="--shiki-light:#6A737D;--shiki-dark:#6A737D;">// Scoped to component</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">})</span></span></code></pre></div>`,40)])])}const g=a(e,[["render",l]]);export{d as __pageData,g as default};
