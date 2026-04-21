import React, { useState } from 'react';
import './TaskCard.css';

const PRIORITY_CONFIG = {
  low:      { label: 'Low',      color: '#10b981', bg: '#d1fae5' },
  medium:   { label: 'Medium',   color: '#f59e0b', bg: '#fef3c7' },
  high:     { label: 'High',     color: '#ef4444', bg: '#fee2e2' },
  critical: { label: 'Critical', color: '#7c3aed', bg: '#ede9fe' },
};

const TaskCard = ({ task, onEdit, onDelete, onStatusChange, columns, currentUser }) => {
  const [showMenu, setShowMenu] = useState(false);
  const priority = PRIORITY_CONFIG[task.priority] || PRIORITY_CONFIG.medium;

  const isOverdue = task.dueDate && new Date(task.dueDate) < new Date() && task.status !== 'done';

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  };

  const canDelete = task.createdBy?._id === currentUser?._id || task.createdBy === currentUser?._id;

  return (
    <div className={`task-card ${isOverdue ? 'overdue' : ''}`} id={`task-card-${task._id}`}>
      <div className="task-card-header">
        <div className="priority-badge" style={{ color: priority.color, background: priority.bg }}>
          {priority.label}
        </div>
        <div className="task-card-menu">
          <button className="menu-trigger" onClick={() => setShowMenu(!showMenu)} id={`task-menu-${task._id}`}>⋮</button>
          {showMenu && (
            <div className="task-menu-dropdown">
              <button className="menu-item" onClick={() => { onEdit(); setShowMenu(false); }} id={`edit-task-${task._id}`}>✏️ Edit</button>
              {columns.filter(c => c.key !== task.status).map(col => (
                <button key={col.key} className="menu-item" onClick={() => { onStatusChange(task._id, col.key); setShowMenu(false); }}>
                  → Move to {col.label}
                </button>
              ))}
              {canDelete && (
                <button className="menu-item danger" onClick={() => { onDelete(); setShowMenu(false); }} id={`delete-task-${task._id}`}>🗑️ Delete</button>
              )}
            </div>
          )}
        </div>
      </div>

      <h4 className="task-card-title" onClick={onEdit}>{task.title}</h4>

      {task.description && (
        <p className="task-card-desc">{task.description}</p>
      )}

      {task.tags?.length > 0 && (
        <div className="task-tags">
          {task.tags.slice(0, 3).map((tag, i) => (
            <span key={i} className="task-tag">{tag}</span>
          ))}
        </div>
      )}

      <div className="task-card-footer">
        <div className="task-footer-left">
          {task.assignee && (
            <div className="assignee-avatar" title={task.assignee.name}>
              {task.assignee.name?.charAt(0).toUpperCase()}
            </div>
          )}
          {task.comments?.length > 0 && (
            <span className="comment-count">💬 {task.comments.length}</span>
          )}
        </div>
        {task.dueDate && (
          <span className={`due-date ${isOverdue ? 'overdue-text' : ''}`}>
            📅 {formatDate(task.dueDate)}
          </span>
        )}
      </div>
    </div>
  );
};

export default TaskCard;
