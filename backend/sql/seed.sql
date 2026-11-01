-- ====================================================================
-- LearnSphere - Realistic Seed Data Script
-- ====================================================================

USE learnsphere_db;

-- 1. SEED USERS
-- Password for Admin is 'Admin@123'
-- Password for Faculty is 'Faculty@123'
-- Password for Student is 'Student@123'
INSERT INTO users (id, name, email, password_hash, role, status) VALUES
(1, 'System Administrator', 'admin@learnsphere.edu', '$2b$10$mryUHzGQgwxm6AnFZQkie.EY/JMLyO1I7JNnN3vCdhzrvm9nGrrmu', 'admin', 'active'),
(2, 'Dr. Sarah Sharma', 'faculty.sarah@learnsphere.edu', '$2b$10$go0jNzDcIgfwrs3Jj73NguJZEKKWKu4WaVAwWmMWfbVhgLTVfEmK.', 'faculty', 'active'),
(3, 'Prof. Raj Kumar', 'faculty.raj@learnsphere.edu', '$2b$10$go0jNzDcIgfwrs3Jj73NguJZEKKWKu4WaVAwWmMWfbVhgLTVfEmK.', 'faculty', 'active'),
(4, 'Adhvaith', 'student@learnsphere.edu', '$2b$10$dNFMnN./p09s03IoojxONuee3mc5kpxfAZFh5t29cAznn92UWxQ9m', 'student', 'active'),
(5, 'Sneha Verma', 'sneha@learnsphere.edu', '$2b$10$dNFMnN./p09s03IoojxONuee3mc5kpxfAZFh5t29cAznn92UWxQ9m', 'student', 'active')
ON DUPLICATE KEY UPDATE name=VALUES(name);

-- 2. SEED SKILLS
INSERT INTO skills (id, name, category, description, is_active) VALUES
(1, 'HTML & CSS', 'Frontend', 'Semantic markup, modern responsive layouts using Flexbox, CSS Grid, and media queries.', 1),
(2, 'JavaScript', 'Programming', 'Core language fundamentals, closures, ES6+ features, asynchronous event loop, and DOM manipulation.', 1),
(3, 'React', 'Frontend', 'Component-based architecture, state management with Hooks, virtual DOM, and client-side routing.', 1),
(4, 'Node.js & Express', 'Backend', 'Event-driven server runtime, RESTful routing, middleware pipelines, error handling, and security.', 1),
(5, 'Git & GitHub', 'DevOps & Tools', 'Version control fundamentals, branching models, pull requests, merge conflict resolution, and collaboration.', 1),
(6, 'Basic SQL & Databases', 'Database', 'Relational data modeling, table normalization, primary/foreign keys, joins, aggregation, and indexes.', 1),
(7, 'RESTful API Design', 'Architecture', 'HTTP methods, status codes, resource-oriented endpoint design, authentication, and payload validation.', 1),
(8, 'Data Structures & Algorithms', 'Computer Science', 'Linear structures, trees, graphs, sorting, searching algorithms, and time/space complexity analysis.', 1)
ON DUPLICATE KEY UPDATE name=VALUES(name);

-- 3. SEED CAREER ROLES
INSERT INTO career_roles (id, name, description, is_active) VALUES
(1, 'Junior Web Developer', 'Entry-level full-lifecycle web engineer proficient in foundational frontend technologies, basic backend integration, and collaboration tools.', 1),
(2, 'Frontend Developer', 'Specialized UI engineer focused on modern reactive user interfaces, component design systems, state architecture, and web performance.', 1),
(3, 'Backend Developer', 'Server-side engineer specializing in robust RESTful APIs, relational database architecture, authentication, and security.', 1),
(4, 'Full Stack Engineer', 'Comprehensive web professional capable of architecting and building both client-side interfaces and scalable server-side systems.', 1)
ON DUPLICATE KEY UPDATE name=VALUES(name);   

