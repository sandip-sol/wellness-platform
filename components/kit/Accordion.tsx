'use client';
import { useState } from 'react';
import styles from './Accordion.module.css';

export default function Accordion({ items = [], className = '' }) {
    const [openIndex, setOpenIndex] = useState(null);

    return (
        <div className={className}>
            {items.map((item, idx) => (
                <div
                    key={item.id || idx}
                    className={`${styles.accordionItem} ${openIndex === idx ? styles.open : ''}`}
                >
                    <button
                        className={styles.accordionTrigger}
                        onClick={() => setOpenIndex(openIndex === idx ? null : idx)}
                        aria-expanded={openIndex === idx}
                    >
                        <span>{item.title || item.question}</span>
                        <svg className={styles.accordionChevron} viewBox="0 0 20 20" fill="currentColor">
                            <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                        </svg>
                    </button>
                    <div className={styles.accordionContent}>
                        <div className={styles.accordionBody}>
                            {item.content || item.answer}
                        </div>
                    </div>
                </div>
            ))}
        </div>
    );
}
