'use client';

import React from 'react';

type DoodleVariant = 'star' | 'heart' | 'spiral' | 'leaf' | 'sparkle' | 'zigzag' | 'circle';

interface DoodleProps {
    variant?: DoodleVariant;
    color?: string;
    size?: number;
    className?: string;
    style?: React.CSSProperties;
}

export default function Doodle({
    variant = 'star',
    color = 'currentColor',
    size = 24,
    className = '',
    style = {}
}: DoodleProps) {
    const paths = {
        star: "M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z",
        heart: "M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z",
        spiral: "M12.5 2C6.5 2 2 6.5 2 12s4.5 10 10 10c2.5 0 4.5-2 4.5-4.5S14.5 13 12 13c-1.5 0-2.5 1-2.5 2.5S10.5 18 12 18",
        leaf: "M17 3c0 0-4 3-7 8S5 21 5 21s6-3 9-8 3-10 3-10z M10 14c-1 2-2 3-2 3",
        sparkle: "M12 2L14.5 9.5 22 12 14.5 14.5 12 22 9.5 14.5 2 12 9.5 9.5z",
        zigzag: "M2 12l4-8 6 16 6-16 4 8",
        circle: "M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8z"
    };

    // Simple hand-drawn style stroke adjustments
    const strokeProps = {
        strokeLinecap: "round" as const,
        strokeLinejoin: "round" as const,
        strokeWidth: 2,
        fill: variant === 'star' || variant === 'heart' ? color : 'none',
        stroke: color
    };

    if (variant === 'star' || variant === 'heart' || variant === 'sparkle') {
        // Filled shapes often look better with just fill, or fill + stroke
        strokeProps.fill = color;
        strokeProps.stroke = color;
    } else {
        // Line shapes
        strokeProps.fill = 'none';
        strokeProps.stroke = color;
    }

    return (
        <svg
            width={size}
            height={size}
            viewBox="0 0 24 24"
            className={`doodle doodle-${variant} ${className}`}
            style={style}
            xmlns="http://www.w3.org/2000/svg"
        >
            <path d={paths[variant]} {...strokeProps} />
        </svg>
    );
}
