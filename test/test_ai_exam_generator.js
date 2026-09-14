// ============================================================================
// Automated Test Suite for Gemini 2.5 Flash Dynamic AI Exam Engine
// ============================================================================

const assert = require('assert');
const { Pool } = require('pg');

const pool = new Pool({
  host: process.env.PG_HOST || 'localhost',
  port: parseInt(process.env.PG_PORT || '5432', 10),
  database: process.env.PG_DATABASE || 'sql_practice',
  user: process.env.PG_USER || 'zayan',
  password: process.env.PG_PASSWORD || ''
});

async function runAiTests() {
  console.log('🤖 Starting Gemini 2.5 Flash Dynamic AI Exam Engine Test Suite...\n');

  const BASE_URL = 'http://localhost:3000';

  // Test 1: Direct Backend AI Generator Module
  console.log('Test 1: Direct invocation of generateAiExamPaper()...');
  const { generateAiExamPaper } = require('../ai_generator');
  
  const aiQuestions = await generateAiExamPaper({
    chapterIds: ['ch3_5_subqueries'],
    questionCount: 3,
    pool
  });

  assert(Array.isArray(aiQuestions), 'Result should be an array of questions');
  assert(aiQuestions.length > 0, 'Should synthesize at least 1 validated question');
  console.log(`  ✓ Successfully synthesized ${aiQuestions.length} brand-new questions for Chapter 3.5 Nested Subqueries`);
  for (const q of aiQuestions) {
    assert.strictEqual(q.isAiGenerated, true);
    console.log(`    • [${q.id}] Level ${q.level} - "${q.title}" (Concept: ${q.concept})`);
  }

  // Test 2: Pre-execution and Schema Verification of AI generated solutions
  console.log('\nTest 2: Verifying that all generated canonical solutions execute cleanly against PostgreSQL...');
  for (const q of aiQuestions) {
    const dbRes = await pool.query(q.solution);
    assert(Array.isArray(dbRes.rows), `Query for ${q.id} must return valid rows array`);
    console.log(`    ✓ ${q.id}: PostgreSQL executed canonical SQL in ${dbRes.rowCount} rows without error.`);
  }

  // Test 3: HTTP API /api/exam/generate with AI mode
  console.log('\nTest 3: Testing POST /api/exam/generate with mode: "ai"...');
  const genRes = await fetch(`${BASE_URL}/api/exam/generate`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      chapterIds: ['ch3_3_group_by', 'ch3_4_joins'],
      questionCount: 4,
      timeMinutes: 20,
      mode: 'ai'
    })
  });

  assert.strictEqual(genRes.status, 200, 'HTTP status should be 200');
  const examData = await genRes.json();
  assert(examData.examId, 'Exam should have a unique examId');
  assert(examData.isAiGenerated === true, 'isAiGenerated should be true');
  assert.strictEqual(examData.questions.length, 4, 'Should contain 4 questions');
  console.log(`  ✓ API generated AI exam ${examData.examId} for [${examData.chapterTitle}] with ${examData.questions.length} questions`);

  // Test 4: End-to-End Grading of AI Exam
  console.log('\nTest 4: Grading AI-generated exam via /api/exam/grade...');
  const firstQ = examData.questions[0];
  
  // Get canonical solution from server via /api/solution to test perfect grade on 1st question
  const solRes = await fetch(`${BASE_URL}/api/solution`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ questionId: firstQ.id, examId: examData.examId })
  });
  const solData = await solRes.json();
  assert(solData.solutionQuery, 'Solution query should be returned for AI question');
  console.log(`  ✓ Retrieved canonical solution for ${firstQ.id}: "${solData.solutionQuery.substring(0, 40)}..."`);

  const userAnswers = [
    {
      questionId: firstQ.id,
      userQuery: solData.solutionQuery
    }
  ];
  for (let i = 1; i < examData.questions.length; i++) {
    userAnswers.push({
      questionId: examData.questions[i].id,
      userQuery: 'SELECT 1;' // Deliberate wrong answer
    });
  }

  const gradeRes = await fetch(`${BASE_URL}/api/exam/grade`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      examId: examData.examId,
      timeSpentSeconds: 180,
      answers: userAnswers
    })
  });

  assert.strictEqual(gradeRes.status, 200);
  const gradeData = await gradeRes.json();
  assert.strictEqual(gradeData.totalQuestions, 4);
  assert(gradeData.passedCount >= 1, 'At least first question should pass');
  assert.strictEqual(gradeData.results[0].passed, true, 'First question should pass with canonical answer');
  console.log(`  ✓ Grading completed! Score: ${gradeData.scorePercentage}% | Grade: ${gradeData.letterGrade} | Passed: ${gradeData.passedCount}/${gradeData.totalQuestions}`);

  console.log('\n========================================================================');
  console.log('✨ ALL AI DYNAMIC EXAM TESTS PASSED WITH 100% SUCCESS!');
  console.log('========================================================================\n');
  await pool.end();
}

runAiTests().catch(err => {
  console.error('❌ AI Exam Test Suite Failed:', err);
  process.exit(1);
});
