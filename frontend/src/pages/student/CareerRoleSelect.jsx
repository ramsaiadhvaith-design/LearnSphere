import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { api } from '../../services/api';
import { Compass, CheckSquare, Sparkles, Layers, ArrowRight, Star } from 'lucide-react';

const PROFICIENCY_NAMES = {
  1: 'Beginner',
  2: 'Basic understanding',
  3: 'Intermediate',
  4: 'Advanced',
  5: 'Highly proficient'
};

export default function CareerRoleSelect() {
  const [roles, setRoles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    async function loadRoles() {
      try {
        const res = await api.getCareerRoles();
        setRoles(res.roles || []);
      } catch (err) {
        setError(err.message || 'Failed to load career roles.');
      } finally {
        setLoading(false);
      }
    }
    loadRoles();
  }, []);

  const handleSelectRole = (roleId) => {
    navigate(`/assessment?roleId=${roleId}`);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="text-center max-w-3xl mx-auto mb-10">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-100 text-blue-800 text-xs font-semibold mb-3 border border-blue-200">
          <Compass className="w-3.5 h-3.5" />
          Industry Role Benchmark
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
          Select Your Target Career Role
        </h1>
        <p className="mt-2 text-slate-600 text-base leading-relaxed">
          Choose an industry engineering profile to compare your current technical proficiency against benchmark standards, pinpoint exact skill gaps, and receive tailored academic resources.
        </p>
      </div>

      {loading ? (
        <div className="py-20 flex flex-col items-center justify-center">
          <div className="w-10 h-10 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
          <p className="mt-3 text-sm text-slate-500">Loading industry career roles...</p>
        </div>
      ) : error ? (
        <div className="p-4 bg-rose-50 text-rose-800 rounded-2xl border border-rose-200 text-center max-w-md mx-auto">
          {error}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {roles.map((role) => (
            <div
              key={role.id}
              className="bg-white rounded-3xl border border-slate-200 shadow-sm hover:shadow-xl transition-all duration-300 p-6 sm:p-8 flex flex-col justify-between group"
            >
              <div>
                <div className="flex items-center justify-between mb-4">
                  <span className="px-3 py-1 rounded-full bg-blue-50 text-blue-700 text-xs font-semibold border border-blue-200">
                    {role.skills?.length || 0} Core Skills Required
                  </span>
                  <div className="w-10 h-10 rounded-xl bg-slate-50 group-hover:bg-blue-600 group-hover:text-white flex items-center justify-center text-slate-600 transition-colors">
                    <Compass className="w-5 h-5" />
                  </div>
                </div>

                <h3 className="text-xl font-bold text-slate-900 group-hover:text-blue-600 transition-colors">
                  {role.name}
                </h3>
                <p className="mt-2 text-sm text-slate-600 leading-relaxed">
                  {role.description}
                </p>

                {/* Required Skills breakdown */}
                <div className="mt-6 pt-5 border-t border-slate-100">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-3">
                    Benchmark Technical Skills
                  </h4>
                  <div className="space-y-2.5">
                    {role.skills?.map((sk) => (
                      <div
                        key={sk.skill_id}
                        className="p-2.5 bg-slate-50 rounded-xl border border-slate-100 flex items-center justify-between"
                      >
                        <div>
                          <div className="text-xs font-bold text-slate-800">{sk.skill_name}</div>
                          {sk.rationale && (
                            <div className="text-[11px] text-slate-500 line-clamp-1">{sk.rationale}</div>
                          )}
                        </div>
                        <div className="text-right flex items-center gap-1">
                          <span className="px-2 py-0.5 bg-blue-600 text-white rounded text-[10px] font-bold">
                            Lvl {sk.required_proficiency}/5
                          </span>
                          <span className="text-[10px] text-slate-500 hidden sm:inline">
                            ({PROFICIENCY_NAMES[sk.required_proficiency]})
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              <div className="mt-8 pt-4">
                <button
                  onClick={() => handleSelectRole(role.id)}
                  className="w-full py-3 px-4 bg-slate-900 hover:bg-blue-600 text-white font-semibold text-sm rounded-xl transition-all shadow-md flex items-center justify-center gap-2 group-hover:shadow-lg"
                >
                  <CheckSquare className="w-4 h-4" />
                  <span>Start Skill Assessment for this Role</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
