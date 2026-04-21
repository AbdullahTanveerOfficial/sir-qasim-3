import React, { useEffect, useState, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { useAuth } from '../context/AuthContext';
import api from '../utils/api';
import TaskCard from '../components/TaskCard';
import TaskModal from '../components/TaskModal';
import './ProjectBoard.css';
import '../pages/Auth.css';

const COLUMNS = [
  { key: 'todo', label: 'To Do', color: '#6b7280' },
  { key: 'in-progress', label: 'In Progress', color: '#3b82f6' },
  { key: 'review', label: 'Review', color: '#f59e0b' },
  { key: 'done', label: 'Done', color: '#10b981' },
];

const ProjectBoard = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [project, setProject] = useState(null);
  const [tasks, setTasks] = useState([]);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showTaskModal, setShowTaskModal] = useState(false);
  const [editTask, setEditTask] = useState(null);
  const [defaultStatus, setDefaultStatus] = useState('todo');
  const [filterPriority, setFilterPriority] = useState('');
  const [filterAssignee, setFilterAssignee] = useState('');
  const [searchTerm, setSearchTerm] = useState('');

  const fetchData = useCallback(async () => {
    try {
      const [projectRes, tasksRes, usersRes] = await Promise.all([
        api.get(`/projects/${id}`),
        api.get(`/tasks?project=${id}`),
        api.get('/users')
      ]);
      setProject(projectRes.data.project);
      setTasks(tasksRes.data.tasks);
      setUsers(usersRes.data.users);
    } catch (err) {
      toast.error('Failed to load project');
      navigate('/projects');
    } finally {
      setLoading(false);
    }
  }, [id, navigate]);

  useEffect(() => { fetchData(); }, [fetchData]);

  const openCreateTask = (status) => {
    setEditTask(null);
    setDefaultStatus(status);
    setShowTaskModal(true);
  };

  const openEditTask = (task) => {
    setEditTask(task);
    setShowTaskModal(true);
  };

  const handleTaskSave = async (formData) => {
    try {
      if (editTask) {
        const res = await api.put(`/tasks/${editTask._id}`, formData);
        setTasks(tasks.map(t => t._id === editTask._id ? res.data.task : t));
        toast.success('Task updated!');
      } else {
        const res = await api.post('/tasks', { ...formData, project: id });
        setTasks([res.data.task, ...tasks]);
        toast.success('Task created!');
      }
      setShowTaskModal(false);
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to save task');
    }
  };

  const handleDeleteTask = async (taskId) => {
    if (!window.confirm('Delete this task?')) return;
    try {
      await api.delete(`/tasks/${taskId}`);
      setTasks(tasks.filter(t => t._id !== taskId));
      toast.success('Task deleted');
    } catch { toast.error('Failed to delete task'); }
  };

  const handleStatusChange = async (taskId, newStatus) => {
    try {
      const res = await api.put(`/tasks/${taskId}`, { status: newStatus });
      setTasks(tasks.map(t => t._id === taskId ? res.data.task : t));
    } catch { toast.error('Failed to update status'); }
  };

  const filteredTasks = tasks.filter(task => {
    if (filterPriority && task.priority !== filterPriority) return false;
    if (filterAssignee && task.assignee?._id !== filterAssignee) return false;
    if (searchTerm && !task.title.toLowerCase().includes(searchTerm.toLowerCase())) return false;
    return true;
  });

  const getColumnTasks = (status) => filteredTasks.filter(t => t.status === status);

  if (loading) return <div className="loading-container"><div className="spinner"></div></div>;

  return (
    <div className="board-page" id="board-page">
      <div className="board-header">
        <div className="board-header-left">
          <button className="back-btn" onClick={() => navigate('/projects')}>← Back</button>
          <div className="project-badge" style={{ background: project?.color }}>
            {project?.title?.charAt(0)}
          </div>
          <div>
            <h1 className="board-title" id="project-title">{project?.title}</h1>
            <p className="board-subtitle">{project?.description}</p>
          </div>
        </div>
      </div>

      <div className="board-filters" id="board-filters">
        <input
          className="filter-input"
          id="search-tasks-input"
          placeholder="🔍 Search tasks..."
          value={searchTerm}
          onChange={e => setSearchTerm(e.target.value)}
        />
        <select className="filter-select" id="filter-priority" value={filterPriority} onChange={e => setFilterPriority(e.target.value)}>
          <option value="">All Priorities</option>
          <option value="low">Low</option>
          <option value="medium">Medium</option>
          <option value="high">High</option>
          <option value="critical">Critical</option>
        </select>
        <select className="filter-select" id="filter-assignee" value={filterAssignee} onChange={e => setFilterAssignee(e.target.value)}>
          <option value="">All Assignees</option>
          {users.map(u => <option key={u._id} value={u._id}>{u.name}</option>)}
        </select>
        {(filterPriority || filterAssignee || searchTerm) && (
          <button className="btn-secondary" onClick={() => { setFilterPriority(''); setFilterAssignee(''); setSearchTerm(''); }} id="clear-filters-btn">
            Clear Filters
          </button>
        )}
      </div>

      <div className="kanban-board" id="kanban-board">
        {COLUMNS.map(col => (
          <div key={col.key} className="kanban-column" id={`column-${col.key}`}>
            <div className="column-header">
              <div className="column-title-row">
                <span className="column-dot" style={{ background: col.color }}></span>
                <span className="column-label">{col.label}</span>
                <span className="column-count">{getColumnTasks(col.key).length}</span>
              </div>
              <button
                className="add-task-btn"
                onClick={() => openCreateTask(col.key)}
                id={`add-task-${col.key}`}
              >+</button>
            </div>

            <div className="column-tasks">
              {getColumnTasks(col.key).map(task => (
                <TaskCard
                  key={task._id}
                  task={task}
                  onEdit={() => openEditTask(task)}
                  onDelete={() => handleDeleteTask(task._id)}
                  onStatusChange={handleStatusChange}
                  columns={COLUMNS}
                  currentUser={user}
                />
              ))}
              {getColumnTasks(col.key).length === 0 && (
                <div className="empty-column" id={`empty-${col.key}`}>
                  <p>No tasks here</p>
                  <button className="add-task-link" onClick={() => openCreateTask(col.key)}>+ Add task</button>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>

      {showTaskModal && (
        <TaskModal
          task={editTask}
          defaultStatus={defaultStatus}
          users={users}
          onSave={handleTaskSave}
          onClose={() => setShowTaskModal(false)}
        />
      )}
    </div>
  );
};

export default ProjectBoard;
