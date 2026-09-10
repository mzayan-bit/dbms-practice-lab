# Topic 13: Indexes & Query Execution Plans — Exercises

> [!NOTE]
> Write your queries in `attempts.sql` and execute them against PostgreSQL (`sql_practice`).
> Share your query with Antigravity for evaluation.

---

### Question 1 (Level 1: Reading EXPLAIN Plans)
Run an `EXPLAIN` on a simple filter query:
`SELECT * FROM students WHERE email = 'alice.smith@student.edu';`
Identify the node type (`Index Scan`, `Bitmap Index Scan`, or `Seq Scan`) and estimated startup/total cost.

---

### Question 2 (Level 2: Creating a Composite Index)
Create a composite B-Tree index on `enrollments` covering both `(student_id, status)` named `idx_enrollments_student_status`.

---

### Question 3 (Level 3: Partial / Filtered Indexes)
Create a partial index on `students` that only indexes students on academic probation (`gpa < 2.50`) named `idx_students_probation`. Explain why this saves disk space and write overhead.

---

### Question 4 (Level 4: EXPLAIN ANALYZE & Query Optimization)
Compare the execution plan of finding high-achieving CS students before and after creating an appropriate index using `EXPLAIN ANALYZE`:
`SELECT * FROM students WHERE department_id = 1 AND gpa > 3.80;`
Observe actual time and buffers hit.
