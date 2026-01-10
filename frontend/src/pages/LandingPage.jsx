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
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";

// Emotion colors for animations
const EMOTIONS = [
  { name: "EUPHORIA", color: "#00FF66", score: 94 },
  { name: "TENSION", color: "#0066FF", score: 87 },
  { name: "PRIDE", color: "#FFD700", score: 78 },
  { name: "ANXIETY", color: "#FF6B00", score: 65 },
];

// Stats for hero
const HERO_STATS = [
  { value: "38%", label: "Avg Engagement Rate", sublabel: "vs 5% industry average" },
  { value: "8.5x", label: "Average ROI", sublabel: "vs 2.1x traditional" },
  { value: "<60s", label: "Activation Speed", sublabel: "detection to impression" },
];

// Value Props - The "Why Ardito" Trifecta
const VALUE_PROPS = [
  {
    icon: Lock,
    title: "Own the Relationship",
    headline: "Stop Renting Your Audience from Big Tech",
    description: "Your fans post millions of reactions on Instagram, TikTok, and X during every game. Those platforms capture 100% of the monetization. Ardito flips the model: we monitor those posts, detect emotions, then activate YOUR sponsors on YOUR channels—stadium displays, mobile apps, and programmatic ads you control.",
    stats: [
      "2.4M+ posts monitored daily",
      "100% revenue flows to you",
      "Schools earn 25% of activation fees"
    ],
    color: "blue",
  },
  {
    icon: Zap,
    title: "Activate at Emotional Peaks",
    headline: "Stop Guessing—Activate When Fans Actually Care",
    description: "Traditional sports marketing schedules ads by time slots. Ardito schedules by emotion. Our multi-modal AI analyzes text, images, and video from millions of posts to detect collective emotions in under 60 seconds—then triggers campaigns across all channels simultaneously.",
    stats: [
      "38% avg engagement rate",
      "3-5x higher CTR than random",
      "<60s detection-to-activation"
    ],
    color: "green",
  },
  {
    icon: BarChart3,
    title: "Prove ROI to Every Sponsor",
    headline: "Transparent Attribution from Emotion to Conversion",
    description: "No more 'brand awareness' handwaving. Ardito tracks every dollar: emotion detected → campaign activated → fan engaged → action taken. Show sponsors exactly which emotions drive conversions, which schools perform best, and which channels deliver results.",
    stats: [
      "8.5x average campaign ROI",
      "95% sponsor renewal rate",
      "Complete attribution dashboard"
    ],
    color: "orange",
  },
];

// Walk-off scenario timeline
const WALKOFF_TIMELINE = [
  {
    time: "T+0s",
    title: "The Moment",
    description: "Walk-off grand slam. Stadium erupts. 38,000 fans pull out their phones.",
    highlight: false,
  },
  {
    time: "T+5-30s",
    title: "The Flood",
    description: "2,847 fans post to Instagram, TikTok, and X. Selfies, videos, reactions. Ardito ingests every post.",
    highlight: false,
  },
  {
    time: "T+30-45s",
    title: "The Detection",
    description: "Multi-modal AI analyzes text sentiment, facial expressions, crowd audio. Collective emotion: 94% EUPHORIA.",
    highlight: true,
  },
  {
    time: "T+45-60s",
    title: "The Activation",
    description: "Jumbotron displays campaign. 18,492 mobile push notifications. 847,000 social ad impressions launched.",
    highlight: true,
  },
  {
    time: "T+2 hours",
    title: "The Revenue",
    description: "3,977 redemptions. $56,550 attributed revenue. 9.1x ROI. Complete attribution chain.",
    highlight: false,
  },
];

// Channels
const CHANNELS = [
  { icon: Monitor, name: "Stadium Displays", desc: "Jumbotrons & ribbon boards", stat: "38K live impressions" },
  { icon: Smartphone, name: "Mobile Push", desc: "In-app notifications", stat: "39% CTR" },
  { icon: Share2, name: "Social Ads", desc: "Instagram, TikTok, X", stat: "28% engagement" },
  { icon: Radio, name: "Broadcast", desc: "TV & streaming overlays", stat: "Real-time sync" },
];

