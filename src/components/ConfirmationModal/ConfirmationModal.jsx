import { AlertTriangle } from 'lucide-react';
import styles from './ConfirmationModal.module.css';

export default function ConfirmationModal({
  title,
  description,
  confirmLabel = 'Confirm',
  cancelLabel = 'Cancel',
  confirmVariant = 'danger',
  onConfirm,
  onCancel,
  icon,
  warning,
}) {
  return (
    <div className={styles.overlay} onClick={(e) => e.target === e.currentTarget && onCancel()}>
      <div className={styles.modal}>
        <div className={[styles.iconWrap, styles[confirmVariant]].join(' ')}>
          {icon || <AlertTriangle size={24} />}
        </div>
        <h2 className={styles.title}>{title}</h2>
        {description && <p className={styles.description}>{description}</p>}
        {warning && (
          <div className={styles.warning}>
            <AlertTriangle size={14} />{warning}
          </div>
        )}
        <div className={styles.actions}>
          <button className={styles.cancelBtn} onClick={onCancel}>{cancelLabel}</button>
          <button className={[styles.confirmBtn, styles[confirmVariant]].join(' ')} onClick={onConfirm}>
            {confirmLabel}
          </button>
        </div>
      </div>
    </div>
  );
}
