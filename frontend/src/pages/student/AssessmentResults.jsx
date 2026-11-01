import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { api } from '../../services/api';
import { 
  CheckCircle, 
  AlertTriangle, 
  BookOpen, 
  Code, 
  Map, 
  ArrowRight, 
  Download, 
  ExternalLink, 
  Sparkles, 
  Target,
  BarChart2,
  Tag
} from 'lucide-react';

const PROFICIENCY_NAMES = {
  1: 'Beginner',
  2: 'Basic understanding',
  3: 'Intermediate',
  4: 'Advanced',
  5: 'Highly proficient'
};

export default function AssessmentResults() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [assessment, setAssessment] = useState(null);
  const [recommendations, setRecommendations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    async function loadResults() {
      try {
        const res = await api.getAssessment(id);
        setAssessment(res.assessment);
        setRecommendations(res.recommendations || []);
      } catch (err) {
        setError(err.message || 'Failed to load assessment results.');
      } finally {
        setLoading(false);
      }
    }
    loadResults();
  }, [id]);

  if (loading) {
    return (
      <div className="py-20 flex flex-col items-center justify-center">
        <div className="w-10 h-10 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
        <p className="mt-3 text-sm text-slate-500">Loading skill gap analytics...</p>
      </div>
    );
  }

  if (error || !assessment) {
    return (
      <div className="max-w-md mx-auto my-16 p-8 bg-white rounded-3xl border border-rose-200 shadow-md text-center">
        <h3 className="text-lg font-bold text-slate-900 mb-2">Assessment Record Not Found</h3>
        <p className="text-sm text-slate-600 mb-6">{error || 'Unable to retrieve this assessment.'}</p>
        <Link to="/assessment" className="px-4 py-2 bg-blue-600 text-white rounded-xl text-sm font-semibold">
          Take New Assessment
        </Link>
      </div>
    );
  }

  const meetingTargetSkills = (assessment.skill_results || []).filter(s => s.skill_gap === 0);
  const needingImprovementSkills = (assessment.skill_results || []).filter(s => s.skill_gap > 0);

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Top Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-blue-900 to-indigo-950 rounded-3xl p-6 sm:p-10 text-white shadow-xl mb-8 flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/20 text-blue-300 text-xs font-semibold mb-3 border border-blue-400/30">
            <Target className="w-3.5 h-3.5" />
            Skill Gap Diagnostic Report
          </div>
          <h1 className="text-2xl sm:text-4xl font-extrabold tracking-tight">
            {assessment.career_role_name} Assessment Results
          </h1>
          <p className="mt-2 text-slate-300 text-sm max-w-xl">
            Calculated using our transparent formula: <code className="bg-slate-800 px-2 py-0.5 rounded text-blue-300">Skill Gap = max(Target − Current, 0)</code>
          </p>
        </div>

        <Link
          to="/roadmap"
          className="px-6 py-3.5 bg-emerald-500 hover:bg-emerald-600 text-white font-bold rounded-2xl shadow-lg hover:shadow-xl transition-all flex items-center justify-center gap-2 self-start md:self-auto"
        >
          <Map className="w-5 h-5" />
          <span>Open Learning Roadmap</span>
          <ArrowRight className="w-4 h-4" />
        </Link>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8">
        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-sm text-center">
          <div className="text-2xl font-black text-slate-900">{assessment.total_skills}</div>
          <div className="text-xs font-semibold uppercase tracking-wider text-slate-400 mt-1">Total Skills</div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-sm text-center">
          <div className="text-2xl font-black text-emerald-600">{assessment.skills_meeting_target}</div>
          <div className="text-xs font-semibold uppercase tracking-wider text-slate-400 mt-1">Target Achieved</div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-sm text-center">
          <div className="text-2xl font-black text-amber-600">{needingImprovementSkills.length}</div>
          <div className="text-xs font-semibold uppercase tracking-wider text-slate-400 mt-1">Needs Practice</div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-sm text-center">
          <div className="text-2xl font-black text-blue-600">{assessment.average_gap}</div>
          <div className="text-xs font-semibold uppercase tracking-wider text-slate-400 mt-1">Average Gap</div>
        </div>
      </div>

      {/* Detailed Skill Breakdown Table */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-sm mb-10">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2">
            <BarChart2 className="w-5 h-5 text-blue-600" />
            Skill Gap Breakdown & Benchmark Comparison
          </h2>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead>
              <tr className="border-b border-slate-200 text-xs font-bold uppercase text-slate-400">
                <th className="py-3 px-4">Skill</th>
                <th className="py-3 px-4">Self Rating</th>
                <th className="py-3 px-4">Required Target</th>
                <th className="py-3 px-4">Gap (Pts)</th>
                <th className="py-3 px-4">Gap %</th>
                <th className="py-3 px-4">Visual Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {assessment.skill_results?.map((res) => {
                const currentPct = (res.current_proficiency / 5) * 100;
                const targetPct = (res.target_proficiency / 5) * 100;

                return (
                  <tr key={res.skill_id} className="hover:bg-slate-50/80 transition-colors">
                    <td className="py-4 px-4">
                      <div className="font-bold text-slate-900">{res.skill_name}</div>
                      <div className="text-xs text-slate-400">{res.skill_category}</div>
                    </td>
                    <td className="py-4 px-4 font-semibold text-slate-800">
                      Lvl {res.current_proficiency} <span className="text-xs text-slate-500 font-normal">({PROFICIENCY_NAMES[res.current_proficiency]})</span>
                    </td>
                    <td className="py-4 px-4 font-semibold text-blue-700">
                      Lvl {res.target_proficiency} <span className="text-xs text-slate-500 font-normal">({PROFICIENCY_NAMES[res.target_proficiency]})</span>
                    </td>
                    <td className="py-4 px-4 font-bold">
                      {res.skill_gap === 0 ? (
                        <span className="text-emerald-600">0</span>
                      ) : (
                        <span className="text-rose-600">+{res.skill_gap}</span>
                      )}
                    </td>
                    <td className="py-4 px-4 font-bold">
                      {res.skill_gap === 0 ? (
                        <span className="text-emerald-600">0%</span>
                      ) : (
                        <span className="text-rose-600">{res.gap_percentage}%</span>
                      )}
                    </td>
                    <td className="py-4 px-4">
                      {res.skill_gap === 0 ? (
                        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
                          <CheckCircle className="w-3.5 h-3.5" />
                          Target Met
                        </span>
                      ) : (
                        <div className="space-y-1">
                          <div className="w-36 bg-slate-100 rounded-full h-2 relative overflow-hidden">
                            <div
                              className="bg-blue-600 h-2 rounded-full absolute top-0 left-0"
                              style={{ width: `${currentPct}%` }}
                            ></div>
                          </div>
                          <span className="text-[11px] font-semibold text-amber-700">
                            Needs Improvement
                          </span>
                        </div>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Integrated Recommendations Section */}
      <div className="mb-10">
        <div className="flex items-center gap-2 mb-4">
          <div className="w-8 h-8 rounded-xl bg-blue-600 text-white flex items-center justify-center">
            <Sparkles className="w-4 h-4" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-slate-900">
              Curated Academic Resources & Practice Projects
            </h2>
            <p className="text-xs text-slate-500">
              Directly mapped from our centralized academic resource repository to bridge your identified skill gaps.
            </p>
          </div>
        </div>

        {recommendations.length === 0 ? (
          <div className="bg-emerald-50 p-6 rounded-3xl border border-emerald-200 text-emerald-900 text-center">
            <CheckCircle className="w-10 h-10 text-emerald-600 mx-auto mb-2" />
            <h3 className="text-base font-bold">Outstanding! No immediate skill gaps detected.</h3>
            <p className="text-sm text-emerald-700 mt-1 max-w-md mx-auto">
              Your self-assessed ratings satisfy all benchmark proficiency levels for {assessment.career_role_name}. Explore advanced capstones in the resource library for enrichment.
            </p>
          </div>
        ) : (
          <div className="space-y-6">
            {recommendations.map((rec) => (
              <div
                key={rec.skill_id}
                className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-sm"
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-4 border-b border-slate-100">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-lg font-bold text-slate-900">{rec.skill_name}</span>
                      <span className="px-2 py-0.5 bg-rose-50 text-rose-700 text-xs font-bold rounded border border-rose-200">
                        {rec.gap_percentage}% Gap ({rec.skill_gap} levels to target)
                      </span>
                    </div>
                    <p className="text-xs text-slate-500 mt-1">{rec.explanation}</p>
                  </div>
                </div>

                {/* Recommended Resources List */}
                <div className="mt-5 grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* Primary Academic Resource */}
                  <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200/80 flex flex-col justify-between">
                    <div>
                      <div className="text-[11px] font-bold uppercase tracking-wider text-blue-600 flex items-center gap-1.5 mb-2">
                        <BookOpen className="w-3.5 h-3.5" />
                        Recommended Academic Resource
                      </div>
                      {rec.primary_resource ? (
                        <>
                          <h4 className="text-sm font-bold text-slate-900">{rec.primary_resource.title}</h4>
                          <div className="text-xs text-slate-500 mt-0.5">
                            {rec.primary_resource.subject} • {rec.primary_resource.unit}
                          </div>
                          <p className="mt-2 text-xs text-slate-600 line-clamp-2">
                            {rec.primary_resource.description}
                          </p>
                        </>
                      ) : (
                        <p className="text-xs text-slate-500 italic mt-1">
                          No matching learning resource is available for this skill yet. Try searching the resource library or contact your faculty member.
                        </p>
                      )}
                    </div>

                    {rec.primary_resource && (
                      <div className="mt-4 pt-3 border-t border-slate-200 flex items-center justify-between">
                        <span className="text-[10px] font-medium text-slate-400 capitalize">
                          {rec.primary_resource.type} • {rec.primary_resource.difficulty}
                        </span>
                        {rec.primary_resource.file_path ? (
                          <a
                            href={api.getDownloadUrl(rec.primary_resource.id)}
                            download
                            className="px-3 py-1 bg-blue-600 text-white rounded-lg text-xs font-semibold inline-flex items-center gap-1"
                          >
                            <Download className="w-3 h-3" />
                            Download
                          </a>
                        ) : rec.primary_resource.external_url ? (
                          <a
                            href={rec.primary_resource.external_url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="px-3 py-1 bg-slate-900 text-white rounded-lg text-xs font-semibold inline-flex items-center gap-1"
                          >
                            <ExternalLink className="w-3 h-3" />
                            Open Link
                          </a>
                        ) : null}
                      </div>
                    )}
                  </div>

                  {/* Practical Exercise or Mini-Project */}
                  <div className="p-4 bg-teal-50/50 rounded-2xl border border-teal-200/60 flex flex-col justify-between">
                    <div>
                      <div className="text-[11px] font-bold uppercase tracking-wider text-teal-700 flex items-center gap-1.5 mb-2">
                        <Code className="w-3.5 h-3.5" />
                        Practical Hands-on Exercise
                      </div>
                      {rec.primary_task ? (
                        <>
                          <h4 className="text-sm font-bold text-slate-900">{rec.primary_task.title}</h4>
                          <div className="text-xs text-teal-800 font-medium mt-0.5">
                            Duration: {rec.primary_task.estimated_duration}
                          </div>
                          <p className="mt-2 text-xs text-slate-600 line-clamp-2">
                            {rec.primary_task.description}
                          </p>
                        </>
                      ) : (
                        <p className="text-xs text-slate-500 italic mt-1">
                          General hands-on practice project will be assigned by instructor.
                        </p>
                      )}
                    </div>

                    {rec.primary_task && (
                      <div className="mt-4 pt-3 border-t border-teal-200/60 text-xs text-slate-500 flex items-center justify-between">
                        <span className="capitalize text-[10px] font-semibold text-teal-800 bg-teal-100 px-2 py-0.5 rounded">
                          {rec.primary_task.difficulty} task
                        </span>
                        <Link
                          to="/roadmap"
                          className="text-xs font-semibold text-blue-600 hover:underline flex items-center gap-1"
                        >
                          View in Roadmap &rarr;
                        </Link>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
