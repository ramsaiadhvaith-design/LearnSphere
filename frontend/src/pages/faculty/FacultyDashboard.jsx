import React, { useState, useEffect } from 'react';
import { api } from '../../services/api';
import { useAuth } from '../../context/AuthContext';
import { 
  UploadCloud, 
  BookOpen, 
  Search, 
  Edit3, 
  Archive, 
  Download, 
  ExternalLink, 
  Plus, 
  X, 
  CheckCircle, 
  AlertCircle,
  Tag,
  Layers
} from 'lucide-react';

export default function FacultyDashboard() {
  const { user } = useAuth();
  const [resources, setResources] = useState([]);
  const [skills, setSkills] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [search, setSearch] = useState('');

  // Modal State for Upload / Edit
  const [modalOpen, setModalOpen] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [saving, setSaving] = useState(false);
  const [modalError, setModalError] = useState('');

  // Form Fields
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [subject, setSubject] = useState('Web Technologies');
  const [unit, setUnit] = useState('Unit 1');
  const [topic, setTopic] = useState('');
  const [type, setType] = useState('notes');
  const [difficulty, setDifficulty] = useState('beginner');
  const [version, setVersion] = useState('1.0');
  const [externalUrl, setExternalUrl] = useState('');
  const [selectedSkillIds, setSelectedSkillIds] = useState([]);
  const [selectedFile, setSelectedFile] = useState(null);

  useEffect(() => {
    loadFacultyData();
  }, []);

  const loadFacultyData = async () => {
    setLoading(true);
    setError('');
    try {
      const [resData, skillsData] = await Promise.all([
        api.getResources({ uploaderId: user?.id, status: 'all' }),
        api.getSkills()
      ]);
      setResources(resData.resources || []);
      setSkills(skillsData.skills || []);
    } catch (err) {
      setError(err.message || 'Failed to load faculty resources.');
    } finally {
      setLoading(false);
    }
  };

  const handleOpenCreateModal = () => {
    setEditingId(null);
    setTitle('');
    setDescription('');
    setSubject('Web Technologies');
    setUnit('Unit 1');
    setTopic('');
    setType('notes');
    setDifficulty('beginner');
    setVersion('1.0');
    setExternalUrl('');
    setSelectedSkillIds([]);
    setSelectedFile(null);
    setModalError('');
    setModalOpen(true);
  };

  const handleOpenEditModal = (item) => {
    setEditingId(item.id);
    setTitle(item.title);
    setDescription(item.description || '');
    setSubject(item.subject);
    setUnit(item.unit);
    setTopic(item.topic);
    setType(item.type);
    setDifficulty(item.difficulty);
    setVersion(item.version || '1.0');
    setExternalUrl(item.external_url || '');
    setSelectedSkillIds(item.skills?.map(s => s.id) || []);
    setSelectedFile(null);
    setModalError('');
    setModalOpen(true);
  };

  const toggleSkill = (skillId) => {
    setSelectedSkillIds(prev =>
      prev.includes(skillId) ? prev.filter(id => id !== skillId) : [...prev, skillId]
    );
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    setModalError('');
    setSaving(true);

    try {
      const formData = new FormData();
      formData.append('title', title);
      formData.append('description', description);
      formData.append('subject', subject);
      formData.append('unit', unit);
      formData.append('topic', topic);
      formData.append('type', type);
      formData.append('difficulty', difficulty);
      formData.append('version', version);
      if (externalUrl) formData.append('external_url', externalUrl);
      if (selectedSkillIds.length > 0) formData.append('skills', selectedSkillIds.join(','));
      if (selectedFile) formData.append('file', selectedFile);

      if (editingId) {
        await api.updateResource(editingId, formData);
      } else {
        await api.createResource(formData);
      }

      setModalOpen(false);
      loadFacultyData();
    } catch (err) {
      setModalError(err.message || 'Failed to save academic resource.');
    } finally {
      setSaving(false);
    }
  };

  const handleArchive = async (id) => {
    if (!window.confirm('Are you sure you want to archive this resource? Students will no longer see it in the active library.')) {
      return;
    }
    try {
      await api.archiveResource(id);
      loadFacultyData();
    } catch (err) {
      alert(`Failed to archive: ${err.message}`);
    }
  };

  const filteredResources = resources.filter(r => {
    if (!search) return true;
    const q = search.toLowerCase();
    return r.title.toLowerCase().includes(q) || r.topic.toLowerCase().includes(q) || r.subject.toLowerCase().includes(q);
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-purple-950 via-slate-900 to-indigo-950 rounded-3xl p-6 sm:p-10 text-white shadow-xl flex flex-col sm:flex-row sm:items-center justify-between gap-6">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-purple-500/20 text-purple-300 text-xs font-semibold mb-3 border border-purple-400/30">
            <BookOpen className="w-3.5 h-3.5" />
            Faculty Academic Portal
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
            Academic Resource Management
          </h1>
          <p className="mt-1 text-slate-300 text-sm max-w-xl">
            Upload, version, and manage curriculum learning materials. Map your resources directly to industry skills to feed student learning roadmaps.
          </p>
        </div>

        <button
          onClick={handleOpenCreateModal}
          className="px-5 py-3 bg-purple-600 hover:bg-purple-500 text-white font-bold rounded-2xl shadow-lg transition-all flex items-center gap-2 self-start sm:self-auto"
        >
          <Plus className="w-5 h-5" />
          <span>Upload Academic Resource</span>
        </button>
      </div>

      {/* KPI Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-sm">
          <div className="text-xs font-bold uppercase tracking-wider text-slate-400">Total Uploaded</div>
          <div className="text-2xl font-black text-slate-900 mt-1">{resources.length}</div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-sm">
          <div className="text-xs font-bold uppercase tracking-wider text-slate-400">Active in Library</div>
          <div className="text-2xl font-black text-emerald-600 mt-1">
            {resources.filter(r => r.status === 'active').length}
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-sm">
          <div className="text-xs font-bold uppercase tracking-wider text-slate-400">Archived</div>
          <div className="text-2xl font-black text-slate-400 mt-1">
            {resources.filter(r => r.status === 'archived').length}
          </div>
        </div>
      </div>

      {/* Search Bar */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm flex items-center gap-3">
        <Search className="w-4 h-4 text-slate-400" />
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Filter your uploaded resources by title, topic, or subject..."
          className="w-full text-sm focus:outline-none text-slate-800"
        />
      </div>

      {/* Resource Table */}
      <div className="bg-white rounded-3xl border border-slate-200/80 shadow-sm overflow-hidden">
        <div className="p-6 border-b border-slate-100 flex items-center justify-between">
          <h2 className="text-lg font-bold text-slate-900">Your Uploaded Materials</h2>
          <span className="text-xs text-slate-400">{filteredResources.length} items found</span>
        </div>

        {loading ? (
          <div className="py-16 text-center text-slate-400 text-sm">Loading resources...</div>
        ) : filteredResources.length === 0 ? (
          <div className="py-16 text-center text-slate-500 text-sm">
            No resources match your filter. Click <strong>Upload Academic Resource</strong> to add your first lecture note or tutorial.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead>
                <tr className="bg-slate-50 text-xs font-bold uppercase text-slate-400 border-b border-slate-100">
                  <th className="py-3 px-6">Resource Title</th>
                  <th className="py-3 px-4">Subject & Unit</th>
                  <th className="py-3 px-4">Type</th>
                  <th className="py-3 px-4">Version</th>
                  <th className="py-3 px-4">Skills Mapped</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-6 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredResources.map((item) => (
                  <tr key={item.id} className="hover:bg-slate-50/60 transition-colors">
                    <td className="py-4 px-6">
                      <div className="font-bold text-slate-900">{item.title}</div>
                      <div className="text-xs text-slate-500">Topic: {item.topic}</div>
                    </td>
                    <td className="py-4 px-4 text-xs font-medium text-slate-700">
                      {item.subject} • {item.unit}
                    </td>
                    <td className="py-4 px-4">
                      <span className="px-2 py-0.5 rounded text-xs font-semibold bg-purple-50 text-purple-700 border border-purple-200 capitalize">
                        {item.type}
                      </span>
                    </td>
                    <td className="py-4 px-4 text-xs font-mono text-slate-500">
                      v{item.version}
                    </td>
                    <td className="py-4 px-4">
                      <div className="flex flex-wrap gap-1 max-w-xs">
                        {item.skills?.map(s => (
                          <span key={s.id} className="px-1.5 py-0.5 bg-slate-100 text-slate-700 rounded text-[10px] font-medium">
                            {s.name}
                          </span>
                        ))}
                      </div>
                    </td>
                    <td className="py-4 px-4">
                      <span className={`px-2 py-0.5 rounded-full text-xs font-bold capitalize ${
                        item.status === 'active' ? 'bg-emerald-50 text-emerald-700' : 'bg-slate-100 text-slate-500'
                      }`}>
                        {item.status}
                      </span>
                    </td>
                    <td className="py-4 px-6 text-right">
                      <div className="flex items-center justify-end gap-2">
                        {item.file_path && (
                          <a
                            href={api.getDownloadUrl(item.id)}
                            download
                            title="Download file"
                            className="p-1.5 rounded-lg text-slate-400 hover:text-blue-600 hover:bg-slate-100"
                          >
                            <Download className="w-4 h-4" />
                          </a>
                        )}

                        <button
                          onClick={() => handleOpenEditModal(item)}
                          title="Edit metadata"
                          className="p-1.5 rounded-lg text-slate-400 hover:text-purple-600 hover:bg-slate-100"
                        >
                          <Edit3 className="w-4 h-4" />
                        </button>

                        {item.status === 'active' && (
                          <button
                            onClick={() => handleArchive(item.id)}
                            title="Archive resource"
                            className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-slate-100"
                          >
                            <Archive className="w-4 h-4" />
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Upload / Edit Modal */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-xs">
          <div className="bg-white rounded-3xl max-w-2xl w-full p-6 sm:p-8 shadow-2xl border border-slate-200 relative animate-fade-in max-h-[90vh] overflow-y-auto">
            <button
              onClick={() => setModalOpen(false)}
              className="absolute top-5 right-5 p-1.5 rounded-full text-slate-400 hover:text-slate-700 hover:bg-slate-100"
            >
              <X className="w-5 h-5" />
            </button>

            <h2 className="text-xl font-bold text-slate-900 mb-1">
              {editingId ? 'Edit Academic Resource' : 'Publish New Academic Resource'}
            </h2>
            <p className="text-xs text-slate-500 mb-5">
              Fill in metadata, curriculum hierarchy, and technical skills mapping.
            </p>

            {modalError && (
              <div className="p-3.5 bg-rose-50 border border-rose-200 rounded-xl text-rose-800 text-xs flex items-center gap-2 mb-4">
                <AlertCircle className="w-4 h-4 flex-shrink-0" />
                <span>{modalError}</span>
              </div>
            )}

            <form onSubmit={handleFormSubmit} className="space-y-4 text-xs font-medium">
              <div>
                <label className="block text-slate-700 mb-1 font-bold">Resource Title *</label>
                <input
                  type="text"
                  required
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="e.g. Asynchronous JavaScript & Promises Lab Manual"
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 focus:outline-none focus:ring-2 focus:ring-purple-500"
                />
              </div>

              <div>
                <label className="block text-slate-700 mb-1 font-bold">Description</label>
                <textarea
                  rows={2}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Summary of learning content, prerequisites, and learning outcomes..."
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 focus:outline-none focus:ring-2 focus:ring-purple-500"
                ></textarea>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block text-slate-700 mb-1 font-bold">Subject *</label>
                  <input
                    type="text"
                    required
                    value={subject}
                    onChange={(e) => setSubject(e.target.value)}
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-slate-700 mb-1 font-bold">Unit / Module *</label>
                  <input
                    type="text"
                    required
                    value={unit}
                    onChange={(e) => setUnit(e.target.value)}
                    placeholder="e.g. Unit 2"
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-slate-700 mb-1 font-bold">Topic *</label>
                  <input
                    type="text"
                    required
                    value={topic}
                    onChange={(e) => setTopic(e.target.value)}
                    placeholder="e.g. Async / Await"
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 focus:outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block text-slate-700 mb-1 font-bold">Resource Type</label>
                  <select
                    value={type}
                    onChange={(e) => setType(e.target.value)}
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 capitalize"
                  >
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
                  <label className="block text-slate-700 mb-1 font-bold">Difficulty</label>
                  <select
                    value={difficulty}
                    onChange={(e) => setDifficulty(e.target.value)}
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 capitalize"
                  >
                    <option value="beginner">Beginner</option>
                    <option value="intermediate">Intermediate</option>
                    <option value="advanced">Advanced</option>
                  </select>
                </div>
                <div>
                  <label className="block text-slate-700 mb-1 font-bold">Version</label>
                  <input
                    type="text"
                    value={version}
                    onChange={(e) => setVersion(e.target.value)}
                    placeholder="1.0"
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-900"
                  />
                </div>
              </div>

              {/* Skills Mapping Checklist */}
              <div>
                <label className="block text-slate-700 mb-1.5 font-bold">
                  Associated Technical Skills (Select all that apply)
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 bg-slate-50 p-3 rounded-xl border border-slate-200 max-h-36 overflow-y-auto">
                  {skills.map(s => {
                    const isChecked = selectedSkillIds.includes(s.id);
                    return (
                      <label
                        key={s.id}
                        className={`flex items-center gap-2 p-1.5 rounded-lg cursor-pointer text-xs transition-colors ${
                          isChecked ? 'bg-purple-100 text-purple-900 font-bold' : 'text-slate-700 hover:bg-slate-200/60'
                        }`}
                      >
                        <input
                          type="checkbox"
                          checked={isChecked}
                          onChange={() => toggleSkill(s.id)}
                          className="rounded text-purple-600 focus:ring-0"
                        />
                        <span className="truncate">{s.name}</span>
                      </label>
                    );
                  })}
                </div>
              </div>

              {/* File Attachment or External Link */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                <div>
                  <label className="block text-slate-700 mb-1 font-bold">
                    Upload File (PDF, PPT, DOCX, ZIP - Max 25MB)
                  </label>
                  <input
                    type="file"
                    onChange={(e) => setSelectedFile(e.target.files[0] || null)}
                    className="w-full p-2 bg-slate-50 border border-slate-200 rounded-xl text-slate-600 file:mr-2 file:py-1 file:px-2 file:rounded-md file:border-0 file:text-xs file:font-semibold file:bg-purple-600 file:text-white"
                  />
                </div>

                <div>
                  <label className="block text-slate-700 mb-1 font-bold">
                    Or External URL Link (Docs / Tutorial)
                  </label>
                  <input
                    type="url"
                    value={externalUrl}
                    onChange={(e) => setExternalUrl(e.target.value)}
                    placeholder="https://developer.mozilla.org/..."
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-900"
                  />
                </div>
              </div>

              <div className="pt-4 flex items-center justify-end gap-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setModalOpen(false)}
                  className="px-4 py-2 text-sm text-slate-600 hover:bg-slate-100 rounded-xl font-medium"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className="px-6 py-2.5 bg-purple-600 hover:bg-purple-700 text-white rounded-xl text-sm font-bold shadow-md transition-colors disabled:opacity-50"
                >
                  {saving ? 'Saving...' : editingId ? 'Update Resource' : 'Publish Resource'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
