# Database Management Systems & SQL Practice Environment

A dedicated, long-term learning and practice environment for mastering SQL and Database Management Systems (DBMS). Built for active recall and query writing against a local **PostgreSQL** database, featuring an interactive **Visual SQL Learning Studio**, **Timed Mock Exam / Paper Engine**, and **Antigravity AI Tutoring**.

---

## 1. Learning Philosophy & Workflow

The core objective is active problem-solving and manual SQL query writing. Rather than reading passive solutions or copying AI-generated queries, you write and test every query against PostgreSQL.

```
Course Slides / Book Chapter / Topic
                 ↓
      Analyze Core Concepts
                 ↓
   Practice Studio OR Timed Mock Exam
                 ↓
   Write SQL Query in Studio / attempts.sql
                 ↓
   Execute Query in PostgreSQL
                 ↓
   Inspect Result Set & Visual Tables
                 ↓
   Auto-Grader / Tutor Evaluates Solution
  (Correctness, Efficiency, Edge Cases)
                 ↓
   Comprehensive Scorecard Review
```

---

## 2. Visual SQL Learning Studio & Exam Engine

The repository includes a web-based **SQL Learning Studio & Mock Exam Engine** running locally at `http://localhost:3000`.

### Modes of Operation

#### 📖 1. Practice Studio
- **Topic-by-Topic Learning**: Work sequentially through 14 comprehensive topics mapped to CMU 15-445 and textbook chapters.
- **Immediate Feedback**: Submit queries individually and get diagnostic feedback.
- **3-Tier Progressive Hints**: Concept nudge $\rightarrow$ SQL clause $\rightarrow$ Query skeleton.
- **Visual Table Explorer**: Inspect live database tables (`students`, `instructors`, `courses`, `departments`, etc.) side-by-side with questions.

#### 📝 2. Timed Mock Exam / Paper Engine
- **Multi-Chapter Selection & Strict Isolation**: Select any single chapter, a custom combination of multiple chapters, or all chapters together. Questions are drawn **strictly** from your selected chapter subset with zero mixing.
- **Random Paper Generator**: Every generated paper draws a fresh, randomized subset of questions with Fisher-Yates shuffling.
- **Configurable Question Counts**: Choose from **3, 5, 8, 10, or up to 15 questions** per exam paper.
- **Time Limits**: Choose between `10 Minutes` (Speed Drill), `20 Minutes` (Standard Quiz), `30 Minutes` (Midterm Paper), or `40 Minutes` (Comprehensive Exam).
- **Exam UI & Scratchpad**: Live countdown timer, Question Palette navigator (Answered, Unanswered, Flagged for Review), and live PostgreSQL scratchpad to test queries before submitting.
- **Post-Exam Scorecard**: Detailed grade report (A+, A, B, C, D, F), percentage score, question-by-question review, student output vs expected output, and canonical solutions with explanations.

```bash
# Launch the Visual Studio & Exam Engine (opens http://localhost:3000)
make ui
# or: npm start
```

---

## 3. PostgreSQL Practice Database (`sql_practice`)

The practice database simulates a realistic university management system with primary keys, foreign keys, constraints, and indexes.

### Entity Relationship Model

```
 ┌─────────────────┐       ┌─────────────────┐
 │   departments   │◄──────┤   instructors   │
 └────────┬────────┘       └────────┬────────┘
          ▲                         ▲
          │ department_id           │ advisor_id / instructor_id
 ┌────────┴────────┐                │
 │    students     │                │
 └────────┬────────┘                │
          ▲                         │
          │ student_id              │
 ┌────────┴────────┐       ┌────────┴────────┐       ┌─────────────────┐
 │   enrollments   ├──────►│    sections     ├──────►│     courses     │
 └────────┬────────┘       └─────────────────┘       └────────┬────────┘
          │                                                   │
          ▼ enrollment_id                                     ▼ prerequisite_course_id
 ┌─────────────────┐                                 ┌─────────────────┐
 │     grades      │                                 │ (courses self)  │
 └─────────────────┘                                 └─────────────────┘
```

