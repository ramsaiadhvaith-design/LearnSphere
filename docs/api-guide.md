# LearnSphere — REST API Reference Guide

All API endpoints are prefixed with `/api` and return standardized JSON responses.

---

## 1. Authentication Endpoints

### `POST /api/auth/register`
Creates a new Student account. Public registration cannot create Faculty or Admin accounts.
- **Request Body:** `{ "name": "...", "email": "...", "password": "..." }`
- **Response (201 Created):** `{ "success": true, "user": {...}, "token": "..." }`

### `POST /api/auth/login`
Authenticates credentials and generates a signed JWT token.
- **Request Body:** `{ "email": "...", "password": "..." }`
- **Response (200 OK):** `{ "success": true, "user": {...}, "token": "..." }`

### `GET /api/auth/me`
Validates session token and returns active user details.
- **Header:** `Authorization: Bearer <token>`
- **Response (200 OK):** `{ "success": true, "user": {...} }`

---

## 2. Academic Resources Endpoints

### `GET /api/resources`
Retrieves academic resources with optional filtering and search parameters.
- **Query Params:** `search`, `subject`, `unit`, `topic`, `type`, `skillId`, `difficulty`, `status`
- **Response (200 OK):** `{ "success": true, "count": N, "resources": [...] }`

### `POST /api/resources`
Uploads a new academic resource. Restricted to `faculty` and `admin`.
- **Headers:** `Authorization: Bearer <token>`, `Content-Type: multipart/form-data`
- **Body Fields:** `title`, `description`, `subject`, `unit`, `topic`, `type`, `difficulty`, `version`, `skills`, `file`
- **Response (201 Created):** `{ "success": true, "resource": {...} }`

### `GET /api/resources/:id/download`
Downloads authorized academic resource attachment with path traversal protection.
- **Headers:** `Authorization: Bearer <token>`
- **Response:** File stream with `Content-Disposition` attachment header.

---

## 3. Career Roles & Skills Endpoints

### `GET /api/career-roles`
Returns all active career roles with their configured required skills and target levels (1–5).
- **Response (200 OK):** `{ "success": true, "roles": [...] }`

### `POST /api/career-roles` *(Admin only)*
Creates an industry career role with skill benchmark proficiency levels.
- **Body:** `{ "name": "...", "description": "...", "skills": [{ "skill_id": 1, "required_proficiency": 4 }] }`

### `GET /api/skills`
Returns full technical skills taxonomy.

---

## 4. Skill Assessment & Roadmaps Endpoints

### `POST /api/assessments` *(Student only)*
Evaluates self-assessed skill proficiencies against target role benchmarks using the rule engine.
- **Body:**
  ```json
  {
    "career_role_id": 1,
    "ratings": [
      { "skill_id": 1, "rating": 4 },
      { "skill_id": 2, "rating": 2 }
    ],
    "notes": "Semester objective notes"
  }
  ```
- **Response (201 Created):** Contains computed skill gaps, gap percentages, recommendations, and auto-generated roadmap.

### `GET /api/roadmaps/latest` *(Student only)*
Returns student's latest personalized learning roadmap and activity progress.

### `PATCH /api/roadmaps/items/:id/progress` *(Student only)*
Updates status of a learning activity (`not_started`, `in_progress`, `completed`).
- **Body:** `{ "status": "completed", "notes": "..." }`
- **Response (200 OK):** `{ "success": true, "item": {...}, "progress": { "percentage": 67, ... } }`

---

## 5. Administration Endpoints

### `GET /api/users` *(Admin only)*
Returns all registered accounts.

### `POST /api/users` *(Admin only)*
Provisions authorized Faculty or Administrator accounts.

### `GET /api/stats` *(Admin only)*
Calculates aggregate database counts for total users, students, faculty, active resources, and completed learning activities.
