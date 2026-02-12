import styles from './Alert.module.css';

const ICONS = {
    info: 'ℹ️',
    warning: '⚠️',
    danger: '🚨',
    success: '✅',
    disclaimer: '📋',
};

export default function Alert({ variant = 'info', title = '', children, icon = '', className = '', ...props }) {
    const classes = [styles.alert, styles[variant], className].filter(Boolean).join(' ');

    return (
        <div className={classes} role="alert" {...props}>
            <span className={styles.alertIcon}>{icon || ICONS[variant]}</span>
            <div className={styles.alertContent}>
                {title && <div className={styles.alertTitle}>{title}</div>}
                {children}
            </div>
        </div>
    );
}
