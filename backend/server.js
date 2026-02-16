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

// Database connection pool
const pool = mysql.createPool({
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_NAME || 'reports_db',
  waitForConnections: true,
  connectionLimit: 10
});

// Allowed tables for SQL injection prevention
const ALLOWED_TABLES = ['products', 'customers', 'orders'];

// ============= OBJECTS SCHEMA =============
// Format matches official Webix Reports backend:
// Each object has: id, name, data (array of fields), refs (array of relationships)
const OBJECTS_SCHEMA = {
  products: {
    id: "products",
    name: "Products",
    data: [
      { id: "id", name: "ID", filter: true, edit: false, type: "number", ref: "", key: true, show: false },
      { id: "name", name: "Name", filter: true, edit: false, type: "text", ref: "", key: false, show: true },
      { id: "price", name: "Price", filter: true, edit: false, type: "number", ref: "", key: false, show: false },
      { id: "category", name: "Category", filter: true, edit: false, type: "text", ref: "", key: false, show: false },
      { id: "stock", name: "Stock", filter: true, edit: false, type: "number", ref: "", key: false, show: false },
      { id: "created_at", name: "Created", filter: true, edit: false, type: "date", ref: "", key: false, show: false }
    ],
    refs: [
      { id: 1, target: "products", source: "orders", name: "Product" }
    ]
  },
  customers: {
    id: "customers",
    name: "Customers",
    data: [
      { id: "id", name: "ID", filter: true, edit: false, type: "number", ref: "", key: true, show: false },
      { id: "name", name: "Name", filter: true, edit: false, type: "text", ref: "", key: false, show: true },
      { id: "email", name: "Email", filter: true, edit: false, type: "text", ref: "", key: false, show: false },
      { id: "phone", name: "Phone", filter: true, edit: false, type: "text", ref: "", key: false, show: false },
      { id: "city", name: "City", filter: true, edit: false, type: "text", ref: "", key: false, show: false },
      { id: "country", name: "Country", filter: true, edit: false, type: "text", ref: "", key: false, show: false },
      { id: "created_at", name: "Created", filter: true, edit: false, type: "date", ref: "", key: false, show: false }
    ],
    refs: [
      { id: 2, target: "customers", source: "orders", name: "Customer" }
    ]
  },
  orders: {
    id: "orders",
    name: "Orders",
    data: [
      { id: "id", name: "ID", filter: true, edit: false, type: "number", ref: "", key: true, show: false },
      { id: "customer_id", name: "Customer", filter: true, edit: false, type: "reference", ref: "customers", key: false, show: false },
      { id: "product_id", name: "Product", filter: true, edit: false, type: "reference", ref: "products", key: false, show: false },
      { id: "quantity", name: "Quantity", filter: true, edit: false, type: "number", ref: "", key: false, show: false },
      { id: "total_amount", name: "Total", filter: true, edit: false, type: "number", ref: "", key: false, show: true },
      { id: "order_date", name: "Order Date", filter: true, edit: false, type: "date", ref: "", key: false, show: false },
      { id: "status", name: "Status", filter: true, edit: false, type: "picklist", ref: "order_statuses", key: false, show: false }
    ],
    refs: [
      { id: 1, target: "products", source: "orders", name: "Product" },
      { id: 2, target: "customers", source: "orders", name: "Customer" }
    ]
  }
};

// Picklists for picklist-type fields
const PICKLISTS = {
  order_statuses: [
    { id: "pending", value: "Pending" },
    { id: "completed", value: "Completed" },
    { id: "cancelled", value: "Cancelled" }
  ]
};

// ============= MODULES (Reports) ENDPOINTS =============

// GET /api/modules
app.get('/api/modules', async (req, res) => {
  try {
    const [rows] = await pool.query('SELECT * FROM modules ORDER BY updated DESC');
    console.log('Fetched modules:', rows.length);
    res.json(rows);
  } catch (error) {
    console.error('Error fetching modules:', error.message);
    res.status(500).json({ error: error.message });
  }
});

// POST /api/modules
app.post('/api/modules', async (req, res) => {
  try {
    const { name, text } = req.body;
    const [result] = await pool.query(
      'INSERT INTO modules (name, text) VALUES (?, ?)',
      [name || 'New Report', text || '{}']
    );
    console.log('Created module:', result.insertId);
    res.json({ id: result.insertId });
  } catch (error) {
    console.error('Error creating module:', error.message);
    res.status(500).json({ error: error.message });
  }
});

