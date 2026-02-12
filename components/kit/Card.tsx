import styles from './Card.module.css';

export default function Card({
    children,
    variant = 'default',
    hoverable = false,
    clickable = false,
    compact = false,
    onClick = undefined,
    className = '',
    ...props
}) {
    const classes = [
        styles.card,
        variant !== 'default' && styles[variant],
        hoverable && styles.hoverable,
        clickable && styles.clickable,
        compact && styles.compact,
        className
    ].filter(Boolean).join(' ');

    return (
        <div className={classes} onClick={onClick} {...props}>
            {children}
        </div>
    );
}

export function CardHeader({ icon = null, title = '', children = null, action = null }) {
    return (
        <div className={styles.cardHeader}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-3)', flex: 1 }}>
                {icon && <span className={styles.cardIcon}>{icon}</span>}
                <div>
                    {title && <h3 className={styles.cardTitle}>{title}</h3>}
                    {children}
                </div>
            </div>
            {action}
        </div>
    );
}

export function CardDescription({ children }) {
    return <p className={styles.cardDescription}>{children}</p>;
}

export function CardFooter({ children }) {
    return <div className={styles.cardFooter}>{children}</div>;
}
