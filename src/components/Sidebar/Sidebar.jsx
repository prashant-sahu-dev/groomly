import { NavLink, Link } from 'react-router-dom';
import { useState } from 'react';
import {
  LayoutDashboard, Calendar, CalendarDays, Scissors,
  Users, UserCheck, Zap, BarChart2, Settings,
  Menu, X, Scissors as Logo
} from 'lucide-react';
import styles from './Sidebar.module.css';

const NAV_ITEMS = [
  { to: '/owner', icon: <LayoutDashboard size={18} />, label: 'Dashboard', end: true },
  { to: '/owner/appointments', icon: <Calendar size={18} />, label: 'Appointments' },
  { to: '/owner/calendar', icon: <CalendarDays size={18} />, label: 'Calendar' },
  { to: '/owner/services', icon: <Scissors size={18} />, label: 'Services' },
  { to: '/owner/staff', icon: <Users size={18} />, label: 'Staff' },
  { to: '/owner/customers', icon: <UserCheck size={18} />, label: 'Customers' },
  { to: '/owner/smart-slots', icon: <Zap size={18} />, label: 'Smart Slots' },
  { to: '/owner/analytics', icon: <BarChart2 size={18} />, label: 'Analytics' },
  { to: '/owner/settings', icon: <Settings size={18} />, label: 'Settings' },
];

export default function Sidebar() {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <>
      {/* Mobile top bar */}
      <div className={styles.mobileBar}>
        <Link to="/owner" className={styles.mobileLogo}>
          <div className={styles.logoIcon}><Logo size={16} strokeWidth={2.5} /></div>
          <span>GROOMLY</span>
          <span className={styles.ownerTag}>Owner</span>
        </Link>
        <button className={styles.hamburger} onClick={() => setMobileOpen(!mobileOpen)}>
          {mobileOpen ? <X size={22} /> : <Menu size={22} />}
        </button>
      </div>

      {/* Overlay */}
      {mobileOpen && <div className={styles.overlay} onClick={() => setMobileOpen(false)} />}

      {/* Sidebar */}
      <aside className={[styles.sidebar, mobileOpen ? styles.open : ''].join(' ')}>
        <div className={styles.logo}>
          <div className={styles.logoIcon}><Logo size={18} strokeWidth={2.5} /></div>
          <div>
            <div className={styles.logoText}>GROOMLY</div>
            <div className={styles.logoSub}>Owner Dashboard</div>
          </div>
        </div>

        <div className={styles.salonInfo}>
          <div className={styles.salonAvatar}>GR</div>
          <div>
            <div className={styles.salonName}>The Groom Room</div>
            <div className={styles.salonStatus}>
              <span className={styles.dot} />Open now
            </div>
          </div>
        </div>

        <nav className={styles.nav}>
          {NAV_ITEMS.map(item => (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.end}
              className={({ isActive }) => [styles.navItem, isActive ? styles.active : ''].join(' ')}
              onClick={() => setMobileOpen(false)}
            >
              <span className={styles.navIcon}>{item.icon}</span>
              <span>{item.label}</span>
              {item.label === 'Smart Slots' && <span className={styles.hotBadge}>HOT</span>}
            </NavLink>
          ))}
        </nav>

        <div className={styles.footer}>
          <Link to="/" className={styles.customerLink}>← Customer view</Link>
        </div>
      </aside>
    </>
  );
}
