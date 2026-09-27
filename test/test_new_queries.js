const { Pool } = require('pg');
const pool = new Pool({ database: 'sql_practice', user: 'zayan' });

const queries = [
  // 4.1 Views
  'CREATE OR REPLACE VIEW v_faculty_directory AS SELECT i.first_name, i.last_name, i.email, d.dept_name FROM instructors i JOIN departments d ON i.department_id = d.department_id; SELECT first_name, last_name, dept_name FROM v_faculty_directory ORDER BY last_name ASC;',
  'CREATE OR REPLACE VIEW v_department_summary AS SELECT d.dept_name, COUNT(i.instructor_id) AS total_instructors, COALESCE(AVG(i.salary), 0.00) AS avg_salary FROM departments d LEFT JOIN instructors i ON d.department_id = i.department_id GROUP BY d.dept_name; SELECT dept_name, total_instructors, ROUND(avg_salary, 2) AS avg_salary FROM v_department_summary ORDER BY dept_name ASC;',
  'CREATE OR REPLACE VIEW v_student_honors AS SELECT student_id, first_name, last_name, gpa, CASE WHEN gpa >= 3.80 THEN \'High Honors\' WHEN gpa >= 3.50 THEN \'Honors\' ELSE \'Good Standing\' END AS honor_status FROM students; SELECT first_name, last_name, gpa, honor_status FROM v_student_honors WHERE honor_status != \'Good Standing\' ORDER BY gpa DESC, last_name ASC;',
  'CREATE OR REPLACE VIEW v_course_sections AS SELECT c.course_code, c.title, s.section_id, s.semester, s.year, s.capacity FROM courses c JOIN sections s ON c.course_id = s.course_id; SELECT course_code, title, semester, year, capacity FROM v_course_sections WHERE year >= 2024 ORDER BY course_code, semester;',
  'CREATE MATERIALIZED VIEW IF NOT EXISTS mv_dept_budget_stats AS SELECT d.department_id, d.dept_name, d.budget, COUNT(s.student_id) AS student_count FROM departments d LEFT JOIN students s ON d.department_id = s.department_id GROUP BY d.department_id, d.dept_name, d.budget; SELECT dept_name, budget, student_count FROM mv_dept_budget_stats ORDER BY student_count DESC, budget DESC;',
  'REFRESH MATERIALIZED VIEW mv_dept_budget_stats; SELECT dept_name, student_count FROM mv_dept_budget_stats WHERE budget > 800000 ORDER BY student_count DESC;',
  
  // 4.2 Transactions
  'BEGIN; UPDATE departments SET budget = budget + 50000.00 WHERE dept_code = \'CS\'; UPDATE departments SET budget = budget - 50000.00 WHERE dept_code = \'LIT\'; COMMIT; SELECT dept_code, budget FROM departments WHERE dept_code IN (\'CS\', \'LIT\') ORDER BY dept_code ASC;',
  'BEGIN; UPDATE instructors SET salary = salary * 1.50 WHERE department_id = 1; ROLLBACK; SELECT first_name, last_name, salary FROM instructors WHERE department_id = 1 ORDER BY salary DESC;',
  'BEGIN; UPDATE students SET credits_completed = credits_completed + 4 WHERE student_id = 1; SAVEPOINT sp_credit_update; UPDATE students SET gpa = 4.00 WHERE student_id = 2; ROLLBACK TO sp_credit_update; COMMIT; SELECT student_id, first_name, last_name, gpa, credits_completed FROM students WHERE student_id IN (1, 2) ORDER BY student_id ASC;',
  
  // 4.3 Constraints & Catalog
  'SELECT tc.table_name, tc.constraint_name, tc.constraint_type FROM information_schema.table_constraints tc WHERE tc.table_schema = \'public\' AND tc.table_name IN (\'instructors\', \'students\') ORDER BY tc.table_name ASC, tc.constraint_type ASC, tc.constraint_name ASC;',
  'SELECT kcu.table_name, kcu.column_name, tc.constraint_type FROM information_schema.table_constraints tc JOIN information_schema.key_column_usage kcu ON tc.constraint_name = kcu.constraint_name AND tc.table_schema = kcu.table_schema WHERE tc.table_schema = \'public\' AND tc.constraint_type IN (\'PRIMARY KEY\', \'UNIQUE\') AND tc.table_name = \'departments\' ORDER BY kcu.column_name ASC;',
  
  // 4.4 Indexes
  'CREATE INDEX IF NOT EXISTS idx_students_last_name ON students(last_name); SELECT indexname, tablename FROM pg_indexes WHERE schemaname = \'public\' AND tablename = \'students\' AND indexname = \'idx_students_last_name\';',
  'CREATE INDEX IF NOT EXISTS idx_instructors_dept_salary ON instructors(department_id, salary DESC); SELECT indexname, indexdef FROM pg_indexes WHERE schemaname = \'public\' AND tablename = \'instructors\' AND indexname = \'idx_instructors_dept_salary\';',
  'CREATE INDEX IF NOT EXISTS idx_honor_students ON students(gpa) WHERE gpa >= 3.50; SELECT indexname, indexdef FROM pg_indexes WHERE schemaname = \'public\' AND tablename = \'students\' AND indexname = \'idx_honor_students\';',
  
  // 4.5 Auth
  'SELECT rolname, rolcanlogin, rolsuper FROM pg_roles WHERE rolname = CURRENT_USER;',
  'SELECT table_name, privilege_type FROM information_schema.table_privileges WHERE grantee = CURRENT_USER AND table_schema = \'public\' ORDER BY table_name, privilege_type;',
  
  // 5.1 Functions
  'CREATE OR REPLACE FUNCTION fn_calc_standing(p_gpa NUMERIC) RETURNS VARCHAR AS $$ BEGIN IF p_gpa >= 3.80 THEN RETURN \'Distinction\'; ELSIF p_gpa >= 3.50 THEN RETURN \'Honors\'; ELSIF p_gpa >= 2.00 THEN RETURN \'Good Standing\'; ELSE RETURN \'Probation\'; END IF; END; $$ LANGUAGE plpgsql; SELECT first_name, last_name, gpa, fn_calc_standing(gpa) AS standing FROM students WHERE gpa >= 3.50 ORDER BY gpa DESC, last_name ASC;',
  'CREATE OR REPLACE FUNCTION fn_get_department_instructors(p_dept_id INT) RETURNS TABLE (inst_id INT, full_name TEXT, inst_salary NUMERIC) AS $$ BEGIN RETURN QUERY SELECT instructor_id, (first_name || \' \' || last_name)::TEXT, salary FROM instructors WHERE department_id = p_dept_id ORDER BY salary DESC; END; $$ LANGUAGE plpgsql; SELECT * FROM fn_get_department_instructors(1);',
  
  // 5.2 Triggers
  'CREATE OR REPLACE FUNCTION trg_fn_audit_instructor_salary() RETURNS TRIGGER AS $$ BEGIN IF OLD.salary IS DISTINCT FROM NEW.salary THEN INSERT INTO instructor_salary_audit (instructor_id, old_salary, new_salary, changed_at) VALUES (OLD.instructor_id, OLD.salary, NEW.salary, CURRENT_TIMESTAMP); END IF; RETURN NEW; END; $$ LANGUAGE plpgsql; SELECT routine_name, routine_type FROM information_schema.routines WHERE routine_schema = \'public\' AND routine_name = \'trg_fn_audit_instructor_salary\';',
  
  // 5.3 Recursion
  'WITH RECURSIVE prereq_chain AS (SELECT course_id, course_code, title, prerequisite_course_id, 1 AS depth FROM courses WHERE prerequisite_course_id IS NOT NULL UNION ALL SELECT c.course_id, c.course_code, c.title, c.prerequisite_course_id, p.depth + 1 FROM courses c JOIN prereq_chain p ON c.prerequisite_course_id = p.course_id) SELECT course_code, title, depth FROM prereq_chain ORDER BY depth ASC, course_code ASC;',
  'WITH RECURSIVE course_tree AS (SELECT c.course_id, c.course_code, c.title, c.prerequisite_course_id, 0 AS level FROM courses c WHERE c.course_code = \'CS-401\' UNION ALL SELECT parent.course_id, parent.course_code, parent.title, parent.prerequisite_course_id, ct.level + 1 FROM courses parent JOIN course_tree ct ON parent.course_id = ct.prerequisite_course_id) SELECT course_code, title, level FROM course_tree ORDER BY level ASC;',
  
  // 5.4 OLAP
  'SELECT instructor_id, first_name, last_name, department_id, salary, ROUND(AVG(salary) OVER (PARTITION BY department_id ORDER BY salary ROWS BETWEEN 1 PRECEDING AND 1 FOLLOWING), 2) AS local_moving_avg FROM instructors ORDER BY department_id, salary;',
  'SELECT d.building, d.dept_name, COUNT(i.instructor_id) AS instructor_count, SUM(i.salary) AS total_salary FROM departments d LEFT JOIN instructors i ON d.department_id = i.department_id GROUP BY ROLLUP (d.building, d.dept_name) ORDER BY d.building NULLS LAST, d.dept_name NULLS LAST;'
];

async function testAll() {
  console.log('Testing ' + queries.length + ' queries on PostgreSQL...');
  for (let i = 0; i < queries.length; i++) {
    try {
      const res = await pool.query(queries[i]);
      const finalRes = Array.isArray(res) ? res[res.length - 1] : res;
      console.log(`✓ Query ${i + 1} succeeded: ${finalRes.rowCount !== undefined ? finalRes.rowCount + ' rows' : 'command ' + finalRes.command}`);
    } catch (e) {
      console.error(`✗ Query ${i + 1} failed:`, e.message);
    }
  }
  await pool.end();
}
testAll();
