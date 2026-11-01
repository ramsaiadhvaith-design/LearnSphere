-- ====================================================================
-- LearnSphere - Academic Resource Management & Skill Development Platform
-- Relational Database Schema (MySQL 8.0+)
-- ====================================================================

CREATE DATABASE IF NOT EXISTS learnsphere_db
  CHARACTER SET utf8mb4
  COLLATE utf8mb4_unicode_ci;

USE learnsphere_db;

-- Disable foreign key checks during creation
SET FOREIGN_KEY_CHECKS = 0;

-- 1. USERS TABLE
DROP TABLE IF EXISTS users;
CREATE TABLE users (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(120) NOT NULL,
  email VARCHAR(191) NOT NULL UNIQUE,
  password_hash VARCHAR(255) NOT NULL,
  role ENUM('admin', 'faculty', 'student') NOT NULL DEFAULT 'student',
  status ENUM('active', 'inactive') NOT NULL DEFAULT 'active',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX idx_users_role (role),
  INDEX idx_users_status (status)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 2. SKILLS TABLE
DROP TABLE IF EXISTS skills;
CREATE TABLE skills (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(120) NOT NULL UNIQUE,
  category VARCHAR(80) NOT NULL DEFAULT 'Technical',
  description TEXT,
  is_active TINYINT(1) NOT NULL DEFAULT 1,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX idx_skills_name (name)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 3. CAREER ROLES TABLE
DROP TABLE IF EXISTS career_roles;
CREATE TABLE career_roles (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(150) NOT NULL UNIQUE,
  description TEXT,
  is_active TINYINT(1) NOT NULL DEFAULT 1,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX idx_career_roles_name (name)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 4. CAREER ROLE SKILLS (Role requirements with target proficiency 1-5)
DROP TABLE IF EXISTS career_role_skills;
CREATE TABLE career_role_skills (
  career_role_id INT NOT NULL,
  skill_id INT NOT NULL,
  required_proficiency TINYINT NOT NULL CHECK (required_proficiency BETWEEN 1 AND 5),
  rationale VARCHAR(255),
  PRIMARY KEY (career_role_id, skill_id),
  FOREIGN KEY (career_role_id) REFERENCES career_roles(id) ON DELETE CASCADE,
  FOREIGN KEY (skill_id) REFERENCES skills(id) ON DELETE CASCADE,
  INDEX idx_crs_role (career_role_id),
  INDEX idx_crs_skill (skill_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 5. ACADEMIC RESOURCES TABLE
DROP TABLE IF EXISTS resources;
CREATE TABLE resources (
  id INT AUTO_INCREMENT PRIMARY KEY,
  title VARCHAR(200) NOT NULL,
  description TEXT,
  subject VARCHAR(120) NOT NULL,
  unit VARCHAR(60) NOT NULL,
  topic VARCHAR(150) NOT NULL,
  type ENUM('notes', 'ppt', 'assignment', 'tutorial', 'reference', 'exercise', 'project') NOT NULL,
  difficulty ENUM('beginner', 'intermediate', 'advanced') NOT NULL DEFAULT 'beginner',
  uploader_id INT NOT NULL,
  file_path VARCHAR(255) NULL,
  file_name VARCHAR(255) NULL,
  file_size BIGINT NULL,
  mime_type VARCHAR(100) NULL,
  external_url VARCHAR(500) NULL,
  version VARCHAR(20) NOT NULL DEFAULT '1.0',
  status ENUM('active', 'archived') NOT NULL DEFAULT 'active',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (uploader_id) REFERENCES users(id) ON DELETE RESTRICT,
  INDEX idx_res_subject (subject),
  INDEX idx_res_unit (unit),
  INDEX idx_res_type (type),
  INDEX idx_res_diff (difficulty),
  INDEX idx_res_status (status),
  INDEX idx_res_uploader (uploader_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 6. RESOURCE SKILLS MAPPING (Many-to-Many)
DROP TABLE IF EXISTS resource_skills;
CREATE TABLE resource_skills (
  resource_id INT NOT NULL,
  skill_id INT NOT NULL,
  PRIMARY KEY (resource_id, skill_id),
  FOREIGN KEY (resource_id) REFERENCES resources(id) ON DELETE CASCADE,
  FOREIGN KEY (skill_id) REFERENCES skills(id) ON DELETE CASCADE,
  INDEX idx_rs_resource (resource_id),
  INDEX idx_rs_skill (skill_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 7. ASSESSMENTS TABLE
DROP TABLE IF EXISTS assessments;
CREATE TABLE assessments (
  id INT AUTO_INCREMENT PRIMARY KEY,
  student_id INT NOT NULL,
  career_role_id INT NOT NULL,
  assessment_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  total_skills INT NOT NULL DEFAULT 0,
  skills_meeting_target INT NOT NULL DEFAULT 0,
  average_gap DECIMAL(5,2) NOT NULL DEFAULT 0.00,
  notes TEXT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (student_id) REFERENCES users(id) ON DELETE CASCADE,
  FOREIGN KEY (career_role_id) REFERENCES career_roles(id) ON DELETE RESTRICT,
  INDEX idx_assessments_student (student_id),
  INDEX idx_assessments_role (career_role_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 8. ASSESSMENT SKILL RESULTS TABLE (Historical snapshot of proficiency and gap)
DROP TABLE IF EXISTS assessment_skill_results;
CREATE TABLE assessment_skill_results (
  id INT AUTO_INCREMENT PRIMARY KEY,
  assessment_id INT NOT NULL,
  skill_id INT NOT NULL,
  current_proficiency TINYINT NOT NULL CHECK (current_proficiency BETWEEN 1 AND 5),
  target_proficiency TINYINT NOT NULL CHECK (target_proficiency BETWEEN 1 AND 5),
  skill_gap TINYINT NOT NULL DEFAULT 0,
  gap_percentage DECIMAL(5,2) NOT NULL DEFAULT 0.00,
  FOREIGN KEY (assessment_id) REFERENCES assessments(id) ON DELETE CASCADE,
  FOREIGN KEY (skill_id) REFERENCES skills(id) ON DELETE RESTRICT,
  INDEX idx_asr_assessment (assessment_id),
  INDEX idx_asr_skill (skill_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 9. PRACTICAL TASKS & MINI-PROJECTS TABLE
DROP TABLE IF EXISTS practice_tasks;
CREATE TABLE practice_tasks (
  id INT AUTO_INCREMENT PRIMARY KEY,
  title VARCHAR(200) NOT NULL,
  description TEXT NOT NULL,
  difficulty ENUM('beginner', 'intermediate', 'advanced') NOT NULL DEFAULT 'beginner',
  learning_objective TEXT NOT NULL,
  estimated_duration VARCHAR(60) NOT NULL DEFAULT '2-3 hours',
  suggested_steps TEXT,
  external_url VARCHAR(500) NULL,
  is_active TINYINT(1) NOT NULL DEFAULT 1,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX idx_tasks_difficulty (difficulty),
  INDEX idx_tasks_active (is_active)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 10. PRACTICE TASK SKILLS MAPPING (Many-to-Many)
DROP TABLE IF EXISTS practice_task_skills;
CREATE TABLE practice_task_skills (
  practice_task_id INT NOT NULL,
  skill_id INT NOT NULL,
  PRIMARY KEY (practice_task_id, skill_id),
  FOREIGN KEY (practice_task_id) REFERENCES practice_tasks(id) ON DELETE CASCADE,
  FOREIGN KEY (skill_id) REFERENCES skills(id) ON DELETE CASCADE,
  INDEX idx_pts_task (practice_task_id),
  INDEX idx_pts_skill (skill_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 11. ROADMAPS TABLE
DROP TABLE IF EXISTS roadmaps;
CREATE TABLE roadmaps (
  id INT AUTO_INCREMENT PRIMARY KEY,
  student_id INT NOT NULL,
  assessment_id INT NOT NULL,
  title VARCHAR(200) NOT NULL,
  status ENUM('active', 'completed', 'archived') NOT NULL DEFAULT 'active',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (student_id) REFERENCES users(id) ON DELETE CASCADE,
  FOREIGN KEY (assessment_id) REFERENCES assessments(id) ON DELETE CASCADE,
  INDEX idx_roadmaps_student (student_id),
  INDEX idx_roadmaps_status (status)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 12. ROADMAP ITEMS TABLE
DROP TABLE IF EXISTS roadmap_items;
CREATE TABLE roadmap_items (
  id INT AUTO_INCREMENT PRIMARY KEY,
  roadmap_id INT NOT NULL,
  skill_id INT NOT NULL,
  resource_id INT NULL,
  practice_task_id INT NULL,
  priority TINYINT NOT NULL DEFAULT 1,
  status ENUM('not_started', 'in_progress', 'completed') NOT NULL DEFAULT 'not_started',
  estimated_duration VARCHAR(60) DEFAULT '2-4 hours',
  completion_date TIMESTAMP NULL,
  notes TEXT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (roadmap_id) REFERENCES roadmaps(id) ON DELETE CASCADE,
  FOREIGN KEY (skill_id) REFERENCES skills(id) ON DELETE RESTRICT,
  FOREIGN KEY (resource_id) REFERENCES resources(id) ON DELETE SET NULL,
  FOREIGN KEY (practice_task_id) REFERENCES practice_tasks(id) ON DELETE SET NULL,
  INDEX idx_ri_roadmap (roadmap_id),
  INDEX idx_ri_status (status),
  INDEX idx_ri_skill (skill_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Enable foreign key checks
SET FOREIGN_KEY_CHECKS = 1;
