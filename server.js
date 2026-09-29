// ============================================================================
// SQL Learning Studio: Express & PostgreSQL Backend Server
// Multi-Chapter Selection Exam Generator & Batch Grader
// ============================================================================

const express = require('express');
const cors = require('cors');
const { Pool } = require('pg');
const fs = require('fs');
const path = require('path');
const { chapters, getCurriculum } = require('./curriculum');
const { generateAiExamPaper } = require('./ai_generator');

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

// In-memory exam store for active session verification
const activeExams = new Map();

// Helper: Normalize values for robust comparison
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

// Helper: Extract final statement result for multi-statement queries
const getFinalResult = (pgResult) => {
  if (Array.isArray(pgResult)) {
    for (let i = pgResult.length - 1; i >= 0; i--) {
      if (pgResult[i] && pgResult[i].fields && pgResult[i].fields.length > 0) {
        return pgResult[i];
      }
    }
    return pgResult[pgResult.length - 1] || { rows: [], fields: [] };
  }
  return pgResult || { rows: [], fields: [] };
};

// ----------------------------------------------------------------------------
// 1. GET /api/curriculum — Return list of topics & questions for Practice Mode
// ----------------------------------------------------------------------------
app.get('/api/curriculum', (req, res) => {
  res.json({ curriculum: getCurriculum() });
});

// ----------------------------------------------------------------------------
// 2. GET /api/chapters — List chapters for Exam Mode
// ----------------------------------------------------------------------------
app.get('/api/chapters', (req, res) => {
  const chapterList = chapters.map(ch => ({
    chapterId: ch.chapterId,
    chapterNumber: ch.chapterNumber,
    chapterTitle: ch.chapterTitle,
    description: ch.description,
    questionCount: ch.questions.length
  }));
  res.json({
    chapters: chapterList,
    aiAvailable: !!process.env.GEMINI_API_KEY
  });
});

