# Topic 14: Advanced SQL Techniques — Exercises

> [!NOTE]
> Write your queries in `attempts.sql` and execute them against PostgreSQL (`sql_practice`).
> Share your query with Antigravity for evaluation.

---

### Question 1 (Level 3: GROUPING SETS & ROLLUP)
Write a query using `ROLLUP` to calculate the total count of enrolled students grouped by `(department_id, semester, year)`. Include subtotals for each department, each semester, and the grand total across the university.

---

### Question 2 (Level 4: Recursive Hierarchy with Breadth / Path Tracking)
Using a recursive CTE, build a complete course prerequisite path for every advanced course (displaying the root introductory course, intermediate prerequisites, and full prerequisite breadcrumb string e.g. `'CS101 -> CS201 -> CS301 -> CS401'`).

---

### Question 3 (Level 4: Pivot / Conditional Aggregation Matrix)
Create a cross-tabulation report displaying each department name along with count of students in GPA buckets:
- `High` (GPA $\ge$ 3.5)
- `Medium` (3.0 $\le$ GPA $<$ 3.5)
- `Low` (GPA $<$ 3.0)

---

### Question 4 (Level 5: Cumulative Distribution & Percentile Windows)
Using `CUME_DIST()` and `PERCENT_RANK()`, calculate the exact percentile standing of each student within their academic department based on GPA.
