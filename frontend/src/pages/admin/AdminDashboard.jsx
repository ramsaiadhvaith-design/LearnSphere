import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { api } from '../../services/api';
import { 
  ShieldCheck, 
  Users, 
  BookOpen, 
  Compass, 
  Award, 
  Map, 
  CheckSquare, 
  ArrowRight,
  TrendingUp,
  Activity,
  Layers,
  Sparkles
} from 'lucide-react';

export default function AdminDashboard() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    async function loadStats() {
      try {
        const res = await api.getPlatformStats();
        setStats(res.stats);
      } catch (err) {
        setError(err.message || 'Failed to load platform stats.');
      } finally {
        setLoading(false);
      }
    }
    loadStats();
  }, []);

  if (loading) {
    return (
      <div className="py-20 flex flex-col items-center justify-center">
        <div className="w-10 h-10 border-4 border-rose-600 border-t-transparent rounded-full animate-spin"></div>
        <p className="mt-3 text-sm text-slate-500">Querying platform metrics from MySQL database...</p>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-rose-950 to-slate-900 rounded-3xl p-6 sm:p-10 text-white shadow-xl flex flex-col sm:flex-row sm:items-center justify-between gap-6">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-rose-500/20 text-rose-300 text-xs font-semibold mb-3 border border-rose-400/30">
            <ShieldCheck className="w-3.5 h-3.5" />
            System Administration Portal
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
            LearnSphere Administrative Overview
          </h1>
          <p className="mt-1 text-slate-300 text-sm max-w-xl">
            Real-time metrics derived from relational database queries. Oversee RBAC accounts, review academic resources, and configure industry benchmark standards.
          </p>
        </div>

        <div className="flex flex-wrap gap-2">
          <Link
            to="/admin/users"
            className="px-4 py-2.5 bg-rose-600 hover:bg-rose-500 text-white text-xs font-bold rounded-xl shadow-md transition-colors flex items-center gap-1.5"
          >
            <Users className="w-4 h-4" />
            Manage Users
          </Link>
          <Link
            to="/admin/roles"
            className="px-4 py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold rounded-xl border border-slate-700 transition-colors flex items-center gap-1.5"
          >
            <Compass className="w-4 h-4" />
            Roles & Skills
          </Link>
        </div>
      </div>

      {error && (
        <div className="p-4 bg-rose-50 border border-rose-200 text-rose-800 rounded-2xl text-sm">
          {error}
        </div>
      )}

      {/* KPI Cards Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-sm text-center">
          <div className="text-2xl font-black text-slate-900">{stats?.total_users || 0}</div>
          <div className="text-[11px] font-bold uppercase tracking-wider text-slate-400 mt-1">Total Users</div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-sm text-center">
          <div className="text-2xl font-black text-blue-600">{stats?.students || 0}</div>
          <div className="text-[11px] font-bold uppercase tracking-wider text-slate-400 mt-1">Students</div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-sm text-center">
          <div className="text-2xl font-black text-purple-600">{stats?.faculty || 0}</div>
          <div className="text-[11px] font-bold uppercase tracking-wider text-slate-400 mt-1">Faculty</div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-sm text-center">
          <div className="text-2xl font-black text-teal-600">{stats?.active_resources || 0}</div>
          <div className="text-[11px] font-bold uppercase tracking-wider text-slate-400 mt-1">Active Resources</div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-sm text-center">
          <div className="text-2xl font-black text-indigo-600">{stats?.total_career_roles || 0}</div>
          <div className="text-[11px] font-bold uppercase tracking-wider text-slate-400 mt-1">Career Roles</div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-sm text-center">
          <div className="text-2xl font-black text-emerald-600">{stats?.total_skills || 0}</div>
          <div className="text-[11px] font-bold uppercase tracking-wider text-slate-400 mt-1">Total Skills</div>
        </div>
      </div>

      {/* Admin Module Navigation Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Link
          to="/admin/users"
          className="bg-white p-6 rounded-3xl border border-slate-200/80 shadow-sm hover:shadow-xl transition-all group block"
        >
          <div className="w-12 h-12 rounded-2xl bg-rose-50 text-rose-600 group-hover:bg-rose-600 group-hover:text-white flex items-center justify-center transition-colors mb-4">
            <Users className="w-6 h-6" />
          </div>
          <h3 className="text-lg font-bold text-slate-900 group-hover:text-rose-600 transition-colors">
            User Accounts & Roles
          </h3>
          <p className="mt-1 text-xs text-slate-500 leading-relaxed">
            Provision authorized faculty and administrator accounts, manage user active states, and prevent privilege escalation.
          </p>
          <span className="mt-4 inline-flex items-center gap-1 text-xs font-bold text-rose-600">
            Manage Accounts &rarr;
          </span>
        </Link>

        <Link
          to="/admin/roles"
          className="bg-white p-6 rounded-3xl border border-slate-200/80 shadow-sm hover:shadow-xl transition-all group block"
        >
          <div className="w-12 h-12 rounded-2xl bg-blue-50 text-blue-600 group-hover:bg-blue-600 group-hover:text-white flex items-center justify-center transition-colors mb-4">
            <Compass className="w-6 h-6" />
          </div>
          <h3 className="text-lg font-bold text-slate-900 group-hover:text-blue-600 transition-colors">
            Career Roles & Skills Benchmark
          </h3>
          <p className="mt-1 text-xs text-slate-500 leading-relaxed">
            Configure target career roles and specify required proficiency levels (1-5) with educational rationales for skill-gap comparisons.
          </p>
          <span className="mt-4 inline-flex items-center gap-1 text-xs font-bold text-blue-600">
            Configure Taxonomy &rarr;
          </span>
        </Link>

        <Link
          to="/resources"
          className="bg-white p-6 rounded-3xl border border-slate-200/80 shadow-sm hover:shadow-xl transition-all group block"
        >
          <div className="w-12 h-12 rounded-2xl bg-teal-50 text-teal-600 group-hover:bg-teal-600 group-hover:text-white flex items-center justify-center transition-colors mb-4">
            <BookOpen className="w-6 h-6" />
          </div>
          <h3 className="text-lg font-bold text-slate-900 group-hover:text-teal-600 transition-colors">
            All Academic Resources
          </h3>
          <p className="mt-1 text-xs text-slate-500 leading-relaxed">
            Review institution-wide academic resources, verify curriculum alignment, and archive outdated or duplicate learning materials.
          </p>
          <span className="mt-4 inline-flex items-center gap-1 text-xs font-bold text-teal-600">
            Review Library &rarr;
          </span>
        </Link>
      </div>

      {/* Aggregate Learning Stats */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-sm">
        <h3 className="text-base font-bold text-slate-900 mb-4 flex items-center gap-2">
          <Activity className="w-5 h-5 text-indigo-600" />
          Aggregate Learning & Skill Gap Activity
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
          <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100">
            <span className="text-xs text-slate-500 block">Total Assessments Evaluated</span>
            <span className="text-2xl font-black text-slate-900 mt-1 block">{stats?.total_assessments || 0}</span>
            <span className="text-[11px] text-slate-400 mt-0.5 block">Computed using rule engine</span>
          </div>

          <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100">
            <span className="text-xs text-slate-500 block">Roadmap Learning Activities Assigned</span>
            <span className="text-2xl font-black text-blue-600 mt-1 block">{stats?.total_activities || 0}</span>
            <span className="text-[11px] text-slate-400 mt-0.5 block">Mapped to gap skills</span>
          </div>

          <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100">
            <span className="text-xs text-slate-500 block">Completed Activities by Students</span>
            <span className="text-2xl font-black text-emerald-600 mt-1 block">{stats?.completed_activities || 0}</span>
            <span className="text-[11px] text-emerald-600 font-semibold mt-0.5 block">
              {stats?.total_activities ? Math.round((stats.completed_activities / stats.total_activities) * 100) : 0}% completion rate
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
