import { NavLink, Link, useLocation } from 'react-router-dom';
import { useState, useEffect } from 'react';
import {
  LayoutDashboard, Calendar, CalendarDays, Scissors,
  Users, UserCheck, Zap, BarChart2, Settings,
  Menu, X, ChevronRight
} from 'lucide-react';
import styles from './Sidebar.module.css';

const NAV_ITEMS = [
  { to: '/owner',                icon: LayoutDashboard, label: 'Dashboard',   end: true },
  { to: '/owner/appointments',   icon: Calendar,        label: 'Appointments'           },
  { to: '/owner/calendar',       icon: CalendarDays,    label: 'Calendar'               },
  { to: '/owner/services',       icon: Scissors,        label: 'Services'               },
  { to: '/owner/staff',          icon: Users,           label: 'Staff'                  },
  { to: '/owner/customers',      icon: UserCheck,       label: 'Customers'              },
  { to: '/owner/smart-slots',    icon: Zap,             label: 'Smart Slots', hot: true },
  { to: '/owner/analytics',      icon: BarChart2,       label: 'Analytics'              },
  { to: '/owner/settings',       icon: Settings,        label: 'Settings'               },
];

export default function Sidebar() {
  const [open, setOpen] = useState(false);
  const location = useLocation();

  // Close drawer on route change
  useEffect(() => { setOpen(false); }, [location.pathname]);

  // Prevent body scroll when drawer open
  useEffect(() => {
    document.body.style.overflow = open ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [open]);

  return (
    <>
      {/* ── Mobile top bar ── */}
      <header className={styles.topBar}>
        <button className={styles.menuBtn} onClick={() => setOpen(true)} aria-label="Open menu">
          <Menu size={20} />
        </button>
        <Link to="/owner" className={styles.topLogo}>
          <div className={styles.logoMark}>
            <Scissors size={14} strokeWidth={2.5} />
          </div>
          <span>GROOMLY</span>
          <span className={styles.ownerPill}>Owner</span>
        </Link>
        <div className={styles.topRight} />
      </header>

      {/* ── Backdrop ── */}
      {open && (
        <div
          className={styles.backdrop}
          onClick={() => setOpen(false)}
          aria-hidden="true"
        />
      )}

      {/* ── Sidebar drawer ── */}
      <aside className={`${styles.sidebar} ${open ? styles.sidebarOpen : ''}`}>
        {/* Drawer header */}
        <div className={styles.drawerHeader}>
          <div className={styles.drawerLogo}>
            <div className={styles.logoMark}>
              <Scissors size={16} strokeWidth={2.5} />
            </div>
            <div>
              <div className={styles.logoName}>GROOMLY</div>
              <div className={styles.logoSub}>Owner Dashboard</div>
            </div>
          </div>
          <button className={styles.closeBtn} onClick={() => setOpen(false)} aria-label="Close menu">
            <X size={20} />
          </button>
        </div>

        {/* Salon info */}
        <div className={styles.salonBlock}>
          <div className={styles.salonAvatar}>GR</div>
          <div>
            <div className={styles.salonName}>The Groom Room</div>
            <div className={styles.salonOpen}>
              <span className={styles.openDot} /> Open now
            </div>
          </div>
        </div>

        {/* Nav links */}
        <nav className={styles.nav}>
          {NAV_ITEMS.map(({ to, icon: Icon, label, end, hot }) => (
            <NavLink
              key={to}
              to={to}
              end={end}
              className={({ isActive }) =>
                `${styles.navLink} ${isActive ? styles.navLinkActive : ''}`
              }
            >
              <Icon size={17} className={styles.navIcon} />
              <span className={styles.navLabel}>{label}</span>
              {hot && <span className={styles.hotBadge}>HOT</span>}
              <ChevronRight size={13} className={styles.navChevron} />
            </NavLink>
          ))}
        </nav>

        {/* Footer */}
        <div className={styles.sidebarFooter}>
          <Link to="/" className={styles.backLink}>
            ← Switch to customer view
          </Link>
        </div>
      </aside>
    </>
  );
}
