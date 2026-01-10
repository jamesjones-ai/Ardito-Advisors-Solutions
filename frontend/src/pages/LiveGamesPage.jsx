import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { api } from "@/lib/api";
import { motion } from "framer-motion";
import { toast } from "sonner";
import {
  Radio,
  Filter,
  RefreshCw,
  Users,
  MessageSquare,
  Calendar,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Skeleton } from "@/components/ui/skeleton";
import EmotionChart from "@/components/dashboard/EmotionChart";

const CONFERENCES = ["All Conferences", "SEC", "Big Ten", "ACC", "Big 12", "Pac-12"];

const EMOTION_COLORS = {
  euphoria: "#00FF66",
  tension: "#0066FF",
  frustration: "#FF0000",
  pride: "#FFD700",
  anxiety: "#FF6B00",
};

const GameCard = ({ game }) => {
  const [emotions, setEmotions] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchEmotions = async () => {
      try {
        const response = await api.get(`/games/${game.id}/emotions`);
        setEmotions(response.data.slice(-15));
      } catch (error) {
        console.error("Failed to fetch emotions:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchEmotions();
    
    if (game.status === "live") {
      const interval = setInterval(fetchEmotions, 15000);
      return () => clearInterval(interval);
    }
  }, [game.id, game.status]);

  const latestEmotion = emotions[emotions.length - 1];
  const isLive = game.status === "live";

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ scale: 1.01 }}
      className="bg-ardito-surface border border-white/10 rounded-md overflow-hidden hover:border-ardito-blue/50 transition-all"
      data-testid={`game-card-${game.id}`}
    >
      {/* Header */}
      <div className="p-4 border-b border-white/5">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            {/* Home Team */}
            <div className="text-center">
              <div className="h-12 w-12 bg-white/10 rounded-md flex items-center justify-center mb-1">
                <span className="text-xs font-bold">{game.home_team.name.slice(0, 3).toUpperCase()}</span>
              </div>
              <span className="text-xs text-muted-foreground truncate w-16 block">
                {game.home_team.name.split(" ").pop()}
              </span>
            </div>

            {/* Score */}
            <div className="text-center">
              <div className="font-mono font-bold text-2xl">
                {game.score_home} - {game.score_away}
              </div>
              {isLive && (
                <div className="flex items-center justify-center gap-1 mt-1">
                  <span className="relative flex h-1.5 w-1.5">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-ardito-green opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-ardito-green"></span>
                  </span>
                  <span className="text-xs text-ardito-green font-mono">
                    {game.quarter} • {game.time_remaining}
                  </span>
                </div>
              )}
              {game.status === "scheduled" && (
                <span className="text-xs text-muted-foreground">
                  {new Date(game.start_time).toLocaleTimeString("en-US", {
                    hour: "numeric",
                    minute: "2-digit",
                  })}
                </span>
              )}
            </div>

            {/* Away Team */}
            <div className="text-center">
              <div className="h-12 w-12 bg-white/10 rounded-md flex items-center justify-center mb-1">
                <span className="text-xs font-bold">{game.away_team.name.slice(0, 3).toUpperCase()}</span>
              </div>
              <span className="text-xs text-muted-foreground truncate w-16 block">
                {game.away_team.name.split(" ").pop()}
              </span>
            </div>
          </div>

          {/* Status Badge */}
          <Badge
            variant={isLive ? "default" : "outline"}
            className={isLive ? "bg-ardito-green/20 text-ardito-green border-ardito-green/50" : ""}
          >
            {game.status.toUpperCase()}
          </Badge>
        </div>
      </div>

      {/* Emotion Chart */}
      <div className="p-4">
        {loading ? (
          <Skeleton className="h-32 w-full" />
        ) : (
          <div className="h-32">
            <EmotionChart
              data={emotions}
              height={128}
              showLegend={false}
              emotions={["tension", "euphoria"]}
            />
          </div>
        )}
      </div>

      {/* Footer */}
      <div className="px-4 pb-4 flex items-center justify-between">
        <div className="flex items-center gap-4 text-xs text-muted-foreground">
          {latestEmotion && (
            <span
              className="px-2 py-1 rounded-sm font-mono font-medium uppercase"
              style={{
                backgroundColor: `${EMOTION_COLORS[latestEmotion.dominant_emotion]}20`,
                color: EMOTION_COLORS[latestEmotion.dominant_emotion],
              }}
            >
              {latestEmotion.dominant_emotion} {latestEmotion.confidence}%
            </span>
          )}
          {isLive && (
            <span className="flex items-center gap-1">
              <MessageSquare className="h-3 w-3" />
              {latestEmotion?.post_count?.toLocaleString() || "0"} posts/5min
            </span>
          )}
        </div>
        <Link to={`/live-games/${game.id}`}>
          <Button variant="ghost" size="sm" className="text-ardito-blue hover:text-ardito-blue">
            View Details
          </Button>
        </Link>
      </div>
    </motion.div>
  );
};

