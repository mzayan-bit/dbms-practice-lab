# Topic 04: GROUP BY & HAVING — Exercises

> [!NOTE]
> Write your queries in `attempts.sql` and execute them against PostgreSQL (`sql_practice`).
> Share your query with Antigravity for evaluation.

---

### Question 1 (Level 1: Basic Grouping)
Find the total number of students and their average GPA for each `department_id`. Display `department_id`, `student_count`, and `avg_gpa` (rounded to 2 decimal places).

---

### Question 2 (Level 2: Grouping with Pre-Filtering)
For students who have earned more than 30 credits (`credits_completed > 30`), calculate the average GPA per department. Exclude students without a department.

---

### Question 3 (Level 2: HAVING Clause on Aggregates)
Find all departments (by `department_id`) that have at least 3 students AND an average GPA greater than `3.40`.

---

### Question 4 (Level 3: Multi-column Grouping)
Find the number of sections offered for each course in each semester. Display `course_id`, `semester`, `year`, and `section_count`, sorted by `course_id` and `year` descending.

---

### Question 5 (Level 4: Advanced Grouping & Filter Differentiation)
Find the instructors (`instructor_id`) who have taught sections in Fall 2024 with a total combined section capacity of at least 40 students. Display `instructor_id` and `total_capacity`.
