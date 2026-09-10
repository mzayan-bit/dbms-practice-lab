# Topic 05: Multi-Table JOINs — Exercises

> [!NOTE]
> Write your queries in `attempts.sql` and execute them against PostgreSQL (`sql_practice`).
> Share your query with Antigravity for evaluation.

---

### Question 1 (Level 1: Basic INNER JOIN)
List every student's full name along with their department name (`dept_name`) and building.

---

### Question 2 (Level 2: LEFT JOIN for Missing Relations)
List ALL instructors and the course codes of sections they have taught. Include instructors who have never taught any sections (their course code should appear as `NULL`).

---

### Question 3 (Level 2: Self-JOIN on Hierarchical Data)
List all courses along with the title of their prerequisite course. If a course has no prerequisite, display `'None'` as the prerequisite title (Hint: `LEFT JOIN` and `COALESCE`).

---

### Question 4 (Level 3: Multi-Table Join with Aggregations)
For each department, calculate the total number of enrolled students and the average numeric score on completed grades. Display `dept_name`, `total_enrolled`, and `avg_score` (rounded to 2 decimal places).

---

### Question 5 (Level 4: Anti-Join / Finding Unmatched Records)
Find all students who have NEVER enrolled in any course section. Display their `student_id`, `first_name`, `last_name`, and `email`.
