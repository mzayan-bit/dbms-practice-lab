# Challenge Suite: Hard — Advanced Production & FAANG SQL

> [!NOTE]
> In Challenge Mode, questions describe only the analytical goal.
> Determine the required SQL techniques independently. Write your queries in `attempts.sql`.

---

### Challenge H1: Complete Prerequisite Dependency Chain
Generate a comprehensive recursive dependency roadmap for all advanced courses showing the full chain of prerequisites from 100-level fundamentals up to 400-level courses with depth level and ordered lineage.

---

### Challenge H2: Departmental GPA Gap & Grade Distribution
For each department, compute:
1. The difference between the highest and lowest student GPA (`gpa_spread`).
2. The percentage of students within that department holding a GPA $\ge 3.50$.
3. The department's rank across the entire university by average GPA.

---

### Challenge H3: Detecting Grade Anomalies
Find any courses where the average numeric score of students in Fall 2024 was significantly lower (by at least 10 points) than the overall historical university average score across all courses.

---

### Challenge H4: Faculty Teaching Gaps & Underutilized Capacity
Find instructors who are either:
1. Not assigned to teach any section in the upcoming semester, OR
2. Teaching sections where enrollment is less than 50% of the classroom's capacity.
