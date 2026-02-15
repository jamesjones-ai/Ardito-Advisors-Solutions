import { useState, useEffect } from "react";
import { Outlet, NavLink, useLocation } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { motion, AnimatePresence } from "framer-motion";
import {
  LayoutDashboard,
  Radio,
  Megaphone,
  BarChart3,
  Settings,
  ChevronLeft,
  ChevronRight,
  Bell,
  Search,
  LogOut,
  User,
  Menu,
  X,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Badge } from "@/components/ui/badge";

const navItems = [
  { path: "/app/dashboard", icon: LayoutDashboard, label: "Dashboard" },
  { path: "/app/live-games", icon: Radio, label: "Live Games" },
  { path: "/app/campaigns", icon: Megaphone, label: "Campaigns" },
  { path: "/app/analytics", icon: BarChart3, label: "Analytics" },
  { path: "/app/settings", icon: Settings, label: "Settings" },
];

const LiveIndicator = () => (
  <div className="flex items-center gap-2 px-3 py-1.5 bg-ardito-green/10 border border-ardito-green/30 rounded-sm">
    <span className="relative flex h-2 w-2">
      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-ardito-green opacity-75"></span>
      <span className="relative inline-flex rounded-full h-2 w-2 bg-ardito-green"></span>
    </span>
    <span className="text-ardito-green font-mono text-sm font-medium">2 GAMES LIVE</span>
  </div>
);

const Sidebar = ({ collapsed, onToggle }) => {
  const location = useLocation();

  return (
    <motion.aside
      initial={false}
      animate={{ width: collapsed ? 64 : 256 }}
      className="fixed left-0 top-16 h-[calc(100vh-64px)] bg-ardito-surface border-r border-white/10 z-40 hidden md:flex flex-col"
    >
      <nav className="flex-1 py-4">
        {navItems.map((item) => {
          const isActive = location.pathname === item.path || 
            (item.path !== "/dashboard" && location.pathname.startsWith(item.path));
          
          return (
            <NavLink
              key={item.path}
              to={item.path}
              data-testid={`nav-${item.label.toLowerCase().replace(' ', '-')}`}
              className={`flex items-center gap-3 px-4 py-3 mx-2 my-1 rounded-md transition-all duration-200 ${
                isActive
                  ? "bg-ardito-blue/20 text-ardito-blue border-l-2 border-ardito-blue"
                  : "text-muted-foreground hover:text-foreground hover:bg-white/5"
              }`}
            >
              <item.icon className="h-5 w-5 shrink-0" />
              <AnimatePresence>
                {!collapsed && (
                  <motion.span
                    initial={{ opacity: 0, width: 0 }}
                    animate={{ opacity: 1, width: "auto" }}
                    exit={{ opacity: 0, width: 0 }}
                    className="font-medium whitespace-nowrap overflow-hidden"
                  >
                    {item.label}
                  </motion.span>
                )}
              </AnimatePresence>
            </NavLink>
          );
        })}
      </nav>
      
      <div className="p-2 border-t border-white/10">
        <Button
          variant="ghost"
          size="sm"
          onClick={onToggle}
          data-testid="sidebar-toggle"
          className="w-full justify-center text-muted-foreground hover:text-foreground"
        >
          {collapsed ? <ChevronRight className="h-4 w-4" /> : <ChevronLeft className="h-4 w-4" />}
        </Button>
      </div>
    </motion.aside>
  );
};

const MobileNav = () => {
  const [open, setOpen] = useState(false);
  const location = useLocation();

  useEffect(() => {
    setOpen(false);
  }, [location]);

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button variant="ghost" size="icon" className="md:hidden" data-testid="mobile-menu-trigger">
          <Menu className="h-5 w-5" />
        </Button>
      </SheetTrigger>
      <SheetContent side="left" className="w-64 bg-ardito-surface border-white/10 p-0">
        <div className="flex items-center justify-between p-4 border-b border-white/10">
          <img 
            src="https://customer-assets.emergentagent.com/job_fan-pulse/artifacts/h7eqeolp_ardito_logo_offwhite.png" 
            alt="Ardito" 
            className="h-7 w-auto"
          />
          <Button variant="ghost" size="icon" onClick={() => setOpen(false)}>
            <X className="h-4 w-4" />
          </Button>
        </div>
        <nav className="py-4">
          {navItems.map((item) => {
            const isActive = location.pathname === item.path || 
              (item.path !== "/dashboard" && location.pathname.startsWith(item.path));
            
            return (
              <NavLink
                key={item.path}
                to={item.path}
                className={`flex items-center gap-3 px-4 py-3 mx-2 my-1 rounded-md transition-all ${
                  isActive
                    ? "bg-ardito-blue/20 text-ardito-blue"
                    : "text-muted-foreground hover:text-foreground hover:bg-white/5"
                }`}
              >
                <item.icon className="h-5 w-5" />
                <span className="font-medium">{item.label}</span>
              </NavLink>
            );
          })}
        </nav>
      </SheetContent>
    </Sheet>
  );
};

