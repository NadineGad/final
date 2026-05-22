import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => { logout(); navigate('/'); };

  return (
    <nav className="navbar">
      <Link to="/" className="navbar-brand">Edu<span>Enroll</span></Link>
      <div className="navbar-links">
        {user ? (
          <>
            <Link to="/courses">Browse Courses</Link>
            <Link to="/dashboard">My Schedule</Link>
            <span style={{ color: 'rgba(250,249,246,0.4)', fontSize: '0.8rem' }}>
              {user.fullName}
            </span>
            <button onClick={handleLogout}>Sign Out</button>
          </>
        ) : (
          <>
            <Link to="/courses">Browse Courses</Link>
            <Link to="/login">Sign In</Link>
            <Link to="/register" className="btn-nav">Register</Link>
          </>
        )}
      </div>
    </nav>
  );
}
