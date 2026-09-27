-- ============================================================================
-- PostgreSQL Practice Database: Seed Data
-- Target Database: sql_practice
-- ============================================================================

-- Clear existing data (in reverse dependency order) and reset sequences
TRUNCATE TABLE instructor_salary_audit, grades, enrollments, sections, courses, students, instructors, departments RESTART IDENTITY CASCADE;

-- ----------------------------------------------------------------------------
-- 1. SEED DEPARTMENTS (6 Departments)
-- ----------------------------------------------------------------------------
INSERT INTO departments (dept_code, dept_name, building, budget) VALUES
('CS',   'Computer Science',        'Turing Hall',       1250000.00),
('MATH', 'Mathematics',             'Euler Building',     850000.00),
('PHYS', 'Physics',                 'Newton Complex',     950000.00),
('BUS',  'Business Administration', 'Smith Hall',        1100000.00),
('BIO',  'Biological Sciences',     'Darwin Center',      900000.00),
('LIT',  'Literature & Humanities', 'Shakespeare Hall',   600000.00);

-- ----------------------------------------------------------------------------
-- 2. SEED INSTRUCTORS (10 Instructors)
-- ----------------------------------------------------------------------------
INSERT INTO instructors (first_name, last_name, email, hire_date, salary, department_id) VALUES
('Alan',     'Turing',     'a.turing@university.edu',    '2015-08-15', 105000.00, 1), -- CS
('Grace',    'Hopper',     'g.hopper@university.edu',    '2012-01-10', 115000.00, 1), -- CS
('Donald',   'Knuth',      'd.knuth@university.edu',     '2010-09-01', 125000.00, 1), -- CS
('Katherine','Johnson',    'k.johnson@university.edu',   '2016-03-20',  98000.00, 2), -- MATH
('Leonhard', 'Euler',      'l.euler@university.edu',     '2008-07-01', 130000.00, 2), -- MATH
('Richard',  'Feynman',    'r.feynman@university.edu',   '2014-08-25', 108000.00, 3), -- PHYS
('Marie',    'Curie',      'm.curie@university.edu',     '2011-11-15', 120000.00, 3), -- PHYS
('Peter',    'Drucker',    'p.drucker@university.edu',   '2018-01-05',  92000.00, 4), -- BUS
('Rosalind', 'Franklin',   'r.franklin@university.edu',  '2017-09-12',  95000.00, 5), -- BIO
('Ada',      'Lovelace',   'a.lovelace@university.edu',  '2021-08-01',  88000.00, 1); -- CS (No section assigned yet - test edge case!)

-- ----------------------------------------------------------------------------
-- 3. SEED STUDENTS (25 Students with diverse GPAs, credits, and advisor links)
-- ----------------------------------------------------------------------------
INSERT INTO students (first_name, last_name, email, enrollment_date, gpa, credits_completed, department_id, advisor_id) VALUES
('Alice',     'Smith',      'alice.smith@student.edu',     '2022-09-01', 3.92, 64, 1, 1),
('Bob',       'Jones',      'bob.jones@student.edu',       '2022-09-01', 3.45, 60, 1, 2),
('Charlie',   'Brown',      'charlie.brown@student.edu',   '2023-01-15', 2.85, 32, 1, 1),
('Diana',     'Prince',     'diana.prince@student.edu',    '2021-09-01', 3.98, 96, 1, 3),
('Evan',      'Wright',     'evan.wright@student.edu',     '2023-09-01', 3.10, 28, 2, 4),
('Fiona',     'Gallagher',  'fiona.g@student.edu',         '2022-09-01', 3.65, 58, 2, 5),
('George',    'Clark',      'george.c@student.edu',        '2021-09-01', 2.40, 88, 2, 4),
('Hannah',    'Abbott',     'hannah.a@student.edu',        '2022-09-01', 3.75, 62, 3, 6),
('Ian',       'Malcolm',    'ian.m@student.edu',           '2021-09-01', 3.20, 92, 3, 7),
('Julia',     'Roberts',    'julia.r@student.edu',         '2023-09-01', 3.88, 30, 4, 8),
('Kevin',     'Bacon',      'kevin.b@student.edu',         '2022-09-01', 2.95, 54, 4, 8),
('Laura',     'Croft',      'laura.c@student.edu',         '2021-09-01', 3.80, 90, 5, 9),
('Michael',   'Scott',      'michael.s@student.edu',       '2023-01-10', 2.15, 24, 4, NULL), -- No advisor
('Nora',      'Valkyrie',   'nora.v@student.edu',          '2022-09-01', 3.50, 60, 5, 9),
('Oscar',     'Martinez',   'oscar.m@student.edu',         '2021-09-01', 3.90, 94, 4, 8),
('Pam',       'Beesly',     'pam.b@student.edu',           '2023-09-01', 3.30, 26, 6, NULL), -- Lit, No advisor
('Quinn',     'Fabray',     'quinn.f@student.edu',         '2022-09-01', 3.60, 56, 1, 2),
('Riley',     'Matthews',   'riley.m@student.edu',         '2023-09-01', 2.70, 24, 6, NULL),
('Sam',       'Winchester', 'sam.w@student.edu',           '2021-09-01', 3.85, 98, 1, 3),
('Tina',      'Belcher',    'tina.b@student.edu',          '2024-01-15', 3.00, 14, 6, NULL),
('Uma',       'Thurman',    'uma.t@student.edu',           '2024-09-01', 3.55,  0, 1, 1),
('Victor',    'Stone',      'victor.s@student.edu',        '2024-09-01', 4.00,  0, 1, 3),
('Wendy',     'Darling',    'wendy.d@student.edu',         '2024-09-01', 3.40,  0, 6, NULL),
('Xavier',    'Charles',    'xavier.c@student.edu',        '2020-09-01', 3.95, 120, 1, 1),
('Yara',      'Greyjoy',    'yara.g@student.edu',          '2024-09-01', 0.00,  0, NULL, NULL); -- Fresh unassigned student

