# Topic 07: Common Table Expressions (CTEs) — Exercises

> [!NOTE]
> Write your queries in `attempts.sql` and execute them against PostgreSQL (`sql_practice`).
> Share your query with Antigravity for evaluation.

---

### Question 1 (Level 1: Basic WITH Clause)
Write a query using a single CTE named `high_salary_instructors` that selects instructors earning more than `100,000`. From this CTE, select `first_name`, `last_name`, and `salary` sorted descending.

---

### Question 2 (Level 2: CTE for Multi-Step Aggregation)
Create a CTE `dept_gpa_summary` calculating the average GPA per department. In the main query, join this CTE with `departments` to display `dept_name` and `avg_gpa`, ordered from highest to lowest.

---

### Question 3 (Level 3: Chained / Multiple CTEs)
Using two CTEs:
1. `student_enrollment_counts`: Count total enrolled sections per student.
2. `avg_enrollment`: Calculate the average count of enrollments across all students.
In the final query, find students whose total enrollment count exceeds the university average.

---

### Question 4 (Level 4: CTE for Comparative Ranking Analysis)
Construct a query using CTEs that finds the student with the highest GPA in each department without using window functions.

---

### Question 5 (Level 4: Recursive CTE Prerequisite Chain)
Write a recursive CTE that starts with the course `'CS401'` and traverses backwards through all its prerequisite courses (`CS301` $\rightarrow$ `CS201` $\rightarrow$ `CS101`), displaying `course_code`, `title`, and depth level.
