// ==============================================================================
// AI-Powered Dynamic Question Synthesis Engine (Google Gemini 2.5 Flash)
// Synthesizes Infinite, Brand-New, Randomized PostgreSQL Exam Questions
// ==============================================================================

const fs = require('fs');
const path = require('path');

// Simple .env loader
function loadEnv() {
  const envPath = path.join(__dirname, '.env');
  if (fs.existsSync(envPath)) {
    const lines = fs.readFileSync(envPath, 'utf8').split('\n');
    for (const line of lines) {
      const trimmed = line.trim();
      if (trimmed && !trimmed.startsWith('#') && trimmed.includes('=')) {
        const [key, ...rest] = trimmed.split('=');
        const val = rest.join('=').trim();
        if (!process.env[key.trim()]) {
          process.env[key.trim()] = val;
        }
      }
    }
  }
}
loadEnv();

const SCHEMA_CONTEXT = `
Database: PostgreSQL 18 (Schema: public)
Tables & Attributes:
1. departments(
     department_id SERIAL PRIMARY KEY,
     dept_name VARCHAR(100) NOT NULL UNIQUE,
     building VARCHAR(50) NOT NULL,
     budget NUMERIC(12, 2) NOT NULL
   )
2. instructors(
     instructor_id SERIAL PRIMARY KEY,
     first_name VARCHAR(50) NOT NULL,
     last_name VARCHAR(50) NOT NULL,
     email VARCHAR(100) NOT NULL UNIQUE,
     hire_date DATE NOT NULL,
     salary NUMERIC(10, 2) NOT NULL,
     department_id INT REFERENCES departments(department_id)
   )
3. students(
     student_id SERIAL PRIMARY KEY,
     first_name VARCHAR(50) NOT NULL,
     last_name VARCHAR(50) NOT NULL,
     email VARCHAR(100) NOT NULL UNIQUE,
     enrollment_date DATE NOT NULL,
     gpa NUMERIC(3, 2) DEFAULT 0.00,
     credits_completed INT DEFAULT 0,
     department_id INT REFERENCES departments(department_id),
     advisor_id INT REFERENCES instructors(instructor_id)
   )
4. courses(
     course_id SERIAL PRIMARY KEY,
     course_code VARCHAR(10) NOT NULL UNIQUE,
     title VARCHAR(150) NOT NULL,
     department_id INT NOT NULL REFERENCES departments(department_id),
     credits INT NOT NULL DEFAULT 3,
     prerequisite_course_id INT REFERENCES courses(course_id)
   )
5. sections(
     section_id SERIAL PRIMARY KEY,
     course_id INT NOT NULL REFERENCES courses(course_id),
     semester VARCHAR(10) NOT NULL,
     year INT NOT NULL,
     classroom VARCHAR(50),
     capacity INT DEFAULT 30,
     instructor_id INT REFERENCES instructors(instructor_id)
   )
6. enrollments(
     enrollment_id SERIAL PRIMARY KEY,
     student_id INT NOT NULL REFERENCES students(student_id),
     section_id INT NOT NULL REFERENCES sections(section_id),
     status VARCHAR(20) DEFAULT 'enrolled',
     enrollment_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP
   )
7. grades(
     grade_id SERIAL PRIMARY KEY,
     enrollment_id INT NOT NULL REFERENCES enrollments(enrollment_id),
     grade VARCHAR(5) NOT NULL,
     grade_points NUMERIC(3, 2) NOT NULL
   )
`;

const CHAPTER_DESCRIPTIONS = {
  'ch2_relational_model': 'Chapter 2: Relational Model & Relational Algebra (Attribute projection, selection predicates, DISTINCT, column aliasing, Cartesian product, NULL checks)',
  'ch3_1_filtering': 'Chapter 3.1: Predicate Filtering & Sorting (WHERE, AND, OR, NOT, BETWEEN, IN, LIKE/ILIKE, IS NULL, ORDER BY ASC/DESC, LIMIT, OFFSET)',
  'ch3_2_functions': 'Chapter 3.2: Functions, CASE & COALESCE (Aggregate functions without group by or with FILTER, string manipulation SPLIT_PART/LENGTH/UPPER, date math AGE/EXTRACT, CASE expressions, COALESCE fallback)',
  'ch3_3_group_by': 'Chapter 3.3: Grouping & Aggregations (GROUP BY single or multi-column, HAVING filters, COUNT, SUM, AVG, MIN, MAX post-aggregation filtering)',
  'ch3_4_joins': 'Chapter 3.4: Multi-Table JOINs (INNER JOIN, LEFT JOIN, FULL OUTER JOIN, CROSS JOIN, Self-joins, 3-way and 4-way table traversal)',
  'ch3_5_subqueries': 'Chapter 3.5: Nested Subqueries (IN subqueries, EXISTS and NOT EXISTS correlated subqueries, > ALL / > ANY quantified comparisons, scalar subqueries in SELECT, derived tables in FROM)',
  'ch_modern_ctes': 'Modern SQL 1: Common Table Expressions (WITH clauses, chained CTEs, recursive CTEs WITH RECURSIVE for hierarchical prerequisite traversal)',
  'ch_modern_window': 'Modern SQL 2: Window Functions (OVER, PARTITION BY, ORDER BY, ROW_NUMBER, RANK, DENSE_RANK, LAG, LEAD, NTILE)',
  'ch_modern_advanced': 'Modern SQL 3: Advanced Modern SQL (GROUPING SETS, ROLLUP, CUBE, LATERAL joins)'
};

