// Automated Integration and Verification Script for LearnSphere APIs
const BASE_URL = 'http://localhost:5000/api';

async function testSuite() {
  console.log('🧪 Starting LearnSphere Automated API Verification Suite...\n');
  let passed = 0;
  let failed = 0;

  function assert(condition, testName) {
    if (condition) {
      console.log(`  ✅ PASS: ${testName}`);
      passed++;
    } else {
      console.error(`  ❌ FAIL: ${testName}`);
      failed++;
    }
  }

  try {
    // 1. Health check
    const healthRes = await fetch(`${BASE_URL}/health`);
    const healthData = await healthRes.json();
    assert(healthRes.status === 200 && healthData.status === 'healthy', 'Health endpoint returns 200 OK');

    // 2. Student Login
    const studentLoginRes = await fetch(`${BASE_URL}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: 'student@learnsphere.edu', password: 'Student@123' })
    });
    const studentData = await studentLoginRes.json();
    assert(studentLoginRes.status === 200 && studentData.token && studentData.user.role === 'student', 'Student login returns valid JWT token and role student');
    const studentToken = studentData.token;

    // 3. Faculty Login
    const facultyLoginRes = await fetch(`${BASE_URL}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: 'faculty@learnsphere.edu', password: 'Faculty@123' })
    });
    const facultyData = await facultyLoginRes.json();
    assert(facultyLoginRes.status === 200 && facultyData.user.role === 'faculty', 'Faculty login returns role faculty');
    const facultyToken = facultyData.token;

    // 4. Admin Login
    const adminLoginRes = await fetch(`${BASE_URL}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: 'admin@learnsphere.edu', password: 'Admin@123' })
    });
    const adminData = await adminLoginRes.json();
    assert(adminLoginRes.status === 200 && adminData.user.role === 'admin', 'Admin login returns role admin');
    const adminToken = adminData.token;

    // 5. RBAC Security Check: Student CANNOT access Admin users list
    const unauthorizedRes = await fetch(`${BASE_URL}/users`, {
      headers: { Authorization: `Bearer ${studentToken}` }
    });
    assert(unauthorizedRes.status === 403, 'RBAC blocks Student from accessing GET /api/users (returns HTTP 403 Forbidden)');

    // 6. Admin CAN access Admin users list
    const adminUsersRes = await fetch(`${BASE_URL}/users`, {
      headers: { Authorization: `Bearer ${adminToken}` }
    });
    const adminUsersData = await adminUsersRes.json();
    assert(adminUsersRes.status === 200 && adminUsersData.users.length >= 3, 'Admin accesses GET /api/users successfully');

    // 7. Student Registration and Duplicate Prevention
    const testEmail = `newstudent_${Date.now()}@learnsphere.edu`;
    const regRes = await fetch(`${BASE_URL}/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name: 'Test Student', email: testEmail, password: 'Password@123' })
    });
    const regData = await regRes.json();
    assert(regRes.status === 201 && regData.user.role === 'student', 'Student registration creates student account');

    // Duplicate check
    const dupRes = await fetch(`${BASE_URL}/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name: 'Test Duplicate', email: testEmail, password: 'Password@123' })
    });
    assert(dupRes.status === 409, 'Duplicate email registration is rejected with HTTP 409 Conflict');

    // 8. Academic Resources Retrieval and Search
    const resListRes = await fetch(`${BASE_URL}/resources?search=JavaScript`, {
      headers: { Authorization: `Bearer ${studentToken}` }
    });
    const resListData = await resListRes.json();
    assert(resListRes.status === 200 && resListData.resources.length > 0, 'Resource search for "JavaScript" returns relevant academic resources');

    // 9. Career Roles and Required Skills
    const rolesRes = await fetch(`${BASE_URL}/career-roles`, {
      headers: { Authorization: `Bearer ${studentToken}` }
    });
    const rolesData = await rolesRes.json();
    const juniorWebDev = rolesData.roles.find(r => r.name === 'Junior Web Developer');
    assert(rolesRes.status === 200 && juniorWebDev && juniorWebDev.skills.length >= 4, 'Career role "Junior Web Developer" contains configured required skills');

    // 10. Skill Assessment Calculation & Persistence Test
    // Known test vector:
    // Junior Web Dev requires: HTML/CSS (4), JavaScript (4), React (3), Git (3), SQL (2)
    // Ratings submitted: HTML/CSS = 4 (Target 4 -> Gap 0, 0%), JavaScript = 2 (Target 4 -> Gap 2, 50%), React = 3 (Target 3 -> Gap 0, 0%)
    const assessSubmitRes = await fetch(`${BASE_URL}/assessments`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${studentToken}`
      },
      body: JSON.stringify({
        career_role_id: juniorWebDev.id,
        ratings: [
          { skill_id: 1, rating: 4 }, // HTML/CSS: Target 4 -> Gap 0
          { skill_id: 2, rating: 2 }, // JS: Target 4 -> Gap 2, 50%
          { skill_id: 3, rating: 3 }, // React: Target 3 -> Gap 0, 0%
          { skill_id: 5, rating: 3 }, // Git: Target 3 -> Gap 0, 0%
          { skill_id: 6, rating: 1 }  // SQL: Target 2 -> Gap 1, 50%
        ],
        notes: 'Verification test assessment'
      })
    });
    const assessData = await assessSubmitRes.json();
    assert(assessSubmitRes.status === 201, 'Assessment submission created successfully');

    // Verify formula calculations
    const jsResult = assessData.skill_results.find(s => s.skill_id === 2);
    assert(jsResult && jsResult.skill_gap === 2 && jsResult.gap_percentage === 50, 'Calculation: Target 4, Current 2 -> Skill Gap = 2, Gap % = 50%');

    const htmlResult = assessData.skill_results.find(s => s.skill_id === 1);
    assert(htmlResult && htmlResult.skill_gap === 0 && htmlResult.gap_percentage === 0, 'Calculation: Target 4, Current 4 -> Skill Gap = 0, Gap % = 0%');

    // 11. Integrated Recommendations for Identified Gaps
    assert(assessData.recommendations && assessData.recommendations.length >= 1, 'Recommendations engine returned resources for gap skills');
    const jsRec = assessData.recommendations.find(r => r.skill_id === 2);
    assert(jsRec && jsRec.resources.length > 0, 'Matching resources found for JavaScript gap');

    // 12. Personalized Learning Roadmap & Progress Tracking
    assert(assessData.roadmap && assessData.roadmap.items.length > 0, 'Personalized roadmap was auto-generated from assessment');
    const firstItem = assessData.roadmap.items[0];

    // Update activity status to 'in_progress' and then 'completed'
    const updateProgressRes = await fetch(`${BASE_URL}/roadmaps/items/${firstItem.id}/progress`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${studentToken}`
      },
      body: JSON.stringify({ status: 'completed', notes: 'Completed exercises and manual review.' })
    });
    const updateProgressData = await updateProgressRes.json();
    assert(updateProgressRes.status === 200 && updateProgressData.item.status === 'completed', 'Roadmap item progress updated to "completed" and persisted');

    // 13. Student Progress Stats
    const statsRes = await fetch(`${BASE_URL}/roadmaps/stats`, {
      headers: { Authorization: `Bearer ${studentToken}` }
    });
    const statsData = await statsRes.json();
    assert(statsRes.status === 200 && statsData.progress.completed >= 1, 'Student dashboard progress reflects completed activities');

    // 14. Admin Platform Statistics
    const platformStatsRes = await fetch(`${BASE_URL}/stats`, {
      headers: { Authorization: `Bearer ${adminToken}` }
    });
    const platformStatsData = await platformStatsRes.json();
    assert(platformStatsRes.status === 200 && platformStatsData.stats.total_users > 0, 'Admin platform statistics endpoint returns verified database counts');

  } catch (error) {
    console.error('Test execution error:', error);
    failed++;
  }

  console.log(`\n========================================`);
  console.log(`  Tests Passed: ${passed}`);
  console.log(`  Tests Failed: ${failed}`);
  console.log(`========================================\n`);

  if (failed > 0) {
    process.exit(1);
  } else {
    process.exit(0);
  }
}

testSuite();