const UpcomingGameCard = ({ game }) => (
  <div className="flex items-center justify-between p-3 bg-ardito-surface border border-white/10 rounded-md">
    <div className="flex items-center gap-3">
      <Calendar className="h-4 w-4 text-muted-foreground" />
      <div>
        <p className="text-sm font-medium">
          {game.home_team.name.split(" ").pop()} vs {game.away_team.name.split(" ").pop()}
        </p>
        <p className="text-xs text-muted-foreground">{game.venue}</p>
      </div>
    </div>
    <div className="text-right">
      <p className="text-sm font-mono">
        {new Date(game.start_time).toLocaleDateString("en-US", {
          month: "short",
          day: "numeric",
        })}
      </p>
      <p className="text-xs text-muted-foreground">
        {new Date(game.start_time).toLocaleTimeString("en-US", {
          hour: "numeric",
          minute: "2-digit",
        })}
      </p>
    </div>
  </div>
);

const LiveGamesPage = () => {
  const [games, setGames] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedConference, setSelectedConference] = useState("All Conferences");
  const [autoRefresh, setAutoRefresh] = useState(true);
  const [mySchoolsOnly, setMySchoolsOnly] = useState(false);

  const fetchGames = async () => {
    try {
      const response = await api.get("/games/live");
      setGames(response.data);
    } catch (error) {
      console.error("Failed to fetch games:", error);
      toast.error("Failed to load games");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchGames();
    
    if (autoRefresh) {
      const interval = setInterval(fetchGames, 30000);
      return () => clearInterval(interval);
    }
  }, [autoRefresh]);

  const liveGames = games.filter((g) => g.status === "live");
  const scheduledGames = games.filter((g) => g.status === "scheduled");

  const filteredLiveGames = liveGames.filter((game) => {
    if (selectedConference === "All Conferences") return true;
    return (
      game.home_team.conference === selectedConference ||
      game.away_team.conference === selectedConference
    );
  });

  return (
    <div className="space-y-6" data-testid="live-games-page">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-3">
            <h1 className="font-heading text-2xl font-bold">Live Games Monitor</h1>
            {liveGames.length > 0 && (
              <Badge className="bg-ardito-green/20 text-ardito-green border-ardito-green/50">
                <span className="relative flex h-1.5 w-1.5 mr-1.5">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-ardito-green opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-ardito-green"></span>
                </span>
                {liveGames.length} LIVE
              </Badge>
            )}
          </div>
          <p className="text-muted-foreground text-sm">Real-time emotion tracking across all active games</p>
        </div>
        <Button
          variant="outline"
          size="sm"
          onClick={fetchGames}
          className="border-white/10"
          data-testid="refresh-btn"
        >
          <RefreshCw className="h-4 w-4 mr-2" />
          Refresh
        </Button>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 flex-wrap">
        <div className="flex flex-wrap gap-2">
          {CONFERENCES.map((conf) => (
            <Button
              key={conf}
              variant={selectedConference === conf ? "default" : "outline"}
              size="sm"
              onClick={() => setSelectedConference(conf)}
              className={
                selectedConference === conf
                  ? "bg-ardito-blue hover:bg-blue-600"
                  : "border-white/10"
              }
            >
              {conf}
            </Button>
          ))}
        </div>
        <div className="flex items-center gap-6 ml-auto">
          <div className="flex items-center gap-2">
            <Switch
              id="my-schools"
              checked={mySchoolsOnly}
              onCheckedChange={setMySchoolsOnly}
            />
            <Label htmlFor="my-schools" className="text-sm cursor-pointer">
              My Schools Only
            </Label>
          </div>
          <div className="flex items-center gap-2">
            <Switch
              id="auto-refresh"
              checked={autoRefresh}
              onCheckedChange={setAutoRefresh}
            />
            <Label htmlFor="auto-refresh" className="text-sm cursor-pointer">
              Auto-refresh
            </Label>
          </div>
        </div>
      </div>

      {/* Loading State */}
      {loading && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {[1, 2, 3, 4].map((i) => (
            <Skeleton key={i} className="h-64" />
          ))}
        </div>
      )}

      {/* Live Games Grid */}
      {!loading && filteredLiveGames.length > 0 && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {filteredLiveGames.map((game) => (
            <GameCard key={game.id} game={game} />
          ))}
        </div>
      )}

      {/* Empty State */}
      {!loading && filteredLiveGames.length === 0 && (
        <div className="bg-ardito-surface border border-white/10 rounded-md p-12 text-center">
          <div className="h-16 w-16 bg-white/5 rounded-full flex items-center justify-center mx-auto mb-4">
            <Radio className="h-8 w-8 text-muted-foreground" />
          </div>
          <h3 className="font-heading text-xl font-bold mb-2">No games currently live</h3>
          <p className="text-muted-foreground mb-6">
            Check back during game days to monitor real-time emotions
          </p>

          {scheduledGames.length > 0 && (
            <div className="max-w-md mx-auto">
              <h4 className="text-sm font-medium text-muted-foreground uppercase tracking-wide mb-3">
                Upcoming Games
              </h4>
              <div className="space-y-2">
                {scheduledGames.slice(0, 3).map((game) => (
                  <UpcomingGameCard key={game.id} game={game} />
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default LiveGamesPage;
