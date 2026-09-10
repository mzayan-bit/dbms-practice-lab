# Topic 08: Window Functions — Notes & Concepts

## 1. What is a Window Function?
Unlike standard `GROUP BY` aggregates that collapse multiple rows into a single row, a window function performs calculations across a set of table rows that are related to the current row **without collapsing rows**.

```sql
function_name() OVER (
    PARTITION BY partition_col
    ORDER BY sort_col
    ROWS BETWEEN ...
)
```

---

## 2. Ranking Functions Compared

| Function | Behavior on Ties | Example Output on Ties (10, 10, 8) |
| :--- | :--- | :--- |
| **`ROW_NUMBER()`** | Sequential unique integers, arbitrary tie breaking | `1, 2, 3` |
| **`RANK()`** | Same rank for ties, skips subsequent ranks | `1, 1, 3` |
| **`DENSE_RANK()`**| Same rank for ties, NO gaps in numbering | `1, 1, 2` |

---

## 3. Value & Offset Functions
- `LAG(col, offset, default)`: Retrieves value from a preceding row.
- `LEAD(col, offset, default)`: Retrieves value from a succeeding row.
- `FIRST_VALUE(col)` / `LAST_VALUE(col)`: Value from boundary rows in window frame.

---

## 4. Execution Order & WHERE Limitation
Window functions are evaluated in the `SELECT` phase (after `WHERE`, `GROUP BY`, and `HAVING`).
- **You cannot write**: `WHERE ROW_NUMBER() OVER (...) <= 2`
- **Solution**: Compute the window function inside a CTE or derived subquery, then filter the resulting column in the outer `WHERE`.
