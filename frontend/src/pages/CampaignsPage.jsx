import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { api } from "@/lib/api";
import { toast } from "sonner";
import { motion } from "framer-motion";
import {
  Plus,
  Search,
  MoreHorizontal,
  Play,
  Pause,
  Copy,
  Trash2,
  BarChart3,
  Edit,
  TrendingUp,
  TrendingDown,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Skeleton } from "@/components/ui/skeleton";

const EMOTION_COLORS = {
  euphoria: "#00FF66",
  tension: "#0066FF",
  frustration: "#FF0000",
  pride: "#FFD700",
  anxiety: "#FF6B00",
};

const STATUS_STYLES = {
  draft: { bg: "bg-gray-500/20", text: "text-gray-400", border: "border-gray-500/50" },
  scheduled: { bg: "bg-ardito-blue/20", text: "text-ardito-blue", border: "border-ardito-blue/50" },
  active: { bg: "bg-ardito-green/20", text: "text-ardito-green", border: "border-ardito-green/50" },
  paused: { bg: "bg-ardito-orange/20", text: "text-ardito-orange", border: "border-ardito-orange/50" },
  completed: { bg: "bg-white/10", text: "text-white/60", border: "border-white/20" },
};

const CampaignRow = ({ campaign, onStatusChange, onDelete }) => {
  const styles = STATUS_STYLES[campaign.status] || STATUS_STYLES.draft;
  const engagementColor = campaign.engagement_rate > 30 ? "text-ardito-green" : 
    campaign.engagement_rate > 15 ? "text-ardito-orange" : "text-red-400";

  return (
    <motion.tr
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="border-b border-white/5 hover:bg-white/5"
      data-testid={`campaign-row-${campaign.id}`}
    >
      <td className="py-4 px-4">
        <div>
          <Link
            to={`/app/campaigns/${campaign.id}/analytics`}
            className="font-medium hover:text-ardito-blue transition-colors"
          >
            {campaign.name}
          </Link>
          <p className="text-xs text-muted-foreground mt-0.5 line-clamp-1">
            {campaign.description || "No description"}
          </p>
        </div>
      </td>
      <td className="py-4 px-4">
        <Badge className={`${styles.bg} ${styles.text} ${styles.border} uppercase text-xs`}>
          {campaign.status}
        </Badge>
      </td>
      <td className="py-4 px-4">
        <span className="font-mono">{campaign.schools?.length || 0} schools</span>
      </td>
      <td className="py-4 px-4">
        <div className="flex flex-wrap gap-1">
          {campaign.target_emotions?.slice(0, 3).map((emotion) => (
            <span
              key={emotion}
              className="h-4 w-4 rounded-sm"
              style={{ backgroundColor: EMOTION_COLORS[emotion] }}
              title={emotion}
            />
          ))}
          {campaign.target_emotions?.length > 3 && (
            <span className="text-xs text-muted-foreground">
              +{campaign.target_emotions.length - 3}
            </span>
          )}
        </div>
      </td>
      <td className="py-4 px-4 text-right">
        <div className="flex items-center justify-end gap-1">
          <span className="font-mono">{campaign.impressions?.toLocaleString() || 0}</span>
          {campaign.impressions > 0 && (
            <TrendingUp className="h-3 w-3 text-ardito-green" />
          )}
        </div>
      </td>
      <td className="py-4 px-4 text-right">
        <span className={`font-mono ${engagementColor}`}>
          {campaign.engagement_rate?.toFixed(1) || 0}%
        </span>
      </td>
      <td className="py-4 px-4 text-right">
        <span className="font-mono text-ardito-green">{campaign.roi?.toFixed(1) || 0}x</span>
      </td>
      <td className="py-4 px-4">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon" data-testid={`campaign-actions-${campaign.id}`}>
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="bg-ardito-surface border-white/10">
            <DropdownMenuItem className="cursor-pointer">
              <Edit className="mr-2 h-4 w-4" />
              Edit
            </DropdownMenuItem>
            {campaign.status === "active" ? (
              <DropdownMenuItem
                className="cursor-pointer"
                onClick={() => onStatusChange(campaign.id, "paused")}
              >
                <Pause className="mr-2 h-4 w-4" />
                Pause
              </DropdownMenuItem>
            ) : campaign.status !== "completed" ? (
              <DropdownMenuItem
                className="cursor-pointer"
                onClick={() => onStatusChange(campaign.id, "active")}
              >
                <Play className="mr-2 h-4 w-4" />
                Activate
              </DropdownMenuItem>
            ) : null}
            <DropdownMenuItem className="cursor-pointer">
              <Copy className="mr-2 h-4 w-4" />
              Duplicate
            </DropdownMenuItem>
            <Link to={`/app/campaigns/${campaign.id}/analytics`}>
              <DropdownMenuItem className="cursor-pointer">
                <BarChart3 className="mr-2 h-4 w-4" />
                View Analytics
              </DropdownMenuItem>
            </Link>
            <DropdownMenuSeparator className="bg-white/10" />
            <DropdownMenuItem
              className="cursor-pointer text-red-400 focus:text-red-400"
              onClick={() => onDelete(campaign.id)}
            >
              <Trash2 className="mr-2 h-4 w-4" />
              Delete
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </td>
    </motion.tr>
  );
};

