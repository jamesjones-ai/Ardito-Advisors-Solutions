import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { api } from "@/lib/api";
import { motion } from "framer-motion";
import { toast } from "sonner";
import {
  ArrowLeft,
  Users,
  MessageSquare,
  Pause,
  Download,
  Share2,
  TrendingUp,
  Zap,
  Target,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Skeleton } from "@/components/ui/skeleton";
import EmotionChart from "@/components/dashboard/EmotionChart";

const EMOTION_COLORS = {
  euphoria: "#00FF66",
  tension: "#0066FF",
  frustration: "#FF0000",
  nostalgia: "#9C27B0",
  pride: "#FFD700",
  anxiety: "#FF6B00",
  disappointment: "#757575",
};

const EmotionBar = ({ emotion, value, maxValue = 100 }) => (
  <div className="space-y-1">
    <div className="flex items-center justify-between text-sm">
      <span className="capitalize text-muted-foreground">{emotion}</span>
      <span className="font-mono" style={{ color: EMOTION_COLORS[emotion] }}>
        {value}%
      </span>
    </div>
    <div className="h-2 bg-white/10 rounded-full overflow-hidden">
      <motion.div
        initial={{ width: 0 }}
        animate={{ width: `${(value / maxValue) * 100}%` }}
        transition={{ duration: 0.5 }}
        className="h-full rounded-full"
        style={{ backgroundColor: EMOTION_COLORS[emotion] }}
      />
    </div>
  </div>
);

