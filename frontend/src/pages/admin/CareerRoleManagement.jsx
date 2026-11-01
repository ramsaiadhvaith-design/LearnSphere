import React, { useState, useEffect } from 'react';
import { api } from '../../services/api';
import { 
  Sliders, 
  Plus, 
  Edit2, 
  CheckCircle, 
  X, 
  Compass, 
  Tag, 
  AlertCircle,
  Trash2
} from 'lucide-react';

const PROFICIENCY_NAMES = {
  1: 'Beginner',
  2: 'Basic understanding',
  3: 'Intermediate',
  4: 'Advanced',
  5: 'Highly proficient'
};

export default function CareerRoleManagement() {
  const [roles, setRoles] = useState([]);
  const [skills, setSkills] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Modal State
  const [modalOpen, setModalOpen] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [roleSkills, setRoleSkills] = useState([]);
  const [saving, setSaving] = useState(false);
  const [modalError, setModalError] = useState('');

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setLoading(true);
    setError('');
    try {
      const [rolesRes, skillsRes] = await Promise.all([
        api.getCareerRoles(true),
        api.getSkills()
      ]);
      setRoles(rolesRes.roles || []);
      setSkills(skillsRes.skills || []);
    } catch (err) {
      setError(err.message || 'Failed to load roles and skills.');
    } finally {
      setLoading(false);
    }
  };

  const handleOpenCreateModal = () => {
    setEditingId(null);
    setName('');
    setDescription('');
    setRoleSkills([]);
    setModalError('');
    setModalOpen(true);
  };

  const handleOpenEditModal = (role) => {
    setEditingId(role.id);
    setName(role.name);
    setDescription(role.description || '');
    setRoleSkills(role.skills?.map(s => ({
      skill_id: s.skill_id,
      required_proficiency: s.required_proficiency,
      rationale: s.rationale || ''
    })) || []);
    setModalError('');
    setModalOpen(true);
  };

  const handleAddSkillToRole = (skillId) => {
    if (roleSkills.some(rs => rs.skill_id === skillId)) return;
    setRoleSkills(prev => [
      ...prev,
      { skill_id: skillId, required_proficiency: 3, rationale: '' }
    ]);
  };

  const handleRemoveSkillFromRole = (skillId) => {
    setRoleSkills(prev => prev.filter(rs => rs.skill_id !== skillId));
  };

  const handleProficiencyChange = (skillId, level) => {
    setRoleSkills(prev => prev.map(rs => rs.skill_id === skillId ? { ...rs, required_proficiency: parseInt(level, 10) } : rs));
  };

  const handleRationaleChange = (skillId, val) => {
    setRoleSkills(prev => prev.map(rs => rs.skill_id === skillId ? { ...rs, rationale: val } : rs));
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    setModalError('');
    setSaving(true);

    try {
      if (editingId) {
        await api.updateCareerRole(editingId, { name, description }, roleSkills);
      } else {
        await api.createCareerRole({ name, description, is_active: 1, skills: roleSkills });
      }

      setModalOpen(false);
      loadData();
    } catch (err) {
      setModalError(err.message || 'Failed to save career role configuration.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 rounded-3xl p-6 sm:p-10 text-white shadow-xl flex flex-col sm:flex-row sm:items-center justify-between gap-6">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/20 text-indigo-300 text-xs font-semibold mb-3 border border-indigo-400/30">
            <Sliders className="w-3.5 h-3.5" />
            SkillBridge Rule Engine Configuration
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
            Career Roles & Required Proficiency (1–5)
          </h1>
          <p className="mt-1 text-slate-300 text-sm max-w-xl">
            Define target engineering profiles, bind prerequisite skills, and configure target proficiency standards used for student gap calculations.
          </p>
        </div>

        <button
          onClick={handleOpenCreateModal}
          className="px-5 py-3 bg-indigo-600 hover:bg-indigo-500 text-white font-bold rounded-2xl shadow-lg transition-all flex items-center gap-2 self-start sm:self-auto"
        >
          <Plus className="w-5 h-5" />
          <span>Add Career Role</span>
        </button>
      </div>

      {error && (
        <div className="p-4 bg-rose-50 border border-rose-200 text-rose-800 rounded-2xl text-sm flex items-center gap-2">
          <AlertCircle className="w-5 h-5 flex-shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {/* Role Cards List */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {roles.map((r) => (
          <div
            key={r.id}
            className="bg-white rounded-3xl border border-slate-200/80 shadow-sm p-6 sm:p-8 flex flex-col justify-between"
          >
            <div>
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs font-bold px-2.5 py-1 rounded-full bg-indigo-50 text-indigo-700 border border-indigo-200">
                  {r.skills?.length || 0} Skills Required
                </span>
                <button
                  onClick={() => handleOpenEditModal(r)}
                  className="p-2 text-slate-400 hover:text-indigo-600 hover:bg-slate-100 rounded-xl transition-colors"
                >
                  <Edit2 className="w-4 h-4" />
                </button>
              </div>

              <h3 className="text-xl font-bold text-slate-900">{r.name}</h3>
              <p className="text-xs text-slate-600 mt-1.5 leading-relaxed">{r.description}</p>

              {/* Skills List */}
              <div className="mt-6 pt-4 border-t border-slate-100 space-y-2">
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">Configured Skill Benchmarks</h4>
                {r.skills?.map((sk) => (
                  <div key={sk.skill_id} className="p-2.5 bg-slate-50 rounded-xl flex items-center justify-between text-xs">
                    <div>
                      <span className="font-bold text-slate-800">{sk.skill_name}</span>
                      {sk.rationale && <div className="text-[11px] text-slate-500 line-clamp-1">{sk.rationale}</div>}
                    </div>
                    <span className="px-2 py-0.5 bg-blue-600 text-white rounded font-bold text-[10px]">
                      Lvl {sk.required_proficiency}/5
                    </span>
                  </div>
                ))}
              </div>
            </div>

            <div className="mt-6 pt-4 border-t border-slate-100 flex items-center justify-between">
              <span className="text-xs font-semibold text-emerald-600 flex items-center gap-1">
                <CheckCircle className="w-3.5 h-3.5" />
                Active in Rule Engine
              </span>
              <button
                onClick={() => handleOpenEditModal(r)}
                className="text-xs font-bold text-indigo-600 hover:underline"
              >
                Configure Benchmark &rarr;
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Edit / Create Modal */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-xs">
          <div className="bg-white rounded-3xl max-w-2xl w-full p-6 sm:p-8 shadow-2xl border border-slate-200 relative animate-fade-in max-h-[90vh] overflow-y-auto">
            <button
              onClick={() => setModalOpen(false)}
              className="absolute top-5 right-5 p-1.5 rounded-full text-slate-400 hover:text-slate-700 hover:bg-slate-100"
            >
              <X className="w-5 h-5" />
            </button>

            <h2 className="text-xl font-bold text-slate-900 mb-1">
              {editingId ? 'Edit Career Role & Benchmarks' : 'Create Career Role Benchmark'}
            </h2>
            <p className="text-xs text-slate-500 mb-5">
              Set target skills and required proficiency levels (1–5).
            </p>

            {modalError && (
              <div className="p-3 bg-rose-50 border border-rose-200 rounded-xl text-rose-800 text-xs flex items-center gap-2 mb-4">
                <AlertCircle className="w-4 h-4 flex-shrink-0" />
                <span>{modalError}</span>
              </div>
            )}

            <form onSubmit={handleFormSubmit} className="space-y-4 text-xs font-medium">
              <div>
                <label className="block text-slate-700 mb-1 font-bold">Role Title *</label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Cloud DevOps Engineer"
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-slate-700 mb-1 font-bold">Role Description</label>
                <textarea
                  rows={2}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Industry responsibilities and core expectations..."
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 focus:outline-none"
                ></textarea>
              </div>

              {/* Add Skill Dropdown */}
              <div>
                <label className="block text-slate-700 mb-1.5 font-bold">
                  Add Benchmark Skill
                </label>
                <select
                  onChange={(e) => {
                    if (e.target.value) {
                      handleAddSkillToRole(parseInt(e.target.value, 10));
                      e.target.value = '';
                    }
                  }}
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 font-semibold"
                >
                  <option value="">-- Choose skill to add to benchmark --</option>
                  {skills.filter(s => !roleSkills.some(rs => rs.skill_id === s.id)).map(s => (
                    <option key={s.id} value={s.id}>{s.name} ({s.category})</option>
                  ))}
                </select>
              </div>

              {/* Configured Skills in this role */}
              <div className="space-y-3 pt-2">
                <label className="block text-slate-700 font-bold">
                  Configured Skills ({roleSkills.length})
                </label>

                {roleSkills.length === 0 ? (
                  <p className="text-slate-400 italic">No skills added yet. Select from the dropdown above.</p>
                ) : (
                  roleSkills.map(rs => {
                    const sk = skills.find(s => s.id === rs.skill_id);
                    return (
                      <div key={rs.skill_id} className="p-3 bg-slate-50 rounded-2xl border border-slate-200/80 space-y-2">
                        <div className="flex items-center justify-between">
                          <span className="font-bold text-slate-900 text-sm">{sk?.name || `Skill #${rs.skill_id}`}</span>
                          <button
                            type="button"
                            onClick={() => handleRemoveSkillFromRole(rs.skill_id)}
                            className="p-1 text-slate-400 hover:text-rose-600 rounded-lg"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>

                        <div className="flex items-center gap-3">
                          <label className="text-slate-600 whitespace-nowrap">Required Level (1-5):</label>
                          <select
                            value={rs.required_proficiency}
                            onChange={(e) => handleProficiencyChange(rs.skill_id, e.target.value)}
                            className="p-1.5 bg-white border border-slate-200 rounded-lg font-bold text-blue-700"
                          >
                            {[1, 2, 3, 4, 5].map(lvl => (
                              <option key={lvl} value={lvl}>Lvl {lvl} - {PROFICIENCY_NAMES[lvl]}</option>
                            ))}
                          </select>
                        </div>

                        <input
                          type="text"
                          value={rs.rationale}
                          onChange={(e) => handleRationaleChange(rs.skill_id, e.target.value)}
                          placeholder="Educational rationale for this requirement level..."
                          className="w-full p-2 bg-white border border-slate-200 rounded-lg text-xs"
                        />
                      </div>
                    );
                  })
                )}
              </div>

              <div className="pt-4 flex items-center justify-end gap-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setModalOpen(false)}
                  className="px-4 py-2 text-sm text-slate-600 hover:bg-slate-100 rounded-xl font-medium"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className="px-6 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-sm font-bold shadow-md transition-colors disabled:opacity-50"
                >
                  {saving ? 'Saving...' : 'Save Benchmark'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