// PUT /api/modules/:id
app.put('/api/modules/:id', async (req, res) => {
  try {
    const { name, text } = req.body;
    await pool.query(
      'UPDATE modules SET name = ?, text = ? WHERE id = ?',
      [name, text, req.params.id]
    );
    console.log('Updated module:', req.params.id);
    res.json({ id: parseInt(req.params.id) });
  } catch (error) {
    console.error('Error updating module:', error.message);
    res.status(500).json({ error: error.message });
  }
});

// DELETE /api/modules/:id
app.delete('/api/modules/:id', async (req, res) => {
  try {
    await pool.query('DELETE FROM modules WHERE id = ?', [req.params.id]);
    console.log('Deleted module:', req.params.id);
    res.json({ id: parseInt(req.params.id) });
  } catch (error) {
    console.error('Error deleting module:', error.message);
    res.status(500).json({ error: error.message });
  }
});

// ============= QUERIES ENDPOINTS =============

// GET /api/queries
app.get('/api/queries', async (req, res) => {
  try {
    const [rows] = await pool.query('SELECT * FROM queries ORDER BY updated DESC');
    console.log('Fetched queries:', rows.length);
    res.json(rows);
  } catch (error) {
    console.error('Error fetching queries:', error.message);
    res.status(500).json({ error: error.message });
  }
});

// POST /api/queries
app.post('/api/queries', async (req, res) => {
  try {
    const { name, text } = req.body;
    const [result] = await pool.query(
      'INSERT INTO queries (name, text) VALUES (?, ?)',
      [name || 'New Query', text || '{}']
    );
    console.log('Created query:', result.insertId);
    res.json({ id: result.insertId });
  } catch (error) {
    console.error('Error creating query:', error.message);
    res.status(500).json({ error: error.message });
  }
});

// PUT /api/queries/:id
app.put('/api/queries/:id', async (req, res) => {
  try {
    const { name, text } = req.body;
    await pool.query(
      'UPDATE queries SET name = ?, text = ? WHERE id = ?',
      [name, text, req.params.id]
    );
    console.log('Updated query:', req.params.id);
    res.json({ id: parseInt(req.params.id) });
  } catch (error) {
    console.error('Error updating query:', error.message);
    res.status(500).json({ error: error.message });
  }
});

// DELETE /api/queries/:id
app.delete('/api/queries/:id', async (req, res) => {
  try {
    await pool.query('DELETE FROM queries WHERE id = ?', [req.params.id]);
    console.log('Deleted query:', req.params.id);
    res.json({ id: parseInt(req.params.id) });
  } catch (error) {
    console.error('Error deleting query:', error.message);
    res.status(500).json({ error: error.message });
  }
});

// ============= DATA SCHEMA ENDPOINTS =============

// GET /api/objects - Return data source schemas (official format)
app.get('/api/objects', (req, res) => {
  console.log('Fetched objects schema');
  res.json(OBJECTS_SCHEMA);
});

// Helper: safely parse a value that may be a JSON string or already parsed
function jsonParse(val) {
  if (val === undefined || val === null || val === '') return null;
  if (typeof val === 'object') return val;
  try { return JSON.parse(val); } catch { return val; }
}

// Aggregation function names recognized by Webix Reports
const AGG_FUNCTIONS = ['sum', 'avg', 'count', 'min', 'max'];

// Date modifier functions recognized by Webix Reports
const DATE_MODIFIERS = {
  year: (t, f) => ({ select: `YEAR(${t}.${f})`, groupBy: `YEAR(${t}.${f})` }),
  month: (t, f) => ({ select: `MONTH(${t}.${f})`, groupBy: `MONTH(${t}.${f})` }),
  yearmonth: (t, f) => ({ select: `DATE_FORMAT(${t}.${f}, '%Y-%m')`, groupBy: `DATE_FORMAT(${t}.${f}, '%Y-%m')` }),
  day: (t, f) => ({ select: `DAY(${t}.${f})`, groupBy: `DAY(${t}.${f})` }),
};

// Parse a column identifier from Webix format
// Possible formats:
//   "products.name"              -> regular column
//   "sum.products.stock"         -> aggregation column (3 parts)
//   "count."                     -> COUNT(*) with no column (2 parts, empty field)
//   "year.products.created_at"   -> date-modified column (used in group)
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

  // 2 parts: could be "table.field" (regular) or "count." / "sum." (agg with no column)
  if (parts.length === 2) {
    const prefix = parts[0];
    const rest = parts[1];
    // Aggregation with no column: "count." -> COUNT(*)
    if (AGG_FUNCTIONS.includes(prefix) && rest === '') {
      return { type: 'agg', op: prefix, table: source || '', field: '*', alias: colId };
    }
    return { type: 'regular', table: prefix, field: rest, alias: colId };
  }

  // 1 part: could be just "count" with no dot
  if (parts.length === 1 && AGG_FUNCTIONS.includes(parts[0])) {
    return { type: 'agg', op: parts[0], table: source || '', field: '*', alias: colId };
  }

  return null;
}

