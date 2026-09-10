# Topic 06: Subqueries (Correlated & Scalar) — Exercises

> [!NOTE]
> Write your queries in `attempts.sql` and execute them against PostgreSQL (`sql_practice`).
> Share your query with Antigravity for evaluation.

---

### Question 1 (Level 1: Scalar Subquery in WHERE)
Find all students whose `gpa` is strictly higher than the university-wide average GPA.

---

### Question 2 (Level 2: Subquery with IN / NOT IN)
Find the names of all instructors who are NOT currently assigned as an advisor to any student.

---

### Question 3 (Level 3: Correlated Subquery with EXISTS)
Find all departments that offer at least one course with 4 credits using an `EXISTS` clause. Display `dept_name` and `building`.

---

### Question 4 (Level 3: Correlated Subquery for Comparative Analysis)
For every student, find their `first_name`, `last_name`, `gpa`, and whether their GPA is above the average GPA of **their specific department** (using a correlated subquery in `WHERE` or `SELECT`).

---

### Question 5 (Level 4: Subqueries in FROM (Derived Tables))
Using a derived table in the `FROM` clause, calculate the average instructor salary per department, and then find the maximum among those department averages.
