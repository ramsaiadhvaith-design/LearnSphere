import React, { useState, useEffect } from 'react';
import { api } from '../../services/api';
import { useAuth } from '../../context/AuthContext';
import { 
  Search, 
  Filter, 
  BookOpen, 
  Download, 
  ExternalLink, 
  Tag, 
  Sparkles, 
  FileText, 
  Presentation, 
  CheckCircle, 
  Layers, 
  Clock, 
  X,
  AlertCircle
} from 'lucide-react';

export default function ResourceLibrary() {
  const { user, role } = useAuth();
  const [resources, setResources] = useState([]);
  const [skills, setSkills] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Filters
  const [search, setSearch] = useState('');
  const [selectedSubject, setSelectedSubject] = useState('all');
  const [selectedType, setSelectedType] = useState('all');
  const [selectedDifficulty, setSelectedDifficulty] = useState('all');
  const [selectedSkillId, setSelectedSkillId] = useState('all');

  // Modal for detail view
  const [activeResource, setActiveResource] = useState(null);

  useEffect(() => {
    loadData();
  }, [selectedSubject, selectedType, selectedDifficulty, selectedSkillId]);

  const loadData = async () => {
    setLoading(true);
    setError('');
    try {
      const [resData, skillsData] = await Promise.all([
        api.getResources({
          search: search || undefined,
          subject: selectedSubject !== 'all' ? selectedSubject : undefined,
          type: selectedType !== 'all' ? selectedType : undefined,
          difficulty: selectedDifficulty !== 'all' ? selectedDifficulty : undefined,
          skillId: selectedSkillId !== 'all' ? selectedSkillId : undefined,
          status: role === 'student' ? 'active' : 'all'
        }),
        api.getSkills()
      ]);
      setResources(resData.resources || []);
      setSkills(skillsData.skills || []);
    } catch (err) {
      setError(err.message || 'Failed to load academic resources.');
    } finally {
      setLoading(false);
    }
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    loadData();
  };

  const clearFilters = () => {
    setSearch('');
    setSelectedSubject('all');
    setSelectedType('all');
    setSelectedDifficulty('all');
    setSelectedSkillId('all');
  };

  const getDifficultyBadge = (difficulty) => {
    switch (difficulty) {
      case 'beginner': return 'bg-emerald-50 text-emerald-700 border-emerald-200';
      case 'intermediate': return 'bg-amber-50 text-amber-700 border-amber-200';
      case 'advanced': return 'bg-rose-50 text-rose-700 border-rose-200';
      default: return 'bg-slate-50 text-slate-700 border-slate-200';
    }
  };

  const getTypeBadge = (type) => {
    switch (type) {
      case 'notes': return 'bg-blue-50 text-blue-700 border-blue-200';
      case 'ppt': return 'bg-orange-50 text-orange-700 border-orange-200';
      case 'tutorial': return 'bg-indigo-50 text-indigo-700 border-indigo-200';
      case 'assignment': return 'bg-purple-50 text-purple-700 border-purple-200';
      case 'project': return 'bg-teal-50 text-teal-700 border-teal-200';
      case 'exercise': return 'bg-cyan-50 text-cyan-700 border-cyan-200';
      default: return 'bg-slate-50 text-slate-700 border-slate-200';
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-blue-950 to-slate-900 rounded-3xl p-6 sm:p-10 text-white shadow-xl mb-8 relative overflow-hidden">
        <div className="relative z-10 max-w-2xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/20 text-blue-300 text-xs font-semibold mb-3 border border-blue-400/30">
            <BookOpen className="w-3.5 h-3.5" />
            Centralized Academic Resource Hub
          </div>
          <h1 className="text-2xl sm:text-4xl font-extrabold tracking-tight">Academic Resource Library</h1>
          <p className="mt-2 text-slate-300 text-sm sm:text-base leading-relaxed">
            Eliminate scattered WhatsApp notes and lost Google Drive links. Discover faculty-curated lecture notes, slides, tutorials, and capstones mapped to core technical skills.
          </p>
        </div>
      </div>

      {/* Search and Filters Bar */}
      <div className="bg-white p-5 rounded-2xl shadow-sm border border-slate-200/80 mb-8 space-y-4">
        <form onSubmit={handleSearchSubmit} className="flex gap-2">
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5 pointer-events-none" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by keyword, topic, or subject (e.g. JavaScript, React, SQL, Flexbox)..."
              className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white"
            />
          </div>
          <button
            type="submit"
            className="px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-medium text-sm rounded-xl transition-colors shadow-sm flex items-center gap-1.5"
          >
            <Search className="w-4 h-4" />
            Search
          </button>
        </form>

        {/* Filter Selectors */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2 border-t border-slate-100 text-xs font-medium">
          <div>
            <label className="block text-slate-500 mb-1">Subject</label>
            <select
              value={selectedSubject}
              onChange={(e) => setSelectedSubject(e.target.value)}
              className="w-full p-2 bg-slate-50 border border-slate-200 rounded-lg text-slate-700 focus:outline-none"
            >
              <option value="all">All Subjects</option>
              <option value="Web Technologies">Web Technologies</option>
              <option value="Advanced Web Programming">Advanced Web Programming</option>
              <option value="Database Management Systems">Database Management Systems</option>
              <option value="Software Engineering Tools">Software Engineering Tools</option>
              <option value="Problem Solving in Engineering">Problem Solving in Engineering</option>
            </select>
          </div>

          <div>
            <label className="block text-slate-500 mb-1">Resource Type</label>
            <select
              value={selectedType}
              onChange={(e) => setSelectedType(e.target.value)}
              className="w-full p-2 bg-slate-50 border border-slate-200 rounded-lg text-slate-700 focus:outline-none capitalize"
            >
              <option value="all">All Types</option>
              <option value="notes">Notes</option>
              <option value="ppt">PPT / Slides</option>
              <option value="tutorial">Tutorial</option>
              <option value="assignment">Assignment</option>
              <option value="project">Project</option>
              <option value="exercise">Exercise</option>
              <option value="reference">Reference</option>
            </select>
          </div>

          <div>
            <label className="block text-slate-500 mb-1">Difficulty</label>
            <select
              value={selectedDifficulty}
              onChange={(e) => setSelectedDifficulty(e.target.value)}
              className="w-full p-2 bg-slate-50 border border-slate-200 rounded-lg text-slate-700 focus:outline-none capitalize"
            >
              <option value="all">All Difficulties</option>
              <option value="beginner">Beginner</option>
              <option value="intermediate">Intermediate</option>
              <option value="advanced">Advanced</option>
            </select>
          </div>

          <div>
            <label className="block text-slate-500 mb-1">Associated Skill</label>
            <select
              value={selectedSkillId}
              onChange={(e) => setSelectedSkillId(e.target.value)}
              className="w-full p-2 bg-slate-50 border border-slate-200 rounded-lg text-slate-700 focus:outline-none"
            >
              <option value="all">All Skills</option>
              {skills.map(s => (
                <option key={s.id} value={s.id}>{s.name}</option>
              ))}
            </select>
          </div>
        </div>

        {(search || selectedSubject !== 'all' || selectedType !== 'all' || selectedDifficulty !== 'all' || selectedSkillId !== 'all') && (
          <div className="flex items-center justify-between pt-1">
            <span className="text-xs text-slate-500">Filtered view active</span>
            <button
              onClick={clearFilters}
              className="text-xs font-semibold text-blue-600 hover:text-blue-700 underline"
            >
              Reset all filters
            </button>
          </div>
        )}
      </div>

      {/* Error Alert */}
      {error && (
        <div className="p-4 bg-rose-50 border border-rose-200 rounded-2xl text-rose-800 text-sm flex items-center gap-3 mb-6">
          <AlertCircle className="w-5 h-5 flex-shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {/* Resource Cards Grid */}
      {loading ? (
        <div className="py-20 flex flex-col items-center justify-center">
          <div className="w-10 h-10 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
          <p className="mt-3 text-sm text-slate-500">Retrieving academic resources...</p>
        </div>
      ) : resources.length === 0 ? (
        <div className="bg-white rounded-3xl p-12 text-center border border-slate-200/80 shadow-sm">
          <div className="w-16 h-16 bg-slate-50 rounded-2xl flex items-center justify-center mx-auto text-slate-400 mb-3">
            <BookOpen className="w-8 h-8" />
          </div>
          <h3 className="text-lg font-bold text-slate-900">No matching academic resources</h3>
          <p className="text-sm text-slate-500 mt-1 max-w-md mx-auto">
            We couldn't find any resources matching your search and filter criteria. Try broadening your keywords or clearing the filter options.
          </p>
          <button
            onClick={clearFilters}
            className="mt-5 px-4 py-2 bg-slate-900 text-white text-sm font-medium rounded-xl hover:bg-slate-800"
          >
            Clear Filters
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {resources.map((item) => (
            <div
              key={item.id}
              className="bg-white rounded-2xl border border-slate-200/80 shadow-sm hover:shadow-md transition-shadow p-5 flex flex-col justify-between"
            >
              <div>
                {/* Badges Bar */}
                <div className="flex items-center justify-between gap-2 mb-3">
                  <span className={`px-2 py-0.5 text-xs font-semibold rounded-md border capitalize ${getTypeBadge(item.type)}`}>
                    {item.type}
                  </span>
                  <div className="flex items-center gap-1.5">
                    <span className={`px-2 py-0.5 text-xs font-semibold rounded-md border capitalize ${getDifficultyBadge(item.difficulty)}`}>
                      {item.difficulty}
                    </span>
                    <span className="text-[11px] font-medium text-slate-400 bg-slate-100 px-1.5 py-0.5 rounded">
                      v{item.version}
                    </span>
                  </div>
                </div>

                {/* Title & Subject */}
                <h3 className="text-base font-bold text-slate-900 leading-snug line-clamp-2 hover:text-blue-600 transition-colors">
                  {item.title}
                </h3>
                <div className="mt-1 text-xs font-medium text-slate-500">
                  {item.subject} • <span className="text-slate-700">{item.unit}</span>
                </div>
                <div className="text-xs text-slate-600 mt-0.5 font-medium">
                  Topic: {item.topic}
                </div>

                {/* Description */}
                <p className="mt-2.5 text-xs text-slate-600 line-clamp-3 leading-relaxed">
                  {item.description}
                </p>

                {/* Skills Tags */}
                {item.skills && item.skills.length > 0 && (
                  <div className="mt-3.5 flex flex-wrap gap-1.5">
                    {item.skills.map(s => (
                      <span key={s.id} className="inline-flex items-center gap-1 px-2 py-0.5 bg-blue-50 text-blue-700 rounded-md text-[11px] font-medium border border-blue-100">
                        <Tag className="w-2.5 h-2.5" />
                        {s.name}
                      </span>
                    ))}
                  </div>
                )}
              </div>

              {/* Card Footer Actions */}
              <div className="mt-5 pt-3.5 border-t border-slate-100 flex items-center justify-between">
                <span className="text-[11px] text-slate-400 truncate max-w-[140px]">
                  By {item.uploader_name}
                </span>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setActiveResource(item)}
                    className="px-3 py-1.5 text-xs font-medium text-slate-700 hover:text-slate-900 hover:bg-slate-100 rounded-lg transition-colors"
                  >
                    View Details
                  </button>

                  {item.file_path ? (
                    <a
                      href={api.getDownloadUrl(item.id)}
                      download
                      className="px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-xs font-medium inline-flex items-center gap-1 shadow-sm transition-colors"
                    >
                      <Download className="w-3.5 h-3.5" />
                      Download
                    </a>
                  ) : item.external_url ? (
                    <a
                      href={item.external_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="px-3 py-1.5 bg-slate-900 hover:bg-slate-800 text-white rounded-lg text-xs font-medium inline-flex items-center gap-1 shadow-sm transition-colors"
                    >
                      <ExternalLink className="w-3.5 h-3.5" />
                      Open Link
                    </a>
                  ) : null}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Resource Detail Modal */}
      {activeResource && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-xs">
          <div className="bg-white rounded-3xl max-w-xl w-full p-6 sm:p-8 shadow-2xl border border-slate-200 relative animate-fade-in max-h-[90vh] overflow-y-auto">
            <button
              onClick={() => setActiveResource(null)}
              className="absolute top-5 right-5 p-1.5 rounded-full text-slate-400 hover:text-slate-700 hover:bg-slate-100"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-2 mb-3">
              <span className={`px-2.5 py-0.5 text-xs font-semibold rounded-md border capitalize ${getTypeBadge(activeResource.type)}`}>
                {activeResource.type}
              </span>
              <span className={`px-2.5 py-0.5 text-xs font-semibold rounded-md border capitalize ${getDifficultyBadge(activeResource.difficulty)}`}>
                {activeResource.difficulty}
              </span>
              <span className="text-xs text-slate-400">Version {activeResource.version}</span>
            </div>

            <h2 className="text-xl font-bold text-slate-900 leading-snug">{activeResource.title}</h2>
            <div className="mt-1 text-xs font-medium text-slate-500">
              {activeResource.subject} • {activeResource.unit} • {activeResource.topic}
            </div>

            <div className="mt-4 pt-4 border-t border-slate-100">
              <h4 className="text-xs font-semibold uppercase text-slate-400 tracking-wider">Description</h4>
              <p className="mt-1.5 text-sm text-slate-700 leading-relaxed whitespace-pre-line">
                {activeResource.description}
              </p>
            </div>

            {/* Mapped Skills */}
            {activeResource.skills && activeResource.skills.length > 0 && (
              <div className="mt-4">
                <h4 className="text-xs font-semibold uppercase text-slate-400 tracking-wider mb-2">Mapped Industry Skills</h4>
                <div className="flex flex-wrap gap-1.5">
                  {activeResource.skills.map(s => (
                    <span key={s.id} className="px-2.5 py-1 bg-blue-50 text-blue-700 rounded-lg text-xs font-medium border border-blue-200">
                      {s.name} ({s.category})
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* File Info */}
            <div className="mt-5 p-4 bg-slate-50 rounded-2xl border border-slate-200/80 text-xs text-slate-600 space-y-1">
              <div><strong>Uploaded by:</strong> {activeResource.uploader_name}</div>
              {activeResource.file_name && <div><strong>File Attachment:</strong> {activeResource.file_name}</div>}
              {activeResource.file_size && <div><strong>File Size:</strong> {(activeResource.file_size / (1024 * 1024)).toFixed(2)} MB</div>}
              <div><strong>Status:</strong> <span className="capitalize font-semibold text-emerald-600">{activeResource.status}</span></div>
            </div>

            {/* Actions */}
            <div className="mt-6 flex items-center justify-end gap-3 pt-4 border-t border-slate-100">
              <button
                onClick={() => setActiveResource(null)}
                className="px-4 py-2 text-sm font-medium text-slate-600 hover:bg-slate-100 rounded-xl"
              >
                Close
              </button>

              {activeResource.file_path ? (
                <a
                  href={api.getDownloadUrl(activeResource.id)}
                  download
                  className="px-5 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-sm font-semibold inline-flex items-center gap-2 shadow-sm"
                >
                  <Download className="w-4 h-4" />
                  Download File
                </a>
              ) : activeResource.external_url ? (
                <a
                  href={activeResource.external_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-5 py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-sm font-semibold inline-flex items-center gap-2 shadow-sm"
                >
                  <ExternalLink className="w-4 h-4" />
                  Open External Resource
                </a>
              ) : null}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
