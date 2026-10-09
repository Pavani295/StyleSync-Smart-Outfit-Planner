import React from 'react';
import { CheckCircle2, AlertTriangle, Info, XCircle, X } from 'lucide-react';

export const Toast = ({ toasts, onDismiss }) => {
  if (!toasts || toasts.length === 0) return null;

  return (
    <div className="toast-container" aria-live="polite">
      {toasts.map((toast) => {
        let Icon = Info;
        let toastClass = 'toast-info';

        if (toast.type === 'success') {
          Icon = CheckCircle2;
          toastClass = 'toast-success';
        } else if (toast.type === 'warning') {
          Icon = AlertTriangle;
          toastClass = 'toast-warning';
        } else if (toast.type === 'danger') {
          Icon = XCircle;
          toastClass = 'toast-danger';
        }

        return (
          <div key={toast.id} className={`toast-card ${toastClass}`}>
            <Icon className="toast-icon" size={20} />
            <div className="toast-message-content">
              {toast.title && <strong className="toast-title">{toast.title}</strong>}
              <p className="toast-body">{toast.message}</p>
            </div>
            <button
              onClick={() => onDismiss(toast.id)}
              className="toast-close-btn"
              aria-label="Dismiss toast"
            >
              <X size={16} />
            </button>
          </div>
        );
      })}
    </div>
  );
};

export default Toast;
