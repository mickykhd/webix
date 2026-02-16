# Webix Reports Manager - Comprehensive Documentation

## Table of Contents
1. [Project Overview](#project-overview)
2. [System Architecture](#system-architecture)
3. [Technology Stack](#technology-stack)
4. [Complete Data Flow](#complete-data-flow)
5. [Backend Deep Dive](#backend-deep-dive)
6. [Frontend Deep Dive](#frontend-deep-dive)
7. [Integration & Communication](#integration--communication)
8. [Database Design](#database-design)
9. [API Reference](#api-reference)
10. [Development Workflow](#development-workflow)
11. [Deployment Guide](#deployment-guide)
12. [Troubleshooting](#troubleshooting)
13. [Future Roadmap](#future-roadmap)

---

## Project Overview

The Webix Reports Manager is a full-stack application that provides a powerful, interactive reporting interface using Webix Reports widget. It allows users to create, edit, and execute complex reports with support for joins, aggregations, filtering, and faceted search.

### Core Objectives

1. **Interactive Reporting**: Provide a drag-and-drop interface for building reports
2. **Complex Queries**: Support for SQL-like queries with joins, aggregations, and filters
3. **Real-time Data**: Live data retrieval from MySQL database
4. **User-Friendly**: Intuitive interface with minimal learning curve
5. **Extensible**: Modular architecture for easy feature additions

### Key Features

#### Reporting Features
- **Visual Query Builder**: Drag-and-drop interface for building queries
- **Data Grid**: Sortable, filterable data display
- **Charts**: Multiple chart types for data visualization
- **Filters**: Advanced filtering with multiple condition types
- **Aggregations**: SUM, AVG, COUNT, MIN, MAX functions
- **Date Modifiers**: YEAR, MONTH, DAY, YEARMONTH operations
- **Faceted Search**: Break down data by categories
- **Save/Load**: Persist report configurations

#### Technical Features
- **RESTful API**: Clean API design for all operations
- **SQL Injection Prevention**: Parameterized queries and table whitelisting
- **Connection Pooling**: Efficient database connection management
- **Hot Module Replacement**: Fast development with Vite
- **Proxy Configuration**: Seamless API communication in development
- **Responsive Design**: Works on desktop and mobile devices

---

## System Architecture

### High-Level Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                        User Browser                          │
│  ┌───────────────────────────────────────────────────────┐ │
│  │              React Application                          │ │
│  │  ┌─────────────────────────────────────────────────┐ │ │
│  │  │         Webix Reports Widget                     │ │ │
│  │  │  - Data Grid                                     │ │ │
│  │  │  - Query Builder                                 │ │ │
│  │  │  - Charts                                        │ │ │
│  │  │  - Filters                                       │ │ │
│  │  └─────────────────────────────────────────────────┘ │ │
│  └───────────────────────────────────────────────────────┘ │
└──────────────────────┬──────────────────────────────────────┘
                       │ HTTP/HTTPS
                       ↓
┌─────────────────────────────────────────────────────────────┐
│                    Vite Dev Server (Development)             │
│  - HMR                                                        │
│  - Proxy to Backend                                          │
│  - Static File Serving                                       │
└──────────────────────┬──────────────────────────────────────┘
                       │
                       ↓
┌─────────────────────────────────────────────────────────────┐
│                  Express.js Backend Server                   │
│  ┌───────────────────────────────────────────────────────┐ │
│  │         API Layer (REST Endpoints)                     │ │
│  │  - Modules CRUD                                        │ │
│  │  - Queries CRUD                                        │ │
│  │  - Data Query Execution                                │ │
│  │  - Field Options & Suggestions                         │ │
│  └───────────────────────────────────────────────────────┘ │
│  ┌───────────────────────────────────────────────────────┐ │
│  │         Business Logic Layer                          │ │
│  │  - Query Building                                     │ │
│  │  - SQL Generation                                     │ │
│  │  - Data Transformation                               │ │
│  │  - Validation                                         │ │
│  └───────────────────────────────────────────────────────┘ │
│  ┌───────────────────────────────────────────────────────┐ │
│  │         Data Access Layer                             │ │
│  │  - Connection Pool                                    │ │
│  │  - Parameterized Queries                              │ │
│  │  - Result Mapping                                      │ │
│  └───────────────────────────────────────────────────────┘ │
└──────────────────────┬──────────────────────────────────────┘
                       │
                       ↓
┌─────────────────────────────────────────────────────────────┐
│                    MySQL Database                             │
│  ┌───────────────────────────────────────────────────────┐ │
│  │         Webix Internal Tables                           │ │
│  │  - modules (report configurations)                       │ │
│  │  - queries (saved queries)                              │ │
│  └───────────────────────────────────────────────────────┘ │
│  ┌───────────────────────────────────────────────────────┐ │
│  │         Data Tables                                    │ │
│  │  - products                                            │ │
│  │  - customers                                           │ │
│  │  - orders                                              │ │
│  └───────────────────────────────────────────────────────┘ │
└─────────────────────────────────────────────────────────────┘
```

### Component Interaction

```
┌──────────────┐
│    User      │
└──────┬───────┘
       │ Action
       ↓
┌──────────────┐
│   React App  │
│  (Frontend)  │
└──────┬───────┘
       │ API Call
       ↓
┌──────────────┐
│   Express    │
│  (Backend)   │
└──────┬───────┘
       │ Query
       ↓
┌──────────────┐
│    MySQL     │
│  (Database)  │
└──────┬───────┘
       │ Data
       ↓
┌──────────────┐
│   Express    │
│  (Backend)   │
└──────┬───────┘
       │ Response
       ↓
┌──────────────┐
│   React App  │
│  (Frontend)  │
└──────┬───────┘
       │ Update
       ↓
┌──────────────┐
│ Webix Widget │
└──────┬───────┘
       │ Render
       ↓
┌──────────────┐
│    User      │
└─────────────┘
```

---

## Technology Stack

### Complete Technology Matrix

| Layer | Technology | Version | Purpose |
|-------|-----------|---------|---------|
| **Frontend Framework** | React | 19.2.0 | UI framework |
| **Frontend Build Tool** | Vite | 7.3.1 | Build tool & dev server |
| **Frontend Library** | Webix Reports | Trial | Reporting widget |
| **Backend Framework** | Express | 5.2.1 | Web framework |
| **Database** | MySQL | 8.0+ | Relational database |
| **Database Driver** | mysql2 | 3.17.0 | MySQL driver |
| **CORS** | cors | 2.8.6 | Cross-origin support |
| **Environment Config** | dotenv | 17.2.4 | Environment variables |
| **Dev Server** | nodemon | 3.1.11 | Auto-restart tool |

### Development Tools

| Tool | Purpose |
|------|---------|
| ESLint | Code linting |
| React Plugin | JSX transformation |
| Hot Module Replacement | Fast refresh during development |
| Proxy Configuration | API routing in development |

---

## Complete Data Flow

### End-to-End Request Lifecycle

#### Scenario: User Loads a Report

```
1. User opens browser
   ↓
2. Browser requests index.html
   ↓
3. Vite serves index.html
   ↓
4. Browser loads main.jsx (module)
   ↓
5. React creates root and mounts App
   ↓
6. App renders ReportsManager component
   ↓
7. ReportsManager useEffect triggers
   ↓
8. initWebix() function executes
   ↓
9. Load Webix core JavaScript
   ↓
10. Load Webix core CSS
   ↓
11. Load Reports module JavaScript
   ↓
12. Load Reports module CSS
   ↓
13. webix.ready() callback executes
   ↓
14. Webix widget initialized with config
   ↓
15. Widget makes GET /api/objects request
   ↓
16. Request goes through Vite proxy
   ↓
17. Backend receives request
   ↓
18. Backend returns OBJECTS_SCHEMA
   ↓
19. Webix receives schema
   ↓
20. Widget renders UI based on schema
   ↓
21. User sees report interface
```

#### Scenario: User Executes a Query

```
1. User configures query in Webix UI
   - Selects tables
   - Adds columns
   - Sets filters
   - Configures joins
   ↓
2. User clicks "Run" button
   ↓
3. Webix widget builds request
   ↓
4. Widget sends POST /api/objects/:source/data
   ↓
5. Request body contains:
   - columns: ["products.name", "sum.orders.quantity"]
   - query: JSON string of filter conditions
   - joins: JSON string of join specs
   - group: JSON string of group fields
   - sort: JSON string of sort specs
   - limit: number string
   ↓
6. Request hits Vite proxy
   ↓
7. Proxy forwards to http://localhost:3200
   ↓
8. Express middleware processes request
   - CORS check
   - JSON parsing
   ↓
9. Route handler executes
   ↓
10. Validate source table
   ↓
11. Parse JSON-encoded parameters
   ↓
12. Check for facets
   ↓
13. Build JOIN clauses
   ↓
14. Parse group-by fields
   ↓
15. Parse column identifiers
   - Regular columns
   - Aggregation columns
   - Date-modified columns
   ↓
16. Build SELECT statement
   ↓
17. Parse query object
   ↓
18. Build WHERE clause
   - Process condition types
   - Collect parameters
   ↓
19. Build GROUP BY clause
   ↓
20. Build ORDER BY clause
   ↓
21. Build LIMIT clause
   ↓
22. Assemble complete SQL query
   ↓
23. Get connection from pool
   ↓
24. Execute parameterized query
   ↓
25. Release connection back to pool
   ↓
26. Process results
   - Add table prefixes if needed
   ↓
27. Return JSON response
   ↓
28. Response passes through proxy
   ↓
29. Webix receives data
   ↓
30. Webix processes and displays data
   - Sorts if needed
   - Formats dates
   - Applies aggregations
   ↓
31. User sees query results
```

#### Scenario: User Saves a Report

```
1. User clicks "Save" button
   ↓
2. Webix widget captures current config
   - Filters
   - Columns
   - Layout
   ↓
3. Widget sends POST /api/modules
   ↓
4. Request body:
   - name: "My Report"
   - text: JSON string of config
   ↓
5. Backend receives request
   ↓
6. Extract name and text
   ↓
7. Execute INSERT query
   ↓
8. Database stores new module
   ↓
9. Return new ID
   ↓
10. Webix receives ID
   ↓
11. Update UI with saved state
   ↓
12. User sees confirmation
```

### Faceted Search Flow

```
1. User configures query with facets
   - facets: ["products.category"]
   ↓
2. Webix sends POST /api/objects/orders/data
   ↓
3. Backend detects facets parameter
   ↓
4. Query distinct facet values
   SELECT DISTINCT category FROM products
   WHERE category IS NOT NULL
   ORDER BY category
   ↓
5. Get results: [Electronics, Furniture, Accessories]
   ↓
6. For each facet value:
   a. Build modified query
      WHERE (original conditions)
        AND products.category = 'Electronics'
   b. Execute query
   c. Collect results
   ↓
7. Return array:
   [
     {
       data: [...results for Electronics...],
       facets: [{column: "products.category", value: "Electronics"}]
     },
     {
       data: [...results for Furniture...],
       facets: [{column: "products.category", value: "Furniture"}]
     },
     ...
   ]
   ↓
8. Webix displays faceted results
```

---

## Backend Deep Dive

### Backend Architecture Layers

#### 1. Server Initialization Layer

**Location**: `server.js:1-26`

```javascript
import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import mysql from 'mysql2/promise';

const app = express();

app.use(cors({
  origin: 'http://localhost:5173',
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const pool = mysql.createPool({
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_NAME || 'reports_db',
  waitForConnections: true,
  connectionLimit: 10
});
```

**Responsibilities**:
- Load environment variables
- Initialize Express application
- Configure CORS
- Setup middleware
- Create database connection pool

**Key Design Decisions**:
- **Connection Pooling**: Reuses connections for efficiency
- **CORS Whitelist**: Only allows specific origin
- **Environment Variables**: Secure configuration management
- **ES Modules**: Modern JavaScript syntax

#### 2. Schema Definition Layer

**Location**: `server.js:31-92`

```javascript
const OBJECTS_SCHEMA = {
  products: {
    id: "products",
    name: "Products",
    data: [
      { id: "id", name: "ID", filter: true, edit: false, type: "number", ref: "", key: true, show: false },
      { id: "name", name: "Name", filter: true, edit: false, type: "text", ref: "", key: false, show: true },
      // ... more fields
    ],
    refs: [
      { id: 1, target: "products", source: "orders", name: "Product" }
    ]
  },
  // ... more objects
};

const PICKLISTS = {
  order_statuses: [
    { id: "pending", value: "Pending" },
    { id: "completed", value: "Completed" },
    { id: "cancelled", value: "Cancelled" }
  ]
};
```

**Schema Structure**:
- **id**: Table identifier
- **name**: Display name
- **data**: Array of field definitions
- **refs**: Array of relationship definitions

**Field Properties**:
- `id`: Field identifier
- `name`: Display name
- `filter`: Whether field is filterable
- `edit`: Whether field is editable
- `type`: Data type (text, number, date, reference, picklist)
- `ref`: Reference to other table or picklist
- `key`: Primary key flag
- `show`: Visibility in default view

**Relationship Properties**:
- `id`: Relationship ID
- `target`: Target table
- `source`: Source table
- `name`: Display name

#### 3. Query Building Layer

**Location**: `server.js:218-707`

This is the most complex part of the backend, responsible for translating Webix query format into SQL.

##### Column Parsing

```javascript
function parseColumnId(colId, source) {
  const parts = colId.split('.');

  // 3 parts: "prefix.table.field" — aggregation or date modifier
  if (parts.length === 3) {
    const prefix = parts[0];
    const table = parts[1];
    const field = parts[2];
    if (AGG_FUNCTIONS.includes(prefix)) {
      return { type: 'agg', op: prefix, table, field, alias: colId };
    }
    if (DATE_MODIFIERS[prefix]) {
      return { type: 'dateMod', mod: prefix, table, field, alias: colId };
    }
  }

  // 2 parts: "table.field" or "count."
  if (parts.length === 2) {
    const prefix = parts[0];
    const rest = parts[1];
    if (AGG_FUNCTIONS.includes(prefix) && rest === '') {
      return { type: 'agg', op: prefix, table: source || '', field: '*', alias: colId };
    }
    return { type: 'regular', table: prefix, field: rest, alias: colId };
  }

  // 1 part: "count"
  if (parts.length === 1 && AGG_FUNCTIONS.includes(parts[0])) {
    return { type: 'agg', op: parts[0], table: source || '', field: '*', alias: colId };
  }

  return null;
}
```

**Supported Column Formats**:
- Regular: `products.name`
- Aggregation: `sum.products.stock`
- Count All: `count.`
- Date Modifier: `year.orders.order_date`

##### JOIN Clause Building

```javascript
function buildJoinClauses(joins, source) {
  const clauses = [];
  const joined = new Set();
  if (!joins?.length) return clauses;

  for (const join of joins) {
    const sid = join.sid || '';
    const tid = join.tid || '';

    let joinTable, condition;

    if (tid === source && sid !== source) {
      // Reverse ref: join sid
      joinTable = sid;
      if (!ALLOWED_TABLES.includes(joinTable)) continue;
      if (join.tf) {
        condition = `${joinTable}.${join.tf} = ${source}.id`;
      } else if (join.sf) {
        condition = `${source}.${join.sf} = ${joinTable}.id`;
      }
    } else if (sid === source && tid !== source) {
      // Forward ref: join tid
      joinTable = tid;
      if (!ALLOWED_TABLES.includes(joinTable)) continue;
      if (join.sf) {
        condition = `${source}.${join.sf} = ${joinTable}.id`;
      } else if (join.tf) {
        condition = `${joinTable}.${join.tf} = ${source}.id`;
      }
    } else if (sid !== source && tid !== source) {
      // Chained join
      joinTable = tid;
      if (!ALLOWED_TABLES.includes(joinTable)) continue;
      if (join.sf) condition = `${sid}.${join.sf} = ${joinTable}.id`;
      else if (join.tf) condition = `${joinTable}.${join.tf} = ${sid}.id`;
    } else {
      // Self-join, skip
      continue;
    }

    if (joinTable && condition && !joined.has(joinTable)) {
      clauses.push(`LEFT JOIN ${joinTable} ON ${condition}`);
      joined.add(joinTable);
    }
  }
  return clauses;
}
```

**Join Types**:
- **Forward**: Source has FK to target
- **Reverse**: Target has FK to source
- **Chained**: Neither is source (e.g., products → orders → customers)

##### WHERE Clause Building

```javascript
function buildWhereFromQuery(queryObj, defaultTable) {
  if (!queryObj || !queryObj.rules || queryObj.rules.length === 0) {
    return { clause: '', params: [] };
  }

  const glue = (queryObj.glue || 'and').toUpperCase();
  const conditions = [];
  const params = [];

  for (const rule of queryObj.rules) {
    if (rule.rules) {
      // Nested group
      const nested = buildWhereFromQuery(rule, defaultTable);
      if (nested.clause) {
        conditions.push(`(${nested.clause})`);
        params.push(...nested.params);
      }
      continue;
    }

    const fieldId = rule.field || '';
    const parts = fieldId.split('.');
    if (parts.length !== 2) continue;

    const table = parts[0];
    const field = parts[1];
    if (!ALLOWED_TABLES.includes(table)) continue;

    const condition = rule.condition || {};
    const filterType = condition.type || '';
    const filterValue = condition.filter;
    const includes = rule.includes || [];

    // Handle "includes" filter
    if (includes.length > 0) {
      const placeholders = includes.map(() => '?').join(', ');
      conditions.push(`${table}.${field} IN (${placeholders})`);
      params.push(...includes);
      continue;
    }

    if (filterValue === undefined || filterValue === null || filterValue === '') continue;

    switch (filterType) {
      case 'equal':
        conditions.push(`${table}.${field} = ?`);
        params.push(filterValue);
        break;
      case 'notEqual':
        conditions.push(`${table}.${field} != ?`);
        params.push(filterValue);
        break;
      case 'contains':
        conditions.push(`${table}.${field} LIKE ?`);
        params.push(`%${filterValue}%`);
        break;
      // ... more cases
    }
  }

  if (conditions.length === 0) return { clause: '', params: [] };
  return { clause: conditions.join(` ${glue} `), params };
}
```

**Supported Condition Types**:
- `equal`: Exact match
- `notEqual`: Not equal
- `contains`: Contains substring
- `notContains`: Does not contain
- `beginsWith`: Starts with
- `endsWith`: Ends with
- `greater`: Greater than
- `greaterOrEqual`: Greater than or equal
- `less`: Less than
- `lessOrEqual`: Less than or equal

##### Query Execution

```javascript
async function executeDataQuery({ source, columns, query, joins, group, sort, limit }) {
  const joinClauses = buildJoinClauses(joins, source);
  const groupArray = Array.isArray(group) ? group : [];
  const hasGroup = groupArray.length > 0;

  let selectFields = [];
  let groupByFields = [];

  // Parse group-by fields
  if (hasGroup) {
    for (const g of groupArray) {
      const parsed = parseColumnId(g, source);
      if (!parsed || !ALLOWED_TABLES.includes(parsed.table)) continue;

      if (parsed.type === 'dateMod') {
        const dm = DATE_MODIFIERS[parsed.mod](parsed.table, parsed.field);
        selectFields.push(`${dm.select} as \`${parsed.alias}\``);
        groupByFields.push(dm.groupBy);
      } else {
        selectFields.push(`${parsed.table}.${parsed.field} as \`${parsed.alias}\``);
        groupByFields.push(`${parsed.table}.${parsed.field}`);
      }
    }
  }

  // Parse columns
  if (columns?.length > 0) {
    for (const col of columns) {
      const parsed = parseColumnId(col, source);
      if (!parsed) continue;
      if (parsed.type !== 'agg' && !ALLOWED_TABLES.includes(parsed.table)) continue;
      if (parsed.type === 'agg' && parsed.field !== '*' && !ALLOWED_TABLES.includes(parsed.table)) continue;

      if (parsed.type === 'agg') {
        const aggExpr = parsed.field === '*' ? '*' : `${parsed.table}.${parsed.field}`;
        selectFields.push(`${parsed.op.toUpperCase()}(${aggExpr}) as \`${parsed.alias}\``);
      } else if (parsed.type === 'dateMod') {
        const dm = DATE_MODIFIERS[parsed.mod](parsed.table, parsed.field);
        const existing = selectFields.find(f => f.includes(`\`${parsed.alias}\``));
        if (!existing) {
          selectFields.push(`${dm.select} as \`${parsed.alias}\``);
        }
      } else {
        if (!hasGroup) {
          selectFields.push(`${parsed.table}.${parsed.field} as \`${parsed.alias}\``);
        }
      }
    }
  }

  // Fallback to schema
  if (selectFields.length === 0) {
    const schema = OBJECTS_SCHEMA[source];
    if (schema?.data) {
      selectFields = schema.data.map(f => `${source}.${f.id} as \`${source}.${f.id}\``);
    } else {
      selectFields = [`${source}.*`];
    }
  }

  const { whereClause, queryParams } = buildWhereClause(query, source);
  const groupClause = groupByFields.length > 0 ? `GROUP BY ${groupByFields.join(', ')}` : '';

  // Build ORDER BY
  let orderClause = '';
  if (sort?.length > 0) {
    const sortFields = sort.map(s => {
      const fieldId = typeof s === 'string' ? s : (s.id || '');
      const dir = (typeof s === 'string' ? 'ASC' : (s.mod || 'asc')).toUpperCase();
      const parsed = parseColumnId(fieldId, source);
      if (!parsed) return null;
      if (parsed.type === 'agg') return `\`${parsed.alias}\` ${dir}`;
      if (parsed.type === 'dateMod') return `\`${parsed.alias}\` ${dir}`;
      return `${parsed.table}.${parsed.field} ${dir}`;
    }).filter(Boolean);
    if (sortFields.length > 0) orderClause = `ORDER BY ${sortFields.join(', ')}`;
  }

  const limitClause = (limit && parseInt(limit) > 0) ? `LIMIT ${parseInt(limit)}` : '';

  const sql = `SELECT ${selectFields.join(', ')} FROM ${source} ${joinClauses.join(' ')} ${whereClause} ${groupClause} ${orderClause} ${limitClause}`.replace(/\s+/g, ' ').trim();

  console.log('SQL:', sql);
  console.log('Params:', queryParams);

  const [rows] = await pool.query(sql, queryParams);

  // Handle SELECT *
  if (selectFields.length === 1 && selectFields[0] === `${source}.*`) {
    return rows.map(row => {
      const obj = {};
      for (const [key, value] of Object.entries(row)) obj[`${source}.${key}`] = value;
      return obj;
    });
  }

  return rows;
}
```

**Query Building Steps**:
1. Build JOIN clauses
2. Parse group-by fields
3. Parse column identifiers
4. Build SELECT statement
5. Build WHERE clause
6. Build GROUP BY clause
7. Build ORDER BY clause
8. Build LIMIT clause
9. Assemble SQL query
10. Execute with parameters
11. Process results

---

## Frontend Deep Dive

### Frontend Architecture Layers

#### 1. Application Entry Layer

**Location**: `index.html`, `main.jsx`, `App.jsx`

```html
<!doctype html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <link rel="icon" type="image/svg+xml" href="/vite.svg" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>webix-projects-manager</title>
  </head>
  <body>
    <div id="root"></div>
    <script type="module" src="/src/main.jsx"></script>
  </body>
</html>
```

```jsx
// main.jsx
import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
```

```jsx
// App.jsx
import './App.css'
import ReportsManager from './components/ReportsManager'

function App() {
  return (
    <div className="App">
      <ReportsManager />
    </div>
  )
}

export default App
```

**Entry Flow**:
1. Browser loads `index.html`
2. Module script loads `main.jsx`
3. React creates root at `#root`
4. Renders `App` component
5. `App` renders `ReportsManager`

#### 2. Webix Integration Layer

**Location**: `src/components/ReportsManager.jsx`

```jsx
function ReportsManager() {
  const containerRef = useRef(null);
  const widgetRef = useRef(null);

  useEffect(() => {
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

    const loadCSS = (href) => {
      if (document.querySelector(`link[href="${href}"]`)) return;
      const link = document.createElement('link');
      link.rel = 'stylesheet';
      link.href = href;
      document.head.appendChild(link);
    };

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
}
```

**Integration Flow**:
1. Component mounts
2. `useEffect` triggers
3. `initWebix()` executes
4. Load Webix core JS
5. Load Webix core CSS
6. Load Reports module JS
7. Load Reports module CSS
8. Wait for Webix ready
9. Initialize widget
10. Widget renders in container

**Lifecycle Management**:
- **Mount**: Initialize Webix and create widget
- **Unmount**: Destroy widget and cleanup

#### 3. Build Tool Layer

**Location**: `vite.config.js`

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

**Vite Features**:
- **HMR**: Hot Module Replacement for fast development
- **Proxy**: API proxy to backend
- **React Plugin**: JSX transformation
- **Fast Refresh**: Preserve component state during updates

---

## Integration & Communication

### Frontend-Backend Communication Protocol

#### Request Format

**Standard Data Query Request**:
```http
POST /api/objects/orders/data HTTP/1.1
Host: localhost:5173
Content-Type: application/x-www-form-urlencoded

columns=["orders.id","customers.name","sum.orders.total_amount"]&query={"glue":"and","rules":[{"field":"orders.status","condition":{"type":"equal","filter":"completed"}}]}&joins=[{"sid":"orders","tid":"customers","tf":"customer_id"}]&group=["customers.name"]&sort=[{"id":"sum.orders.total_amount","mod":"desc"}]&limit=50
```

**Key Parameters**:
- `columns`: Array of column identifiers (JSON string)
- `query`: Filter conditions (JSON string)
- `joins`: Join specifications (JSON string)
- `group`: Group-by fields (JSON string)
- `sort`: Sort specifications (JSON string)
- `limit`: Row limit (number string)
- `facets`: Facet fields (JSON string)
- `buckets`: Bucket configuration (JSON string)

#### Response Format

**Success Response**:
```json
[
  {
    "orders.id": 1,
    "customers.name": "Alice Johnson",
    "sum.orders.total_amount": 1299.99
  },
  {
    "orders.id": 2,
    "customers.name": "Bob Smith",
    "sum.orders.total_amount": 2599.98
  }
]
```

**Error Response**:
```json
{
  "error": "Error message description"
}
```

#### Communication Flow

```
┌──────────────┐
│ Webix Widget│
└──────┬───────┘
       │
       │ 1. User Action
       ↓
┌──────────────┐
│ Webix API   │
└──────┬───────┘
       │
       │ 2. Build Request
       ↓
┌──────────────┐
│ fetch() /    │
│ XMLHttpRequest│
└──────┬───────┘
       │
       │ 3. HTTP Request
       ↓
┌──────────────┐
│ Vite Proxy  │
└──────┬───────┘
       │
       │ 4. Forward to Backend
       ↓
┌──────────────┐
│ Express     │
└──────┬───────┘
       │
       │ 5. Process Request
       ↓
┌──────────────┐
│ MySQL Pool   │
└──────┬───────┘
       │
       │ 6. Execute Query
       ↓
┌──────────────┐
│ MySQL DB     │
└──────┬───────┘
       │
       │ 7. Return Results
       ↓
┌──────────────┐
│ Express     │
└──────┬───────┘
       │
       │ 8. Send Response
       ↓
┌──────────────┐
│ Vite Proxy  │
└──────┬───────┘
       │
       │ 9. Return to Frontend
       ↓
┌──────────────┐
│ Webix Widget│
└──────┬───────┘
       │
       │ 10. Process & Display
       ↓
┌──────────────┐
│ User        │
└─────────────┘
```

### CORS Configuration

**Frontend Origin**: `http://localhost:5173`
**Backend CORS Config**:
```javascript
app.use(cors({
  origin: 'http://localhost:5173',
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));
```

**CORS Flow**:
1. Frontend makes request with Origin header
2. Backend checks origin against whitelist
3. If allowed, backend sends response with CORS headers
4. Browser allows response to be read by JavaScript

---

## Database Design

### Complete Schema

#### Webix Internal Tables

**modules**:
```sql
CREATE TABLE modules (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(255) NOT NULL DEFAULT 'New Report',
  text TEXT,
  updated TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);
```

**Purpose**: Store report configurations

**queries**:
```sql
CREATE TABLE queries (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(255) NOT NULL DEFAULT 'New Query',
  text TEXT,
  updated TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);
```

**Purpose**: Store saved query definitions

#### Data Tables

**products**:
```sql
CREATE TABLE products (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  price DECIMAL(10,2) DEFAULT 0,
  category VARCHAR(100),
  stock INT DEFAULT 0,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

**customers**:
```sql
CREATE TABLE customers (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  email VARCHAR(255),
  phone VARCHAR(50),
  city VARCHAR(100),
  country VARCHAR(100),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

**orders**:
```sql
CREATE TABLE orders (
  id INT AUTO_INCREMENT PRIMARY KEY,
  customer_id INT,
  product_id INT,
  quantity INT DEFAULT 1,
  total_amount DECIMAL(10,2) DEFAULT 0,
  order_date DATE,
  status VARCHAR(50) DEFAULT 'pending',
  FOREIGN KEY (customer_id) REFERENCES customers(id),
  FOREIGN KEY (product_id) REFERENCES products(id)
);
```

### Relationships

```
customers (1) ────────< (many) orders
                            │
products (1) ────────────┘
```

**Relationship Types**:
- **customers → orders**: One-to-many (one customer can have many orders)
- **products → orders**: One-to-many (one product can be in many orders)

### Index Recommendations

```sql
-- Improve query performance
CREATE INDEX idx_orders_customer_id ON orders(customer_id);
CREATE INDEX idx_orders_product_id ON orders(product_id);
CREATE INDEX idx_orders_status ON orders(status);
CREATE INDEX idx_orders_order_date ON orders(order_date);
CREATE INDEX idx_products_category ON products(category);
CREATE INDEX idx_customers_city ON customers(city);
```

---

## API Reference

### Complete Endpoint List

#### Modules Endpoints

**GET /api/modules**
- Description: Get all report modules
- Response: Array of module objects

**POST /api/modules**
- Description: Create a new report module
- Body: `{ name, text }`
- Response: `{ id }`

**PUT /api/modules/:id**
- Description: Update a report module
- Body: `{ name, text }`
- Response: `{ id }`

**DELETE /api/modules/:id**
- Description: Delete a report module
- Response: `{ id }`

#### Queries Endpoints

**GET /api/queries**
- Description: Get all saved queries
- Response: Array of query objects

**POST /api/queries**
- Description: Create a new query
- Body: `{ name, text }`
- Response: `{ id }`

**PUT /api/queries/:id**
- Description: Update a query
- Body: `{ name, text }`
- Response: `{ id }`

**DELETE /api/queries/:id**
- Description: Delete a query
- Response: `{ id }`

#### Data Endpoints

**GET /api/objects**
- Description: Get data source schemas
- Response: OBJECTS_SCHEMA object

**POST /api/objects/:source/data**
- Description: Execute data query
- Body: Form-encoded with columns, query, joins, group, sort, limit, facets, buckets
- Response: Array of data rows

#### Fields Endpoints

**GET /api/fields/:field/options**
- Description: Get distinct field values
- Params: field (format: table.field)
- Response: Array of {id, value} objects

**GET /api/fields/:field/suggest**
- Description: Get field suggestions
- Params: field (format: table.field)
- Response: Array of string values

#### Utility Endpoints

**GET /api/test**
- Description: Health check
- Response: `{ message: "API is working!" }`

**GET /health**
- Description: Health status
- Response: `{ status: "ok", timestamp: "..." }`

---

## Development Workflow

### Local Development Setup

#### 1. Clone Repository
```bash
git clone <repository-url>
cd webix
```

#### 2. Setup Backend
```bash
cd backend
npm install
```

#### 3. Setup Database
```bash
mysql -u root -p < schema.sql
```

#### 4. Configure Environment
```bash
# backend/.env
DB_HOST=localhost
DB_USER=app_user
DB_PASSWORD=your_password
DB_NAME=reports_db
PORT=3200
```

#### 5. Start Backend
```bash
npm run dev
```
Backend runs on `http://localhost:3200`

#### 6. Setup Frontend
```bash
cd ../webix-projects-manager
npm install
```

#### 7. Start Frontend
```bash
npm run dev
```
Frontend runs on `http://localhost:5173`

#### 8. Access Application
Open browser: `http://localhost:5173`

### Development Tools

#### Backend Development
- **nodemon**: Auto-restart on file changes
- **console.log**: Debug logging
- **MySQL Workbench**: Database management

#### Frontend Development
- **Vite HMR**: Fast refresh
- **React DevTools**: Component inspection
- **Browser DevTools**: Network monitoring

### Code Quality

#### Linting
```bash
# Frontend
cd webix-projects-manager
npm run lint

# Backend (add ESLint config)
npm install --save-dev eslint
```

#### Testing
```bash
# Add test frameworks
npm install --save-dev jest @testing-library/react
```

---

## Deployment Guide

### Production Build

#### Frontend Build
```bash
cd webix-projects-manager
npm run build
```

Output: `dist/` directory

#### Backend Setup
```bash
cd backend
npm install
npm start
```

### Deployment Options

#### 1. Docker Deployment

**Dockerfile (Backend)**:
```dockerfile
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production
COPY . .
EXPOSE 3200
CMD ["node", "server.js"]
```

**Dockerfile (Frontend)**:
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
  backend:
    build: ./backend
    ports:
      - "3200:3200"
    environment:
      - DB_HOST=mysql
      - DB_USER=root
      - DB_PASSWORD=password
      - DB_NAME=reports_db
    depends_on:
      - mysql
  
  frontend:
    build: ./webix-projects-manager
    ports:
      - "80:80"
    depends_on:
      - backend
  
  mysql:
    image: mysql:8.0
    environment:
      - MYSQL_ROOT_PASSWORD=password
      - MYSQL_DATABASE=reports_db
    volumes:
      - mysql-data:/var/lib/mysql
      - ./backend/schema.sql:/docker-entrypoint-initdb.d/schema.sql

volumes:
  mysql-data:
```

#### 2. Traditional Deployment

**Backend**:
```bash
# On server
cd /var/www/backend
npm install
npm start
```

Use PM2 for process management:
```bash
npm install -g pm2
pm2 start server.js --name "reports-backend"
pm2 startup
pm2 save
```

**Frontend**:
```bash
# On server
cd /var/www/frontend
npm run build
# Configure nginx to serve dist/
```

#### 3. Cloud Deployment

**Frontend on Netlify/Vercel**:
- Connect repository
- Configure build command: `npm run build`
- Set output directory: `dist`

**Backend on Render/Heroku**:
- Connect repository
- Set environment variables
- Configure start command: `node server.js`

---

## Troubleshooting

### Common Issues

#### 1. Backend Not Starting

**Symptoms**: Port already in use

**Solution**:
```bash
# Find process using port
lsof -i :3200
# Kill process
kill -9 <PID>
# Or use different port
PORT=3201 npm start
```

#### 2. Database Connection Failed

**Symptoms**: Connection refused

**Solutions**:
- Verify MySQL is running
- Check credentials in .env
- Ensure database exists
- Test connection: `mysql -u app_user -p reports_db`

#### 3. CORS Errors

**Symptoms**: Cross-origin request blocked

**Solutions**:
- Verify CORS origin matches frontend URL
- Check CORS configuration in backend
- Ensure credentials flag is correct

#### 4. Webix Not Loading

**Symptoms**: Empty container

**Solutions**:
- Check browser console for errors
- Verify Webix files exist
- Check network tab for failed requests
- Ensure correct file paths

#### 5. API Calls Failing

**Symptoms**: Network errors

**Solutions**:
- Verify backend is running
- Check proxy configuration
- Test API directly: `curl http://localhost:3200/api/test`
- Check browser console for errors

### Debugging Techniques

#### Backend Debugging

**Enable Detailed Logging**:
```javascript
console.log('Request:', req.method, req.url);
console.log('Body:', req.body);
console.log('SQL:', sql);
console.log('Params:', params);
console.log('Results:', rows);
```

**Test Endpoints**:
```bash
curl http://localhost:3200/api/test
curl http://localhost:3200/api/objects
curl -X POST http://localhost:3200/api/objects/orders/data \
  -H "Content-Type: application/json" \
  -d '{"limit": "10"}'
```

#### Frontend Debugging

**React DevTools**:
- Inspect component state
- Monitor props
- Profile performance

**Browser DevTools**:
- Network tab: Monitor API calls
- Console: Check for errors
- Sources: Debug JavaScript

**Webix Debug Mode**:
```javascript
window.webix.debug = true;
```

---

## Future Roadmap

### Planned Enhancements

#### Backend
1. **Authentication**: Add JWT-based authentication
2. **Authorization**: Role-based access control
3. **Caching**: Redis caching for frequent queries
4. **Pagination**: Server-side pagination
5. **Export**: CSV, Excel, PDF export
6. **WebSockets**: Real-time data updates
7. **Rate Limiting**: API rate limiting
8. **Monitoring**: Performance monitoring and logging
9. **Testing**: Unit and integration tests
10. **Documentation**: OpenAPI/Swagger docs

#### Frontend
1. **TypeScript**: Add type safety
2. **State Management**: Redux or Zustand
3. **Routing**: React Router for multiple pages
4. **Theming**: Custom theme support
5. **Accessibility**: WCAG compliance
6. **Testing**: Jest and React Testing Library
7. **PWA**: Offline capabilities
8. **i18n**: Internationalization
9. **Performance**: Code splitting and lazy loading
10. **Error Boundaries**: Better error handling

#### Architecture
1. **Microservices**: Split backend into services
2. **GraphQL**: Alternative to REST
3. **Event-Driven**: Message queue for async operations
4. **CI/CD**: Automated deployment pipeline
5. **Monitoring**: Application performance monitoring
6. **Logging**: Centralized logging
7. **Security**: Security audit and hardening
8. **Scalability**: Horizontal scaling support

---

## Conclusion

The Webix Reports Manager is a full-stack application that provides a powerful, interactive reporting interface. The architecture is designed with separation of concerns, security, and performance in mind.

### Key Strengths

1. **Modular Architecture**: Clear separation between frontend and backend
2. **Security**: SQL injection prevention, CORS configuration, parameterized queries
3. **Performance**: Connection pooling, efficient query building, optimized frontend
4. **Developer Experience**: Hot Module Replacement, comprehensive logging, clear documentation
5. **Extensibility**: Easy to add new features and modify existing functionality

### Best Practices Demonstrated

1. **RESTful API Design**: Clean, predictable API endpoints
2. **Error Handling**: Comprehensive error handling throughout
3. **Code Organization**: Clear file structure and component separation
4. **Documentation**: Detailed inline comments and external documentation
5. **Testing Ready**: Architecture supports easy testing

### Next Steps

For developers looking to extend this application:

1. Review the detailed documentation in backend and frontend folders
2. Understand the complete data flow documented here
3. Follow the development workflow for local setup
4. Use the troubleshooting guide for common issues
5. Refer to the API reference for endpoint details

This documentation provides a complete understanding of the system architecture, data flow, and implementation details needed for effective development and maintenance of the Webix Reports Manager.
