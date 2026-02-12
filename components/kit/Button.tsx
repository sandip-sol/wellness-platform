'use client';
import styles from './Button.module.css';
import Link from 'next/link';

export default function Button({
    children,
    variant = 'primary',
    size = 'md',
    href = '',
    loading = false,
    fullWidth = false,
    disabled = false,
    onClick = undefined,
    type = 'button' as 'button' | 'submit' | 'reset',
    className = '',
    ...props
}) {
    const classes = [
        styles.btn,
        styles[variant],
        size !== 'md' && styles[size],
        fullWidth && styles.fullWidth,
        loading && styles.loading,
        className
    ].filter(Boolean).join(' ');

    if (href) {
        return (
            <Link href={href} className={classes} {...props}>
                {children}
            </Link>
        );
    }

    return (
        <button
            type={type}
            className={classes}
            disabled={disabled || loading}
            onClick={onClick}
            {...props}
        >
            {loading && <span className={styles.spinner} />}
            {children}
        </button>
    );
}
