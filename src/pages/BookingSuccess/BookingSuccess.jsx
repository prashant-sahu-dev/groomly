import { useLocation, Link } from 'react-router-dom';
import { CheckCircle, Calendar, Clock, MapPin, Hash, Zap, ArrowRight } from 'lucide-react';
import styles from './BookingSuccess.module.css';

const fmt12 = (t) => {
  if (!t) return '';
  const [h, m] = t.split(':').map(Number);
  const p = h >= 12 ? 'PM' : 'AM';
  const hr = h > 12 ? h - 12 : h === 0 ? 12 : h;
  return `${hr}:${m.toString().padStart(2, '0')} ${p}`;
};

const fmtDate = (d) => {
  const date = new Date(d + 'T00:00:00');
  return date.toLocaleDateString('en-IN', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' });
};

export default function BookingSuccess() {
  const { state } = useLocation();
  const appointment = state?.appointment;
  const salon = state?.salon;

  if (!appointment) {
    return (
      <div className={styles.fallback}>
        <CheckCircle size={48} color="var(--success)" />
        <h2>Appointment Confirmed!</h2>
        <Link to="/bookings">View my bookings</Link>
      </div>
    );
  }

  const savings = appointment.isSmartSlot ? appointment.regularPrice - appointment.price : 0;

  return (
    <div className={styles.page}>
      <div className={styles.container}>
        <div className={styles.card}>

          {/* Success header */}
          <div className={styles.successHeader}>
            <div className={styles.checkCircle}>
              <CheckCircle size={40} strokeWidth={2} />
            </div>
            <h1 className={styles.title}>Appointment confirmed!</h1>
            <p className={styles.subtitle}>We've sent a confirmation to your phone. See you soon!</p>
          </div>

          {/* Booking ID */}
          <div className={styles.bookingId}>
            <Hash size={14} />
            Booking ID: <strong>{appointment.bookingId}</strong>
          </div>

          {/* Smart Slot savings */}
          {appointment.isSmartSlot && savings > 0 && (
            <div className={styles.savingsBanner}>
              <Zap size={18} />
              <div>
                <div className={styles.savingsTitle}>Smart Slot savings!</div>
                <div className={styles.savingsAmt}>You saved ₹{savings} on this booking</div>
              </div>
            </div>
          )}

          {/* Details */}
          <div className={styles.detailsCard}>
            {salon && (
              <div className={styles.salonRow}>
                <img src={salon.image} alt={salon.name} className={styles.salonImg} />
                <div>
                  <div className={styles.salonName}>{salon.name}</div>
                  <div className={styles.salonAddr}>{salon.address}</div>
                </div>
              </div>
            )}

            <div className={styles.details}>
              {[
                { icon: <Calendar size={16} />, label: 'Date', value: fmtDate(appointment.date) },
                { icon: <Clock size={16} />, label: 'Time', value: fmt12(appointment.time) },
                { icon: <MapPin size={16} />, label: 'Service', value: appointment.serviceName },
                { icon: <Clock size={16} />, label: 'Duration', value: `${appointment.duration} min` },
              ].map(row => (
                <div key={row.label} className={styles.detailRow}>
                  <span className={styles.detailIcon}>{row.icon}</span>
                  <span className={styles.detailLabel}>{row.label}</span>
                  <span className={styles.detailValue}>{row.value}</span>
                </div>
              ))}
              <div className={styles.priceRow}>
                <span className={styles.priceLabel}>Total paid</span>
                <div className={styles.priceRight}>
                  {appointment.isSmartSlot && (
                    <span className={styles.regularPrice}>₹{appointment.regularPrice}</span>
                  )}
                  <span className={styles.finalPrice}>₹{appointment.price}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className={styles.actions}>
            <Link to="/bookings" className={styles.primaryBtn}>
              View my bookings <ArrowRight size={16} />
            </Link>
            <Link to="/salons" className={styles.secondaryBtn}>
              Book another
            </Link>
          </div>

        </div>
      </div>
    </div>
  );
}
