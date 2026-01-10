import { useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { motion } from "framer-motion";
import { toast } from "sonner";
import { Eye, EyeOff, Zap, TrendingUp, Radio } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";

const stats = [
  { icon: Zap, value: "2.4M", label: "emotion-targeted impressions today" },
  { icon: TrendingUp, value: "38%", label: "average engagement rate" },
  { icon: Radio, value: "120+", label: "live games monitored" },
];

const LoginPage = () => {
  const { login, register } = useAuth();
  const [isLogin, setIsLogin] = useState(true);
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    name: "",
    company: "",
    remember: false,
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (isLogin) {
        await login(formData.email, formData.password);
        toast.success("Welcome back!");
      } else {
        await register(formData.email, formData.password, formData.name, formData.company);
        toast.success("Account created successfully!");
      }
    } catch (error) {
      const message = error.response?.data?.detail || "Authentication failed";
      toast.error(message);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  return (
    <div className="min-h-screen flex" data-testid="login-page">
      {/* Left Panel - Form */}
      <div className="w-full lg:w-2/5 bg-ardito-charcoal flex flex-col justify-center p-8 md:p-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-md mx-auto w-full"
        >
          {/* Logo */}
          <div className="mb-8">
            <img 
              src="https://customer-assets.emergentagent.com/job_fan-pulse/artifacts/hhzulj1x_Ardito%20Advisors%20-up%20PNG%20medium%20%281%29.png" 
              alt="Ardito" 
              className="h-12 w-auto mb-2"
            />
            <p className="text-muted-foreground text-sm mt-1">Emotion Intelligence Platform</p>
          </div>

          {/* Heading */}
          <div className="mb-8">
            <h2 className="font-heading text-2xl font-bold text-foreground">
              {isLogin ? "Welcome to Emotion Intelligence" : "Create Your Account"}
            </h2>
            <p className="text-muted-foreground mt-2">
              {isLogin
                ? "Activate sponsors when fans feel it most"
                : "Start driving emotional engagement today"}
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-5">
            {!isLogin && (
              <>
                <div className="space-y-2">
                  <Label htmlFor="name">Full Name</Label>
                  <Input
                    id="name"
                    name="name"
                    type="text"
                    placeholder="John Smith"
                    value={formData.name}
                    onChange={handleChange}
                    required={!isLogin}
                    data-testid="name-input"
                    className="bg-ardito-surface border-white/10 focus:border-ardito-blue"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="company">Company (Optional)</Label>
                  <Input
                    id="company"
                    name="company"
                    type="text"
                    placeholder="Acme Corp"
                    value={formData.company}
                    onChange={handleChange}
                    data-testid="company-input"
                    className="bg-ardito-surface border-white/10 focus:border-ardito-blue"
                  />
                </div>
              </>
            )}

            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                name="email"
                type="email"
                placeholder="you@company.com"
                value={formData.email}
                onChange={handleChange}
                required
                data-testid="email-input"
                className="bg-ardito-surface border-white/10 focus:border-ardito-blue"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <div className="relative">
                <Input
                  id="password"
                  name="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="••••••••"
                  value={formData.password}
                  onChange={handleChange}
                  required
                  data-testid="password-input"
                  className="bg-ardito-surface border-white/10 focus:border-ardito-blue pr-10"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </div>

            {isLogin && (
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="remember"
                    name="remember"
                    checked={formData.remember}
                    onCheckedChange={(checked) =>
                      setFormData((prev) => ({ ...prev, remember: checked }))
                    }
                  />
                  <Label htmlFor="remember" className="text-sm font-normal cursor-pointer">
                    Remember me
                  </Label>
                </div>
                <button type="button" className="text-sm text-ardito-blue hover:underline">
                  Forgot password?
                </button>
              </div>
            )}

            <Button
              type="submit"
              disabled={loading}
              data-testid="submit-btn"
              className="w-full bg-ardito-blue hover:bg-blue-600 text-white font-bold uppercase tracking-wide rounded-sm shadow-[0_0_15px_rgba(0,102,255,0.3)]"
            >
              {loading ? "Please wait..." : isLogin ? "Sign In" : "Create Account"}
            </Button>
          </form>

          {/* Toggle */}
          <p className="mt-6 text-center text-muted-foreground text-sm">
            {isLogin ? "Don't have an account?" : "Already have an account?"}{" "}
            <button
              type="button"
              onClick={() => setIsLogin(!isLogin)}
              data-testid="toggle-auth-mode"
              className="text-ardito-blue hover:underline font-medium"
            >
              {isLogin ? "Sign up" : "Sign in"}
            </button>
          </p>
        </motion.div>
      </div>

      {/* Right Panel - Hero */}
      <div
        className="hidden lg:flex w-3/5 relative overflow-hidden"
        style={{
          background: "linear-gradient(135deg, #0066FF 0%, #FF6B00 100%)",
        }}
      >
        {/* Background Image Overlay */}
        <div
          className="absolute inset-0 opacity-20"
          style={{
            backgroundImage: "url('https://images.unsplash.com/photo-1763854413165-1713bc5a7f4a?w=1920&q=80')",
            backgroundSize: "cover",
            backgroundPosition: "center",
          }}
        />

        {/* Content */}
        <div className="relative z-10 flex flex-col justify-center items-center w-full p-12">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2 }}
            className="text-center"
          >
            <h2 className="font-heading font-black text-5xl text-white mb-4 drop-shadow-lg">
              Emotion Intelligence
            </h2>
            <p className="text-white/90 text-xl max-w-md mx-auto">
              Activate sponsors at peak emotional moments. Drive engagement that matters.
            </p>
          </motion.div>

          {/* Stats Ticker */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="mt-12 grid grid-cols-1 gap-4 max-w-lg"
          >
            {stats.map((stat, index) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.5 + index * 0.1 }}
                className="flex items-center gap-4 bg-white/10 backdrop-blur-sm border border-white/20 rounded-md p-4"
              >
                <div className="h-12 w-12 rounded-md bg-white/20 flex items-center justify-center">
                  <stat.icon className="h-6 w-6 text-white" />
                </div>
                <div>
                  <p className="font-mono font-bold text-2xl text-white">{stat.value}</p>
                  <p className="text-white/80 text-sm">{stat.label}</p>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