-- ----------------------------------------------------------------------------
-- 4. SEED COURSES (12 Courses with Prerequisites Hierarchy)
-- ----------------------------------------------------------------------------
INSERT INTO courses (course_code, title, credits, department_id, prerequisite_course_id) VALUES
('CS101',   'Introduction to Computer Science', 4, 1, NULL),
('CS201',   'Data Structures and Algorithms',   4, 1, 1),    -- Prereq: CS101
('CS301',   'Database Management Systems',       4, 1, 2),    -- Prereq: CS201
('CS401',   'Distributed Systems',              4, 1, 3),    -- Prereq: CS301
('MATH101', 'Calculus I',                       4, 2, NULL),
('MATH201', 'Linear Algebra',                   3, 2, 5),    -- Prereq: MATH101
('MATH301', 'Probability & Statistics',         3, 2, 5),    -- Prereq: MATH101
('PHYS101', 'General Physics I',                4, 3, NULL),
('PHYS201', 'Quantum Mechanics',                4, 3, 8),    -- Prereq: PHYS101
('BUS101',  'Principles of Management',         3, 4, NULL),
('BIO101',  'General Biology',                  4, 5, NULL),
('LIT101',  'World Literature',                 3, 6, NULL);

-- ----------------------------------------------------------------------------
-- 5. SEED SECTIONS (15 Sections across Semesters)
-- ----------------------------------------------------------------------------
INSERT INTO sections (course_id, instructor_id, semester, year, classroom, capacity) VALUES
(1,  1, 'Fall',   2024, 'Turing-101', 40), -- Sec 1: CS101 (Turing)
(1,  2, 'Spring', 2025, 'Turing-102', 35), -- Sec 2: CS101 (Hopper)
(2,  2, 'Fall',   2024, 'Turing-201', 30), -- Sec 3: CS201 (Hopper)
(2,  3, 'Spring', 2025, 'Turing-201', 30), -- Sec 4: CS201 (Knuth)
(3,  1, 'Fall',   2024, 'Turing-301', 25), -- Sec 5: CS301 (Turing)
(3,  3, 'Spring', 2025, 'Turing-301', 25), -- Sec 6: CS301 (Knuth)
(4,  3, 'Spring', 2025, 'Turing-401', 20), -- Sec 7: CS401 (Knuth)
(5,  4, 'Fall',   2024, 'Euler-101',  45), -- Sec 8: MATH101 (Johnson)
(6,  5, 'Spring', 2025, 'Euler-201',  35), -- Sec 9: MATH201 (Euler)
(7,  4, 'Fall',   2024, 'Euler-301',  30), -- Sec 10: MATH301 (Johnson)
(8,  6, 'Fall',   2024, 'Newton-101', 40), -- Sec 11: PHYS101 (Feynman)
(9,  7, 'Spring', 2025, 'Newton-201', 25), -- Sec 12: PHYS201 (Curie)
(10, 8, 'Fall',   2024, 'Smith-101',  50), -- Sec 13: BUS101 (Drucker)
(11, 9, 'Fall',   2024, 'Darwin-101', 40), -- Sec 14: BIO101 (Franklin)
(12, NULL, 'Spring', 2025, 'Shakespeare-101', 35); -- Sec 15: LIT101 (Instructor TBA)

