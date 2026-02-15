import { useMemo, useState } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";
import { format, parseISO } from "date-fns";

const EMOTION_COLORS = {
  euphoria: "#00FF66",
  tension: "#0066FF",
  frustration: "#FF0000",
  nostalgia: "#9C27B0",
  pride: "#FFD700",
  anxiety: "#FF6B00",
  disappointment: "#757575",
};

const EMOTION_LABELS = {
  euphoria: "Euphoria",
  tension: "Tension",
  frustration: "Frustration",
  nostalgia: "Nostalgia",
  pride: "Pride",
  anxiety: "Anxiety",
  disappointment: "Disappointment",
};

const CustomTooltip = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null;

  return (
    <div className="bg-ardito-surface border border-white/10 rounded-md p-3 shadow-lg">
      <p className="text-xs text-muted-foreground mb-2 font-mono">
        {format(parseISO(label), "HH:mm:ss")}
      </p>
      <div className="space-y-1">
        {payload.map((entry) => (
          <div key={entry.dataKey} className="flex items-center justify-between gap-4 text-sm">
            <div className="flex items-center gap-2">
              <span
                className="h-2 w-2 rounded-full"
                style={{ backgroundColor: entry.color }}
              />
              <span className="text-muted-foreground">{EMOTION_LABELS[entry.dataKey]}</span>
            </div>
            <span className="font-mono font-medium" style={{ color: entry.color }}>
              {entry.value?.toFixed(0)}%
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};

const EmotionChart = ({
  data = [],
  height = 300,
  showLegend = true,
  emotions = ["tension", "euphoria", "pride", "anxiety"],
}) => {
  const [hiddenLines, setHiddenLines] = useState(new Set());

  const chartData = useMemo(() => {
    return data.map((item) => ({
      ...item,
      time: item.timestamp,
    }));
  }, [data]);

  const toggleLine = (emotion) => {
    setHiddenLines((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(emotion)) {
        newSet.delete(emotion);
      } else {
        newSet.add(emotion);
      }
      return newSet;
    });
  };

  const formatXAxis = (timestamp) => {
    try {
      return format(parseISO(timestamp), "HH:mm");
    } catch {
      return "";
    }
  };

  return (
    <div className="w-full">
      <ResponsiveContainer width="100%" height={height}>
        <LineChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
          <XAxis
            dataKey="time"
            tickFormatter={formatXAxis}
            stroke="#666"
            tick={{ fill: "#999", fontSize: 11 }}
            axisLine={{ stroke: "rgba(255,255,255,0.1)" }}
          />
          <YAxis
            domain={[0, 100]}
            stroke="#666"
            tick={{ fill: "#999", fontSize: 11 }}
            axisLine={{ stroke: "rgba(255,255,255,0.1)" }}
            tickFormatter={(value) => `${value}`}
          />
          <Tooltip content={<CustomTooltip />} />
          
          {emotions.map((emotion) => (
            <Line
              key={emotion}
              type="monotone"
              dataKey={emotion}
              stroke={EMOTION_COLORS[emotion]}
              strokeWidth={2}
              dot={false}
              activeDot={{ r: 4, strokeWidth: 0 }}
              hide={hiddenLines.has(emotion)}
              animationDuration={500}
            />
          ))}
        </LineChart>
      </ResponsiveContainer>

      {showLegend && (
        <div className="flex flex-wrap justify-center gap-4 mt-4">
          {emotions.map((emotion) => (
            <button
              key={emotion}
              onClick={() => toggleLine(emotion)}
              className={`flex items-center gap-2 px-3 py-1.5 rounded-sm text-sm transition-all ${
                hiddenLines.has(emotion)
                  ? "opacity-40 line-through"
                  : "opacity-100"
              }`}
            >
              <span
                className="h-2 w-2 rounded-full"
                style={{ backgroundColor: EMOTION_COLORS[emotion] }}
              />
              <span className="text-muted-foreground">{EMOTION_LABELS[emotion]}</span>
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export default EmotionChart;
