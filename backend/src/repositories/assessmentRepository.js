import { query, getEngine, getMemoryStore } from '../config/database.js';

export const assessmentRepository = {
  async create(studentId, careerRoleId, { total_skills, skills_meeting_target, average_gap, notes = '' }, skillResults) {
    const numStudentId = parseInt(studentId, 10);
    const numRoleId = parseInt(careerRoleId, 10);

    if (getEngine() === 'mysql') {
      const sqlAssessment = `
        INSERT INTO assessments (student_id, career_role_id, total_skills, skills_meeting_target, average_gap, notes)
        VALUES (?, ?, ?, ?, ?, ?)
      `;
      const res = await query(sqlAssessment, [
        numStudentId, numRoleId, total_skills, skills_meeting_target, average_gap, notes
      ]);
      const assessmentId = res.insertId;

      for (const item of skillResults) {
        await query(`
          INSERT INTO assessment_skill_results (
            assessment_id, skill_id, current_proficiency, target_proficiency, skill_gap, gap_percentage
          ) VALUES (?, ?, ?, ?, ?, ?)
        `, [
          assessmentId,
          parseInt(item.skill_id, 10),
          parseInt(item.current_proficiency, 10),
          parseInt(item.target_proficiency, 10),
          parseInt(item.skill_gap, 10),
          parseFloat(item.gap_percentage)
        ]);
      }

      return this.findById(assessmentId);
    }

    const store = getMemoryStore();
    const newId = store.assessments.length ? Math.max(...store.assessments.map(a => a.id)) + 1 : 1;
    const newAssessment = {
      id: newId,
      student_id: numStudentId,
      career_role_id: numRoleId,
      assessment_date: new Date().toISOString(),
      total_skills,
      skills_meeting_target,
      average_gap: parseFloat(average_gap),
      notes,
      created_at: new Date().toISOString()
    };
    store.assessments.push(newAssessment);

    for (const item of skillResults) {
      const resultId = store.assessment_skill_results.length ? Math.max(...store.assessment_skill_results.map(r => r.id)) + 1 : 1;
      store.assessment_skill_results.push({
        id: resultId,
        assessment_id: newId,
        skill_id: parseInt(item.skill_id, 10),
        current_proficiency: parseInt(item.current_proficiency, 10),
        target_proficiency: parseInt(item.target_proficiency, 10),
        skill_gap: parseInt(item.skill_gap, 10),
        gap_percentage: parseFloat(item.gap_percentage)
      });
    }

    return this.findById(newId);
  },

  async findByStudent(studentId) {
    const numId = parseInt(studentId, 10);
    if (getEngine() === 'mysql') {
      const sql = `
        SELECT a.*, cr.name as career_role_name
        FROM assessments a
        JOIN career_roles cr ON a.career_role_id = cr.id
        WHERE a.student_id = ?
        ORDER BY a.assessment_date DESC
      `;
      const list = await query(sql, [numId]);
      for (const a of list) {
        a.skill_results = await this.getSkillResults(a.id);
      }
      return list;
    }

    const store = getMemoryStore();
    return store.assessments
      .filter(a => a.student_id === numId)
      .map(a => {
        const role = store.career_roles.find(r => r.id === a.career_role_id);
        return {
          ...a,
          career_role_name: role ? role.name : 'Custom Role',
          skill_results: this.getSkillResultsSync(a.id, store)
        };
      })
      .sort((a, b) => new Date(b.assessment_date) - new Date(a.assessment_date));
  },

  async findById(id) {
    const numId = parseInt(id, 10);
    if (getEngine() === 'mysql') {
      const sql = `
        SELECT a.*, cr.name as career_role_name, cr.description as career_role_description
        FROM assessments a
        JOIN career_roles cr ON a.career_role_id = cr.id
        WHERE a.id = ?
      `;
      const rows = await query(sql, [numId]);
      if (!rows[0]) return null;
      const assessment = rows[0];
      assessment.skill_results = await this.getSkillResults(assessment.id);
      return assessment;
    }

    const store = getMemoryStore();
    const a = store.assessments.find(item => item.id === numId);
    if (!a) return null;
    const role = store.career_roles.find(r => r.id === a.career_role_id);
    return {
      ...a,
      career_role_name: role ? role.name : 'Custom Role',
      career_role_description: role ? role.description : '',
      skill_results: this.getSkillResultsSync(a.id, store)
    };
  },

  async getSkillResults(assessmentId) {
    const numId = parseInt(assessmentId, 10);
    if (getEngine() === 'mysql') {
      const sql = `
        SELECT 
          asr.*,
          s.name as skill_name,
          s.category as skill_category
        FROM assessment_skill_results asr
        JOIN skills s ON asr.skill_id = s.id
        WHERE asr.assessment_id = ?
        ORDER BY asr.skill_gap DESC, s.name ASC
      `;
      return await query(sql, [numId]);
    }
    const store = getMemoryStore();
    return this.getSkillResultsSync(numId, store);
  },

  getSkillResultsSync(assessmentId, store) {
    return store.assessment_skill_results
      .filter(r => r.assessment_id === assessmentId)
      .map(r => {
        const skill = store.skills.find(s => s.id === r.skill_id);
        return {
          ...r,
          skill_name: skill ? skill.name : 'Unknown Skill',
          skill_category: skill ? skill.category : 'General'
        };
      })
      .sort((a, b) => b.skill_gap - a.skill_gap || a.skill_name.localeCompare(b.skill_name));
  }
};
