import { useEffect } from 'react';
import styles from '@/styles/Toast.module.css';

interface ToastProps {
  message: string;
  type: 'success' | 'error' | 'warning' | 'info';
  onClose: () => void;
  duration?: number;
}

export default function Toast({ message, type, onClose, duration = 3000 }: ToastProps) {
  useEffect(() => {
    const timer = setTimeout(() => {
      onClose();
    }, duration);

    return () => clearTimeout(timer);
  }, [duration, onClose]);

  return (
    <div className={`${styles.toast} ${styles[type]}`}>
      <div className={styles.icon}>
        {type === 'success' && <span>✓</span>}
        {type === 'error' && <span>✕</span>}
        {type === 'warning' && <span>!</span>}
        {type === 'info' && <span>i</span>}
      </div>
      <div className={styles.message}>{message}</div>
      <button className={styles.closeButton} onClick={onClose}>
        ×
      </button>
    </div>
  );
}