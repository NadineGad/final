import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { apiFetch } from '../utils/api';
import { useNavigate } from 'react-router-dom';

const DEPARTMENTS = ['All', 'Computer Science', 'Mathematics', 'Physics', 'Business', 'English'];
const CATEGORIES = ['All', 'Core', 'Elective', 'General Education'];

function getBadgeClass(category) {
  if (category === 'Core') return 'badge badge-core';
  if (category === 'Elective') return 'badge badge-elective';
  return 'badge badge-general';
}

function CapacityBar({ enrolled, capacity }) {
  const pct = Math.min((enrolled / capacity) * 100, 100);
  const cls = pct >= 90 ? 'high' : pct >= 60 ? 'medium' : 'low';
  return (
    <div>
      <div className="capacity-bar"><div className={`capacity-fill ${cls}`} style={{ width: `${pct}%` }} /></div>
      <span style={{ fontSize: '0.75rem', color: 'var(--muted)' }}>{enrolled}/{capacity} enrolled</span>
    </div>
  );
}

export default function Courses() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [registering, setRegistering] = useState(null);
  const [registered, setRegistered] = useState(new Set());
  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');
  const [modal, setModal] = useState(null);
  const [filters, setFilters] = useState({ department: '', category: '', search: '' });

  useEffect(() => {
    fetchCourses();
    if (user) fetchMyRegistrations();
  }, [user]);

  const fetchCourses = async () => {
    try {
      const params = new URLSearchParams();
      if (filters.department) params.set('department', filters.department);
      if (filters.category) params.set('category', filters.category);
      if (filters.search) params.set('search', filters.search);
      const data = await apiFetch(`/api/courses?${params}`);
      setCourses(data);
    } catch { } finally { setLoading(false); }
  };

  const fetchMyRegistrations = async () => {
    try {
      const data = await apiFetch('/api/registrations/my');
      setRegistered(new Set(data.map(r => r.course._id)));
    } catch { }
  };

  useEffect(() => { fetchCourses(); }, [filters]);

  const handleRegister = async (notes) => {
    if (!user) return navigate('/login');
    setRegistering(modal._id);
    setError(''); setSuccess('');
    try {
      await apiFetch('/api/registrations', { method: 'POST', body: JSON.stringify({ courseId: modal._id, notes }) });
      setRegistered(prev => new Set([...prev, modal._id]));
      setSuccess(`Successfully registered for ${modal.name}!`);
      setCourses(cs => cs.map(c => c._id === modal._id ? { ...c, enrolled: c.enrolled + 1 } : c));
      setModal(null);
    } catch (err) { setError(err.message); } finally { setRegistering(null); }
  };

  return (
    <div className="page">
      <div className="page-header">
        <div>
          <h2>Course Catalogue</h2>
          <p>Fall 2025 — {courses.length} courses available</p>
        </div>
      </div>

      {success && <div className="success-msg">{success}</div>}
      {error && <div className="error-msg">{error}</div>}

      <div className="filters">
        <div className="filter-group" style={{ flex: 2 }}>
          <label>Search</label>
          <input placeholder="Search by course name, code, or instructor..." value={filters.search} onChange={e => setFilters(f => ({ ...f, search: e.target.value }))} />
        </div>
        <div className="filter-group">
          <label>Department</label>
          <select value={filters.department} onChange={e => setFilters(f => ({ ...f, department: e.target.value === 'All' ? '' : e.target.value }))}>
            {DEPARTMENTS.map(d => <option key={d} value={d === 'All' ? '' : d}>{d}</option>)}
          </select>
        </div>
        <div className="filter-group">
          <label>Category</label>
          <select value={filters.category} onChange={e => setFilters(f => ({ ...f, category: e.target.value === 'All' ? '' : e.target.value }))}>
            {CATEGORIES.map(c => <option key={c} value={c === 'All' ? '' : c}>{c}</option>)}
          </select>
        </div>
      </div>

      {loading ? (
        <div className="loading">Loading courses...</div>
      ) : courses.length === 0 ? (
        <div className="empty"><h3>No courses found</h3><p>Try adjusting your filters</p></div>
      ) : (
        <div className="course-grid">
          {courses.map(course => {
            const isFull = course.enrolled >= course.capacity;
            const isRegistered = registered.has(course._id);
            return (
              <div key={course._id} className="card course-card">
                <div className="course-card-header">
                  <span className="course-code">{course.code}</span>
                  <span className="course-credits">{course.credits} credits</span>
                </div>
                <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '0.5rem', flexWrap: 'wrap' }}>
                  <span className={getBadgeClass(course.category)}>{course.category}</span>
                  {isFull && <span className="badge badge-full">Full</span>}
                </div>
                <h3 className="course-name">{course.name}</h3>
                <p className="course-desc">{course.description}</p>
                <div className="course-meta">
                  <span>👤 {course.instructor}</span>
                  <span>📅 {course.schedule.days.join(', ')} · {course.schedule.time}</span>
                  <span>🏛️ {course.schedule.room} · {course.department}</span>
                  {course.prerequisites.length > 0 && <span>⚠️ Prerequisites: {course.prerequisites.join(', ')}</span>}
                </div>
                <CapacityBar enrolled={course.enrolled} capacity={course.capacity} />
                <div style={{ marginTop: '1rem' }}>
                  {isRegistered ? (
                    <button className="btn btn-ghost" style={{ width: '100%', justifyContent: 'center' }} disabled>✓ Registered</button>
                  ) : (
                    <button className="btn btn-primary" style={{ width: '100%', justifyContent: 'center' }} disabled={isFull || registering === course._id} onClick={() => setModal(course)}>
                      {isFull ? 'Course Full' : 'Register'}
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {modal && <RegisterModal course={modal} onClose={() => setModal(null)} onConfirm={handleRegister} loading={registering === modal._id} />}
    </div>
  );
}

function RegisterModal({ course, onClose, onConfirm, loading }) {
  const [notes, setNotes] = useState('');
  return (
    <div className="modal-overlay">
      <div className="modal">
        <h3>Register for {course.code}</h3>
        <p><strong>{course.name}</strong><br />{course.instructor} · {course.schedule.days.join(', ')}, {course.schedule.time}</p>
        <div className="form-group">
          <label>Notes (optional)</label>
          <textarea rows={3} placeholder="Any notes or special requests..." value={notes} onChange={e => setNotes(e.target.value)} />
        </div>
        <div className="modal-actions">
          <button className="btn btn-ghost" onClick={onClose}>Cancel</button>
          <button className="btn btn-primary" onClick={() => onConfirm(notes)} disabled={loading}>{loading ? 'Registering...' : 'Confirm Registration'}</button>
        </div>
      </div>
    </div>
  );
}
