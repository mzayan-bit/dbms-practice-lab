# Database Management Systems & SQL Practice Environment

A dedicated, long-term learning and practice environment for mastering SQL and Database Management Systems (DBMS). Built for active recall and query writing against a local **PostgreSQL** database, featuring both an interactive **Visual SQL Learning Studio** and **Antigravity AI Tutoring**.

---

## 1. Learning Philosophy & Workflow

The core objective is active problem-solving and manual SQL query writing. Rather than reading passive solutions or copying AI-generated queries, you write and test every query against PostgreSQL.

```
Course Slides / Book Chapter / Topic
                 ↓
      Analyze Core Concepts
                 ↓
   Antigravity Gives ONE Question
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
   Next Progressive Challenge
```

---

## 2. Visual SQL Learning Studio

The repository includes a web-based **SQL Learning Studio** running locally at `http://localhost:3000`.

### Key Features
- **Visual Table & Schema Explorer**: Live table schemas (columns, data types, primary/foreign keys) and row previews for all tables in `sql_practice`.
- **In-Browser SQL Editor**: Run queries against PostgreSQL with `Ctrl/Cmd + Enter` and inspect rich data grids with execution timings.
- **Automated Correctness Checker**: Evaluates queries against canonical result sets and provides diagnostic guidance on row counts, projected columns, or filter errors.
- **3-Tier Progressive Hints**: Conceptual hint $\rightarrow$ SQL operator hint $\rightarrow$ Query skeleton outline.
- **One-Click Database Reset**: Restore clean seed data anytime with a single click.

```bash
# Launch the Visual Studio (opens http://localhost:3000)
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

## 4. Repository Structure

```
DBMS/
├── AGENTS.md                  # Permanent tutoring instructions & protocol
├── Makefile                   # Helper commands (make ui, make setup, make reset, make connect)
├── README.md                  # Documentation & quickstart
├── .gitignore                 # Excludes private slides, PDFs, credentials, dumps
├── curriculum.js              # Structured question sets & validator solutions
├── server.js                  # Express backend for SQL Studio
├── public/                    # Frontend UI (HTML, Modern Dark CSS, Reactive JS)
├── old-coursework/            # Preserved legacy coursework & mid prep
├── context/
│   └── README.md              # Guide for adding course slides / textbook chapters
├── database/
│   ├── schema.sql             # University relational schema DDL
│   ├── seed.sql               # Synthetic dataset
│   └── reset.sql              # Complete database wipe and re-seed script
├── practice/
│   ├── progress.md            # Learning tracker (mastered, revision, common mistakes)
│   ├── 01-select/             # Questions, attempts.sql, and notes per topic
│   ├── 02-filtering/
│   ├── 03-functions/
│   ├── 04-group-by/
│   ├── 05-joins/
│   ├── 06-subqueries/
│   ├── 07-ctes/
│   ├── 08-window-functions/
│   ├── 09-set-operations/
│   ├── 10-data-modification/
│   ├── 11-transactions/
│   ├── 12-views/
│   ├── 13-indexes/
│   └── 14-advanced-sql/
└── challenges/
    ├── easy/                  # Unlabelled practical challenges
    ├── medium/                # Intermediate / interview problems
    └── hard/                  # Complex analytics & FAANG-style SQL
```

---

## 5. Quickstart & Commands

Ensure PostgreSQL is running locally with database `sql_practice`:

```bash
# 1. Launch Visual Learning Studio in Browser
make ui

# 2. Database Maintenance Commands
make setup      # Initialize schema and seed database from scratch
make reset      # Reset database back to clean initial state
make connect    # Open interactive psql session to sql_practice
make test-db    # Run database integrity and query validation suite
make status     # View row counts across all practice tables
```

---

## 6. How to Practice with Antigravity

In addition to the Web Studio, you can practice directly through Antigravity using any trigger phrase:

- **`"Start practice"`** or **`"Practice topic 01"`**:
  Begins standard topic-by-topic practice starting from Level 1.
- **`"Practice chapter X"`**:
  Reads materials dropped into `context/` and builds course-aligned exercises.
- **`"revision mode"`**:
  Presents questions targeting concepts you previously struggled with in `practice/progress.md`.
- **`"challenge mode"`** (`easy` / `medium` / `hard`):
  Gives realistic business/interview problems where the required SQL technique is unlabelled.

### Hint System
- **Hint 1**: Conceptual guidance.
- **Hint 2**: SQL operator / clause required.
- **Hint 3**: Query skeleton outline.
- Say **`"show solution"`** to reveal the canonical query if you get stuck.
