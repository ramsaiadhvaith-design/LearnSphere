import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { api } from '../../services/api';
import { 
  Map, 
  CheckCircle2, 
  Clock, 
  BookOpen, 
  Code, 
  ArrowRight, 
  Sparkles, 
  Download, 
  ExternalLink, 
  CheckSquare, 
  AlertCircle,
  Award
} from 'lucide-react';

export default function LearningRoadmap() {
  const [roadmap, setRoadmap] = useState(null);
  const [progress, setProgress] = useState({ total: 0, completed: 0, in_progress: 0, not_started: 0, percentage: 0 });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [updatingItemId, setUpdatingItemId] = useState(null);

  useEffect(() => {
    loadRoadmap();
  }, []);

  const loadRoadmap = async () => {
    setLoading(true);
    setError('');
    try {
      const res = await api.getLatestRoadmap();
      if (res.roadmap) {
        setRoadmap(res.roadmap);
        setProgress(res.progress || { total: 0, completed: 0, in_progress: 0, not_started: 0, percentage: 0 });
      } else {
        setRoadmap(null);
      }
    } catch (err) {
      setError(err.message || 'Failed to load your learning roadmap.');
    } finally {
      setLoading(false);
    }
  };

  const handleStatusChange = async (itemId, newStatus) => {
    setUpdatingItemId(itemId);
    try {
      const res = await api.updateItemProgress(itemId, newStatus);
      // Update local item status
      setRoadmap(prev => {
        if (!prev) return prev;
        const updatedItems = prev.items.map(item => item.id === itemId ? { ...item, status: newStatus, completion_date: newStatus === 'completed' ? new Date().toISOString() : null } : item);
        return { ...prev, items: updatedItems };
      });
      if (res.progress) {
        setProgress(res.progress);
      }
    } catch (err) {
      alert(`Could not update activity status: ${err.message}`);
    } finally {
      setUpdatingItemId(null);
    }
  };

  if (loading) {
    return (
      <div className="py-20 flex flex-col items-center justify-center">
        <div className="w-10 h-10 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
        <p className="mt-3 text-sm text-slate-500">Loading personalized learning roadmap...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-md mx-auto my-16 p-8 bg-white rounded-3xl border border-rose-200 text-center">
        <AlertCircle className="w-8 h-8 text-rose-500 mx-auto mb-2" />
        <h3 className="text-base font-bold text-slate-900">Roadmap Error</h3>
        <p className="text-sm text-slate-600 mt-1 mb-4">{error}</p>
        <button onClick={loadRoadmap} className="px-4 py-2 bg-blue-600 text-white rounded-xl text-sm font-semibold">
          Retry
        </button>
      </div>
    );
  }

  if (!roadmap || !roadmap.items || roadmap.items.length === 0) {
    return (
      <div className="max-w-xl mx-auto my-16 p-10 bg-white rounded-3xl border border-slate-200 shadow-md text-center">
        <div className="w-16 h-16 bg-blue-50 text-blue-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
          <Map className="w-8 h-8" />
        </div>
        <h2 className="text-2xl font-bold text-slate-900">No Active Learning Roadmap</h2>
        <p className="text-sm text-slate-600 mt-2 mb-6 leading-relaxed">
          Complete a skill self-assessment for your target career role to generate a sequenced, prioritized learning roadmap mapped to academic notes and mini-projects.
        </p>
        <Link
          to="/assessment"
          className="inline-flex items-center gap-2 px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-xl shadow-md transition-colors"
        >
          <CheckSquare className="w-4 h-4" />
          <span>Start Skill Assessment Now</span>
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-blue-900 to-indigo-950 rounded-3xl p-6 sm:p-10 text-white shadow-xl mb-8">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/20 text-blue-300 text-xs font-semibold mb-3 border border-blue-400/30">
              <Map className="w-3.5 h-3.5" />
              Sequenced Skillbridge Pathway
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
              {roadmap.title}
            </h1>
            <p className="mt-1 text-slate-300 text-xs sm:text-sm">
              Target Role: <strong className="text-white">{roadmap.career_role_name}</strong> • Sequenced by largest skill gaps first
            </p>
          </div>

          <Link
            to="/assessment"
            className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold rounded-xl border border-slate-700 self-start sm:self-auto transition-colors"
          >
            Retake Assessment
          </Link>
        </div>

        {/* Progress Bar & KPIs */}
        <div className="mt-8 pt-6 border-t border-slate-800">
          <div className="flex items-center justify-between text-xs font-bold mb-2">
            <span>Overall Roadmap Completion</span>
            <span className="text-teal-400 text-sm">{progress.percentage}%</span>
          </div>

          <div className="w-full bg-slate-800 rounded-full h-3 overflow-hidden p-0.5 border border-slate-700">
            <div
              className="bg-gradient-to-r from-teal-400 to-blue-500 h-2 rounded-full transition-all duration-500"
              style={{ width: `${progress.percentage}%` }}
            ></div>
          </div>

          <div className="grid grid-cols-3 gap-2 mt-4 text-center text-xs">
            <div className="bg-slate-800/60 p-2 rounded-lg">
              <span className="text-slate-400 block text-[10px] uppercase">Completed</span>
              <span className="font-bold text-teal-400 text-sm">{progress.completed}</span>
            </div>
            <div className="bg-slate-800/60 p-2 rounded-lg">
              <span className="text-slate-400 block text-[10px] uppercase">In Progress</span>
              <span className="font-bold text-blue-400 text-sm">{progress.in_progress}</span>
            </div>
            <div className="bg-slate-800/60 p-2 rounded-lg">
              <span className="text-slate-400 block text-[10px] uppercase">Not Started</span>
              <span className="font-bold text-slate-300 text-sm">{progress.not_started}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Roadmap Items Timeline */}
      <div className="space-y-6">
        {roadmap.items.map((item, index) => {
          const isCompleted = item.status === 'completed';
          const isInProgress = item.status === 'in_progress';
          const isUpdating = updatingItemId === item.id;

          return (
            <div
              key={item.id}
              className={`bg-white rounded-3xl p-6 sm:p-8 border transition-all shadow-sm ${
                isCompleted 
                  ? 'border-emerald-200 bg-emerald-50/20' 
                  : isInProgress 
                    ? 'border-blue-300 ring-2 ring-blue-500/10' 
                    : 'border-slate-200'
              }`}
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-100">
                <div className="flex items-center gap-3">
                  <div className={`w-9 h-9 rounded-xl flex items-center justify-center font-bold text-sm ${
                    isCompleted ? 'bg-emerald-600 text-white' : isInProgress ? 'bg-blue-600 text-white' : 'bg-slate-100 text-slate-600'
                  }`}>
                    {isCompleted ? <CheckCircle2 className="w-5 h-5" /> : `#${item.priority}`}
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-slate-900">{item.skill_name}</h3>
                    <div className="text-xs text-slate-500 font-medium">
                      Category: {item.skill_category} • Est. Duration: <span className="font-semibold text-slate-700">{item.estimated_duration}</span> (Estimate)
                    </div>
                  </div>
                </div>

                {/* Status Toggle Buttons */}
                <div className="flex items-center gap-1.5 bg-slate-50 p-1 rounded-xl border border-slate-200 self-start sm:self-auto">
                  <button
                    type="button"
                    disabled={isUpdating}
                    onClick={() => handleStatusChange(item.id, 'not_started')}
                    className={`px-2.5 py-1 text-xs font-semibold rounded-lg transition-colors ${
                      item.status === 'not_started' ? 'bg-slate-200 text-slate-800 shadow-xs' : 'text-slate-500 hover:text-slate-900'
                    }`}
                  >
                    Not Started
                  </button>

                  <button
                    type="button"
                    disabled={isUpdating}
                    onClick={() => handleStatusChange(item.id, 'in_progress')}
                    className={`px-2.5 py-1 text-xs font-semibold rounded-lg transition-colors ${
                      item.status === 'in_progress' ? 'bg-blue-600 text-white shadow-xs' : 'text-slate-500 hover:text-slate-900'
                    }`}
                  >
                    In Progress
                  </button>

                  <button
                    type="button"
                    disabled={isUpdating}
                    onClick={() => handleStatusChange(item.id, 'completed')}
                    className={`px-2.5 py-1 text-xs font-semibold rounded-lg transition-colors ${
                      item.status === 'completed' ? 'bg-emerald-600 text-white shadow-xs' : 'text-slate-500 hover:text-slate-900'
                    }`}
                  >
                    Completed
                  </button>
                </div>
              </div>

              {/* Note / Objective */}
              {item.notes && (
                <p className="mt-3 text-xs text-slate-600 font-medium bg-slate-50 p-2.5 rounded-xl border border-slate-100">
                  💡 {item.notes}
                </p>
              )}

              {/* Learning Activities Grid */}
              <div className="mt-5 grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Academic Learning Resource */}
                <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200/80 flex flex-col justify-between">
                  <div>
                    <div className="text-[11px] font-bold uppercase tracking-wider text-blue-600 flex items-center gap-1.5 mb-1.5">
                      <BookOpen className="w-3.5 h-3.5" />
                      Academic Learning Resource
                    </div>
                    {item.resource_title ? (
                      <>
                        <h4 className="text-sm font-bold text-slate-900">{item.resource_title}</h4>
                        <span className="text-[10px] font-medium text-slate-500 capitalize">
                          {item.resource_type} • {item.resource_difficulty} difficulty
                        </span>
                      </>
                    ) : (
                      <p className="text-xs text-slate-500 italic">No direct resource mapped yet.</p>
                    )}
                  </div>

                  {item.resource_id && (
                    <div className="mt-3 pt-2 border-t border-slate-200">
                      {item.resource_file_path ? (
                        <a
                          href={api.getDownloadUrl(item.resource_id)}
                          download
                          className="text-xs font-bold text-blue-600 hover:underline inline-flex items-center gap-1"
                        >
                          <Download className="w-3.5 h-3.5" />
                          Download Academic Resource
                        </a>
                      ) : item.resource_external_url ? (
                        <a
                          href={item.resource_external_url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-xs font-bold text-blue-600 hover:underline inline-flex items-center gap-1"
                        >
                          <ExternalLink className="w-3.5 h-3.5" />
                          Open Resource Material
                        </a>
                      ) : null}
                    </div>
                  )}
                </div>

                {/* Practical Mini-Project */}
                <div className="p-4 bg-teal-50/50 rounded-2xl border border-teal-200/60 flex flex-col justify-between">
                  <div>
                    <div className="text-[11px] font-bold uppercase tracking-wider text-teal-700 flex items-center gap-1.5 mb-1.5">
                      <Code className="w-3.5 h-3.5" />
                      Recommended Hands-On Project
                    </div>
                    {item.task_title ? (
                      <>
                        <h4 className="text-sm font-bold text-slate-900">{item.task_title}</h4>
                        <p className="text-xs text-slate-600 mt-1 line-clamp-2">{item.task_description}</p>
                      </>
                    ) : (
                      <p className="text-xs text-slate-500 italic">Hands-on task to be selected from resource library.</p>
                    )}
                  </div>

                  {item.task_duration && (
                    <div className="mt-3 pt-2 border-t border-teal-200/60 flex items-center justify-between text-xs text-slate-500">
                      <span className="text-[10px] font-bold text-teal-800 uppercase">Estimated: {item.task_duration}</span>
                      {item.task_external_url && (
                        <a
                          href={item.task_external_url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-xs font-semibold text-teal-700 hover:underline inline-flex items-center gap-1"
                        >
                          <ExternalLink className="w-3 h-3" />
                          Project Starter
                        </a>
                      )}
                    </div>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
