// ============================================================================
// SQL Learning Studio: Express & PostgreSQL Backend Server
// ============================================================================

const express = require('express');
const cors = require('cors');
const { Pool } = require('pg');
const fs = require('fs');
const path = require('path');
const curriculum = require('./curriculum');

const app = express();
const PORT = process.env.PORT || 3000;
const DB_NAME = process.env.PGDATABASE || 'sql_practice';

// PostgreSQL connection pool
const pool = new Pool({
  database: DB_NAME,
  host: process.env.PGHOST || 'localhost',
  port: process.env.PGPORT || 5432,
  user: process.env.PGUSER || process.env.USER || 'zayan'
});

app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

// ----------------------------------------------------------------------------
// 1. GET /api/curriculum — Return list of topics and questions
// ----------------------------------------------------------------------------
app.get('/api/curriculum', (req, res) => {
  // Map curriculum without exposing solution directly to client by default
  const sanitized = curriculum.map(topic => ({
    topicId: topic.topicId,
    topicTitle: topic.topicTitle,
    description: topic.description,
    questions: topic.questions.map(q => ({
      id: q.id,
      number: q.number,
      level: q.level,
      title: q.title,
      concept: q.concept,
      description: q.description,
      tables: q.tables,
      starterSql: q.starterSql,
      hint1: q.hint1,
      hint2: q.hint2,
      hint3: q.hint3,
      hasSolution: true
    }))
  }));
  res.json({ curriculum: sanitized });
});

// ----------------------------------------------------------------------------
// 2. GET /api/tables — Live schema metadata (Columns, Types, Keys, Counts)
// ----------------------------------------------------------------------------
app.get('/api/tables', async (req, res) => {
  try {
    const tablesQuery = `
      SELECT table_name
      FROM information_schema.tables
      WHERE table_schema = 'public' AND table_type = 'BASE TABLE'
      ORDER BY table_name;
    `;
    const tablesRes = await pool.query(tablesQuery);

    const tables = [];
    for (const row of tablesRes.rows) {
      const tableName = row.table_name;

      // Get columns and types
      const colsQuery = `
        SELECT column_name, data_type, is_nullable, column_default
        FROM information_schema.columns
        WHERE table_schema = 'public' AND table_name = $1
        ORDER BY ordinal_position;
      `;
      const colsRes = await pool.query(colsQuery, [tableName]);

      // Get Primary Key columns
      const pkQuery = `
        SELECT kcu.column_name
        FROM information_schema.table_constraints tc
        JOIN information_schema.key_column_usage kcu
          ON tc.constraint_name = kcu.constraint_name
        WHERE tc.table_schema = 'public' AND tc.table_name = $1 AND tc.constraint_type = 'PRIMARY KEY';
      `;
      const pkRes = await pool.query(pkQuery, [tableName]);
      const pks = pkRes.rows.map(r => r.column_name);

      // Get Foreign Key references
      const fkQuery = `
        SELECT
          kcu.column_name,
          ccu.table_name AS foreign_table_name,
          ccu.column_name AS foreign_column_name
        FROM information_schema.table_constraints AS tc
        JOIN information_schema.key_column_usage AS kcu
          ON tc.constraint_name = kcu.constraint_name
        JOIN information_schema.constraint_column_usage AS ccu
          ON ccu.constraint_name = tc.constraint_name
        WHERE tc.constraint_type = 'FOREIGN KEY' AND tc.table_name = $1;
      `;
      const fkRes = await pool.query(fkQuery, [tableName]);
      const fks = fkRes.rows;

      // Row count
      const countRes = await pool.query(`SELECT count(*)::int AS count FROM "${tableName}"`);

      tables.push({
        name: tableName,
        rowCount: countRes.rows[0].count,
        columns: colsRes.rows.map(c => ({
          name: c.column_name,
          type: c.data_type,
          nullable: c.is_nullable === 'YES',
          isPk: pks.includes(c.column_name),
          fk: fks.find(f => f.column_name === c.column_name) || null
        }))
      });
    }

    res.json({ tables });
  } catch (err) {
    console.error('Error fetching tables schema:', err);
    res.status(500).json({ error: err.message });
  }
});

