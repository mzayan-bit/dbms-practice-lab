# Topic 01: SELECT & Projections — Exercises

> [!NOTE]
> Write your queries in `attempts.sql` and execute them against your local PostgreSQL database (`sql_practice`).
> When ready, share your query with Antigravity for evaluation.

---

### Question 1 (Level 1: Basic Syntax)
Retrieve all columns and all rows from the `departments` table.

---

### Question 2 (Level 1: Column Projection)
Select the `first_name`, `last_name`, and `email` of all instructors.

---

### Question 3 (Level 2: Column Aliases & Concatenation)
Display the full name of every student as a single column named `full_name` (in the format `"First Last"`), along with their `gpa` and `credits_completed`.

---

### Question 4 (Level 2: Distinct Values)
Retrieve all unique department IDs present in the `students` table, aliasing the column as `enrolled_department_id`.

---

### Question 5 (Level 3: Arithmetic Projections & Rounding)
Calculate a projected 10% annual salary raise for each instructor. Display:
- `first_name`
- `last_name`
- `salary` AS `current_salary`
- The projected salary rounded to 2 decimal places AS `projected_salary`
