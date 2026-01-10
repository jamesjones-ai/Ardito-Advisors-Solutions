import { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import { motion, useInView } from "framer-motion";
import {
  Zap,
  Target,
  TrendingUp,
  Radio,
  BarChart3,
  Users,
  Shield,
  Clock,
  ChevronRight,
  Play,
  CheckCircle2,
  ArrowRight,
  Smartphone,
  Monitor,
  Share2,
  DollarSign,
  Award,
  Heart,
  Building,
  Menu,
  X,
  Lock,
  Eye,
  Timer,
  Megaphone,
  ShieldCheck,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

// Enterprise color system
const COLORS = {
  blue: "#3B82F6",
  green: "#10B981",
  orange: "#F59E0B",
  emerald: "#10B981",
};

// Emotion colors for animations
const EMOTIONS = [
  { name: "EUPHORIA", color: COLORS.green, score: 94 },
  { name: "TENSION", color: COLORS.blue, score: 87 },
  { name: "PRIDE", color: COLORS.orange, score: 78 },
  { name: "ANXIETY", color: "#EF4444", score: 65 },
];

// Stats for hero
const HERO_STATS = [
  { value: "38%", label: "Avg Engagement Rate", sublabel: "vs 5% industry average" },
  { value: "8.5x", label: "Average ROI", sublabel: "vs 2.1x traditional" },
  { value: "<60s", label: "Activation Speed", sublabel: "detection to impression" },
];

// Value Props
const VALUE_PROPS = [
  {
    icon: Lock,
    title: "Own the Relationship",
    headline: "Stop Renting Your Audience from Big Tech",
    description: "Your fans post millions of reactions on Instagram, TikTok, and X during every game. Those platforms capture 100% of the monetization. Ardito flips the model: we monitor those posts, detect emotions, then activate YOUR sponsors on YOUR channels—stadium displays, mobile apps, and programmatic ads you control.",
    stats: ["2.4M+ posts monitored daily", "100% revenue flows to you", "Schools earn 25% of activation fees"],
    color: "blue",
  },
  {
    icon: Zap,
    title: "Activate at Emotional Peaks",
    headline: "Stop Guessing—Activate When Fans Actually Care",
    description: "Traditional sports marketing schedules ads by time slots. Ardito schedules by emotion. Our multi-modal AI analyzes text, images, and video from millions of posts to detect collective emotions in under 60 seconds—then triggers campaigns across all channels simultaneously.",
    stats: ["38% avg engagement rate", "3-5x higher CTR than random", "<60s detection-to-activation"],
    color: "green",
  },
  {
    icon: BarChart3,
    title: "Prove ROI to Every Sponsor",
    headline: "Transparent Attribution from Emotion to Conversion",
    description: "No more 'brand awareness' handwaving. Ardito tracks every dollar: emotion detected → campaign activated → fan engaged → action taken. Show sponsors exactly which emotions drive conversions, which schools perform best, and which channels deliver results.",
    stats: ["8.5x average campaign ROI", "95% sponsor renewal rate", "Complete attribution dashboard"],
    color: "orange",
  },
];

// Walk-off timeline
const WALKOFF_TIMELINE = [
  { time: "T+0s", title: "The Moment", description: "Walk-off grand slam. Stadium erupts. 38,000 fans pull out their phones.", highlight: false },
  { time: "T+5-30s", title: "The Flood", description: "2,847 fans post to Instagram, TikTok, and X. Selfies, videos, reactions. Ardito ingests every post.", highlight: false },
  { time: "T+30-45s", title: "The Detection", description: "Multi-modal AI analyzes text sentiment, facial expressions, crowd audio. Collective emotion: 94% EUPHORIA.", highlight: true },
  { time: "T+45-60s", title: "The Activation", description: "Jumbotron displays campaign. 18,492 mobile push notifications. 847,000 social ad impressions launched.", highlight: true },
  { time: "T+2 hours", title: "The Revenue", description: "3,977 redemptions. $56,550 attributed revenue. 9.1x ROI. Complete attribution chain.", highlight: false },
];

// Channels
const CHANNELS = [
  { icon: Monitor, name: "Stadium Displays", desc: "Jumbotrons & ribbon boards", stat: "38K live impressions" },
  { icon: Smartphone, name: "Mobile Push", desc: "In-app notifications", stat: "39% CTR" },
  { icon: Share2, name: "Social Ads", desc: "Instagram, TikTok, X", stat: "28% engagement" },
  { icon: Radio, name: "Broadcast", desc: "TV & streaming overlays", stat: "Real-time sync" },
];

// Testimonials
const TESTIMONIALS = [
  { quote: "We've tried programmatic sports advertising before. Nothing comes close to the engagement rates we see when activating at emotional peaks. It's a game-changer.", author: "Marketing Director", company: "Fortune 500 Beverage Brand", metric: "3.2x lift in brand recall" },
  { quote: "The ROI speaks for itself. Our Victory Discount campaign generated more revenue in one weekend than our entire Q3 digital spend.", author: "VP of Sports Marketing", company: "National QSR Chain", metric: "892% ROI on first campaign" },
  { quote: "Finally, sponsorship that's measurable. We can show our CMO exactly which emotional moments drove the most conversions.", author: "Brand Partnerships Lead", company: "Athletic Apparel Company", metric: "47% reduction in CAC" },
];

// FAQ
const FAQS = [
  { q: "This sounds like surveillance", a: "We only monitor public posts—the same content anyone can see on Instagram, TikTok, or X. We don't access private accounts, DMs, or any non-public information. We delete content within 24 hours and only retain anonymized emotion scores." },
  { q: "How is this different from social listening tools?", a: "Social listening tools ANALYZE past sentiment for insights. Ardito ACTIVATES campaigns in real-time based on detected emotions. We're not just monitoring—we're taking action in under 60 seconds across stadium, mobile, and programmatic channels." },
  { q: "What if the AI gets the emotion wrong?", a: "Our multi-modal AI achieves 85%+ accuracy with confidence thresholds (only activate at 80%+). Even at 85% accuracy, we're 3-5x better than random timing. Plus brands can review all activations and set manual approval if desired." },
  { q: "This seems expensive", a: "It's performance-based. You pay for results (20% of ad spend), not impressions. Traditional sports marketing delivers 2.1x ROI. Ardito delivers 8.5x ROI. Even at 20% activation fee, you're 4x better off." },
];

// Trust logos (enterprise brands)
const TRUST_LOGOS = [
  "SEC Conference", "Big Ten", "ACC", "Pac-12", "Fortune 500 Brands", "20+ National Sponsors"
];

// Logo component
const Logo = ({ className = "h-8" }) => (
  <img src="https://customer-assets.emergentagent.com/job_fan-pulse/artifacts/h7eqeolp_ardito_logo_offwhite.png" alt="Ardito Advisors" className={className} />
);

// Trust Marquee Component
const TrustMarquee = () => (
  <div className="py-12 border-y border-white/5 bg-ardito-surface/50">
    <div className="max-w-7xl mx-auto px-6">
      <p className="text-center text-xs font-mono uppercase tracking-[0.2em] text-gray-500 mb-8">
        Trusted by leading athletic programs and Fortune 500 brands
      </p>
      <div className="flex flex-wrap justify-center items-center gap-x-12 gap-y-6">
        {TRUST_LOGOS.map((logo) => (
          <div key={logo} className="text-gray-400 font-medium text-sm opacity-60 hover:opacity-100 transition-opacity">
            {logo}
          </div>
        ))}
      </div>
      <div className="flex justify-center items-center gap-8 mt-8 pt-8 border-t border-white/5">
        <div className="flex items-center gap-2 text-gray-500 text-xs">
          <ShieldCheck className="h-4 w-4" />
          <span>SOC 2 Compliant</span>
        </div>
        <div className="flex items-center gap-2 text-gray-500 text-xs">
          <Shield className="h-4 w-4" />
          <span>GDPR Ready</span>
        </div>
        <div className="flex items-center gap-2 text-gray-500 text-xs">
          <Lock className="h-4 w-4" />
          <span>Enterprise Security</span>
        </div>
      </div>
    </div>
  </div>
);

// Animated emotion ticker (refined)
const EmotionTicker = () => {
  const [activeIndex, setActiveIndex] = useState(0);
  useEffect(() => {
    const interval = setInterval(() => setActiveIndex((prev) => (prev + 1) % EMOTIONS.length), 2500);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="flex items-center gap-2 flex-wrap">
      {EMOTIONS.map((emotion, i) => (
        <motion.div
          key={emotion.name}
          animate={{ opacity: i === activeIndex ? 1 : 0.4 }}
          className="px-3 py-1.5 rounded font-mono text-xs border"
          style={{
            backgroundColor: i === activeIndex ? `${emotion.color}15` : "transparent",
            color: i === activeIndex ? emotion.color : "#6B7280",
            borderColor: i === activeIndex ? `${emotion.color}40` : "transparent",
          }}
        >
          {emotion.name} {emotion.score}%
        </motion.div>
      ))}
    </div>
  );
};

// Live Game Visualization (enterprise style)
const LiveGameViz = () => {
  const [emotion, setEmotion] = useState(78);
  const [activated, setActivated] = useState(false);

  useEffect(() => {
    const interval = setInterval(() => {
      setEmotion((prev) => {
        const next = Math.min(100, prev + Math.random() * 8);
        if (next > 85 && !activated) setActivated(true);
        return next > 98 ? 78 : next;
      });
      if (emotion < 80) setActivated(false);
    }, 1500);
    return () => clearInterval(interval);
  }, [emotion, activated]);

  return (
    <div className="relative rounded-2xl border border-white/10 bg-white/[0.02] backdrop-blur-sm p-6 overflow-hidden">
      {/* Subtle glow */}
      <div className="absolute -top-20 -right-20 w-40 h-40 bg-blue-500/10 rounded-full blur-3xl" />
      
      <div className="relative">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-2">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-500 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
            </span>
            <span className="text-xs text-emerald-500 font-mono tracking-wider">LIVE MONITORING</span>
          </div>
          <span className="text-xs text-gray-500">Ole Miss vs Alabama • 9th Inning</span>
        </div>

        <div className="flex items-center justify-center gap-8 mb-8">
          <div className="text-center">
            <div className="h-12 w-12 bg-red-900/30 rounded-lg flex items-center justify-center mb-2 mx-auto border border-red-900/50">
              <span className="font-bold text-red-400 text-sm">OLE</span>
            </div>
            <span className="font-mono text-2xl font-bold text-white">7</span>
          </div>
          <span className="text-gray-600 text-lg">vs</span>
          <div className="text-center">
            <div className="h-12 w-12 bg-red-800/30 rounded-lg flex items-center justify-center mb-2 mx-auto border border-red-800/50">
              <span className="font-bold text-red-300 text-sm">ALA</span>
            </div>
            <span className="font-mono text-2xl font-bold text-white">4</span>
          </div>
        </div>

        <div className="space-y-3 mb-6">
          <div className="flex items-center justify-between text-sm">
            <span className="text-gray-500">Collective Emotion</span>
            <span className="font-mono font-semibold" style={{ color: emotion > 85 ? COLORS.green : COLORS.blue }}>
              {Math.round(emotion)}% {emotion > 85 ? "EUPHORIA" : "TENSION"}
            </span>
          </div>
          <div className="h-2 bg-white/5 rounded-full overflow-hidden relative">
            <motion.div
              animate={{ width: `${emotion}%` }}
              transition={{ duration: 0.5 }}
              className="h-full rounded-full"
              style={{ background: emotion > 85 ? `linear-gradient(90deg, ${COLORS.blue}, ${COLORS.green})` : COLORS.blue }}
            />
            <div className="absolute top-0 h-full w-px bg-orange-500" style={{ left: "85%" }} />
          </div>
          <div className="flex justify-between text-xs text-gray-600">
            <span>Monitoring 2,847 posts</span>
            <span className="text-orange-500">Threshold: 85%</span>
          </div>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: activated ? 1 : 0, y: activated ? 0 : 10 }}
          className="bg-emerald-500/10 border border-emerald-500/30 rounded-lg p-3"
        >
          <div className="flex items-center gap-3">
            <div className="h-8 w-8 rounded-full bg-emerald-500/20 flex items-center justify-center">
              <CheckCircle2 className="h-4 w-4 text-emerald-500" />
            </div>
            <div>
              <p className="text-sm font-medium text-emerald-400">Campaign Activated</p>
              <p className="text-xs text-gray-500">Victory Discount • Stadium + Mobile + Social</p>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

// Value Prop Visualizations
const OwnRelationshipViz = () => (
  <div className="rounded-2xl border border-white/10 bg-white/[0.02] backdrop-blur-sm p-6 h-full flex flex-col justify-center">
    <div className="space-y-4">
      <div className="flex justify-center gap-3">
        {["IG", "TikTok", "X"].map((p) => (
          <div key={p} className="px-3 py-2 bg-white/5 border border-white/10 rounded text-xs text-gray-400">{p}</div>
        ))}
      </div>
      <div className="flex justify-center">
        <div className="h-8 w-px bg-gradient-to-b from-gray-600 to-blue-500 relative">
          <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-blue-500" />
        </div>
      </div>
      <div className="flex justify-center">
        <div className="px-5 py-3 bg-blue-500/10 border border-blue-500/30 rounded-lg text-center">
          <span className="text-blue-400 font-mono text-sm font-semibold">ARDITO EIP</span>
          <p className="text-xs text-gray-500 mt-1">Emotion Detection</p>
        </div>
      </div>
      <div className="flex justify-center">
        <div className="h-8 w-px bg-gradient-to-b from-blue-500 to-emerald-500 relative">
          <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-emerald-500" />
        </div>
      </div>
      <div className="flex justify-center gap-3">
        {["Stadium", "App", "Ads"].map((c) => (
          <div key={c} className="px-3 py-2 bg-emerald-500/10 border border-emerald-500/30 rounded text-xs text-emerald-400 font-medium">{c}</div>
        ))}
      </div>
      <p className="text-center text-xs text-gray-500">Revenue flows to <span className="text-emerald-400 font-semibold">YOU</span></p>
    </div>
  </div>
);

const EmotionalPeaksViz = () => {
  const [level, setLevel] = useState(45);
  const [triggered, setTriggered] = useState(false);

  useEffect(() => {
    const interval = setInterval(() => {
      setLevel((prev) => {
        const next = prev + (Math.random() * 15 - 5);
        const clamped = Math.max(30, Math.min(95, next));
        if (clamped > 80 && !triggered) {
          setTriggered(true);
          setTimeout(() => setTriggered(false), 2000);
        }
        return clamped;
      });
    }, 800);
    return () => clearInterval(interval);
  }, [triggered]);

  return (
    <div className="rounded-2xl border border-white/10 bg-white/[0.02] backdrop-blur-sm p-6 h-full flex flex-col justify-center">
      <div className="space-y-5">
        <div className="flex items-center justify-between">
          <span className="text-xs text-gray-500 font-mono tracking-wider">EMOTION LEVEL</span>
          <span className={`text-xs font-mono ${level > 80 ? 'text-emerald-400' : 'text-blue-400'}`}>
            {level > 80 ? 'PEAK DETECTED' : 'MONITORING...'}
          </span>
        </div>
        <div className="space-y-2">
          <div className="h-3 bg-white/5 rounded-full overflow-hidden relative">
            <motion.div animate={{ width: `${level}%` }} className={`h-full rounded-full ${level > 80 ? 'bg-gradient-to-r from-blue-500 to-emerald-500' : 'bg-blue-500'}`} />
            <div className="absolute top-0 bottom-0 left-[80%] w-px bg-orange-500" />
          </div>
          <div className="flex justify-between text-[10px] text-gray-600">
            <span>0%</span>
            <span className="text-orange-500">Threshold: 80%</span>
            <span>100%</span>
          </div>
        </div>
        <div className="text-center">
          <span className="font-mono text-4xl font-bold" style={{ color: level > 80 ? COLORS.green : COLORS.blue }}>{Math.round(level)}%</span>
          <p className="text-sm text-gray-500 mt-1">{level > 80 ? 'EUPHORIA' : level > 60 ? 'TENSION' : 'ANTICIPATION'}</p>
        </div>
        <motion.div
          animate={{ opacity: triggered ? 1 : 0.3 }}
          className={`p-3 rounded-lg border ${triggered ? 'bg-emerald-500/10 border-emerald-500/30' : 'bg-white/5 border-white/10'}`}
        >
          <div className="flex items-center justify-between">
            <span className={`text-sm font-medium ${triggered ? 'text-emerald-400' : 'text-gray-500'}`}>
              {triggered ? 'Campaign Triggered!' : 'Waiting for peak...'}
            </span>
            <span className="text-xs font-mono text-gray-600">&lt;60s</span>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

const ProveROIViz = () => (
  <div className="rounded-2xl border border-white/10 bg-white/[0.02] backdrop-blur-sm p-6 h-full flex flex-col justify-center">
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-3">
        <div className="bg-white/5 border border-white/10 rounded-xl p-4">
          <p className="text-xs text-gray-500">Attributed Revenue</p>
          <p className="font-mono text-xl font-bold text-emerald-400">$56,550</p>
        </div>
        <div className="bg-white/5 border border-white/10 rounded-xl p-4">
          <p className="text-xs text-gray-500">Campaign ROI</p>
          <p className="font-mono text-xl font-bold text-emerald-400">9.1x</p>
        </div>
      </div>
      <div className="space-y-1">
        <p className="text-xs text-gray-500 font-mono tracking-wider">ATTRIBUTION CHAIN</p>
        {[
          { label: "Emotion Detected", value: "EUPHORIA 94%", color: "text-emerald-400" },
          { label: "Campaign Activated", value: "3 channels", color: "text-blue-400" },
          { label: "Impressions", value: "847K", color: "text-blue-400" },
          { label: "Engagements", value: "35.2%", color: "text-emerald-400" },
          { label: "Conversions", value: "3,977", color: "text-emerald-400" },
        ].map((item) => (
          <div key={item.label} className="flex items-center justify-between py-1.5 border-b border-white/5">
            <span className="text-xs text-gray-500">{item.label}</span>
            <span className={`text-xs font-mono font-medium ${item.color}`}>{item.value}</span>
          </div>
        ))}
      </div>
      <div className="bg-blue-500/10 border border-blue-500/20 rounded-lg p-2 text-center">
        <span className="text-xs text-gray-400">vs. Traditional: </span>
        <span className="text-xs font-semibold text-blue-400">4.3x better ROI</span>
      </div>
    </div>
  </div>
);

// Section wrapper
const Section = ({ children, className = "", id = "" }) => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <motion.section
      ref={ref}
      id={id}
      initial={{ opacity: 0, y: 30 }}
      animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
      transition={{ duration: 0.6 }}
      className={className}
    >
      {children}
    </motion.section>
  );
};

const LandingPage = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [openFaq, setOpenFaq] = useState(null);

  return (
    <div className="min-h-screen bg-ardito-charcoal relative" data-testid="landing-page">
      {/* Noise overlay */}
      <div className="fixed inset-0 noise-overlay pointer-events-none z-50" />
      
      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-40 border-b border-white/5 bg-ardito-charcoal/80 backdrop-blur-xl">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <Logo className="h-7 w-auto" />
            
            <div className="hidden md:flex items-center gap-10">
              <a href="#how-it-works" className="text-sm text-gray-400 hover:text-white transition-colors">How It Works</a>
              <a href="#use-case" className="text-sm text-gray-400 hover:text-white transition-colors">Use Cases</a>
              <a href="#results" className="text-sm text-gray-400 hover:text-white transition-colors">Results</a>
              <a href="#faq" className="text-sm text-gray-400 hover:text-white transition-colors">FAQ</a>
            </div>

            <div className="hidden md:flex items-center gap-4">
              <Link to="/login">
                <Button variant="ghost" size="sm" className="text-gray-400 hover:text-white">Client Login</Button>
              </Link>
              <a href="#contact">
                <Button size="sm" className="bg-blue-600 hover:bg-blue-700 text-white shadow-[0_0_20px_rgba(59,130,246,0.25)]">
                  Schedule Demo
                </Button>
              </a>
            </div>

            <button className="md:hidden p-2 text-gray-400" onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
              {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>

        {mobileMenuOpen && (
          <div className="md:hidden bg-ardito-surface border-t border-white/5 p-4 space-y-4">
            <a href="#how-it-works" className="block text-sm text-gray-400" onClick={() => setMobileMenuOpen(false)}>How It Works</a>
            <a href="#use-case" className="block text-sm text-gray-400" onClick={() => setMobileMenuOpen(false)}>Use Cases</a>
            <a href="#results" className="block text-sm text-gray-400" onClick={() => setMobileMenuOpen(false)}>Results</a>
            <a href="#faq" className="block text-sm text-gray-400" onClick={() => setMobileMenuOpen(false)}>FAQ</a>
            <div className="pt-4 border-t border-white/5 space-y-2">
              <Link to="/login" className="block"><Button variant="outline" className="w-full border-white/10">Client Login</Button></Link>
              <a href="#contact" className="block"><Button className="w-full bg-blue-600">Schedule Demo</Button></a>
            </div>
          </div>
        )}
      </nav>

      {/* Hero Section */}
      <section className="relative pt-32 pb-20 px-6 lg:px-8 min-h-[90vh] flex items-center">
        {/* Background image with overlay */}
        <div className="absolute inset-0 z-0">
          <div 
            className="absolute inset-0 bg-cover bg-center opacity-20"
            style={{ backgroundImage: "url('https://images.unsplash.com/photo-1763854413165-1713bc5a7f4a?w=1920&q=80')" }}
          />
          <div className="absolute inset-0 bg-gradient-to-b from-ardito-charcoal/30 via-ardito-charcoal/80 to-ardito-charcoal" />
        </div>

        <div className="max-w-7xl mx-auto relative z-10">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div>
              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
                <Badge className="mb-6 bg-blue-500/10 text-blue-400 border-blue-500/30 font-mono text-xs tracking-wider">
                  EMOTION INTELLIGENCE FOR SPORTS
                </Badge>
                
                <h1 className="font-heading text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tighter leading-[1.1] mb-6 text-white">
                  Turn Fan Emotion Into{" "}
                  <span className="text-blue-400">Sponsorship</span>{" "}
                  <span className="text-emerald-400">Revenue</span>
                </h1>
                
                <p className="text-lg text-gray-400 mb-8 max-w-xl leading-relaxed">
                  Every second, thousands of fans post about your team on Instagram, TikTok, and X. 
                  Ardito detects when they're experiencing euphoria, tension, or pride—then triggers 
                  your sponsor campaigns at those exact emotional peaks.
                </p>
                
                <p className="text-base text-gray-300 mb-8">
                  Result: <span className="text-emerald-400 font-semibold">38% engagement rates</span> (vs. 5% industry average) 
                  and <span className="text-emerald-400 font-semibold">8.5x ROI</span>.
                </p>

                <div className="flex flex-col sm:flex-row gap-4 mb-10">
                  <a href="#contact">
                    <Button size="lg" className="bg-blue-600 hover:bg-blue-700 text-white text-base px-8 shadow-[0_0_30px_rgba(59,130,246,0.3)]">
                      Schedule Your Demo
                      <ArrowRight className="ml-2 h-5 w-5" />
                    </Button>
                  </a>
                  <a href="#how-it-works">
                    <Button size="lg" variant="outline" className="border-white/10 text-gray-300 hover:bg-white/5 text-base px-8">
                      See How It Works
                    </Button>
                  </a>
                </div>

                <EmotionTicker />
              </motion.div>
            </div>

            <motion.div initial={{ opacity: 0, x: 40 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.6, delay: 0.2 }}>
              <LiveGameViz />
            </motion.div>
          </div>
        </div>
      </section>

      {/* Trust Signals */}
      <TrustMarquee />

      {/* Stats Row */}
      <section className="py-20 px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {HERO_STATS.map((stat, i) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.1 }}
                className="text-center p-8 rounded-2xl border border-white/5 bg-white/[0.02]"
              >
                <p className="font-mono text-4xl sm:text-5xl font-bold text-blue-400 mb-2">{stat.value}</p>
                <p className="font-medium text-white">{stat.label}</p>
                <p className="text-sm text-gray-500">{stat.sublabel}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Value Props Section */}
      <Section id="how-it-works" className="py-24 px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <p className="text-xs font-mono uppercase tracking-[0.2em] text-blue-400 mb-4">Why Ardito</p>
            <h2 className="font-heading text-3xl sm:text-4xl font-bold tracking-tight text-white mb-4">
              The Emotion Intelligence Advantage
            </h2>
            <p className="text-gray-400 max-w-2xl mx-auto">Stop guessing when fans care. Start knowing.</p>
          </div>

          <div className="space-y-20">
            {VALUE_PROPS.map((prop, i) => (
              <motion.div
                key={prop.title}
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6 }}
                className={`grid lg:grid-cols-2 gap-12 items-center ${i % 2 === 1 ? 'lg:grid-flow-dense' : ''}`}
              >
                <div className={i % 2 === 1 ? 'lg:col-start-2' : ''}>
                  <p className="text-xs font-mono uppercase tracking-[0.2em] text-blue-400 mb-3">{prop.title}</p>
                  <h3 className="font-heading text-2xl lg:text-3xl font-bold tracking-tight text-white mb-4">{prop.headline}</h3>
                  <p className="text-gray-400 text-lg mb-6 leading-relaxed">{prop.description}</p>
                  <ul className="space-y-3">
                    {prop.stats.map((stat) => (
                      <li key={stat} className="flex items-center gap-3">
                        <CheckCircle2 className="h-5 w-5 text-emerald-500 shrink-0" />
                        <span className="text-gray-300">{stat}</span>
                      </li>
                    ))}
                  </ul>
                </div>
                <div className={`h-80 ${i % 2 === 1 ? 'lg:col-start-1' : ''}`}>
                  {i === 0 && <OwnRelationshipViz />}
                  {i === 1 && <EmotionalPeaksViz />}
                  {i === 2 && <ProveROIViz />}
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </Section>

      {/* Walk-Off Use Case */}
      <Section id="use-case" className="py-24 px-6 lg:px-8 bg-ardito-surface/30">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <p className="text-xs font-mono uppercase tracking-[0.2em] text-orange-400 mb-4">Real-World Example</p>
            <h2 className="font-heading text-3xl sm:text-4xl font-bold tracking-tight text-white mb-4">
              The Walk-Off Win: <span className="text-emerald-400">$18,000 in 60 Seconds</span>
            </h2>
            <p className="text-gray-400 max-w-3xl mx-auto">
              Saturday night. #14 Ole Miss vs. #3 Alabama. Bottom of the 9th. Bases loaded. Two outs. 
              Ole Miss down by one. The next 60 seconds will generate $18,000 in sponsor revenue.
            </p>
          </div>

          <div className="grid lg:grid-cols-2 gap-12 items-start">
            <div className="space-y-4">
              {WALKOFF_TIMELINE.map((step, i) => (
                <motion.div
                  key={step.time}
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.4, delay: i * 0.1 }}
                  className={`flex gap-4 p-4 rounded-xl border ${step.highlight ? "bg-emerald-500/5 border-emerald-500/20" : "bg-white/[0.02] border-white/5"}`}
                >
                  <div className="shrink-0">
                    <span className={`font-mono text-sm font-semibold ${step.highlight ? "text-emerald-400" : "text-blue-400"}`}>{step.time}</span>
                  </div>
                  <div>
                    <h4 className="font-semibold text-white mb-1">{step.title}</h4>
                    <p className="text-sm text-gray-400">{step.description}</p>
                  </div>
                </motion.div>
              ))}
            </div>

            <div className="lg:sticky lg:top-24">
              <div className="rounded-2xl border border-white/10 bg-white/[0.02] backdrop-blur-sm p-6">
                <h3 className="text-xs font-mono uppercase tracking-[0.2em] text-gray-500 mb-6">Campaign Results</h3>
                
                <div className="space-y-6">
                  <div>
                    <p className="text-xs text-gray-500 uppercase tracking-wider mb-2">Emotion Trigger</p>
                    <div className="flex gap-2">
                      <Badge className="bg-emerald-500/10 text-emerald-400 border-emerald-500/30">Euphoria 94%</Badge>
                      <Badge variant="outline" className="border-white/10 text-gray-400">Walk-off Grand Slam</Badge>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    {[
                      { label: "Stadium Reach", value: "38K" },
                      { label: "Social Impressions", value: "847K" },
                      { label: "Engagement Rate", value: "35%", highlight: true },
                      { label: "ROI", value: "9.1x", highlight: true },
                    ].map((m) => (
                      <div key={m.label} className="bg-white/5 rounded-xl p-3">
                        <p className={`text-xl font-mono font-bold ${m.highlight ? 'text-emerald-400' : 'text-white'}`}>{m.value}</p>
                        <p className="text-xs text-gray-500">{m.label}</p>
                      </div>
                    ))}
                  </div>

                  <div className="border-t border-white/5 pt-4">
                    <div className="flex justify-between items-center">
                      <span className="text-gray-400">Attributed Revenue</span>
                      <span className="font-mono text-2xl font-bold text-emerald-400">$56,550</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </Section>

      {/* Channels */}
      <Section className="py-24 px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="font-heading text-3xl sm:text-4xl font-bold tracking-tight text-white mb-4">
              One Trigger, <span className="text-emerald-400">Four Channels</span>, Instant Sync
            </h2>
            <p className="text-gray-400 max-w-2xl mx-auto">When emotions peak, your campaign activates everywhere simultaneously.</p>
          </div>

          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            {CHANNELS.map((channel, i) => (
              <motion.div
                key={channel.name}
                initial={{ opacity: 0, scale: 0.95 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: i * 0.1 }}
                className="group rounded-2xl border border-white/5 bg-white/[0.02] p-6 text-center hover:border-emerald-500/30 hover:bg-emerald-500/5 transition-all duration-300"
              >
                <div className="h-12 w-12 rounded-xl bg-emerald-500/10 flex items-center justify-center mx-auto mb-4 group-hover:bg-emerald-500/20 transition-colors">
                  <channel.icon className="h-6 w-6 text-emerald-400" />
                </div>
                <h3 className="font-semibold text-white mb-1">{channel.name}</h3>
                <p className="text-sm text-gray-500 mb-3">{channel.desc}</p>
                <p className="font-mono text-sm text-emerald-400">{channel.stat}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </Section>

      {/* Testimonials */}
      <Section id="results" className="py-24 px-6 lg:px-8 bg-ardito-surface/30">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <p className="text-xs font-mono uppercase tracking-[0.2em] text-blue-400 mb-4">Proven Results</p>
            <h2 className="font-heading text-3xl sm:text-4xl font-bold tracking-tight text-white">What Industry Leaders Say</h2>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            {TESTIMONIALS.map((t, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.1 }}
                className="rounded-2xl border border-white/5 bg-white/[0.02] p-6"
              >
                <Badge className="mb-4 bg-emerald-500/10 text-emerald-400 border-emerald-500/30 font-mono text-xs">{t.metric}</Badge>
                <blockquote className="text-gray-400 mb-6 italic leading-relaxed">"{t.quote}"</blockquote>
                <div>
                  <p className="font-medium text-white">{t.author}</p>
                  <p className="text-sm text-gray-500">{t.company}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </Section>

      {/* FAQ */}
      <Section id="faq" className="py-24 px-6 lg:px-8">
        <div className="max-w-3xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="font-heading text-3xl sm:text-4xl font-bold tracking-tight text-white">Common Questions</h2>
          </div>

          <div className="space-y-3">
            {FAQS.map((faq, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.3, delay: i * 0.05 }}
                className="rounded-xl border border-white/5 bg-white/[0.02] overflow-hidden"
              >
                <button
                  onClick={() => setOpenFaq(openFaq === i ? null : i)}
                  className="w-full px-6 py-4 text-left flex items-center justify-between hover:bg-white/5 transition-colors"
                >
                  <span className="font-medium text-white">{faq.q}</span>
                  <ChevronRight className={`h-5 w-5 text-gray-500 transition-transform duration-200 ${openFaq === i ? "rotate-90" : ""}`} />
                </button>
                {openFaq === i && (
                  <div className="px-6 pb-4">
                    <p className="text-gray-400 leading-relaxed">{faq.a}</p>
                  </div>
                )}
              </motion.div>
            ))}
          </div>
        </div>
      </Section>

      {/* CTA */}
      <Section id="contact" className="py-24 px-6 lg:px-8">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="font-heading text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-white mb-6">
            Ready to Stop Guessing and <span className="text-blue-400">Start Knowing</span>?
          </h2>
          <p className="text-lg text-gray-400 mb-8 max-w-2xl mx-auto">
            See how Ardito can transform your sponsorship revenue in a 30-minute demo. 
            Join 60+ schools and 20+ Fortune 500 brands.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-10">
            <Button size="lg" className="bg-blue-600 hover:bg-blue-700 text-white text-base px-8 shadow-[0_0_30px_rgba(59,130,246,0.3)]">
              Schedule Your Demo
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
            <Button size="lg" variant="outline" className="border-white/10 text-gray-300 hover:bg-white/5 text-base px-8">
              Calculate ROI
            </Button>
          </div>

          <div className="flex flex-wrap justify-center gap-6 text-sm text-gray-500">
            {["No credit card required", "90-day pilot available", "2x engagement guarantee"].map((item) => (
              <span key={item} className="flex items-center gap-2">
                <CheckCircle2 className="h-4 w-4 text-emerald-500" />
                {item}
              </span>
            ))}
          </div>
        </div>
      </Section>

      {/* Footer */}
      <footer className="border-t border-white/5 py-12 px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-12">
            <div className="col-span-2 md:col-span-1">
              <Logo className="h-7 w-auto mb-4" />
              <p className="text-sm text-gray-500">The first real-time emotion intelligence platform for sports sponsorships.</p>
            </div>
            {[
              { title: "Platform", links: ["How It Works", "Use Cases", "Results", "Security"] },
              { title: "Company", links: ["About", "Careers", "Blog", "Contact"] },
              { title: "Legal", links: ["Privacy Policy", "Terms of Service", "Compliance"] },
            ].map((col) => (
              <div key={col.title}>
                <h4 className="font-semibold text-white mb-4">{col.title}</h4>
                <ul className="space-y-2 text-sm text-gray-500">
                  {col.links.map((link) => (
                    <li key={link}><a href="#" className="hover:text-white transition-colors">{link}</a></li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
          <div className="border-t border-white/5 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-sm text-gray-500">© {new Date().getFullYear()} Ardito Advisors. All rights reserved.</p>
            <div className="flex gap-6 text-sm">
              <a href="#" className="text-gray-500 hover:text-white transition-colors">LinkedIn</a>
              <a href="#" className="text-gray-500 hover:text-white transition-colors">Twitter</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;
