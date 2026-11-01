import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { api } from '../../services/api';
import { 
  GraduationCap, 
  Map, 
  BookOpen, 
  CheckSquare, 
  Compass, 
  TrendingUp, 
  Clock, 
  Award, 
  ArrowRight, 
  CheckCircle, 
  Sparkles,
  AlertCircle,
  Edit2,
  X
} from 'lucide-react';

export default function StudentDashboard() {
  const { user, updateProfile } = useAuth();
  const [editNameOpen, setEditNameOpen] = useState(false);
  const [customName, setCustomName] = useState(user?.name || '');
  const [nameSaving, setNameSaving] = useState(false);
  const [assessments, setAssessments] = useState([]);
  const [latestAssessment, setLatestAssessment] = useState(null);
  const [progress, setProgress] = useState({ total: 0, completed: 0, in_progress: 0, not_started: 0, percentage: 0 });
  const [roadmap, setRoadmap] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    async function loadDashboard() {
      try {
        const [assessRes, roadmapRes] = await Promise.all([
          api.getMyAssessments(),
          api.getLatestRoadmap()
        ]);

        const aList = assessRes.assessments || [];
        setAssessments(aList);
        if (aList.length > 0) {
          setLatestAssessment(aList[0]);
        }

        if (roadmapRes.roadmap) {
          setRoadmap(roadmapRes.roadmap);
          setProgress(roadmapRes.progress || { total: 0, completed: 0, in_progress: 0, not_started: 0, percentage: 0 });
        }
      } catch (err) {
        setError(err.message || 'Failed to load dashboard data.');
      } finally {
        setLoading(false);
      }
    }
    loadDashboard();
  }, []);

  if (loading) {
    return (
      <div className="py-20 flex flex-col items-center justify-center">
        <div className="w-10 h-10 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
        <p className="mt-3 text-sm text-slate-500">Loading your learning workspace...</p>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Welcome Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-blue-950 to-slate-900 rounded-3xl p-6 sm:p-10 text-white shadow-xl relative overflow-hidden flex flex-col lg:flex-row lg:items-center justify-between gap-6">
        <div className="max-w-xl z-10">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-500/20 text-blue-300 text-xs font-semibold mb-3 border border-blue-400/30">
            <GraduationCap className="w-4 h-4" />
            Student Engineering Workspace
          </div>
          <div className="flex items-center gap-3">
            <h1 className="text-2xl sm:text-4xl font-extrabold tracking-tight">
              Welcome back, {user?.name}!
            </h1>
            <button
              onClick={() => { setCustomName(user?.name || ''); setEditNameOpen(true); }}
              title="Change displayed name"
              className="p-1.5 rounded-lg bg-blue-500/20 hover:bg-blue-500/40 text-blue-300 border border-blue-400/30 transition-colors"
            >
              <Edit2 className="w-4 h-4" />
            </button>
          </div>
          <p className="mt-2 text-slate-300 text-sm leading-relaxed">
            {latestAssessment
              ? `You are preparing for the ${latestAssessment.career_role_name} career benchmark. Keep progressing through your prioritized roadmap.`
              : 'Identify your technical skill gaps and find all college academic resources in one centralized place.'}
          </p>

          <div className="mt-6 flex flex-wrap gap-3">
            <Link
              to="/assessment"
              className="px-5 py-2.5 bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold rounded-xl shadow-md transition-colors flex items-center gap-1.5"
            >
              <CheckSquare className="w-4 h-4" />
              <span>{latestAssessment ? 'Retake Skill Assessment' : 'Take Skill Assessment'}</span>
            </Link>

            <Link
              to="/resources"
              className="px-5 py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold rounded-xl border border-slate-700 transition-colors flex items-center gap-1.5"
            >
              <BookOpen className="w-4 h-4" />
              <span>Browse Resource Library</span>
            </Link>
          </div>
        </div>

        {/* Quick Progress Ring / KPI */}
        <div className="bg-slate-800/80 p-6 rounded-3xl border border-slate-700 text-center min-w-[240px] z-10">
          <div className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Roadmap Progress</div>
          <div className="text-4xl font-black text-teal-400">{progress.percentage}%</div>
          <div className="text-xs text-slate-300 mt-1">
            {progress.completed} of {progress.total} activities completed
          </div>
          <div className="w-full bg-slate-700 rounded-full h-2 mt-3 overflow-hidden">
            <div className="bg-teal-400 h-2 rounded-full" style={{ width: `${progress.percentage}%` }}></div>
          </div>
          {roadmap && (
            <Link to="/roadmap" className="inline-block mt-3 text-xs font-semibold text-blue-400 hover:underline">
              View Roadmap &rarr;
            </Link>
          )}
        </div>
      </div>

      {error && (
        <div className="p-4 bg-rose-50 border border-rose-200 rounded-2xl text-rose-800 text-sm flex items-center gap-3">
          <AlertCircle className="w-5 h-5 flex-shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {/* KPI Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center font-bold">
            <Compass className="w-6 h-6" />
          </div>
          <div>
            <div className="text-xs text-slate-400 uppercase font-bold tracking-wider">Target Role</div>
            <div className="text-base font-bold text-slate-900 truncate max-w-[160px]">
              {latestAssessment ? latestAssessment.career_role_name : 'None Selected'}
            </div>
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center font-bold">
            <CheckCircle className="w-6 h-6" />
          </div>
          <div>
            <div className="text-xs text-slate-400 uppercase font-bold tracking-wider">Target Achieved</div>
            <div className="text-xl font-bold text-slate-900">
              {latestAssessment ? `${latestAssessment.skills_meeting_target} Skills` : '0'}
            </div>
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center font-bold">
            <TrendingUp className="w-6 h-6" />
          </div>
          <div>
            <div className="text-xs text-slate-400 uppercase font-bold tracking-wider">Average Skill Gap</div>
            <div className="text-xl font-bold text-slate-900">
              {latestAssessment ? `${latestAssessment.average_gap} Levels` : '0.00'}
            </div>
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center font-bold">
            <Award className="w-6 h-6" />
          </div>
          <div>
            <div className="text-xs text-slate-400 uppercase font-bold tracking-wider">Assessments Taken</div>
            <div className="text-xl font-bold text-slate-900">{assessments.length}</div>
          </div>
        </div>
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column: Roadmap Active Tasks */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-sm">
            <div className="flex items-center justify-between mb-5">
              <div>
                <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                  <Map className="w-5 h-5 text-blue-600" />
                  Your Active Learning Roadmap
                </h2>
                <p className="text-xs text-slate-500">Activities sequenced to close your largest skill gaps</p>
              </div>

              {roadmap && (
                <Link to="/roadmap" className="text-xs font-bold text-blue-600 hover:underline">
                  Full Roadmap &rarr;
                </Link>
              )}
            </div>

            {!roadmap || !roadmap.items || roadmap.items.length === 0 ? (
              <div className="text-center py-10 bg-slate-50 rounded-2xl border border-slate-100">
                <p className="text-sm text-slate-500">No active roadmap items found.</p>
                <Link
                  to="/assessment"
                  className="mt-3 inline-block px-4 py-2 bg-blue-600 text-white rounded-xl text-xs font-bold"
                >
                  Take Skill Assessment
                </Link>
              </div>
            ) : (
              <div className="space-y-3">
                {roadmap.items.slice(0, 4).map((item) => (
                  <div
                    key={item.id}
                    className="p-4 bg-slate-50 rounded-2xl border border-slate-200/70 flex items-center justify-between gap-3 hover:bg-slate-100/60 transition-colors"
                  >
                    <div className="flex items-center gap-3">
                      <span className={`w-8 h-8 rounded-lg flex items-center justify-center text-xs font-bold ${
                        item.status === 'completed' ? 'bg-emerald-600 text-white' : item.status === 'in_progress' ? 'bg-blue-600 text-white' : 'bg-slate-200 text-slate-700'
                      }`}>
                        #{item.priority}
                      </span>
                      <div>
                        <h4 className="text-sm font-bold text-slate-900">{item.skill_name}</h4>
                        <div className="text-xs text-slate-500">
                          {item.resource_title ? item.resource_title : item.task_title || 'Self-study activity'}
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <span className={`px-2.5 py-1 text-[11px] font-bold rounded-lg capitalize ${
                        item.status === 'completed' ? 'bg-emerald-100 text-emerald-800' : item.status === 'in_progress' ? 'bg-blue-100 text-blue-800' : 'bg-slate-200 text-slate-700'
                      }`}>
                        {item.status.replace('_', ' ')}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Quick Resource Hub Preview */}
          <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-3xl p-6 border border-blue-100 flex items-center justify-between gap-4">
            <div>
              <h3 className="text-base font-bold text-slate-900">Need academic notes or lecture slides?</h3>
              <p className="text-xs text-slate-600 mt-1 max-w-md">
                Search our centralized library by course subject, unit, or resource type.
              </p>
            </div>
            <Link
              to="/resources"
              className="px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-xl shadow-sm transition-colors whitespace-nowrap"
            >
              Explore Library
            </Link>
          </div>
        </div>

        {/* Right Column: Assessment History */}
        <div className="space-y-6">
          <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-sm">
            <h3 className="text-base font-bold text-slate-900 mb-4 flex items-center gap-2">
              <Clock className="w-4 h-4 text-slate-500" />
              Assessment History
            </h3>

            {assessments.length === 0 ? (
              <p className="text-xs text-slate-500 italic">No past assessments found.</p>
            ) : (
              <div className="space-y-3">
                {assessments.slice(0, 5).map((a) => (
                  <Link
                    key={a.id}
                    to={`/assessment/results/${a.id}`}
                    className="block p-3.5 bg-slate-50 hover:bg-blue-50/50 rounded-2xl border border-slate-200/60 transition-colors"
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-slate-900">{a.career_role_name}</span>
                      <span className="text-[10px] text-slate-400">
                        {new Date(a.assessment_date).toLocaleDateString()}
                      </span>
                    </div>
                    <div className="mt-1 text-xs text-slate-500 flex items-center justify-between">
                      <span>Met: {a.skills_meeting_target}/{a.total_skills} skills</span>
                      <span className="text-blue-600 font-semibold">View Diagnostics &rarr;</span>
                    </div>
                  </Link>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Edit Name Modal */}
      {editNameOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-xs">
          <div className="bg-white rounded-3xl max-w-sm w-full p-6 shadow-2xl border border-slate-200 relative animate-fade-in">
            <button
              onClick={() => setEditNameOpen(false)}
              className="absolute top-4 right-4 p-1.5 rounded-full text-slate-400 hover:text-slate-700 hover:bg-slate-100"
            >
              <X className="w-5 h-5" />
            </button>

            <h3 className="text-lg font-bold text-slate-900 mb-1">Update Display Name</h3>
            <p className="text-xs text-slate-500 mb-4">
              Enter your name as you would like it displayed across LearnSphere.
            </p>

            <form
              onSubmit={async (e) => {
                e.preventDefault();
                if (!customName.trim()) return;
                setNameSaving(true);
                try {
                  await updateProfile(customName.trim());
                  setEditNameOpen(false);
                } catch (err) {
                  alert(err.message || 'Failed to update name');
                } finally {
                  setNameSaving(false);
                }
              }}
              className="space-y-4"
            >
              <div>
                <label className="block text-xs font-bold uppercase text-slate-700 mb-1">
                  Full Name
                </label>
                <input
                  type="text"
                  required
                  value={customName}
                  onChange={(e) => setCustomName(e.target.value)}
                  placeholder="e.g. Advit"
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-semibold text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setEditNameOpen(false)}
                  className="px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-xl"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={nameSaving}
                  className="px-5 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold shadow-sm transition-colors disabled:opacity-50"
                >
                  {nameSaving ? 'Saving...' : 'Save Name'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