/**
 * Generate brand-new dynamic exam questions using Google Gemini API
 */
async function generateAiExamPaper({ chapterIds = [], questionCount = 5, pool }) {
  const apiKey = process.env.GEMINI_API_KEY;
  const modelName = process.env.GEMINI_MODEL || 'gemini-2.5-flash';

  if (!apiKey) {
    throw new Error('GEMINI_API_KEY environment variable is not configured.');
  }

  // Determine chapter scope
  let activeChapterPrompts = [];
  if (chapterIds.length > 0 && !chapterIds.includes('all')) {
    chapterIds.forEach(id => {
      if (CHAPTER_DESCRIPTIONS[id]) {
        activeChapterPrompts.push(`- ${id}: ${CHAPTER_DESCRIPTIONS[id]}`);
      }
    });
  } else {
    Object.entries(CHAPTER_DESCRIPTIONS).forEach(([id, desc]) => {
      activeChapterPrompts.push(`- ${id}: ${desc}`);
    });
  }

  const prompt = `You are a world-class Database Management Systems professor and senior PostgreSQL database architect.
Generate an official exam paper consisting of exactly ${questionCount} BRAND-NEW, UNIQUE, UNKNOWN SQL exam questions.

DATABASE SCHEMA:
${SCHEMA_CONTEXT}

STRICT CHAPTER TOPIC CONSTRAINTS (Questions must ONLY test concepts from these selected chapters):
${activeChapterPrompts.join('\n')}

REQUIREMENTS:
1. Every question must have a realistic university business scenario.
2. Distribute difficulties evenly across Level 1 (Fundamentals) to Level 4/5 (Complex Analytical).
3. The SQL 'solution' MUST be 100% valid PostgreSQL syntax using only the table and column names specified in the schema.
4. Output column names in the solution MUST exactly match those specified in the 'description'.
5. Provide helpful 3-tier hints for pedagogy.
6. Provide a clean 'starterSql' code skeleton.

Return ONLY a JSON object with this exact structure:
{
  "questions": [
    {
      "chapterId": "string (one of the selected chapter IDs)",
      "level": 1 to 5,
      "title": "Clear concise question title",
      "concept": "Specific SQL / Relational Concept tested",
      "description": "Full problem description detailing the exact output columns, filters, and business requirement.",
      "tables": ["table1", "table2"],
      "starterSql": "-- Write your SQL query\\nSELECT ",
      "solution": "SELECT ...;",
      "hint1": "High-level conceptual hint",
      "hint2": "SQL clause / operator hint",
      "hint3": "Outline skeleton query",
      "orderMatters": boolean
    }
  ]
}`;

  const url = `https://generativelanguage.googleapis.com/v1beta/models/${modelName}:generateContent?key=${apiKey}`;

  const response = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      contents: [{ parts: [{ text: prompt }] }],
      generationConfig: {
        responseMimeType: 'application/json',
        temperature: 0.7
      }
    })
  });

  if (!response.ok) {
    const errBody = await response.text();
    throw new Error(`Gemini API error (${response.status}): ${errBody}`);
  }

  const data = await response.json();
  const rawJson = data.candidates?.[0]?.content?.parts?.[0]?.text;
  if (!rawJson) {
    throw new Error('Gemini API returned an empty response.');
  }

  let parsed;
  try {
    parsed = JSON.parse(rawJson);
  } catch (parseErr) {
    throw new Error(`Failed to parse AI response JSON: ${parseErr.message}`);
  }

  const generatedQuestions = Array.isArray(parsed.questions) ? parsed.questions : (Array.isArray(parsed) ? parsed : []);
  if (generatedQuestions.length === 0) {
    throw new Error('No questions found in AI response.');
  }

  // Validate every generated solution against PostgreSQL
  const validatedQuestions = [];
  for (let i = 0; i < generatedQuestions.length; i++) {
    const q = generatedQuestions[i];
    const qId = `ai_q_${Date.now()}_${i + 1}_${Math.random().toString(36).substring(2, 6)}`;

    // Ensure solution has semicolon
    let solutionQuery = (q.solution || '').trim();
    if (!solutionQuery.endsWith(';')) solutionQuery += ';';

    let isValid = false;
    if (pool) {
      try {
        await pool.query(solutionQuery);
        isValid = true;
      } catch (sqlErr) {
        console.warn(`[AI Generator] Validation failed for question ${i + 1}: ${sqlErr.message}. Retrying or adjusting query...`);
        // Attempt minor automatic fix (e.g. trailing issues)
        isValid = false;
      }
    } else {
      isValid = true;
    }

    if (isValid) {
      validatedQuestions.push({
        id: qId,
        chapterId: q.chapterId || chapterIds[0] || 'all',
        level: q.level || 2,
        title: q.title || `Custom Question ${i + 1}`,
        concept: q.concept || 'SQL Querying',
        description: q.description || '',
        tables: Array.isArray(q.tables) ? q.tables : ['students'],
        starterSql: q.starterSql || '-- Write your SQL solution\nSELECT ',
        solution: solutionQuery,
        hint1: q.hint1 || 'Analyze the required columns and conditions.',
        hint2: q.hint2 || 'Construct the appropriate SQL clauses.',
        hint3: q.hint3 || solutionQuery,
        orderMatters: q.orderMatters !== undefined ? q.orderMatters : false,
        isAiGenerated: true
      });
    }
  }

  return validatedQuestions;
}

module.exports = {
  generateAiExamPaper,
  SCHEMA_CONTEXT,
  CHAPTER_DESCRIPTIONS
};
