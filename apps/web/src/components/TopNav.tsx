import { useState, useRef, useEffect, useCallback } from 'react';
import { useDescope, useUser } from '@descope/react-sdk';
import { NavLink, useNavigate } from 'react-router-dom';
import styles from '../App.module.css';

export default function TopNav() {
  const { logout } = useDescope();
  const { user } = useUser();
  const navigate = useNavigate();
  const userPicture: string | null = user?.picture ?? null;
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const menuItemRefs = useRef<(HTMLAnchorElement | null)[]>([]);

  const displayName = user?.name ?? 'Member';
  const initials = displayName.charAt(0).toUpperCase();

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setDropdownOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleDropdownKeyDown = useCallback((e: React.KeyboardEvent) => {
    if (!dropdownOpen) return;
    if (e.key === 'Escape') {
      setDropdownOpen(false);
    } else if (e.key === 'ArrowDown') {
      e.preventDefault();
      const idx = menuItemRefs.current.findIndex(el => el === document.activeElement);
      menuItemRefs.current[idx + 1]?.focus();
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      const idx = menuItemRefs.current.findIndex(el => el === document.activeElement);
      menuItemRefs.current[idx - 1]?.focus();
    }
  }, [dropdownOpen]);

  async function handleLogout() {
    await logout();
    navigate('/login', { replace: true });
  }

  return (
    <header className={styles.nav}>
      <div className={styles.navInner}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 24 }}>
          <button className={styles.iconBtn} aria-label="Open menu">
            <span className="material-symbols-outlined">menu</span>
          </button>
          <span className={styles.brand}>AmeriHealth Sanctuary</span>
        </div>

        <nav className={styles.navLinks} style={{ display: 'flex', gap: '2rem', alignItems: 'center' }}>
          {[
            { label: 'Dashboard', path: '/' },
            { label: 'Claims', path: '/claims', hasMenu: true },
            { label: 'Find Care', path: '/find-care' },
            { label: 'Benefits', path: '/benefits' },
            { label: 'Prescriptions', path: '/prescriptions' },
          ].map(({ label, path, hasMenu }) => (
            hasMenu ? (
              <div
                key={path}
                className="relative"
                ref={dropdownRef}
                onKeyDown={handleDropdownKeyDown}
              >
                <NavLink
                  to={path}
                  className={styles.navLink}
                  aria-haspopup="menu"
                  aria-expanded={dropdownOpen}
                  onClick={e => { e.preventDefault(); setDropdownOpen(o => !o); }}
                  style={({ isActive }) => isActive ? {
                    borderBottom: '4px solid #2563eb',
                    color: '#1e40af',
                    paddingBottom: '6px',
                    fontWeight: 'bold',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '4px',
                  } : {
                    display: 'flex',
                    alignItems: 'center',
                    gap: '4px',
                    paddingBottom: '8px',
                    cursor: 'pointer',
                  }}
                >
                  {label}
                  <span className="material-symbols-outlined text-sm" aria-hidden="true">
                    {dropdownOpen ? 'expand_less' : 'expand_more'}
                  </span>
                </NavLink>
                {dropdownOpen && (
                  <div
                    role="menu"
                    className="absolute top-full left-0 mt-1 w-48 bg-white border border-slate-200 rounded-lg shadow-lg flex flex-col py-2 z-50"
                  >
                    <NavLink
                      role="menuitem"
                      to="/claims"
                      ref={el => { menuItemRefs.current[0] = el; }}
                      className="px-4 py-2 hover:bg-slate-50 text-blue-800 text-base font-bold transition-colors"
                      onClick={() => setDropdownOpen(false)}
                    >
                      View Claims
                    </NavLink>
                    <NavLink
                      role="menuitem"
                      to="/claims/submit"
                      ref={el => { menuItemRefs.current[1] = el; }}
                      className="px-4 py-2 hover:bg-slate-50 text-blue-800 text-base font-bold transition-colors"
                      onClick={() => setDropdownOpen(false)}
                    >
                      Submit Claim
                    </NavLink>
                  </div>
                )}
              </div>
            ) : (
              <NavLink
                key={path}
                to={path}
                className={styles.navLink}
                style={({ isActive }) => isActive ? {
                  borderBottom: '4px solid #2563eb',
                  color: '#1e40af',
                  paddingBottom: '6px',
                  fontWeight: 'bold',
                } : {
                  paddingBottom: '10px',
                }}
              >
                {label}
              </NavLink>
            )
          ))}
        </nav>

        <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
          <button className={styles.conciergeBtn}>
            <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1" }}>smart_toy</span>
            Concierge
          </button>

          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <div
              className={styles.avatarWrap}
              title={displayName}
              style={{ background: '#003461', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
            >
              {userPicture ? (
                <img src={userPicture} alt={displayName} className={styles.avatar} />
              ) : (
                <span style={{ fontSize: 14, fontWeight: 700, color: '#fff' }}>{initials}</span>
              )}
            </div>

            <button
              onClick={handleLogout}
              className="flex items-center gap-1 bg-transparent border-none cursor-pointer text-slate-600 hover:text-primary text-sm font-semibold px-1.5 py-1 rounded transition-colors"
              style={{ fontFamily: 'Plus Jakarta Sans, sans-serif' }}
            >
              <span className="material-symbols-outlined" style={{ fontSize: 18 }}>logout</span>
              Sign out
            </button>
          </div>
        </div>
      </div>
    </header>
  );
}
