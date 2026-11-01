import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { 
  GraduationCap, 
  BookOpen, 
  Cpu, 
  Map, 
  CheckCircle2, 
  ShieldCheck, 
  ArrowRight, 
  Sparkles, 
  Database,
  Layers,
  Compass,
  CheckSquare
} from 'lucide-react';

export default function HomePage() {
  const { user, isAuthenticated, role } = useAuth();

  return (
    <div className="space-y-16 py-8">
      {/* Hero Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-gradient-to-br from-slate-900 via-blue-950 to-slate-900 rounded-3xl p-8 sm:p-14 text-white shadow-2xl relative overflow-hidden text-center md:text-left">
          <div className="relative z-10 max-w-3xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/20 text-blue-300 text-xs font-semibold mb-4 border border-blue-400/30">
              <GraduationCap className="w-4 h-4" />
              Problem Solving in Engineering (PSE) • Module 5 Capstone
            </div>

            <h1 className="text-3xl sm:text-5xl font-black tracking-tight leading-tight">
              One platform. <span className="bg-gradient-to-r from-blue-400 to-teal-300 bg-clip-text text-transparent">Endless possibilities.</span>
            </h1>

            <p className="mt-4 text-slate-300 text-base sm:text-lg leading-relaxed">
              <strong>LearnSphere</strong> is an integrated engineering education platform combining centralized academic resource management with a transparent, rule-based industry skill-gap analyzer and personalized learning roadmaps.
            </p>

            <div className="mt-8 flex flex-wrap gap-4 justify-center md:justify-start">
              {isAuthenticated ? (
                <Link
                  to={role === 'admin' ? '/admin' : role === 'faculty' ? '/faculty' : '/student'}
                  className="px-6 py-3.5 bg-blue-600 hover:bg-blue-500 text-white font-bold rounded-2xl shadow-lg transition-all flex items-center gap-2"
                >
                  <span>Go to My Dashboard ({role})</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>
              ) : (
                <>
                  <Link
                    to="/register"
                    className="px-6 py-3.5 bg-blue-600 hover:bg-blue-500 text-white font-bold rounded-2xl shadow-lg transition-all flex items-center gap-2"
                  >
                    <span>Get Started (Student)</span>
                    <ArrowRight className="w-4 h-4" />
                  </Link>

                  <Link
                    to="/login"
                    className="px-6 py-3.5 bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold rounded-2xl border border-slate-700 transition-all flex items-center gap-2"
                  >
                    <span>Sign In (Demo Switcher)</span>
                  </Link>
                </>
              )}

              <Link
                to="/resources"
                className="px-6 py-3.5 bg-slate-800/80 hover:bg-slate-800 text-slate-300 font-bold rounded-2xl border border-slate-700 transition-all flex items-center gap-2"
              >
                <BookOpen className="w-4 h-4" />
                <span>Browse Academic Library</span>
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Two Subsystems Integrated Architecture */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-10">
          <span className="text-xs font-bold uppercase tracking-wider text-blue-600">Unified Engineering Architecture</span>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 mt-1">
            Two Interconnected Subsystems in ONE Platform
          </h2>
          <p className="mt-2 text-sm text-slate-600">
            LearnSphere eliminates disconnected silos by connecting academic learning materials directly with industry benchmark skill requirements.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Subsystem 1 */}
          <div className="bg-white rounded-3xl p-8 border border-slate-200/80 shadow-sm hover:shadow-md transition-shadow">
            <div className="w-12 h-12 bg-blue-50 text-blue-600 rounded-2xl flex items-center justify-center mb-5">
              <Database className="w-6 h-6" />
            </div>
            <span className="text-xs font-bold uppercase tracking-wider text-blue-600">Subsystem 1</span>
            <h3 className="text-xl font-bold text-slate-900 mt-1">Centralized Academic Resource Hub</h3>
            <p className="text-sm text-slate-600 mt-2 leading-relaxed">
              Solves the problem of scattered materials across WhatsApp groups, Google Drive, and college LMS platforms. Faculty upload and version notes, slides, tutorials, and practical assignments categorized by subject, unit, and difficulty.
            </p>
            <ul className="mt-4 space-y-2 text-xs text-slate-600 font-medium">
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-500" /> Multi-attribute filtering (subject, unit, type, difficulty)
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-500" /> Relational resource-to-skill mappings in MySQL
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-500" /> Path-traversal protected local downloads & authorized access
              </li>
            </ul>
          </div>

          {/* Subsystem 2 */}
          <div className="bg-white rounded-3xl p-8 border border-slate-200/80 shadow-sm hover:shadow-md transition-shadow">
            <div className="w-12 h-12 bg-teal-50 text-teal-600 rounded-2xl flex items-center justify-center mb-5">
              <Cpu className="w-6 h-6" />
            </div>
            <span className="text-xs font-bold uppercase tracking-wider text-teal-600">Subsystem 2</span>
            <h3 className="text-xl font-bold text-slate-900 mt-1">SkillBridge Rule-Based Skill Gap Engine</h3>
            <p className="text-sm text-slate-600 mt-2 leading-relaxed">
              Provides students with transparent diagnostic analysis comparing current technical capabilities against target industry profiles on a 1–5 scale using deterministic mathematical rules.
            </p>
            <ul className="mt-4 space-y-2 text-xs text-slate-600 font-medium">
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-500" /> Formula: <code className="bg-slate-100 px-1 py-0.5 rounded text-slate-800">Gap = max(Target − Current, 0)</code>
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-500" /> Auto-curated recommendations linking directly to Subsystem 1
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-500" /> Sequenced personal learning roadmap with persistent progress
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* PSE Module 5 Validation Protocol Targets */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-slate-900 rounded-3xl p-8 sm:p-10 text-white border border-slate-800">
          <div className="text-center max-w-2xl mx-auto mb-8">
            <span className="text-xs font-bold uppercase tracking-wider text-teal-400">PSE Module 5 Evaluation</span>
            <h3 className="text-2xl font-bold text-white mt-1">Proposed Prototype Validation Targets</h3>
            <p className="text-xs text-slate-400 mt-1">
              Pre-defined engineering benchmarks for local prototype usability and accuracy testing.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="bg-slate-800/80 p-5 rounded-2xl border border-slate-700 text-center">
              <div className="text-3xl font-black text-teal-400">≥ 90%</div>
              <div className="text-xs font-bold text-slate-300 mt-1">Resource Retrieval Success</div>
              <div className="text-[11px] text-slate-400 mt-1">Users locate designated notes within 3 queries</div>
            </div>

            <div className="bg-slate-800/80 p-5 rounded-2xl border border-slate-700 text-center">
              <div className="text-3xl font-black text-blue-400">≥ 80%</div>
              <div className="text-xs font-bold text-slate-300 mt-1">Human Reviewer Agreement</div>
              <div className="text-[11px] text-slate-400 mt-1">Gap calculation matches instructor evaluation</div>
            </div>

            <div className="bg-slate-800/80 p-5 rounded-2xl border border-slate-700 text-center">
              <div className="text-3xl font-black text-purple-400">≥ 4.0 / 5</div>
              <div className="text-xs font-bold text-slate-300 mt-1">Recommendation Relevance</div>
              <div className="text-[11px] text-slate-400 mt-1">Average user score on curated materials</div>
            </div>

            <div className="bg-slate-800/80 p-5 rounded-2xl border border-slate-700 text-center">
              <div className="text-3xl font-black text-emerald-400">≥ 4 / 5</div>
              <div className="text-xs font-bold text-slate-300 mt-1">Unassisted Completion</div>
              <div className="text-[11px] text-slate-400 mt-1">Users finish full assessment and roadmap cycle</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
