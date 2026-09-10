# Topic 08: Window Functions — Exercises

> [!NOTE]
> Write your queries in `attempts.sql` and execute them against PostgreSQL (`sql_practice`).
> Share your query with Antigravity for evaluation.

---

### Question 1 (Level 1: Basic Window Ranking)
Assign a ranking to all students based on their `gpa` in descending order. Display `student_id`, `first_name`, `last_name`, `gpa`, and their rank using `ROW_NUMBER()`, `RANK()`, and `DENSE_RANK()`.

---

### Question 2 (Level 2: Partitioned Ranking)
Rank students within their respective departments (`PARTITION BY department_id`) by `gpa` descending. Display `department_id`, `first_name`, `last_name`, `gpa`, and `rank_in_dept`.

---

### Question 3 (Level 3: Window Aggregates without Collapse)
For every student, display their `first_name`, `last_name`, `gpa`, the average GPA of their department (`dept_avg_gpa`), and the difference between their GPA and their departmental average (`gpa_diff`).

---

### Question 4 (Level 4: Offset Functions with LAG / LEAD)
List all instructors ordered by hire date. Display `first_name`, `last_name`, `hire_date`, `salary`, and the salary of the instructor hired immediately prior using `LAG()`.

---

### Question 5 (Level 5: Top-N per Group via CTE & Window Filter)
Find the top 2 highest-paid instructors in each department. (Hint: Window functions cannot be filtered directly in `WHERE`, wrap with a CTE or subquery).
