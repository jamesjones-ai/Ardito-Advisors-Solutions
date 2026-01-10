import { useState, useEffect } from "react";
import { api } from "@/lib/api";
import { toast } from "sonner";
import {
  TrendingUp,
  TrendingDown,
  Download,
  Calendar,
  Target,
  Zap,
  DollarSign,
  BarChart3,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import MetricCard from "@/components/dashboard/MetricCard";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
} from "recharts";

const EMOTION_COLORS = {
  euphoria: "#00FF66",
  tension: "#0066FF",
  frustration: "#FF0000",
  pride: "#FFD700",
  anxiety: "#FF6B00",
  nostalgia: "#9C27B0",
  disappointment: "#757575",
};

const generateMockTrendData = () => {
  const data = [];
  for (let i = 29; i >= 0; i--) {
    const date = new Date();
    date.setDate(date.getDate() - i);
    data.push({
      date: date.toLocaleDateString("en-US", { month: "short", day: "numeric" }),
      impressions: Math.floor(Math.random() * 500000) + 100000,
      engagements: Math.floor(Math.random() * 150000) + 30000,
      activations: Math.floor(Math.random() * 50) + 10,
    });
  }
  return data;
};

const generateEmotionROI = () => [
  { emotion: "Euphoria", roi: 9.2, color: EMOTION_COLORS.euphoria },
  { emotion: "Tension", roi: 8.5, color: EMOTION_COLORS.tension },
  { emotion: "Pride", roi: 7.8, color: EMOTION_COLORS.pride },
  { emotion: "Anxiety", roi: 6.2, color: EMOTION_COLORS.anxiety },
  { emotion: "Frustration", roi: 4.5, color: EMOTION_COLORS.frustration },
  { emotion: "Nostalgia", roi: 3.8, color: EMOTION_COLORS.nostalgia },
];

