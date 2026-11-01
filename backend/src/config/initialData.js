// Complete, structured relational dataset matching schema.sql and seed.sql exactly

export const initialStoreData = {
  users: [
    {
      id: 1,
      name: 'System Administrator',
      email: 'admin@learnsphere.edu',
      password_hash: '$2b$10$mryUHzGQgwxm6AnFZQkie.EY/JMLyO1I7JNnN3vCdhzrvm9nGrrmu', // Admin@123
      role: 'admin',
      status: 'active',
      created_at: '2026-09-01T10:00:00.000Z',
      updated_at: '2026-09-01T10:00:00.000Z'
    },
    {
      id: 2,
      name: 'Dr. Sarah Sharma',
      email: 'faculty@learnsphere.edu',
      password_hash: '$2b$10$go0jNzDcIgfwrs3Jj73NguJZEKKWKu4WaVAwWmMWfbVhgLTVfEmK.', // Faculty@123
      role: 'faculty',
      status: 'active',
      created_at: '2026-09-01T10:15:00.000Z',
      updated_at: '2026-09-01T10:15:00.000Z'
    },
    {
      id: 3,
      name: 'Prof. Raj Kumar',
      email: 'faculty.raj@learnsphere.edu',
      password_hash: '$2b$10$go0jNzDcIgfwrs3Jj73NguJZEKKWKu4WaVAwWmMWfbVhgLTVfEmK.', // Faculty@123
      role: 'faculty',
      status: 'active',
      created_at: '2026-09-01T10:30:00.000Z',
      updated_at: '2026-09-01T10:30:00.000Z'
    },
    {
      id: 4,
      name: 'Adhvaith',
      email: 'student@learnsphere.edu',
      password_hash: '$2b$10$dNFMnN./p09s03IoojxONuee3mc5kpxfAZFh5t29cAznn92UWxQ9m', // Student@123
      role: 'student',
      status: 'active',
      created_at: '2026-09-02T09:00:00.000Z',
      updated_at: '2026-09-02T09:00:00.000Z'
    },
    {
      id: 5,
      name: 'Sneha Verma',
      email: 'sneha@learnsphere.edu',
      password_hash: '$2b$10$dNFMnN./p09s03IoojxONuee3mc5kpxfAZFh5t29cAznn92UWxQ9m', // Student@123
      role: 'student',
      status: 'active',
      created_at: '2026-09-02T09:30:00.000Z',
      updated_at: '2026-09-02T09:30:00.000Z'
    }
  ],
  skills: [
    {
      id: 1,
      name: 'HTML & CSS',
      category: 'Frontend',
      description: 'Semantic markup, modern responsive layouts using Flexbox, CSS Grid, and media queries.',
      is_active: 1
    },
    {
      id: 2,
      name: 'JavaScript',
      category: 'Programming',
      description: 'Core language fundamentals, closures, ES6+ features, asynchronous event loop, and DOM manipulation.',
      is_active: 1
    },
    {
      id: 3,
      name: 'React',
      category: 'Frontend',
      description: 'Component-based architecture, state management with Hooks, virtual DOM, and client-side routing.',
      is_active: 1
    },
    {
      id: 4,
      name: 'Node.js & Express',
      category: 'Backend',
      description: 'Event-driven server runtime, RESTful routing, middleware pipelines, error handling, and security.',
      is_active: 1
    },
    {
      id: 5,
      name: 'Git & GitHub',
      category: 'DevOps & Tools',
      description: 'Version control fundamentals, branching models, pull requests, merge conflict resolution, and collaboration.',
      is_active: 1
    },
    {
      id: 6,
      name: 'Basic SQL & Databases',
      category: 'Database',
      description: 'Relational data modeling, table normalization, primary/foreign keys, joins, aggregation, and indexes.',
      is_active: 1
    },
    {
      id: 7,
      name: 'RESTful API Design',
      category: 'Architecture',
      description: 'HTTP methods, status codes, resource-oriented endpoint design, authentication, and payload validation.',
      is_active: 1
    },
    {
      id: 8,
      name: 'Data Structures & Algorithms',
      category: 'Computer Science',
      description: 'Linear structures, trees, graphs, sorting, searching algorithms, and time/space complexity analysis.',
      is_active: 1
    }
  ],
  career_roles: [
    {
      id: 1,
      name: 'Junior Web Developer',
      description: 'Entry-level full-lifecycle web engineer proficient in foundational frontend technologies, basic backend integration, and collaboration tools.',
      is_active: 1
    },
    {
      id: 2,
      name: 'Frontend Developer',
      description: 'Specialized UI engineer focused on modern reactive user interfaces, component design systems, state architecture, and web performance.',
      is_active: 1
    },
    {
      id: 3,
      name: 'Backend Developer',
      description: 'Server-side engineer specializing in robust RESTful APIs, relational database architecture, authentication, and security.',
      is_active: 1
    },
    {
      id: 4,
      name: 'Full Stack Engineer',
      description: 'Comprehensive web professional capable of architecting and building both client-side interfaces and scalable server-side systems.',
      is_active: 1
    }
  ],
  career_role_skills: [
    // Junior Web Developer
    { career_role_id: 1, skill_id: 1, required_proficiency: 4, rationale: 'Must build pixel-perfect, accessible, and responsive layouts.' },
    { career_role_id: 1, skill_id: 2, required_proficiency: 4, rationale: 'Essential for interactive client logic, event handling, and API integration.' },
    { career_role_id: 1, skill_id: 3, required_proficiency: 3, rationale: 'Needed to build components and manage local interface state.' },
    { career_role_id: 1, skill_id: 5, required_proficiency: 3, rationale: 'Crucial for team collaboration and code repository management.' },
    { career_role_id: 1, skill_id: 6, required_proficiency: 2, rationale: 'Basic understanding of relational tables, queries, and data retrieval.' },

    // Frontend Developer
    { career_role_id: 2, skill_id: 1, required_proficiency: 5, rationale: 'Mastery of semantic markup, advanced CSS architecture, animations, and accessibility.' },
    { career_role_id: 2, skill_id: 2, required_proficiency: 5, rationale: 'Deep proficiency with modern JavaScript ES6+, functional paradigms, and async patterns.' },
    { career_role_id: 2, skill_id: 3, required_proficiency: 4, rationale: 'Advanced component patterns, custom hooks, and state synchronization.' },
    { career_role_id: 2, skill_id: 5, required_proficiency: 4, rationale: 'Proficient branch workflows, code reviews, and Git history maintenance.' },
    { career_role_id: 2, skill_id: 7, required_proficiency: 3, rationale: 'Seamlessly consume and handle backend REST APIs and error states.' },

    // Backend Developer
    { career_role_id: 3, skill_id: 4, required_proficiency: 4, rationale: 'Proficient in building scalable Express services and middleware architectures.' },
    { career_role_id: 3, skill_id: 6, required_proficiency: 4, rationale: 'Expert in relational schema design, query optimization, indexing, and transactions.' },
    { career_role_id: 3, skill_id: 7, required_proficiency: 4, rationale: 'Design standardized, secure, and well-documented HTTP API endpoints.' },
    { career_role_id: 3, skill_id: 2, required_proficiency: 4, rationale: 'Strong server-side JavaScript logic and asynchronous execution comprehension.' },
    { career_role_id: 3, skill_id: 5, required_proficiency: 3, rationale: 'Manage backend repositories, configuration environments, and releases.' },

    // Full Stack Engineer
    { career_role_id: 4, skill_id: 1, required_proficiency: 4, rationale: 'Solid responsive interface construction and styling skills.' },
    { career_role_id: 4, skill_id: 2, required_proficiency: 4, rationale: 'Comprehensive fluency in modern JavaScript across client and server runtimes.' },
    { career_role_id: 4, skill_id: 3, required_proficiency: 4, rationale: 'Build complex React frontends with modern hooks and data fetching.' },
    { career_role_id: 4, skill_id: 4, required_proficiency: 4, rationale: 'Develop secure, performant Node.js and Express backend services.' },
    { career_role_id: 4, skill_id: 6, required_proficiency: 3, rationale: 'Design normalized MySQL database schemas and execute parameterized queries.' },
    { career_role_id: 4, skill_id: 5, required_proficiency: 4, rationale: 'Maintain complete full-stack repository and deployment workflows.' }
  ],
  resources: [
    {
      id: 1,
      title: 'HTML5 & CSS3 Master Reference Guide',
      description: 'Comprehensive lecture notes covering semantic elements, Flexbox layout algorithms, CSS Grid templates, and mobile-first responsive breakpoints.',
      subject: 'Web Technologies',
      unit: 'Unit 1',
      topic: 'Semantic Web & Modern Layouts',
      type: 'notes',
      difficulty: 'beginner',
      uploader_id: 2,
      file_path: null,
      file_name: 'HTML5_CSS3_Guide.pdf',
      file_size: 2450000,
      mime_type: 'application/pdf',
      external_url: 'https://developer.mozilla.org/en-US/docs/Learn/HTML',
      version: '1.0',
      status: 'active',
      created_at: '2026-09-03T11:00:00.000Z',
      updated_at: '2026-09-03T11:00:00.000Z'
    },
    {
      id: 2,
      title: 'Modern JavaScript ES6+ Deep Dive Slides',
      description: 'Complete presentation slides explaining closures, lexical scoping, Promises, async/await patterns, array manipulation methods, and module exports.',
      subject: 'Web Technologies',
      unit: 'Unit 2',
      topic: 'Asynchronous JS & ES6 Features',
      type: 'ppt',
      difficulty: 'intermediate',
      uploader_id: 2,
      file_path: null,
      file_name: 'Modern_JavaScript_ES6.pptx',
      file_size: 3890000,
      mime_type: 'application/vnd.openxmlformats-officedocument.presentationml.presentation',
      external_url: 'https://javascript.info/',
      version: '1.2',
      status: 'active',
      created_at: '2026-09-04T14:30:00.000Z',
      updated_at: '2026-09-04T14:30:00.000Z'
    },
    {
      id: 3,
      title: 'React Components, Hooks & State Architecture',
      description: 'Step-by-step practical tutorial guiding students through useState, useEffect, custom hooks, lifting state, and clean component composition.',
      subject: 'Web Technologies',
      unit: 'Unit 3',
      topic: 'React Framework & Hook Fundamentals',
      type: 'tutorial',
      difficulty: 'intermediate',
      uploader_id: 2,
      file_path: null,
      file_name: 'React_Hooks_Tutorial.pdf',
      file_size: 3120000,
      mime_type: 'application/pdf',
      external_url: 'https://react.dev/learn',
      version: '2.0',
      status: 'active',
      created_at: '2026-09-05T09:15:00.000Z',
      updated_at: '2026-09-05T09:15:00.000Z'
    },
    {
      id: 4,
      title: 'Git & GitHub Collaboration Lab Manual',
      description: 'Hands-on practical laboratory guide on repository initialization, commit hygiene, feature branching, resolving merge conflicts, and pull requests.',
      subject: 'Software Engineering Tools',
      unit: 'Unit 1',
      topic: 'Distributed Version Control',
      type: 'notes',
      difficulty: 'beginner',
      uploader_id: 3,
      file_path: null,
      file_name: 'Git_GitHub_Lab_Manual.pdf',
      file_size: 1850000,
      mime_type: 'application/pdf',
      external_url: 'https://git-scm.com/doc',
      version: '1.1',
      status: 'active',
      created_at: '2026-09-06T16:00:00.000Z',
      updated_at: '2026-09-06T16:00:00.000Z'
    },
    {
      id: 5,
      title: 'Relational Database Schema Design & SQL Handbook',
      description: 'In-depth reference notes on E-R diagrams, Third Normal Form (3NF), complex multi-table JOINs, indexing strategies, and parameterized statements.',
      subject: 'Database Management Systems',
      unit: 'Unit 4',
      topic: 'Relational Schema & SQL Optimization',
      type: 'reference',
      difficulty: 'intermediate',
      uploader_id: 3,
      file_path: null,
      file_name: 'SQL_Database_Handbook.pdf',
      file_size: 4200000,
      mime_type: 'application/pdf',
      external_url: 'https://dev.mysql.com/doc/',
      version: '1.0',
      status: 'active',
      created_at: '2026-09-07T10:00:00.000Z',
      updated_at: '2026-09-07T10:00:00.000Z'
    },
    {
      id: 6,
      title: 'Building Robust RESTful APIs with Node.js & Express',
      description: 'Technical tutorial covering Express router structure, custom authentication middleware, input sanitization, error propagation, and HTTP response codes.',
      subject: 'Advanced Web Programming',
      unit: 'Unit 3',
      topic: 'RESTful Backend Engineering',
      type: 'tutorial',
      difficulty: 'intermediate',
      uploader_id: 2,
      file_path: null,
      file_name: 'Node_Express_REST_APIs.pdf',
      file_size: 3450000,
      mime_type: 'application/pdf',
      external_url: 'https://expressjs.com/',
      version: '1.0',
      status: 'active',
      created_at: '2026-09-08T11:45:00.000Z',
      updated_at: '2026-09-08T11:45:00.000Z'
    },
    {
      id: 7,
      title: 'JavaScript Array Methods & Async Coding Exercises',
      description: 'Curated set of 15 practical coding exercises testing map, filter, reduce, Promise.all, and debounce/throttle implementation.',
      subject: 'Web Technologies',
      unit: 'Unit 2',
      topic: 'Functional JS & Async Patterns',
      type: 'exercise',
      difficulty: 'intermediate',
      uploader_id: 2,
      file_path: null,
      file_name: 'JS_Async_Exercises.pdf',
      file_size: 1200000,
      mime_type: 'application/pdf',
      external_url: null,
      version: '1.0',
      status: 'active',
      created_at: '2026-09-09T13:20:00.000Z',
      updated_at: '2026-09-09T13:20:00.000Z'
    },
    {
      id: 8,
      title: 'Full-Stack Web Application Capstone Project Specification',
      description: 'Detailed engineering project brief for architecting a modular resource management web application with role-based access control and persistent storage.',
      subject: 'Problem Solving in Engineering',
      unit: 'Unit 5',
      topic: 'Integrated Web Application Capstone',
      type: 'project',
      difficulty: 'advanced',
      uploader_id: 3,
      file_path: null,
      file_name: 'PSE_Module5_Capstone_Brief.pdf',
      file_size: 2900000,
      mime_type: 'application/pdf',
      external_url: null,
      version: '1.0',
      status: 'active',
      created_at: '2026-09-10T15:00:00.000Z',
      updated_at: '2026-09-10T15:00:00.000Z'
    }
  ],
  resource_skills: [
    { resource_id: 1, skill_id: 1 },
    { resource_id: 2, skill_id: 2 },
    { resource_id: 3, skill_id: 2 },
    { resource_id: 3, skill_id: 3 },
    { resource_id: 4, skill_id: 5 },
    { resource_id: 5, skill_id: 6 },
    { resource_id: 6, skill_id: 4 },
    { resource_id: 6, skill_id: 7 },
    { resource_id: 6, skill_id: 2 },
    { resource_id: 7, skill_id: 2 },
    { resource_id: 8, skill_id: 1 },
    { resource_id: 8, skill_id: 2 },
    { resource_id: 8, skill_id: 3 },
    { resource_id: 8, skill_id: 4 },
    { resource_id: 8, skill_id: 6 }
  ],
  practice_tasks: [
    {
      id: 1,
      title: 'Build a Responsive Personal Developer Portfolio',
      description: 'Design and build a responsive multi-section portfolio showcasing projects, education, and contact form using clean HTML5 semantics and modern CSS Flexbox/Grid.',
      difficulty: 'beginner',
      learning_objective: 'Master semantic markup, CSS positioning, mobile responsive breakpoints, and accessibility standards.',
      estimated_duration: '4-6 hours',
      suggested_steps: '1. Draft wireframe layout\n2. Code semantic header, about, projects, contact sections\n3. Apply mobile-first CSS media queries\n4. Validate HTML & test responsiveness across mobile/tablet views',
      external_url: 'https://github.com',
      is_active: 1
    },
    {
      id: 2,
      title: 'Build an Interactive Form with Real-Time Client Validation',
      description: 'Create a user registration and password strength verification form with dynamic error indicators, regex validation, and responsive input feedback without page refresh.',
      difficulty: 'intermediate',
      learning_objective: 'Deepen understanding of DOM events, regular expressions, dynamic class manipulation, and defensive user validation.',
      estimated_duration: '3-4 hours',
      suggested_steps: '1. Build accessible form elements\n2. Add input change and blur event listeners\n3. Implement regex checks for email and password rules\n4. Render accessible error feedback badges',
      external_url: null,
      is_active: 1
    },
    {
      id: 3,
      title: 'Searchable Academic Resource Listing Interface in React',
      description: 'Implement a React application component with live keyword search, multiple badge filters (type, difficulty, subject), and instantaneous client filtering.',
      difficulty: 'intermediate',
      learning_objective: 'Apply React useState, useMemo hooks, array filtering techniques, and clean component decomposition.',
      estimated_duration: '4-5 hours',
      suggested_steps: '1. Create mock data array\n2. Build search input and category filter chips\n3. Connect state using useMemo for efficient re-renders\n4. Render empty state card when no resources match',
      external_url: null,
      is_active: 1
    },
    {
      id: 4,
      title: 'Collaborative Git Branching & Pull Request Simulation',
      description: 'Initialize a Git repository, create separate feature branches, simulate an edit conflict on the same file, resolve the merge conflict, and submit a PR.',
      difficulty: 'beginner',
      learning_objective: 'Acquire hands-on mastery of Git branch lifecycles, stash, rebase vs merge, and clean commit history formatting.',
      estimated_duration: '2-3 hours',
      suggested_steps: '1. Initialize git repo and make initial commit\n2. Branch to feature/profile and feature/auth\n3. Introduce conflicting edits\n4. Merge and resolve conflicts manually\n5. Push cleanly to GitHub',
      external_url: 'https://learngitbranching.js.org/',
      is_active: 1
    },
    {
      id: 5,
      title: 'Relational Database Design & Parameterized CRUD API',
      description: 'Design a 3-table normalized relational schema in MySQL for a university library, write index-optimized queries, and build parameterized CRUD operations.',
      difficulty: 'intermediate',
      learning_objective: 'Master relational constraints, foreign keys, SQL injection prevention via parameterized queries, and connection pools.',
      estimated_duration: '5-6 hours',
      suggested_steps: '1. Model ER diagram with 3NF normalization\n2. Execute DDL script with foreign keys and indexes\n3. Write parameterized SELECT, INSERT, UPDATE queries\n4. Test query performance with EXPLAIN plan',
      external_url: null,
      is_active: 1
    },
    {
      id: 6,
      title: 'Build a Production-Grade JWT Authentication Middleware in Express',
      description: 'Implement a secure authentication microservice featuring bcrypt password hashing, signed JWT token generation, HTTP authorization header parsing, and role verification middleware.',
      difficulty: 'advanced',
      learning_objective: 'Understand stateless web token security, token expiration handling, RBAC route guarding, and defensive HTTP headers.',
      estimated_duration: '5-7 hours',
      suggested_steps: '1. Set up Express router with POST /register and /login\n2. Hash incoming password using bcryptjs\n3. Sign JWT with configurable secret and expiry\n4. Write authenticateToken and authorizeRoles middleware functions',
      external_url: null,
      is_active: 1
    }
  ],
  practice_task_skills: [
    { practice_task_id: 1, skill_id: 1 },
    { practice_task_id: 1, skill_id: 5 },
    { practice_task_id: 2, skill_id: 2 },
    { practice_task_id: 2, skill_id: 1 },
    { practice_task_id: 3, skill_id: 3 },
    { practice_task_id: 3, skill_id: 2 },
    { practice_task_id: 4, skill_id: 5 },
    { practice_task_id: 5, skill_id: 6 },
    { practice_task_id: 6, skill_id: 4 },
    { practice_task_id: 6, skill_id: 7 }
  ],
  assessments: [
    {
      id: 1,
      student_id: 4,
      career_role_id: 1, // Junior Web Developer
      assessment_date: '2026-09-12T14:00:00.000Z',
      total_skills: 5,
      skills_meeting_target: 2,
      average_gap: 1.00,
      notes: 'Initial baseline assessment for semester project'
    }
  ],
  assessment_skill_results: [
    { id: 1, assessment_id: 1, skill_id: 1, current_proficiency: 4, target_proficiency: 4, skill_gap: 0, gap_percentage: 0.00 },
    { id: 2, assessment_id: 1, skill_id: 2, current_proficiency: 2, target_proficiency: 4, skill_gap: 2, gap_percentage: 50.00 },
    { id: 3, assessment_id: 1, skill_id: 3, current_proficiency: 2, target_proficiency: 3, skill_gap: 1, gap_percentage: 33.33 },
    { id: 4, assessment_id: 1, skill_id: 5, current_proficiency: 3, target_proficiency: 3, skill_gap: 0, gap_percentage: 0.00 },
    { id: 5, assessment_id: 1, skill_id: 6, current_proficiency: 1, target_proficiency: 2, skill_gap: 1, gap_percentage: 50.00 }
  ],
  roadmaps: [
    {
      id: 1,
      student_id: 4,
      assessment_id: 1,
      title: 'Junior Web Developer Learning Roadmap',
      status: 'active',
      created_at: '2026-09-12T14:05:00.000Z',
      updated_at: '2026-09-12T14:05:00.000Z'
    }
  ],
  roadmap_items: [
    {
      id: 1,
      roadmap_id: 1,
      skill_id: 2,
      resource_id: 2,
      practice_task_id: 2,
      priority: 1,
      status: 'in_progress',
      estimated_duration: '3-4 hours',
      completion_date: null,
      notes: 'Focus on ES6 array methods and asynchronous Promise chains'
    },
    {
      id: 2,
      roadmap_id: 1,
      skill_id: 3,
      resource_id: 3,
      practice_task_id: 3,
      priority: 2,
      status: 'not_started',
      estimated_duration: '4-5 hours',
      completion_date: null,
      notes: 'Component state lifting and useEffect hooks'
    },
    {
      id: 3,
      roadmap_id: 1,
      skill_id: 6,
      resource_id: 5,
      practice_task_id: 5,
      priority: 3,
      status: 'not_started',
      estimated_duration: '5-6 hours',
      completion_date: null,
      notes: 'Relational schema modeling and basic SELECT/JOIN queries'
    }
  ]
};
