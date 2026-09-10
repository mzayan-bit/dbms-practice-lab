# Topic 05: Multi-Table JOINs — Notes & Concepts

## 1. Types of SQL JOINs

| Join Type | Description | Handling of Unmatched Rows |
| :--- | :--- | :--- |
| **`INNER JOIN`** | Returns rows when predicate matches in both tables. | Discarded |
| **`LEFT JOIN`** | Returns all rows from left table + matched right rows. | Kept with `NULL` on right |
| **`RIGHT JOIN`** | Returns all rows from right table + matched left rows. | Kept with `NULL` on left |
| **`FULL OUTER JOIN`** | Returns all rows from both tables. | Kept with `NULL` where unmatched |
| **`CROSS JOIN`** | Cartesian product (every row with every other row). | $N \times M$ rows |

---

## 2. Anti-Join Pattern (Finding Non-Existent Links)
To find rows in Table A that have no match in Table B:
```sql
SELECT a.*
FROM students a
LEFT JOIN enrollments b ON a.student_id = b.student_id
WHERE b.student_id IS NULL;
```

---

## 3. Self-Joins
Joining a table to itself using distinct aliases (essential for graphs, trees, manager-employee, or course-prerequisite relationships):
```sql
SELECT
    c.course_code,
    c.title,
    p.course_code AS prereq_code
FROM courses c
LEFT JOIN courses p ON c.prerequisite_course_id = p.course_id;
```

---

## 4. Common Pitfalls
- **Accidental Cartesian Products**: Missing or incorrect `ON` clause turns a join into an uncontrolled `CROSS JOIN`.
- **Filtering the RIGHT table in `WHERE` during a `LEFT JOIN`**: If you write `LEFT JOIN b ON ... WHERE b.status = 'active'`, any row where `b` was `NULL` is discarded, effectively converting your `LEFT JOIN` into an `INNER JOIN`. Put the condition in the `ON` clause instead: `LEFT JOIN b ON ... AND b.status = 'active'`.
