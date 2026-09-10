# Topic 12: Views & Materialized Views — Notes & Concepts

## 1. Standard Views vs Materialized Views

| Feature | Standard View (`CREATE VIEW`) | Materialized View (`CREATE MATERIALIZED VIEW`) |
| :--- | :--- | :--- |
| **Storage** | Virtual (saved query definition only, 0 disk storage for rows) | Physical (results calculated and saved to disk) |
| **Data Freshness** | Always real-time (evaluated dynamically on each query) | Snapshot at creation/refresh time |
| **Query Speed** | Same speed as underlying query | Fast table-scan speed / indexed |
| **Update Mechanism** | Automatic | Requires `REFRESH MATERIALIZED VIEW view_name;` |

---

## 2. Syntax Reference
```sql
-- Standard View
CREATE OR REPLACE VIEW v_active_students AS
SELECT student_id, first_name, last_name, gpa
FROM students
WHERE gpa >= 2.0;

-- Materialized View
CREATE MATERIALIZED VIEW mv_dept_stats AS
SELECT department_id, COUNT(*) AS student_count
FROM students
GROUP BY department_id;

-- Refreshing
REFRESH MATERIALIZED VIEW mv_dept_stats;
-- Or concurrently without locking reads (requires unique index on MV)
REFRESH MATERIALIZED VIEW CONCURRENTLY mv_dept_stats;
```

---

## 3. Why Use Views?
- **Security / Abstraction**: Restricts user access to specific columns (e.g. hiding salaries or passwords).
- **Simplicity**: Encapsulates complex multi-table joins and business logic into a single logical table.
- **Consistency**: Standardizes metrics (e.g., standard formula for GPA honors or revenue).
