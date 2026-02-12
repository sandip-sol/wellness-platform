import styles from './Badge.module.css';

const LABELS = {
    moderated: '✓ Moderated',
    'expert-reviewed': '⭐ Expert Reviewed',
    'clinician-reviewed': '🏥 Clinician Reviewed',
    'therapist-reviewed': '🧠 Therapist Reviewed',
    updated: '🔄 Updated',
    pending: 'Pending',
    approved: 'Approved',
    rejected: 'Rejected',
    published: 'Published',
};

const VARIANT_MAP = {
    'expert-reviewed': 'expertReviewed',
    'clinician-reviewed': 'clinicianReviewed',
    'therapist-reviewed': 'expertReviewed',
};

export default function Badge({ variant = 'category', label = '', showDot = false, className = '' }) {
    const styleKey = VARIANT_MAP[variant] || variant;
    const displayLabel = label || LABELS[variant] || variant;

    const classes = [
        styles.badge,
        styles[styleKey] || styles.category,
        className
    ].filter(Boolean).join(' ');

    return (
        <span className={classes}>
            {showDot && <span className={styles.dot} />}
            {displayLabel}
        </span>
    );
}
