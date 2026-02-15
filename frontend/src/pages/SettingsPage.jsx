import { useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "sonner";
import { User, Shield, Bell, Save } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const SettingsPage = () => {
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [profileData, setProfileData] = useState({
    name: user?.name || "",
    email: user?.email || "",
    company: user?.company || "",
    phone: "",
    timezone: "America/New_York",
  });

  const [notifications, setNotifications] = useState({
    campaignActivated: true,
    highEngagement: true,
    budgetAlert: true,
    gameStarted: false,
    emailDigest: "daily",
  });

  const handleProfileSave = async () => {
    setLoading(true);
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1000));
    toast.success("Profile updated successfully");
    setLoading(false);
  };

  const handleNotificationsSave = async () => {
    setLoading(true);
    await new Promise((resolve) => setTimeout(resolve, 1000));
    toast.success("Notification preferences updated");
    setLoading(false);
  };

  return (
    <div className="space-y-6 max-w-4xl" data-testid="settings-page">
      {/* Header */}
      <div>
        <h1 className="font-heading text-2xl font-bold">Settings</h1>
        <p className="text-muted-foreground text-sm">
          Manage your account and preferences
        </p>
      </div>

      <Tabs defaultValue="profile" className="space-y-6">
        <TabsList className="bg-ardito-surface border border-white/10">
          <TabsTrigger value="profile" className="gap-2">
            <User className="h-4 w-4" />
            Profile
          </TabsTrigger>
          <TabsTrigger value="security" className="gap-2">
            <Shield className="h-4 w-4" />
            Security
          </TabsTrigger>
          <TabsTrigger value="notifications" className="gap-2">
            <Bell className="h-4 w-4" />
            Notifications
          </TabsTrigger>
        </TabsList>

        {/* Profile Tab */}
        <TabsContent value="profile" className="space-y-6">
          <div className="bg-ardito-surface border border-white/10 rounded-md p-6">
            <h2 className="font-heading font-bold mb-4">Profile Information</h2>
            <div className="space-y-4">
              <div className="flex items-center gap-4 mb-6">
                <div className="h-20 w-20 rounded-full bg-ardito-blue flex items-center justify-center">
                  <span className="text-2xl font-bold text-white">
                    {user?.name?.charAt(0).toUpperCase() || "U"}
                  </span>
                </div>
                <div>
                  <Button variant="outline" size="sm" className="border-white/10">
                    Upload Photo
                  </Button>
                  <p className="text-xs text-muted-foreground mt-1">
                    JPG, PNG (max 2MB)
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Full Name</Label>
                  <Input
                    id="name"
                    value={profileData.name}
                    onChange={(e) =>
                      setProfileData((prev) => ({ ...prev, name: e.target.value }))
                    }
                    className="bg-ardito-charcoal border-white/10"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    value={profileData.email}
                    disabled
                    className="bg-ardito-charcoal border-white/10 opacity-60"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="company">Company</Label>
                  <Input
                    id="company"
                    value={profileData.company}
                    onChange={(e) =>
                      setProfileData((prev) => ({ ...prev, company: e.target.value }))
                    }
                    className="bg-ardito-charcoal border-white/10"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="phone">Phone</Label>
                  <Input
                    id="phone"
                    type="tel"
                    value={profileData.phone}
                    onChange={(e) =>
                      setProfileData((prev) => ({ ...prev, phone: e.target.value }))
                    }
                    placeholder="+1 (555) 000-0000"
                    className="bg-ardito-charcoal border-white/10"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="timezone">Timezone</Label>
                <Select
                  value={profileData.timezone}
                  onValueChange={(value) =>
                    setProfileData((prev) => ({ ...prev, timezone: value }))
                  }
                >
                  <SelectTrigger className="w-full md:w-64 bg-ardito-charcoal border-white/10">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="bg-ardito-surface border-white/10">
                    <SelectItem value="America/New_York">Eastern (ET)</SelectItem>
                    <SelectItem value="America/Chicago">Central (CT)</SelectItem>
                    <SelectItem value="America/Denver">Mountain (MT)</SelectItem>
                    <SelectItem value="America/Los_Angeles">Pacific (PT)</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <Button
                onClick={handleProfileSave}
                disabled={loading}
                className="bg-ardito-blue hover:bg-blue-600"
              >
                <Save className="h-4 w-4 mr-2" />
                {loading ? "Saving..." : "Save Changes"}
              </Button>
            </div>
          </div>
        </TabsContent>

        {/* Security Tab */}
        <TabsContent value="security" className="space-y-6">
          <div className="bg-ardito-surface border border-white/10 rounded-md p-6">
            <h2 className="font-heading font-bold mb-4">Password</h2>
            <div className="space-y-4 max-w-md">
              <div className="space-y-2">
                <Label htmlFor="current_password">Current Password</Label>
                <Input
                  id="current_password"
                  type="password"
                  className="bg-ardito-charcoal border-white/10"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="new_password">New Password</Label>
                <Input
                  id="new_password"
                  type="password"
                  className="bg-ardito-charcoal border-white/10"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="confirm_password">Confirm New Password</Label>
                <Input
                  id="confirm_password"
                  type="password"
                  className="bg-ardito-charcoal border-white/10"
                />
              </div>
              <Button variant="outline" className="border-white/10">
                Update Password
              </Button>
            </div>
          </div>

          <div className="bg-ardito-surface border border-white/10 rounded-md p-6">
            <h2 className="font-heading font-bold mb-4">Two-Factor Authentication</h2>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm">Add an extra layer of security to your account</p>
                <p className="text-xs text-muted-foreground mt-1">
                  We'll ask for a verification code when you sign in
                </p>
              </div>
              <Button variant="outline" className="border-white/10">
                Enable 2FA
              </Button>
            </div>
          </div>

          <div className="bg-ardito-surface border border-red-500/30 rounded-md p-6">
            <h2 className="font-heading font-bold text-red-400 mb-4">Danger Zone</h2>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm">Delete your account</p>
                <p className="text-xs text-muted-foreground mt-1">
                  Once deleted, there is no going back
                </p>
              </div>
              <Button variant="destructive" className="bg-red-500 hover:bg-red-600">
                Delete Account
              </Button>
            </div>
          </div>
        </TabsContent>

        {/* Notifications Tab */}
        <TabsContent value="notifications" className="space-y-6">
          <div className="bg-ardito-surface border border-white/10 rounded-md p-6">
            <h2 className="font-heading font-bold mb-4">In-App Notifications</h2>
            <div className="space-y-4">
              {[
                {
                  id: "campaignActivated",
                  label: "Campaign Activated",
                  desc: "Get notified when your campaigns are triggered",
                },
                {
                  id: "highEngagement",
                  label: "High Engagement Alerts",
                  desc: "Alerts when campaigns hit exceptional engagement rates",
                },
                {
                  id: "budgetAlert",
                  label: "Budget Alerts",
                  desc: "Warnings when campaigns approach budget limits",
                },
                {
                  id: "gameStarted",
                  label: "Game Started",
                  desc: "Notifications when live games begin",
                },
              ].map((item) => (
                <div key={item.id} className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium">{item.label}</p>
                    <p className="text-xs text-muted-foreground">{item.desc}</p>
                  </div>
                  <Switch
                    checked={notifications[item.id]}
                    onCheckedChange={(checked) =>
                      setNotifications((prev) => ({ ...prev, [item.id]: checked }))
                    }
                  />
                </div>
              ))}
            </div>
          </div>

          <div className="bg-ardito-surface border border-white/10 rounded-md p-6">
            <h2 className="font-heading font-bold mb-4">Email Notifications</h2>
            <div className="space-y-2">
              <Label>Email Digest Frequency</Label>
              <Select
                value={notifications.emailDigest}
                onValueChange={(value) =>
                  setNotifications((prev) => ({ ...prev, emailDigest: value }))
                }
              >
                <SelectTrigger className="w-full md:w-64 bg-ardito-charcoal border-white/10">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="bg-ardito-surface border-white/10">
                  <SelectItem value="realtime">Real-time</SelectItem>
                  <SelectItem value="daily">Daily Digest</SelectItem>
                  <SelectItem value="weekly">Weekly Summary</SelectItem>
                  <SelectItem value="none">None</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <Button
              onClick={handleNotificationsSave}
              disabled={loading}
              className="bg-ardito-blue hover:bg-blue-600 mt-4"
            >
              <Save className="h-4 w-4 mr-2" />
              {loading ? "Saving..." : "Save Preferences"}
            </Button>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default SettingsPage;
