import React from 'react';
import { GraduationCap, ShieldCheck, Database, Cpu } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-slate-900 border-t border-slate-800 text-slate-400 py-10 mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          {/* Brand Info */}
          <div className="md:col-span-2 space-y-3">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center text-white">
                <GraduationCap className="w-5 h-5" />
              </div>
              <span className="text-lg font-bold text-white tracking-tight">LearnSphere</span>
            </div>
            <p className="text-sm text-slate-400 leading-relaxed max-w-md">
              An Integrated Academic Resource Management and Industry Skill Development Platform. Built for college Problem Solving in Engineering (PSE) Module 5.
            </p>
            <div className="text-xs text-slate-500 font-medium">
              Tagline: <span className="text-slate-300 italic">"One platform. Endless possibilities."</span>
            </div>
          </div>

          {/* Subsystems */}
          <div>
            <h4 className="text-sm font-semibold text-white tracking-wider uppercase mb-3">Subsystems</h4>
            <ul className="space-y-2 text-sm">
              <li className="flex items-center gap-1.5 text-slate-300">
                <Database className="w-3.5 h-3.5 text-teal-400" />
                Academic Resource Library
              </li>
              <li className="flex items-center gap-1.5 text-slate-300">
                <Cpu className="w-3.5 h-3.5 text-blue-400" />
                Rule-Based Skill-Gap Engine
              </li>
              <li className="flex items-center gap-1.5 text-slate-300">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                Role-Based Access Control
              </li>
            </ul>
          </div>

          {/* Academic Notice */}
          <div>
            <h4 className="text-sm font-semibold text-white tracking-wider uppercase mb-3">Notice & Scope</h4>
            <p className="text-xs text-slate-400 leading-relaxed">
              Skill-gap calculations and roadmaps are intended as academic self-assessment guidance. This prototype demonstrates technical feasibility and initial usability without guaranteeing employment outcomes.
            </p>
          </div>
        </div>

        <div className="pt-6 border-t border-slate-800 text-center md:flex md:justify-between items-center text-xs text-slate-500">
          <div>© 2026 LearnSphere Platform. Local Prototype Execution.</div>
          <div className="mt-2 md:mt-0">React • Tailwind CSS • Express • MySQL / Relational Engine</div>
        </div>
      </div>
    </footer>
  );
}
