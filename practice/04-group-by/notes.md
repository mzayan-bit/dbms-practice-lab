# Topic 04: GROUP BY & HAVING — Notes & Concepts

## 1. The Distinction: WHERE vs HAVING

| Clause | Operates On | When Evaluated | Can use aggregate functions? |
| :--- | :--- | :--- | :--- |
| **`WHERE`** | Individual rows | Before grouping occurs | **No** (e.g. `WHERE AVG(gpa) > 3` is invalid) |
| **`HAVING`** | Aggregated groups | After grouping occurs | **Yes** (e.g. `HAVING AVG(gpa) > 3`) |

---

## 2. The Single-Value Rule in GROUP BY
Any column appearing in the `SELECT` projection that is NOT enclosed in an aggregate function **MUST** appear in the `GROUP BY` clause.

```sql
-- Valid
SELECT department_id, COUNT(*)
FROM students
GROUP BY department_id;

-- Invalid: first_name is not aggregated and not in GROUP BY
-- SELECT department_id, first_name, COUNT(*) FROM students GROUP BY department_id;
```

---

## 3. Multi-Column Grouping
Grouping by multiple columns produces a distinct bucket for every unique combination:
```sql
SELECT department_id, advisor_id, COUNT(*)
FROM students
GROUP BY department_id, advisor_id;
```

---

## 4. Common Pitfalls
- **Filtering aggregate values in `WHERE`**: Writing `WHERE COUNT(*) > 5` will throw a syntax error. Put this filter in `HAVING`.
- **Filtering raw rows in `HAVING`**: While syntactically allowed in some engines, writing `HAVING department_id = 1` is poor practice and slow because rows are grouped before being discarded. Filter raw rows in `WHERE` first.
