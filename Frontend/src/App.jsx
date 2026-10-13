import { useState } from 'react';
import { Link, NavLink, Navigate, Route, Routes, useNavigate } from 'react-router-dom';
import { BookOpen, Bookmark, Compass, GraduationCap, LogOut, Menu, Settings2, Sparkles, UserRound, X, Scale } from 'lucide-react';
import { useAuth } from './context/AuthContext';
import { HomePage, AuthPage, UniversitiesPage, ShortlistPage, PreferencesPage, RecommendationsPage, NotFoundPage } from './pages/Pages';

function Protected({ children }) { const { user, loading } = useAuth(); if (loading) return <div className="loading-page">Preparing your AbroadMate workspace…</div>; return user ? children : <Navigate to="/login" replace />; }
function Shell({ children }) {
  const { user, logout } = useAuth();
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();
  const links = [
    ['/dashboard', Compass, 'Overview'],
    ['/universities', GraduationCap, 'Explore universities'],
    ['/shortlist', Bookmark, 'My shortlist'],
    ['/preferences', Settings2, 'Preferences'],
    ['/recommendations', Sparkles, 'Recommendations']
  ];
  async function signOut() {
    await logout();
    navigate('/');
  }

  return (
    <div className="app-shell">
      <aside className={`sidebar ${open ? 'sidebar-open' : ''}`}>
        <Link to="/dashboard" className="brand" onClick={() => setOpen(false)}>
          <span className="brand-mark"><GraduationCap size={23} /></span>
          <span>abroadmate<small>YOUR NEXT CHAPTER</small></span>
        </Link>
        <button className="mobile-close icon-button" onClick={() => setOpen(false)} aria-label="Close menu"><X /></button>
        <div className="nav-caption">YOUR JOURNEY</div>
        <nav>
          {links.map(([to, Icon, label]) => (
            <NavLink key={to} to={to} onClick={() => setOpen(false)} className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}>
              <Icon size={18} /><span>{label}</span>
            </NavLink>
          ))}
        </nav>
        <div className="sidebar-bottom">
          <div className="help-card">
            <span className="help-icon"><BookOpen size={18} /></span>
            <strong>One step at a time.</strong>
            <p>Your study-abroad journey starts with a shortlist.</p>
            <Link to="/universities">Explore schools <span>↗</span></Link>
          </div>
          <div className="user-mini">
            <div className="avatar">{user?.name?.slice(0, 1)?.toUpperCase() || 'S'}</div>
            <div className="user-mini-copy"><strong>{user?.name}</strong><span>{user?.email}</span></div>
            <button className="icon-button logout-button" onClick={signOut} title="Log out" aria-label="Log out">
              <LogOut size={17} /><span>Log out</span>
            </button>
          </div>
        </div>
      </aside>
      {open && <button className="mobile-overlay" onClick={() => setOpen(false)} aria-label="Close navigation" />}
      <main className="main-area">
        <header className="topbar">
          <button className="icon-button mobile-menu" onClick={() => setOpen(true)} aria-label="Open menu"><Menu /></button>
          <div className="breadcrumb">Workspace <span>/</span> <strong>Make it yours</strong></div>
          <div className="topbar-right">
            <span className="status-dot" /> Your future, in progress
            <div className="avatar avatar-small">{user?.name?.slice(0, 1)?.toUpperCase() || 'S'}</div>
            <button className="btn btn-outline topbar-logout" onClick={signOut}><LogOut size={15} /> Log out</button>
          </div>
        </header>
        <div className="page-content">{children}</div>
        <footer className="footer">
          <span>© {new Date().getFullYear()} AbroadMate</span>
          <span>Thoughtfully planning your next chapter.</span>
          <Link to="/privacy">Privacy & data</Link>
        </footer>
      </main>
    </div>
  );
}
export default function App() {
 const { user } = useAuth();
 return <Routes><Route path="/" element={<HomePage/>}/><Route path="/login" element={user ? <Navigate to="/dashboard" replace/> : <AuthPage mode="login"/>}/><Route path="/register" element={user ? <Navigate to="/dashboard" replace/> : <AuthPage mode="register"/>}/><Route path="/privacy" element={<div className="public-page"><Link className="brand" to="/"><span className="brand-mark"><GraduationCap/></span>abroadmate</Link><h1>Your data, treated with care.</h1><p>AbroadMate stores account details, preferences and saved universities to provide its planning features. Use a unique password. This starter project is not a substitute for a reviewed production privacy policy.</p><Link to="/">Back home</Link></div>}/><Route path="*" element={<Protected><Shell><Routes><Route path="/dashboard" element={<HomePage dashboard/>}/><Route path="/universities" element={<UniversitiesPage/>}/><Route path="/shortlist" element={<ShortlistPage/>}/><Route path="/preferences" element={<PreferencesPage/>}/><Route path="/recommendations" element={<RecommendationsPage/>}/><Route path="*" element={<NotFoundPage/>}/></Routes></Shell></Protected>}/></Routes>
}