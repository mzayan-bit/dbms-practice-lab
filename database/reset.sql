-- ============================================================================
-- PostgreSQL Practice Database: Reset Script
-- Target Database: sql_practice
-- Usage: psql -d sql_practice -f database/reset.sql
-- ============================================================================

\echo '--------------------------------------------'
\echo 'Resetting sql_practice database schema...'
\echo '--------------------------------------------'

\i database/schema.sql

\echo '--------------------------------------------'
\echo 'Seeding fresh data into sql_practice...'
\echo '--------------------------------------------'

\i database/seed.sql

\echo '--------------------------------------------'
\echo 'Database reset complete! Current record counts:'
\echo '--------------------------------------------'

SELECT 'departments' AS table_name, count(*) FROM departments
UNION ALL
SELECT 'instructors', count(*) FROM instructors
UNION ALL
SELECT 'students', count(*) FROM students
UNION ALL
SELECT 'courses', count(*) FROM courses
UNION ALL
SELECT 'sections', count(*) FROM sections
UNION ALL
SELECT 'enrollments', count(*) FROM enrollments
UNION ALL
SELECT 'grades', count(*) FROM grades;
