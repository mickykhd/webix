# Webix Reports Manager - Frontend Documentation

## Table of Contents
1. [Overview](#overview)
2. [Architecture](#architecture)
3. [Technology Stack](#technology-stack)
4. [Project Structure](#project-structure)
5. [Component Architecture](#component-architecture)
6. [Webix Integration](#webix-integration)
7. [Data Flow](#data-flow)
8. [Configuration](#configuration)
9. [Development Setup](#development-setup)
10. [Build & Deployment](#build--deployment)

---

## Overview

The frontend is a React 19 application that integrates the Webix Reports widget to provide a comprehensive reporting interface. It uses Vite as the build tool and dynamically loads Webix libraries to create a powerful, interactive reporting dashboard.

### Key Features
- React 19 with modern hooks
- Webix Reports widget integration
- Dynamic script/CSS loading
- Vite dev server with HMR
- Proxy configuration for API calls
- Responsive full-screen layout
- Clean component architecture

---

## Architecture

### Application Structure

```
┌─────────────────────────────────────────┐
│         Browser                        │
└──────────────┬──────────────────────────┘
               │
┌──────────────▼──────────────────────────┐
│         React Application               │
│  ┌─────────────────────────────────┐   │
│  │  App Component                  │   │
│  │  ┌───────────────────────────┐ │   │
│  │  │ ReportsManager Component  │ │   │
│  │  │  - Dynamic Script Loading │ │   │
│  │  │  - Webix Initialization   │ │   │
│  │  │  - Widget Lifecycle Mgmt  │ │   │
│  │  └───────────────────────────┘ │   │
│  └─────────────────────────────────┘   │
└──────────────┬──────────────────────────┘
               │
┌──────────────▼──────────────────────────┐
│      Webix Reports Widget               │
│  - Data Grid                            │
│  - Filters                              │
│  - Charts                               │
│  - Query Builder                        │
└──────────────┬──────────────────────────┘
               │
┌──────────────▼──────────────────────────┐
│         Vite Dev Server                │
│  - HMR                                  │
│  - Proxy to Backend                     │
│  - Static Asset Serving                 │
└──────────────┬──────────────────────────┘
               │
┌──────────────▼──────────────────────────┐
│       Backend API (Express)             │
│  - /api/modules                         │
│  - /api/queries                         │
│  - /api/objects/:source/data            │
│  - /api/fields/:field/options          │
└─────────────────────────────────────────┘
```

### Layered Architecture

```
┌─────────────────────────────────────────┐
│         Presentation Layer               │
│  - React Components                     │
│  - JSX Templates                        │
│  - Styling (CSS)                        │
└──────────────┬──────────────────────────┘
               │
┌──────────────▼──────────────────────────┐
│       Integration Layer                 │
│  - Webix Widget Wrapper                  │
│  - Dynamic Resource Loading             │
│  - Lifecycle Management                 │
└──────────────┬──────────────────────────┘
               │
┌──────────────▼──────────────────────────┐
│       Communication Layer              │
│  - HTTP Requests                        │
│  - Proxy Configuration                  │
│  - CORS Handling                        │
└──────────────┬──────────────────────────┘
               │
┌──────────────▼──────────────────────────┐
│         Build Layer                     │
│  - Vite Bundler                         │
│  - React Plugin                         │
│  - Dev Server                           │
└─────────────────────────────────────────┘
```

---

## Technology Stack

### Core Dependencies

| Package | Version | Purpose |
|---------|---------|---------|
| react | ^19.2.0 | UI framework |
| react-dom | ^19.2.0 | React DOM renderer |
| vite | ^7.3.1 | Build tool & dev server |
| @vitejs/plugin-react | ^5.1.1 | React plugin for Vite |

### Development Dependencies

| Package | Version | Purpose |
|---------|---------|---------|
| @eslint/js | ^9.39.1 | ESLint configuration |
| @types/react | ^19.2.7 | React TypeScript types |
| @types/react-dom | ^19.2.3 | React DOM types |
| eslint | ^9.39.1 | Code linting |
| eslint-plugin-react-hooks | ^7.0.1 | React hooks linting |
| eslint-plugin-react-refresh | ^0.4.24 | Fast refresh linting |
| globals | ^16.5.0 | Global variables |

### External Libraries

**Webix Libraries** (loaded dynamically):
- `/webix.trial.complete/webix/codebase/webix.js` - Webix core library
- `/webix.trial.complete/webix/codebase/webix.css` - Webix core styles
- `/webix.trial.complete/reports/codebase/reports.js` - Reports module
- `/webix.trial.complete/reports/codebase/reports.css` - Reports styles

---

## Project Structure

```
webix-projects-manager/
├── public/
│   ├── webix.trial.complete/          # Webix library files
│   │   ├── webix/
│   │   │   ├── codebase/
│   │   │   │   ├── webix.js          # Webix core JS
│   │   │   │   └── webix.css         # Webix core CSS
│   │   │   └── skins/
│   │   └── reports/
│   │       └── codebase/
│   │           ├── reports.js        # Reports module JS
│   │           └── reports.css       # Reports module CSS
│   └── vite.svg                      # Vite logo
├── src/
│   ├── assets/                       # Static assets
│   ├── components/
│   │   └── ReportsManager.jsx        # Main reports component
│   ├── App.css                       # App styles
│   ├── App.jsx                       # Root component
│   ├── index.css                     # Global styles
│   └── main.jsx                      # Entry point
├── index.html                        # HTML template
├── vite.config.js                    # Vite configuration
├── eslint.config.js                  # ESLint configuration
├── package.json                      # Dependencies
└── README.md                         # Project documentation
```

### File Descriptions

#### Entry Point Files

**index.html**
- HTML template for the application
- Contains root div for React mounting
- Loads main.jsx as module

**src/main.jsx**
- React application entry point
- Mounts App component to DOM
- Uses StrictMode for development checks

**src/App.jsx**
- Root React component
- Renders ReportsManager component
- Applies App.css styles

#### Component Files

**src/components/ReportsManager.jsx**
- Main component integrating Webix Reports
- Handles dynamic script/CSS loading
- Manages Webix widget lifecycle
- Provides full-screen container

#### Configuration Files

**vite.config.js**
- Vite build configuration
- React plugin setup
- Dev server configuration
- API proxy to backend

**eslint.config.js**
- ESLint configuration
- React hooks rules
- React refresh rules

---

## Component Architecture

### App Component

**Location**: `src/App.jsx`

```jsx
function App() {
  return (
    <div className="App">
      <ReportsManager />
    </div>
  )
}
```

**Purpose**:
- Root component of the application
- Wrapper for ReportsManager
- Applies App.css styles

**Characteristics**:
- Functional component
- No state management
- Simple composition pattern

### ReportsManager Component

**Location**: `src/components/ReportsManager.jsx`

**Purpose**:
- Integrates Webix Reports widget
- Manages dynamic resource loading
- Handles widget lifecycle

**Key Features**:

#### 1. Dynamic Script Loading

```javascript
const loadScript = (src) => {
  return new Promise((resolve, reject) => {
    if (document.querySelector(`script[src="${src}"]`)) {
      resolve();
      return;
    }
    const script = document.createElement('script');
    script.src = src;
    script.async = false;
    script.onload = resolve;
    script.onerror = () => reject(new Error(`Failed to load ${src}`));
    document.head.appendChild(script);
  });
};
```

**Behavior**:
- Checks if script already loaded (deduplication)
- Creates script element dynamically
- Sets async to false for sequential loading
- Resolves on load, rejects on error

#### 2. Dynamic CSS Loading

```javascript
const loadCSS = (href) => {
  if (document.querySelector(`link[href="${href}"]`)) return;
  const link = document.createElement('link');
  link.rel = 'stylesheet';
  link.href = href;
  document.head.appendChild(link);
};
```

**Behavior**:
- Checks if CSS already loaded
- Creates link element dynamically
- Appends to document head

#### 3. Webix Initialization

```javascript
const initWebix = async () => {
  try {
    // Load Webix core
    await loadScript('/webix.trial.complete/webix/codebase/webix.js');
    loadCSS('/webix.trial.complete/webix/codebase/webix.css');

    // Load Reports module
    await loadScript('/webix.trial.complete/reports/codebase/reports.js');
    loadCSS('/webix.trial.complete/reports/codebase/reports.css');

    // Initialize Reports Manager
    if (window.webix) {
      window.webix.ready(() => {
        if (window.webix.env.mobile) window.webix.ui.fullScreen();
        window.webix.CustomScroll.init();

        widgetRef.current = window.webix.ui({
          view: "reports",
          container: containerRef.current,
          url: "/",
        });
      });
    }
  } catch (error) {
    console.error('Error loading Webix:', error);
  }
};
```

**Initialization Flow**:
1. Load Webix core JavaScript
2. Load Webix core CSS
3. Load Reports module JavaScript
4. Load Reports module CSS
5. Wait for Webix to be ready
6. Enable full-screen mode on mobile
7. Initialize custom scroll
8. Create Reports widget instance

#### 4. Widget Lifecycle Management

```javascript
useEffect(() => {
  initWebix();

  return () => {
    if (widgetRef.current && widgetRef.current.destructor) {
      try {
        widgetRef.current.destructor();
        widgetRef.current = null;
      } catch (err) {
        console.error('Error during cleanup:', err);
      }
    }
  };
}, []);
```

**Lifecycle**:
- **Mount**: Initializes Webix and creates widget
- **Unmount**: Destroys widget and cleans up references

#### 5. Container Rendering

```jsx
return (
  <div
    ref={containerRef}
    style={{
      height: "100vh",
      width: "100%",
      position: "relative"
    }}
  />
);
```

**Styling**:
- Full viewport height (100vh)
- Full viewport width (100%)
- Relative positioning
- Reference for Webix widget container

### Component State Management

**Refs Used**:
- `containerRef`: Reference to container div
- `widgetRef`: Reference to Webix widget instance

**Why Refs?**
- Webix widget requires DOM element reference
- Widget instance needs to be stored for cleanup
- Avoids React re-render conflicts with Webix

---

## Webix Integration

### Webix Reports Widget

The application uses the Webix Reports widget, which provides:

#### Features
- **Data Grid**: Tabular data display with sorting and filtering
- **Query Builder**: Visual interface for building complex queries
- **Charts**: Data visualization capabilities
- **Filters**: Advanced filtering options
- **Export**: Export reports to various formats
- **Save/Load**: Save and load report configurations

#### Widget Configuration

```javascript
window.webix.ui({
  view: "reports",
  container: containerRef.current,
  url: "/",
});
```

**Configuration Options**:
- `view`: Widget type ("reports")
- `container`: DOM element to render into
- `url`: Base URL for API calls

### API Communication

Webix Reports communicates with the backend through RESTful API calls:

#### Endpoints Used

**Schema Retrieval**:
```
GET /api/objects
```
Returns data source schemas for UI rendering.

**Data Query**:
```
POST /api/objects/:source/data
```
Executes data queries with filtering, joins, aggregations.

**Modules Management**:
```
GET    /api/modules
POST   /api/modules
PUT    /api/modules/:id
DELETE /api/modules/:id
```
CRUD operations for report configurations.

**Queries Management**:
```
GET    /api/queries
POST   /api/queries
PUT    /api/queries/:id
DELETE /api/queries/:id
```
CRUD operations for saved queries.

**Field Options**:
```
GET /api/fields/:field/options
```
Retrieves distinct values for filter dropdowns.

**Field Suggestions**:
```
GET /api/fields/:field/suggest
```
Retrieves autocomplete suggestions.

### Data Flow Between Webix and Backend

```
User Action (Webix Widget)
  ↓
Webix Internal Processing
  ↓
HTTP Request (via fetch/XHR)
  ↓
Vite Proxy (if dev)
  ↓
Backend API
  ↓
Database Query
  ↓
Response Data
  ↓
Webix Widget Processing
  ↓
UI Update
```

### Proxy Configuration

**vite.config.js**:
```javascript
export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173,
    proxy: {
      '/api': {
        target: 'http://localhost:3200',
        changeOrigin: true,
        secure: false,
      }
    }
  }
})
```

**Purpose**:
- Routes `/api` requests to backend
- Handles CORS in development
- Avoids CORS issues during development
- `changeOrigin`: Changes origin header to match target
- `secure: false`: Allows self-signed certificates

---

## Data Flow

### Application Initialization Flow

```
Browser Loads index.html
  ↓
Loads main.jsx (module)
  ↓
React Creates Root
  ↓
Mounts App Component
  ↓
Renders ReportsManager Component
  ↓
useEffect Triggers
  ↓
initWebix() Called
  ↓
Load Webix Core JS
  ↓
Load Webix Core CSS
  ↓
Load Reports Module JS
  ↓
Load Reports Module CSS
  ↓
webix.ready() Callback
  ↓
Create Reports Widget
  ↓
Widget Renders in Container
  ↓
Application Ready
```

### User Interaction Flow

```
User Interacts with Reports Widget
  ↓
Webix Widget Processes Action
  ↓
Webix Makes API Request
  ↓
Request Hits Vite Dev Server
  ↓
Proxy Forwards to Backend (localhost:3200)
  ↓
Backend Processes Request
  ↓
Backend Queries Database
  ↓
Backend Returns Response
  ↓
Response Passes Through Proxy
  ↓
Webix Receives Response
  ↓
Webix Updates UI
  ↓
User Sees Updated Data
```

### Component Lifecycle Flow

```
Component Mount
  ↓
useEffect Executes
  ↓
initWebix() Called
  ├─ Load Scripts
  ├─ Load CSS
  └─ Initialize Widget
  ↓
Widget Active
  ↓
User Interacts
  ↓
Component Unmount
  ↓
Cleanup Function Executes
  ↓
widgetRef.current.destructor()
  ↓
References Cleared
```

### Error Handling Flow

```
Script Loading Error
  ↓
catch Block Executes
  ↓
console.error('Error loading Webix:', error)
  ↓
Widget Not Initialized
  ↓
User Sees Empty Container
```

```
Widget Destruction Error
  ↓
catch Block Executes
  ↓
console.error('Error during cleanup:', err)
  ↓
Cleanup Continues
  ↓
References Cleared
```

---

## Configuration

### Vite Configuration

**File**: `vite.config.js`

```javascript
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173,
    proxy: {
      '/api': {
        target: 'http://localhost:3200',
        changeOrigin: true,
        secure: false,
      }
    }
  }
})
```

**Configuration Details**:

**Plugins**:
- `react()`: Enables React JSX transformation and Fast Refresh

**Server**:
- `port: 5173`: Development server port
- `proxy`: API proxy configuration

**Proxy Options**:
- `/api`: Route pattern to proxy
- `target: 'http://localhost:3200'`: Backend server URL
- `changeOrigin: true`: Rewrite Origin header
- `secure: false`: Disable SSL verification

### ESLint Configuration

**File**: `eslint.config.js`

```javascript
export default [
  {
    ignores: ['dist'],
  },
  {
    files: ['**/*.{js,jsx}'],
    languageOptions: {
      ecmaVersion: 2020,
      globals: globals.browser,
      parserOptions: { ecmaVersion: 'latest', ecmaFeatures: { jsx: true } },
    },
    plugins: {
      'react-hooks': reactHooks,
      'react-refresh': reactRefresh,
    },
    rules: {
      ...reactHooks.configs.recommended.rules,
      'react-refresh/only-export-components': [
        'warn',
        { allowConstantExport: true },
      ],
    },
  },
]
```

**Rules**:
- Ignores `dist` directory
- Lints `.js` and `.jsx` files
- Uses ES2020+ syntax
- Browser globals enabled
- React hooks recommended rules
- React refresh for fast HMR

### Package.json Scripts

```json
{
  "scripts": {
    "dev": "vite",
    "build": "vite build",
    "lint": "eslint .",
    "preview": "vite preview"
  }
}
```

**Script Descriptions**:

- `dev`: Start development server with HMR
- `build`: Build production bundle
- `lint`: Run ESLint on all files
- `preview`: Preview production build locally

---

## Development Setup

### Prerequisites
- Node.js 18+ 
- npm or yarn
- Modern web browser

### Installation

```bash
cd webix-projects-manager
npm install
```

### Running Development Server

```bash
npm run dev
```

**Access**: `http://localhost:5173`

**Features**:
- Hot Module Replacement (HMR)
- Fast refresh
- Source maps
- API proxy to backend

### Building for Production

```bash
npm run build
```

**Output**: `dist/` directory

**Build Process**:
- React compilation
- Code minification
- Tree shaking
- Asset optimization
- CSS bundling

### Preview Production Build

```bash
npm run preview
```

**Access**: `http://localhost:4173` (or shown port)

### Linting

```bash
npm run lint
```

Checks code for:
- React best practices
- Potential errors
- Code style issues

---

## Build & Deployment

### Build Output Structure

```
dist/
├── assets/
│   ├── index-abc123.js          # Main bundle
│   ├── index-abc123.css         # Main styles
│   └── ...other chunks...
├── index.html                   # Entry HTML
└── webix.trial.complete/        # Webix assets (copied)
    ├── webix/
    └── reports/
```

### Production Deployment Options

#### 1. Static Hosting (Netlify, Vercel, GitHub Pages)

**Steps**:
1. Run `npm run build`
2. Upload `dist/` directory
3. Configure build command: `npm run build`
4. Configure output directory: `dist`

#### 2. Traditional Web Server (Nginx, Apache)

**Nginx Configuration**:
```nginx
server {
    listen 80;
    server_name your-domain.com;
    root /path/to/dist;
    index index.html;

    location / {
        try_files $uri $uri/ /index.html;
    }

    location /api {
        proxy_pass http://localhost:3200;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
    }
}
```

#### 3. Docker Deployment

**Dockerfile**:
```dockerfile
FROM node:18-alpine as builder
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build

FROM nginx:alpine
COPY --from=builder /app/dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
```

**docker-compose.yml**:
```yaml
version: '3.8'
services:
  frontend:
    build: .
    ports:
      - "80:80"
    depends_on:
      - backend
  
  backend:
    image: backend:latest
    ports:
      - "3200:3200"
    environment:
      - DB_HOST=mysql
      - DB_USER=root
      - DB_PASSWORD=password
      - DB_NAME=reports_db
```

### Environment-Specific Configuration

#### Development
- Vite dev server on port 5173
- API proxy to localhost:3200
- Source maps enabled
- HMR enabled

#### Production
- Static files served
- No proxy (direct API calls)
- Minified code
- Optimized assets

---

## Performance Optimization

### Code Splitting

Vite automatically code-splits:
- Dynamic imports
- Vendor chunks
- Route-based splitting (when using routing)

### Asset Optimization

- JavaScript minification
- CSS minification
- Image optimization
- Tree shaking

### Caching Strategy

**Development**:
- No caching (HMR)

**Production**:
- Long-term cache for hashed assets
- Cache headers for Webix assets

### Bundle Size Analysis

```bash
npm run build
npx vite-bundle-visualizer
```

---

## Troubleshooting

### Common Issues

#### 1. Webix Not Loading

**Symptoms**: Empty container, console errors

**Solutions**:
- Check browser console for errors
- Verify Webix files exist in `public/webix.trial.complete/`
- Check network tab for failed requests
- Ensure scripts load in correct order

#### 2. API Calls Failing

**Symptoms**: No data loading, network errors

**Solutions**:
- Verify backend is running on port 3200
- Check Vite proxy configuration
- Verify CORS settings on backend
- Check browser console for CORS errors

#### 3. HMR Not Working

**Symptoms**: Changes not reflecting, page reloads

**Solutions**:
- Ensure using `npm run dev`
- Check for Fast Refresh errors
- Verify component exports are correct
- Clear browser cache

#### 4. Build Errors

**Symptoms**: Build fails, type errors

**Solutions**:
- Check ESLint output
- Verify all dependencies installed
- Check for syntax errors
- Review React version compatibility

### Debugging Tips

**Enable Webix Debug Mode**:
```javascript
window.webix.debug = true;
```

**Check Widget State**:
```javascript
console.log(widgetRef.current);
```

**Monitor Network Requests**:
- Open browser DevTools
- Go to Network tab
- Filter by XHR/fetch
- Check request/response details

---

## Best Practices

### Component Design

1. **Keep Components Focused**: Single responsibility
2. **Use Refs for Third-Party Libraries**: Avoid React/Webix conflicts
3. **Cleanup Resources**: Always destroy widgets on unmount
4. **Handle Errors Gracefully**: Try-catch around async operations
5. **Use Type Safety**: Consider TypeScript for larger projects

### Performance

1. **Lazy Load Resources**: Load Webix only when needed
2. **Debounce User Input**: Prevent excessive API calls
3. **Use Memoization**: Cache expensive computations
4. **Optimize Renders**: Avoid unnecessary re-renders

### Security

1. **Validate Input**: Never trust user input
2. **Use HTTPS**: In production
3. **Sanitize Data**: Prevent XSS attacks
4. **Rate Limiting**: Protect against abuse

---

## Future Enhancements

### Potential Improvements

1. **TypeScript Migration**: Add type safety
2. **State Management**: Add Redux/Zustand for complex state
3. **Error Boundaries**: Better error handling
4. **Loading States**: Improve UX during data loading
5. **Authentication**: Add user authentication
6. **Theming**: Support custom themes
7. **Accessibility**: Improve WCAG compliance
8. **Testing**: Add unit and integration tests
9. **PWA Support**: Add offline capabilities
10. **Internationalization**: Add i18n support

---

## Conclusion

This frontend provides a modern, responsive interface for the Webix Reports Manager. The React 19 architecture with Vite build tool offers fast development experience and excellent performance. The dynamic Webix integration allows for powerful reporting capabilities while maintaining clean component architecture.

The application is production-ready and can be deployed to various hosting platforms. The modular design makes it easy to extend and maintain.

For questions or issues, refer to the browser console and network tab for debugging information.
