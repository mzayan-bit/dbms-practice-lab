# Topic 06: Subqueries — Notes & Concepts

## 1. Classification of Subqueries

- **Scalar Subquery**: Returns exactly 1 row and 1 column. Can be placed anywhere an expression is expected (SELECT, WHERE, HAVING).
- **Multi-Row Subquery**: Returns 1 column with multiple rows (used with `IN`, `NOT IN`, `ANY`, `ALL`).
- **Correlated Subquery**: References columns from the outer query. Evaluated once per outer row.
- **Derived Table**: A subquery in the `FROM` clause; must always be aliased.

---

## 2. The `NOT IN` with NULLs Trap (Critical!)
If a subquery evaluated by `NOT IN` returns even a single `NULL` value, the entire `NOT IN` expression evaluates to `UNKNOWN` (falsy) for all rows, returning 0 records.

```sql
-- DANGEROUS: If advisor_id contains NULL, returns empty result
SELECT * FROM instructors WHERE instructor_id NOT IN (SELECT advisor_id FROM students);

-- SAFE: Use NOT EXISTS or filter out NULLs
SELECT * FROM instructors i
WHERE NOT EXISTS (
    SELECT 1 FROM students s WHERE s.advisor_id = i.instructor_id
);
```

---

## 3. EXISTS vs IN
- `EXISTS` tests for the existence of rows matching a condition. It terminates scanning as soon as the first matching row is found (short-circuiting).
- Use `SELECT 1` or `SELECT *` inside `EXISTS` (they behave identically).