// Testimonials with metrics
const TESTIMONIALS = [
  {
    quote: "We've tried programmatic sports advertising before. Nothing comes close to the engagement rates we see when activating at emotional peaks. It's a game-changer.",
    author: "Marketing Director",
    company: "Fortune 500 Beverage Brand",
    metric: "3.2x lift in brand recall",
  },
  {
    quote: "The ROI speaks for itself. Our Victory Discount campaign generated more revenue in one weekend than our entire Q3 digital spend.",
    author: "VP of Sports Marketing",
    company: "National QSR Chain",
    metric: "892% ROI on first campaign",
  },
  {
    quote: "Finally, sponsorship that's measurable. We can show our CMO exactly which emotional moments drove the most conversions.",
    author: "Brand Partnerships Lead",
    company: "Athletic Apparel Company",
    metric: "47% reduction in CAC",
  },
];

// FAQ / Objections
const FAQS = [
  {
    q: "This sounds like surveillance",
    a: "We only monitor public posts—the same content anyone can see on Instagram, TikTok, or X. We don't access private accounts, DMs, or any non-public information. We delete content within 24 hours and only retain anonymized emotion scores."
  },
  {
    q: "How is this different from social listening tools?",
    a: "Social listening tools ANALYZE past sentiment for insights. Ardito ACTIVATES campaigns in real-time based on detected emotions. We're not just monitoring—we're taking action in under 60 seconds across stadium, mobile, and programmatic channels."
  },
  {
    q: "What if the AI gets the emotion wrong?",
    a: "Our multi-modal AI achieves 85%+ accuracy with confidence thresholds (only activate at 80%+). Even at 85% accuracy, we're 3-5x better than random timing. Plus brands can review all activations and set manual approval if desired."
  },
  {
    q: "This seems expensive",
    a: "It's performance-based. You pay for results (20% of ad spend), not impressions. Traditional sports marketing delivers 2.1x ROI. Ardito delivers 8.5x ROI. Even at 20% activation fee, you're 4x better off."
  },
];

// Logo component
const Logo = ({ className = "h-8" }) => (
  <img
    src="https://customer-assets.emergentagent.com/job_fan-pulse/artifacts/h7eqeolp_ardito_logo_offwhite.png"
    alt="Ardito Advisors"
    className={className}
  />
);

// Animated emotion ticker
const EmotionTicker = () => {
  const [activeIndex, setActiveIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setActiveIndex((prev) => (prev + 1) % EMOTIONS.length);
    }, 2000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="flex items-center gap-3 flex-wrap">
      {EMOTIONS.map((emotion, i) => (
        <motion.div
          key={emotion.name}
          animate={{
            scale: i === activeIndex ? 1.1 : 1,
            opacity: i === activeIndex ? 1 : 0.5,
          }}
          className="px-3 py-1.5 rounded-sm font-mono text-sm"
          style={{
            backgroundColor: i === activeIndex ? `${emotion.color}20` : "transparent",
            color: emotion.color,
            border: `1px solid ${i === activeIndex ? emotion.color : "transparent"}`,
          }}
        >
          {emotion.name} {emotion.score}%
        </motion.div>
      ))}
    </div>
  );
};

// Visualization 1: Own the Relationship - Data Flow
const OwnRelationshipViz = () => {
  return (
    <div className="bg-ardito-surface border border-white/10 rounded-xl h-64 lg:h-80 p-6 flex flex-col justify-center">
      <div className="space-y-4">
        {/* Social platforms row */}
        <div className="flex justify-center gap-3">
          {["Instagram", "TikTok", "X"].map((platform) => (
            <div key={platform} className="px-3 py-2 bg-white/5 border border-white/10 rounded-lg text-xs text-muted-foreground">
              {platform}
            </div>
          ))}
        </div>
        
        {/* Arrow down */}
        <div className="flex justify-center">
          <div className="h-8 w-0.5 bg-gradient-to-b from-white/20 to-ardito-blue relative">
            <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-ardito-blue" />
          </div>
        </div>
        
        {/* Ardito processing */}
        <div className="flex justify-center">
          <div className="px-6 py-3 bg-ardito-blue/20 border border-ardito-blue/50 rounded-lg">
            <span className="text-ardito-blue font-mono text-sm font-bold">ARDITO EIP</span>
            <p className="text-xs text-muted-foreground mt-1">Emotion Detection</p>
          </div>
        </div>
        
        {/* Arrow down */}
        <div className="flex justify-center">
          <div className="h-8 w-0.5 bg-gradient-to-b from-ardito-blue to-ardito-green relative">
            <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-ardito-green" />
          </div>
        </div>
        
        {/* Your channels row */}
        <div className="flex justify-center gap-3">
          {["Stadium", "Mobile App", "Your Ads"].map((channel) => (
            <div key={channel} className="px-3 py-2 bg-ardito-green/10 border border-ardito-green/30 rounded-lg text-xs text-ardito-green font-medium">
              {channel}
            </div>
          ))}
        </div>
        
        {/* Revenue indicator */}
        <div className="text-center pt-2">
          <span className="text-xs text-muted-foreground">Revenue flows to </span>
          <span className="text-xs text-ardito-green font-bold">YOU</span>
        </div>
      </div>
    </div>
  );
};

