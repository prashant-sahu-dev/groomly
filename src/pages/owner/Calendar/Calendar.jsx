import { useState } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import AppointmentStatusBadge from '../../../components/AppointmentStatusBadge/AppointmentStatusBadge';
import { useApp } from '../../../context/AppContext';
import styles from './Calendar.module.css';

const HOURS = ['09:00','10:00','11:00','12:00','13:00','14:00','15:00','16:00','17:00','18:00','19:00'];

const fmt12 = (t) => {
  if (!t) return '';
  const [h, m] = t.split(':').map(Number);
  const p = h >= 12 ? 'PM' : 'AM';
  const hr = h > 12 ? h - 12 : h === 0 ? 12 : h;
  return `${hr}:${m.toString().padStart(2, '0')} ${p}`;
};

export default function Calendar() {
  const { ownerAppointments } = useApp();
  const [viewMode, setViewMode] = useState('day');
  const [currentDate, setCurrentDate] = useState(new Date().toISOString().split('T')[0]);

  const dayApts = ownerAppointments.filter(a => a.date === currentDate && a.status !== 'cancelled');

  const prevDay = () => {
    const d = new Date(currentDate + 'T00:00:00');
    d.setDate(d.getDate() - 1);
    setCurrentDate(d.toISOString().split('T')[0]);
  };
  const nextDay = () => {
    const d = new Date(currentDate + 'T00:00:00');
    d.setDate(d.getDate() + 1);
    setCurrentDate(d.toISOString().split('T')[0]);
  };

  const isToday = currentDate === new Date().toISOString().split('T')[0];
  const displayDate = new Date(currentDate + 'T00:00:00').toLocaleDateString('en-IN', {
    weekday: 'long', day: 'numeric', month: 'long', year: 'numeric'
  });

  const getAptAtHour = (hour) => dayApts.find(a => a.time === hour || (a.time >= hour && a.time < (hour.split(':')[0] * 1 + 1).toString().padStart(2,'0') + ':00'));

  return (
    <div className={styles.page}>
      <div className={styles.header}>
        <div>
          <h1 className={styles.title}>Calendar</h1>
          <p className={styles.subtitle}>{dayApts.length} appointments on this day</p>
        </div>
        <div className={styles.viewToggle}>
          <button className={[styles.viewBtn, viewMode === 'day' ? styles.activeView : ''].join(' ')} onClick={() => setViewMode('day')}>Day</button>
          <button className={[styles.viewBtn, viewMode === 'list' ? styles.activeView : ''].join(' ')} onClick={() => setViewMode('list')}>List</button>
        </div>
      </div>

      {/* Date navigator */}
      <div className={styles.dateNav}>
        <button className={styles.navBtn} onClick={prevDay}><ChevronLeft size={18}/></button>
        <div className={styles.dateDisplay}>
          <span className={styles.dateText}>{displayDate}</span>
          {isToday && <span className={styles.todayBadge}>Today</span>}
        </div>
        <button className={styles.navBtn} onClick={nextDay}><ChevronRight size={18}/></button>
      </div>

      {viewMode === 'day' ? (
        /* Day view — timeline */
        <div className={styles.timeline}>
          {HOURS.map(hour => {
            const apt = getAptAtHour(hour);
            return (
              <div key={hour} className={styles.timeRow}>
                <div className={styles.timeLabel}>{fmt12(hour)}</div>
                <div className={styles.timeSlotLine}>
                  {apt ? (
                    <div className={[styles.aptBlock, styles[apt.source === 'walk-in' ? 'walkInBlock' : 'onlineBlock']].join(' ')}>
                      <div className={styles.aptBlockTop}>
                        <span className={styles.aptName}>{apt.customerName}</span>
                        <AppointmentStatusBadge status={apt.status} />
                      </div>
                      <div className={styles.aptService}>{apt.serviceName} · {apt.staffName}</div>
                      <div className={styles.aptPrice}>₹{apt.price}</div>
                    </div>
                  ) : (
                    <div className={styles.emptySlot} />
                  )}
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        /* List view */
        <div className={styles.listView}>
          {dayApts.length === 0 ? (
            <div className={styles.emptyList}>
              <p>No appointments on this day.</p>
            </div>
          ) : (
            dayApts.sort((a, b) => a.time.localeCompare(b.time)).map(apt => (
              <div key={apt.id} className={styles.listRow}>
                <div className={styles.listTime}>{fmt12(apt.time)}</div>
                <div className={styles.listInfo}>
                  <div className={styles.listCustomer}>{apt.customerName}</div>
                  <div className={styles.listService}>{apt.serviceName} · {apt.staffName}</div>
                </div>
                <AppointmentStatusBadge status={apt.status} />
                <div className={styles.listPrice}>₹{apt.price}</div>
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
}
