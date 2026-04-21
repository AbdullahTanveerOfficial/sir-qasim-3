import React, { useState } from 'react';
import '../pages/Auth.css';

const TaskModal = ({ task, defaultStatus, users, onSave, onClose }) => {
  const [form, setForm] = useState({
    title: task?.title || '',
    description: task?.description || '',
    status: task?.status || defaultStatus || 'todo',
    priority: task?.priority || 'medium',
    assignee: task?.assignee?._id || task?.assignee || '',
    dueDate: task?.dueDate ? new Date(task.dueDate).toISOString().split('T')[0] : '',
    tags: task?.tags?.join(', ') || '',
  });
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    await onSave({
      ...form,
      tags: form.tags ? form.tags.split(',').map(t => t.trim()).filter(Boolean) : [],
      assignee: form.assignee || null,
    });
    setSubmitting(false);
  };

  return (
    <div className="modal-overlay" id="task-modal">
      <div className="modal" style={{ maxWidth: '560px' }}>
        <div className="modal-header">
          <h2 className="modal-title">{task ? 'Edit Task' : 'New Task'}</h2>
          <button className="modal-close" onClick={onClose} id="close-task-modal">×</button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="form-label">Title *</label>
            <input
              id="task-title-input"
              className="form-input"
              value={form.title}
              onChange={e => setForm({ ...form, title: e.target.value })}
              placeholder="Enter task title"
              required
            />
          </div>

          <div className="form-group mt-3">
            <label className="form-label">Description</label>
            <textarea
              id="task-description-input"
              className="form-input form-textarea"
              value={form.description}
              onChange={e => setForm({ ...form, description: e.target.value })}
              placeholder="Optional description"
              rows={3}
            />
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginTop: '1rem' }}>
            <div className="form-group">
              <label className="form-label">Status</label>
              <select id="task-status-select" className="form-select" value={form.status} onChange={e => setForm({ ...form, status: e.target.value })}>
                <option value="todo">To Do</option>
                <option value="in-progress">In Progress</option>
                <option value="review">Review</option>
                <option value="done">Done</option>
              </select>
            </div>
            <div className="form-group">
              <label className="form-label">Priority</label>
              <select id="task-priority-select" className="form-select" value={form.priority} onChange={e => setForm({ ...form, priority: e.target.value })}>
                <option value="low">Low</option>
                <option value="medium">Medium</option>
                <option value="high">High</option>
                <option value="critical">Critical</option>
              </select>
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginTop: '1rem' }}>
            <div className="form-group">
              <label className="form-label">Assignee</label>
              <select id="task-assignee-select" className="form-select" value={form.assignee} onChange={e => setForm({ ...form, assignee: e.target.value })}>
                <option value="">Unassigned</option>
                {users.map(u => <option key={u._id} value={u._id}>{u.name}</option>)}
              </select>
            </div>
            <div className="form-group">
              <label className="form-label">Due Date</label>
              <input
                id="task-due-date-input"
                type="date"
                className="form-input"
                value={form.dueDate}
                onChange={e => setForm({ ...form, dueDate: e.target.value })}
              />
            </div>
          </div>

          <div className="form-group mt-3">
            <label className="form-label">Tags (comma-separated)</label>
            <input
              id="task-tags-input"
              className="form-input"
              value={form.tags}
              onChange={e => setForm({ ...form, tags: e.target.value })}
              placeholder="e.g. frontend, bug, urgent"
            />
          </div>

          <div className="modal-footer">
            <button type="button" className="btn-secondary" onClick={onClose}>Cancel</button>
            <button type="submit" className="btn-primary" id="task-submit-btn" disabled={submitting}>
              {submitting ? 'Saving...' : task ? 'Update Task' : 'Create Task'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default TaskModal;
