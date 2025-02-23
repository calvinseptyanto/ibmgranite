import React, { useState, useCallback } from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';

const ObligationChart = ({ obligations }) => {
  const [activeIndex, setActiveIndex] = useState(null);

  // Process data for the chart
  const processData = useCallback(() => {
    // Create a map to count obligations per party
    const partyMap = new Map();
    
    obligations.forEach(item => {
      const party = item.party;
      const count = item.obligations.length;
      
      if (partyMap.has(party)) {
        partyMap.set(party, {
          count: partyMap.get(party).count + count,
          obligations: [...partyMap.get(party).obligations, ...item.obligations]
        });
      } else {
        partyMap.set(party, {
          count,
          obligations: [...item.obligations]
        });
      }
    });

    // Convert map to array format for Recharts
    return Array.from(partyMap, ([name, data]) => ({
      name,
      value: data.count,
      obligations: data.obligations
    }));
  }, [obligations]);

  // Generate colors based on number of parties
  const generateColors = (dataLength) => {
    const baseColors = [
      '#3498db', // blue
      '#e74c3c', // red
      '#2ecc71', // green
      '#f1c40f', // yellow
      '#9b59b6', // purple
      '#e67e22', // orange
    ];

    // If we have more parties than base colors, generate additional colors
    if (dataLength > baseColors.length) {
      // Add logic to generate more colors if needed
      return [...baseColors, ...Array(dataLength - baseColors.length).fill('#95a5a6')];
    }

    return baseColors;
  };

  const data = processData();
  const COLORS = generateColors(data.length);

  // Custom tooltip component
  const CustomTooltip = ({ active, payload }) => {
    if (active && payload && payload[0]) {
      const data = payload[0].payload;
      return (
        <div className="bg-white p-4 rounded-lg shadow-lg border">
          <h3 className="font-semibold text-gray-800 mb-2">{data.name}</h3>
          <p className="text-sm text-gray-600 mb-2">
            {data.value} obligation{data.value !== 1 ? 's' : ''}
          </p>
          <ul className="list-disc list-inside">
            {data.obligations.map((obligation, index) => (
              <li key={index} className="text-sm text-gray-600">
                {obligation}
              </li>
            ))}
          </ul>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="w-full h-[300px]">
      <ResponsiveContainer>
        <PieChart>
          <Pie
            data={data}
            cx="50%"
            cy="50%"
            innerRadius={60}
            outerRadius={80}
            fill="#8884d8"
            paddingAngle={5}
            dataKey="value"
          >
            {data.map((entry, index) => (
              <Cell 
                key={`cell-${index}`} 
                fill={COLORS[index % COLORS.length]}
              />
            ))}
          </Pie>
          <Tooltip content={<CustomTooltip />} />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
};

export default ObligationChart;