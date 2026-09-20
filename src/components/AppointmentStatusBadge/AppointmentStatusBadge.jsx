import styles from './AppointmentStatusBadge.module.css';

const STATUS_CONFIG = {
  confirmed: { label: 'Confirmed', variant: 'confirmed' },
  arrived: { label: 'Arrived', variant: 'arrived' },
  'in-service': { label: 'In Service', variant: 'inService' },
  completed: { label: 'Completed', variant: 'completed' },
  cancelled: { label: 'Cancelled', variant: 'cancelled' },
  'no-show': { label: 'No-show', variant: 'noShow' },
  rescheduled: { label: 'Rescheduled', variant: 'rescheduled' },
};

export default function AppointmentStatusBadge({ status }) {
  const config = STATUS_CONFIG[status] || { label: status, variant: 'default' };
  return (
    <span className={[styles.badge, styles[config.variant]].join(' ')}>
      <span className={styles.dot} />
      {config.label}
    </span>
  );
}
