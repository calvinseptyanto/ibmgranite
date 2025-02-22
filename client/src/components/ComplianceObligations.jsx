import React, { useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";

const ComplianceObligations = ({ data }) => {
    const [hoveredSegment, setHoveredSegment] = useState(null);

    if (!data || Object.keys(data).length === 0) {
        return (
        <Card className="w-full border-2 border-blue-200">
            <CardHeader>
                <CardTitle className="text-2xl">Company Compliance Overview</CardTitle>
            </CardHeader>
            <CardContent>
                <div className="flex justify-center items-center h-64">
                    <p>No compliance data available</p>
                </div>
            </CardContent>
        </Card>
        );
    }

    // Fixed dimensions
    const size = 300;
    const strokeWidth = 40;
    const radius = (size / 2) - (strokeWidth / 2);
    const circumference = 2 * Math.PI * radius;

    // Colors for the segments - using Tailwind color values
    const colors = [
        '#3b82f6', // blue-500
        '#22c55e', // green-500
        '#f59e0b', // amber-500
        '#6366f1', // indigo-500
        '#ec4899'  // pink-500
    ];

    // Calculate total for percentages
    const total = Object.values(data).reduce((sum, value) => sum + value, 0);

    // Create segments with calculated offsets
    const segments = Object.entries(data).map(([name, value], index) => {
        const percent = (value / total) * 100;
        const offset = index === 0 ? 0 : 
        Object.values(data)
            .slice(0, index)
            .reduce((sum, val) => sum + (val / total) * 100, 0);

        return {
            name,
            value,
            percent,
            offset,
            color: colors[index % colors.length]
        };
    });

    return (
        <Card className="w-full border-2 border-blue-200">
            <CardHeader>
                <CardTitle className="text-2xl">
                    Company Compliance Overview
                </CardTitle>
            </CardHeader>
            <CardContent>
                <div className="flex flex-col items-center">
                    <div className="relative">
                        <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
                            <g transform={`rotate(-90 ${size/2} ${size/2})`}>
                            {segments.map((segment, i) => (
                                <circle
                                    key={i}
                                    cx={size/2}
                                    cy={size/2}
                                    r={radius}
                                    fill="none"
                                    stroke={segment.color}
                                    strokeWidth={strokeWidth}
                                    strokeDasharray={circumference}
                                    strokeDashoffset={circumference * (1 - segment.percent/100)}
                                    style={{
                                        transform: `rotate(${segment.offset * 3.6}deg)`,
                                        transformOrigin: 'center',
                                        opacity: hoveredSegment === null || hoveredSegment === i ? 1 : 0.6,
                                        cursor: 'pointer'
                                    }}
                                    onMouseEnter={() => setHoveredSegment(i)}
                                    onMouseLeave={() => setHoveredSegment(null)}
                                />
                            ))}
                            </g>
                        </svg>
                        {hoveredSegment !== null && (
                            <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-center">
                                <div className="text-gray-900 font-semibold">
                                    {segments[hoveredSegment].name}
                                </div>
                                <div className="text-lg font-bold text-gray-700">
                                    {segments[hoveredSegment].percent.toFixed(1)}%
                                </div>
                            </div>
                        )}
                    </div>
                
                    {/* Legend */}
                    <div className="w-full mt-8">
                        <div className="flex flex-wrap justify-center gap-4">
                            {segments.map((segment, i) => (
                                <div 
                                    key={i} 
                                    className="flex items-center px-4 py-2 bg-gray-100 rounded-full cursor-pointer hover:bg-gray-200"
                                    onMouseEnter={() => setHoveredSegment(i)}
                                    onMouseLeave={() => setHoveredSegment(null)}
                                >
                                    <div
                                        className="w-3 h-3 rounded-full"
                                        style={{ backgroundColor: segment.color }}
                                    />
                                    <span className="ml-2 text-sm font-medium text-gray-700">
                                        {segment.name}
                                    </span>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </CardContent>
        </Card>
    );
};

export default ComplianceObligations;