// ----------------------------------------------------------------------------
// 3. POST /api/exam/generate — AI Dynamic Synthesis & Multi-Chapter Generator
// ----------------------------------------------------------------------------
app.post('/api/exam/generate', async (req, res) => {
  let { chapterIds, chapterId, questionCount = 5, timeMinutes = 20, difficulty = 'mixed', mode = 'ai' } = req.body;

  // Support both chapterIds (array) and legacy chapterId (string)
  let targetChapterIds = [];
  if (Array.isArray(chapterIds) && chapterIds.length > 0) {
    targetChapterIds = chapterIds;
  } else if (chapterId) {
    targetChapterIds = chapterId === 'all' ? [] : [chapterId];
  }

  let selectedChapterTitles = [];
  if (targetChapterIds.length > 0 && !targetChapterIds.includes('all')) {
    chapters.forEach(ch => {
      if (targetChapterIds.includes(ch.chapterId)) {
        selectedChapterTitles.push(ch.chapterTitle);
      }
    });
  } else {
    selectedChapterTitles = ['Comprehensive Syllabus Exam (All Chapters)'];
  }

  const countToTake = parseInt(questionCount, 10) || 5;
  const normalizedDifficulty = (difficulty || 'mixed').toLowerCase();
  let selectedQuestions = [];
  let isAiGenerated = false;

  // 1. Attempt AI Dynamic Question Synthesis (Gemini 2.5 Flash)
  if (mode !== 'curated' && process.env.GEMINI_API_KEY) {
    try {
      console.log(`[Exam Generator] Synthesizing ${countToTake} fresh AI questions (Difficulty: ${normalizedDifficulty}) for [${targetChapterIds.join(', ') || 'all'}]...`);
      const aiQuestions = await generateAiExamPaper({
        chapterIds: targetChapterIds,
        questionCount: countToTake,
        difficulty: normalizedDifficulty,
        pool
      });
      if (aiQuestions && aiQuestions.length > 0) {
        selectedQuestions = aiQuestions;
        isAiGenerated = true;
        console.log(`[Exam Generator] Successfully generated ${selectedQuestions.length} brand-new validated AI questions (${normalizedDifficulty}).`);
      }
    } catch (aiErr) {
      console.warn(`[Exam Generator] AI synthesis fallback: ${aiErr.message}`);
    }
  }

  // 2. Fallback / Curated Mode: draw from curriculum bank with difficulty filtering
  if (selectedQuestions.length < countToTake) {
    let poolOfQuestions = [];
    if (targetChapterIds.length > 0 && !targetChapterIds.includes('all')) {
      chapters.forEach(ch => {
        if (targetChapterIds.includes(ch.chapterId)) {
          poolOfQuestions.push(...ch.questions);
        }
      });
    } else {
      chapters.forEach(c => {
        poolOfQuestions.push(...c.questions);
      });
    }

    // Filter by difficulty if requested
    let diffFiltered = [];
    if (normalizedDifficulty === 'easy') {
      diffFiltered = poolOfQuestions.filter(q => q.level <= 2);
    } else if (normalizedDifficulty === 'medium') {
      diffFiltered = poolOfQuestions.filter(q => q.level === 3);
    } else if (normalizedDifficulty === 'hard') {
      diffFiltered = poolOfQuestions.filter(q => q.level >= 4);
    } else {
      diffFiltered = [...poolOfQuestions];
    }

    // If matching questions are fewer than countToTake, fallback/supplement with remaining
    const remainingPool = poolOfQuestions.filter(q => !diffFiltered.some(m => m.id === q.id));

    const shuffleArray = (arr) => {
      const shuffled = [...arr];
      for (let i = shuffled.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
      }
      return shuffled;
    };

    const shuffledMatching = shuffleArray(diffFiltered);
    const shuffledRemaining = shuffleArray(remainingPool);

    const existingIds = new Set(selectedQuestions.map(q => q.id));
    for (const q of shuffledMatching) {
      if (!existingIds.has(q.id)) {
        selectedQuestions.push(q);
        existingIds.add(q.id);
        if (selectedQuestions.length >= countToTake) break;
      }
    }

    if (selectedQuestions.length < countToTake) {
      for (const q of shuffledRemaining) {
        if (!existingIds.has(q.id)) {
          selectedQuestions.push(q);
          existingIds.add(q.id);
          if (selectedQuestions.length >= countToTake) break;
        }
      }
    }
  }

  const examId = `exam_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;
  const titleDisplay = selectedChapterTitles.length === 1
    ? selectedChapterTitles[0]
    : `${selectedChapterTitles.length} Chapters Combined (${selectedChapterTitles.map(t => t.split(':')[0]).join(', ')})`;

  // Store exam details and questions in memory for grading
  const questionsMap = new Map();
  selectedQuestions.forEach(q => questionsMap.set(q.id, q));

  activeExams.set(examId, {
    examId,
    chapterIds: targetChapterIds,
    chapterTitle: titleDisplay,
    timeMinutes: parseInt(timeMinutes, 10) || 20,
    difficulty: normalizedDifficulty,
    questionIds: selectedQuestions.map(q => q.id),
    questionsMap,
    isAiGenerated,
    createdAt: Date.now()
  });

  res.json({
    examId,
    chapterId: targetChapterIds.length === 1 ? targetChapterIds[0] : (targetChapterIds.length === 0 || targetChapterIds.includes('all') ? 'all' : 'multi'),
    chapterIds: targetChapterIds,
    chapterTitle: titleDisplay,
    timeMinutes: parseInt(timeMinutes, 10) || 20,
    difficulty: normalizedDifficulty,
    totalQuestions: selectedQuestions.length,
    isAiGenerated,
    questions: selectedQuestions.map((q, idx) => ({
      id: q.id,
      paperQuestionNumber: idx + 1,
      level: q.level,
      title: q.title,
      concept: q.concept,
      description: q.description,
      tables: q.tables,
      starterSql: q.starterSql,
      isAiGenerated: !!q.isAiGenerated
    }))
  });
});

// ----------------------------------------------------------------------------
// 4. POST /api/exam/grade — Batch Exam Grader & Diagnostic Scorecard
// ----------------------------------------------------------------------------
app.post('/api/exam/grade', async (req, res) => {
  const { examId, answers = [], timeSpentSeconds = 0 } = req.body;

  const activeExam = activeExams.get(examId);

  // Build question lookup
  const allQuestionsMap = new Map();
  chapters.forEach(c => {
    c.questions.forEach(q => {
      allQuestionsMap.set(q.id, q);
    });
  });

  if (activeExam && activeExam.questionsMap) {
    activeExam.questionsMap.forEach((q, id) => {
      allQuestionsMap.set(id, q);
    });
  }

  const questionResults = [];
  let passedCount = 0;

  for (let i = 0; i < answers.length; i++) {
    const { questionId, userQuery = '' } = answers[i];
    const targetQ = allQuestionsMap.get(questionId);

    if (!targetQ) {
      questionResults.push({
        questionId,
        questionNumber: i + 1,
        title: 'Unknown Question',
        passed: false,
        diagnostic: 'Question not found in curriculum.'
      });
      continue;
    }

    const trimmedQuery = userQuery.trim();
    if (!trimmedQuery) {
      questionResults.push({
        questionId,
        questionNumber: i + 1,
        title: targetQ.title,
        concept: targetQ.concept,
        description: targetQ.description,
        userQuery: '-- No query submitted --',
        passed: false,
        diagnostic: 'Unanswered: No SQL query was written for this question.',
        solutionQuery: targetQ.solution
      });
      continue;
    }

    try {
      const expResRaw = await pool.query(targetQ.solution);
      const expRes = getFinalResult(expResRaw);
      const expectedRows = expRes.rows || [];
      const expectedCols = expRes.fields ? expRes.fields.map(f => f.name.toLowerCase()) : [];

      let userRes;
      try {
        const userResRaw = await pool.query(trimmedQuery);
        userRes = getFinalResult(userResRaw);
      } catch (sqlErr) {
        questionResults.push({
          questionId,
          questionNumber: i + 1,
          title: targetQ.title,
          concept: targetQ.concept,
          description: targetQ.description,
          userQuery: trimmedQuery,
          passed: false,
          diagnostic: `PostgreSQL Error: ${sqlErr.message}`,
          solutionQuery: targetQ.solution
        });
        continue;
      }

      const userRows = userRes.rows || [];
      const userCols = userRes.fields ? userRes.fields.map(f => f.name.toLowerCase()) : [];

      if (userRows.length !== expectedRows.length) {
        questionResults.push({
          questionId,
          questionNumber: i + 1,
          title: targetQ.title,
          concept: targetQ.concept,
          description: targetQ.description,
          userQuery: trimmedQuery,
          passed: false,
          diagnostic: `Row count mismatch: Returned ${userRows.length} rows, expected ${expectedRows.length} rows.`,
          userRowCount: userRows.length,
          expectedRowCount: expectedRows.length,
          userSampleRows: userRows.slice(0, 5),
          expectedSampleRows: expectedRows.slice(0, 5),
          solutionQuery: targetQ.solution
        });
        continue;
      }

      if (userCols.length !== expectedCols.length) {
        questionResults.push({
          questionId,
          questionNumber: i + 1,
          title: targetQ.title,
          concept: targetQ.concept,
          description: targetQ.description,
          userQuery: trimmedQuery,
          passed: false,
          diagnostic: `Column count mismatch: Projected ${userCols.length} columns [${userCols.join(', ')}], expected ${expectedCols.length} [${expectedCols.join(', ')}].`,
          userCols,
          expectedCols,
          solutionQuery: targetQ.solution
        });
        continue;
      }

      let userNorm = userRows.map(normalizeRow);
      let expNorm = expectedRows.map(normalizeRow);

      if (!targetQ.orderMatters) {
        const str = r => JSON.stringify(r);
        userNorm = userNorm.map(str).sort();
        expNorm = expNorm.map(str).sort();
      } else {
        userNorm = userNorm.map(r => JSON.stringify(r));
        expNorm = expNorm.map(r => JSON.stringify(r));
      }

      let isMatch = true;
      for (let k = 0; k < expNorm.length; k++) {
        if (userNorm[k] !== expNorm[k]) {
          isMatch = false;
          break;
        }
      }

      if (!isMatch) {
        questionResults.push({
          questionId,
          questionNumber: i + 1,
          title: targetQ.title,
          concept: targetQ.concept,
          description: targetQ.description,
          userQuery: trimmedQuery,
          passed: false,
          diagnostic: targetQ.orderMatters
            ? 'Order / Value mismatch: Rows or sorting do not match canonical answer.'
            : 'Data value mismatch: Rows contain different values from canonical answer.',
          userSampleRows: userRows.slice(0, 5),
          expectedSampleRows: expectedRows.slice(0, 5),
          solutionQuery: targetQ.solution
        });
      } else {
        passedCount++;
        questionResults.push({
          questionId,
          questionNumber: i + 1,
          title: targetQ.title,
          concept: targetQ.concept,
          description: targetQ.description,
          userQuery: trimmedQuery,
          passed: true,
          diagnostic: '✓ Correct! Query produced the exact required result set.',
          userRowCount: userRows.length,
          userSampleRows: userRows.slice(0, 5),
          solutionQuery: targetQ.solution
        });
      }
    } catch (err) {
      questionResults.push({
        questionId,
        questionNumber: i + 1,
        title: targetQ.title,
        concept: targetQ.concept,
        userQuery: trimmedQuery,
        passed: false,
        diagnostic: `Evaluation Error: ${err.message}`,
        solutionQuery: targetQ.solution
      });
    }
  }

  const totalQuestions = answers.length;
  const scorePercentage = totalQuestions > 0 ? Math.round((passedCount / totalQuestions) * 100) : 0;

  let letterGrade = 'F';
  if (scorePercentage >= 95) letterGrade = 'A+';
  else if (scorePercentage >= 90) letterGrade = 'A';
  else if (scorePercentage >= 85) letterGrade = 'B+';
  else if (scorePercentage >= 80) letterGrade = 'B';
  else if (scorePercentage >= 70) letterGrade = 'C';
  else if (scorePercentage >= 60) letterGrade = 'D';

  res.json({
    examId,
    difficulty: (activeExam && activeExam.difficulty) || 'mixed',
    totalQuestions,
    passedCount,
    failedCount: totalQuestions - passedCount,
    scorePercentage,
    letterGrade,
    timeSpentSeconds,
    results: questionResults,
    questionResults
  });
});

// ----------------------------------------------------------------------------
// 5. GET /api/tables — Live schema metadata
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

      const colsQuery = `
        SELECT column_name, data_type, is_nullable, column_default
        FROM information_schema.columns
        WHERE table_schema = 'public' AND table_name = $1
        ORDER BY ordinal_position;
      `;
      const colsRes = await pool.query(colsQuery, [tableName]);

      const pkQuery = `
        SELECT kcu.column_name
        FROM information_schema.table_constraints tc
        JOIN information_schema.key_column_usage kcu
          ON tc.constraint_name = kcu.constraint_name
        WHERE tc.table_schema = 'public' AND tc.table_name = $1 AND tc.constraint_type = 'PRIMARY KEY';
      `;
      const pkRes = await pool.query(pkQuery, [tableName]);
      const pks = pkRes.rows.map(r => r.column_name);

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
// 6. GET /api/table/:tableName — Preview rows of any table
// ----------------------------------------------------------------------------
app.get('/api/table/:tableName', async (req, res) => {
  const { tableName } = req.params;
  try {
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
// 7. POST /api/execute — Execute arbitrary SQL query in Scratchpad
// ----------------------------------------------------------------------------
app.post('/api/execute', async (req, res) => {
  const { query } = req.body;
  if (!query || typeof query !== 'string') {
    return res.status(400).json({ error: 'No SQL query provided.' });
  }

  const start = process.hrtime();
  try {
    const rawResult = await pool.query(query);
    const result = getFinalResult(rawResult);
    const diff = process.hrtime(start);
    const executionTimeMs = (diff[0] * 1000 + diff[1] / 1e6).toFixed(2);

    if (!result.fields || result.fields.length === 0) {
      return res.json({
        columns: [],
        rows: result.rows || [],
        rowCount: result.rowCount || 0,
        command: result.command || 'QUERY',
        executionTimeMs
      });
    }

    res.json({
      columns: result.fields.map(f => f.name),
      rows: result.rows || [],
      rowCount: result.rowCount || (result.rows ? result.rows.length : 0),
      command: result.command || 'SELECT',
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
// 8. POST /api/validate — Single Question Grader for Practice Mode
// ----------------------------------------------------------------------------
app.post('/api/validate', async (req, res) => {
  const { questionId, userQuery } = req.body;
  if (!questionId || !userQuery) {
    return res.status(400).json({ error: 'questionId and userQuery are required.' });
  }

  let targetQuestion = null;
  for (const ch of chapters) {
    const found = ch.questions.find(q => q.id === questionId);
    if (found) {
      targetQuestion = found;
      break;
    }
  }

  if (!targetQuestion) {
    return res.status(404).json({ error: `Question '${questionId}' not found.` });
  }

  try {
    const expectedResRaw = await pool.query(targetQuestion.solution);
    const expectedRes = getFinalResult(expectedResRaw);
    const expectedRows = expectedRes.rows || [];
    const expectedCols = expectedRes.fields ? expectedRes.fields.map(f => f.name.toLowerCase()) : [];

    let userRes;
    try {
      const userResRaw = await pool.query(userQuery);
      userRes = getFinalResult(userResRaw);
    } catch (err) {
      return res.json({
        passed: false,
        error: err.message,
        diagnostic: `PostgreSQL Syntax/Execution Error: ${err.message}`,
        hint: err.hint || 'Check for missing commas, misspelled column names, or incorrect quotation marks.'
      });
    }

    const userRows = userRes.rows || [];
    const userCols = userRes.fields ? userRes.fields.map(f => f.name.toLowerCase()) : [];

    if (userRows.length !== expectedRows.length) {
      return res.json({
        passed: false,
        diagnostic: `Row count mismatch: Your query returned ${userRows.length} rows, but expected ${expectedRows.length} rows.`,
        hint: 'Review your WHERE filter conditions or JOIN ON clauses to ensure only qualifying records are included.',
        userRowCount: userRows.length,
        expectedRowCount: expectedRows.length
      });
    }

    if (userCols.length !== expectedCols.length) {
      return res.json({
        passed: false,
        diagnostic: `Column count mismatch: Your query projected ${userCols.length} column(s) [${userCols.join(', ')}], but expected ${expectedCols.length} column(s) [${expectedCols.join(', ')}].`,
        hint: `Make sure you are selecting the exact requested columns in the SELECT clause.`,
        userCols,
        expectedCols
      });
    }

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
// 9. POST /api/solution — Reveal solution for a question
// ----------------------------------------------------------------------------
app.post('/api/solution', (req, res) => {
  const { questionId } = req.body;
  // Check active exams for dynamic AI-generated questions
  for (const [examId, exam] of activeExams.entries()) {
    if (exam.questionsMap && exam.questionsMap.has(questionId)) {
      const found = exam.questionsMap.get(questionId);
      return res.json({ solution: found.solution, solutionQuery: found.solution, concept: found.concept });
    }
  }
  for (const ch of chapters) {
    const found = ch.questions.find(q => q.id === questionId);
    if (found) {
      return res.json({ solution: found.solution, solutionQuery: found.solution, concept: found.concept });
    }
  }
  res.status(404).json({ error: 'Question not found' });
});

// ----------------------------------------------------------------------------
// 10. POST /api/reset — 1-Click Database Reset
// ----------------------------------------------------------------------------
app.post('/api/reset', async (req, res) => {
  try {
    const schemaSql = fs.readFileSync(path.join(__dirname, 'database', 'schema.sql'), 'utf8');
    const seedSql = fs.readFileSync(path.join(__dirname, 'database', 'seed.sql'), 'utf8');

    await pool.query(schemaSql);
    await pool.query(seedSql);

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
