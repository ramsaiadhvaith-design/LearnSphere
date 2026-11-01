import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { 
  GraduationCap, 
  BookOpen, 
  Compass, 
  CheckSquare, 
  Map, 
  LayoutDashboard, 
  Users, 
  Sliders, 
  UploadCloud, 
  LogOut, 
  User, 
  Menu, 
  X,
  Layers,
  Sparkles
} from 'lucide-react';

export default function Navbar() {
  const { user, role, logout, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const isActive = (path) => location.pathname === path;

  // Role badge colors
  const roleBadgeStyle = {
    admin: 'bg-rose-100 text-rose-800 border-rose-200',
    faculty: 'bg-purple-100 text-purple-800 border-purple-200',
    student: 'bg-emerald-100 text-emerald-800 border-emerald-200'
  }[role] || 'bg-slate-100 text-slate-800 border-slate-200';

  return (
    <nav className="bg-slate-900 border-b border-slate-800 text-white sticky top-0 z-50 shadow-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo & Brand */}
          <div className="flex items-center space-x-3">
            <Link to={isAuthenticated ? (role === 'admin' ? '/admin' : role === 'faculty' ? '/faculty' : '/student') : '/'} className="flex items-center space-x-2.5 group">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-blue-600 to-teal-400 flex items-center justify-center shadow-lg group-hover:scale-105 transition-transform">
                <GraduationCap className="w-6 h-6 text-white" />
              </div>
              <div>
                <span className="text-xl font-bold tracking-tight text-white flex items-center gap-1.5">
                  LearnSphere
                  <span className="text-[10px] uppercase font-semibold px-1.5 py-0.5 rounded bg-blue-500/20 text-blue-300 border border-blue-500/30">PSE M5</span>
                </span>
                <span className="block text-[11px] text-slate-400 font-medium tracking-tight">One platform. Endless possibilities.</span>
              </div>
            </Link>
          </div>

          {/* Desktop Navigation Links */}
          {isAuthenticated && (
            <div className="hidden md:flex items-center space-x-1 lg:space-x-2 text-sm font-medium">
              {/* Student Navigation */}
              {role === 'student' && (
                <>
                  <Link
                    to="/student"
                    className={`px-3 py-2 rounded-lg flex items-center gap-1.5 transition-colors ${
                      isActive('/student') ? 'bg-blue-600 text-white' : 'text-slate-300 hover:bg-slate-800 hover:text-white'
                    }`}
                  >
                    <LayoutDashboard className="w-4 h-4" />
                    Dashboard
                  </Link>
                  <Link
                    to="/resources"
                    className={`px-3 py-2 rounded-lg flex items-center gap-1.5 transition-colors ${
                      isActive('/resources') ? 'bg-blue-600 text-white' : 'text-slate-300 hover:bg-slate-800 hover:text-white'
                    }`}
                  >
                    <BookOpen className="w-4 h-4" />
                    Resource Library
                  </Link>
                  <Link
                    to="/career-roles"
                    className={`px-3 py-2 rounded-lg flex items-center gap-1.5 transition-colors ${
                      isActive('/career-roles') ? 'bg-blue-600 text-white' : 'text-slate-300 hover:bg-slate-800 hover:text-white'
                    }`}
                  >
                    <Compass className="w-4 h-4" />
                    Career Roles
                  </Link>
                  <Link
                    to="/assessment"
                    className={`px-3 py-2 rounded-lg flex items-center gap-1.5 transition-colors ${
                      isActive('/assessment') ? 'bg-blue-600 text-white' : 'text-slate-300 hover:bg-slate-800 hover:text-white'
                    }`}
                  >
                    <CheckSquare className="w-4 h-4" />
                    Skill Assessment
                  </Link>
                  <Link
                    to="/roadmap"
                    className={`px-3 py-2 rounded-lg flex items-center gap-1.5 transition-colors ${
                      isActive('/roadmap') ? 'bg-blue-600 text-white' : 'text-slate-300 hover:bg-slate-800 hover:text-white'
                    }`}
                  >
                    <Map className="w-4 h-4" />
                    Learning Roadmap
                  </Link>
                </>
              )}

              {/* Faculty Navigation */}
              {role === 'faculty' && (
                <>
                  <Link
                    to="/faculty"
                    className={`px-3 py-2 rounded-lg flex items-center gap-1.5 transition-colors ${
                      isActive('/faculty') ? 'bg-purple-600 text-white' : 'text-slate-300 hover:bg-slate-800 hover:text-white'
                    }`}
                  >
                    <LayoutDashboard className="w-4 h-4" />
                    Faculty Dashboard
                  </Link>
                  <Link
                    to="/resources"
                    className={`px-3 py-2 rounded-lg flex items-center gap-1.5 transition-colors ${
                      isActive('/resources') ? 'bg-purple-600 text-white' : 'text-slate-300 hover:bg-slate-800 hover:text-white'
                    }`}
                  >
                    <BookOpen className="w-4 h-4" />
                    Resource Library
                  </Link>
                </>
              )}

              {/* Admin Navigation */}
              {role === 'admin' && (
                <>
                  <Link
                    to="/admin"
                    className={`px-3 py-2 rounded-lg flex items-center gap-1.5 transition-colors ${
                      isActive('/admin') ? 'bg-rose-600 text-white' : 'text-slate-300 hover:bg-slate-800 hover:text-white'
                    }`}
                  >
                    <LayoutDashboard className="w-4 h-4" />
                    Dashboard
                  </Link>
                  <Link
                    to="/admin/users"
                    className={`px-3 py-2 rounded-lg flex items-center gap-1.5 transition-colors ${
                      isActive('/admin/users') ? 'bg-rose-600 text-white' : 'text-slate-300 hover:bg-slate-800 hover:text-white'
                    }`}
                  >
                    <Users className="w-4 h-4" />
                    Users & Roles
                  </Link>
                  <Link
                    to="/resources"
                    className={`px-3 py-2 rounded-lg flex items-center gap-1.5 transition-colors ${
                      isActive('/resources') ? 'bg-rose-600 text-white' : 'text-slate-300 hover:bg-slate-800 hover:text-white'
                    }`}
                  >
                    <BookOpen className="w-4 h-4" />
                    Resources
                  </Link>
                  <Link
                    to="/admin/roles"
                    className={`px-3 py-2 rounded-lg flex items-center gap-1.5 transition-colors ${
                      isActive('/admin/roles') ? 'bg-rose-600 text-white' : 'text-slate-300 hover:bg-slate-800 hover:text-white'
                    }`}
                  >
                    <Sliders className="w-4 h-4" />
                    Roles & Skills
                  </Link>
                </>
              )}
            </div>
          )}

          {/* User Profile & Actions */}
          <div className="hidden md:flex items-center space-x-3">
            {isAuthenticated ? (
              <div className="flex items-center space-x-3">
                <span className={`px-2.5 py-1 text-xs font-semibold rounded-full border capitalize ${roleBadgeStyle}`}>
                  {role}
                </span>

                <div className="text-right">
                  <div className="text-sm font-medium text-white">{user?.name}</div>
                  <div className="text-xs text-slate-400">{user?.email}</div>
                </div>

                <button
                  onClick={handleLogout}
                  title="Sign out of LearnSphere"
                  className="p-2 text-slate-400 hover:text-rose-400 hover:bg-slate-800 rounded-lg transition-colors"
                >
                  <LogOut className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <div className="flex items-center space-x-2">
                <Link
                  to="/login"
                  className="px-4 py-2 text-sm font-medium text-slate-300 hover:text-white hover:bg-slate-800 rounded-lg transition-colors"
                >
                  Sign In
                </Link>
                <Link
                  to="/register"
                  className="px-4 py-2 text-sm font-medium text-white bg-blue-600 hover:bg-blue-500 rounded-lg shadow-sm transition-colors"
                >
                  Register
                </Link>
              </div>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden flex items-center">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 focus:outline-none"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu Dropdown */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-slate-950 border-b border-slate-800 px-4 pt-2 pb-4 space-y-1">
          {isAuthenticated ? (
            <>
              <div className="pb-3 pt-1 border-b border-slate-800 mb-2">
                <div className="text-sm font-semibold text-white">{user?.name}</div>
                <div className="text-xs text-slate-400">{user?.email}</div>
                <div className="mt-1">
                  <span className={`px-2 py-0.5 text-xs font-semibold rounded-full border capitalize ${roleBadgeStyle}`}>
                    {role}
                  </span>
                </div>
              </div>

              {role === 'student' && (
                <>
                  <Link to="/student" onClick={() => setMobileMenuOpen(false)} className="block px-3 py-2 rounded-lg text-sm font-medium text-slate-200 hover:bg-slate-800">Dashboard</Link>
                  <Link to="/resources" onClick={() => setMobileMenuOpen(false)} className="block px-3 py-2 rounded-lg text-sm font-medium text-slate-200 hover:bg-slate-800">Resource Library</Link>
                  <Link to="/career-roles" onClick={() => setMobileMenuOpen(false)} className="block px-3 py-2 rounded-lg text-sm font-medium text-slate-200 hover:bg-slate-800">Career Roles</Link>
                  <Link to="/assessment" onClick={() => setMobileMenuOpen(false)} className="block px-3 py-2 rounded-lg text-sm font-medium text-slate-200 hover:bg-slate-800">Skill Assessment</Link>
                  <Link to="/roadmap" onClick={() => setMobileMenuOpen(false)} className="block px-3 py-2 rounded-lg text-sm font-medium text-slate-200 hover:bg-slate-800">Learning Roadmap</Link>
                </>
              )}

              {role === 'faculty' && (
                <>
                  <Link to="/faculty" onClick={() => setMobileMenuOpen(false)} className="block px-3 py-2 rounded-lg text-sm font-medium text-slate-200 hover:bg-slate-800">Faculty Dashboard</Link>
                  <Link to="/resources" onClick={() => setMobileMenuOpen(false)} className="block px-3 py-2 rounded-lg text-sm font-medium text-slate-200 hover:bg-slate-800">Resource Library</Link>
                </>
              )}

              {role === 'admin' && (
                <>
                  <Link to="/admin" onClick={() => setMobileMenuOpen(false)} className="block px-3 py-2 rounded-lg text-sm font-medium text-slate-200 hover:bg-slate-800">Admin Dashboard</Link>
                  <Link to="/admin/users" onClick={() => setMobileMenuOpen(false)} className="block px-3 py-2 rounded-lg text-sm font-medium text-slate-200 hover:bg-slate-800">User Management</Link>
                  <Link to="/resources" onClick={() => setMobileMenuOpen(false)} className="block px-3 py-2 rounded-lg text-sm font-medium text-slate-200 hover:bg-slate-800">Resources</Link>
                  <Link to="/admin/roles" onClick={() => setMobileMenuOpen(false)} className="block px-3 py-2 rounded-lg text-sm font-medium text-slate-200 hover:bg-slate-800">Roles & Skills</Link>
                </>
              )}

              <button
                onClick={() => { setMobileMenuOpen(false); handleLogout(); }}
                className="w-full text-left px-3 py-2 rounded-lg text-sm font-medium text-rose-400 hover:bg-slate-800 mt-2 flex items-center gap-1.5"
              >
                <LogOut className="w-4 h-4" />
                Sign Out
              </button>
            </>
          ) : (
            <div className="pt-2 space-y-2">
              <Link to="/login" onClick={() => setMobileMenuOpen(false)} className="block w-full text-center px-4 py-2 text-sm font-medium text-slate-200 bg-slate-800 rounded-lg">Sign In</Link>
              <Link to="/register" onClick={() => setMobileMenuOpen(false)} className="block w-full text-center px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg">Register</Link>
            </div>
          )}
        </div>
      )}
    </nav>
  );
}