### Tables Summary

| Table | Primary Key | Description | Key Foreign Keys |
| :--- | :--- | :--- | :--- |
| **`departments`** | `department_id` | Academic departments, buildings, and budgets | — |
| **`instructors`** | `instructor_id` | Faculty members, hire dates, and salaries | `department_id` $\rightarrow$ `departments` |
| **`students`** | `student_id` | Enrolled students, GPAs, and credits completed | `department_id`, `advisor_id` $\rightarrow$ `instructors` |
| **`courses`** | `course_id` | Course catalog and credit hours | `department_id`, `prerequisite_course_id` $\rightarrow$ `courses` |
| **`sections`** | `section_id` | Specific class offerings by semester/year | `course_id` $\rightarrow$ `courses`, `instructor_id` $\rightarrow$ `instructors` |
| **`enrollments`** | `enrollment_id` | Student course registrations and status | `student_id` $\rightarrow$ `students`, `section_id` $\rightarrow$ `sections` |
| **`grades`** | `grade_id` | Final grades, letter marks, and grade points | `enrollment_id` $\rightarrow$ `enrollments` |

---

## 4. Chapters & Syllabus Covered

| Chapter ID | Chapter / Topic Name | Key SQL & Relational Concepts |
| :--- | :--- | :--- |
| **`ch2`** | **Chapter 2: Relational Model & Algebra** | Selection ($\sigma$), Projection ($\pi$), Attribute Domains, Keys, Duplicate Elimination ($\delta$) |
| **`ch3.1`** | **Chapter 3.1: Predicate Filtering & Sorting** | `WHERE`, `AND`, `OR`, `NOT`, `BETWEEN`, `IN`, `LIKE`/`ILIKE`, `IS NULL`, `ORDER BY`, `LIMIT`, `OFFSET` |
| **`ch3.2`** | **Chapter 3.2: Functions, CASE & COALESCE** | `COUNT`, `SUM`, `AVG`, `MIN`, `MAX`, `FILTER (WHERE ...)`, `UPPER`, `SPLIT_PART`, `AGE`, `EXTRACT`, `CASE`, `COALESCE` |
| **`ch3.3`** | **Chapter 3.3: GROUP BY & HAVING** | Aggregation ($\gamma$), Multi-column grouping, `HAVING` vs `WHERE`, group filters |
| **`ch3.4`** | **Chapter 3.4: Multi-Table JOINs** | Relational Joins ($\bowtie$), `INNER JOIN`, `LEFT JOIN`, `RIGHT JOIN`, `FULL OUTER`, `CROSS JOIN`, Self-joins, Anti-joins |
| **`ch3.5`** | **Chapter 3.5: Nested Subqueries** | Scalar subqueries, Correlated subqueries, `IN`, `NOT IN`, `EXISTS`, `NOT EXISTS`, `ANY`, `ALL`, Derived tables |
| **`M1`** | **Modern SQL 1: Common Table Expressions** | `WITH`, Multiple Chained CTEs, Recursive CTEs |
| **`M2`** | **Modern SQL 2: Window Functions** | `OVER ()`, `PARTITION BY`, `ROW_NUMBER()`, `RANK()`, `DENSE_RANK()`, `LAG()`, `LEAD()`, moving averages |
| **`M3`** | **Modern SQL 3: Advanced Modern SQL** | `GROUPING SETS`, `ROLLUP`, `CUBE`, `LATERAL` Joins, DML `ON CONFLICT` UPSERT |

---

## 5. Quickstart Commands

```bash
# 1. Launch Visual Studio & Mock Exam Engine
make ui

# 2. Run Automated Test Suite
node test/test_exam_engine.js

# 3. Database Maintenance Commands
make setup      # Initialize schema and seed database from scratch
make reset      # Reset database back to clean initial state
make connect    # Open interactive psql session to sql_practice
make test-db    # Run database integrity and query validation suite
make status     # View row counts across all practice tables
```