// Helper: build JOIN clauses
// Webix refs format:
//   Forward: {sid: "orders", tid: "customers", sf: "customer_id"} -> orders.customer_id = customers.id
//   Reverse: {sid: "customers", tid: "orders", tf: "customer_id"} -> orders.customer_id = customers.id
// When source=products and join={sid:"orders", tid:"products", tf:"product_id"},
//   tid=source so we need to JOIN orders (sid) instead, not products again.
function buildJoinClauses(joins, source) {
  const clauses = [];
  const joined = new Set();
  if (!joins?.length) return clauses;

  for (const join of joins) {
    const sid = join.sid || '';
    const tid = join.tid || '';

    // Determine which table to actually JOIN (the one not already in FROM)
    let joinTable, condition;

    if (tid === source && sid !== source) {
      // Reverse ref: tid is already the source table, join sid instead
      joinTable = sid;
      if (!ALLOWED_TABLES.includes(joinTable)) continue;
      if (join.tf) {
        // tf is the FK on sid that points to source: sid.tf = source.id
        condition = `${joinTable}.${join.tf} = ${source}.id`;
      } else if (join.sf) {
        // sf is the FK on source that points to sid: source.sf = sid.id
        condition = `${source}.${join.sf} = ${joinTable}.id`;
      }
    } else if (sid === source && tid !== source) {
      // Forward ref: sid is the source table, join tid
      joinTable = tid;
      if (!ALLOWED_TABLES.includes(joinTable)) continue;
      if (join.sf) {
        // sf is the FK on source that points to tid: source.sf = tid.id
        condition = `${source}.${join.sf} = ${joinTable}.id`;
      } else if (join.tf) {
        // tf is the FK on tid that points to source: tid.tf = source.id
        condition = `${joinTable}.${join.tf} = ${source}.id`;
      }
    } else if (sid !== source && tid !== source) {
      // Neither is the source — chained join (e.g. products -> orders -> customers)
      joinTable = tid;
      if (!ALLOWED_TABLES.includes(joinTable)) continue;
      if (join.sf) condition = `${sid}.${join.sf} = ${joinTable}.id`;
      else if (join.tf) condition = `${joinTable}.${join.tf} = ${sid}.id`;
    } else {
      // sid === tid === source — self-join, skip
      continue;
    }

    if (joinTable && condition && !joined.has(joinTable)) {
      clauses.push(`LEFT JOIN ${joinTable} ON ${condition}`);
      joined.add(joinTable);
    }
  }
  return clauses;
}

// Helper: build WHERE clause from query
function buildWhereClause(query, source) {
  let whereClause = '';
  let queryParams = [];

  if (query && typeof query === 'string' && query.length > 0) {
    try {
      const queryObj = JSON.parse(query);
      const { clause, params } = buildWhereFromQuery(queryObj, source);
      if (clause) { whereClause = `WHERE ${clause}`; queryParams = params; }
    } catch { /* ignore parse errors */ }
  } else if (query && typeof query === 'object') {
    const { clause, params } = buildWhereFromQuery(query, source);
    if (clause) { whereClause = `WHERE ${clause}`; queryParams = params; }
  }
  return { whereClause, queryParams };
}

