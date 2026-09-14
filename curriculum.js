// ============================================================================
// SQL Learning Studio: Comprehensive Chapter-Partitioned Question Bank
// Aligned strictly with CMU 15-445/645 (Lectures 01 & 02) and DBMS Chapters 2 & 3
// ============================================================================

const chapters = [
  // --------------------------------------------------------------------------
  // CHAPTER 2: Relational Model Foundations (Selection σ, Projection π, Keys)
  // --------------------------------------------------------------------------
  {
    chapterId: 'ch2_relational_model',
    chapterNumber: 2,
    chapterTitle: 'Chapter 2: Relational Model & Algebra (σ, π, Keys)',
    description: 'Relational model primitives: Selection (σ), Projection (π), Attribute Domains, Primary/Foreign Keys, and Duplicate Elimination (δ).',
    questions: [
      {
        id: 'q_ch2_01',
        number: 1,
        level: 1,
        title: 'Full Relation Projection (π_all)',
        concept: 'Projection (π) of all attributes',
        description: 'Retrieve all columns and all records from the `departments` relation to inspect the university department catalog.',
        tables: ['departments'],
        starterSql: '-- Project all columns from departments\nSELECT ',
        hint1: 'Use SELECT * to project the complete set of attributes.',
        hint2: 'Syntax: SELECT * FROM departments;',
        hint3: 'SELECT * FROM departments;',
        solution: 'SELECT * FROM departments;',
        orderMatters: false
      },
      {
        id: 'q_ch2_02',
        number: 2,
        level: 1,
        title: 'Specific Attribute Projection (π_name,email)',
        concept: 'Selective Projection (π)',
        description: 'Select only the `first_name`, `last_name`, and `email` of all instructors from the `instructors` table.',
        tables: ['instructors'],
        starterSql: '-- Select specific instructor attributes\nSELECT ',
        hint1: 'List the exact column names separated by commas.',
        hint2: 'Syntax: SELECT first_name, last_name, email FROM instructors;',
        hint3: 'SELECT first_name, last_name, email FROM instructors;',
        solution: 'SELECT first_name, last_name, email FROM instructors;',
        orderMatters: false
      },
      {
        id: 'q_ch2_03',
        number: 3,
        level: 2,
        title: 'Calculated Projection & Renaming (ρ / AS)',
        concept: 'Attribute Renaming & String Concatenation (||)',
        description: 'Display the full name of every student as a single column named `student_name` (in `"First Last"` format), along with their `gpa` and `credits_completed`.',
        tables: ['students'],
        starterSql: '-- Concatenate first and last name with an alias\nSELECT ',
        hint1: 'Combine strings using the || operator with a space literal in between.',
        hint2: 'Use AS student_name to rename the projected output column.',
        hint3: 'SELECT first_name || \' \' || last_name AS student_name, gpa, credits_completed FROM students;',
        solution: 'SELECT first_name || \' \' || last_name AS student_name, gpa, credits_completed FROM students;',
        orderMatters: false
      },
      {
        id: 'q_ch2_04',
        number: 4,
        level: 2,
        title: 'Duplicate Elimination (δ / DISTINCT)',
        concept: 'Set vs Bag Semantics (DISTINCT)',
        description: 'Retrieve all unique department IDs present in the `students` table, aliasing the column as `enrolled_department_id`. Exclude duplicates.',
        tables: ['students'],
        starterSql: '-- Get distinct department IDs from students\nSELECT ',
        hint1: 'Apply DISTINCT right after SELECT to enforce set semantics.',
        hint2: 'Syntax: SELECT DISTINCT department_id AS enrolled_department_id FROM students;',
        hint3: 'SELECT DISTINCT department_id AS enrolled_department_id FROM students;',
        solution: 'SELECT DISTINCT department_id AS enrolled_department_id FROM students;',
        orderMatters: false
      },
      {
        id: 'q_ch2_05',
        number: 5,
        level: 3,
        title: 'Arithmetic Expression in Projection',
        concept: 'Scalar Expressions & Rounding',
        description: 'Calculate a projected 10% annual salary increase for every instructor. Display `first_name`, `last_name`, `salary` AS `current_salary`, and the new amount rounded to 2 decimal places AS `projected_salary`.',
        tables: ['instructors'],
        starterSql: '-- Calculate a 10% salary projection\nSELECT ',
        hint1: 'Multiply salary by 1.10 and round to 2 decimal places using ROUND().',
        hint2: 'Syntax: ROUND(salary * 1.10, 2) AS projected_salary',
        hint3: 'SELECT first_name, last_name, salary AS current_salary, ROUND(salary * 1.10, 2) AS projected_salary FROM instructors;',
        solution: 'SELECT first_name, last_name, salary AS current_salary, ROUND(salary * 1.10, 2) AS projected_salary FROM instructors;',
        orderMatters: false
      },
      {
        id: 'q_ch2_06',
        number: 6,
        level: 2,
        title: 'Course Catalog Projection & Unit Cost',
        concept: 'Expression Projection',
        description: 'From the `courses` table, display `course_code`, `title`, `credits`, and calculate an estimated tuition fee calculated as `credits * 750.00` AS `tuition_cost`.',
        tables: ['courses'],
        starterSql: '-- Calculate tuition cost per course\nSELECT ',
        hint1: 'Multiply credits by 750.00 and alias the result as tuition_cost.',
        hint2: 'SELECT course_code, title, credits, credits * 750.00 AS tuition_cost FROM courses;',
        hint3: 'SELECT course_code, title, credits, credits * 750.00 AS tuition_cost FROM courses;',
        solution: 'SELECT course_code, title, credits, credits * 750.00 AS tuition_cost FROM courses;',
        orderMatters: false
      },
      {
        id: 'q_ch2_07',
        number: 7,
        level: 3,
        title: 'Distinct Semester and Year Combinations',
        concept: 'Multi-column Distinct Projection',
        description: 'Find all unique combinations of `semester` and `year` offered in the `sections` table. Sort by `year` descending, and `semester` ascending.',
        tables: ['sections'],
        starterSql: '-- Find unique academic terms\nSELECT ',
        hint1: 'Use SELECT DISTINCT semester, year FROM sections ORDER BY year DESC, semester ASC;',
        hint2: 'DISTINCT applies across both semester and year.',
        hint3: 'SELECT DISTINCT semester, year FROM sections ORDER BY year DESC, semester ASC;',
        solution: 'SELECT DISTINCT semester, year FROM sections ORDER BY year DESC, semester ASC;',
        orderMatters: true
      }
    ]
  },

  // --------------------------------------------------------------------------
  // CHAPTER 3.1: SQL Foundations, Predicate Filtering & Sorting
  // --------------------------------------------------------------------------
  {
    chapterId: 'ch3_1_filtering',
    chapterNumber: 3.1,
    chapterTitle: 'Chapter 3.1: Predicate Filtering & Sorting (WHERE, ORDER BY, LIMIT)',
    description: 'Relational selection predicates (σ), logical conjunctions (AND, OR, NOT), NULL handling, range checks, pattern matching, and result pagination.',
    questions: [
      {
        id: 'q_ch3_1_01',
        number: 1,
        level: 1,
        title: 'Basic Selection Predicate',
        concept: 'Relational Selection (σ_gpa>=3.5)',
        description: 'Find all students who have a `gpa` greater than or equal to `3.50`. Display `first_name`, `last_name`, and `gpa`.',
        tables: ['students'],
        starterSql: '-- Filter students with GPA >= 3.50\nSELECT ',
        hint1: 'Use a WHERE clause with the >= comparison operator.',
        hint2: 'WHERE gpa >= 3.50',
        hint3: 'SELECT first_name, last_name, gpa FROM students WHERE gpa >= 3.50;',
        solution: 'SELECT first_name, last_name, gpa FROM students WHERE gpa >= 3.50;',
        orderMatters: false
      },
      {
        id: 'q_ch3_1_02',
        number: 2,
        level: 2,
        title: 'Multiple Predicates with Range & IN',
        concept: 'Conjunction (AND, BETWEEN, IN)',
        description: 'Find all instructors whose `salary` is between `95,000` and `120,000` (inclusive) AND who belong to department `1` or `2` (`department_id`). Display `first_name`, `last_name`, `salary`, and `department_id`.',
        tables: ['instructors'],
        starterSql: '-- Filter instructors with salary in range in dept 1 or 2\nSELECT ',
        hint1: 'Use BETWEEN for the salary range and IN (1, 2) for the department IDs.',
        hint2: 'WHERE salary BETWEEN 95000 AND 120000 AND department_id IN (1, 2)',
        hint3: 'SELECT first_name, last_name, salary, department_id FROM instructors WHERE salary BETWEEN 95000 AND 120000 AND department_id IN (1, 2);',
        solution: 'SELECT first_name, last_name, salary, department_id FROM instructors WHERE salary BETWEEN 95000 AND 120000 AND department_id IN (1, 2);',
        orderMatters: false
      },
      {
        id: 'q_ch3_1_03',
        number: 3,
        level: 2,
        title: 'Three-Valued Logic & NULL Check',
        concept: 'IS NULL Predicate',
        description: 'Retrieve the `first_name`, `last_name`, and `email` of all students who do NOT have an assigned advisor (`advisor_id` is null).',
        tables: ['students'],
        starterSql: '-- Find students without an advisor\nSELECT ',
        hint1: 'In SQL, NULL cannot be compared with =. You must use IS NULL.',
        hint2: 'WHERE advisor_id IS NULL',
        hint3: 'SELECT first_name, last_name, email FROM students WHERE advisor_id IS NULL;',
        solution: 'SELECT first_name, last_name, email FROM students WHERE advisor_id IS NULL;',
        orderMatters: false
      },
      {
        id: 'q_ch3_1_04',
        number: 4,
        level: 3,
        title: 'Case-Insensitive Pattern Matching',
        concept: 'ILIKE & Disjunction (OR)',
        description: 'Find all courses whose `title` contains the word `"Science"` OR `"Management"` (case-insensitive). Display `course_code` and `title`.',
        tables: ['courses'],
        starterSql: '-- Match course titles containing keywords\nSELECT ',
        hint1: 'Use PostgreSQL\'s ILIKE operator with wildcard % on both sides.',
        hint2: 'WHERE title ILIKE \'%Science%\' OR title ILIKE \'%Management%\'',
        hint3: 'SELECT course_code, title FROM courses WHERE title ILIKE \'%Science%\' OR title ILIKE \'%Management%\';',
        solution: 'SELECT course_code, title FROM courses WHERE title ILIKE \'%Science%\' OR title ILIKE \'%Management%\';',
        orderMatters: false
      },
      {
        id: 'q_ch3_1_05',
        number: 5,
        level: 3,
        title: 'Sorting with Ties & Pagination',
        concept: 'ORDER BY DESC/ASC, LIMIT',
        description: 'List the top 5 highest GPA students in the university. Display `first_name`, `last_name`, and `gpa`. Order primarily by `gpa` descending, and secondarily by `last_name` ascending in case of ties.',
        tables: ['students'],
        starterSql: '-- Top 5 students by GPA with secondary tie-break\nSELECT ',
        hint1: 'Specify multiple columns in ORDER BY: the first with DESC, the second with ASC.',
        hint2: 'ORDER BY gpa DESC, last_name ASC LIMIT 5;',
        hint3: 'SELECT first_name, last_name, gpa FROM students ORDER BY gpa DESC, last_name ASC LIMIT 5;',
        solution: 'SELECT first_name, last_name, gpa FROM students ORDER BY gpa DESC, last_name ASC LIMIT 5;',
        orderMatters: true
      },
      {
        id: 'q_ch3_1_06',
        number: 6,
        level: 3,
        title: 'Section Capacity Range & Fall Filter',
        concept: 'Conjunctive Filter on Numeric & String Columns',
        description: 'Find all course sections scheduled for the `\'Fall\'` semester of year `2024` with a `capacity` of at least 35 seats. Display `section_id`, `course_id`, `classroom`, and `capacity`.',
        tables: ['sections'],
        starterSql: '-- Sections in Fall 2024 with capacity >= 35\nSELECT ',
        hint1: 'Filter semester = \'Fall\' AND year = 2024 AND capacity >= 35 in the WHERE clause.',
        hint2: 'SELECT section_id, course_id, classroom, capacity FROM sections WHERE semester = \'Fall\' AND year = 2024 AND capacity >= 35;',
        hint3: 'SELECT section_id, course_id, classroom, capacity FROM sections WHERE semester = \'Fall\' AND year = 2024 AND capacity >= 35;',
        solution: 'SELECT section_id, course_id, classroom, capacity FROM sections WHERE semester = \'Fall\' AND year = 2024 AND capacity >= 35;',
        orderMatters: false
      },
      {
        id: 'q_ch3_1_07',
        number: 7,
        level: 4,
        title: 'Pagination with OFFSET & Secondary Sort',
        concept: 'LIMIT & OFFSET',
        description: 'Retrieve students ranked 6th through 10th by `gpa` descending (5 students total). Display `student_id`, `first_name`, `last_name`, and `gpa`. Sort by `gpa` descending and `student_id` ascending.',
        tables: ['students'],
        starterSql: '-- Page 2 of top students (rows 6-10)\nSELECT ',
        hint1: 'Use LIMIT 5 OFFSET 5 with ORDER BY gpa DESC, student_id ASC.',
        hint2: 'SELECT student_id, first_name, last_name, gpa FROM students ORDER BY gpa DESC, student_id ASC LIMIT 5 OFFSET 5;',
        hint3: 'SELECT student_id, first_name, last_name, gpa FROM students ORDER BY gpa DESC, student_id ASC LIMIT 5 OFFSET 5;',
        solution: 'SELECT student_id, first_name, last_name, gpa FROM students ORDER BY gpa DESC, student_id ASC LIMIT 5 OFFSET 5;',
        orderMatters: true
      }
    ]
  },

  // --------------------------------------------------------------------------
  // CHAPTER 3.2: Functions, String/Date & Conditional CASE Logic
  // --------------------------------------------------------------------------
  {
    chapterId: 'ch3_2_functions',
    chapterNumber: 3.2,
    chapterTitle: 'Chapter 3.2: Functions, CASE & COALESCE',
    description: 'Aggregate functions (COUNT, SUM, AVG, MIN, MAX), PostgreSQL FILTER clause, string manipulation, date math, conditional CASE branching, and COALESCE.',
    questions: [
      {
        id: 'q_ch3_2_01',
        number: 1,
        level: 1,
        title: 'University Summary Statistics',
        concept: 'Global Aggregates (COUNT, AVG, MAX, MIN)',
        description: 'Calculate overall student statistics across the university: total count of students AS `total_students`, average GPA rounded to 2 decimals AS `avg_gpa`, maximum GPA AS `max_gpa`, and minimum GPA AS `min_gpa`.',
        tables: ['students'],
        starterSql: '-- Compute summary statistics for all students\nSELECT ',
        hint1: 'Apply aggregate functions COUNT(*), ROUND(AVG(gpa), 2), MAX(gpa), MIN(gpa).',
        hint2: 'SELECT COUNT(*) AS total_students, ROUND(AVG(gpa), 2) AS avg_gpa, MAX(gpa) AS max_gpa, MIN(gpa) AS min_gpa FROM students;',
        hint3: 'SELECT COUNT(*) AS total_students, ROUND(AVG(gpa), 2) AS avg_gpa, MAX(gpa) AS max_gpa, MIN(gpa) AS min_gpa FROM students;',
        solution: 'SELECT COUNT(*) AS total_students, ROUND(AVG(gpa), 2) AS avg_gpa, MAX(gpa) AS max_gpa, MIN(gpa) AS min_gpa FROM students;',
        orderMatters: false
      },
      {
        id: 'q_ch3_2_02',
        number: 2,
        level: 2,
        title: 'String Extraction & Date Math',
        concept: 'SPLIT_PART, UPPER, EXTRACT / AGE',
        description: 'For all instructors, display: full name in uppercase AS `instructor_name`, email username (everything before the `@`) AS `username`, and years of service as of today rounded down AS `years_tenure` (Hint: use EXTRACT(YEAR FROM AGE(CURRENT_DATE, hire_date))).',
        tables: ['instructors'],
        starterSql: '-- String and date extraction for instructors\nSELECT ',
        hint1: 'Use UPPER(first_name || \' \' || last_name) for uppercase name, and SPLIT_PART(email, \'@\', 1) for username.',
        hint2: 'Use EXTRACT(YEAR FROM AGE(CURRENT_DATE, hire_date)) AS years_tenure',
        hint3: 'SELECT UPPER(first_name || \' \' || last_name) AS instructor_name, SPLIT_PART(email, \'@\', 1) AS username, EXTRACT(YEAR FROM AGE(CURRENT_DATE, hire_date)) AS years_tenure FROM instructors;',
        solution: 'SELECT UPPER(first_name || \' \' || last_name) AS instructor_name, SPLIT_PART(email, \'@\', 1) AS username, EXTRACT(YEAR FROM AGE(CURRENT_DATE, hire_date)) AS years_tenure FROM instructors;',
        orderMatters: false
      },
      {
        id: 'q_ch3_2_03',
        number: 3,
        level: 2,
        title: 'COALESCE Null Fallback',
        concept: 'COALESCE(val, default)',
        description: 'List all students with `first_name`, `last_name`, and their `advisor_id`. If `advisor_id` is NULL, return `-1` AS `advisor_id`.',
        tables: ['students'],
        starterSql: '-- Replace NULL advisor IDs with -1\nSELECT ',
        hint1: 'COALESCE returns the first non-null expression in its argument list.',
        hint2: 'COALESCE(advisor_id, -1) AS advisor_id',
        hint3: 'SELECT first_name, last_name, COALESCE(advisor_id, -1) AS advisor_id FROM students;',
        solution: 'SELECT first_name, last_name, COALESCE(advisor_id, -1) AS advisor_id FROM students;',
        orderMatters: false
      },
      {
        id: 'q_ch3_2_04',
        number: 4,
        level: 3,
        title: 'Academic Standing Classification (CASE)',
        concept: 'Conditional CASE Expression',
        description: 'Classify each student\'s academic status based on their `gpa`:\n- `gpa >= 3.80` -> `\'Summa Cum Laude\'`\n- `gpa >= 3.50` -> `\'Magna Cum Laude\'`\n- `gpa >= 3.00` -> `\'Dean\'\'s List\'`\n- `gpa >= 2.00` -> `\'Good Standing\'`\n- Otherwise -> `\'Academic Probation\'`\nDisplay `first_name`, `last_name`, `gpa`, and `academic_standing`.',
        tables: ['students'],
        starterSql: '-- Classify student honors using CASE\nSELECT ',
        hint1: 'Use CASE WHEN ... THEN ... ELSE ... END AS academic_standing.',
        hint2: 'Order conditions from highest GPA threshold to lowest.',
        hint3: 'SELECT first_name, last_name, gpa, CASE WHEN gpa >= 3.80 THEN \'Summa Cum Laude\' WHEN gpa >= 3.50 THEN \'Magna Cum Laude\' WHEN gpa >= 3.00 THEN \'Dean\'\'s List\' WHEN gpa >= 2.00 THEN \'Good Standing\' ELSE \'Academic Probation\' END AS academic_standing FROM students;',
        solution: 'SELECT first_name, last_name, gpa, CASE WHEN gpa >= 3.80 THEN \'Summa Cum Laude\' WHEN gpa >= 3.50 THEN \'Magna Cum Laude\' WHEN gpa >= 3.00 THEN \'Dean\'\'s List\' WHEN gpa >= 2.00 THEN \'Good Standing\' ELSE \'Academic Probation\' END AS academic_standing FROM students;',
        orderMatters: false
      },
      {
        id: 'q_ch3_2_05',
        number: 5,
        level: 3,
        title: 'Conditional Filtered Aggregates',
        concept: 'COUNT(*) FILTER (WHERE ...)',
        description: 'In a single query across the entire university, calculate:\n- Total count of honor students (`gpa >= 3.50`) AS `high_achievers`\n- Total count of students needing assistance (`gpa < 3.00`) AS `needs_support`',
        tables: ['students'],
        starterSql: '-- Filtered aggregates in PostgreSQL\nSELECT ',
        hint1: 'Use PostgreSQL\'s standard FILTER (WHERE predicate) clause on COUNT(*).',
        hint2: 'COUNT(*) FILTER (WHERE gpa >= 3.50) AS high_achievers, COUNT(*) FILTER (WHERE gpa < 3.00) AS needs_support',
        hint3: 'SELECT COUNT(*) FILTER (WHERE gpa >= 3.50) AS high_achievers, COUNT(*) FILTER (WHERE gpa < 3.00) AS needs_support FROM students;',
        solution: 'SELECT COUNT(*) FILTER (WHERE gpa >= 3.50) AS high_achievers, COUNT(*) FILTER (WHERE gpa < 3.00) AS needs_support FROM students;',
        orderMatters: false
      },
      {
        id: 'q_ch3_2_06',
        number: 6,
        level: 3,
        title: 'Faculty Budget Utilization Calculation',
        concept: 'SUM aggregate and percentage arithmetic',
        description: 'Calculate the total annual faculty salary payroll across the university AS `total_payroll`, the maximum instructor salary AS `max_salary`, and the average instructor salary rounded to 2 decimals AS `avg_salary`.',
        tables: ['instructors'],
        starterSql: '-- Calculate faculty salary aggregates\nSELECT ',
        hint1: 'Use SUM(salary), MAX(salary), and ROUND(AVG(salary), 2).',
        hint2: 'SELECT SUM(salary) AS total_payroll, MAX(salary) AS max_salary, ROUND(AVG(salary), 2) AS avg_salary FROM instructors;',
        hint3: 'SELECT SUM(salary) AS total_payroll, MAX(salary) AS max_salary, ROUND(AVG(salary), 2) AS avg_salary FROM instructors;',
        solution: 'SELECT SUM(salary) AS total_payroll, MAX(salary) AS max_salary, ROUND(AVG(salary), 2) AS avg_salary FROM instructors;',
        orderMatters: false
      }
    ]
  },

  // --------------------------------------------------------------------------
  // CHAPTER 3.3: Aggregations, GROUP BY & HAVING (γ Operator)
  // --------------------------------------------------------------------------
  {
    chapterId: 'ch3_3_group_by',
    chapterNumber: 3.3,
    chapterTitle: 'Chapter 3.3: GROUP BY & HAVING (γ Operator)',
    description: 'Partitioning relations into subsets, computing group aggregates, multi-column grouping, and post-aggregation filtering with HAVING.',
    questions: [
      {
        id: 'q_ch3_3_01',
        number: 1,
        level: 1,
        title: 'Departmental Student Counts & Average GPA',
        concept: 'Basic GROUP BY',
        description: 'Find the total number of students and their average GPA for each `department_id`. Display `department_id`, `student_count`, and `avg_gpa` (rounded to 2 decimal places). Filter out students where department_id is null.',
        tables: ['students'],
        starterSql: '-- Aggregate students by department\nSELECT ',
        hint1: 'Group by department_id and use COUNT(*) and ROUND(AVG(gpa), 2).',
        hint2: 'WHERE department_id IS NOT NULL GROUP BY department_id',
        hint3: 'SELECT department_id, COUNT(*) AS student_count, ROUND(AVG(gpa), 2) AS avg_gpa FROM students WHERE department_id IS NOT NULL GROUP BY department_id;',
        solution: 'SELECT department_id, COUNT(*) AS student_count, ROUND(AVG(gpa), 2) AS avg_gpa FROM students WHERE department_id IS NOT NULL GROUP BY department_id;',
        orderMatters: false
      },
      {
        id: 'q_ch3_3_02',
        number: 2,
        level: 2,
        title: 'Grouping with Pre-Aggregation Filter',
        concept: 'Pre-aggregation row filter (WHERE)',
        description: 'For students who have earned more than 30 credits (`credits_completed > 30`), calculate the average GPA per department. Display `department_id` and `avg_gpa` (rounded to 2 decimals). Exclude NULL department_ids.',
        tables: ['students'],
        starterSql: '-- Filter rows before grouping\nSELECT ',
        hint1: 'Filter credits_completed > 30 in the WHERE clause before grouping occurs.',
        hint2: 'WHERE credits_completed > 30 AND department_id IS NOT NULL GROUP BY department_id',
        hint3: 'SELECT department_id, ROUND(AVG(gpa), 2) AS avg_gpa FROM students WHERE credits_completed > 30 AND department_id IS NOT NULL GROUP BY department_id;',
        solution: 'SELECT department_id, ROUND(AVG(gpa), 2) AS avg_gpa FROM students WHERE credits_completed > 30 AND department_id IS NOT NULL GROUP BY department_id;',
        orderMatters: false
      },
      {
        id: 'q_ch3_3_03',
        number: 3,
        level: 2,
        title: 'Post-Aggregation Group Filtering (HAVING)',
        concept: 'HAVING Clause Predicate',
        description: 'Find all departments (`department_id`) that have at least 3 students AND an average GPA strictly greater than `3.20`. Display `department_id`, `student_count`, and `avg_gpa`.',
        tables: ['students'],
        starterSql: '-- Filter aggregated groups with HAVING\nSELECT ',
        hint1: 'Aggregate conditions like COUNT(*) >= 3 must be placed in the HAVING clause, not WHERE.',
        hint2: 'GROUP BY department_id HAVING COUNT(*) >= 3 AND AVG(gpa) > 3.20',
        hint3: 'SELECT department_id, COUNT(*) AS student_count, ROUND(AVG(gpa), 2) AS avg_gpa FROM students WHERE department_id IS NOT NULL GROUP BY department_id HAVING COUNT(*) >= 3 AND AVG(gpa) > 3.20;',
        solution: 'SELECT department_id, COUNT(*) AS student_count, ROUND(AVG(gpa), 2) AS avg_gpa FROM students WHERE department_id IS NOT NULL GROUP BY department_id HAVING COUNT(*) >= 3 AND AVG(gpa) > 3.20;',
        orderMatters: false
      },
      {
        id: 'q_ch3_3_04',
        number: 4,
        level: 3,
        title: 'Multi-Column Grouping on Offerings',
        concept: 'GROUP BY col1, col2, col3',
        description: 'Find the number of sections offered for each course in each semester and year. Display `course_id`, `semester`, `year`, and `section_count`. Sort the output by `course_id` ascending, `year` descending, and `semester` ascending.',
        tables: ['sections'],
        starterSql: '-- Group by multiple columns\nSELECT ',
        hint1: 'Include all non-aggregated columns (course_id, semester, year) in the GROUP BY clause.',
        hint2: 'GROUP BY course_id, semester, year ORDER BY course_id ASC, year DESC, semester ASC',
        hint3: 'SELECT course_id, semester, year, COUNT(*) AS section_count FROM sections GROUP BY course_id, semester, year ORDER BY course_id ASC, year DESC, semester ASC;',
        solution: 'SELECT course_id, semester, year, COUNT(*) AS section_count FROM sections GROUP BY course_id, semester, year ORDER BY course_id ASC, year DESC, semester ASC;',
        orderMatters: true
      },
      {
        id: 'q_ch3_3_05',
        number: 5,
        level: 4,
        title: 'Teaching Load Threshold by Semester',
        concept: 'SUM aggregate in HAVING with WHERE predicate',
        description: 'Find instructors (`instructor_id`) who taught sections in `Fall` `2024` with a combined total student capacity of at least 40 across their sections. Display `instructor_id` and `total_capacity`.',
        tables: ['sections'],
        starterSql: '-- Filter by semester in WHERE and capacity in HAVING\nSELECT ',
        hint1: 'Filter semester = \'Fall\' AND year = 2024 in WHERE, then GROUP BY instructor_id and filter HAVING SUM(capacity) >= 40.',
        hint2: 'WHERE semester = \'Fall\' AND year = 2024 AND instructor_id IS NOT NULL GROUP BY instructor_id HAVING SUM(capacity) >= 40',
        hint3: 'SELECT instructor_id, SUM(capacity) AS total_capacity FROM sections WHERE semester = \'Fall\' AND year = 2024 AND instructor_id IS NOT NULL GROUP BY instructor_id HAVING SUM(capacity) >= 40;',
        solution: 'SELECT instructor_id, SUM(capacity) AS total_capacity FROM sections WHERE semester = \'Fall\' AND year = 2024 AND instructor_id IS NOT NULL GROUP BY instructor_id HAVING SUM(capacity) >= 40;',
        orderMatters: false
      },
      {
        id: 'q_ch3_3_06',
        number: 6,
        level: 3,
        title: 'Course Credit Load per Department',
        concept: 'GROUP BY with SUM and COUNT',
        description: 'For each department (`department_id`), calculate the total number of courses offered AS `course_count` and the sum of all course credits AS `total_credits`. Display `department_id`, `course_count`, and `total_credits`.',
        tables: ['courses'],
        starterSql: '-- Credit load per department\nSELECT ',
        hint1: 'Group by department_id and use COUNT(*) and SUM(credits).',
        hint2: 'SELECT department_id, COUNT(*) AS course_count, SUM(credits) AS total_credits FROM courses GROUP BY department_id;',
        hint3: 'SELECT department_id, COUNT(*) AS course_count, SUM(credits) AS total_credits FROM courses GROUP BY department_id;',
        solution: 'SELECT department_id, COUNT(*) AS course_count, SUM(credits) AS total_credits FROM courses GROUP BY department_id;',
        orderMatters: false
      }
    ]
  },

  // --------------------------------------------------------------------------
  // CHAPTER 3.4: Multi-Table JOINs & Relational Algebra (⋈, Outer Joins)
  // --------------------------------------------------------------------------
  {
    chapterId: 'ch3_4_joins',
    chapterNumber: 3.4,
    chapterTitle: 'Chapter 3.4: Multi-Table JOINs (⋈, ×, Outer Joins)',
    description: 'Relational joins, Cartesian product, left/right/full outer joins, self-joins, and anti-joins.',
    questions: [
      {
        id: 'q_ch3_4_01',
        number: 1,
        level: 1,
        title: 'Basic Inner Join',
        concept: 'INNER JOIN (R ⋈ S)',
        description: 'List every student\'s full name AS `student_name`, along with their department name (`dept_name`) and department `building`.',
        tables: ['students', 'departments'],
        starterSql: '-- Join students with departments\nSELECT ',
        hint1: 'Join students s ON s.department_id = d.department_id.',
        hint2: 'SELECT s.first_name || \' \' || s.last_name AS student_name, d.dept_name, d.building FROM students s JOIN departments d ON s.department_id = d.department_id;',
        hint3: 'SELECT s.first_name || \' \' || s.last_name AS student_name, d.dept_name, d.building FROM students s JOIN departments d ON s.department_id = d.department_id;',
        solution: 'SELECT s.first_name || \' \' || s.last_name AS student_name, d.dept_name, d.building FROM students s JOIN departments d ON s.department_id = d.department_id;',
        orderMatters: false
      },
      {
        id: 'q_ch3_4_02',
        number: 2,
        level: 2,
        title: 'Preserving Unmatched Records with LEFT JOIN',
        concept: 'LEFT OUTER JOIN',
        description: 'List ALL instructors (`first_name`, `last_name`) and the `section_id` of sections they have taught. Include instructors who have never taught any sections (their `section_id` should appear as NULL).',
        tables: ['instructors', 'sections'],
        starterSql: '-- Left join instructors with sections\nSELECT ',
        hint1: 'Use LEFT JOIN sections sec ON i.instructor_id = sec.instructor_id so instructors without sections are preserved.',
        hint2: 'SELECT i.first_name, i.last_name, sec.section_id FROM instructors i LEFT JOIN sections sec ON i.instructor_id = sec.instructor_id;',
        hint3: 'SELECT i.first_name, i.last_name, sec.section_id FROM instructors i LEFT JOIN sections sec ON i.instructor_id = sec.instructor_id;',
        solution: 'SELECT i.first_name, i.last_name, sec.section_id FROM instructors i LEFT JOIN sections sec ON i.instructor_id = sec.instructor_id;',
        orderMatters: false
      },
      {
        id: 'q_ch3_4_03',
        number: 3,
        level: 2,
        title: 'Self-Join on Course Prerequisites',
        concept: 'Self-Join & COALESCE',
        description: 'List every course `course_code`, `title`, and the `title` of its prerequisite course AS `prerequisite_title`. If a course has no prerequisite, display `\'None\'`.',
        tables: ['courses'],
        starterSql: '-- Self join courses table with itself\nSELECT ',
        hint1: 'Alias the courses table twice (e.g. c for course, p for prerequisite), with a LEFT JOIN on c.prerequisite_course_id = p.course_id.',
        hint2: 'Use COALESCE(p.title, \'None\') AS prerequisite_title',
        hint3: 'SELECT c.course_code, c.title, COALESCE(p.title, \'None\') AS prerequisite_title FROM courses c LEFT JOIN courses p ON c.prerequisite_course_id = p.course_id;',
        solution: 'SELECT c.course_code, c.title, COALESCE(p.title, \'None\') AS prerequisite_title FROM courses c LEFT JOIN courses p ON c.prerequisite_course_id = p.course_id;',
        orderMatters: false
      },
      {
        id: 'q_ch3_4_04',
        number: 4,
        level: 3,
        title: 'Multi-Table Join with Aggregations',
        concept: 'Multi-Table Join & Aggregate Grouping',
        description: 'For each department, calculate the total number of students enrolled in its sections AS `total_enrollments` and average grade points AS `avg_grade_points` (rounded to 2 decimals). Display `dept_name`, `total_enrollments`, and `avg_grade_points`.',
        tables: ['departments', 'courses', 'sections', 'enrollments', 'grades'],
        starterSql: '-- Multi-table join across department to grades\nSELECT ',
        hint1: 'Join departments -> courses -> sections -> enrollments -> grades.',
        hint2: 'GROUP BY d.dept_name',
        hint3: 'SELECT d.dept_name, COUNT(e.enrollment_id) AS total_enrollments, ROUND(AVG(g.grade_points), 2) AS avg_grade_points FROM departments d JOIN courses c ON d.department_id = c.department_id JOIN sections sec ON c.course_id = sec.course_id JOIN enrollments e ON sec.section_id = e.section_id JOIN grades g ON e.enrollment_id = g.enrollment_id GROUP BY d.dept_name;',
        solution: 'SELECT d.dept_name, COUNT(e.enrollment_id) AS total_enrollments, ROUND(AVG(g.grade_points), 2) AS avg_grade_points FROM departments d JOIN courses c ON d.department_id = c.department_id JOIN sections sec ON c.course_id = sec.course_id JOIN enrollments e ON sec.section_id = e.section_id JOIN grades g ON e.enrollment_id = g.enrollment_id GROUP BY d.dept_name;',
        orderMatters: false
      },
      {
        id: 'q_ch3_4_05',
        number: 5,
        level: 4,
        title: 'Anti-Join: Finding Unmatched Entities',
        concept: 'Anti-Join (LEFT JOIN + IS NULL)',
        description: 'Find all students who have NEVER enrolled in any course section. Display their `student_id`, `first_name`, `last_name`, and `email`.',
        tables: ['students', 'enrollments'],
        starterSql: '-- Anti-join to find students with 0 enrollments\nSELECT ',
        hint1: 'Left join students with enrollments on student_id, and filter WHERE enrollments.enrollment_id IS NULL.',
        hint2: 'FROM students s LEFT JOIN enrollments e ON s.student_id = e.student_id WHERE e.enrollment_id IS NULL',
        hint3: 'SELECT s.student_id, s.first_name, s.last_name, s.email FROM students s LEFT JOIN enrollments e ON s.student_id = e.student_id WHERE e.enrollment_id IS NULL;',
        solution: 'SELECT s.student_id, s.first_name, s.last_name, s.email FROM students s LEFT JOIN enrollments e ON s.student_id = e.student_id WHERE e.enrollment_id IS NULL;',
        orderMatters: false
      },
      {
        id: 'q_ch3_4_06',
        number: 6,
        level: 3,
        title: 'Students and Assigned Faculty Advisor',
        concept: 'LEFT JOIN on optional foreign key',
        description: 'List all students (`first_name`, `last_name`) and their advisor\'s full name (`advisor_name`). If the student has no advisor, display `\'Unassigned\'` AS `advisor_name`.',
        tables: ['students', 'instructors'],
        starterSql: '-- Join students with instructor advisor\nSELECT ',
        hint1: 'Use LEFT JOIN instructors i ON s.advisor_id = i.instructor_id and COALESCE(i.first_name || \' \' || i.last_name, \'Unassigned\').',
        hint2: 'SELECT s.first_name, s.last_name, COALESCE(i.first_name || \' \' || i.last_name, \'Unassigned\') AS advisor_name FROM students s LEFT JOIN instructors i ON s.advisor_id = i.instructor_id;',
        hint3: 'SELECT s.first_name, s.last_name, COALESCE(i.first_name || \' \' || i.last_name, \'Unassigned\') AS advisor_name FROM students s LEFT JOIN instructors i ON s.advisor_id = i.instructor_id;',
        solution: 'SELECT s.first_name, s.last_name, COALESCE(i.first_name || \' \' || i.last_name, \'Unassigned\') AS advisor_name FROM students s LEFT JOIN instructors i ON s.advisor_id = i.instructor_id;',
        orderMatters: false
      }
    ]
  },

  // --------------------------------------------------------------------------
  // CHAPTER 3.5: Nested Subqueries (IN, EXISTS, ALL, ANY)
  // --------------------------------------------------------------------------
  {
    chapterId: 'ch3_5_subqueries',
    chapterNumber: 3.5,
    chapterTitle: 'Chapter 3.5: Nested Subqueries (IN, EXISTS, ANY, ALL)',
    description: 'Scalar subqueries, correlated subqueries, existential quantification (EXISTS / NOT EXISTS), set membership (IN / NOT IN), and derived tables in the FROM clause.',
    questions: [
      {
        id: 'q_ch3_5_01',
        number: 1,
        level: 1,
        title: 'Scalar Subquery Comparison',
        concept: 'Scalar Subquery in WHERE',
        description: 'Find all students whose `gpa` is strictly higher than the overall university average GPA. Display `first_name`, `last_name`, and `gpa`.',
        tables: ['students'],
        starterSql: '-- Students with GPA > university average\nSELECT ',
        hint1: 'Compute the average GPA in a subquery: (SELECT AVG(gpa) FROM students).',
        hint2: 'WHERE gpa > (SELECT AVG(gpa) FROM students)',
        hint3: 'SELECT first_name, last_name, gpa FROM students WHERE gpa > (SELECT AVG(gpa) FROM students);',
        solution: 'SELECT first_name, last_name, gpa FROM students WHERE gpa > (SELECT AVG(gpa) FROM students);',
        orderMatters: false
      },
      {
        id: 'q_ch3_5_02',
        number: 2,
        level: 2,
        title: 'Subquery with NOT EXISTS (Safe Anti-Check)',
        concept: 'NOT EXISTS vs NOT IN with NULLs',
        description: 'Find the `first_name`, `last_name`, and `email` of all instructors who are NOT currently assigned as an advisor to any student using a `NOT EXISTS` subquery.',
        tables: ['instructors', 'students'],
        starterSql: '-- Instructors advising zero students via NOT EXISTS\nSELECT ',
        hint1: 'Use NOT EXISTS with a correlated subquery linking students.advisor_id to instructors.instructor_id.',
        hint2: 'WHERE NOT EXISTS (SELECT 1 FROM students s WHERE s.advisor_id = i.instructor_id)',
        hint3: 'SELECT i.first_name, i.last_name, i.email FROM instructors i WHERE NOT EXISTS (SELECT 1 FROM students s WHERE s.advisor_id = i.instructor_id);',
        solution: 'SELECT i.first_name, i.last_name, i.email FROM instructors i WHERE NOT EXISTS (SELECT 1 FROM students s WHERE s.advisor_id = i.instructor_id);',
        orderMatters: false
      },
      {
        id: 'q_ch3_5_03',
        number: 3,
        level: 3,
        title: 'Correlated Subquery: Departmental Outperformers',
        concept: 'Correlated Subquery in WHERE',
        description: 'Find all students whose `gpa` is strictly higher than the average GPA of their specific department. Display `first_name`, `last_name`, `department_id`, and `gpa`. Exclude students without a department.',
        tables: ['students'],
        starterSql: '-- Compare student GPA to their own department average\nSELECT ',
        hint1: 'In the subquery, calculate AVG(gpa) for students WHERE department_id = outer_student.department_id.',
        hint2: 'WHERE s.department_id IS NOT NULL AND s.gpa > (SELECT AVG(s2.gpa) FROM students s2 WHERE s2.department_id = s.department_id)',
        hint3: 'SELECT s.first_name, s.last_name, s.department_id, s.gpa FROM students s WHERE s.department_id IS NOT NULL AND s.gpa > (SELECT AVG(s2.gpa) FROM students s2 WHERE s2.department_id = s.department_id);',
        solution: 'SELECT s.first_name, s.last_name, s.department_id, s.gpa FROM students s WHERE s.department_id IS NOT NULL AND s.gpa > (SELECT AVG(s2.gpa) FROM students s2 WHERE s2.department_id = s.department_id);',
        orderMatters: false
      },
      {
        id: 'q_ch3_5_04',
        number: 4,
        level: 4,
        title: 'Derived Table Subquery in FROM Clause',
        concept: 'Derived Table / Subquery in FROM',
        description: 'Using a derived table in the FROM clause, calculate each department\'s average instructor salary, and then find the highest (`max_dept_avg_salary`) rounded to 2 decimal places among those departmental averages.',
        tables: ['instructors'],
        starterSql: '-- Calculate max departmental average salary from derived table\nSELECT ',
        hint1: 'Create a subquery in FROM aliased as dept_salaries that calculates AVG(salary) GROUP BY department_id.',
        hint2: 'SELECT ROUND(MAX(avg_sal), 2) AS max_dept_avg_salary FROM (SELECT department_id, AVG(salary) AS avg_sal FROM instructors GROUP BY department_id) AS dept_salaries;',
        hint3: 'SELECT ROUND(MAX(avg_sal), 2) AS max_dept_avg_salary FROM (SELECT department_id, AVG(salary) AS avg_sal FROM instructors GROUP BY department_id) AS dept_salaries;',
        solution: 'SELECT ROUND(MAX(avg_sal), 2) AS max_dept_avg_salary FROM (SELECT department_id, AVG(salary) AS avg_sal FROM instructors GROUP BY department_id) AS dept_salaries;',
        orderMatters: false
      },
      {
        id: 'q_ch3_5_05',
        number: 5,
        level: 4,
        title: 'Comparative Subquery with ALL',
        concept: 'ALL Operator',
        description: 'Find the instructor(s) whose salary is strictly greater than ALL instructor salaries in the Mathematics department (`department_id = 2`). Display `first_name`, `last_name`, and `salary`.',
        tables: ['instructors'],
        starterSql: '-- Find instructors earning more than ALL math instructors\nSELECT ',
        hint1: 'Use > ALL (SELECT salary FROM instructors WHERE department_id = 2).',
        hint2: 'WHERE salary > ALL (SELECT salary FROM instructors WHERE department_id = 2)',
        hint3: 'SELECT first_name, last_name, salary FROM instructors WHERE salary > ALL (SELECT salary FROM instructors WHERE department_id = 2);',
        solution: 'SELECT first_name, last_name, salary FROM instructors WHERE salary > ALL (SELECT salary FROM instructors WHERE department_id = 2);',
        orderMatters: false
      },
      {
        id: 'q_ch3_5_06',
        number: 6,
        level: 3,
        title: 'Courses with Enrolled Honor Students (EXISTS)',
        concept: 'Correlated EXISTS with Multi-table condition',
        description: 'Find all course titles for which at least one student with a GPA >= 3.80 has completed a section. Use an `EXISTS` subquery. Display `title`.',
        tables: ['courses', 'sections', 'enrollments', 'students'],
        starterSql: '-- Courses taken by honors students via EXISTS\nSELECT ',
        hint1: 'Use WHERE EXISTS (SELECT 1 FROM sections s JOIN enrollments e ON s.section_id = e.section_id JOIN students st ON e.student_id = st.student_id WHERE s.course_id = c.course_id AND st.gpa >= 3.80 AND e.status = \'completed\').',
        hint2: 'SELECT c.title FROM courses c WHERE EXISTS (SELECT 1 FROM sections s JOIN enrollments e ON s.section_id = e.section_id JOIN students st ON e.student_id = st.student_id WHERE s.course_id = c.course_id AND st.gpa >= 3.80 AND e.status = \'completed\');',
        hint3: 'SELECT c.title FROM courses c WHERE EXISTS (SELECT 1 FROM sections s JOIN enrollments e ON s.section_id = e.section_id JOIN students st ON e.student_id = st.student_id WHERE s.course_id = c.course_id AND st.gpa >= 3.80 AND e.status = \'completed\');',
        solution: 'SELECT c.title FROM courses c WHERE EXISTS (SELECT 1 FROM sections s JOIN enrollments e ON s.section_id = e.section_id JOIN students st ON e.student_id = st.student_id WHERE s.course_id = c.course_id AND st.gpa >= 3.80 AND e.status = \'completed\');',
        orderMatters: false
      }
    ]
  },

  // --------------------------------------------------------------------------
  // MODERN SQL: Common Table Expressions (WITH Clause)
  // --------------------------------------------------------------------------
  {
    chapterId: 'ch_modern_ctes',
    chapterNumber: 'M1',
    chapterTitle: 'Modern SQL 1: Common Table Expressions (WITH)',
    description: 'Named temporary result sets, modular query pipelines, multiple chained CTEs, and recursive hierarchy traversal.',
    questions: [
      {
        id: 'q_cte_01',
        number: 1,
        level: 1,
        title: 'Basic WITH Clause',
        concept: 'Single CTE',
        description: 'Write a query using a single CTE named `high_salary_instructors` that selects instructors earning more than `100,000`. From this CTE, select `first_name`, `last_name`, and `salary` sorted by `salary` descending.',
        tables: ['instructors'],
        starterSql: '-- Define a basic CTE\nWITH high_salary_instructors AS (\n  SELECT first_name, last_name, salary FROM instructors WHERE salary > 100000\n)\nSELECT ',
        hint1: 'Query directly from high_salary_instructors in your main SELECT block with ORDER BY salary DESC.',
        hint2: 'WITH high_salary_instructors AS (SELECT first_name, last_name, salary FROM instructors WHERE salary > 100000) SELECT first_name, last_name, salary FROM high_salary_instructors ORDER BY salary DESC;',
        hint3: 'WITH high_salary_instructors AS (SELECT first_name, last_name, salary FROM instructors WHERE salary > 100000) SELECT first_name, last_name, salary FROM high_salary_instructors ORDER BY salary DESC;',
        solution: 'WITH high_salary_instructors AS (SELECT first_name, last_name, salary FROM instructors WHERE salary > 100000) SELECT first_name, last_name, salary FROM high_salary_instructors ORDER BY salary DESC;',
        orderMatters: true
      },
      {
        id: 'q_cte_02',
        number: 2,
        level: 2,
        title: 'CTE Joined with Dimension Table',
        concept: 'Joining CTE to Base Table',
        description: 'Create a CTE `dept_gpa_summary` calculating the average GPA per department. In the main query, join this CTE with `departments` to display `dept_name` and `avg_gpa` (rounded to 2 decimals), ordered from highest average GPA to lowest.',
        tables: ['departments', 'students'],
        starterSql: '-- CTE joined with departments\nWITH dept_gpa_summary AS (\n  \n)\nSELECT ',
        hint1: 'In the CTE, SELECT department_id, ROUND(AVG(gpa), 2) AS avg_gpa FROM students GROUP BY department_id.',
        hint2: 'Join dept_gpa_summary g ON d.department_id = g.department_id ORDER BY g.avg_gpa DESC',
        hint3: 'WITH dept_gpa_summary AS (SELECT department_id, ROUND(AVG(gpa), 2) AS avg_gpa FROM students WHERE department_id IS NOT NULL GROUP BY department_id) SELECT d.dept_name, g.avg_gpa FROM departments d JOIN dept_gpa_summary g ON d.department_id = g.department_id ORDER BY g.avg_gpa DESC;',
        solution: 'WITH dept_gpa_summary AS (SELECT department_id, ROUND(AVG(gpa), 2) AS avg_gpa FROM students WHERE department_id IS NOT NULL GROUP BY department_id) SELECT d.dept_name, g.avg_gpa FROM departments d JOIN dept_gpa_summary g ON d.department_id = g.department_id ORDER BY g.avg_gpa DESC;',
        orderMatters: true
      },
      {
        id: 'q_cte_03',
        number: 3,
        level: 3,
        title: 'Chained Multiple CTEs',
        concept: 'Multiple CTEs (cte1, cte2)',
        description: 'Using two chained CTEs:\n1. `student_enrollment_counts`: Count total completed enrollments per student (`status = \'completed\'`).\n2. `avg_completed`: Calculate the average completed enrollment count across those students.\nIn the main query, find students whose completed enrollment count is strictly greater than the average. Display `student_id` and `completed_count`.',
        tables: ['enrollments'],
        starterSql: '-- Chained CTEs\nWITH student_enrollment_counts AS (\n  SELECT student_id, COUNT(*) AS completed_count FROM enrollments WHERE status = \'completed\' GROUP BY student_id\n),\navg_completed AS (\n  SELECT AVG(completed_count) AS benchmark FROM student_enrollment_counts\n)\nSELECT ',
        hint1: 'In the final SELECT, filter WHERE completed_count > (SELECT benchmark FROM avg_completed).',
        hint2: 'SELECT student_id, completed_count FROM student_enrollment_counts WHERE completed_count > (SELECT benchmark FROM avg_completed);',
        hint3: 'WITH student_enrollment_counts AS (SELECT student_id, COUNT(*) AS completed_count FROM enrollments WHERE status = \'completed\' GROUP BY student_id), avg_completed AS (SELECT AVG(completed_count) AS benchmark FROM student_enrollment_counts) SELECT student_id, completed_count FROM student_enrollment_counts WHERE completed_count > (SELECT benchmark FROM avg_completed);',
        solution: 'WITH student_enrollment_counts AS (SELECT student_id, COUNT(*) AS completed_count FROM enrollments WHERE status = \'completed\' GROUP BY student_id), avg_completed AS (SELECT AVG(completed_count) AS benchmark FROM student_enrollment_counts) SELECT student_id, completed_count FROM student_enrollment_counts WHERE completed_count > (SELECT benchmark FROM avg_completed);',
        orderMatters: false
      },
      {
        id: 'q_cte_04',
        number: 4,
        level: 4,
        title: 'Recursive CTE Prerequisite Chain',
        concept: 'WITH RECURSIVE Hierarchy Traversal',
        description: 'Write a recursive CTE named `prereq_chain` that starts with course `\'CS401\'` and traverses recursively through all of its prerequisites (`CS301` -> `CS201` -> `CS101`). Display `course_code`, `title`, and recursion `level` (starting at 1 for CS401).',
        tables: ['courses'],
        starterSql: '-- Recursive CTE\nWITH RECURSIVE prereq_chain AS (\n  -- Anchor member\n  SELECT course_id, course_code, title, prerequisite_course_id, 1 AS level\n  FROM courses WHERE course_code = \'CS401\'\n  UNION ALL\n  -- Recursive member\n  \n)\nSELECT course_code, title, level FROM prereq_chain;',
        hint1: 'Join courses c ON c.course_id = p.prerequisite_course_id and increment level + 1.',
        hint2: 'SELECT c.course_id, c.course_code, c.title, c.prerequisite_course_id, p.level + 1 FROM courses c JOIN prereq_chain p ON c.course_id = p.prerequisite_course_id',
        hint3: 'WITH RECURSIVE prereq_chain AS (SELECT course_id, course_code, title, prerequisite_course_id, 1 AS level FROM courses WHERE course_code = \'CS401\' UNION ALL SELECT c.course_id, c.course_code, c.title, c.prerequisite_course_id, p.level + 1 FROM courses c JOIN prereq_chain p ON c.course_id = p.prerequisite_course_id) SELECT course_code, title, level FROM prereq_chain;',
        solution: 'WITH RECURSIVE prereq_chain AS (SELECT course_id, course_code, title, prerequisite_course_id, 1 AS level FROM courses WHERE course_code = \'CS401\' UNION ALL SELECT c.course_id, c.course_code, c.title, c.prerequisite_course_id, p.level + 1 FROM courses c JOIN prereq_chain p ON c.course_id = p.prerequisite_course_id) SELECT course_code, title, level FROM prereq_chain;',
        orderMatters: false
      }
    ]
  },

  // --------------------------------------------------------------------------
  // MODERN SQL: Window Functions (OVER, PARTITION BY, RANK, LAG)
  // --------------------------------------------------------------------------
  {
    chapterId: 'ch_modern_window',
    chapterNumber: 'M2',
    chapterTitle: 'Modern SQL 2: Window Functions (OVER, RANK, LAG)',
    description: 'Calculations across sets of tuples without collapsing rows: ranking, partitioned analytics, moving calculations, and offset functions.',
    questions: [
      {
        id: 'q_win_01',
        number: 1,
        level: 1,
        title: 'Global Window Ranking Comparison',
        concept: 'ROW_NUMBER(), RANK(), DENSE_RANK()',
        description: 'Rank all students across the university by `gpa` in descending order. Display `first_name`, `last_name`, `gpa`, `ROW_NUMBER() OVER (ORDER BY gpa DESC)` AS `row_num`, and `DENSE_RANK() OVER (ORDER BY gpa DESC)` AS `dense_rk`.',
        tables: ['students'],
        starterSql: '-- Window ranking comparison\nSELECT ',
        hint1: 'Apply ROW_NUMBER() and DENSE_RANK() with OVER (ORDER BY gpa DESC).',
        hint2: 'SELECT first_name, last_name, gpa, ROW_NUMBER() OVER (ORDER BY gpa DESC) AS row_num, DENSE_RANK() OVER (ORDER BY gpa DESC) AS dense_rk FROM students;',
        hint3: 'SELECT first_name, last_name, gpa, ROW_NUMBER() OVER (ORDER BY gpa DESC) AS row_num, DENSE_RANK() OVER (ORDER BY gpa DESC) AS dense_rk FROM students;',
        solution: 'SELECT first_name, last_name, gpa, ROW_NUMBER() OVER (ORDER BY gpa DESC) AS row_num, DENSE_RANK() OVER (ORDER BY gpa DESC) AS dense_rk FROM students;',
        orderMatters: true
      },
      {
        id: 'q_win_02',
        number: 2,
        level: 2,
        title: 'Department-Partitioned Ranking',
        concept: 'PARTITION BY clause',
        description: 'Rank students within their respective departments (`PARTITION BY department_id`) by `gpa` descending using `DENSE_RANK()`. Display `department_id`, `first_name`, `last_name`, `gpa`, and `rank_in_dept`. Exclude students with NULL department_id.',
        tables: ['students'],
        starterSql: '-- Department partitioned rank\nSELECT ',
        hint1: 'Use DENSE_RANK() OVER (PARTITION BY department_id ORDER BY gpa DESC) AS rank_in_dept.',
        hint2: 'WHERE department_id IS NOT NULL',
        hint3: 'SELECT department_id, first_name, last_name, gpa, DENSE_RANK() OVER (PARTITION BY department_id ORDER BY gpa DESC) AS rank_in_dept FROM students WHERE department_id IS NOT NULL;',
        solution: 'SELECT department_id, first_name, last_name, gpa, DENSE_RANK() OVER (PARTITION BY department_id ORDER BY gpa DESC) AS rank_in_dept FROM students WHERE department_id IS NOT NULL;',
        orderMatters: false
      },
      {
        id: 'q_win_03',
        number: 3,
        level: 3,
        title: 'Uncollapsed Window Average & Variance',
        concept: 'Window AVG() over partition',
        description: 'For every student with a department, display `first_name`, `last_name`, `gpa`, the average GPA of their department rounded to 2 decimals AS `dept_avg_gpa`, and the difference (`gpa - ROUND(AVG(gpa) OVER (PARTITION BY department_id), 2)`) AS `gpa_diff`.',
        tables: ['students'],
        starterSql: '-- Window aggregate without GROUP BY collapse\nSELECT ',
        hint1: 'Use ROUND(AVG(gpa) OVER (PARTITION BY department_id), 2) AS dept_avg_gpa.',
        hint2: 'WHERE department_id IS NOT NULL',
        hint3: 'SELECT first_name, last_name, gpa, ROUND(AVG(gpa) OVER (PARTITION BY department_id), 2) AS dept_avg_gpa, gpa - ROUND(AVG(gpa) OVER (PARTITION BY department_id), 2) AS gpa_diff FROM students WHERE department_id IS NOT NULL;',
        solution: 'SELECT first_name, last_name, gpa, ROUND(AVG(gpa) OVER (PARTITION BY department_id), 2) AS dept_avg_gpa, gpa - ROUND(AVG(gpa) OVER (PARTITION BY department_id), 2) AS gpa_diff FROM students WHERE department_id IS NOT NULL;',
        orderMatters: false
      },
      {
        id: 'q_win_04',
        number: 4,
        level: 4,
        title: 'Top-2 Paid Instructors per Department (CTE + Window Filter)',
        concept: 'Window Function in CTE + Filter',
        description: 'Find the top 2 highest-paid instructors in each department. Display `department_id`, `first_name`, `last_name`, `salary`, and `salary_rank`. (Hint: Compute `DENSE_RANK() OVER (PARTITION BY department_id ORDER BY salary DESC)` inside a CTE, then filter `salary_rank <= 2`).',
        tables: ['instructors'],
        starterSql: '-- Top 2 per department using window ranking\nWITH ranked_instructors AS (\n  SELECT department_id, first_name, last_name, salary,\n         DENSE_RANK() OVER (PARTITION BY department_id ORDER BY salary DESC) AS salary_rank\n  FROM instructors\n)\nSELECT ',
        hint1: 'Filter WHERE salary_rank <= 2 in your outer query.',
        hint2: 'SELECT department_id, first_name, last_name, salary, salary_rank FROM ranked_instructors WHERE salary_rank <= 2 ORDER BY department_id, salary_rank;',
        hint3: 'WITH ranked_instructors AS (SELECT department_id, first_name, last_name, salary, DENSE_RANK() OVER (PARTITION BY department_id ORDER BY salary DESC) AS salary_rank FROM instructors) SELECT department_id, first_name, last_name, salary, salary_rank FROM ranked_instructors WHERE salary_rank <= 2 ORDER BY department_id, salary_rank;',
        solution: 'WITH ranked_instructors AS (SELECT department_id, first_name, last_name, salary, DENSE_RANK() OVER (PARTITION BY department_id ORDER BY salary DESC) AS salary_rank FROM instructors) SELECT department_id, first_name, last_name, salary, salary_rank FROM ranked_instructors WHERE salary_rank <= 2 ORDER BY department_id, salary_rank;',
        orderMatters: true
      }
    ]
  },

  // --------------------------------------------------------------------------
  // MODERN SQL: GROUPING SETS & LATERAL Joins
  // --------------------------------------------------------------------------
  {
    chapterId: 'ch_modern_advanced',
    chapterNumber: 'M3',
    chapterTitle: 'Modern SQL 3: GROUPING SETS & LATERAL Joins',
    description: 'CMU 15-445 Lecture 02 modern SQL features: multi-level aggregations (GROUPING SETS, ROLLUP) and correlated LATERAL subquery joins.',
    questions: [
      {
        id: 'q_adv_01',
        number: 1,
        level: 3,
        title: 'Multi-Dimensional Subtotals with GROUPING SETS',
        concept: 'GROUP BY GROUPING SETS',
        description: 'Using `GROUPING SETS`, count the number of course sections offered grouped by:\n1. `(department_id, semester)`\n2. `(department_id)`\n3. `()` (Grand Total)\nDisplay `department_id`, `semester`, and `section_count`.',
        tables: ['sections', 'courses'],
        starterSql: '-- GROUPING SETS multi-level aggregations\nSELECT c.department_id, s.semester, COUNT(*) AS section_count\nFROM sections s\nJOIN courses c ON s.course_id = c.course_id\nGROUP BY GROUPING SETS (\n  \n);',
        hint1: 'Specify (c.department_id, s.semester), (c.department_id), and () inside GROUPING SETS.',
        hint2: 'GROUP BY GROUPING SETS ((c.department_id, s.semester), (c.department_id), ())',
        hint3: 'SELECT c.department_id, s.semester, COUNT(*) AS section_count FROM sections s JOIN courses c ON s.course_id = c.course_id GROUP BY GROUPING SETS ((c.department_id, s.semester), (c.department_id), ());',
        solution: 'SELECT c.department_id, s.semester, COUNT(*) AS section_count FROM sections s JOIN courses c ON s.course_id = c.course_id GROUP BY GROUPING SETS ((c.department_id, s.semester), (c.department_id), ());',
        orderMatters: false
      },
      {
        id: 'q_adv_02',
        number: 2,
        level: 4,
        title: 'Correlated Subquery via LATERAL Join',
        concept: 'LATERAL Subquery Join',
        description: 'For every course in the `courses` table, use a `LATERAL` subquery to calculate the count of enrolled students AS `enrollment_count` across all its sections. Display `course_code`, `title`, and `enrollment_count`.',
        tables: ['courses', 'sections', 'enrollments'],
        starterSql: '-- LATERAL join invoking correlated subquery for each course\nSELECT c.course_code, c.title, lat.enrollment_count\nFROM courses c,\nLATERAL (\n  \n) AS lat;',
        hint1: 'Inside LATERAL, SELECT COUNT(e.enrollment_id) AS enrollment_count FROM sections s JOIN enrollments e ON s.section_id = e.section_id WHERE s.course_id = c.course_id.',
        hint2: 'LATERAL (SELECT COUNT(e.enrollment_id) AS enrollment_count FROM sections s JOIN enrollments e ON s.section_id = e.section_id WHERE s.course_id = c.course_id) AS lat',
        hint3: 'SELECT c.course_code, c.title, lat.enrollment_count FROM courses c, LATERAL (SELECT COUNT(e.enrollment_id) AS enrollment_count FROM sections s JOIN enrollments e ON s.section_id = e.section_id WHERE s.course_id = c.course_id) AS lat;',
        solution: 'SELECT c.course_code, c.title, lat.enrollment_count FROM courses c, LATERAL (SELECT COUNT(e.enrollment_id) AS enrollment_count FROM sections s JOIN enrollments e ON s.section_id = e.section_id WHERE s.course_id = c.course_id) AS lat;',
        orderMatters: false
      }
    ]
  }
];

// Helper to get questions for practice mode (topic list format)
const getCurriculum = () => {
  return chapters.map(ch => ({
    topicId: ch.chapterId,
    topicTitle: ch.chapterTitle,
    description: ch.description,
    questions: ch.questions
  }));
};

module.exports = {
  chapters,
  getCurriculum
};
