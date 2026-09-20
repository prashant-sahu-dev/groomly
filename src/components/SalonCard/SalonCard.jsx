import { Link } from 'react-router-dom';
import { Star, MapPin, Zap, Clock } from 'lucide-react';
import Badge from '../ui/Badge/Badge';
import styles from './SalonCard.module.css';

export default function SalonCard({ salon }) {
  const categoryVariant = salon.category === 'Men' ? 'men' : salon.category === 'Women' ? 'women' : 'unisex';
  return (
    <Link to={`/salon/${salon.id}`} className={styles.card}>
      <div className={styles.imageWrap}>
        <img src={salon.image} alt={salon.name} className={styles.image} loading="lazy" />
        <div className={styles.badges}>
          <Badge variant={categoryVariant} size="sm">{salon.category}</Badge>
          {salon.hasSmartSlots && (
            <Badge variant="smart" size="sm"><Zap size={10} /> Smart Slots</Badge>
          )}
        </div>
        <div className={[styles.openBadge, salon.isOpen ? styles.open : styles.closed].join(' ')}>
          {salon.isOpen ? 'Open' : 'Closed'}
        </div>
      </div>
      <div className={styles.body}>
        <div className={styles.topRow}>
          <h3 className={styles.name}>{salon.name}</h3>
          <div className={styles.rating}>
            <Star size={13} fill="#F59E0B" color="#F59E0B" />
            <span>{salon.rating}</span>
            <span className={styles.reviews}>({salon.reviewCount})</span>
          </div>
        </div>
        <div className={styles.location}>
          <MapPin size={13} />
          <span>{salon.area}, {salon.city}</span>
          <span className={styles.dot}>·</span>
          <span>{salon.distance}</span>
        </div>
        <div className={styles.footer}>
          <div className={styles.price}>
            <span className={styles.from}>from</span>
            <span className={styles.priceVal}>₹{salon.startingPrice}</span>
          </div>
          {salon.isOpen && (
            <div className={styles.hours}><Clock size={12} /><span>Until {salon.closeTime}</span></div>
          )}
        </div>
      </div>
    </Link>
  );
}
