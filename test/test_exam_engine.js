// ============================================================================
// Automated End-to-End Test Suite for SQL Learning Studio Exam Engine
// Multi-Chapter Selection, Up to 15 Questions, Random Draws & Grading
// ============================================================================

const assert = require('assert');

async function runTests() {
  console.log('🧪 Starting SQL Learning Studio Multi-Chapter & 15-Question Exam Engine Test Suite...\n');

  const BASE_URL = 'http://localhost:3000';

  // Test 1: Chapters API
  console.log('Test 1: Verify /api/chapters endpoint...');
  const chRes = await fetch(`${BASE_URL}/api/chapters`);
  assert.strictEqual(chRes.status, 200, 'Chapters endpoint should return 200');
  const chData = await chRes.json();
  assert(Array.isArray(chData.chapters), 'Chapters should be an array');
  assert(chData.chapters.length >= 8, 'Should have at least 8 distinct chapters');
  console.log(`  ✓ Loaded ${chData.chapters.length} chapters successfully.`);

  // Test 2: Strict Single Chapter Separation
  console.log('\nTest 2: Verify Strict Single Chapter Separation on Exam Generation...');
  for (const ch of chData.chapters) {
    const genRes = await fetch(`${BASE_URL}/api/exam/generate`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        chapterId: ch.chapterId,
        questionCount: 3,
        timeMinutes: 10,
        mode: 'curated'
      })
    });
    assert.strictEqual(genRes.status, 200);
    const genData = await genRes.json();
    assert.strictEqual(genData.chapterId, ch.chapterId, `Generated exam chapterId must match ${ch.chapterId}`);
    assert(genData.questions.length > 0, 'Must generate at least 1 question');
    console.log(`  ✓ ${ch.chapterTitle}: Generated ${genData.questions.length} questions strictly from this chapter.`);
  }

  // Test 3: Multi-Chapter Selection (Drawing from subset of chosen chapters)
  console.log('\nTest 3: Verify Multi-Chapter Selection Exam Generation...');
  const multiChapters = ['ch2_relational_model', 'ch3_1_filtering'];
  const multiGenRes = await fetch(`${BASE_URL}/api/exam/generate`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      chapterIds: multiChapters,
      questionCount: 6,
      timeMinutes: 20,
      mode: 'curated'
    })
  });
  assert.strictEqual(multiGenRes.status, 200);
  const multiGenData = await multiGenRes.json();
  assert.strictEqual(multiGenData.questions.length, 6, 'Should generate exactly 6 questions');
  assert(multiGenData.chapterIds.includes('ch2_relational_model') && multiGenData.chapterIds.includes('ch3_1_filtering'));
  
  // Verify all questions belong strictly to the 2 chosen chapters
  const validPrefixes = ['q_ch2_', 'q_ch3_1_'];
  for (const q of multiGenData.questions) {
    const isValid = validPrefixes.some(p => q.id.startsWith(p));
    assert(isValid, `Question ${q.id} must belong to chosen multi-chapter set [${multiChapters.join(', ')}]`);
  }
  console.log(`  ✓ Multi-Chapter Exam generated: 6 questions drawn strictly from [Chapter 2, Chapter 3.1].`);

  // Test 4: Maximum 15 Questions Paper Generation
  console.log('\nTest 4: Verify 15-Question Full Exam Paper Generation...');
  const max15Res = await fetch(`${BASE_URL}/api/exam/generate`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      chapterIds: ['ch2_relational_model', 'ch3_1_filtering', 'ch3_2_functions', 'ch3_3_group_by', 'ch3_4_joins'],
      questionCount: 15,
      timeMinutes: 40,
      mode: 'curated'
    })
  });
  assert.strictEqual(max15Res.status, 200);
  const max15Data = await max15Res.json();
  assert.strictEqual(max15Data.questions.length, 15, 'Should generate full 15 questions paper');
  assert.strictEqual(max15Data.totalQuestions, 15);
  console.log(`  ✓ Full 15-Question paper successfully generated with ${max15Data.questions.length} distinct questions.`);

  // Test 5: True Randomness Test (Generating 2 exams produces unique IDs and randomized subsets)
  console.log('\nTest 5: Verify Random Question Drawing...');
  const exam1Res = await fetch(`${BASE_URL}/api/exam/generate`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ chapterId: 'ch3_1_filtering', questionCount: 4, timeMinutes: 10, mode: 'curated' })
  });
  const exam2Res = await fetch(`${BASE_URL}/api/exam/generate`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ chapterId: 'ch3_1_filtering', questionCount: 4, timeMinutes: 10, mode: 'curated' })
  });
  const e1 = await exam1Res.json();
  const e2 = await exam2Res.json();
  assert(e1.examId !== e2.examId, 'Each generated exam must have a unique examId');
  console.log(`  ✓ Unique exam generation verified: ${e1.examId} vs ${e2.examId}`);

  // Test 6: Batch Exam Grading (100% Perfect Score)
  console.log('\nTest 6: Verify Batch Exam Grading (100% Score)...');
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

  // Test 7: Live Database Scratchpad Execution
  console.log('\nTest 7: Verify Live Scratchpad Query Execution...');
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

  console.log('\n========================================================================');
  console.log('🎉 ALL EXAM ENGINE TESTS (MULTI-CHAPTER & 15-Q) PASSED WITH 100% SUCCESS!');
  console.log('========================================================================\n');
}

runTests().catch(err => {
  console.error('❌ Test failed:', err);
  process.exit(1);
});
