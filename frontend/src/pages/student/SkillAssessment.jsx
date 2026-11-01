import React, { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { api } from '../../services/api';
import { 
  CheckSquare, 
  Compass, 
  HelpCircle, 
  Calculator, 
  ArrowRight, 
  Sparkles, 
  AlertCircle,
  Info
} from 'lucide-react';

const PROFICIENCY_DEFINITIONS = [
  { level: 1, name: 'Beginner', desc: 'No or minimal hands-on coding experience; familiar with fundamental terms.' },
  { level: 2, name: 'Basic understanding', desc: 'Can read syntax and write simple logic with guided assistance.' },
  { level: 3, name: 'Intermediate', desc: 'Can implement standard features and solve moderate bugs independently.' },
  { level: 4, name: 'Advanced', desc: 'Deep architectural fluency; can debug complex issues and optimize performance.' },
  { level: 5, name: 'Highly proficient', desc: 'Mastery of patterns, clean code design, and team-level best practices.' }
];

export default function SkillAssessment() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  const [roles, setRoles] = useState([]);
  const [selectedRoleId, setSelectedRoleId] = useState(searchParams.get('roleId') || '');
  const [selectedRole, setSelectedRole] = useState(null);
  const [ratings, setRatings] = useState({});
  const [notes, setNotes] = useState('');

  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    async function loadInitial() {
      try {
        const res = await api.getCareerRoles();
        const roleList = res.roles || [];
        setRoles(roleList);

        const initialRole = roleList.find(r => String(r.id) === String(selectedRoleId)) || roleList[0];
        if (initialRole) {
          setSelectedRoleId(String(initialRole.id));
          setSelectedRole(initialRole);
          // Default all ratings to 2 (Basic understanding)
          const initialRatings = {};
          initialRole.skills?.forEach(s => {
            initialRatings[s.skill_id] = 2;
          });
          setRatings(initialRatings);
        }
      } catch (err) {
        setError(err.message || 'Failed to initialize assessment.');
      } finally {
        setLoading(false);
      }
    }
    loadInitial();
  }, []);

  const handleRoleChange = (roleId) => {
    setSelectedRoleId(roleId);
    const role = roles.find(r => String(r.id) === String(roleId));
    setSelectedRole(role);
    const newRatings = {};
    role?.skills?.forEach(s => {
      newRatings[s.skill_id] = ratings[s.skill_id] || 2;
    });
    setRatings(newRatings);
  };

  const handleRatingChange = (skillId, level) => {
    setRatings(prev => ({
      ...prev,
      [skillId]: level
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSubmitting(true);

    try {
      const payloadRatings = Object.entries(ratings).map(([sId, rating]) => ({
        skill_id: parseInt(sId, 10),
        rating: parseInt(rating, 10)
      }));

      const res = await api.submitAssessment(parseInt(selectedRoleId, 10), payloadRatings, notes, true);
      navigate(`/assessment/results/${res.assessment.id}`);
    } catch (err) {
      setError(err.message || 'Failed to submit skill assessment.');
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="py-20 flex flex-col items-center justify-center">
        <div className="w-10 h-10 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
        <p className="mt-3 text-sm text-slate-500">Preparing skill assessment form...</p>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header Banner */}
      <div className="text-center max-w-3xl mx-auto mb-8">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-100 text-blue-800 text-xs font-semibold mb-3 border border-blue-200">
          <CheckSquare className="w-3.5 h-3.5" />
          SkillBridge Rule-Based Evaluation
        </div>
        <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">
          Self-Proficiency Skill Assessment
        </h1>
        <p className="mt-2 text-slate-600 text-sm leading-relaxed">
          Rate your current hands-on capability on the standardized 1–5 scale. Our rule engine compares your ratings with the target role requirement to calculate transparent skill gaps and curate your academic learning roadmap.
        </p>
      </div>

      {/* Role Selection Dropdown */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm mb-8 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1">
            Target Industry Career Role
          </label>
          <div className="text-sm font-semibold text-slate-800">
            {selectedRole?.name || 'Select a career role'}
          </div>
          <div className="text-xs text-slate-500 mt-0.5">{selectedRole?.description}</div>
        </div>

        <select
          value={selectedRoleId}
          onChange={(e) => handleRoleChange(e.target.value)}
          className="p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          {roles.map(r => (
            <option key={r.id} value={r.id}>{r.name}</option>
          ))}
        </select>
      </div>

      {/* 1-5 Scale Explanation Guide */}
      <div className="bg-slate-900 text-white rounded-3xl p-6 shadow-md mb-8">
        <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-teal-400 mb-3">
          <Info className="w-4 h-4" />
          Proficiency Scale Reference (1 to 5)
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-5 gap-3">
          {PROFICIENCY_DEFINITIONS.map(def => (
            <div key={def.level} className="bg-slate-800/80 p-3 rounded-xl border border-slate-700/60 text-xs">
              <div className="font-bold text-white flex items-center justify-between">
                <span>Lvl {def.level}</span>
                <span className="text-[10px] text-teal-400 uppercase">{def.name}</span>
              </div>
              <p className="mt-1 text-[11px] text-slate-400 leading-snug">
                {def.desc}
              </p>
            </div>
          ))}
        </div>
      </div>

      {error && (
        <div className="p-4 bg-rose-50 border border-rose-200 rounded-2xl text-rose-800 text-sm flex items-center gap-3 mb-6">
          <AlertCircle className="w-5 h-5 flex-shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {/* Assessment Form */}
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="space-y-4">
          {selectedRole?.skills?.map((item) => {
            const currentRating = ratings[item.skill_id] || 1;
            const target = item.required_proficiency;
            const gap = Math.max(target - currentRating, 0);
            const gapPct = target > 0 ? Math.round((gap / target) * 100) : 0;

            return (
              <div
                key={item.skill_id}
                className="bg-white p-6 rounded-2xl border border-slate-200/90 shadow-sm hover:border-blue-200 transition-colors"
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="text-base font-bold text-slate-900">{item.skill_name}</h3>
                      <span className="text-xs px-2 py-0.5 rounded bg-slate-100 text-slate-600 font-medium">
                        {item.skill_category}
                      </span>
                    </div>
                    {item.rationale && (
                      <p className="text-xs text-slate-500 mt-1">{item.rationale}</p>
                    )}
                  </div>

                  {/* Target & Live Gap Preview */}
                  <div className="flex items-center gap-3 bg-slate-50 px-3.5 py-1.5 rounded-xl border border-slate-100 self-start sm:self-auto">
                    <div className="text-xs text-slate-500">
                      Target: <span className="font-bold text-slate-800">Lvl {target}</span>
                    </div>
                    <div className="w-px h-4 bg-slate-200"></div>
                    <div className="text-xs font-semibold">
                      {gap === 0 ? (
                        <span className="text-emerald-600">Target Met (0 gap)</span>
                      ) : (
                        <span className="text-amber-600">Gap: {gap} ({gapPct}%)</span>
                      )}
                    </div>
                  </div>
                </div>

                {/* Rating Button Radio Group */}
                <div className="grid grid-cols-5 gap-2 sm:gap-3">
                  {[1, 2, 3, 4, 5].map((lvl) => {
                    const isSelected = currentRating === lvl;
                    const isTarget = target === lvl;

                    return (
                      <button
                        key={lvl}
                        type="button"
                        onClick={() => handleRatingChange(item.skill_id, lvl)}
                        className={`p-3 rounded-xl border text-center transition-all ${
                          isSelected
                            ? 'bg-blue-600 text-white border-blue-600 shadow-md ring-2 ring-blue-500/30'
                            : 'bg-slate-50 hover:bg-slate-100 text-slate-800 border-slate-200'
                        }`}
                      >
                        <div className="text-sm font-bold">{lvl}</div>
                        <div className={`text-[10px] truncate ${isSelected ? 'text-blue-100' : 'text-slate-500'}`}>
                          {PROFICIENCY_DEFINITIONS[lvl - 1].name}
                        </div>
                        {isTarget && (
                          <div className={`text-[9px] font-bold mt-1 uppercase ${isSelected ? 'text-amber-300' : 'text-blue-600'}`}>
                            Target Lvl
                          </div>
                        )}
                      </button>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>

        {/* Optional Reflection Notes */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
          <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
            Self-Reflection & Semester Objectives (Optional)
          </label>
          <textarea
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            rows={2}
            placeholder="e.g. Preparing for semester 5 capstone project; want to transition from basic JavaScript to full-stack React and Express."
            className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
          ></textarea>
        </div>

        {/* Submit Button */}
        <div className="pt-2">
          <button
            type="submit"
            disabled={submitting}
            className="w-full py-4 px-6 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-bold text-base rounded-2xl shadow-lg hover:shadow-xl transition-all flex items-center justify-center gap-2.5 disabled:opacity-50"
          >
            {submitting ? (
              <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
            ) : (
              <>
                <Calculator className="w-5 h-5" />
                <span>Calculate Skill Gaps & Generate Personalized Roadmap</span>
                <ArrowRight className="w-5 h-5" />
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
}
