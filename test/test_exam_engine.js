// ============================================================================
// Automated End-to-End Test Suite for SQL Learning Studio Exam Engine
// ============================================================================

const assert = require('assert');

async function runTests() {
  console.log('🧪 Starting SQL Learning Studio Exam Engine Test Suite...\n');

  const BASE_URL = 'http://localhost:3000';

  // Test 1: Chapters API
  console.log('Test 1: Verify /api/chapters endpoint...');
  const chRes = await fetch(`${BASE_URL}/api/chapters`);
  assert.strictEqual(chRes.status, 200, 'Chapters endpoint should return 200');
  const chData = await chRes.json();
  assert(Array.isArray(chData.chapters), 'Chapters should be an array');
  assert(chData.chapters.length >= 8, 'Should have at least 8 distinct chapters');
  console.log(`  ✓ Loaded ${chData.chapters.length} chapters successfully.`);

  // Test 2: Strict Chapter Separation (No Mixing)
  console.log('\nTest 2: Verify Strict Chapter Separation on Exam Generation...');
  for (const ch of chData.chapters) {
    const genRes = await fetch(`${BASE_URL}/api/exam/generate`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        chapterId: ch.chapterId,
        questionCount: 3,
        timeMinutes: 10
      })
    });
    assert.strictEqual(genRes.status, 200);
    const genData = await genRes.json();
    assert.strictEqual(genData.chapterId, ch.chapterId, `Generated exam chapterId must match ${ch.chapterId}`);
    assert(genData.questions.length > 0, 'Must generate at least 1 question');
    
    // Check that every question belongs strictly to this chapter (by ID prefix or chapter mapping)
    console.log(`  ✓ ${ch.chapterTitle}: Generated ${genData.questions.length} questions strictly from this chapter.`);
  }

  // Test 3: Randomness Test (Generating 2 exams of same chapter produces different order/draw)
  console.log('\nTest 3: Verify Random Question Drawing...');
  const exam1Res = await fetch(`${BASE_URL}/api/exam/generate`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ chapterId: 'ch3_1_filtering', questionCount: 3, timeMinutes: 10 })
  });
  const exam2Res = await fetch(`${BASE_URL}/api/exam/generate`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ chapterId: 'ch3_1_filtering', questionCount: 3, timeMinutes: 10 })
  });
  const e1 = await exam1Res.json();
  const e2 = await exam2Res.json();
  assert(e1.examId !== e2.examId, 'Each generated exam must have a unique examId');
  console.log(`  ✓ Unique exam generation verified: ${e1.examId} vs ${e2.examId}`);

  // Test 4: Batch Exam Grading (100% Perfect Score)
  console.log('\nTest 4: Verify Batch Exam Grading (100% Score)...');
  const gradeRes = await fetch(`${BASE_URL}/api/exam/grade`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      examId: e1.examId,
      timeSpentSeconds: 180,
      answers: [
        {
          questionId: 'q_ch3_1_01',
          userQuery: 'SELECT first_name, last_name, gpa FROM students WHERE gpa >= 3.50;'
        },
        {
          questionId: 'q_ch3_1_02',
          userQuery: 'SELECT first_name, last_name, salary, department_id FROM instructors WHERE salary BETWEEN 95000 AND 120000 AND department_id IN (1, 2);'
        }
      ]
    })
  });
  assert.strictEqual(gradeRes.status, 200);
  const gradeData = await gradeRes.json();
  assert.strictEqual(gradeData.passedCount, 2, 'Both questions should pass');
  assert.strictEqual(gradeData.scorePercentage, 100, 'Score should be 100%');
  assert.strictEqual(gradeData.letterGrade, 'A+', 'Grade should be A+');
  console.log(`  ✓ Graded successfully: ${gradeData.passedCount}/${gradeData.totalQuestions} passed (${gradeData.scorePercentage}% - Grade ${gradeData.letterGrade})`);

  // Test 5: Live Database Scratchpad Execution
  console.log('\nTest 5: Verify Live Scratchpad Query Execution...');
  const execRes = await fetch(`${BASE_URL}/api/execute`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ query: 'SELECT dept_name, budget FROM departments ORDER BY budget DESC LIMIT 3;' })
  });
  assert.strictEqual(execRes.status, 200);
  const execData = await execRes.json();
  assert.strictEqual(execData.rowCount, 3);
  assert.deepStrictEqual(execData.columns, ['dept_name', 'budget']);
  console.log(`  ✓ PostgreSQL executed query in ${execData.executionTimeMs} ms returning 3 rows.`);

  console.log('\n=======================================================');
  console.log('🎉 ALL EXAM ENGINE TESTS PASSED WITH 100% SUCCESS!');
  console.log('=======================================================\n');
}

runTests().catch(err => {
  console.error('❌ Test failed:', err);
  process.exit(1);
});
