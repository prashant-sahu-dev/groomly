import { useState } from 'react';
import { Calendar, Users, TrendingUp, Zap, Plus, Clock, ArrowRight, AlertTriangle } from 'lucide-react';
import KPICard from '../../../components/KPICard/KPICard';
import AppointmentStatusBadge from '../../../components/AppointmentStatusBadge/AppointmentStatusBadge';
import AddWalkInModal from '../../../components/AddWalkInModal/AddWalkInModal';
import { useApp } from '../../../context/AppContext';
import styles from './Dashboard.module.css';

const fmt12 = (t) => { if(!t) return ''; const [h,m]=t.split(':').map(Number); const p=h>=12?'PM':'AM'; const hr=h>12?h-12:h===0?12:h; return `${hr}:${m.toString().padStart(2,'0')} ${p}`; };

export default function Dashboard() {
  const { ownerAppointments, walkinCount, onlineCount, todayRevenue, updateAppointmentStatus } = useApp();
  const [showWalkIn, setShowWalkIn] = useState(false);
  const [noShowConfirm, setNoShowConfirm] = useState(null);

  const todayApts = ownerAppointments.filter(a => a.date === new Date().toISOString().split('T')[0]);
  const totalToday = todayApts.length;

  const handleStatus = (aptId, status) => {
    updateAppointmentStatus(aptId, status);
  };

  const getHour = () => new Date().getHours();
  const greeting = getHour() < 12 ? 'Good morning' : getHour() < 17 ? 'Good afternoon' : 'Good evening';

  return (
    <div className={styles.page}>
      {/* Header */}
      <div className={styles.header}>
        <div>
          <h1 className={styles.greeting}>{greeting}, Rahul 👋</h1>
          <p className={styles.subGreeting}>Here's what's happening at your salon today.</p>
        </div>
        <button className={styles.walkInBtn} onClick={() => setShowWalkIn(true)}>
          <Plus size={18}/> Add Walk-in
        </button>
      </div>

      {/* KPIs */}
      <div className={styles.kpiGrid}>
        <KPICard
          icon={<Calendar size={20}/>}
          label="Today's appointments"
          value={totalToday}
          change="+3 vs yesterday"
          changeType="up"
          color="#6C47FF"
        />
        <KPICard
          icon={<Zap size={20}/>}
          label="Online bookings"
          value={onlineCount}
          change="via GROOMLY"
          changeType="neutral"
          color="#6C47FF"
        />
        <KPICard
          icon={<Users size={20}/>}
          label="Walk-ins today"
          value={walkinCount}
          change="+1 this hour"
          changeType="up"
          color="#16A34A"
        />
        <KPICard
          icon={<TrendingUp size={20}/>}
          label="Today's revenue"
          value={`₹${todayRevenue.toLocaleString('en-IN')}`}
          change="+12% vs last week"
          changeType="up"
          color="#D97706"
        />
      </div>

      {/* Today's Schedule */}
      <div className={styles.scheduleSection}>
        <div className={styles.sectionHeader}>
          <h2 className={styles.sectionTitle}>Today's schedule</h2>
          <a href="/owner/appointments" className={styles.viewAll}>View all <ArrowRight size={14}/></a>
        </div>

        <div className={styles.scheduleTable}>
          {todayApts.length === 0 ? (
            <div className={styles.emptySchedule}>
              <Calendar size={32}/>
              <p>No appointments today yet.</p>
            </div>
          ) : (
            todayApts.sort((a,b) => a.time.localeCompare(b.time)).map(apt => (
              <div key={apt.id} className={styles.scheduleRow}>
                <div className={styles.schedTime}>{fmt12(apt.time)}</div>
                <div className={styles.schedInfo}>
                  <div className={styles.schedCustomer}>{apt.customerName}</div>
                  <div className={styles.schedService}>{apt.serviceName} · {apt.staffName}</div>
                </div>
                <div className={styles.schedMeta}>
                  <span className={[styles.sourceBadge, apt.source === 'walk-in' ? styles.walkIn : styles.online].join(' ')}>
                    {apt.source === 'walk-in' ? '🚶 Walk-in' : '🌐 Online'}
                  </span>
                  <AppointmentStatusBadge status={apt.status}/>
                </div>
                {apt.status === 'confirmed' && (
                  <div className={styles.schedActions}>
                    <button className={styles.actionBtn} onClick={() => handleStatus(apt.id, 'arrived')}>Arrived</button>
                    <button className={[styles.actionBtn, styles.noShowBtn].join(' ')} onClick={() => setNoShowConfirm(apt.id)}>No-show</button>
                  </div>
                )}
                {apt.status === 'arrived' && (
                  <div className={styles.schedActions}>
                    <button className={[styles.actionBtn, styles.startBtn].join(' ')} onClick={() => handleStatus(apt.id, 'in-service')}>Start service</button>
                  </div>
                )}
                {apt.status === 'in-service' && (
                  <div className={styles.schedActions}>
                    <button className={[styles.actionBtn, styles.completeBtn].join(' ')} onClick={() => handleStatus(apt.id, 'completed')}>Complete</button>
                  </div>
                )}
                <div className={styles.schedPrice}>₹{apt.price}</div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Smart Slots mini widget */}
      <div className={styles.smartWidget}>
        <div className={styles.smartWidgetLeft}>
          <div className={styles.smartWidgetIcon}><Zap size={20}/></div>
          <div>
            <div className={styles.smartWidgetTitle}>Smart Slots are active</div>
            <div className={styles.smartWidgetSub}>23 bookings this week · ₹4,850 additional revenue</div>
          </div>
        </div>
        <a href="/owner/smart-slots" className={styles.smartWidgetLink}>Manage <ArrowRight size={14}/></a>
      </div>

      {/* No-show confirmation */}
      {noShowConfirm && (
        <div className={styles.overlay} onClick={() => setNoShowConfirm(null)}>
          <div className={styles.confirmModal} onClick={e => e.stopPropagation()}>
            <div className={styles.confirmIcon}><AlertTriangle size={28}/></div>
            <h3>Mark as no-show?</h3>
            <p>This customer did not arrive for their appointment.</p>
            <div className={styles.confirmWarning}>
              <AlertTriangle size={13}/>Customer has 1 recorded no-show.
            </div>
            <div className={styles.confirmActions}>
              <button className={styles.confirmCancel} onClick={() => setNoShowConfirm(null)}>Cancel</button>
              <button className={styles.confirmNoShow} onClick={() => { handleStatus(noShowConfirm, 'no-show'); setNoShowConfirm(null); }}>Mark No-show</button>
            </div>
          </div>
        </div>
      )}

      {showWalkIn && <AddWalkInModal onClose={() => setShowWalkIn(false)}/>}
    </div>
  );
}
