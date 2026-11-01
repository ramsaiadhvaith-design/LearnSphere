const API_BASE = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api';

async function request(endpoint, options = {}) {
  const token = localStorage.getItem('learnsphere_token');
  const headers = { ...options.headers };

  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  // If body is NOT FormData, set JSON content-type
  if (options.body && !(options.body instanceof FormData)) {
    headers['Content-Type'] = 'application/json';
    options.body = JSON.stringify(options.body);
  }

  const response = await fetch(`${API_BASE}${endpoint}`, {
    ...options,
    headers
  });

  // Handle unauthorized or token expired
  if (response.status === 401) {
    localStorage.removeItem('learnsphere_token');
    localStorage.removeItem('learnsphere_user');
    if (!window.location.pathname.includes('/login') && !window.location.pathname.includes('/register')) {
      window.location.href = '/login?expired=true';
    }
  }

  const data = await response.json().catch(() => ({ success: false, message: 'Server communication error' }));

  if (!response.ok) {
    const error = new Error(data.message || `Request failed with status ${response.status}`);
    error.status = response.status;
    error.data = data;
    throw error;
  }

  return data;
}

export const api = {
  // Auth
  login: (email, password) => request('/auth/login', { method: 'POST', body: { email, password } }),
  register: (name, email, password) => request('/auth/register', { method: 'POST', body: { name, email, password } }),
  getMe: () => request('/auth/me'),

  // Users (Admin)
  getUsers: () => request('/users'),
  getUser: (id) => request(`/users/${id}`),
  createUser: (data) => request('/users', { method: 'POST', body: data }),
  updateUser: (id, data) => request(`/users/${id}`, { method: 'PATCH', body: data }),
  updateProfile: (data) => request('/users/profile', { method: 'PUT', body: data }),

  // Academic Resources
  getResources: (params = {}) => {
    const searchParams = new URLSearchParams();
    Object.entries(params).forEach(([k, v]) => {
      if (v !== undefined && v !== null && v !== '' && v !== 'all') {
        searchParams.append(k, v);
      }
    });
    const qs = searchParams.toString();
    return request(`/resources${qs ? `?${qs}` : ''}`);
  },
  getResource: (id) => request(`/resources/${id}`),
  createResource: (formData) => request('/resources', { method: 'POST', body: formData }),
  updateResource: (id, formData) => request(`/resources/${id}`, { method: 'PUT', body: formData }),
  archiveResource: (id) => request(`/resources/${id}`, { method: 'DELETE' }),
  getDownloadUrl: (id) => `${API_BASE}/resources/${id}/download`,

  // Career Roles
  getCareerRoles: (all = false) => request(`/career-roles${all ? '?all=true' : ''}`),
  getCareerRole: (id) => request(`/career-roles/${id}`),
  createCareerRole: (data) => request('/career-roles', { method: 'POST', body: data }),
  updateCareerRole: (id, data) => request(`/career-roles/${id}`, { method: 'PUT', body: data }),
  setCareerRoleSkills: (id, skills) => request(`/career-roles/${id}/skills`, { method: 'PUT', body: { skills } }),

  // Skills
  getSkills: (all = false) => request(`/skills${all ? '?all=true' : ''}`),
  getSkill: (id) => request(`/skills/${id}`),
  createSkill: (data) => request('/skills', { method: 'POST', body: data }),
  updateSkill: (id, data) => request(`/skills/${id}`, { method: 'PUT', body: data }),

  // Skill Assessments
  submitAssessment: (careerRoleId, ratings, notes, autoGenerateRoadmap = true) => 
    request('/assessments', {
      method: 'POST',
      body: { career_role_id: careerRoleId, ratings, notes, auto_generate_roadmap: autoGenerateRoadmap }
    }),
  getMyAssessments: () => request('/assessments/my'),
  getAssessment: (id) => request(`/assessments/${id}`),

  // Roadmaps & Progress
  getLatestRoadmap: () => request('/roadmaps/latest'),
  getRoadmap: (id) => request(`/roadmaps/${id}`),
  generateRoadmap: (assessmentId) => request('/roadmaps/generate', { method: 'POST', body: { assessment_id: assessmentId } }),
  updateItemProgress: (itemId, status, notes = '') => 
    request(`/roadmaps/items/${itemId}/progress`, {
      method: 'PATCH',
      body: { status, notes }
    }),
  getStudentProgressStats: () => request('/roadmaps/stats'),

  // Practice Tasks
  getTasks: (all = false) => request(`/tasks${all ? '?all=true' : ''}`),
  getTask: (id) => request(`/tasks/${id}`),
  createTask: (data) => request('/tasks', { method: 'POST', body: data }),
  updateTask: (id, data) => request(`/tasks/${id}`, { method: 'PUT', body: data }),

  // Admin Platform Stats
  getPlatformStats: () => request('/stats')
};

export default api;