const TopBar = () => {
  const { user, logout } = useAuth();

  return (
    <header className="fixed top-0 left-0 right-0 h-16 bg-ardito-surface border-b border-white/10 z-50 flex items-center justify-between px-4">
      <div className="flex items-center gap-4">
        <MobileNav />
        <NavLink to="/app/dashboard" className="flex items-center gap-2">
          <img 
            src="https://customer-assets.emergentagent.com/job_fan-pulse/artifacts/h7eqeolp_ardito_logo_offwhite.png" 
            alt="Ardito" 
            className="h-8 w-auto"
          />
          <span className="text-muted-foreground text-sm font-normal hidden sm:inline">EIP</span>
        </NavLink>
      </div>

      <div className="hidden lg:flex items-center">
        <LiveIndicator />
      </div>

      <div className="flex items-center gap-3">
        <div className="relative hidden md:block">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Search..."
            data-testid="search-input"
            className="w-64 pl-9 bg-ardito-charcoal border-white/10 focus:border-ardito-blue"
          />
        </div>

        <Button variant="ghost" size="icon" className="relative" data-testid="notifications-btn">
          <Bell className="h-5 w-5" />
          <Badge className="absolute -top-1 -right-1 h-5 w-5 p-0 flex items-center justify-center bg-ardito-orange text-xs">
            3
          </Badge>
        </Button>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon" className="rounded-full" data-testid="user-menu-trigger">
              <div className="h-8 w-8 rounded-full bg-ardito-blue flex items-center justify-center">
                <span className="text-sm font-bold text-white">
                  {user?.name?.charAt(0).toUpperCase() || "U"}
                </span>
              </div>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-56 bg-ardito-surface border-white/10">
            <div className="px-3 py-2">
              <p className="font-medium">{user?.name}</p>
              <p className="text-sm text-muted-foreground">{user?.email}</p>
              {user?.company && (
                <p className="text-xs text-ardito-blue mt-1">{user?.company}</p>
              )}
            </div>
            <DropdownMenuSeparator className="bg-white/10" />
            <DropdownMenuItem asChild>
              <NavLink to="/app/settings" className="cursor-pointer">
                <User className="mr-2 h-4 w-4" />
                Account Settings
              </NavLink>
            </DropdownMenuItem>
            <DropdownMenuSeparator className="bg-white/10" />
            <DropdownMenuItem 
              onClick={logout} 
              className="text-red-400 focus:text-red-400 cursor-pointer"
              data-testid="logout-btn"
            >
              <LogOut className="mr-2 h-4 w-4" />
              Sign Out
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
};

const DashboardLayout = () => {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(() => {
    const saved = localStorage.getItem("sidebar_collapsed");
    return saved === "true";
  });

  useEffect(() => {
    localStorage.setItem("sidebar_collapsed", sidebarCollapsed);
  }, [sidebarCollapsed]);

  return (
    <div className="min-h-screen bg-ardito-charcoal">
      <TopBar />
      <Sidebar collapsed={sidebarCollapsed} onToggle={() => setSidebarCollapsed(!sidebarCollapsed)} />
      
      <main
        className={`pt-16 transition-all duration-300 ${
          sidebarCollapsed ? "md:pl-16" : "md:pl-64"
        }`}
      >
        <div className="p-4 md:p-6 max-w-[1440px] mx-auto">
          <Outlet />
        </div>
      </main>
    </div>
  );
};

export default DashboardLayout;
