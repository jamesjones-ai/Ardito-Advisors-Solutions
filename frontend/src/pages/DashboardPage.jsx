import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { api } from "@/lib/api";
import { motion } from "framer-motion";
import { toast } from "sonner";
import {
  Megaphone,
  Radio,
  Zap,
  DollarSign,
  ArrowRight,
  TrendingUp,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import MetricCard from "@/components/dashboard/MetricCard";
import EmotionChart from "@/components/dashboard/EmotionChart";
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from "recharts";

const EMOTION_COLORS = {
  euphoria: "#00FF66",
  tension: "#0066FF",
  pride: "#FFD700",
  frustration: "#FF0000",
  anxiety: "#FF6B00",
  nostalgia: "#9C27B0",
  disappointment: "#757575",
};

const EmotionBadge = ({ emotion, score }) => (
  <span
    className="inline-flex items-center gap-1.5 px-2 py-1 rounded-sm text-xs font-mono font-medium uppercase"
    style={{
      backgroundColor: `${EMOTION_COLORS[emotion]}20`,
      color: EMOTION_COLORS[emotion],
    }}
  >
    {emotion} {score}%
  </span>
);

const LiveGameCard = ({ game }) => {
  const [emotions, setEmotions] = useState([]);

  useEffect(() => {
    const fetchEmotions = async () => {
      try {
        const response = await api.get(`/games/${game.id}/emotions`);
        setEmotions(response.data.slice(-15));
      } catch (error) {
        console.error("Failed to fetch emotions:", error);
      }
    };
    fetchEmotions();
    const interval = setInterval(fetchEmotions, 10000);
    return () => clearInterval(interval);
  }, [game.id]);

  const latestEmotion = emotions[emotions.length - 1];

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-ardito-surface border border-white/10 rounded-md p-4 hover:border-ardito-blue/50 transition-colors"
    >
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2">
            <div className="h-8 w-8 bg-white/10 rounded-md flex items-center justify-center text-xs font-bold">
              {game.home_team.name.slice(0, 3).toUpperCase()}
            </div>
            <span className="font-mono font-bold text-lg">{game.score_home}</span>
          </div>
          <span className="text-muted-foreground">vs</span>
          <div className="flex items-center gap-2">
            <span className="font-mono font-bold text-lg">{game.score_away}</span>
            <div className="h-8 w-8 bg-white/10 rounded-md flex items-center justify-center text-xs font-bold">
              {game.away_team.name.slice(0, 3).toUpperCase()}
            </div>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-ardito-green opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-ardito-green"></span>
          </span>
          <span className="text-xs text-ardito-green font-mono">{game.quarter} • {game.time_remaining}</span>
        </div>
      </div>

      <div className="h-32 mb-3">
        {emotions.length > 0 && (
          <EmotionChart
            data={emotions}
            height={120}
            showLegend={false}
            emotions={["tension", "euphoria"]}
          />
        )}
      </div>

      <div className="flex items-center justify-between">
        {latestEmotion && (
          <EmotionBadge
            emotion={latestEmotion.dominant_emotion}
            score={latestEmotion.confidence}
          />
        )}
        <Link to={`/app/live-games/${game.id}`}>
          <Button variant="ghost" size="sm" className="text-ardito-blue hover:text-ardito-blue">
            View Details <ArrowRight className="ml-1 h-3 w-3" />
          </Button>
        </Link>
      </div>
    </motion.div>
  );
};

