# Topic 07: Common Table Expressions (CTEs) — Notes & Concepts

## 1. What is a CTE?
A Common Table Expression (CTE) is a temporary, named result set defined using the `WITH` clause that exists only during the execution of a single query.

```sql
WITH cte_name AS (
    SELECT ...
)
SELECT * FROM cte_name;
```

---

## 2. Multiple & Chained CTEs
Separate individual CTE definitions with commas (the `WITH` keyword is used only once):
```sql
WITH dept_stats AS (
    SELECT department_id, AVG(gpa) AS avg_gpa FROM students GROUP BY department_id
),
overall_stat AS (
    SELECT AVG(avg_gpa) AS benchmark FROM dept_stats
)
SELECT * FROM dept_stats WHERE avg_gpa > (SELECT benchmark FROM overall_stat);
```

---

## 3. Recursive CTE Syntax
Recursive CTEs are used to query hierarchical, tree, or graph structures:
```sql
WITH RECURSIVE prereq_tree AS (
    -- Anchor Member
    SELECT course_id, title, prerequisite_course_id, 1 AS level
    FROM courses
    WHERE course_code = 'CS401'

    UNION ALL

    -- Recursive Member
    SELECT c.course_id, c.title, c.prerequisite_course_id, p.level + 1
    FROM courses c
    JOIN prereq_tree p ON c.course_id = p.prerequisite_course_id
)
SELECT * FROM prereq_tree;
```

---

## 4. Advantages of CTEs vs Subqueries
- **Readability**: Code reads top-to-bottom rather than nested inside-out.
- **Reusability**: A CTE can be referenced multiple times within the same outer query.
- **Modularity**: Easy to test individual blocks before combining them.
