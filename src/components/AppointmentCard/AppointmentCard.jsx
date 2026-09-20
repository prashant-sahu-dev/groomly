import { useState } from 'react';
import { Calendar, Clock, RefreshCw, X } from 'lucide-react';
import AppointmentStatusBadge from '../AppointmentStatusBadge/AppointmentStatusBadge';
import ConfirmationModal from '../ConfirmationModal/ConfirmationModal';
import { useApp } from '../../context/AppContext';
import { useToast } from '../../context/ToastContext';
import styles from './AppointmentCard.module.css';

const AVAILABLE_TIMES = [
  '09:30','10:30','11:30','12:00','13:00','13:30',
  '14:30','15:30','16:30','17:00','17:30','18:00',
];

const fmt = (t) => {
  if (!t) return '';
  const [h, m] = t.split(':').map(Number);
  const p = h >= 12 ? 'PM' : 'AM';
  const hr = h > 12 ? h - 12 : h === 0 ? 12 : h;
  return `${hr}:${m.toString().padStart(2, '0')} ${p}`;
};

const fmtDate = (dateStr) => {
  const date = new Date(dateStr + 'T00:00:00');
  const today = new Date().toISOString().split('T')[0];
  const tomorrow = new Date(Date.now() + 86400000).toISOString().split('T')[0];
  if (dateStr === today) return 'Today';
  if (dateStr === tomorrow) return 'Tomorrow';
  return date.toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' });
};

export default function AppointmentCard({ appointment }) {
  const { cancelAppointment, rescheduleAppointment } = useApp();
  const { addToast } = useToast();
  const [showCancel, setShowCancel] = useState(false);
  const [showReschedule, setShowReschedule] = useState(false);
  const [newTime, setNewTime] = useState('');

  const isCancellable = appointment.status === 'confirmed';
  const isCompleted = appointment.status === 'completed';
  const isCancelled = appointment.status === 'cancelled';

  const handleCancel = () => {
    cancelAppointment(appointment.id);
    addToast('Appointment cancelled.', 'info');
    setShowCancel(false);
  };

  const handleReschedule = () => {
    if (!newTime) { addToast('Please select a time slot.', 'error'); return; }
    rescheduleAppointment(appointment.id, newTime, appointment.date);
    addToast('Appointment rescheduled successfully!', 'success');
    setShowReschedule(false);
    setNewTime('');
  };

  return (
    <>
      <div className={[styles.card, isCancelled ? styles.cancelled : '', isCompleted ? styles.completed : ''].join(' ')}>
        {appointment.isSmartSlot && !isCancelled && (
          <div className={styles.smartBanner}>
            ⚡ Smart Slot — You saved ₹{appointment.regularPrice - appointment.price}
          </div>
        )}
        <div className={styles.body}>
          <div className={styles.left}>
            <div className={styles.source}>{appointment.source === 'walk-in' ? '🚶 Walk-in' : '🌐 Online'}</div>
            <h3 className={styles.salonName}>{appointment.salonName}</h3>
            <p className={styles.service}>{appointment.serviceName}</p>
            <div className={styles.meta}>
              <span className={styles.metaItem}><Calendar size={13} />{fmtDate(appointment.date)}</span>
              <span className={styles.sep}>·</span>
              <span className={styles.metaItem}><Clock size={13} />{fmt(appointment.time)}</span>
            </div>
            <div className={styles.bottomRow}>
              <span className={styles.price}>₹{appointment.price}</span>
              <AppointmentStatusBadge status={appointment.status} />
            </div>
          </div>
          <div className={styles.right}>
            <span className={styles.bookingId}>{appointment.bookingId}</span>
          </div>
        </div>

        {isCancellable && (
          <div className={styles.actions}>
            <button className={styles.actionBtn} onClick={() => setShowReschedule(true)}>
              <RefreshCw size={14} /> Reschedule
            </button>
            <button className={[styles.actionBtn, styles.dangerBtn].join(' ')} onClick={() => setShowCancel(true)}>
              <X size={14} /> Cancel
            </button>
          </div>
        )}
      </div>

      {showCancel && (
        <ConfirmationModal
          title="Cancel this appointment?"
          description="You can cancel before your appointment time. The slot will become available again."
          confirmLabel="Cancel appointment"
          cancelLabel="Keep appointment"
          confirmVariant="danger"
          onConfirm={handleCancel}
          onCancel={() => setShowCancel(false)}
        />
      )}

      {showReschedule && (
        <div className={styles.rescheduleOverlay} onClick={(e) => e.target === e.currentTarget && setShowReschedule(false)}>
          <div className={styles.rescheduleModal}>
            <h3 className={styles.rescheduleTitle}>Reschedule Appointment</h3>
            <p className={styles.rescheduleDesc}>Select a new available time slot</p>
            <div className={styles.timeGrid}>
              {AVAILABLE_TIMES.map(t => (
                <button
                  key={t}
                  className={[styles.timeBtn, newTime === t ? styles.selected : ''].join(' ')}
                  onClick={() => setNewTime(t)}
                >
                  {fmt(t)}
                </button>
              ))}
            </div>
            <div className={styles.rescheduleActions}>
              <button className={styles.cancelBtn2} onClick={() => setShowReschedule(false)}>Cancel</button>
              <button className={styles.confirmBtn} onClick={handleReschedule}>Confirm Reschedule</button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