-- ----------------------------------------------------------------------------
-- 6. SEED ENROLLMENTS (40 Enrollments with different statuses)
-- ----------------------------------------------------------------------------
INSERT INTO enrollments (student_id, section_id, enrollment_date, status) VALUES
-- Fall 2024 Enrollments (Completed)
(1,  1,  '2024-08-20', 'completed'), -- Alice -> CS101
(1,  8,  '2024-08-20', 'completed'), -- Alice -> MATH101
(2,  1,  '2024-08-21', 'completed'), -- Bob -> CS101
(2,  8,  '2024-08-21', 'completed'), -- Bob -> MATH101
(3,  1,  '2024-08-22', 'completed'), -- Charlie -> CS101
(4,  3,  '2024-08-19', 'completed'), -- Diana -> CS201
(4,  5,  '2024-08-19', 'completed'), -- Diana -> CS301
(5,  8,  '2024-08-20', 'completed'), -- Evan -> MATH101
(6,  8,  '2024-08-20', 'completed'), -- Fiona -> MATH101
(6,  10, '2024-08-21', 'completed'), -- Fiona -> MATH301
(7,  8,  '2024-08-22', 'completed'), -- George -> MATH101
(8,  11, '2024-08-20', 'completed'), -- Hannah -> PHYS101
(9,  11, '2024-08-20', 'completed'), -- Ian -> PHYS101
(10, 13, '2024-08-20', 'completed'), -- Julia -> BUS101
(11, 13, '2024-08-20', 'completed'), -- Kevin -> BUS101
(12, 14, '2024-08-20', 'completed'), -- Laura -> BIO101
(13, 13, '2024-08-22', 'completed'), -- Michael -> BUS101
(14, 14, '2024-08-20', 'completed'), -- Nora -> BIO101
(15, 13, '2024-08-20', 'completed'), -- Oscar -> BUS101
(17, 1,  '2024-08-20', 'completed'), -- Quinn -> CS101
(19, 3,  '2024-08-19', 'completed'), -- Sam -> CS201
(19, 5,  '2024-08-19', 'completed'), -- Sam -> CS301
(24, 5,  '2024-08-18', 'completed'), -- Xavier -> CS301

-- Spring 2025 Enrollments (Active 'enrolled' or 'dropped')
(1,  4,  '2025-01-10', 'enrolled'),  -- Alice -> CS201 (Knuth)
(1,  9,  '2025-01-10', 'enrolled'),  -- Alice -> MATH201 (Euler)
(2,  4,  '2025-01-11', 'enrolled'),  -- Bob -> CS201 (Knuth)
(3,  2,  '2025-01-12', 'dropped'),   -- Charlie dropped CS101
(4,  7,  '2025-01-09', 'enrolled'),  -- Diana -> CS401 (Knuth)
(5,  9,  '2025-01-10', 'enrolled'),  -- Evan -> MATH201 (Euler)
(6,  9,  '2025-01-10', 'enrolled'),  -- Fiona -> MATH201
(8,  12, '2025-01-10', 'enrolled'),  -- Hannah -> PHYS201
(9,  12, '2025-01-10', 'enrolled'),  -- Ian -> PHYS201
(10, 6,  '2025-01-11', 'enrolled'),  -- Julia -> CS301
(16, 15, '2025-01-10', 'enrolled'),  -- Pam -> LIT101
(17, 4,  '2025-01-10', 'enrolled'),  -- Quinn -> CS201
(18, 15, '2025-01-12', 'enrolled'),  -- Riley -> LIT101
(19, 7,  '2025-01-08', 'enrolled'),  -- Sam -> CS401
(20, 15, '2025-01-14', 'enrolled');  -- Tina -> LIT101
-- Note: Students 21, 22, 23, 25 have NO enrollments (edge case testing!)

-- ----------------------------------------------------------------------------
-- 7. SEED GRADES (For completed Fall 2024 enrollments)
-- ----------------------------------------------------------------------------
INSERT INTO grades (enrollment_id, letter_grade, numeric_score, grade_points) VALUES
(1,  'A',  94.50, 4.00), -- Alice: CS101
(2,  'A',  96.00, 4.00), -- Alice: MATH101
(3,  'B+', 88.00, 3.30), -- Bob: CS101
(4,  'B',  83.50, 3.00), -- Bob: MATH101
(5,  'C',  72.00, 2.00), -- Charlie: CS101
(6,  'A',  98.00, 4.00), -- Diana: CS201
(7,  'A',  99.00, 4.00), -- Diana: CS301
(8,  'B',  82.00, 3.00), -- Evan: MATH101
(9,  'A-', 90.50, 3.70), -- Fiona: MATH101
(10, 'A',  93.00, 4.00), -- Fiona: MATH301
(11, 'F',  54.00, 0.00), -- George: MATH101 (failed course!)
(12, 'A',  95.00, 4.00), -- Hannah: PHYS101
(13, 'B-', 80.00, 2.70), -- Ian: PHYS101
(14, 'A',  96.50, 4.00), -- Julia: BUS101
(15, 'C+', 77.00, 2.30), -- Kevin: BUS101
(16, 'A-', 91.00, 3.70), -- Laura: BIO101
(17, 'D',  65.00, 1.00), -- Michael: BUS101
(18, 'B+', 87.50, 3.30), -- Nora: BIO101
(19, 'A',  95.50, 4.00), -- Oscar: BUS101
(20, 'A-', 91.50, 3.70), -- Quinn: CS101
(21, 'A',  97.00, 4.00), -- Sam: CS201
(22, 'A-', 92.00, 3.70), -- Sam: CS301
(23, 'A',  98.50, 4.00); -- Xavier: CS301
