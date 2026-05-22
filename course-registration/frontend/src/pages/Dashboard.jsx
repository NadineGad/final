import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { apiFetch } from '../utils/api';

export default function Dashboard() {
  const { user } = useAuth();
  const [registrations, setRegistrations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [dropping, setDropping] = useState(null);
  const [confirmDrop, setConfirmDrop] = useState(null);
  const [success, setSuccess] = useState('');

  useEffect(() => { fetchRegistrations(); }, []);

  const fetchRegistrations = async () => {
    try {
      const data = await apiFetch('/api/registrations/my');
      setRegistrations(data);
    } catch { } finally { setLoading(false); }
  };

  const handleDrop = async () => {
    setDropping(confirmDrop._id);
    try {
      await apiFetch(`/api/registrations/${confirmDrop._id}/drop`, { method: 'PATCH' });
      setRegistrations(rs => rs.filter(r => r._id !== confirmDrop._id));
      setSuccess(`Dropped ${confirmDrop.course.name} successfully.`);
      setConfirmDrop(null);
    } catch { } finally { setDropping(null); }
  };

  const totalCredits = registrations.reduce((sum, r) => sum + (r.course?.credits || 0), 0);

  return (
    <div className="page">
      <div className="page-header">
        <div>
          <h2>My Schedule</h2>
          <p>Welcome back, {user?.fullName} · {user?.major} · {user?.year}</p>
        </div>
        <Link to="/courses" className="btn btn-primary">+ Add Courses</Link>
      </div>

      {success && <div className="success-msg">{success}</div>}

      <div className="stats-row">
        <div className="stat-card">
          <div className="stat-number">{registrations.length}</div>
          <div className="stat-label">Courses Registered</div>
        </div>
        <div className="stat-card">
          <div className="stat-number">{totalCredits}</div>
          <div className="stat-label">Total Credits</div>
        </div>
        <div className="stat-card">
          <div className="stat-number">{user?.studentId}</div>
          <div className="stat-label">Student ID</div>
        </div>
        <div className="stat-card">
          <div className="stat-number">Fall '25</div>
          <div className="stat-label">Current Semester</div>
        </div>
      </div>

      {loading ? (
        <div className="loading">Loading your schedule...</div>
      ) : registrations.length === 0 ? (
        <div className="empty">
          <h3>No courses registered yet</h3>
          <p>Browse the catalogue and register for your courses</p>
          <Link to="/courses" className="btn btn-primary" style={{ marginTop: '1.5rem', display: 'inline-flex' }}>Browse Courses</Link>
        </div>
      ) : (
        <div>
          <h3 style={{ fontFamily: 'Playfair Display', fontSize: '1.3rem', marginBottom: '1rem' }}>Registered Courses</h3>
          {registrations.map(reg => (
            <div key={reg._id} className="reg-card">
              <div className="reg-info">
                <h4>{reg.course?.name}</h4>
                <p>{reg.course?.code} · {reg.course?.credits} credits · {reg.course?.instructor}</p>
                <p>{reg.course?.schedule?.days?.join(', ')} · {reg.course?.schedule?.time} · {reg.course?.schedule?.room}</p>
                {reg.notes && <p style={{ marginTop: '0.25rem', fontStyle: 'italic' }}>Note: {reg.notes}</p>}
              </div>
              <button className="btn btn-danger" onClick={() => setConfirmDrop(reg)} style={{ whiteSpace: 'nowrap' }}>
                Drop Course
              </button>
            </div>
          ))}
        </div>
      )}

      {confirmDrop && (
        <div className="modal-overlay">
          <div className="modal">
            <h3>Drop this course?</h3>
            <p>Are you sure you want to drop <strong>{confirmDrop.course?.name}</strong>? This action cannot be undone.</p>
            <div className="modal-actions">
              <button className="btn btn-ghost" onClick={() => setConfirmDrop(null)}>Cancel</button>
              <button className="btn btn-danger" onClick={handleDrop} disabled={dropping}>{dropping ? 'Dropping...' : 'Drop Course'}</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
