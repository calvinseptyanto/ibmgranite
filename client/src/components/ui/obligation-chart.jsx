import React, { useState, useCallback } from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts';

const ObligationChart = ({ obligations }) => {
  const [activeIndex, setActiveIndex] = useState(null);

  const processData = useCallback(() => {
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

    return Array.from(partyMap, ([name, data]) => ({
      name,
      value: data.count,
      obligations: data.obligations,
      percentage: 0
    }));
  }, [obligations]);

  const data = processData();
  const total = data.reduce((sum, item) => sum + item.value, 0);
  data.forEach(item => {
    item.percentage = Math.round((item.value / total) * 100);
  });

  const COLORS = {
    'Company A': '#3498db',
    'Company B': '#e74c3c',
    'Both': '#2ecc71',
    'Default': '#95a5a6'
  };

  const CustomTooltip = ({ active, payload }) => {
    if (active && payload && payload[0]) {
      const data = payload[0].payload;
      return (
        <div className="bg-white p-3 rounded-lg shadow-lg border text-xs">
          <h3 className="font-semibold text-gray-800 mb-1">{data.name}</h3>
          <p className="text-gray-600 mb-1">
            {data.percentage}% ({data.value} obligations)
          </p>
          <ul className="list-disc list-inside">
            {data.obligations.map((obligation, index) => (
              <li key={index} className="text-gray-600">
                {obligation}
              </li>
            ))}
          </ul>
        </div>
      );
    }
    return null;
  };

  const CustomLegend = ({ payload }) => {
    return (
      <ul className="flex flex-wrap justify-center gap-2 text-xs">
        {payload.map((entry, index) => (
          <li key={index} className="flex items-center gap-1">
            <div 
              className="w-2 h-2 rounded-full" 
              style={{ backgroundColor: entry.color }}
            />
            <span className="text-gray-600">
              {entry.value} ({data.find(d => d.name === entry.value)?.percentage}%)
            </span>
          </li>
        ))}
      </ul>
    );
  };

  return (
    <div className="w-full h-full flex flex-col">
      <div className="flex-1 min-h-0"> {/* This ensures the chart container doesn't overflow */}
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={data}
              cx="50%"
              cy="45%"
              innerRadius={40}
              outerRadius={55}
              fill="#8884d8"
              paddingAngle={5}
              dataKey="value"
              labelLine={false}
              label={({ cx, cy, midAngle, innerRadius, outerRadius, value, name }) => {
                const RADIAN = Math.PI / 180;
                const radius = 15 + innerRadius + (outerRadius - innerRadius);
                const x = cx + radius * Math.cos(-midAngle * RADIAN);
                const y = cy + radius * Math.sin(-midAngle * RADIAN);

                return (
                  <text
                    x={x}
                    y={y}
                    fill="#374151"
                    textAnchor={x > cx ? 'start' : 'end'}
                    dominantBaseline="central"
                    className="text-[10px]"
                  >
                    {name}
                  </text>
                );
              }}
            >
              {data.map((entry, index) => (
                <Cell 
                  key={`cell-${index}`} 
                  fill={COLORS[entry.name] || COLORS.Default}
                />
              ))}
            </Pie>
            <Tooltip content={<CustomTooltip />} />
            <Legend 
              content={<CustomLegend />}
              verticalAlign="bottom"
              align="center"
            />
          </PieChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default ObligationChart;