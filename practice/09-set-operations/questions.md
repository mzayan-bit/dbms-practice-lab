# Topic 09: Set Operations — Exercises

> [!NOTE]
> Write your queries in `attempts.sql` and execute them against PostgreSQL (`sql_practice`).
> Share your query with Antigravity for evaluation.

---

### Question 1 (Level 1: UNION vs UNION ALL)
Combine all distinct first and last names of both instructors and students into a single result set. Compare the count when using `UNION` versus `UNION ALL`.

---

### Question 2 (Level 2: INTERSECT Common Entities)
Find any first names that are shared by both a student and an instructor using `INTERSECT`.

---

### Question 3 (Level 2: EXCEPT / Set Difference)
Find all department IDs that have instructors but currently have NO enrolled students using the `EXCEPT` operator.

---

### Question 4 (Level 3: Multi-query Set Operations with Filtering)
List all courses offered in Fall 2024 that were NOT offered in Spring 2025 using `EXCEPT`. Display `course_id`.

---

### Question 5 (Level 4: Set Operation vs Anti-Join Performance)
Write a query using `EXCEPT` to find all student IDs who have not received any grades. Then, write an equivalent alternative using `LEFT JOIN / IS NULL` or `NOT EXISTS`.
