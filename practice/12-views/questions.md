# Topic 12: Views & Materialized Views — Exercises

> [!NOTE]
> Write your queries in `attempts.sql` and execute them against PostgreSQL (`sql_practice`).
> Share your query with Antigravity for evaluation.

---

### Question 1 (Level 1: Creating a Standard View)
Create a view named `v_student_directory` that joins `students`, `departments`, and `instructors` (advisor). It should display:
- `student_id`
- `student_name` (full name)
- `email`
- `dept_name`
- `advisor_name` (full name of advisor or `'Unassigned'`)

---

### Question 2 (Level 2: Querying and Filtering Views)
Query `v_student_directory` to find all students in the `'Computer Science'` department whose advisor is `'Alan Turing'`.

---

### Question 3 (Level 3: Creating a Summary / Reporting View)
Create a view `v_department_analytics` that summarizes each department:
- `dept_name`
- Total faculty count (`faculty_count`)
- Total student count (`student_count`)
- Average student GPA (`avg_gpa`)
- Total annual faculty payroll (`annual_payroll`)

---

### Question 4 (Level 4: Materialized Views & Refresh)
Create a `MATERIALIZED VIEW` named `mv_course_enrollment_stats` that calculates total lifetime enrollments and average numeric grade per course.
Then write the SQL command to refresh this materialized view with updated data.
