import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const MAJORS = ['Computer Science', 'Mathematics', 'Physics', 'Business', 'English', 'Engineering', 'Biology', 'Chemistry', 'Psychology', 'Other'];
const YEARS = ['Freshman', 'Sophomore', 'Junior', 'Senior', 'Graduate'];

export default function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({ email: '', password: '' });

  const set = (k, v) => setForm(f => ({ ...f, [k]: v }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(''); setLoading(true);
    try {
      await login(form.email, form.password);
      navigate('/dashboard');
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="form-page">
      <div className="form-card">
        <h2>Welcome back</h2>
        <p className="subtitle">Sign in to manage your course registrations</p>
        {error && <div className="error-msg">{error}</div>}
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Email Address</label>
            <input type="email" placeholder="you@university.edu" value={form.email} onChange={e => set('email', e.target.value)} required />
          </div>
          <div className="form-group">
            <label>Password</label>
            <input type="password" placeholder="••••••••" value={form.password} onChange={e => set('password', e.target.value)} required />
          </div>
          <button type="submit" className="btn btn-primary" style={{ width: '100%', justifyContent: 'center' }} disabled={loading}>
            {loading ? 'Signing in...' : 'Sign In'}
          </button>
        </form>
        <div className="form-footer">
          Don't have an account? <Link to="/register">Create one</Link>
        </div>
      </div>
    </div>
  );
}

export function Register() {
  const { register } = useAuth();
  const navigate = useNavigate();
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [agreedToTerms, setAgreedToTerms] = useState(false);
  const [notifications, setNotifications] = useState({ email: true, sms: false, push: false });
  const [form, setForm] = useState({
    fullName: '', email: '', password: '', confirmPassword: '',
    studentId: '', major: '', year: ''
  });

  const set = (k, v) => setForm(f => ({ ...f, [k]: v }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    if (form.password !== form.confirmPassword) return setError('Passwords do not match');
    if (!agreedToTerms) return setError('Please agree to the terms and conditions');
    setLoading(true);
    try {
      await register({ fullName: form.fullName, email: form.email, password: form.password, studentId: form.studentId, major: form.major, year: form.year });
      navigate('/dashboard');
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="form-page" style={{ alignItems: 'flex-start', paddingTop: '2rem' }}>
      <div className="form-card" style={{ maxWidth: '560px' }}>
        <h2>Create your account</h2>
        <p className="subtitle">Join EduEnroll and start building your academic schedule</p>
        {error && <div className="error-msg">{error}</div>}
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Full Name</label>
            <input type="text" placeholder="Jane Smith" value={form.fullName} onChange={e => set('fullName', e.target.value)} required />
          </div>
          <div className="form-row">
            <div className="form-group">
              <label>Email Address</label>
              <input type="email" placeholder="you@university.edu" value={form.email} onChange={e => set('email', e.target.value)} required />
            </div>
            <div className="form-group">
              <label>Student ID</label>
              <input type="text" placeholder="e.g. STU-2024-001" value={form.studentId} onChange={e => set('studentId', e.target.value)} required />
            </div>
          </div>
          <div className="form-row">
            <div className="form-group">
              <label>Password</label>
              <input type="password" placeholder="••••••••" value={form.password} onChange={e => set('password', e.target.value)} required />
            </div>
            <div className="form-group">
              <label>Confirm Password</label>
              <input type="password" placeholder="••••••••" value={form.confirmPassword} onChange={e => set('confirmPassword', e.target.value)} required />
            </div>
          </div>

          <div className="form-group">
            <label>Major / Field of Study</label>
            <select value={form.major} onChange={e => set('major', e.target.value)} required>
              <option value="">Select your major</option>
              {MAJORS.map(m => <option key={m} value={m}>{m}</option>)}
            </select>
          </div>

          <div className="form-group">
            <label>Academic Year</label>
            <div className="radio-group">
              {YEARS.map(y => (
                <label key={y} className="radio-item">
                  <input type="radio" name="year" value={y} checked={form.year === y} onChange={() => set('year', y)} />
                  {y}
                </label>
              ))}
            </div>
          </div>

          <div className="form-group">
            <label>Notification Preferences</label>
            <div className="checkbox-group">
              {[
                { key: 'email', label: 'Email notifications for registration confirmations' },
                { key: 'sms', label: 'SMS alerts for schedule changes' },
                { key: 'push', label: 'Push notifications for deadlines' }
              ].map(({ key, label }) => (
                <label key={key} className="checkbox-item">
                  <input type="checkbox" checked={notifications[key]} onChange={e => setNotifications(n => ({ ...n, [key]: e.target.checked }))} />
                  {label}
                </label>
              ))}
            </div>
          </div>

          <div className="form-group">
            <label className="checkbox-item">
              <input type="checkbox" checked={agreedToTerms} onChange={e => setAgreedToTerms(e.target.checked)} />
              I agree to the Terms of Service and Academic Registration Policy
            </label>
          </div>

          <button type="submit" className="btn btn-primary" style={{ width: '100%', justifyContent: 'center' }} disabled={loading}>
            {loading ? 'Creating account...' : 'Create Account'}
          </button>
        </form>
        <div className="form-footer">
          Already have an account? <Link to="/login">Sign in</Link>
        </div>
      </div>
    </div>
  );
}
