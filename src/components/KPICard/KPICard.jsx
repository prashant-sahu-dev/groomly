import styles from './KPICard.module.css';

export default function KPICard({ icon, label, value, change, changeType = 'neutral', color }) {
  return (
    <div className={styles.card}>
      <div className={styles.header}>
        <div className={styles.iconWrap} style={color ? { background: color + '20', color } : {}}>
          {icon}
        </div>
        {change && (
          <span className={[styles.change, styles[changeType]].join(' ')}>{change}</span>
        )}
      </div>
      <div className={styles.value}>{value}</div>
      <div className={styles.label}>{label}</div>
    </div>
  );
}
