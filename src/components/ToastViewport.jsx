import PropTypes from 'prop-types';
import './ToastViewport.css';

const ToastViewport = ({ toasts, onDismiss }) => (
    <div className="toast-viewport" aria-live="polite" aria-atomic="true">
        {toasts.map((toast) => (
            <div
                key={toast.id}
                className={`toast-message toast-${toast.type}`}
                role="status"
            >
                <div className="toast-copy">
                    <strong>{toast.title}</strong>
                    {toast.message && <span>{toast.message}</span>}
                </div>
                <button
                    type="button"
                    className="toast-dismiss"
                    onClick={() => onDismiss(toast.id)}
                    aria-label="Dismiss notification"
                >
                    ×
                </button>
            </div>
        ))}
    </div>
);

ToastViewport.propTypes = {
    toasts: PropTypes.arrayOf(PropTypes.shape({
        id: PropTypes.number.isRequired,
        title: PropTypes.string.isRequired,
        message: PropTypes.string,
        type: PropTypes.oneOf(['info', 'success', 'warning', 'error']).isRequired,
    })).isRequired,
    onDismiss: PropTypes.func.isRequired,
};

export default ToastViewport;
