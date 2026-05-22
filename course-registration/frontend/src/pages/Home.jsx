import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function Home() {
  const { user } = useAuth();

  return (
    <>
      <section className="hero">
        <h1>Register for <em>courses</em> that shape your future</h1>
        <p>Browse hundreds of courses, build your semester schedule, and manage your academic journey — all in one place.</p>
        <div className="hero-actions">
          {user ? (
            <>
              <Link to="/courses" className="btn btn-primary">Browse Courses</Link>
              <Link to="/dashboard" className="btn btn-outline">My Schedule</Link>
            </>
          ) : (
            <>
              <Link to="/register" className="btn btn-primary">Get Started</Link>
              <Link to="/courses" className="btn btn-outline">Browse Courses</Link>
            </>
          )}
        </div>
      </section>

      <div className="page">
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '1.5rem', marginTop: '1rem' }}>
          {[
            { icon: '📚', title: 'Diverse Catalogue', desc: 'Explore courses across Computer Science, Mathematics, Business, and more.' },
            { icon: '🗓️', title: 'Smart Scheduling', desc: 'See schedules, capacity, and prerequisites before you register.' },
            { icon: '🔔', title: 'Instant Confirmation', desc: 'Register and get instant confirmation. Drop anytime before the semester starts.' },
            { icon: '🎓', title: 'Track Your Progress', desc: 'View all your registered courses and total credits in one dashboard.' }
          ].map(f => (
            <div key={f.title} className="card" style={{ textAlign: 'center' }}>
              <div style={{ fontSize: '2rem', marginBottom: '0.75rem' }}>{f.icon}</div>
              <h3 style={{ fontSize: '1.1rem', marginBottom: '0.5rem' }}>{f.title}</h3>
              <p style={{ fontSize: '0.875rem', color: 'var(--muted)', lineHeight: 1.6 }}>{f.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </>
  );
}
