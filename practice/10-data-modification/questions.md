# Topic 10: Data Modification (DML) — Exercises

> [!NOTE]
> Write your queries in `attempts.sql` and execute them against PostgreSQL (`sql_practice`).
> When you are done testing, you can run `make reset` to restore original seed data.

---

### Question 1 (Level 1: INSERT with RETURNING)
Insert a new student into the `students` table:
- Name: `'Zayan'`, `'Malik'`
- Email: `'zayan.m@student.edu'`
- Enrollment Date: `CURRENT_DATE`
- GPA: `3.90`, Credits: `15`, Department: `1`, Advisor: `1`
Use PostgreSQL's `RETURNING student_id, enrollment_date` clause to return the generated ID.

---

### Question 2 (Level 2: UPDATE with Calculations)
Give all instructors in the Computer Science department (`department_id = 1`) a 5% salary increase.

---

### Question 3 (Level 3: Correlated UPDATE)
Update each student's `credits_completed` by recalculating the sum of course credits for all sections they have marked as `'completed'` in `enrollments`.

---

### Question 4 (Level 3: Conditional DELETE with FK constraints)
Delete all enrollment records that have status `'dropped'`. Verify how many rows were removed.

---

### Question 5 (Level 4: UPSERT with ON CONFLICT)
Insert a new course code `'CS101'`, Title `'Intro to Computer Science Revised'`, Credits `4`, Department `1`. If the course code already exists (`ON CONFLICT (course_code)`), update the `title` to the new value instead of throwing an error.
