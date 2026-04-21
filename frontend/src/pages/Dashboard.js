import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import api from '../utils/api';
import './Dashboard.css';

const Dashboard = () => {
  const { user } = useAuth();
  const [stats, setStats] = useState({ total: 0, todo: 0, inProgress: 0, done: 0 });
  const [recentTasks, setRecentTasks] = useState([]);
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [tasksRes, projectsRes] = await Promise.all([
          api.get('/tasks'),
          api.get('/projects')
        ]);
        const tasks = tasksRes.data.tasks;
        setStats({
          total: tasks.length,
          todo: tasks.filter(t => t.status === 'todo').length,
          inProgress: tasks.filter(t => t.status === 'in-progress').length,
          done: tasks.filter(t => t.status === 'done').length,
        });
        setRecentTasks(tasks.slice(0, 5));
        setProjects(projectsRes.data.projects.slice(0, 4));
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const priorityColor = { low: '#10b981', medium: '#f59e0b', high: '#ef4444', critical: '#7c3aed' };
  const statusLabel = { 'todo': 'To Do', 'in-progress': 'In Progress', 'review': 'Review', 'done': 'Done' };

  if (loading) return <div className="loading-container"><div className="spinner"></div></div>;

  return (
    <div className="dashboard" id="dashboard-page">
      <div className="dashboard-header">
        <div>
          <h1 className="dashboard-title">Good {getGreeting()}, {user?.name?.split(' ')[0]} 👋</h1>
          <p className="dashboard-subtitle">Here's your overview for today</p>
        </div>
        <Link to="/projects" className="btn-primary" id="go-to-projects-btn" style={{ padding: '0.6rem 1.2rem', borderRadius: '8px', textDecoration: 'none', fontSize: '0.9rem', fontWeight: 600 }}>
          + New Project
        </Link>
      </div>

      <div className="stats-grid" id="stats-grid">
        <div className="stat-card" id="stat-total">
          <div className="stat-icon" style={{ background: '#e0e7ff' }}>📋</div>
          <div className="stat-info">
            <span className="stat-value">{stats.total}</span>
            <span className="stat-label">Total Tasks</span>
          </div>
        </div>
        <div className="stat-card" id="stat-todo">
          <div className="stat-icon" style={{ background: '#fef3c7' }}>📌</div>
          <div className="stat-info">
            <span className="stat-value">{stats.todo}</span>
            <span className="stat-label">To Do</span>
          </div>
        </div>
        <div className="stat-card" id="stat-inprogress">
          <div className="stat-icon" style={{ background: '#dbeafe' }}>⚡</div>
          <div className="stat-info">
            <span className="stat-value">{stats.inProgress}</span>
            <span className="stat-label">In Progress</span>
          </div>
        </div>
        <div className="stat-card" id="stat-done">
          <div className="stat-icon" style={{ background: '#d1fae5' }}>✅</div>
          <div className="stat-info">
            <span className="stat-value">{stats.done}</span>
            <span className="stat-label">Completed</span>
          </div>
        </div>
      </div>

      <div className="dashboard-grid">
        <section className="dashboard-section" id="recent-tasks-section">
          <h2 className="section-title">Recent Tasks</h2>
          {recentTasks.length === 0 ? (
            <div className="empty-state">
              <p>No tasks yet. Create a project to get started!</p>
              <Link to="/projects" className="btn-primary" style={{ marginTop: '1rem', padding: '0.5rem 1rem', borderRadius: '6px', textDecoration: 'none', fontSize: '0.85rem' }}>
                Go to Projects
              </Link>
            </div>
          ) : (
            <div className="task-list">
              {recentTasks.map(task => (
                <div key={task._id} className="task-item" id={`task-${task._id}`}>
                  <div className="task-dot" style={{ background: priorityColor[task.priority] }}></div>
                  <div className="task-info">
                    <span className="task-title-text">{task.title}</span>
                    <span className="task-meta">{task.project?.title} · {statusLabel[task.status]}</span>
                  </div>
                  <span className={`status-badge status-${task.status}`}>{statusLabel[task.status]}</span>
                </div>
              ))}
            </div>
          )}
        </section>

        <section className="dashboard-section" id="projects-section">
          <h2 className="section-title">My Projects</h2>
          {projects.length === 0 ? (
            <div className="empty-state">
              <p>No projects yet.</p>
            </div>
          ) : (
            <div className="project-list">
              {projects.map(project => (
                <Link key={project._id} to={`/projects/${project._id}`} className="project-item" id={`project-${project._id}`}>
                  <div className="project-dot" style={{ background: project.color }}></div>
                  <div className="project-info">
                    <span className="project-name-text">{project.title}</span>
                    <span className="project-meta">{project.members?.length || 0} member(s)</span>
                  </div>
                  <span className="arrow">›</span>
                </Link>
              ))}
            </div>
          )}
          <Link to="/projects" className="view-all-link">View all projects →</Link>
        </section>
      </div>
    </div>
  );
};

const getGreeting = () => {
  const h = new Date().getHours();
  if (h < 12) return 'morning';
  if (h < 17) return 'afternoon';
  return 'evening';
};

export default Dashboard;
