# Topic 09: Set Operations — Notes & Concepts

## 1. Set Operation Rules
All set operations require:
1. Both queries must select the **exact same number of columns**.
2. Corresponding columns must have **compatible data types**.
3. Output column names are determined by the **first query**.

---

## 2. Operator Reference

| Operator | Action | Duplicates Removed? |
| :--- | :--- | :--- |
| **`UNION`** | Combines results from Query 1 and Query 2 | **Yes** (sorts/deduplicates) |
| **`UNION ALL`** | Combines results from Query 1 and Query 2 | **No** (fastest, preserves all rows) |
| **`INTERSECT`** | Returns only rows present in BOTH queries | **Yes** |
| **`EXCEPT`** | Returns rows in Query 1 that do NOT appear in Query 2 | **Yes** |

*(Note: Oracle uses `MINUS` instead of `EXCEPT`; PostgreSQL uses standard SQL `EXCEPT`)*

---

## 3. Order By in Set Operations
`ORDER BY` can only appear once at the very end of the entire compound statement:
```sql
SELECT first_name FROM instructors
UNION ALL
SELECT first_name FROM students
ORDER BY first_name ASC;
```
