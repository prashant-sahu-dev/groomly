import { Link } from 'react-router-dom';
import styles from './EmptyState.module.css';

export default function EmptyState({ icon, title, description, cta, ctaLink, onCta }) {
  return (
    <div className={styles.empty}>
      {icon && <div className={styles.icon}>{icon}</div>}
      <h3 className={styles.title}>{title}</h3>
      {description && <p className={styles.description}>{description}</p>}
      {cta && ctaLink && <Link to={ctaLink} className={styles.cta}>{cta}</Link>}
      {cta && onCta && <button className={styles.cta} onClick={onCta}>{cta}</button>}
    </div>
  );
}
