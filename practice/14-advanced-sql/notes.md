# Topic 14: Advanced SQL Techniques — Notes & Concepts

## 1. Multi-Dimensional Aggregation: ROLLUP & CUBE

```sql
-- ROLLUP creates hierarchical subtotals (A,B,C -> A,B -> A -> Total)
SELECT department_id, semester, COUNT(*)
FROM sections s
JOIN courses c ON s.course_id = c.course_id
GROUP BY ROLLUP (department_id, semester);

-- CUBE creates all 2^N possible subtotal combinations
SELECT department_id, semester, COUNT(*)
FROM sections s
JOIN courses c ON s.course_id = c.course_id
GROUP BY CUBE (department_id, semester);
```

---

## 2. Advanced Window Analytics
- `CUME_DIST()`: Relative rank of value (number of preceding rows / total rows).
- `PERCENT_RANK()`: Relative position in fraction between 0.0 and 1.0.
- `NTILE(n)`: Divides ordered partition into $n$ equal buckets/quantiles.

---

## 3. Pivot Tables via Conditional Aggregation
```sql
SELECT
    dept_name,
    COUNT(*) FILTER (WHERE gpa >= 3.5) AS high_gpa_count,
    COUNT(*) FILTER (WHERE gpa < 3.5 AND gpa >= 3.0) AS med_gpa_count,
    COUNT(*) FILTER (WHERE gpa < 3.0) AS low_gpa_count
FROM departments d
LEFT JOIN students s ON d.department_id = s.department_id
GROUP BY dept_name;
```
