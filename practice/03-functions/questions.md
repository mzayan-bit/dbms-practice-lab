# Topic 03: Scalar & Aggregate Functions — Exercises

> [!NOTE]
> Write your queries in `attempts.sql` and execute them against PostgreSQL (`sql_practice`).
> Share your query with Antigravity for evaluation.

---

### Question 1 (Level 1: Basic Aggregates)
Calculate the overall university student statistics:
- Total number of students (`total_students`)
- Average GPA rounded to 2 decimals (`avg_gpa`)
- Maximum GPA (`max_gpa`)
- Minimum GPA (`min_gpa`)

---

### Question 2 (Level 2: String & Date Functions)
For all instructors, display:
- Full name in UPPERCASE (`INSTRUCTOR_NAME`)
- Email username (everything before the `@` symbol) AS `username`
- Years of service as of today rounded down to whole years AS `years_tenure` (Hint: use `AGE()` or `EXTRACT(YEAR FROM ...)`).

---

### Question 3 (Level 2: COALESCE & Null Handling)
List all students with their `first_name`, `last_name`, and their assigned advisor ID. If `advisor_id` is null, display `-1` AS `advisor_id`.

---

### Question 4 (Level 3: Conditional Expressions with CASE)
Classify each student's academic standing based on their `gpa`:
- `gpa >= 3.80` $\rightarrow$ `'Summa Cum Laude'`
- `gpa >= 3.50` $\rightarrow$ `'Magna Cum Laude'`
- `gpa >= 3.00` $\rightarrow$ `'Dean''s List'`
- `gpa >= 2.00` $\rightarrow$ `'Good Standing'`
- Otherwise $\rightarrow$ `'Academic Probation'`
Display `first_name`, `last_name`, `gpa`, and `academic_standing`.

---

### Question 5 (Level 3: Counting with Filtered Aggregates)
Count how many students have a `gpa >= 3.50` as `high_achievers` and how many have `gpa < 3.00` as `needs_support` in a single query across the entire university (Hint: conditional aggregation or `FILTER (WHERE ...)`).