const ActivationsTable = ({ activations }) => {
  const formatTime = (timestamp) => {
    const date = new Date(timestamp);
    return date.toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit" });
  };

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b border-white/10">
            <th className="text-left py-3 px-4 text-xs font-medium text-muted-foreground uppercase tracking-wide">Time</th>
            <th className="text-left py-3 px-4 text-xs font-medium text-muted-foreground uppercase tracking-wide">Campaign</th>
            <th className="text-left py-3 px-4 text-xs font-medium text-muted-foreground uppercase tracking-wide">Emotion</th>
            <th className="text-left py-3 px-4 text-xs font-medium text-muted-foreground uppercase tracking-wide">Channels</th>
            <th className="text-right py-3 px-4 text-xs font-medium text-muted-foreground uppercase tracking-wide">Engagement</th>
          </tr>
        </thead>
        <tbody>
          {activations.slice(0, 8).map((activation) => (
            <tr key={activation.id} className="border-b border-white/5 hover:bg-white/5">
              <td className="py-3 px-4 font-mono text-muted-foreground">{formatTime(activation.timestamp)}</td>
              <td className="py-3 px-4 font-medium">Campaign #{activation.campaign_id.slice(-4)}</td>
              <td className="py-3 px-4">
                <EmotionBadge emotion={activation.emotion_trigger} score={Math.round(activation.engagement_rate)} />
              </td>
              <td className="py-3 px-4">
                <div className="flex gap-1">
                  {activation.channels.map((ch) => (
                    <Badge key={ch} variant="outline" className="text-xs capitalize">
                      {ch}
                    </Badge>
                  ))}
                </div>
              </td>
              <td className="py-3 px-4 text-right font-mono text-ardito-green">
                {activation.engagement_rate.toFixed(1)}%
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

const DashboardPage = () => {
  const [metrics, setMetrics] = useState(null);
  const [liveGames, setLiveGames] = useState([]);
  const [activations, setActivations] = useState([]);
  const [emotionDist, setEmotionDist] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [metricsRes, gamesRes, activationsRes, emotionsRes] = await Promise.all([
          api.get("/analytics/dashboard"),
          api.get("/games/live"),
          api.get("/analytics/activations"),
          api.get("/analytics/emotions"),
        ]);
        
        setMetrics(metricsRes.data);
        setLiveGames(gamesRes.data.filter((g) => g.status === "live"));
        setActivations(activationsRes.data);
        
        // Transform emotion distribution for pie chart
        const dist = Object.entries(emotionsRes.data).map(([name, value]) => ({
          name,
          value,
          color: EMOTION_COLORS[name] || "#666",
        }));
        setEmotionDist(dist);
      } catch (error) {
        console.error("Dashboard fetch error:", error);
        // Don't show error toast for 401 - let the API interceptor handle session expiry
        if (error.response?.status !== 401) {
          toast.error("Failed to load dashboard data");
        }
      } finally {
        setLoading(false);
      }
    };

    fetchData();
    const interval = setInterval(fetchData, 30000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="space-y-6" data-testid="dashboard-page">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-heading text-2xl font-bold">Dashboard</h1>
          <p className="text-muted-foreground text-sm">Real-time emotion intelligence overview</p>
        </div>
        <Link to="/app/campaigns/create">
          <Button className="bg-ardito-blue hover:bg-blue-600" data-testid="create-campaign-btn">
            <Megaphone className="mr-2 h-4 w-4" />
            New Campaign
          </Button>
        </Link>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <MetricCard
          title="Active Campaigns"
          value={metrics?.active_campaigns || 0}
          subtitle={`${metrics?.running_campaigns || 0} running, ${metrics?.scheduled_campaigns || 0} scheduled`}
          trend={{ value: "+2", direction: "up", label: "from last week" }}
          icon={Megaphone}
          color="blue"
          loading={loading}
        />
        <MetricCard
          title="Live Games Today"
          value={metrics?.live_games_today || 0}
          subtitle={`${metrics?.live_now || 0} live now, ${metrics?.starting_soon || 0} starting soon`}
          icon={Radio}
          color="green"
          loading={loading}
        />
        <MetricCard
          title="Impressions (24h)"
          value={metrics ? `${(metrics.impressions_24h / 1000000).toFixed(1)}M` : "0"}
          subtitle={`${metrics?.engagement_rate || 0}% engagement rate`}
          trend={{ value: "+15%", direction: "up", label: "vs. yesterday" }}
          icon={Zap}
          color="orange"
          loading={loading}
        />
        <MetricCard
          title="ROI This Week"
          value={metrics ? `${metrics.roi_this_week}x` : "0x"}
          subtitle={metrics ? `$${(metrics.attributed_revenue / 1000).toFixed(0)}K attributed revenue` : ""}
          trend={{ value: "+1.2x", direction: "up", label: "vs. last week" }}
          icon={DollarSign}
          color="green"
          loading={loading}
        />
      </div>

      {/* Live Games */}
      {liveGames.length > 0 && (
        <div className="bg-ardito-surface border border-white/10 rounded-md p-5">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <h2 className="font-heading text-lg font-bold">Live Emotion Tracking</h2>
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-ardito-green opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-ardito-green"></span>
              </span>
            </div>
            <Link to="/app/live-games" className="text-sm text-ardito-blue hover:underline">
              View all games
            </Link>
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {liveGames.slice(0, 2).map((game) => (
              <LiveGameCard key={game.id} game={game} />
            ))}
          </div>
        </div>
      )}

      {/* Recent Activations */}
      <div className="bg-ardito-surface border border-white/10 rounded-md p-5">
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-heading text-lg font-bold">Recent Campaign Activations</h2>
          <Link to="/app/analytics" className="text-sm text-ardito-blue hover:underline">
            View all
          </Link>
        </div>
        <ActivationsTable activations={activations} />
      </div>

      {/* Bottom Row */}
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-4">
        {/* Emotion Distribution */}
        <div className="lg:col-span-3 bg-ardito-surface border border-white/10 rounded-md p-5">
          <h2 className="font-heading text-lg font-bold mb-4">Emotion Distribution (Last 7 Days)</h2>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={emotionDist}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={90}
                  paddingAngle={2}
                  dataKey="value"
                >
                  {emotionDist.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip
                  content={({ active, payload }) => {
                    if (!active || !payload?.length) return null;
                    const data = payload[0].payload;
                    return (
                      <div className="bg-ardito-surface border border-white/10 rounded-md p-2 shadow-lg">
                        <p className="capitalize font-medium" style={{ color: data.color }}>
                          {data.name}
                        </p>
                        <p className="font-mono text-lg">{data.value}%</p>
                      </div>
                    );
                  }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="flex flex-wrap justify-center gap-3 mt-4">
            {emotionDist.slice(0, 5).map((emotion) => (
              <div key={emotion.name} className="flex items-center gap-2">
                <span className="h-2 w-2 rounded-full" style={{ backgroundColor: emotion.color }} />
                <span className="text-sm text-muted-foreground capitalize">{emotion.name}</span>
                <span className="font-mono text-sm">{emotion.value}%</span>
              </div>
            ))}
          </div>
        </div>

        {/* Top Schools */}
        <div className="lg:col-span-2 bg-ardito-surface border border-white/10 rounded-md p-5">
          <h2 className="font-heading text-lg font-bold mb-4">Highest Engagement Schools</h2>
          <div className="space-y-4">
            {[
              { name: "University of Texas", rate: 48.2, trend: "+5.2%" },
              { name: "Ohio State", rate: 44.8, trend: "+3.1%" },
              { name: "Alabama", rate: 42.1, trend: "+2.8%" },
              { name: "Georgia", rate: 39.5, trend: "+1.5%" },
              { name: "Michigan", rate: 37.2, trend: "+0.9%" },
            ].map((school, i) => (
              <div key={school.name} className="flex items-center gap-3">
                <span className="w-6 text-center font-mono text-muted-foreground">{i + 1}</span>
                <div className="flex-1">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-sm font-medium">{school.name}</span>
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-ardito-green">{school.rate}%</span>
                      <span className="text-xs text-ardito-green flex items-center">
                        <TrendingUp className="h-3 w-3 mr-0.5" />
                        {school.trend}
                      </span>
                    </div>
                  </div>
                  <div className="h-1.5 bg-white/10 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-ardito-blue rounded-full"
                      style={{ width: `${(school.rate / 50) * 100}%` }}
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;
