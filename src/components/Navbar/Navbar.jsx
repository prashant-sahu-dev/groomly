import { Link, NavLink, useLocation } from 'react-router-dom';
import { Scissors, Menu, X, Calendar, User, Zap } from 'lucide-react';
import { useState } from 'react';
import styles from './Navbar.module.css';

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const location = useLocation();
  if (location.pathname.startsWith('/owner')) return null;

  return (
    <header className={styles.header}>
      <nav className={styles.nav}>
        <Link to="/" className={styles.logo}>
          <div className={styles.logoIcon}><Scissors size={18} strokeWidth={2.5} /></div>
          <span className={styles.logoText}>GROOMLY</span>
        </Link>

        <div className={styles.links}>
          <NavLink to="/salons" className={({ isActive }) => [styles.link, isActive ? styles.active : ''].join(' ')}>
            Explore
          </NavLink>
          <NavLink to="/salons" className={styles.smartLink}>
            <Zap size={14} />Smart Slots
          </NavLink>
          <NavLink to="/bookings" className={({ isActive }) => [styles.link, isActive ? styles.active : ''].join(' ')}>
            <Calendar size={15} />My Bookings
          </NavLink>
        </div>

        <div className={styles.actions}>
          <Link to="/owner" className={styles.ownerLink}>For Salon Owners</Link>
          <Link to="/profile" className={styles.profileBtn}>
            <User size={16} />Rahul
          </Link>
        </div>

        <button className={styles.hamburger} onClick={() => setMenuOpen(!menuOpen)} aria-label="Menu">
          {menuOpen ? <X size={22} /> : <Menu size={22} />}
        </button>
      </nav>

      {menuOpen && (
        <div className={styles.mobileMenu}>
          <NavLink to="/salons" className={styles.mobileLink} onClick={() => setMenuOpen(false)}>Explore Salons</NavLink>
          <NavLink to="/salons" className={[styles.mobileLink, styles.mobileSmart].join(' ')} onClick={() => setMenuOpen(false)}>
            <Zap size={14} /> Smart Slots
          </NavLink>
          <NavLink to="/bookings" className={styles.mobileLink} onClick={() => setMenuOpen(false)}>My Bookings</NavLink>
          <NavLink to="/profile" className={styles.mobileLink} onClick={() => setMenuOpen(false)}>Profile</NavLink>
          <Link to="/owner" className={styles.mobileOwner} onClick={() => setMenuOpen(false)}>→ Salon Owner Dashboard</Link>
        </div>
      )}
    </header>
  );
}
