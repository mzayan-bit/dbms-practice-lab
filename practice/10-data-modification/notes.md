# Topic 10: Data Modification (DML) — Notes & Concepts

## 1. DML Syntax Reference

```sql
-- INSERT
INSERT INTO students (first_name, last_name, email, enrollment_date)
VALUES ('John', 'Doe', 'john@student.edu', CURRENT_DATE)
RETURNING student_id;

-- UPDATE with JOIN/FROM
UPDATE students s
SET gpa = 4.0
WHERE s.student_id = 1;

-- DELETE
DELETE FROM enrollments WHERE status = 'dropped';
```

---

## 2. PostgreSQL RETURNING Clause
PostgreSQL allows any `INSERT`, `UPDATE`, or `DELETE` to return modified rows directly:
```sql
DELETE FROM enrollments WHERE status = 'dropped' RETURNING *;
```

---

## 3. UPSERT (`ON CONFLICT`)
Handles unique constraint violations gracefully:
```sql
INSERT INTO courses (course_code, title, credits, department_id)
VALUES ('CS101', 'Intro to CS (New)', 4, 1)
ON CONFLICT (course_code)
DO UPDATE SET title = EXCLUDED.title;
```

---

## 4. Foreign Key Constraints on DML
- `ON DELETE RESTRICT` (default): Prevents deleting parent row if child rows exist.
- `ON DELETE CASCADE`: Automatically deletes child rows when parent is deleted.
- `ON DELETE SET NULL`: Sets child foreign key column to `NULL`.
