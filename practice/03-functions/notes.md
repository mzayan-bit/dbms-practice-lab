# Topic 03: Scalar & Aggregate Functions — Notes & Concepts

## 1. Aggregate Functions
Aggregate functions compute a single result from a set of input values:
- `COUNT(*)` counts rows (including nulls).
- `COUNT(column)` counts non-null values only.
- `AVG(col)`, `SUM(col)`, `MIN(col)`, `MAX(col)` ignore `NULL` values.

## 2. PostgreSQL Filter Clause on Aggregates
PostgreSQL supports standard SQL aggregate filtering:
```sql
SELECT
    COUNT(*) FILTER (WHERE gpa >= 3.5) AS honor_students,
    COUNT(*) FILTER (WHERE gpa < 2.0) AS probation_students
FROM students;
```

## 3. String & Date Functions in PostgreSQL
- String: `UPPER()`, `LOWER()`, `LENGTH()`, `SUBSTRING()`, `SPLIT_PART(str, delimiter, n)`, `TRIM()`, `REPLACE()`
- Date: `CURRENT_DATE`, `NOW()`, `AGE(date1, date2)`, `EXTRACT(YEAR FROM date_col)`, `DATE_TRUNC('month', date_col)`

## 4. Conditional Logic: CASE & COALESCE
```sql
-- COALESCE returns first non-null argument
SELECT COALESCE(advisor_id, 0) FROM students;

-- CASE Expression
SELECT first_name,
       CASE
           WHEN gpa >= 3.5 THEN 'Honors'
           WHEN gpa >= 3.0 THEN 'Good'
           ELSE 'Needs Improvement'
       END AS standing
FROM students;
```

## 5. Common Pitfalls
- **`COUNT(*)` vs `COUNT(col)`**: `COUNT(advisor_id)` will produce a lower number than `COUNT(*)` because students with `NULL` advisors are skipped.
- **Integer Division**: In PostgreSQL, `INT / INT` performs integer division (e.g. `5 / 2 = 2`). Use `5.0 / 2` or `CAST(a AS NUMERIC) / b`.