-- 4. SEED CAREER ROLE SKILL REQUIREMENTS (Target proficiency 1-5)
INSERT INTO career_role_skills (career_role_id, skill_id, required_proficiency, rationale) VALUES
-- Junior Web Developer
(1, 1, 4, 'Must build pixel-perfect, accessible, and responsive layouts.'),
(1, 2, 4, 'Essential for interactive client logic, event handling, and API integration.'),
(1, 3, 3, 'Needed to build components and manage local interface state.'),
(1, 5, 3, 'Crucial for team collaboration and code repository management.'),
(1, 6, 2, 'Basic understanding of relational tables, queries, and data retrieval.'),

-- Frontend Developer
(2, 1, 5, 'Mastery of semantic markup, advanced CSS architecture, animations, and accessibility.'),
(2, 2, 5, 'Deep proficiency with modern JavaScript ES6+, functional paradigms, and async patterns.'),
(2, 3, 4, 'Advanced component patterns, custom hooks, and state synchronization.'),
(2, 5, 4, 'Proficient branch workflows, code reviews, and Git history maintenance.'),
(2, 7, 3, 'Seamlessly consume and handle backend REST APIs and error states.'),

-- Backend Developer
(3, 4, 4, 'Proficient in building scalable Express services and middleware architectures.'),
(3, 6, 4, 'Expert in relational schema design, query optimization, indexing, and transactions.'),
(3, 7, 4, 'Design standardized, secure, and well-documented HTTP API endpoints.'),
(3, 2, 4, 'Strong server-side JavaScript logic and asynchronous execution comprehension.'),
(3, 5, 3, 'Manage backend repositories, configuration environments, and releases.'),

-- Full Stack Engineer
(4, 1, 4, 'Solid responsive interface construction and styling skills.'),
(4, 2, 4, 'Comprehensive fluency in modern JavaScript across client and server runtimes.'),
(4, 3, 4, 'Build complex React frontends with modern hooks and data fetching.'),
(4, 4, 4, 'Develop secure, performant Node.js and Express backend services.'),
(4, 6, 3, 'Design normalized MySQL database schemas and execute parameterized queries.'),
(4, 5, 4, 'Maintain complete full-stack repository and deployment workflows.')
ON DUPLICATE KEY UPDATE required_proficiency=VALUES(required_proficiency);

