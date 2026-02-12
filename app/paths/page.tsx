'use client';
import { useState } from 'react';
import pathsData from '@/data/paths.json';
import Card, { CardHeader, CardDescription, CardFooter } from '@/components/kit/Card';
import Badge from '@/components/kit/Badge';
import Button from '@/components/kit/Button';
import Tabs from '@/components/kit/Tabs';

function PathDetail({ path }) {
    const levels = Object.entries(path.levels);

    const tabs = levels.map(([key, level]: [string, any]) => ({
        id: key,
        label: `${key === 'beginner' ? '🌱' : key === 'intermediate' ? '🌿' : '🌳'} ${level.title}`,
        content: (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-4)' }}>
                {level.modules.map((mod, idx) => (
                    <Card key={mod.id} hoverable>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 'var(--space-4)' }}>
                            <div>
                                <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)', marginBottom: 'var(--space-2)' }}>
                                    <span style={{ fontFamily: 'var(--font-heading)', fontWeight: 700, fontSize: 'var(--font-size-sm)', color: 'var(--color-primary-dark)' }}>
                                        Module {idx + 1}
                                    </span>
                                    <Badge variant="category" label={mod.duration} />
                                </div>
                                <h4 style={{ marginBottom: 'var(--space-2)', fontSize: 'var(--font-size-base)' }}>{mod.title}</h4>
                                <p style={{ fontSize: 'var(--font-size-sm)', color: 'var(--color-ink-light)', lineHeight: 'var(--line-height-relaxed)' }}>
                                    {mod.summary}
                                </p>
                            </div>
                            <div style={{ width: '40px', height: '40px', borderRadius: '50%', background: 'var(--color-bg-alt)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, fontSize: 'var(--font-size-lg)' }}>
                                📖
                            </div>
                        </div>
                    </Card>
                ))}
            </div>
        ),
    }));

    return <Tabs tabs={tabs} />;
}

export default function PathsPage() {
    const [selectedPath, setSelectedPath] = useState(null);

    return (
        <div style={{ maxWidth: 'var(--max-width)', margin: '0 auto', padding: 'var(--space-12) var(--space-6)' }}>
            <div style={{ textAlign: 'center', marginBottom: 'var(--space-12)' }}>
                <h1 style={{ marginBottom: 'var(--space-3)' }}>Learning Paths</h1>
                <p style={{ color: 'var(--color-ink-light)', fontSize: 'var(--font-size-lg)', maxWidth: '600px', margin: '0 auto' }}>
                    Structured learning from beginner to advanced. Go at your own pace, completely privately.
                </p>
            </div>

            {!selectedPath ? (
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: 'var(--space-6)' }} className="stagger-children">
                    {pathsData.map(path => {
                        const totalModules = Object.values(path.levels).reduce((sum, l) => sum + l.modules.length, 0);
                        return (
                            <Card key={path.id} hoverable clickable onClick={() => setSelectedPath(path)}>
                                <CardHeader icon={path.icon} title={path.title} />
                                <CardDescription>{path.description}</CardDescription>
                                <CardFooter>
                                    <span style={{ fontSize: 'var(--font-size-xs)', color: 'var(--color-ink-muted)' }}>
                                        {totalModules} modules · 3 levels
                                    </span>
                                    <Badge variant="category" label="Start Learning →" />
                                </CardFooter>
                            </Card>
                        );
                    })}
                </div>
            ) : (
                <div>
                    <button
                        onClick={() => setSelectedPath(null)}
                        style={{ display: 'inline-flex', alignItems: 'center', gap: 'var(--space-2)', color: 'var(--color-ink-muted)', fontSize: 'var(--font-size-sm)', background: 'none', border: 'none', cursor: 'pointer', marginBottom: 'var(--space-6)' }}
                    >
                        ← Back to all paths
                    </button>

                    <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-4)', marginBottom: 'var(--space-8)' }}>
                        <span style={{ fontSize: '2.5rem' }}>{selectedPath.icon}</span>
                        <div>
                            <h2 style={{ marginBottom: 'var(--space-2)' }}>{selectedPath.title}</h2>
                            <p style={{ color: 'var(--color-ink-light)' }}>{selectedPath.description}</p>
                        </div>
                    </div>

                    <PathDetail path={selectedPath} />
                </div>
            )}
        </div>
    );
}
