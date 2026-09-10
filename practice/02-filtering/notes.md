# Topic 02: Filtering & Sorting — Notes & Concepts

## 1. Comparison Operators & Logical Evaluation
- Comparison: `=`, `<>`, `!=`, `<`, `<=`, `>`, `>=`
- Logical: `AND`, `OR`, `NOT` (Note: `AND` takes operator precedence over `OR`)
- Ranges: `BETWEEN low AND high` (inclusive)
- Membership: `IN (val1, val2, ...)`

## 2. Three-Valued Logic (`NULL`)
In SQL, comparison with `NULL` yields `UNKNOWN`, not `TRUE` or `FALSE`.
- Always use `IS NULL` or `IS NOT NULL`.
- Never write `WHERE advisor_id = NULL` (this will match 0 rows).

## 3. String Matching
- `LIKE '%text%'` — case-sensitive pattern (`%` = any characters, `_` = single character).
- `ILIKE '%text%'` — PostgreSQL-specific case-insensitive matching.
- `SIMILAR TO` or regex operators (`~`, `~*`).

## 4. Sorting & Pagination
```sql
SELECT first_name, last_name, gpa
FROM students
ORDER BY gpa DESC, last_name ASC
LIMIT 5 OFFSET 0;
```
- PostgreSQL supports `NULLS FIRST` or `NULLS LAST` to control null positioning in sorts.

## 5. Common Pitfalls
- **Precedence bugs with OR**: `WHERE dept_id = 1 OR dept_id = 2 AND salary > 100000` evaluates as `dept_id = 1 OR (dept_id = 2 AND salary > 100000)`. Always use parentheses `WHERE (dept_id = 1 OR dept_id = 2) AND salary > 100000`.
