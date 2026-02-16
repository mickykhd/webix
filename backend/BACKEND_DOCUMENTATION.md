# Webix Reports Manager - Backend Documentation

## Table of Contents
1. [Overview](#overview)
2. [Architecture](#architecture)
3. [Technology Stack](#technology-stack)
4. [Database Schema](#database-schema)
5. [API Endpoints](#api-endpoints)
6. [Data Flow](#data-flow)
7. [Security Considerations](#security-considerations)
8. [Configuration](#configuration)
9. [Development Setup](#development-setup)
10. [Testing & Debugging](#testing--debugging)

---

## Overview

The backend is a RESTful API server built with Express.js that serves as the data layer for the Webix Reports Manager application. It provides endpoints for managing reports, queries, and executing complex data queries with support for joins, aggregations, filtering, and faceted search.

### Key Features
- RESTful API design
- MySQL database with connection pooling
- Webix Reports protocol compliance
- Complex query building with dynamic SQL generation
- Support for aggregations (SUM, AVG, COUNT, MIN, MAX)
- Date modifiers (YEAR, MONTH, DAY, YEARMONTH)
- Faceted search capabilities
- Reference field handling
- Picklist field support

---

## Architecture

### Layered Architecture

```
┌─────────────────────────────────────────┐
│         Express.js Server Layer         │
│  - CORS Configuration                   │
│  - Request Parsing                      │
│  - Route Handlers                       │
└──────────────┬──────────────────────────┘
               │
┌──────────────▼──────────────────────────┐
│       Business Logic Layer              │
│  - Query Building                       │
│  - SQL Generation                       │
│  - Data Transformation                  │
│  - Validation                           │
└──────────────┬──────────────────────────┘
               │
┌──────────────▼──────────────────────────┐
│       Data Access Layer                 │
│  - MySQL Connection Pool                │
│  - Parameterized Queries                │
│  - Result Mapping                       │
└──────────────┬──────────────────────────┘
               │
┌──────────────▼──────────────────────────┐
│         MySQL Database                  │
│  - Tables: products, customers, orders   │
│  - Webix Internal: modules, queries     │
└─────────────────────────────────────────┘
```

### Core Components

#### 1. Server Initialization (`server.js:1-26`)
- Express app setup with CORS configuration
- MySQL connection pool creation
- Middleware configuration (JSON, URL-encoded parsing)

#### 2. Schema Definitions (`server.js:31-92`)
- **OBJECTS_SCHEMA**: Defines data source schemas matching Webix Reports format
- **PICKLISTS**: Defines picklist values for enum-type fields
- **ALLOWED_TABLES**: Whitelist for SQL injection prevention

#### 3. Query Building Engine (`server.js:218-707`)
- Column parsing and type detection
- JOIN clause construction
- WHERE clause generation
- GROUP BY and ORDER BY handling
- Aggregation function support
- Date modifier handling

#### 4. API Endpoint Handlers
- Modules management (CRUD operations)
- Queries management (CRUD operations)
- Data retrieval with complex filtering
- Field options and suggestions

---

## Technology Stack

### Core Dependencies

| Package | Version | Purpose |
|---------|---------|---------|
| express | ^5.2.1 | Web framework |
| mysql2 | ^3.17.0 | MySQL driver with Promise support |
| cors | ^2.8.6 | Cross-origin resource sharing |
| dotenv | ^17.2.4 | Environment variable management |
| nodemon | ^3.1.11 | Development server auto-reload |

### Runtime Environment
- Node.js with ES modules support (`"type": "module"`)
- MySQL 8.0+ database
- Port: 3200 (default)

---

## Database Schema

### Webix Internal Tables

#### modules Table
Stores report definitions created by users.

```sql
CREATE TABLE modules (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(255) NOT NULL DEFAULT 'New Report',
  text TEXT,
  updated TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);
```

**Purpose**: Persist report configurations including filters, columns, and layout settings.

#### queries Table
Stores saved query definitions.

```sql
CREATE TABLE queries (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(255) NOT NULL DEFAULT 'New Query',
  text TEXT,
  updated TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);
```

**Purpose**: Save and reuse complex query configurations.

### Data Tables

#### products Table
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

**Fields**:
- `id`: Primary key
- `name`: Product name
- `price`: Unit price
- `category`: Product category
- `stock`: Inventory count
- `created_at`: Creation timestamp

#### customers Table
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

**Fields**:
- `id`: Primary key
- `name`: Customer name
- `email`: Email address
- `phone`: Phone number
- `city`: City
- `country`: Country
- `created_at`: Creation timestamp

#### orders Table
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

**Fields**:
- `id`: Primary key
- `customer_id`: Foreign key to customers
- `product_id`: Foreign key to products
- `quantity`: Order quantity
- `total_amount`: Total price
- `order_date`: Order date
- `status`: Order status (pending/completed/cancelled)

**Relationships**:
- Many-to-One: orders → customers
- Many-to-One: orders → products

---

## API Endpoints

### 1. Modules Endpoints

#### GET /api/modules
**Description**: Retrieve all report modules ordered by update date.

**Response**:
```json
[
  {
    "id": 1,
    "name": "Sales Report",
    "text": "{...report configuration...}",
    "updated": "2024-01-15T10:30:00.000Z"
  }
]
```

**Flow**:
1. Query modules table ordered by updated DESC
2. Return all rows as JSON
3. Log row count for monitoring

#### POST /api/modules
**Description**: Create a new report module.

**Request Body**:
```json
{
  "name": "New Report",
  "text": "{}"
}
```

**Response**:
```json
{
  "id": 123
}
```

**Flow**:
1. Extract name and text from request body
2. Insert into modules table
3. Return new ID
4. Log creation

#### PUT /api/modules/:id
**Description**: Update an existing report module.

**Request Body**:
```json
{
  "name": "Updated Report",
  "text": "{...updated config...}"
}
```

**Response**:
```json
{
  "id": 123
}
```

**Flow**:
1. Extract name and text from request body
2. Update modules table where id matches
3. Return updated ID
4. Log update

#### DELETE /api/modules/:id
**Description**: Delete a report module.

**Response**:
```json
{
  "id": 123
}
```

**Flow**:
1. Delete from modules table where id matches
2. Return deleted ID
3. Log deletion

---

### 2. Queries Endpoints

#### GET /api/queries
**Description**: Retrieve all saved queries.

**Response**:
```json
[
  {
    "id": 1,
    "name": "Monthly Sales",
    "text": "{...query config...}",
    "updated": "2024-01-15T10:30:00.000Z"
  }
]
```

#### POST /api/queries
**Description**: Create a new saved query.

**Request Body**:
```json
{
  "name": "New Query",
  "text": "{}"
}
```

**Response**:
```json
{
  "id": 456
}
```

#### PUT /api/queries/:id
**Description**: Update an existing query.

#### DELETE /api/queries/:id
**Description**: Delete a query.

---

### 3. Data Schema Endpoints

#### GET /api/objects
**Description**: Return data source schemas in Webix Reports format.

**Response**:
```json
{
  "products": {
    "id": "products",
    "name": "Products",
    "data": [
      { "id": "id", "name": "ID", "filter": true, "edit": false, "type": "number", "ref": "", "key": true, "show": false },
      { "id": "name", "name": "Name", "filter": true, "edit": false, "type": "text", "ref": "", "key": false, "show": true }
    ],
    "refs": [
      { "id": 1, "target": "products", "source": "orders", "name": "Product" }
    ]
  }
}
```

**Flow**:
1. Return OBJECTS_SCHEMA constant
2. No database query needed
3. Provides metadata for UI rendering

---

### 4. Data Query Endpoints

#### POST /api/objects/:source/data
**Description**: Execute complex data queries with filtering, joins, aggregations, and grouping.

**Request Parameters** (form-encoded with JSON strings):
- `columns`: Array of column identifiers (e.g., `["products.name", "sum.orders.quantity"]`)
- `query`: Filter conditions in Webix query format
- `joins`: Array of join specifications
- `group`: Array of group-by fields
- `sort`: Array of sort specifications
- `limit`: Result row limit
- `facets`: Array of facet fields for faceted search
- `buckets`: Bucket configuration

**Example Request**:
```json
{
  "columns": ["products.name", "sum.orders.total_amount"],
  "query": "{\"glue\":\"and\",\"rules\":[{\"field\":\"orders.status\",\"condition\":{\"type\":\"equal\",\"filter\":\"completed\"}}]}",
  "joins": "[{\"sid\":\"orders\",\"tid\":\"products\",\"tf\":\"product_id\"}]",
  "group": ["products.name"],
  "sort": "[{\"id\":\"sum.orders.total_amount\",\"mod\":\"desc\"}]",
  "limit": "50"
}
```

**Response**:
```json
[
  {
    "products.name": "Laptop Pro",
    "sum.orders.total_amount": 2599.98
  }
]
```

**Flow**:
1. **Validation**: Verify source table is in ALLOWED_TABLES
2. **Parsing**: Parse JSON-encoded parameters
3. **Faceted Search** (if facets provided):
   - Get distinct facet values
   - Execute separate query for each facet value
   - Return array of results with facet metadata
4. **Standard Query**:
   - Build JOIN clauses from refs
   - Parse and handle group-by fields
   - Parse column identifiers (regular, aggregation, date-modified)
   - Build SELECT statement with aliases
   - Build WHERE clause from query object
   - Build GROUP BY clause
   - Build ORDER BY clause
   - Build LIMIT clause
   - Execute parameterized query
   - Return results with table-prefixed column names
5. **Logging**: Log SQL and parameters for debugging

**Column Identifier Parsing**:
- Regular: `products.name` → `products.name AS "products.name"`
- Aggregation: `sum.products.stock` → `SUM(products.stock) AS "sum.products.stock"`
- Count All: `count.` → `COUNT(*) AS "count."`
- Date Modifier: `year.orders.order_date` → `YEAR(orders.order_date) AS "year.orders.order_date"`

**Query Building Flow**:
```
Request
  ↓
Parse Parameters
  ↓
Check for Facets
  ↓ (yes)
Get Distinct Values
  ↓
Execute Query per Value
  ↓
Return Faceted Results
  ↓ (no)
Build JOIN Clauses
  ↓
Parse Columns & Groups
  ↓
Build SELECT Statement
  ↓
Build WHERE Clause
  ↓
Build GROUP BY
  ↓
Build ORDER BY
  ↓
Build LIMIT
  ↓
Execute Query
  ↓
Return Results
```

---

### 5. Fields Endpoints

#### GET /api/fields/:field/options
**Description**: Get distinct values for a field (for filter dropdowns).

**Parameters**:
- `field`: Field identifier in format `table.field`

**Response**:
```json
[
  { "id": "Electronics", "value": "Electronics" },
  { "id": "Furniture", "value": "Furniture" }
]
```

**Flow**:
1. Parse field into table and field parts
2. Validate table is in ALLOWED_TABLES
3. Check if picklist field → return PICKLISTS values
4. Check if reference field → query referenced table for id+label pairs
5. Otherwise → query distinct values from table
6. Return array of {id, value} objects

#### GET /api/fields/:field/suggest
**Description**: Get autocomplete suggestions for a field.

**Parameters**:
- `field`: Field identifier in format `table.field`

**Response**:
```json
[
  "Alice Johnson",
  "Bob Smith",
  "Charlie Brown"
]
```

**Flow**:
1. Parse field into table and field parts
2. Validate table is in ALLOWED_TABLES
3. Query distinct values limited to 100
4. Return array of string values

---

### 6. Utility Endpoints

#### GET /api/test
**Description**: Health check endpoint.

**Response**:
```json
{
  "message": "API is working!"
}
```

#### GET /health
**Description**: Health status endpoint.

**Response**:
```json
{
  "status": "ok",
  "timestamp": "2024-01-15T10:30:00.000Z"
}
```

---

## Data Flow

### Complete Request Lifecycle

```
┌─────────────┐
│   Frontend  │
│  (React +   │
│   Webix)    │
└──────┬──────┘
       │ HTTP Request
       ↓
┌─────────────────────────────────┐
│  Express.js Middleware         │
│  - CORS Check                   │
│  - JSON Parsing                 │
│  - URL Encoding                 │
└──────┬──────────────────────────┘
       │
       ↓
┌─────────────────────────────────┐
│  Route Handler                  │
│  - Parameter Extraction         │
│  - Validation                   │
└──────┬──────────────────────────┘
       │
       ↓
┌─────────────────────────────────┐
│  Business Logic                 │
│  - Query Building               │
│  - SQL Generation               │
│  - Data Transformation          │
└──────┬──────────────────────────┘
       │
       ↓
┌─────────────────────────────────┐
│  MySQL Pool                     │
│  - Get Connection               │
│  - Execute Query                │
│  - Release Connection           │
└──────┬──────────────────────────┘
       │
       ↓
┌─────────────────────────────────┐
│  Database                       │
│  - Execute SQL                  │
│  - Return Results               │
└──────┬──────────────────────────┘
       │
       ↓
┌─────────────────────────────────┐
│  Response Processing            │
│  - Format Data                  │
│  - Add Headers                  │
└──────┬──────────────────────────┘
       │ HTTP Response
       ↓
┌─────────────┐
│   Frontend  │
│  (React +   │
│   Webix)    │
└─────────────┘
```

### Query Execution Flow Detail

```
POST /api/objects/orders/data
  ↓
Parse Request Body
  ↓
Validate Source Table
  ↓
Parse JSON Parameters
  ↓
Check for Facets
  ├─ Yes → Get Distinct Values
  │         ↓
  │      For Each Value:
  │         ↓
  │      Build Query with Facet Filter
  │         ↓
  │      Execute Query
  │         ↓
  │      Collect Results
  │         ↓
  │      Return Array of Faceted Results
  │
  └─ No → Continue
     ↓
  Build JOIN Clauses
     ↓
  Parse Group Fields
     ↓
  Parse Column Identifiers
     ├─ Regular Columns
     ├─ Aggregation Columns
     └─ Date-Modified Columns
     ↓
  Build SELECT Statement
     ↓
  Build WHERE Clause
     ├─ Parse Query Object
     ├─ Build Conditions
     └─ Collect Parameters
     ↓
  Build GROUP BY Clause
     ↓
  Build ORDER BY Clause
     ↓
  Build LIMIT Clause
     ↓
  Assemble SQL Query
     ↓
  Execute with Parameters
     ↓
  Process Results
     ├─ Add Table Prefixes (if needed)
     └─ Format Response
     ↓
  Return JSON Response
```

### Faceted Search Flow

```
Request with facets=["products.category"]
  ↓
Query Distinct Categories
  ↓
[Electronics, Furniture, Accessories]
  ↓
For Each Category:
  ↓
  Build Query:
  WHERE (original conditions)
    AND products.category = 'Electronics'
  ↓
  Execute Query
  ↓
  Collect Results
  ↓
Return:
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
```

---

## Security Considerations

### 1. SQL Injection Prevention

**Table Whitelist**:
```javascript
const ALLOWED_TABLES = ['products', 'customers', 'orders'];
```
- Only allows queries on whitelisted tables
- Prevents arbitrary table access

**Parameterized Queries**:
```javascript
const [rows] = await pool.query(sql, queryParams);
```
- All user input is passed as parameters
- MySQL driver handles escaping

**Column Validation**:
- Column identifiers are parsed and validated
- Only allowed columns from schema are used
- Aggregation functions are whitelisted

### 2. CORS Configuration

```javascript
app.use(cors({
  origin: 'http://localhost:5173',
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));
```

**Security Implications**:
- Only allows requests from specific origin
- Credentials enabled for authenticated requests
- Explicit method whitelist
- Explicit header whitelist

### 3. Input Validation

**Source Table Validation**:
```javascript
if (!ALLOWED_TABLES.includes(source)) {
  return res.status(400).json({ error: `Unknown data source: ${source}` });
}
```

**Field Format Validation**:
```javascript
const parts = fieldParam.split('.');
if (parts.length !== 2) {
  return res.status(400).json({ error: 'Invalid field format. Expected: table.field' });
}
```

### 4. Error Handling

All endpoints wrapped in try-catch:
```javascript
try {
  // operation
} catch (error) {
  console.error('Error:', error.message);
  res.status(500).json({ error: error.message });
}
```

**Benefits**:
- Prevents stack trace leakage
- Provides user-friendly error messages
- Logs errors for debugging

---

## Configuration

### Environment Variables (.env)

```bash
DB_HOST=localhost
DB_USER=app_user
DB_PASSWORD=R3act!Mysql_2026
DB_NAME=reports_db
PORT=3200
```

### Connection Pool Configuration

```javascript
const pool = mysql.createPool({
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_NAME || 'reports_db',
  waitForConnections: true,
  connectionLimit: 10
});
```

**Parameters**:
- `waitForConnections`: Queue requests when pool is exhausted
- `connectionLimit`: Maximum 10 concurrent connections
- Default values provided for development

---

## Development Setup

### Prerequisites
- Node.js 18+ with ES modules support
- MySQL 8.0+
- npm or yarn

### Installation

```bash
cd backend
npm install
```

### Database Setup

```bash
mysql -u root -p < schema.sql
```

This creates:
- Database: `reports_db`
- Tables: modules, queries, products, customers, orders
- Sample data for testing

### Running Development Server

```bash
npm run dev
```

Uses nodemon for auto-restart on file changes.

### Running Production Server

```bash
npm start
```

### Default Port
- Backend: `http://localhost:3200`
- API Base: `http://localhost:3200/api`

---

## Testing & Debugging

### Logging

All endpoints log key operations:
```javascript
console.log('Fetched modules:', rows.length);
console.log('SQL:', sql);
console.log('Params:', queryParams);
```

### Testing Endpoints

#### Health Check
```bash
curl http://localhost:3200/health
```

#### Get Objects Schema
```bash
curl http://localhost:3200/api/objects
```

#### Query Data
```bash
curl -X POST http://localhost:3200/api/objects/orders/data \
  -H "Content-Type: application/json" \
  -d '{
    "columns": ["orders.id", "customers.name"],
    "joins": "[{\"sid\":\"orders\",\"tid\":\"customers\",\"tf\":\"customer_id\"}]",
    "limit": "10"
  }'
```

### Common Issues

**Connection Refused**:
- Check MySQL is running
- Verify credentials in .env
- Ensure database exists

**CORS Errors**:
- Verify frontend origin matches CORS config
- Check credentials setting

**SQL Errors**:
- Check table names in ALLOWED_TABLES
- Verify column names in schema
- Review SQL in console logs

---

## Advanced Features

### 1. Aggregation Functions

Supported aggregations:
- `sum` - Sum of values
- `avg` - Average of values
- `count` - Count of rows
- `min` - Minimum value
- `max` - Maximum value

**Usage**:
```
sum.products.stock
avg.orders.total_amount
count.
min.products.price
max.orders.quantity
```

### 2. Date Modifiers

Supported date modifiers:
- `year` - Extract year
- `month` - Extract month
- `day` - Extract day
- `yearmonth` - Format as YYYY-MM

**Usage**:
```
year.orders.order_date
month.orders.order_date
day.orders.order_date
yearmonth.orders.order_date
```

### 3. Join Types

**Forward Join**:
```javascript
{sid: "orders", tid: "customers", sf: "customer_id"}
// Generates: orders.customer_id = customers.id
```

**Reverse Join**:
```javascript
{sid: "orders", tid: "products", tf: "product_id"}
// Generates: orders.product_id = products.id
```

### 4. Query Conditions

Supported condition types:
- `equal` - Exact match
- `notEqual` - Not equal
- `contains` - Contains substring
- `notContains` - Does not contain
- `beginsWith` - Starts with
- `endsWith` - Ends with
- `greater` - Greater than
- `greaterOrEqual` - Greater than or equal
- `less` - Less than
- `lessOrEqual` - Less than or equal

**Example Query Object**:
```json
{
  "glue": "and",
  "rules": [
    {
      "field": "orders.status",
      "condition": {
        "type": "equal",
        "filter": "completed"
      }
    },
    {
      "field": "orders.total_amount",
      "condition": {
        "type": "greater",
        "filter": 100
      }
    }
  ]
}
```

---

## Performance Considerations

### Connection Pooling
- Reuses database connections
- Reduces connection overhead
- Configurable pool size (default: 10)

### Query Optimization
- Use LIMIT to reduce result sets
- Add indexes on frequently queried columns
- Use WHERE clauses to filter early

### Faceted Search
- Executes multiple queries
- Consider caching facet values
- Use database indexes on facet columns

---

## Future Enhancements

### Potential Improvements
1. Authentication and authorization
2. Query result caching
3. Pagination support
4. Export functionality (CSV, Excel)
5. Real-time data updates (WebSocket)
6. Query performance monitoring
7. Rate limiting
8. Request validation middleware
9. API documentation (Swagger/OpenAPI)
10. Unit and integration tests

---

## Conclusion

This backend provides a robust, secure API for the Webix Reports Manager. It handles complex data queries with support for joins, aggregations, filtering, and faceted search while maintaining security through parameterized queries and table whitelisting.

The architecture is modular and extensible, making it easy to add new features or modify existing functionality. The comprehensive logging and error handling make debugging straightforward.

For questions or issues, refer to the console logs and error messages returned by the API.
