import { motion } from "framer-motion";
import { TrendingUp, TrendingDown } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";

const MetricCard = ({
  title,
  value,
  subtitle,
  trend,
  icon: Icon,
  color = "blue",
  loading = false,
}) => {
  const colorClasses = {
    blue: "bg-ardito-blue/20 text-ardito-blue",
    green: "bg-ardito-green/20 text-ardito-green",
    orange: "bg-ardito-orange/20 text-ardito-orange",
    red: "bg-red-500/20 text-red-500",
  };

  if (loading) {
    return (
      <div className="bg-ardito-surface border border-white/10 rounded-md p-5">
        <div className="flex items-start justify-between mb-4">
          <Skeleton className="h-10 w-10 rounded-md" />
          <Skeleton className="h-4 w-24" />
        </div>
        <Skeleton className="h-10 w-32 mb-2" />
        <Skeleton className="h-4 w-40 mb-3" />
        <Skeleton className="h-4 w-28" />
      </div>
    );
  }

  return (
    <motion.div
      whileHover={{ scale: 1.02, boxShadow: "0 0 20px rgba(0,102,255,0.15)" }}
      transition={{ duration: 0.2 }}
      className="bg-ardito-surface border border-white/10 rounded-md p-5 hover:border-ardito-blue/50 transition-colors"
    >
      <div className="flex items-start justify-between mb-4">
        {Icon && (
          <div className={`h-10 w-10 rounded-md flex items-center justify-center ${colorClasses[color]}`}>
            <Icon className="h-5 w-5" />
          </div>
        )}
        <span className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
          {title}
        </span>
      </div>

      <div className="mb-1">
        <span className="font-mono font-bold text-3xl text-foreground tabular-nums">
          {value}
        </span>
      </div>

      {subtitle && (
        <p className="text-sm text-muted-foreground mb-3">{subtitle}</p>
      )}

      {trend && (
        <div className={`flex items-center gap-1 text-sm ${
          trend.direction === "up" ? "text-ardito-green" : "text-red-400"
        }`}>
          {trend.direction === "up" ? (
            <TrendingUp className="h-4 w-4" />
          ) : (
            <TrendingDown className="h-4 w-4" />
          )}
          <span className="font-mono font-medium">{trend.value}</span>
          <span className="text-muted-foreground">{trend.label}</span>
        </div>
      )}
    </motion.div>
  );
};

export default MetricCard;
