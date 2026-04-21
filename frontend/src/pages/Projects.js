import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import api from '../utils/api';
import './Projects.css';
import '../pages/Auth.css';

const COLORS = ['#4f46e5', '#7c3aed', '#db2777', '#059669', '#d97706', '#dc2626', '#0891b2'];

const Projects = () => {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editProject, setEditProject] = useState(null);
  const [form, setForm] = useState({ title: '', description: '', color: '#4f46e5' });
  const [submitting, setSubmitting] = useState(false);

  const fetchProjects = async () => {
    try {
      const res = await api.get('/projects');
      setProjects(res.data.projects);
    } catch { toast.error('Failed to load projects'); }
    finally { setLoading(false); }
  };

  useEffect(() => { fetchProjects(); }, []);

  const openCreate = () => {
    setEditProject(null);
    setForm({ title: '', description: '', color: '#4f46e5' });
    setShowModal(true);
  };

  const openEdit = (e, project) => {
    e.preventDefault();
    setEditProject(project);
    setForm({ title: project.title, description: project.description, color: project.color });
    setShowModal(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      if (editProject) {
        const res = await api.put(`/projects/${editProject._id}`, form);
        setProjects(projects.map(p => p._id === editProject._id ? res.data.project : p));
        toast.success('Project updated!');
      } else {
        const res = await api.post('/projects', form);
        setProjects([res.data.project, ...projects]);
        toast.success('Project created!');
      }
      setShowModal(false);
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to save project');
    } finally { setSubmitting(false); }
  };

  const handleDelete = async (e, id) => {
    e.preventDefault();
    if (!window.confirm('Delete this project and all its tasks?')) return;
    try {
      await api.delete(`/projects/${id}`);
      setProjects(projects.filter(p => p._id !== id));
      toast.success('Project deleted');
    } catch { toast.error('Failed to delete project'); }
  };

  if (loading) return <div className="loading-container"><div className="spinner"></div></div>;

  return (
    <div className="projects-page" id="projects-page">
      <div className="projects-header">
        <div>
          <h1 className="page-title">Projects</h1>
          <p className="page-subtitle">{projects.length} project(s) total</p>
        </div>
        <button className="btn-primary" onClick={openCreate} id="create-project-btn">
          + New Project
        </button>
      </div>

      {projects.length === 0 ? (
        <div className="empty-projects">
          <div className="empty-icon">📁</div>
          <h2>No projects yet</h2>
          <p>Create your first project to start managing tasks</p>
          <button className="btn-primary" onClick={openCreate} style={{ marginTop: '1rem' }}>
            Create Project
          </button>
        </div>
      ) : (
        <div className="projects-grid" id="projects-grid">
          {projects.map(project => (
            <Link key={project._id} to={`/projects/${project._id}`} className="project-card" id={`project-card-${project._id}`}>
              <div className="project-card-top" style={{ background: project.color }}>
                <span className="project-card-initial">{project.title.charAt(0).toUpperCase()}</span>
              </div>
              <div className="project-card-body">
                <h3 className="project-card-title">{project.title}</h3>
                <p className="project-card-desc">{project.description || 'No description'}</p>
                <div className="project-card-meta">
                  <span>👥 {project.members?.length || 0} members</span>
                  <span className={`project-status ${project.status}`}>{project.status}</span>
                </div>
              </div>
              <div className="project-card-actions">
                <button className="action-btn edit" onClick={(e) => openEdit(e, project)} id={`edit-project-${project._id}`}>Edit</button>
                <button className="action-btn delete" onClick={(e) => handleDelete(e, project._id)} id={`delete-project-${project._id}`}>Delete</button>
              </div>
            </Link>
          ))}
        </div>
      )}

      {showModal && (
        <div className="modal-overlay" id="project-modal">
          <div className="modal">
            <div className="modal-header">
              <h2 className="modal-title">{editProject ? 'Edit Project' : 'New Project'}</h2>
              <button className="modal-close" onClick={() => setShowModal(false)}>×</button>
            </div>
            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label className="form-label">Project Title *</label>
                <input className="form-input" id="project-title-input" value={form.title} onChange={e => setForm({ ...form, title: e.target.value })} placeholder="Enter title" required />
              </div>
              <div className="form-group mt-3">
                <label className="form-label">Description</label>
                <textarea className="form-input form-textarea" id="project-description-input" value={form.description} onChange={e => setForm({ ...form, description: e.target.value })} placeholder="Optional description" />
              </div>
              <div className="form-group mt-3">
                <label className="form-label">Color</label>
                <div className="color-picker">
                  {COLORS.map(c => (
                    <button key={c} type="button" className={`color-dot ${form.color === c ? 'selected' : ''}`} style={{ background: c }} onClick={() => setForm({ ...form, color: c })} />
                  ))}
                </div>
              </div>
              <div className="modal-footer">
                <button type="button" className="btn-secondary" onClick={() => setShowModal(false)}>Cancel</button>
                <button type="submit" className="btn-primary" id="project-submit-btn" disabled={submitting}>
                  {submitting ? 'Saving...' : editProject ? 'Update' : 'Create'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Projects;