const GameDetailPage = () => {
  const { gameId } = useParams();
  const [game, setGame] = useState(null);
  const [emotions, setEmotions] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [gameRes, emotionsRes] = await Promise.all([
          api.get(`/games/${gameId}`),
          api.get(`/games/${gameId}/emotions`),
        ]);
        setGame(gameRes.data);
        setEmotions(emotionsRes.data);
      } catch (error) {
        console.error("Failed to fetch game:", error);
        if (error.response?.status !== 401) {
          toast.error("Failed to load game details");
        }
      } finally {
        setLoading(false);
      }
    };

    fetchData();
    const interval = setInterval(fetchData, 10000);
    return () => clearInterval(interval);
  }, [gameId]);

  const latestEmotion = emotions[emotions.length - 1];
  const isLive = game?.status === "live";

  if (loading) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-8 w-48" />
        <div className="grid grid-cols-12 gap-4">
          <div className="col-span-3 space-y-4">
            <Skeleton className="h-48" />
            <Skeleton className="h-48" />
          </div>
          <div className="col-span-6">
            <Skeleton className="h-96" />
          </div>
          <div className="col-span-3 space-y-4">
            <Skeleton className="h-48" />
            <Skeleton className="h-48" />
          </div>
        </div>
      </div>
    );
  }

  if (!game) {
    return (
      <div className="text-center py-12">
        <h2 className="text-xl font-bold mb-2">Game not found</h2>
        <Link to="/app/live-games">
          <Button variant="outline">Back to Live Games</Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-6" data-testid="game-detail-page">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Link to="/app/live-games">
          <Button variant="ghost" size="icon">
            <ArrowLeft className="h-5 w-5" />
          </Button>
        </Link>
        <div className="flex-1">
          <div className="flex items-center gap-3">
            <h1 className="font-heading text-xl font-bold">
              {game.home_team.name} vs {game.away_team.name}
            </h1>
            {isLive && (
              <Badge className="bg-ardito-green/20 text-ardito-green border-ardito-green/50 animate-pulse">
                LIVE
              </Badge>
            )}
          </div>
          <p className="text-sm text-muted-foreground">{game.venue}</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" className="border-white/10">
            <Download className="h-4 w-4 mr-2" />
            Export
          </Button>
          <Button variant="outline" size="sm" className="border-white/10">
            <Share2 className="h-4 w-4 mr-2" />
            Share
          </Button>
        </div>
      </div>

      {/* Main Grid */}
      <div className="grid grid-cols-12 gap-4">
        {/* Left Column */}
        <div className="col-span-12 lg:col-span-3 space-y-4">
          {/* Game Info */}
          <div className="bg-ardito-surface border border-white/10 rounded-md p-4">
            <h3 className="text-xs font-medium text-muted-foreground uppercase tracking-wide mb-4">
              Game Info
            </h3>
            <div className="flex items-center justify-center gap-6 mb-4">
              <div className="text-center">
                <div className="h-16 w-16 bg-white/10 rounded-md flex items-center justify-center mb-2">
                  <span className="font-bold">{game.home_team.name.slice(0, 3).toUpperCase()}</span>
                </div>
                <span className="font-mono text-3xl font-bold">{game.score_home}</span>
              </div>
              <span className="text-muted-foreground text-lg">vs</span>
              <div className="text-center">
                <div className="h-16 w-16 bg-white/10 rounded-md flex items-center justify-center mb-2">
                  <span className="font-bold">{game.away_team.name.slice(0, 3).toUpperCase()}</span>
                </div>
                <span className="font-mono text-3xl font-bold">{game.score_away}</span>
              </div>
            </div>
            {isLive && (
              <div className="text-center p-2 bg-ardito-green/10 rounded-md">
                <span className="font-mono text-ardito-green">
                  {game.quarter} • {game.time_remaining}
                </span>
              </div>
            )}
            <div className="mt-4 space-y-2 text-sm">
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground">Venue</span>
                <span>{game.venue}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground">Attendance</span>
                <span className="font-mono">{game.attendance?.toLocaleString() || "N/A"}</span>
              </div>
            </div>
          </div>

          {/* Social Activity */}
          <div className="bg-ardito-surface border border-white/10 rounded-md p-4">
            <h3 className="text-xs font-medium text-muted-foreground uppercase tracking-wide mb-4">
              Social Activity
            </h3>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Posts/min</span>
                <span className="font-mono text-ardito-green">
                  {Math.round((latestEmotion?.post_count || 0) / 5)}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Total posts</span>
                <span className="font-mono">{((latestEmotion?.post_count || 0) * 30).toLocaleString()}</span>
              </div>
              <div className="pt-2 border-t border-white/10">
                <span className="text-xs text-muted-foreground">Top Hashtags</span>
                <div className="flex flex-wrap gap-1 mt-2">
                  <Badge variant="outline" className="text-xs">{game.home_team.hashtag}</Badge>
                  <Badge variant="outline" className="text-xs">{game.away_team.hashtag}</Badge>
                </div>
              </div>
            </div>
          </div>

          {/* Active Campaigns */}
          <div className="bg-ardito-surface border border-white/10 rounded-md p-4">
            <h3 className="text-xs font-medium text-muted-foreground uppercase tracking-wide mb-4">
              Active Campaigns
            </h3>
            <div className="space-y-3">
              {["Brand Awareness Q4", "Fan Engagement Push", "Victory Promo"].map((camp, i) => (
                <div key={camp} className="flex items-center justify-between text-sm">
                  <span>{camp}</span>
                  <Badge variant="outline" className="text-xs bg-ardito-blue/20 text-ardito-blue border-ardito-blue/50">
                    Active
                  </Badge>
                </div>
              ))}
            </div>
            <Link to="/app/campaigns/create">
              <Button variant="outline" className="w-full mt-4 border-white/10">
                <Target className="h-4 w-4 mr-2" />
                Activate Campaign
              </Button>
            </Link>
          </div>
        </div>

        {/* Center Column */}
        <div className="col-span-12 lg:col-span-6 space-y-4">
          {/* Main Emotion Chart */}
          <div className="bg-ardito-surface border border-white/10 rounded-md p-4">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-heading font-bold">Real-Time Emotion Chart</h3>
              <span className="text-xs text-muted-foreground">Last 30 minutes</span>
            </div>
            <div className="h-72">
              <EmotionChart
                data={emotions}
                height={280}
                showLegend={true}
                emotions={["tension", "euphoria", "pride", "anxiety"]}
              />
            </div>
          </div>

          {/* Emotion Breakdown */}
          <div className="bg-ardito-surface border border-white/10 rounded-md p-4">
            <h3 className="text-xs font-medium text-muted-foreground uppercase tracking-wide mb-4">
              Current Emotion Breakdown
            </h3>
            <div className="grid grid-cols-2 gap-4">
              {latestEmotion && (
                <>
                  <EmotionBar emotion="euphoria" value={latestEmotion.euphoria} />
                  <EmotionBar emotion="tension" value={latestEmotion.tension} />
                  <EmotionBar emotion="pride" value={latestEmotion.pride} />
                  <EmotionBar emotion="anxiety" value={latestEmotion.anxiety} />
                  <EmotionBar emotion="frustration" value={latestEmotion.frustration} />
                  <EmotionBar emotion="disappointment" value={latestEmotion.disappointment} />
                </>
              )}
            </div>
          </div>

          {/* Recent Moments */}
          <div className="bg-ardito-surface border border-white/10 rounded-md p-4">
            <h3 className="text-xs font-medium text-muted-foreground uppercase tracking-wide mb-4">
              Recent Game Moments
            </h3>
            <div className="space-y-3">
              {[
                { time: "8:42", event: "Touchdown - Alabama", emotion: "euphoria", impact: 85 },
                { time: "12:15", event: "Interception", emotion: "tension", impact: 72 },
                { time: "15:30", event: "Field Goal", emotion: "pride", impact: 45 },
                { time: "18:00", event: "Timeout Called", emotion: "anxiety", impact: 38 },
              ].map((moment, i) => (
                <div
                  key={i}
                  className="flex items-center gap-3 p-2 rounded-md hover:bg-white/5 cursor-pointer"
                >
                  <span className="font-mono text-sm text-muted-foreground w-12">
                    {moment.time}
                  </span>
                  <div className="flex-1">
                    <span className="text-sm">{moment.event}</span>
                  </div>
                  <Badge
                    variant="outline"
                    className="capitalize"
                    style={{
                      backgroundColor: `${EMOTION_COLORS[moment.emotion]}20`,
                      color: EMOTION_COLORS[moment.emotion],
                      borderColor: `${EMOTION_COLORS[moment.emotion]}50`,
                    }}
                  >
                    {moment.emotion}
                  </Badge>
                  <div className="w-16">
                    <Progress value={moment.impact} className="h-1.5" />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Column */}
        <div className="col-span-12 lg:col-span-3 space-y-4">
          {/* Recent Activations */}
          <div className="bg-ardito-surface border border-white/10 rounded-md p-4">
            <h3 className="text-xs font-medium text-muted-foreground uppercase tracking-wide mb-4">
              Recent Activations
            </h3>
            <div className="space-y-3">
              {[
                { time: "2:45 ago", campaign: "Brand Q4", channels: ["stadium", "mobile"], engagement: 1247 },
                { time: "8:12 ago", campaign: "Fan Push", channels: ["social"], engagement: 856 },
                { time: "15:30 ago", campaign: "Victory", channels: ["mobile", "social"], engagement: 2103 },
              ].map((act, i) => (
                <div key={i} className="p-2 bg-white/5 rounded-md">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-sm font-medium">{act.campaign}</span>
                    <span className="text-xs text-muted-foreground">{act.time}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex gap-1">
                      {act.channels.map((ch) => (
                        <Badge key={ch} variant="outline" className="text-xs capitalize">
                          {ch}
                        </Badge>
                      ))}
                    </div>
                    <span className="font-mono text-xs text-ardito-green">
                      +{act.engagement.toLocaleString()}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Predicted Moments */}
          <div className="bg-ardito-surface border border-white/10 rounded-md p-4">
            <div className="flex items-center gap-2 mb-4">
              <Zap className="h-4 w-4 text-ardito-orange" />
              <h3 className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
                AI Predictions
              </h3>
            </div>
            <div className="space-y-3">
              <div className="p-2 bg-ardito-orange/10 border border-ardito-orange/30 rounded-md">
                <p className="text-sm mb-1">Close game finish likely</p>
                <p className="text-xs text-muted-foreground">
                  <span className="text-ardito-orange font-mono">TENSION</span> spike expected in next 5 min
                </p>
                <div className="mt-2 flex items-center gap-2">
                  <Progress value={85} className="flex-1 h-1.5" />
                  <span className="text-xs font-mono">85%</span>
                </div>
              </div>
              <div className="p-2 bg-ardito-green/10 border border-ardito-green/30 rounded-md">
                <p className="text-sm mb-1">Potential scoring drive</p>
                <p className="text-xs text-muted-foreground">
                  <span className="text-ardito-green font-mono">EUPHORIA</span> spike likely
                </p>
                <div className="mt-2 flex items-center gap-2">
                  <Progress value={68} className="flex-1 h-1.5" />
                  <span className="text-xs font-mono">68%</span>
                </div>
              </div>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="bg-ardito-surface border border-white/10 rounded-md p-4">
            <h3 className="text-xs font-medium text-muted-foreground uppercase tracking-wide mb-4">
              Quick Actions
            </h3>
            <div className="space-y-2">
              <Button variant="outline" className="w-full justify-start border-white/10 text-red-400 hover:text-red-400">
                <Pause className="h-4 w-4 mr-2" />
                Pause All Campaigns
              </Button>
              <Button variant="outline" className="w-full justify-start border-white/10">
                <Download className="h-4 w-4 mr-2" />
                Export Emotion Report
              </Button>
              <Button variant="outline" className="w-full justify-start border-white/10">
                <Share2 className="h-4 w-4 mr-2" />
                Share Live View
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default GameDetailPage;