const AnalyticsPage = () => {
  const [loading, setLoading] = useState(true);
  const [metrics, setMetrics] = useState(null);
  const [dateRange, setDateRange] = useState("30d");
  const [trendData, setTrendData] = useState([]);
  const [emotionROI, setEmotionROI] = useState([]);
  const [emotionDist, setEmotionDist] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [metricsRes, emotionsRes] = await Promise.all([
          api.get("/analytics/dashboard"),
          api.get("/analytics/emotions"),
        ]);
        setMetrics(metricsRes.data);
        
        // Transform emotion distribution
        const dist = Object.entries(emotionsRes.data).map(([name, value]) => ({
          name,
          value,
          color: EMOTION_COLORS[name] || "#666",
        }));
        setEmotionDist(dist);
        
        // Mock data for trends and ROI
        setTrendData(generateMockTrendData());
        setEmotionROI(generateEmotionROI());
      } catch (error) {
        console.error("Analytics fetch error:", error);
        toast.error("Failed to load analytics");
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [dateRange]);

  const budgetData = [
    { name: "Spent", value: 65, color: "#00FF66" },
    { name: "Committed", value: 20, color: "#FFD700" },
    { name: "Available", value: 15, color: "#666" },
  ];

  return (
    <div className="space-y-6" data-testid="analytics-page">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="font-heading text-2xl font-bold">Analytics Overview</h1>
          <p className="text-muted-foreground text-sm">
            Sponsor-wide insights across all campaigns
          </p>
        </div>
        <div className="flex gap-3">
          <Select value={dateRange} onValueChange={setDateRange}>
            <SelectTrigger className="w-40 bg-ardito-surface border-white/10">
              <SelectValue />
            </SelectTrigger>
            <SelectContent className="bg-ardito-surface border-white/10">
              <SelectItem value="7d">Last 7 Days</SelectItem>
              <SelectItem value="30d">Last 30 Days</SelectItem>
              <SelectItem value="90d">Last 90 Days</SelectItem>
              <SelectItem value="all">All Time</SelectItem>
            </SelectContent>
          </Select>
          <Button variant="outline" className="border-white/10">
            <Download className="h-4 w-4 mr-2" />
            Export
          </Button>
        </div>
      </div>

      {/* Executive Summary */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
        <MetricCard
          title="Total Campaigns"
          value={metrics?.active_campaigns || 0}
          subtitle={`Active: ${metrics?.running_campaigns || 0}, Scheduled: ${metrics?.scheduled_campaigns || 0}`}
          icon={Target}
          color="blue"
          loading={loading}
        />
        <MetricCard
          title="Lifetime Impressions"
          value={metrics ? `${(metrics.impressions_24h * 30 / 1000000).toFixed(1)}M` : "0"}
          trend={{ value: "+12%", direction: "up", label: "vs. prior" }}
          icon={Zap}
          color="green"
          loading={loading}
        />
        <MetricCard
          title="Avg Engagement Rate"
          value={`${metrics?.engagement_rate || 0}%`}
          subtitle="Industry avg: 5.2%"
          icon={TrendingUp}
          color="green"
          loading={loading}
        />
        <MetricCard
          title="Total Investment"
          value={metrics ? `$${(metrics.attributed_revenue * 0.15 / 1000).toFixed(0)}K` : "$0"}
          subtitle="All campaigns"
          icon={DollarSign}
          color="orange"
          loading={loading}
        />
        <MetricCard
          title="Blended ROI"
          value={`${metrics?.roi_this_week || 0}x`}
          trend={{ value: "+1.2x", direction: "up", label: "vs. prior" }}
          icon={BarChart3}
          color="green"
          loading={loading}
        />
      </div>

      {/* Performance Trends */}
      <div className="bg-ardito-surface border border-white/10 rounded-md p-5">
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-heading font-bold">Campaign Performance Over Time</h2>
          <div className="flex gap-4 text-sm">
            <span className="flex items-center gap-2">
              <span className="h-2 w-2 rounded-full bg-ardito-blue" />
              Impressions
            </span>
            <span className="flex items-center gap-2">
              <span className="h-2 w-2 rounded-full bg-ardito-green" />
              Engagements
            </span>
            <span className="flex items-center gap-2">
              <span className="h-2 w-2 rounded-full bg-ardito-orange" />
              Activations
            </span>
          </div>
        </div>
        <div className="h-72">
          {loading ? (
            <Skeleton className="h-full w-full" />
          ) : (
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={trendData}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
                <XAxis
                  dataKey="date"
                  stroke="#666"
                  tick={{ fill: "#999", fontSize: 11 }}
                />
                <YAxis
                  yAxisId="left"
                  stroke="#666"
                  tick={{ fill: "#999", fontSize: 11 }}
                  tickFormatter={(v) => `${(v / 1000).toFixed(0)}K`}
                />
                <YAxis
                  yAxisId="right"
                  orientation="right"
                  stroke="#666"
                  tick={{ fill: "#999", fontSize: 11 }}
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "#252525",
                    border: "1px solid rgba(255,255,255,0.1)",
                    borderRadius: "4px",
                  }}
                />
                <Line
                  yAxisId="left"
                  type="monotone"
                  dataKey="impressions"
                  stroke="#0066FF"
                  strokeWidth={2}
                  dot={false}
                />
                <Line
                  yAxisId="left"
                  type="monotone"
                  dataKey="engagements"
                  stroke="#00FF66"
                  strokeWidth={2}
                  dot={false}
                />
                <Line
                  yAxisId="right"
                  type="monotone"
                  dataKey="activations"
                  stroke="#FF6B00"
                  strokeWidth={2}
                  dot={false}
                />
              </LineChart>
            </ResponsiveContainer>
          )}
        </div>
      </div>

      {/* Emotion Intelligence */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Emotion ROI */}
        <div className="bg-ardito-surface border border-white/10 rounded-md p-5">
          <h2 className="font-heading font-bold mb-4">Emotion ROI Comparison</h2>
          <div className="h-64">
            {loading ? (
              <Skeleton className="h-full w-full" />
            ) : (
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={emotionROI} layout="vertical">
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
                  <XAxis type="number" stroke="#666" tick={{ fill: "#999", fontSize: 11 }} />
                  <YAxis
                    dataKey="emotion"
                    type="category"
                    stroke="#666"
                    tick={{ fill: "#999", fontSize: 11 }}
                    width={80}
                  />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "#252525",
                      border: "1px solid rgba(255,255,255,0.1)",
                      borderRadius: "4px",
                    }}
                    formatter={(value) => [`${value}x ROI`, "ROI"]}
                  />
                  <Bar dataKey="roi" radius={[0, 4, 4, 0]}>
                    {emotionROI.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            )}
          </div>
          <p className="text-xs text-muted-foreground mt-4 text-center">
            Euphoria-based activations generate 2.1x higher ROI
          </p>
        </div>

        {/* Budget Utilization */}
        <div className="bg-ardito-surface border border-white/10 rounded-md p-5">
          <h2 className="font-heading font-bold mb-4">Budget Utilization</h2>
          <div className="flex items-center gap-8">
            <div className="h-48 w-48">
              {loading ? (
                <Skeleton className="h-full w-full rounded-full" />
              ) : (
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={budgetData}
                      cx="50%"
                      cy="50%"
                      innerRadius={50}
                      outerRadius={70}
                      paddingAngle={2}
                      dataKey="value"
                    >
                      {budgetData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                  </PieChart>
                </ResponsiveContainer>
              )}
            </div>
            <div className="flex-1 space-y-4">
              {budgetData.map((item) => (
                <div key={item.name} className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="h-3 w-3 rounded-full" style={{ backgroundColor: item.color }} />
                    <span className="text-sm">{item.name}</span>
                  </div>
                  <span className="font-mono font-medium">{item.value}%</span>
                </div>
              ))}
              <div className="pt-3 border-t border-white/10 space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">CPM</span>
                  <span className="font-mono">$8.45</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">CPE</span>
                  <span className="font-mono">$0.24</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">CPC</span>
                  <span className="font-mono">$1.82</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Competitive Benchmarks */}
      <div className="bg-ardito-surface border border-white/10 rounded-md p-5">
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-heading font-bold">How You Compare</h2>
          <div className="flex gap-2">
            <Badge className="bg-ardito-green/20 text-ardito-green border-ardito-green/50">
              Top 5% in Engagement
            </Badge>
            <Badge className="bg-ardito-blue/20 text-ardito-blue border-ardito-blue/50">
              Top 10% in ROI
            </Badge>
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-white/10">
                <th className="text-left py-3 px-4 text-xs font-medium text-muted-foreground uppercase">
                  Metric
                </th>
                <th className="text-right py-3 px-4 text-xs font-medium text-muted-foreground uppercase">
                  Your Performance
                </th>
                <th className="text-right py-3 px-4 text-xs font-medium text-muted-foreground uppercase">
                  Industry Avg
                </th>
                <th className="text-right py-3 px-4 text-xs font-medium text-muted-foreground uppercase">
                  Difference
                </th>
              </tr>
            </thead>
            <tbody>
              {[
                { metric: "Engagement Rate", yours: "32.4%", avg: "5.2%", diff: "+522%", positive: true },
                { metric: "ROI", yours: "8.2x", avg: "2.1x", diff: "+290%", positive: true },
                { metric: "Activation Speed", yours: "42s", avg: "8min", diff: "91% faster", positive: true },
                { metric: "Cost per Engagement", yours: "$0.24", avg: "$0.85", diff: "-72%", positive: true },
              ].map((row) => (
                <tr key={row.metric} className="border-b border-white/5">
                  <td className="py-3 px-4 font-medium">{row.metric}</td>
                  <td className="py-3 px-4 text-right font-mono">{row.yours}</td>
                  <td className="py-3 px-4 text-right font-mono text-muted-foreground">{row.avg}</td>
                  <td className={`py-3 px-4 text-right font-mono ${row.positive ? "text-ardito-green" : "text-red-400"}`}>
                    {row.diff}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* AI Recommendations */}
      <div className="bg-ardito-surface border border-white/10 rounded-md p-5">
        <h2 className="font-heading font-bold mb-4">Optimization Recommendations</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {[
            {
              icon: Target,
              priority: "High",
              title: "Increase SEC budget",
              desc: "SEC schools generate 2.8x higher ROI than Big Ten",
              impact: "+$45K est. revenue",
            },
            {
              icon: Calendar,
              priority: "Medium",
              title: "Focus on evening games",
              desc: "Evening games (6-9pm) show 45% higher engagement",
              impact: "+15% engagement",
            },
            {
              icon: Zap,
              priority: "Medium",
              title: "Expand tension targeting",
              desc: "You're under-utilizing Tension moments",
              impact: "+20% activations",
            },
          ].map((rec, i) => (
            <div
              key={i}
              className="p-4 border border-white/10 rounded-md hover:border-ardito-blue/50 transition-colors cursor-pointer"
            >
              <div className="flex items-start gap-3">
                <div className="h-10 w-10 rounded-md bg-ardito-blue/20 flex items-center justify-center shrink-0">
                  <rec.icon className="h-5 w-5 text-ardito-blue" />
                </div>
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <Badge
                      variant="outline"
                      className={
                        rec.priority === "High"
                          ? "bg-red-500/20 text-red-400 border-red-500/50"
                          : "bg-ardito-orange/20 text-ardito-orange border-ardito-orange/50"
                      }
                    >
                      {rec.priority}
                    </Badge>
                  </div>
                  <h3 className="font-medium mb-1">{rec.title}</h3>
                  <p className="text-sm text-muted-foreground mb-2">{rec.desc}</p>
                  <span className="text-sm text-ardito-green font-mono">{rec.impact}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default AnalyticsPage;
