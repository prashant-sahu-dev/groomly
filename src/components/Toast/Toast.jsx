import { X, CheckCircle, AlertCircle, Info, AlertTriangle } from 'lucide-react';
import { useToast } from '../../context/ToastContext';
import styles from './Toast.module.css';

const icons = {
  success: <CheckCircle size={18} />,
  error: <AlertCircle size={18} />,
  warning: <AlertTriangle size={18} />,
  info: <Info size={18} />,
};

export default function ToastContainer() {
  const { toasts, removeToast } = useToast();
  return (
    <div className={styles.container}>
      {toasts.map(toast => (
        <div key={toast.id} className={[styles.toast, styles[toast.type]].join(' ')}>
          <span className={styles.icon}>{icons[toast.type] || icons.info}</span>
          <span className={styles.message}>{toast.message}</span>
          <button className={styles.close} onClick={() => removeToast(toast.id)} aria-label="Dismiss">
            <X size={14} />
          </button>
        </div>
      ))}
    </div>
  );
}
