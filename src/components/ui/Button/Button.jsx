import styles from './Button.module.css';

export default function Button({
  children,
  variant = 'primary',
  size = 'md',
  fullWidth = false,
  disabled = false,
  onClick,
  type = 'button',
  className = '',
  ...props
}) {
  return (
    <button
      type={type}
      disabled={disabled}
      onClick={onClick}
      className={[styles.btn, styles[variant], styles[size], fullWidth ? styles.fullWidth : '', className].join(' ')}
      {...props}
    >
      {children}
    </button>
  );
}