// ----------------------------------------------------------------------------
// 3. GET /api/table/:tableName — Preview rows of any table
// ----------------------------------------------------------------------------
app.get('/api/table/:tableName', async (req, res) => {
  const { tableName } = req.params;
  try {
    // Validate table exists to prevent injection
    const check = await pool.query(
      `SELECT table_name FROM information_schema.tables WHERE table_schema = 'public' AND table_name = $1`,
      [tableName]
    );
    if (check.rows.length === 0) {
      return res.status(404).json({ error: `Table '${tableName}' not found.` });
    }

    const start = process.hrtime();
    const result = await pool.query(`SELECT * FROM "${tableName}" LIMIT 50`);
    const diff = process.hrtime(start);
    const executionTimeMs = (diff[0] * 1000 + diff[1] / 1e6).toFixed(2);

    res.json({
      tableName,
      columns: result.fields.map(f => f.name),
      rows: result.rows,
      rowCount: result.rowCount,
      executionTimeMs
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ----------------------------------------------------------------------------
// 4. POST /api/execute — Execute arbitrary SQL and return results
// ----------------------------------------------------------------------------
app.post('/api/execute', async (req, res) => {
  const { query } = req.body;
  if (!query || typeof query !== 'string') {
    return res.status(400).json({ error: 'No SQL query provided.' });
  }

  const start = process.hrtime();
  try {
    const result = await pool.query(query);
    const diff = process.hrtime(start);
    const executionTimeMs = (diff[0] * 1000 + diff[1] / 1e6).toFixed(2);

    // If command is INSERT/UPDATE/DELETE with no RETURNING
    if (!result.fields) {
      return res.json({
        columns: [],
        rows: [],
        rowCount: result.rowCount || 0,
        command: result.command,
        executionTimeMs
      });
    }

    res.json({
      columns: result.fields.map(f => f.name),
      rows: result.rows,
      rowCount: result.rowCount,
      command: result.command,
      executionTimeMs
    });
  } catch (err) {
    const diff = process.hrtime(start);
    const executionTimeMs = (diff[0] * 1000 + diff[1] / 1e6).toFixed(2);
    res.status(400).json({
      error: err.message,
      detail: err.detail,
      hint: err.hint,
      position: err.position,
      executionTimeMs
    });
  }
});

// ----------------------------------------------------------------------------
// 5. POST /api/validate — Automated Query Grader & Diagnostic Evaluator
// ----------------------------------------------------------------------------
app.post('/api/validate', async (req, res) => {
  const { questionId, userQuery } = req.body;
  if (!questionId || !userQuery) {
    return res.status(400).json({ error: 'questionId and userQuery are required.' });
  }

  // Find question
  let targetQuestion = null;
  for (const topic of curriculum) {
    const found = topic.questions.find(q => q.id === questionId);
    if (found) {
      targetQuestion = found;
      break;
    }
  }

  if (!targetQuestion) {
    return res.status(404).json({ error: `Question '${questionId}' not found in curriculum.` });
  }

  try {
    // 1. Run canonical solution
    const expectedRes = await pool.query(targetQuestion.solution);
    const expectedRows = expectedRes.rows;
    const expectedCols = expectedRes.fields.map(f => f.name.toLowerCase());

    // 2. Run user query
    let userRes;
    try {
      userRes = await pool.query(userQuery);
    } catch (err) {
      return res.json({
        passed: false,
        error: err.message,
        diagnostic: `PostgreSQL Syntax/Execution Error: ${err.message}`,
        hint: err.hint || 'Check for missing commas, misspelled column names, or incorrect quotation marks.'
      });
    }

    const userRows = userRes.rows;
    const userCols = userRes.fields ? userRes.fields.map(f => f.name.toLowerCase()) : [];

    // Check Row Count
    if (userRows.length !== expectedRows.length) {
      return res.json({
        passed: false,
        diagnostic: `Row count mismatch: Your query returned ${userRows.length} rows, but expected ${expectedRows.length} rows.`,
        hint: 'Review your WHERE filter conditions or JOIN ON clauses to ensure only qualifying records are included.',
        userRowCount: userRows.length,
        expectedRowCount: expectedRows.length
      });
    }

    // Check Column Count
    if (userCols.length !== expectedCols.length) {
      return res.json({
        passed: false,
        diagnostic: `Column count mismatch: Your query projected ${userCols.length} column(s) [${userCols.join(', ')}], but expected ${expectedCols.length} column(s) [${expectedCols.join(', ')}].`,
        hint: `Make sure you are selecting the exact requested columns in the SELECT clause.`,
        userCols,
        expectedCols
      });
    }

    // Normalize & Deep Compare Rows
    const normalizeVal = (val) => {
      if (val === null || val === undefined) return null;
      if (typeof val === 'number') return Math.round(val * 100) / 100;
      if (typeof val === 'string') {
        const num = parseFloat(val);
        if (!isNaN(num) && String(num) === val.trim()) return Math.round(num * 100) / 100;
        return val.trim();
      }
      return String(val);
    };

    const normalizeRow = (row) => {
      const keys = Object.keys(row).sort();
      return keys.map(k => normalizeVal(row[k]));
    };

    let userNormalized = userRows.map(normalizeRow);
    let expectedNormalized = expectedRows.map(normalizeRow);

    if (!targetQuestion.orderMatters) {
      const rowToString = (r) => JSON.stringify(r);
      userNormalized = userNormalized.map(rowToString).sort();
      expectedNormalized = expectedNormalized.map(rowToString).sort();
    } else {
      userNormalized = userNormalized.map(r => JSON.stringify(r));
      expectedNormalized = expectedNormalized.map(r => JSON.stringify(r));
    }

    let isMatch = true;
    for (let i = 0; i < expectedNormalized.length; i++) {
      if (userNormalized[i] !== expectedNormalized[i]) {
        isMatch = false;
        break;
      }
    }

    if (!isMatch) {
      return res.json({
        passed: false,
        diagnostic: targetQuestion.orderMatters
          ? 'Row data or sort order mismatch. The returned values or ordering do not match the expected result set.'
          : 'Data content mismatch. The returned rows contain different values from the expected result set.',
        hint: 'Double check calculation formulas, string casing, or comparison operators.'
      });
    }

    // PASSED!
    res.json({
      passed: true,
      diagnostic: '🎉 Excellent! Your query returned the exact expected result set and satisfied all constraints.',
      concept: targetQuestion.concept,
      solutionQuery: targetQuestion.solution
    });

  } catch (err) {
    console.error('Validation error:', err);
    res.status(500).json({ error: err.message });
  }
});

// ----------------------------------------------------------------------------
// 6. POST /api/solution — Reveal solution for a question
// ----------------------------------------------------------------------------
app.post('/api/solution', (req, res) => {
  const { questionId } = req.body;
  for (const topic of curriculum) {
    const found = topic.questions.find(q => q.id === questionId);
    if (found) {
      return res.json({ solution: found.solution, concept: found.concept });
    }
  }
  res.status(404).json({ error: 'Question not found' });
});

// ----------------------------------------------------------------------------
// 7. POST /api/reset — 1-Click Database Schema & Seed Restoration
// ----------------------------------------------------------------------------
app.post('/api/reset', async (req, res) => {
  try {
    const schemaSql = fs.readFileSync(path.join(__dirname, 'database', 'schema.sql'), 'utf8');
    const seedSql = fs.readFileSync(path.join(__dirname, 'database', 'seed.sql'), 'utf8');

    await pool.query(schemaSql);
    await pool.query(seedSql);

    // Fetch refreshed counts
    const countRes = await pool.query(`
      SELECT 'departments' AS table_name, count(*) FROM departments
      UNION ALL SELECT 'instructors', count(*) FROM instructors
      UNION ALL SELECT 'students', count(*) FROM students
      UNION ALL SELECT 'courses', count(*) FROM courses
      UNION ALL SELECT 'sections', count(*) FROM sections
      UNION ALL SELECT 'enrollments', count(*) FROM enrollments
      UNION ALL SELECT 'grades', count(*) FROM grades;
    `);

    res.json({
      success: true,
      message: 'Database sql_practice has been cleanly reset and re-seeded.',
      counts: countRes.rows
    });
  } catch (err) {
    console.error('Error resetting database:', err);
    res.status(500).json({ error: err.message });
  }
});

// Start Server
app.listen(PORT, () => {
  console.log(`=======================================================`);
  console.log(`🚀 SQL Learning Studio running at: http://localhost:${PORT}`);
  console.log(`Connected to PostgreSQL database: ${DB_NAME}`);
  console.log(`=======================================================`);
});