-- 5. SEED ACADEMIC RESOURCES
INSERT INTO resources (id, title, description, subject, unit, topic, type, difficulty, uploader_id, file_path, file_name, file_size, mime_type, external_url, version, status) VALUES
(1, 'HTML5 & CSS3 Master Reference Guide', 'Comprehensive lecture notes covering semantic elements, Flexbox layout algorithms, CSS Grid templates, and mobile-first responsive breakpoints.', 'Web Technologies', 'Unit 1', 'Semantic Web & Modern Layouts', 'notes', 'beginner', 2, NULL, 'HTML5_CSS3_Guide.pdf', 2450000, 'application/pdf', 'https://developer.mozilla.org/en-US/docs/Learn/HTML', '1.0', 'active'),
(2, 'Modern JavaScript ES6+ Deep Dive Slides', 'Complete presentation slides explaining closures, lexical scoping, Promises, async/await patterns, array manipulation methods, and module exports.', 'Web Technologies', 'Unit 2', 'Asynchronous JS & ES6 Features', 'ppt', 'intermediate', 2, NULL, 'Modern_JavaScript_ES6.pptx', 3890000, 'application/vnd.openxmlformats-officedocument.presentationml.presentation', 'https://javascript.info/', '1.2', 'active'),
(3, 'React Components, Hooks & State Architecture', 'Step-by-step practical tutorial guiding students through useState, useEffect, custom hooks, lifting state, and clean component composition.', 'Web Technologies', 'Unit 3', 'React Framework & Hook Fundamentals', 'tutorial', 'intermediate', 2, NULL, 'React_Hooks_Tutorial.pdf', 3120000, 'application/pdf', 'https://react.dev/learn', '2.0', 'active'),
(4, 'Git & GitHub Collaboration Lab Manual', 'Hands-on practical laboratory guide on repository initialization, commit hygiene, feature branching, resolving merge conflicts, and pull requests.', 'Software Engineering Tools', 'Unit 1', 'Distributed Version Control', 'notes', 'beginner', 3, NULL, 'Git_GitHub_Lab_Manual.pdf', 1850000, 'application/pdf', 'https://git-scm.com/doc', '1.1', 'active'),
(5, 'Relational Database Schema Design & SQL Handbook', 'In-depth reference notes on E-R diagrams, Third Normal Form (3NF), complex multi-table JOINs, indexing strategies, and parameterized statements.', 'Database Management Systems', 'Unit 4', 'Relational Schema & SQL Optimization', 'reference', 'intermediate', 3, NULL, 'SQL_Database_Handbook.pdf', 4200000, 'application/pdf', 'https://dev.mysql.com/doc/', '1.0', 'active'),
(6, 'Building Robust RESTful APIs with Node.js & Express', 'Technical tutorial covering Express router structure, custom authentication middleware, input sanitization, error propagation, and HTTP response codes.', 'Advanced Web Programming', 'Unit 3', 'RESTful Backend Engineering', 'tutorial', 'intermediate', 2, NULL, 'Node_Express_REST_APIs.pdf', 3450000, 'application/pdf', 'https://expressjs.com/', '1.0', 'active'),
(7, 'JavaScript Array Methods & Async Coding Exercises', 'Curated set of 15 practical coding exercises testing map, filter, reduce, Promise.all, and debounce/throttle implementation.', 'Web Technologies', 'Unit 2', 'Functional JS & Async Patterns', 'exercise', 'intermediate', 2, NULL, 'JS_Async_Exercises.pdf', 1200000, 'application/pdf', NULL, '1.0', 'active'),
(8, 'Full-Stack Web Application Capstone Project Specification', 'Detailed engineering project brief for architecting a modular resource management web application with role-based access control and persistent storage.', 'Problem Solving in Engineering', 'Unit 5', 'Integrated Web Application Capstone', 'project', 'advanced', 3, NULL, 'PSE_Module5_Capstone_Brief.pdf', 2900000, 'application/pdf', NULL, '1.0', 'active')
ON DUPLICATE KEY UPDATE title=VALUES(title);

-- 6. SEED RESOURCE SKILLS MAPPING
INSERT INTO resource_skills (resource_id, skill_id) VALUES
(1, 1), -- HTML & CSS Guide -> HTML & CSS
(2, 2), -- JS ES6 Slides -> JavaScript
(3, 2), -- React Tutorial -> JavaScript
(3, 3), -- React Tutorial -> React
(4, 5), -- Git Lab Manual -> Git & GitHub
(5, 6), -- SQL Handbook -> Basic SQL & Databases
(6, 4), -- Node & Express -> Node.js & Express
(6, 7), -- Node & Express -> RESTful API Design
(6, 2), -- Node & Express -> JavaScript
(7, 2), -- JS Exercises -> JavaScript
(8, 1), -- Capstone Project -> HTML & CSS
(8, 2), -- Capstone Project -> JavaScript
(8, 3), -- Capstone Project -> React
(8, 4), -- Capstone Project -> Node.js & Express
(8, 6)  -- Capstone Project -> Basic SQL & Databases
ON DUPLICATE KEY UPDATE skill_id=VALUES(skill_id);