const CampaignsPage = () => {
  const navigate = useNavigate();
  const [campaigns, setCampaigns] = useState([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [deleteId, setDeleteId] = useState(null);

  const fetchCampaigns = async () => {
    try {
      const response = await api.get("/campaigns", {
        params: { status: statusFilter !== "all" ? statusFilter : undefined },
      });
      setCampaigns(response.data);
    } catch (error) {
      console.error("Failed to fetch campaigns:", error);
      if (error.response?.status !== 401) {
        toast.error("Failed to load campaigns");
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCampaigns();
  }, [statusFilter]);

  const handleStatusChange = async (campaignId, newStatus) => {
    try {
      await api.put(`/campaigns/${campaignId}/status?status=${newStatus}`);
      toast.success(`Campaign ${newStatus === "active" ? "activated" : "paused"}`);
      fetchCampaigns();
    } catch (error) {
      if (error.response?.status !== 401) {
        toast.error("Failed to update campaign status");
      }
    }
  };

  const handleDelete = async () => {
    if (!deleteId) return;
    try {
      await api.delete(`/campaigns/${deleteId}`);
      toast.success("Campaign deleted");
      setDeleteId(null);
      fetchCampaigns();
    } catch (error) {
      if (error.response?.status !== 401) {
        toast.error("Failed to delete campaign");
      }
    }
  };

  const filteredCampaigns = campaigns.filter((c) =>
    c.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-6" data-testid="campaigns-page">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="font-heading text-2xl font-bold">Campaign Management</h1>
          <p className="text-muted-foreground text-sm">
            Create and manage emotion-triggered sponsor campaigns
          </p>
        </div>
        <Link to="/app/campaigns/create">
          <Button className="bg-ardito-blue hover:bg-blue-600" data-testid="create-campaign-btn">
            <Plus className="mr-2 h-4 w-4" />
            Create Campaign
          </Button>
        </Link>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4">
        <Tabs value={statusFilter} onValueChange={setStatusFilter} className="w-full sm:w-auto">
          <TabsList className="bg-ardito-surface border border-white/10">
            <TabsTrigger value="all">All</TabsTrigger>
            <TabsTrigger value="active">Active</TabsTrigger>
            <TabsTrigger value="scheduled">Scheduled</TabsTrigger>
            <TabsTrigger value="paused">Paused</TabsTrigger>
            <TabsTrigger value="completed">Completed</TabsTrigger>
          </TabsList>
        </Tabs>
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Search campaigns..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            data-testid="search-campaigns"
            className="pl-9 bg-ardito-surface border-white/10"
          />
        </div>
      </div>

      {/* Table */}
      <div className="bg-ardito-surface border border-white/10 rounded-md overflow-hidden">
        {loading ? (
          <div className="p-4 space-y-4">
            {[1, 2, 3, 4].map((i) => (
              <Skeleton key={i} className="h-16" />
            ))}
          </div>
        ) : filteredCampaigns.length === 0 ? (
          <div className="text-center py-12">
            <div className="h-16 w-16 bg-white/5 rounded-full flex items-center justify-center mx-auto mb-4">
              <Plus className="h-8 w-8 text-muted-foreground" />
            </div>
            <h3 className="font-heading text-xl font-bold mb-2">No campaigns yet</h3>
            <p className="text-muted-foreground mb-6 max-w-md mx-auto">
              Create your first campaign to start activating sponsors at emotional peaks
            </p>
            <Link to="/app/campaigns/create">
              <Button className="bg-ardito-blue hover:bg-blue-600">
                <Plus className="mr-2 h-4 w-4" />
                Create Campaign
              </Button>
            </Link>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-white/10 bg-white/5">
                  <th className="text-left py-3 px-4 text-xs font-medium text-muted-foreground uppercase tracking-wide">
                    Campaign
                  </th>
                  <th className="text-left py-3 px-4 text-xs font-medium text-muted-foreground uppercase tracking-wide">
                    Status
                  </th>
                  <th className="text-left py-3 px-4 text-xs font-medium text-muted-foreground uppercase tracking-wide">
                    Schools
                  </th>
                  <th className="text-left py-3 px-4 text-xs font-medium text-muted-foreground uppercase tracking-wide">
                    Emotions
                  </th>
                  <th className="text-right py-3 px-4 text-xs font-medium text-muted-foreground uppercase tracking-wide">
                    Impressions
                  </th>
                  <th className="text-right py-3 px-4 text-xs font-medium text-muted-foreground uppercase tracking-wide">
                    Engagement
                  </th>
                  <th className="text-right py-3 px-4 text-xs font-medium text-muted-foreground uppercase tracking-wide">
                    ROI
                  </th>
                  <th className="py-3 px-4 w-12"></th>
                </tr>
              </thead>
              <tbody>
                {filteredCampaigns.map((campaign) => (
                  <CampaignRow
                    key={campaign.id}
                    campaign={campaign}
                    onStatusChange={handleStatusChange}
                    onDelete={setDeleteId}
                  />
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Delete Confirmation */}
      <AlertDialog open={!!deleteId} onOpenChange={() => setDeleteId(null)}>
        <AlertDialogContent className="bg-ardito-surface border-white/10">
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Campaign</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete this campaign? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel className="border-white/10">Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              className="bg-red-500 hover:bg-red-600"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default CampaignsPage;
