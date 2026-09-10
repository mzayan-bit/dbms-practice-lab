# ==============================================================================
# SQL Practice Environment Makefile
# ==============================================================================

DB_NAME ?= sql_practice

.PHONY: help setup reset connect test-db status start ui

help:
	@echo "SQL Learning & Practice Environment"
	@echo ""
	@echo "Available commands:"
	@echo "  make ui        - Launch the Visual SQL Learning Studio web app (http://localhost:3000)"
	@echo "  make setup     - Initialize schema and seed database from scratch"
	@echo "  make reset     - Reset database to fresh seed state"
	@echo "  make connect   - Open interactive psql session to $(DB_NAME)"
	@echo "  make test-db   - Run database integrity and query validation checks"
	@echo "  make status    - View row counts across all practice tables"
	@echo ""

ui: start

start:
	@echo "==> Starting SQL Learning Studio at http://localhost:3000 ..."
	@open http://localhost:3000 || true
	npm start


setup:
	@echo "==> Setting up database schema and seeding initial data..."
	psql -d $(DB_NAME) -f database/schema.sql
	psql -d $(DB_NAME) -f database/seed.sql
	@echo "==> Setup complete."

reset:
	@echo "==> Resetting database to clean initial state..."
	psql -d $(DB_NAME) -f database/reset.sql

connect:
	psql -d $(DB_NAME)

status:
	@psql -d $(DB_NAME) -c "SELECT 'departments' AS table_name, count(*) AS records FROM departments \
		UNION ALL SELECT 'instructors', count(*) FROM instructors \
		UNION ALL SELECT 'students', count(*) FROM students \
		UNION ALL SELECT 'courses', count(*) FROM courses \
		UNION ALL SELECT 'sections', count(*) FROM sections \
		UNION ALL SELECT 'enrollments', count(*) FROM enrollments \
		UNION ALL SELECT 'grades', count(*) FROM grades;"

test-db:
	@echo "==> Testing database queries and relational integrity..."
	@psql -d $(DB_NAME) -c "SELECT dept_name, count(s.student_id) AS student_count, ROUND(AVG(s.gpa), 2) AS avg_gpa FROM departments d LEFT JOIN students s ON d.department_id = s.department_id GROUP BY dept_name ORDER BY avg_gpa DESC NULLS LAST;"
	@psql -d $(DB_NAME) -c "SELECT c.course_code, c.title, p.course_code AS prerequisite FROM courses c LEFT JOIN courses p ON c.prerequisite_course_id = p.course_id ORDER BY c.course_code;"
	@psql -d $(DB_NAME) -c "SELECT s.first_name || ' ' || s.last_name AS student, g.letter_grade, g.numeric_score, DENSE_RANK() OVER (PARTITION BY sec.course_id ORDER BY g.numeric_score DESC) AS rank_in_course FROM grades g JOIN enrollments e ON g.enrollment_id = e.enrollment_id JOIN students s ON e.student_id = s.student_id JOIN sections sec ON e.section_id = sec.section_id WHERE sec.course_id = 1;"
	@echo "==> All database tests passed successfully!"
