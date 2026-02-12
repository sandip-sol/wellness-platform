'use client';
import { useState } from 'react';
import styles from './Tabs.module.css';

export default function Tabs({ tabs = [], className = '' }) {
    const [activeTab, setActiveTab] = useState(0);

    return (
        <div className={className}>
            <div className={styles.tabList} role="tablist">
                {tabs.map((tab, idx) => (
                    <button
                        key={tab.id || idx}
                        role="tab"
                        className={`${styles.tab} ${activeTab === idx ? styles.tabActive : ''}`}
                        onClick={() => setActiveTab(idx)}
                        aria-selected={activeTab === idx}
                    >
                        {tab.label}
                    </button>
                ))}
            </div>
            <div className={styles.tabPanel} role="tabpanel">
                {tabs[activeTab]?.content}
            </div>
        </div>
    );
}
