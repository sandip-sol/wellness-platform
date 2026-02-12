'use client';
import styles from './Input.module.css';

export function Input({
    label = '',
    name,
    type = 'text',
    placeholder = '',
    value,
    onChange,
    required = false,
    error = '',
    helperText = '',
    className = '',
    ...props
}) {
    return (
        <div className={`${styles.formGroup} ${error ? styles.error : ''} ${className}`}>
            {label && (
                <label htmlFor={name} className={styles.label}>
                    {label}
                    {required && <span className={styles.required}>*</span>}
                </label>
            )}
            <input
                id={name}
                name={name}
                type={type}
                placeholder={placeholder}
                value={value}
                onChange={onChange}
                required={required}
                className={styles.input}
                {...props}
            />
            {error && <span className={styles.errorText}>{error}</span>}
            {helperText && !error && <span className={styles.helperText}>{helperText}</span>}
        </div>
    );
}

export function Textarea({
    label = '',
    name,
    placeholder = '',
    value,
    onChange,
    required = false,
    error = '',
    helperText = '',
    maxLength = undefined,
    rows = 4,
    className = '',
    ...props
}) {
    const charCount = value?.length || 0;
    const charClass = maxLength
        ? charCount > maxLength * 0.9
            ? styles.charCountDanger
            : charCount > maxLength * 0.7
                ? styles.charCountWarn
                : ''
        : '';

    return (
        <div className={`${styles.formGroup} ${error ? styles.error : ''} ${className}`}>
            {label && (
                <label htmlFor={name} className={styles.label}>
                    {label}
                    {required && <span className={styles.required}>*</span>}
                </label>
            )}
            <textarea
                id={name}
                name={name}
                placeholder={placeholder}
                value={value}
                onChange={onChange}
                required={required}
                rows={rows}
                maxLength={maxLength}
                className={styles.textarea}
                {...props}
            />
            <div style={{ display: 'flex', justifyContent: 'space-between', gap: 'var(--space-2)' }}>
                <div>
                    {error && <span className={styles.errorText}>{error}</span>}
                    {helperText && !error && <span className={styles.helperText}>{helperText}</span>}
                </div>
                {maxLength && (
                    <span className={`${styles.charCount} ${charClass}`}>
                        {charCount}/{maxLength}
                    </span>
                )}
            </div>
        </div>
    );
}

export function Select({
    label = '',
    name,
    options = [],
    value,
    onChange,
    required = false,
    error = '',
    helperText = '',
    placeholder = 'Select an option',
    className = '',
    ...props
}) {
    return (
        <div className={`${styles.formGroup} ${error ? styles.error : ''} ${className}`}>
            {label && (
                <label htmlFor={name} className={styles.label}>
                    {label}
                    {required && <span className={styles.required}>*</span>}
                </label>
            )}
            <select
                id={name}
                name={name}
                value={value}
                onChange={onChange}
                required={required}
                className={styles.select}
                {...props}
            >
                <option value="">{placeholder}</option>
                {options.map(opt => (
                    <option key={opt.value} value={opt.value}>
                        {opt.label}
                    </option>
                ))}
            </select>
            {error && <span className={styles.errorText}>{error}</span>}
            {helperText && !error && <span className={styles.helperText}>{helperText}</span>}
        </div>
    );
}
