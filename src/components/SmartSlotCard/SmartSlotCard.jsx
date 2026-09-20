import { Zap, Clock, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import styles from './SmartSlotCard.module.css';

export default function SmartSlotCard({ salon, service, regularPrice, smartPrice, time, salonId }) {
  const savings = regularPrice - smartPrice;
  return (
    <div className={styles.card}>
      <div className={styles.saveBadge}><Zap size={11} />SAVE ₹{savings}</div>
      <div className={styles.salonName}>{salon}</div>
      <div className={styles.service}>{service}</div>
      <div className={styles.pricing}>
        <span className={styles.regular}>₹{regularPrice}</span>
        <span className={styles.smart}>₹{smartPrice}</span>
      </div>
      <div className={styles.timeRow}><Clock size={13} /><span>Today · {time}</span></div>
      <Link to={`/salon/${salonId}`} className={styles.cta}>Book slot <ArrowRight size={14} /></Link>
    </div>
  );
}