-- 7. SEED PRACTICE TASKS & MINI-PROJECTS
INSERT INTO practice_tasks (id, title, description, difficulty, learning_objective, estimated_duration, suggested_steps, external_url, is_active) VALUES
(1, 'Build a Responsive Personal Developer Portfolio', 'Design and build a responsive multi-section portfolio showcasing projects, education, and contact form using clean HTML5 semantics and modern CSS Flexbox/Grid.', 'beginner', 'Master semantic markup, CSS positioning, mobile responsive breakpoints, and accessibility standards.', '4-6 hours', '1. Draft wireframe layout\n2. Code semantic header, about, projects, contact sections\n3. Apply mobile-first CSS media queries\n4. Validate HTML & test responsiveness across mobile/tablet views', 'https://github.com', 1),
(2, 'Build an Interactive Form with Real-Time Client Validation', 'Create a user registration and password strength verification form with dynamic error indicators, regex validation, and responsive input feedback without page refresh.', 'intermediate', 'Deepen understanding of DOM events, regular expressions, dynamic class manipulation, and defensive user validation.', '3-4 hours', '1. Build accessible form elements\n2. Add input change and blur event listeners\n3. Implement regex checks for email and password rules\n4. Render accessible error feedback badges', NULL, 1),
(3, 'Searchable Academic Resource Listing Interface in React', 'Implement a React application component with live keyword search, multiple badge filters (type, difficulty, subject), and instantaneous client filtering.', 'intermediate', 'Apply React useState, useMemo hooks, array filtering techniques, and clean component decomposition.', '4-5 hours', '1. Create mock data array\n2. Build search input and category filter chips\n3. Connect state using useMemo for efficient re-renders\n4. Render empty state card when no resources match', NULL, 1),
(4, 'Collaborative Git Branching & Pull Request Simulation', 'Initialize a Git repository, create separate feature branches, simulate an edit conflict on the same file, resolve the merge conflict, and submit a PR.', 'beginner', 'Acquire hands-on mastery of Git branch lifecycles, stash, rebase vs merge, and clean commit history formatting.', '2-3 hours', '1. Initialize git repo and make initial commit\n2. Branch to feature/profile and feature/auth\n3. Introduce conflicting edits\n4. Merge and resolve conflicts manually\n5. Push cleanly to GitHub', 'https://learngitbranching.js.org/', 1),
(5, 'Relational Database Design & Parameterized CRUD API', 'Design a 3-table normalized relational schema in MySQL for a university library, write index-optimized queries, and build parameterized CRUD operations.', 'intermediate', 'Master relational constraints, foreign keys, SQL injection prevention via parameterized queries, and connection pools.', '5-6 hours', '1. Model ER diagram with 3NF normalization\n2. Execute DDL script with foreign keys and indexes\n3. Write parameterized SELECT, INSERT, UPDATE queries\n4. Test query performance with EXPLAIN plan', NULL, 1),
(6, 'Build a Production-Grade JWT Authentication Middleware in Express', 'Implement a secure authentication microservice featuring bcrypt password hashing, signed JWT token generation, HTTP authorization header parsing, and role verification middleware.', 'advanced', 'Understand stateless web token security, token expiration handling, RBAC route guarding, and defensive HTTP headers.', '5-7 hours', '1. Set up Express router with POST /register and /login\n2. Hash incoming password using bcryptjs\n3. Sign JWT with configurable secret and expiry\n4. Write authenticateToken and authorizeRoles middleware functions', NULL, 1)
ON DUPLICATE KEY UPDATE title=VALUES(title);

-- 8. SEED PRACTICE TASK SKILLS MAPPING
INSERT INTO practice_task_skills (practice_task_id, skill_id) VALUES
(1, 1), -- Task 1 -> HTML & CSS
(1, 5), -- Task 1 -> Git & GitHub
(2, 2), -- Task 2 -> JavaScript
(2, 1), -- Task 2 -> HTML & CSS
(3, 3), -- Task 3 -> React
(3, 2), -- Task 3 -> JavaScript
(4, 5), -- Task 4 -> Git & GitHub
(5, 6), -- Task 5 -> Basic SQL & Databases
(6, 4), -- Task 6 -> Node.js & Express
(6, 7)  -- Task 6 -> RESTful API Design
ON DUPLICATE KEY UPDATE skill_id=VALUES(skill_id);
