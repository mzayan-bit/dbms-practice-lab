# Topic 01: SELECT & Projections — Notes & Concepts

## 1. Core Syntax & Execution Order

Even though a SQL query begins with `SELECT`, SQL is evaluated logically in this general order:
1. `FROM` (identifies table source)
2. `WHERE` (row filtering)
3. `GROUP BY` (aggregation grouping)
4. `HAVING` (group filtering)
5. `SELECT` (projection and expression evaluation)
6. `DISTINCT` (duplicate removal)
7. `ORDER BY` (sorting)
8. `LIMIT` / `OFFSET` (result pagination)

---

## 2. Key Concepts

### Basic Projection
```sql
SELECT column1, column2 FROM table_name;
```

### Column Aliasing
Aliases rename the output column header for clarity:
```sql
SELECT first_name AS given_name FROM instructors;
```

### String Concatenation in PostgreSQL
In PostgreSQL and standard SQL, string concatenation uses the `||` operator or `CONCAT()`:
```sql
SELECT first_name || ' ' || last_name AS full_name FROM students;
```

### Eliminating Duplicates (`DISTINCT`)
```sql
SELECT DISTINCT department_id FROM students;
```

### Arithmetic & Expressions
```sql
SELECT salary, ROUND(salary * 1.10, 2) AS projected_salary FROM instructors;
```

---

## 3. Common Pitfalls
- **Using `SELECT *` in production**: Always specify exact columns to avoid fetching unnecessary data and breaking schemas when columns change.
- **Null Concatenation**: In standard SQL, `'Hello' || NULL` results in `NULL`. In PostgreSQL, use `CONCAT(a, ' ', b)` or `COALESCE` if nullable fields might be concatenated.
- **Misunderstanding `DISTINCT`**: `DISTINCT` applies to the entire combination of selected columns in the projection list, not just the immediately following column.