// Visualization 2: Activate at Emotional Peaks - Real-time trigger
const EmotionalPeaksViz = () => {
  const [emotionLevel, setEmotionLevel] = useState(45);
  const [isActivated, setIsActivated] = useState(false);
  
  useEffect(() => {
    const interval = setInterval(() => {
      setEmotionLevel((prev) => {
        const next = prev + (Math.random() * 15 - 5);
        const clamped = Math.max(30, Math.min(95, next));
        if (clamped > 80 && !isActivated) {
          setIsActivated(true);
          setTimeout(() => setIsActivated(false), 2000);
        }
        return clamped;
      });
    }, 800);
    return () => clearInterval(interval);
  }, [isActivated]);
  
  return (
    <div className="bg-ardito-surface border border-white/10 rounded-xl h-64 lg:h-80 p-6 flex flex-col justify-center">
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <span className="text-xs text-muted-foreground font-mono">EMOTION LEVEL</span>
          <span className={`text-xs font-mono ${emotionLevel > 80 ? 'text-ardito-green' : 'text-ardito-blue'}`}>
            {emotionLevel > 80 ? 'PEAK DETECTED' : 'MONITORING...'}
          </span>
        </div>
        
        {/* Emotion bar */}
        <div className="space-y-2">
          <div className="h-8 bg-white/5 rounded-lg overflow-hidden relative">
            <motion.div
              animate={{ width: `${emotionLevel}%` }}
              transition={{ duration: 0.3 }}
              className={`h-full rounded-lg ${emotionLevel > 80 ? 'bg-gradient-to-r from-ardito-blue to-ardito-green' : 'bg-ardito-blue'}`}
            />
            {/* Threshold marker */}
            <div className="absolute top-0 bottom-0 left-[80%] w-0.5 bg-ardito-orange" />
          </div>
          <div className="flex justify-between text-xs">
            <span className="text-muted-foreground">0%</span>
            <span className="text-ardito-orange">Threshold: 80%</span>
            <span className="text-muted-foreground">100%</span>
          </div>
        </div>
        
        {/* Current reading */}
        <div className="text-center">
          <span className="font-mono text-4xl font-bold" style={{ color: emotionLevel > 80 ? '#00FF66' : '#0066FF' }}>
            {Math.round(emotionLevel)}%
          </span>
          <p className="text-sm text-muted-foreground mt-1">
            {emotionLevel > 80 ? 'EUPHORIA' : emotionLevel > 60 ? 'TENSION' : 'ANTICIPATION'}
          </p>
        </div>
        
        {/* Activation status */}
        <motion.div
          animate={{ 
            opacity: isActivated ? 1 : 0.3,
            scale: isActivated ? 1.02 : 1
          }}
          className={`p-3 rounded-lg border ${isActivated ? 'bg-ardito-green/20 border-ardito-green/50' : 'bg-white/5 border-white/10'}`}
        >
          <div className="flex items-center justify-between">
            <span className={`text-sm font-medium ${isActivated ? 'text-ardito-green' : 'text-muted-foreground'}`}>
              {isActivated ? '⚡ Campaign Triggered!' : 'Waiting for peak...'}
            </span>
            <span className="text-xs font-mono text-muted-foreground">&lt;60s</span>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

// Visualization 3: Prove ROI - Attribution dashboard
const ProveROIViz = () => {
  return (
    <div className="bg-ardito-surface border border-white/10 rounded-xl h-64 lg:h-80 p-6 flex flex-col justify-center">
      <div className="space-y-4">
        {/* Mini metrics */}
        <div className="grid grid-cols-2 gap-3">
          <div className="bg-white/5 rounded-lg p-3">
            <p className="text-xs text-muted-foreground">Attributed Revenue</p>
            <p className="font-mono text-xl font-bold text-ardito-green">$56,550</p>
          </div>
          <div className="bg-white/5 rounded-lg p-3">
            <p className="text-xs text-muted-foreground">Campaign ROI</p>
            <p className="font-mono text-xl font-bold text-ardito-green">9.1x</p>
          </div>
        </div>
        
        {/* Attribution funnel */}
        <div className="space-y-2">
          <p className="text-xs text-muted-foreground font-mono">ATTRIBUTION CHAIN</p>
          <div className="space-y-1">
            {[
              { label: "Emotion Detected", value: "EUPHORIA 94%", color: "ardito-green" },
              { label: "Campaign Activated", value: "3 channels", color: "ardito-blue" },
              { label: "Impressions", value: "847K", color: "ardito-blue" },
              { label: "Engagements", value: "35.2%", color: "ardito-green" },
              { label: "Conversions", value: "3,977", color: "ardito-green" },
            ].map((item, i) => (
              <div key={item.label} className="flex items-center justify-between py-1.5 border-b border-white/5">
                <span className="text-xs text-muted-foreground">{item.label}</span>
                <span className={`text-xs font-mono font-medium text-${item.color}`}>{item.value}</span>
              </div>
            ))}
          </div>
        </div>
        
        {/* Comparison badge */}
        <div className="bg-ardito-blue/10 border border-ardito-blue/30 rounded-lg p-2 text-center">
          <span className="text-xs text-muted-foreground">vs. Traditional: </span>
          <span className="text-xs font-bold text-ardito-blue">4.3x better ROI</span>
        </div>
      </div>
    </div>
  );
};

// Live game visualization - Walk-off scenario
const LiveGameViz = () => {
  const [emotion, setEmotion] = useState(78);
  const [activated, setActivated] = useState(false);

  useEffect(() => {
    const interval = setInterval(() => {
      setEmotion((prev) => {
        const next = Math.min(100, prev + (Math.random() * 8));
        if (next > 85 && !activated) {
          setActivated(true);
        }
        return next > 98 ? 78 : next;
      });
      if (emotion < 80) {
        setActivated(false);
      }
    }, 1500);
    return () => clearInterval(interval);
  }, [emotion, activated]);

  return (
    <div className="bg-ardito-surface border border-white/10 rounded-lg p-6">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-ardito-green opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-ardito-green"></span>
          </span>
          <span className="text-xs text-ardito-green font-mono">LIVE MONITORING</span>
        </div>
        <span className="text-xs text-muted-foreground">Ole Miss vs Alabama • 9th Inning</span>
      </div>
      
      <div className="flex items-center justify-center gap-8 mb-6">
        <div className="text-center">
          <div className="h-12 w-12 bg-red-600/20 rounded-lg flex items-center justify-center mb-2 mx-auto">
            <span className="font-bold text-red-400">OLE</span>
          </div>
          <span className="font-mono text-2xl font-bold">7</span>
        </div>
        <span className="text-muted-foreground text-xl">vs</span>
        <div className="text-center">
          <div className="h-12 w-12 bg-red-800/20 rounded-lg flex items-center justify-center mb-2 mx-auto">
            <span className="font-bold text-red-300">ALA</span>
          </div>
          <span className="font-mono text-2xl font-bold">4</span>
        </div>
      </div>
      
      <div className="space-y-2 mb-4">
        <div className="flex items-center justify-between text-sm">
          <span className="text-muted-foreground">Collective Emotion</span>
          <span 
            className="font-mono font-bold"
            style={{ color: emotion > 85 ? "#00FF66" : "#0066FF" }}
          >
            {Math.round(emotion)}% {emotion > 85 ? "EUPHORIA" : "TENSION"}
          </span>
        </div>
        <div className="h-3 bg-white/10 rounded-full overflow-hidden relative">
          <motion.div
            animate={{ width: `${emotion}%` }}
            transition={{ duration: 0.5 }}
            className="h-full rounded-full"
            style={{ 
              background: emotion > 85 
                ? "linear-gradient(90deg, #0066FF, #00FF66)" 
                : "linear-gradient(90deg, #0066FF, #0066FF)"
            }}
          />
          <div 
            className="absolute top-0 h-full w-0.5 bg-ardito-orange"
            style={{ left: "85%" }}
          />
        </div>
        <div className="flex justify-between text-xs">
          <span className="text-muted-foreground">Monitoring 2,847 posts</span>
          <span className="text-ardito-orange">Activation threshold: 85%</span>
        </div>
      </div>

      {/* Activation notification */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ 
          opacity: activated ? 1 : 0, 
          y: activated ? 0 : 10 
        }}
        className="bg-ardito-green/20 border border-ardito-green/50 rounded-lg p-3 mt-4"
      >
        <div className="flex items-center gap-3">
          <div className="h-8 w-8 rounded-full bg-ardito-green/30 flex items-center justify-center">
            <CheckCircle2 className="h-4 w-4 text-ardito-green" />
          </div>
          <div>
            <p className="text-sm font-medium text-ardito-green">Campaign Activated</p>
            <p className="text-xs text-muted-foreground">Victory Discount • Stadium + Mobile + Social</p>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

// Section wrapper with animation
const Section = ({ children, className = "", id = "" }) => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <motion.section
      ref={ref}
      id={id}
      initial={{ opacity: 0, y: 40 }}
      animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 40 }}
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
    <div className="min-h-screen bg-ardito-charcoal" data-testid="landing-page">
      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-ardito-charcoal/80 backdrop-blur-lg border-b border-white/5">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <Logo className="h-8 w-auto" />
            
            <div className="hidden md:flex items-center gap-8">
              <a href="#how-it-works" className="text-sm text-muted-foreground hover:text-foreground transition-colors">How It Works</a>
              <a href="#use-case" className="text-sm text-muted-foreground hover:text-foreground transition-colors">Use Cases</a>
              <a href="#results" className="text-sm text-muted-foreground hover:text-foreground transition-colors">Results</a>
              <a href="#faq" className="text-sm text-muted-foreground hover:text-foreground transition-colors">FAQ</a>
            </div>

            <div className="hidden md:flex items-center gap-4">
              <Link to="/login">
                <Button variant="ghost" size="sm">Client Login</Button>
              </Link>
              <a href="#contact">
                <Button size="sm" className="bg-ardito-blue hover:bg-blue-600">
                  Schedule Demo
                </Button>
              </a>
            </div>

            <button
              className="md:hidden p-2"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>

        {/* Mobile menu */}
        {mobileMenuOpen && (
          <div className="md:hidden bg-ardito-surface border-t border-white/10 p-4 space-y-4">
            <a href="#how-it-works" className="block text-sm" onClick={() => setMobileMenuOpen(false)}>How It Works</a>
            <a href="#use-case" className="block text-sm" onClick={() => setMobileMenuOpen(false)}>Use Cases</a>
            <a href="#results" className="block text-sm" onClick={() => setMobileMenuOpen(false)}>Results</a>
            <a href="#faq" className="block text-sm" onClick={() => setMobileMenuOpen(false)}>FAQ</a>
            <div className="pt-4 border-t border-white/10 space-y-2">
              <Link to="/login" className="block">
                <Button variant="outline" className="w-full border-white/10">Client Login</Button>
              </Link>
              <a href="#contact" className="block">
                <Button className="w-full bg-ardito-blue">Schedule Demo</Button>
              </a>
            </div>
          </div>
        )}
      </nav>

      {/* Hero Section */}
      <section className="pt-32 pb-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
              >
                <Badge className="mb-6 bg-ardito-blue/20 text-ardito-blue border-ardito-blue/50">
                  <Zap className="h-3 w-3 mr-1" />
                  Real-Time Emotion Intelligence for Sports
                </Badge>
                
                <h1 className="font-heading text-4xl sm:text-5xl lg:text-6xl font-black leading-tight mb-6">
                  Turn Fan Emotion Into{" "}
                  <span className="text-ardito-blue">Sponsorship</span>{" "}
                  <span className="text-ardito-green">Revenue</span>
                </h1>
                
                <p className="text-lg text-muted-foreground mb-8 max-w-xl leading-relaxed">
                  Every second, thousands of fans post about your team on Instagram, TikTok, and X. 
                  Ardito detects when they're experiencing euphoria, tension, or pride—then triggers 
                  your sponsor campaigns at those exact emotional peaks.
                </p>
                
                <p className="text-base text-foreground mb-8 font-medium">
                  Result: <span className="text-ardito-green">38% engagement rates</span> (vs. 5% industry average) 
                  and <span className="text-ardito-green">8.5x ROI</span>.
                </p>

                <div className="flex flex-col sm:flex-row gap-4 mb-10">
                  <a href="#contact">
                    <Button size="lg" className="bg-ardito-blue hover:bg-blue-600 text-lg px-8 shadow-[0_0_30px_rgba(0,102,255,0.3)]">
                      Schedule Your Demo
                      <ArrowRight className="ml-2 h-5 w-5" />
                    </Button>
                  </a>
                  <a href="#how-it-works">
                    <Button size="lg" variant="outline" className="border-white/20 text-lg px-8">
                      See How It Works
                    </Button>
                  </a>
                </div>

                <EmotionTicker />
              </motion.div>
            </div>

            <motion.div
              initial={{ opacity: 0, x: 40 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="relative"
            >
              <LiveGameViz />
            </motion.div>
          </div>

          {/* Trust Badge */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="text-center mt-16"
          >
            <p className="text-sm text-muted-foreground flex items-center justify-center gap-2 flex-wrap">
              <Zap className="h-4 w-4 text-ardito-blue" />
              <span>Monitoring <strong className="text-foreground">2.4M+</strong> emotion signals daily</span>
              <span className="text-white/20">•</span>
              <span><strong className="text-foreground">60+</strong> schools</span>
              <span className="text-white/20">•</span>
              <span><strong className="text-foreground">20+</strong> national brands</span>
            </p>
          </motion.div>

          {/* Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-16 pt-16 border-t border-white/5">
            {HERO_STATS.map((stat, i) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.4 + i * 0.1 }}
                className="text-center"
              >
                <p className="font-mono text-4xl sm:text-5xl font-bold text-ardito-blue mb-2">
                  {stat.value}
                </p>
                <p className="font-medium">{stat.label}</p>
                <p className="text-sm text-muted-foreground">{stat.sublabel}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Value Props Section */}
      <Section id="how-it-works" className="py-24 px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-transparent via-ardito-blue/5 to-transparent">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <Badge className="mb-4 bg-ardito-green/20 text-ardito-green border-ardito-green/50">
              Why Ardito
            </Badge>
            <h2 className="font-heading text-3xl sm:text-4xl font-bold mb-4">
              The Emotion Intelligence <span className="text-ardito-blue">Advantage</span>
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Stop guessing when fans care. Start knowing.
            </p>
          </div>

          <div className="space-y-16">
            {VALUE_PROPS.map((prop, i) => (
              <motion.div
                key={prop.title}
                initial={{ opacity: 0, x: i % 2 === 0 ? -40 : 40 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6 }}
                className={`flex flex-col ${i % 2 === 0 ? "lg:flex-row" : "lg:flex-row-reverse"} gap-8 lg:gap-16 items-center`}
              >
                <div className="flex-1">
                  <div className={`h-14 w-14 rounded-xl bg-ardito-${prop.color}/20 flex items-center justify-center mb-4`}>
                    <prop.icon className={`h-7 w-7 text-ardito-${prop.color}`} />
                  </div>
                  <p className="text-ardito-blue font-mono text-sm mb-2">{prop.title}</p>
                  <h3 className="font-heading text-2xl lg:text-3xl font-bold mb-4">{prop.headline}</h3>
                  <p className="text-muted-foreground text-lg mb-6 leading-relaxed">{prop.description}</p>
                  <ul className="space-y-3">
                    {prop.stats.map((stat) => (
                      <li key={stat} className="flex items-center gap-3">
                        <CheckCircle2 className="h-5 w-5 text-ardito-green shrink-0" />
                        <span className="text-foreground">{stat}</span>
                      </li>
                    ))}
                  </ul>
                </div>
                <div className="flex-1 w-full">
                  <div className="bg-ardito-surface border border-white/10 rounded-xl h-64 lg:h-80 flex items-center justify-center">
                    <span className="text-muted-foreground font-mono text-sm">[{prop.title} visualization]</span>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </Section>

      {/* Walk-Off Use Case */}
      <Section id="use-case" className="py-24 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <Badge className="mb-4 bg-ardito-orange/20 text-ardito-orange border-ardito-orange/50">
              Real-World Example
            </Badge>
            <h2 className="font-heading text-3xl sm:text-4xl font-bold mb-4">
              The Walk-Off Win: <span className="text-ardito-green">$18,000 in 60 Seconds</span>
            </h2>
            <p className="text-muted-foreground max-w-3xl mx-auto">
              Saturday night. #14 Ole Miss vs. #3 Alabama. Bottom of the 9th. Bases loaded. Two outs. 
              Ole Miss down by one. The next 60 seconds will generate $18,000 in sponsor revenue.
            </p>
          </div>

          <div className="grid lg:grid-cols-2 gap-12 items-start">
            {/* Timeline */}
            <div className="space-y-6">
              {WALKOFF_TIMELINE.map((step, i) => (
                <motion.div
                  key={step.time}
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.4, delay: i * 0.1 }}
                  className={`flex gap-4 p-4 rounded-lg border ${
                    step.highlight 
                      ? "bg-ardito-green/10 border-ardito-green/30" 
                      : "bg-ardito-surface border-white/10"
                  }`}
                >
                  <div className="shrink-0">
                    <span className={`font-mono text-sm font-bold ${step.highlight ? "text-ardito-green" : "text-ardito-blue"}`}>
                      {step.time}
                    </span>
                  </div>
                  <div>
                    <h4 className="font-bold mb-1">{step.title}</h4>
                    <p className="text-sm text-muted-foreground">{step.description}</p>
                  </div>
                </motion.div>
              ))}
            </div>

            {/* Results Card */}
            <div className="lg:sticky lg:top-24">
              <div className="bg-ardito-surface border border-white/10 rounded-xl p-6">
                <h3 className="font-heading text-xl font-bold mb-6">Campaign Results</h3>
                
                <div className="space-y-6">
                  <div>
                    <p className="text-xs text-muted-foreground uppercase tracking-wide mb-2">Emotion Trigger</p>
                    <div className="flex gap-2">
                      <Badge className="bg-ardito-green/20 text-ardito-green border-ardito-green/50">
                        Euphoria 94%
                      </Badge>
                      <Badge variant="outline">Walk-off Grand Slam</Badge>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="bg-white/5 rounded-lg p-3">
                      <p className="text-2xl font-mono font-bold">38K</p>
                      <p className="text-xs text-muted-foreground">Stadium Reach</p>
                    </div>
                    <div className="bg-white/5 rounded-lg p-3">
                      <p className="text-2xl font-mono font-bold">847K</p>
                      <p className="text-xs text-muted-foreground">Social Impressions</p>
                    </div>
                    <div className="bg-white/5 rounded-lg p-3">
                      <p className="text-2xl font-mono font-bold text-ardito-green">35%</p>
                      <p className="text-xs text-muted-foreground">Engagement Rate</p>
                    </div>
                    <div className="bg-white/5 rounded-lg p-3">
                      <p className="text-2xl font-mono font-bold text-ardito-green">9.1x</p>
                      <p className="text-xs text-muted-foreground">ROI</p>
                    </div>
                  </div>

                  <div className="border-t border-white/10 pt-4">
                    <div className="flex justify-between items-center">
                      <span className="text-muted-foreground">Attributed Revenue</span>
                      <span className="font-mono text-2xl font-bold text-ardito-green">$56,550</span>
                    </div>
                    <div className="flex justify-between items-center mt-2">
                      <span className="text-muted-foreground">Campaign Spend</span>
                      <span className="font-mono">$6,200</span>
                    </div>
                  </div>

                  <div className="bg-ardito-blue/10 border border-ardito-blue/30 rounded-lg p-4">
                    <p className="text-sm">
                      <strong className="text-ardito-blue">Traditional approach:</strong> Same ad during 7th inning stretch. 
                      <span className="text-muted-foreground"> 5-8% engagement, 2.1x ROI, no attribution.</span>
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </Section>

      {/* Channels Section */}
      <Section className="py-24 px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-transparent via-ardito-green/5 to-transparent">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="font-heading text-3xl sm:text-4xl font-bold mb-4">
              One Trigger, <span className="text-ardito-green">Four Channels</span>, Instant Sync
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              When emotions peak, your campaign activates everywhere simultaneously.
            </p>
          </div>

          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
            {CHANNELS.map((channel, i) => (
              <motion.div
                key={channel.name}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: i * 0.1 }}
                className="bg-ardito-surface border border-white/10 rounded-xl p-6 text-center hover:border-ardito-green/50 transition-colors group"
              >
                <div className="h-14 w-14 rounded-full bg-ardito-green/20 flex items-center justify-center mx-auto mb-4 group-hover:bg-ardito-green/30 transition-colors">
                  <channel.icon className="h-7 w-7 text-ardito-green" />
                </div>
                <h3 className="font-bold mb-1">{channel.name}</h3>
                <p className="text-sm text-muted-foreground mb-3">{channel.desc}</p>
                <p className="font-mono text-sm text-ardito-green">{channel.stat}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </Section>

      {/* Testimonials */}
      <Section id="results" className="py-24 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <Badge className="mb-4 bg-ardito-blue/20 text-ardito-blue border-ardito-blue/50">
              Proven Results
            </Badge>
            <h2 className="font-heading text-3xl sm:text-4xl font-bold mb-4">
              What <span className="text-ardito-blue">Industry Leaders</span> Say
            </h2>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {TESTIMONIALS.map((testimonial, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.1 }}
                className="bg-ardito-surface border border-white/10 rounded-xl p-6"
              >
                <div className="mb-4">
                  <Badge className="bg-ardito-green/20 text-ardito-green border-ardito-green/50 font-mono">
                    {testimonial.metric}
                  </Badge>
                </div>
                <blockquote className="text-muted-foreground mb-6 italic leading-relaxed">
                  "{testimonial.quote}"
                </blockquote>
                <div>
                  <p className="font-medium">{testimonial.author}</p>
                  <p className="text-sm text-muted-foreground">{testimonial.company}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </Section>

      {/* FAQ Section */}
      <Section id="faq" className="py-24 px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-transparent via-white/[0.02] to-transparent">
        <div className="max-w-3xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="font-heading text-3xl sm:text-4xl font-bold mb-4">
              Common Questions
            </h2>
          </div>

          <div className="space-y-4">
            {FAQS.map((faq, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.3, delay: i * 0.05 }}
                className="bg-ardito-surface border border-white/10 rounded-lg overflow-hidden"
              >
                <button
                  onClick={() => setOpenFaq(openFaq === i ? null : i)}
                  className="w-full px-6 py-4 text-left flex items-center justify-between hover:bg-white/5 transition-colors"
                >
                  <span className="font-medium">{faq.q}</span>
                  <ChevronRight className={`h-5 w-5 text-muted-foreground transition-transform ${openFaq === i ? "rotate-90" : ""}`} />
                </button>
                {openFaq === i && (
                  <div className="px-6 pb-4">
                    <p className="text-muted-foreground leading-relaxed">{faq.a}</p>
                  </div>
                )}
              </motion.div>
            ))}
          </div>
        </div>
      </Section>

      {/* CTA Section */}
      <Section id="contact" className="py-24 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="font-heading text-3xl sm:text-4xl lg:text-5xl font-bold mb-6">
            Ready to Stop Guessing and <span className="text-ardito-blue">Start Knowing</span>?
          </h2>
          <p className="text-lg text-muted-foreground mb-8 max-w-2xl mx-auto">
            See how Ardito can transform your sponsorship revenue in a 30-minute demo. 
            Join 60+ schools and 20+ Fortune 500 brands.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-10">
            <Button size="lg" className="bg-ardito-blue hover:bg-blue-600 text-lg px-8 shadow-[0_0_30px_rgba(0,102,255,0.3)]">
              Schedule Your Demo
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
            <Button size="lg" variant="outline" className="border-white/20 text-lg px-8">
              Calculate ROI
            </Button>
          </div>

          <div className="flex flex-wrap justify-center gap-6 text-sm text-muted-foreground">
            <span className="flex items-center gap-2">
              <CheckCircle2 className="h-4 w-4 text-ardito-green" />
              No credit card required
            </span>
            <span className="flex items-center gap-2">
              <CheckCircle2 className="h-4 w-4 text-ardito-green" />
              90-day pilot available
            </span>
            <span className="flex items-center gap-2">
              <CheckCircle2 className="h-4 w-4 text-ardito-green" />
              2x engagement guarantee
            </span>
          </div>
        </div>
      </Section>

      {/* Footer */}
      <footer className="border-t border-white/10 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-12">
            <div className="col-span-2 md:col-span-1">
              <Logo className="h-8 w-auto mb-4" />
              <p className="text-sm text-muted-foreground">
                The first real-time emotion intelligence platform for sports sponsorships.
              </p>
            </div>
            <div>
              <h4 className="font-bold mb-4">Platform</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li><a href="#how-it-works" className="hover:text-foreground transition-colors">How It Works</a></li>
                <li><a href="#use-case" className="hover:text-foreground transition-colors">Use Cases</a></li>
                <li><a href="#results" className="hover:text-foreground transition-colors">Results</a></li>
                <li><a href="#" className="hover:text-foreground transition-colors">Security</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-bold mb-4">Company</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li><a href="#" className="hover:text-foreground transition-colors">About</a></li>
                <li><a href="#" className="hover:text-foreground transition-colors">Careers</a></li>
                <li><a href="#" className="hover:text-foreground transition-colors">Blog</a></li>
                <li><a href="#contact" className="hover:text-foreground transition-colors">Contact</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-bold mb-4">Legal</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li><a href="#" className="hover:text-foreground transition-colors">Privacy Policy</a></li>
                <li><a href="#" className="hover:text-foreground transition-colors">Terms of Service</a></li>
                <li><a href="#" className="hover:text-foreground transition-colors">Compliance</a></li>
              </ul>
            </div>
          </div>
          <div className="border-t border-white/10 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-sm text-muted-foreground">
              © {new Date().getFullYear()} Ardito Advisors. All rights reserved.
            </p>
            <div className="flex gap-6 text-sm">
              <a href="#" className="text-muted-foreground hover:text-foreground transition-colors">
                LinkedIn
              </a>
              <a href="#" className="text-muted-foreground hover:text-foreground transition-colors">
                Twitter
              </a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;