// Helper: execute a data query and return rows
// Webix Reports sends:
//   columns: ["products.name", "sum.products.stock"] (regular + aggregation mixed)
//   group:   ["products.name"] or ["year.products.created_at"] (flat string array, mod as prefix)
//   sort:    [{"id":"products.name","mod":"asc"}] (array of {id, mod} objects)
//   joins:   [{sid, tid, sf, tf}]
//   facets:  ["products.category"]
async function executeDataQuery({ source, columns, query, joins, group, sort, limit }) {
  const joinClauses = buildJoinClauses(joins, source);
  // group can be an array, empty string "", or null
  const groupArray = Array.isArray(group) ? group : [];
  const hasGroup = groupArray.length > 0;

  // Separate columns into regular, aggregation, and date-modified
  let selectFields = [];
  let groupByFields = [];

  if (hasGroup) {
    // Parse group-by fields (flat string array from Webix)
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

  if (columns?.length > 0) {
    for (const col of columns) {
      const parsed = parseColumnId(col, source);
      if (!parsed) continue;
      // For agg with field='*', skip table check (COUNT(*) has no specific table)
      if (parsed.type !== 'agg' && !ALLOWED_TABLES.includes(parsed.table)) continue;
      if (parsed.type === 'agg' && parsed.field !== '*' && !ALLOWED_TABLES.includes(parsed.table)) continue;

      if (parsed.type === 'agg') {
        // Aggregation column: SUM(products.stock) or COUNT(*)
        const aggExpr = parsed.field === '*' ? '*' : `${parsed.table}.${parsed.field}`;
        selectFields.push(`${parsed.op.toUpperCase()}(${aggExpr}) as \`${parsed.alias}\``);
      } else if (parsed.type === 'dateMod') {
        // Date-modified column (can appear in columns too)
        const dm = DATE_MODIFIERS[parsed.mod](parsed.table, parsed.field);
        const existing = selectFields.find(f => f.includes(`\`${parsed.alias}\``));
        if (!existing) {
          selectFields.push(`${dm.select} as \`${parsed.alias}\``);
        }
      } else {
        // Regular column — skip if already added by group
        if (!hasGroup) {
          selectFields.push(`${parsed.table}.${parsed.field} as \`${parsed.alias}\``);
        }
      }
    }
  }

  // Fallback: no columns specified, select all from schema
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

  // Build ORDER BY — sort is array of {id, mod} where mod is "asc"/"desc"
  let orderClause = '';
  if (sort?.length > 0) {
    const sortFields = sort.map(s => {
      const fieldId = typeof s === 'string' ? s : (s.id || '');
      const dir = (typeof s === 'string' ? 'ASC' : (s.mod || 'asc')).toUpperCase();
      const parsed = parseColumnId(fieldId, source);
      if (!parsed) return null;
      // For aggregation columns, reference by alias
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

  // If SELECT * was used (no schema), prefix keys with table name
  if (selectFields.length === 1 && selectFields[0] === `${source}.*`) {
    return rows.map(row => {
      const obj = {};
      for (const [key, value] of Object.entries(row)) obj[`${source}.${key}`] = value;
      return obj;
    });
  }

  return rows;
}

// POST /api/objects/:source/data - Execute query and return data
app.post('/api/objects/:source/data', async (req, res) => {
  try {
    const source = req.params.source;

    if (!ALLOWED_TABLES.includes(source)) {
      return res.status(400).json({ error: `Unknown data source: ${source}` });
    }

    // Webix sends form-encoded data where arrays/objects are JSON strings
    const columns = jsonParse(req.body.columns);
    const query = jsonParse(req.body.query);
    const joins = jsonParse(req.body.joins);
    const group = jsonParse(req.body.group);
    const sort = jsonParse(req.body.sort);
    const limit = req.body.limit;
    const buckets = jsonParse(req.body.buckets);
    const facets = jsonParse(req.body.facets);

    console.log('Data request for:', source, JSON.stringify({ columns, group, sort, facets }));

    // Handle facets: run separate queries per facet value
    if (facets?.length > 0) {
      const facetColumn = facets[0]; // e.g. "products.category"
      const [facetTable, facetField] = facetColumn.split('.');

      if (!ALLOWED_TABLES.includes(facetTable)) {
        return res.status(400).json({ error: `Unknown facet table: ${facetTable}` });
      }

      // Get distinct facet values
      const [facetValues] = await pool.query(
        `SELECT DISTINCT ${facetField} as val FROM ${facetTable} WHERE ${facetField} IS NOT NULL ORDER BY ${facetField}`
      );

      const results = [];
      for (const fv of facetValues) {
        // Build a modified query with the facet filter added
        let facetQuery = query;
        if (facetQuery && typeof facetQuery === 'object' && facetQuery.rules) {
          facetQuery = {
            glue: 'and',
            rules: [
              facetQuery,
              { field: facetColumn, includes: [], condition: { type: 'equal', filter: fv.val } }
            ]
          };
        } else {
          facetQuery = {
            glue: 'and',
            rules: [
              { field: facetColumn, includes: [], condition: { type: 'equal', filter: fv.val } }
            ]
          };
        }

        const data = await executeDataQuery({ source, columns, query: facetQuery, joins, group, sort, limit });
        results.push({
          data,
          facets: [{ column: facetColumn, value: String(fv.val) }]
        });
      }

      return res.json(results);
    }

    // Standard (non-faceted) query
    const rows = await executeDataQuery({ source, columns, query, joins, group, sort, limit });
    console.log('Returned rows:', rows.length);
    res.json(rows);
  } catch (error) {
    console.error('Error fetching data:', error.message);
    res.status(500).json({ error: error.message });
  }
});

// ============= FIELDS ENDPOINTS =============

// GET /api/fields/:field/options - Return distinct values for a field (for filter dropdowns)
app.get('/api/fields/:field/options', async (req, res) => {
  try {
    const fieldParam = req.params.field; // e.g. "orders.status" or "customers.city"
    const parts = fieldParam.split('.');
    if (parts.length !== 2) {
      return res.status(400).json({ error: 'Invalid field format. Expected: table.field' });
    }

    const [table, field] = parts;
    if (!ALLOWED_TABLES.includes(table)) {
      return res.status(400).json({ error: `Unknown table: ${table}` });
    }

    // Check if it's a picklist field
    const schema = OBJECTS_SCHEMA[table];
    if (schema) {
      const fieldDef = schema.data.find(f => f.id === field);
      if (fieldDef && fieldDef.type === 'picklist' && PICKLISTS[fieldDef.ref]) {
        return res.json(PICKLISTS[fieldDef.ref]);
      }
      // For reference fields, return id+label from referenced table
      if (fieldDef && fieldDef.type === 'reference' && ALLOWED_TABLES.includes(fieldDef.ref)) {
        const refTable = fieldDef.ref;
        const refSchema = OBJECTS_SCHEMA[refTable];
        const labelField = refSchema ? refSchema.data.find(f => f.show === true) : null;
        const labelCol = labelField ? labelField.id : 'id';
        const [rows] = await pool.query(
          `SELECT id, ${labelCol} as value FROM ${refTable} ORDER BY ${labelCol}`
        );
        return res.json(rows.map(r => ({ id: String(r.id), value: String(r.value) })));
      }
    }

    // Default: return distinct values
    const [rows] = await pool.query(
      `SELECT DISTINCT ${field} as id, ${field} as value FROM ${table} WHERE ${field} IS NOT NULL ORDER BY ${field}`
    );
    console.log('Fetched options for', fieldParam, ':', rows.length);
    res.json(rows.map(r => ({ id: String(r.id), value: String(r.value) })));
  } catch (error) {
    console.error('Error fetching field options:', error.message);
    res.status(500).json({ error: error.message });
  }
});

// GET /api/fields/:field/suggest - Return suggestions for a field (autocomplete)
app.get('/api/fields/:field/suggest', async (req, res) => {
  try {
    const fieldParam = req.params.field;
    const parts = fieldParam.split('.');
    if (parts.length !== 2) {
      return res.status(400).json({ error: 'Invalid field format' });
    }

    const [table, field] = parts;
    if (!ALLOWED_TABLES.includes(table)) {
      return res.status(400).json({ error: `Unknown table: ${table}` });
    }

    const [rows] = await pool.query(
      `SELECT DISTINCT ${field} FROM ${table} WHERE ${field} IS NOT NULL ORDER BY ${field} LIMIT 100`
    );
    console.log('Fetched suggestions for', fieldParam, ':', rows.length);
    res.json(rows.map(r => String(r[field])));
  } catch (error) {
    console.error('Error fetching field suggestions:', error.message);
    res.status(500).json({ error: error.message });
  }
});

// ============= HELPER: Build WHERE clause from Webix Query format =============
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

    // Handle "includes" filter (picklist / multi-select)
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
      case 'notContains':
        conditions.push(`${table}.${field} NOT LIKE ?`);
        params.push(`%${filterValue}%`);
        break;
      case 'beginsWith':
        conditions.push(`${table}.${field} LIKE ?`);
        params.push(`${filterValue}%`);
        break;
      case 'endsWith':
        conditions.push(`${table}.${field} LIKE ?`);
        params.push(`%${filterValue}`);
        break;
      case 'greater':
        conditions.push(`${table}.${field} > ?`);
        params.push(filterValue);
        break;
      case 'greaterOrEqual':
        conditions.push(`${table}.${field} >= ?`);
        params.push(filterValue);
        break;
      case 'less':
        conditions.push(`${table}.${field} < ?`);
        params.push(filterValue);
        break;
      case 'lessOrEqual':
        conditions.push(`${table}.${field} <= ?`);
        params.push(filterValue);
        break;
      default:
        break;
    }
  }

  if (conditions.length === 0) return { clause: '', params: [] };
  return { clause: conditions.join(` ${glue} `), params };
}

// ============= UTILITY ENDPOINTS =============

app.get('/api/test', (req, res) => {
  res.json({ message: 'API is working!' });
});

app.get('/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// Start server
const PORT = process.env.PORT || 3200;
app.listen(PORT, () => {
  console.log(`Reports backend running on http://localhost:${PORT}`);
  console.log(`API available at http://localhost:${PORT}/api`);
});
