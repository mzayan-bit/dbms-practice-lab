# Topic 02: Filtering & Sorting — Exercises

> [!NOTE]
> Write your queries in `attempts.sql` and execute them against PostgreSQL (`sql_practice`).
> Share your query with Antigravity for evaluation.

---

### Question 1 (Level 1: Basic WHERE Filter)
Find all students who have a `gpa` greater than or equal to `3.50`. Display their `first_name`, `last_name`, and `gpa`.

---

### Question 2 (Level 2: Multiple Predicates & Range)
Find all instructors whose `salary` is between `95,000` and `120,000` (inclusive) AND who belong to department `1` or `2`.

---

### Question 3 (Level 2: Handling NULL Values)
Retrieve the `first_name`, `last_name`, and `email` of all students who do NOT have an assigned advisor (`advisor_id` is null).

---

### Question 4 (Level 3: Pattern Matching & Case Sensitivity)
Find all courses whose `title` contains the word `"Science"` or `"Management"` (case-insensitive). Display the `course_code` and `title`.

---

### Question 5 (Level 3: Sorting with Ties & Pagination)
List the top 5 highest GPA students in the university. Display `first_name`, `last_name`, and `gpa`. Order primarily by `gpa` descending, and secondarily by `last_name` ascending in case of ties.
