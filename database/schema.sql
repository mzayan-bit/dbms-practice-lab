-- ============================================================================
-- PostgreSQL Practice Database: University Relational Schema
-- Target Database: sql_practice
-- ============================================================================

-- Drop tables in reverse order of foreign key dependencies
DROP TABLE IF EXISTS grades CASCADE;
DROP TABLE IF EXISTS enrollments CASCADE;
DROP TABLE IF EXISTS sections CASCADE;
DROP TABLE IF EXISTS courses CASCADE;
DROP TABLE IF EXISTS students CASCADE;
DROP TABLE IF EXISTS instructors CASCADE;
DROP TABLE IF EXISTS departments CASCADE;

-- ----------------------------------------------------------------------------
-- 1. DEPARTMENTS
-- ----------------------------------------------------------------------------
CREATE TABLE departments (
    department_id SERIAL PRIMARY KEY,
    dept_code VARCHAR(10) NOT NULL UNIQUE,
    dept_name VARCHAR(100) NOT NULL UNIQUE,
    building VARCHAR(50) NOT NULL,
    budget NUMERIC(12, 2) NOT NULL CHECK (budget >= 0)
);

-- ----------------------------------------------------------------------------
-- 2. INSTRUCTORS
-- ----------------------------------------------------------------------------
CREATE TABLE instructors (
    instructor_id SERIAL PRIMARY KEY,
    first_name VARCHAR(50) NOT NULL,
    last_name VARCHAR(50) NOT NULL,
    email VARCHAR(100) NOT NULL UNIQUE,
    hire_date DATE NOT NULL,
    salary NUMERIC(10, 2) NOT NULL CHECK (salary > 0),
    department_id INT REFERENCES departments(department_id) ON DELETE RESTRICT
);

-- ----------------------------------------------------------------------------
-- 3. STUDENTS
-- ----------------------------------------------------------------------------
CREATE TABLE students (
    student_id SERIAL PRIMARY KEY,
    first_name VARCHAR(50) NOT NULL,
    last_name VARCHAR(50) NOT NULL,
    email VARCHAR(100) NOT NULL UNIQUE,
    enrollment_date DATE NOT NULL,
    gpa NUMERIC(3, 2) DEFAULT 0.00 CHECK (gpa >= 0.00 AND gpa <= 4.00),
    credits_completed INT DEFAULT 0 CHECK (credits_completed >= 0),
    department_id INT REFERENCES departments(department_id) ON DELETE SET NULL,
    advisor_id INT REFERENCES instructors(instructor_id) ON DELETE SET NULL
);

-- ----------------------------------------------------------------------------
-- 4. COURSES
-- ----------------------------------------------------------------------------
CREATE TABLE courses (
    course_id SERIAL PRIMARY KEY,
    course_code VARCHAR(15) NOT NULL UNIQUE,
    title VARCHAR(150) NOT NULL,
    credits INT NOT NULL CHECK (credits BETWEEN 1 AND 6),
    department_id INT NOT NULL REFERENCES departments(department_id) ON DELETE RESTRICT,
    prerequisite_course_id INT REFERENCES courses(course_id) ON DELETE SET NULL
);

-- ----------------------------------------------------------------------------
-- 5. SECTIONS
-- ----------------------------------------------------------------------------
CREATE TABLE sections (
    section_id SERIAL PRIMARY KEY,
    course_id INT NOT NULL REFERENCES courses(course_id) ON DELETE CASCADE,
    instructor_id INT REFERENCES instructors(instructor_id) ON DELETE SET NULL,
    semester VARCHAR(10) NOT NULL CHECK (semester IN ('Fall', 'Spring', 'Summer')),
    year INT NOT NULL CHECK (year >= 2020),
    classroom VARCHAR(50) NOT NULL,
    capacity INT NOT NULL CHECK (capacity > 0)
);

-- ----------------------------------------------------------------------------
-- 6. ENROLLMENTS
-- ----------------------------------------------------------------------------
CREATE TABLE enrollments (
    enrollment_id SERIAL PRIMARY KEY,
    student_id INT NOT NULL REFERENCES students(student_id) ON DELETE CASCADE,
    section_id INT NOT NULL REFERENCES sections(section_id) ON DELETE CASCADE,
    enrollment_date DATE NOT NULL DEFAULT CURRENT_DATE,
    status VARCHAR(15) NOT NULL DEFAULT 'enrolled' CHECK (status IN ('enrolled', 'completed', 'dropped')),
    CONSTRAINT uq_student_section UNIQUE (student_id, section_id)
);

-- ----------------------------------------------------------------------------
-- 7. GRADES
-- ----------------------------------------------------------------------------
CREATE TABLE grades (
    grade_id SERIAL PRIMARY KEY,
    enrollment_id INT NOT NULL UNIQUE REFERENCES enrollments(enrollment_id) ON DELETE CASCADE,
    letter_grade VARCHAR(2) CHECK (letter_grade IN ('A+', 'A', 'A-', 'B+', 'B', 'B-', 'C+', 'C', 'C-', 'D', 'F')),
    numeric_score NUMERIC(5, 2) CHECK (numeric_score >= 0.00 AND numeric_score <= 100.00),
    grade_points NUMERIC(3, 2) CHECK (grade_points >= 0.00 AND grade_points <= 4.00)
);

-- ----------------------------------------------------------------------------
-- Helpful Indexes for Query Optimization & Practice
-- ----------------------------------------------------------------------------
CREATE INDEX idx_instructors_dept ON instructors(department_id);
CREATE INDEX idx_students_dept ON students(department_id);
CREATE INDEX idx_students_advisor ON students(advisor_id);
CREATE INDEX idx_courses_dept ON courses(department_id);
CREATE INDEX idx_sections_course ON sections(course_id);
CREATE INDEX idx_sections_instructor ON sections(instructor_id);
CREATE INDEX idx_enrollments_student ON enrollments(student_id);
CREATE INDEX idx_enrollments_section ON enrollments(section_id);
CREATE INDEX idx_grades_enrollment ON grades(enrollment_id);
