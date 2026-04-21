import React, { useState } from 'react';
import { toast } from 'react-toastify';
import { useAuth } from '../context/AuthContext';
import api from '../utils/api';
import './Auth.css';

const Profile = () => {
  const { user } = useAuth();
  const [name, setName] = useState(user?.name || '');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await api.put('/users/profile', { name });
      toast.success('Profile updated!');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Update failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ maxWidth: 500, margin: '2rem auto', padding: '0 1rem' }} id="profile-page">
      <h1 style={{ fontSize: '1.5rem', fontWeight: 700, marginBottom: '1.5rem', color: 'var(--gray-900)' }}>Profile Settings</h1>

      <div style={{ background: 'white', borderRadius: 'var(--radius-lg)', padding: '2rem', boxShadow: 'var(--shadow-sm)', border: '1px solid var(--gray-100)' }}>
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', marginBottom: '2rem' }}>
          <div style={{
            width: 80, height: 80, borderRadius: '50%',
            background: 'var(--primary)', color: 'white',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: '2rem', fontWeight: 700, marginBottom: '0.75rem'
          }} id="profile-avatar">
            {user?.name?.charAt(0).toUpperCase()}
          </div>
          <p style={{ color: 'var(--gray-500)', fontSize: '0.85rem' }}>{user?.email}</p>
          <span style={{
            marginTop: '0.5rem', fontSize: '0.75rem', fontWeight: 600,
            padding: '0.15rem 0.6rem', borderRadius: 20,
            background: user?.role === 'admin' ? '#ede9fe' : 'var(--gray-100)',
            color: user?.role === 'admin' ? 'var(--secondary)' : 'var(--gray-600)'
          }}>
            {user?.role}
          </span>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="form-label" htmlFor="profile-name">Full Name</label>
            <input
              id="profile-name"
              className="form-input"
              value={name}
              onChange={e => setName(e.target.value)}
              required
            />
          </div>
          <div className="form-group mt-3">
            <label className="form-label">Email</label>
            <input className="form-input" value={user?.email} disabled style={{ opacity: 0.6 }} />
          </div>
          <div className="form-group mt-3">
            <label className="form-label">Member Since</label>
            <input className="form-input" value={new Date(user?.createdAt).toLocaleDateString()} disabled style={{ opacity: 0.6 }} />
          </div>
          <button type="submit" className="btn-primary btn-full mt-4" id="save-profile-btn" disabled={loading} style={{ marginTop: '1.5rem' }}>
            {loading ? 'Saving...' : 'Save Changes'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default Profile;
