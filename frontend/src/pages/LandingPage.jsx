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
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";

// Emotion colors for animations
const EMOTIONS = [
  { name: "EUPHORIA", color: "#00FF66", score: 87 },
  { name: "TENSION", color: "#0066FF", score: 92 },
  { name: "PRIDE", color: "#FFD700", score: 78 },
  { name: "ANXIETY", color: "#FF6B00", score: 65 },
];

// Stats for hero
const HERO_STATS = [
  { value: "38%", label: "Avg Engagement Rate", sublabel: "vs 5% industry avg" },
  { value: "8.5x", label: "Average ROI", sublabel: "on activated campaigns" },
  { value: "<60s", label: "Activation Speed", sublabel: "emotion to impression" },
];

// Feature cards
const FEATURES = [
  {
    icon: Radio,
    title: "Real-Time Emotion Detection",
    description: "Monitor fan sentiment across social platforms during live games. Our AI analyzes millions of posts to detect emotional peaks as they happen.",
    bullets: ["Multi-platform social listening", "Sub-second emotion classification", "Confidence-scored predictions", "Historical pattern recognition"],
  },
  {
    icon: Zap,
    title: "Instant Campaign Activation",
    description: "Automatically trigger sponsor activations when emotions peak. Stadium displays, mobile push, social ads, and broadcast overlays - all in perfect sync.",
    bullets: ["Multi-channel orchestration", "School-specific branding", "A/B testing built-in", "Budget pacing controls"],
  },
  {
    icon: BarChart3,
    title: "Attribution & Analytics",
    description: "Know exactly which emotions drive conversions. Full-funnel attribution from emotional trigger to purchase, with real-time dashboards.",
    bullets: ["Emotion-to-conversion tracking", "Channel performance comparison", "School portfolio insights", "Exportable reports"],
  },
  {
    icon: Shield,
    title: "Brand Safety & Compliance",
    description: "NCAA-compliant activations with built-in brand safety. Every creative reviewed, every activation logged, every dollar accountable.",
    bullets: ["NCAA policy compliance", "Brand safety filters", "Complete audit trails", "Approval workflows"],
  },
];

// How it works steps
const STEPS = [
  {
    number: "01",
    title: "Connect Your Campaigns",
    description: "Upload creative assets and define emotion triggers. Our AI automatically generates school-branded variations for your entire portfolio.",
    visual: "campaigns",
  },
  {
    number: "02",
    title: "Monitor Live Games",
    description: "Watch real-time emotion tracking across all active games. See tension build, euphoria spike, and know exactly when fans are primed for your message.",
    visual: "monitor",
  },
  {
    number: "03",
    title: "Activate at Peak Moments",
    description: "When emotions hit your thresholds, campaigns activate instantly. Stadium jumbotrons, mobile apps, social feeds - all personalized, all synchronized.",
    visual: "activate",
  },
  {
    number: "04",
    title: "Measure Everything",
    description: "Attribution connects emotional moments to business outcomes. Know which emotions drive the most value and optimize continuously.",
    visual: "measure",
  },
];

// Testimonials
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

// Channels
const CHANNELS = [
  { icon: Monitor, name: "Stadium Displays", desc: "Jumbotrons & ribbon boards" },
  { icon: Smartphone, name: "Mobile Push", desc: "In-app notifications" },
  { icon: Share2, name: "Social Ads", desc: "Instagram, TikTok, X" },
  { icon: Radio, name: "Broadcast", desc: "TV & streaming overlays" },
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
    <div className="flex items-center gap-3">
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

// Live game visualization
const LiveGameViz = () => {
  const [score, setScore] = useState({ home: 24, away: 21 });
  const [emotion, setEmotion] = useState(78);

  useEffect(() => {
    const interval = setInterval(() => {
      setEmotion((prev) => Math.min(100, Math.max(40, prev + (Math.random() - 0.4) * 15)));
    }, 1500);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="bg-ardito-surface border border-white/10 rounded-lg p-6">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-ardito-green opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-ardito-green"></span>
          </span>
          <span className="text-xs text-ardito-green font-mono">LIVE</span>
        </div>
        <span className="text-xs text-muted-foreground">4th Quarter • 2:34</span>
      </div>
      <div className="flex items-center justify-center gap-8 mb-6">
        <div className="text-center">
          <div className="h-12 w-12 bg-red-600/20 rounded-lg flex items-center justify-center mb-2 mx-auto">
            <span className="font-bold text-red-400">ALA</span>
          </div>
          <span className="font-mono text-2xl font-bold">{score.home}</span>
        </div>
        <span className="text-muted-foreground text-xl">vs</span>
        <div className="text-center">
          <div className="h-12 w-12 bg-blue-600/20 rounded-lg flex items-center justify-center mb-2 mx-auto">
            <span className="font-bold text-blue-400">UGA</span>
          </div>
          <span className="font-mono text-2xl font-bold">{score.away}</span>
        </div>
      </div>
      <div className="space-y-2">
        <div className="flex items-center justify-between text-sm">
          <span className="text-muted-foreground">Tension Level</span>
          <span className="font-mono text-ardito-blue">{Math.round(emotion)}%</span>
        </div>
        <div className="h-3 bg-white/10 rounded-full overflow-hidden">
          <motion.div
            animate={{ width: `${emotion}%` }}
            transition={{ duration: 0.5 }}
            className="h-full bg-gradient-to-r from-ardito-blue to-ardito-green rounded-full"
          />
        </div>
        <p className="text-xs text-center text-ardito-orange mt-3">
          Campaign activation threshold: 85%
        </p>
      </div>
    </div>
  );
};

// Section wrapper with animation
const Section = ({ children, className = "" }) => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <motion.section
      ref={ref}
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

  return (
    <div className="min-h-screen bg-ardito-charcoal" data-testid="landing-page">
      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-ardito-charcoal/80 backdrop-blur-lg border-b border-white/5">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <Logo className="h-8 w-auto" />
            
            <div className="hidden md:flex items-center gap-8">
              <a href="#features" className="text-sm text-muted-foreground hover:text-foreground transition-colors">Features</a>
              <a href="#how-it-works" className="text-sm text-muted-foreground hover:text-foreground transition-colors">How It Works</a>
              <a href="#testimonials" className="text-sm text-muted-foreground hover:text-foreground transition-colors">Results</a>
              <a href="#contact" className="text-sm text-muted-foreground hover:text-foreground transition-colors">Contact</a>
            </div>

            <div className="hidden md:flex items-center gap-4">
              <Link to="/login">
                <Button variant="ghost" size="sm">Sign In</Button>
              </Link>
              <a href="#contact">
                <Button size="sm" className="bg-ardito-blue hover:bg-blue-600">
                  Request Demo
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
            <a href="#features" className="block text-sm">Features</a>
            <a href="#how-it-works" className="block text-sm">How It Works</a>
            <a href="#testimonials" className="block text-sm">Results</a>
            <a href="#contact" className="block text-sm">Contact</a>
            <div className="pt-4 border-t border-white/10 space-y-2">
              <Link to="/login" className="block">
                <Button variant="outline" className="w-full border-white/10">Sign In</Button>
              </Link>
              <a href="#contact" className="block">
                <Button className="w-full bg-ardito-blue">Request Demo</Button>
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
                  Emotion-Triggered Sponsorship Activation
                </Badge>
                
                <h1 className="font-heading text-4xl sm:text-5xl lg:text-6xl font-black leading-tight mb-6">
                  Activate Sponsors{" "}
                  <span className="text-ardito-blue">When Fans</span>{" "}
                  <span className="text-ardito-green">Feel It Most</span>
                </h1>
                
                <p className="text-lg text-muted-foreground mb-8 max-w-xl">
                  Ardito detects emotional peaks during live games and instantly triggers 
                  sponsor campaigns across stadium, mobile, and social channels. 
                  Transform fan passion into measurable brand impact.
                </p>

                <div className="flex flex-col sm:flex-row gap-4 mb-12">
                  <a href="#contact">
                    <Button size="lg" className="bg-ardito-blue hover:bg-blue-600 text-lg px-8 shadow-[0_0_30px_rgba(0,102,255,0.3)]">
                      Request Demo
                      <ArrowRight className="ml-2 h-5 w-5" />
                    </Button>
                  </a>
                  <Button size="lg" variant="outline" className="border-white/20 text-lg px-8">
                    <Play className="mr-2 h-5 w-5" />
                    Watch Video
                  </Button>
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
              
              {/* Floating activation card */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.8 }}
                className="absolute -bottom-6 -left-6 bg-ardito-green/20 border border-ardito-green/50 rounded-lg p-4 backdrop-blur-sm"
              >
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-full bg-ardito-green/30 flex items-center justify-center">
                    <CheckCircle2 className="h-5 w-5 text-ardito-green" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-ardito-green">Campaign Activated</p>
                    <p className="text-xs text-muted-foreground">Victory Discount • 124K impressions</p>
                  </div>
                </div>
              </motion.div>
            </motion.div>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-20">
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

      {/* Logos Section */}
      <section className="py-12 border-y border-white/5 bg-white/[0.02]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <p className="text-center text-sm text-muted-foreground mb-8">
            TRUSTED BY LEADING SPORTS SPONSORS
          </p>
          <div className="flex flex-wrap justify-center items-center gap-12 opacity-50">
            {["Gatorade", "Under Armour", "Nike", "Pepsi", "State Farm", "Toyota"].map((brand) => (
              <span key={brand} className="font-heading text-xl font-bold text-muted-foreground">
                {brand}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <Section id="features" className="py-24 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <Badge className="mb-4 bg-ardito-orange/20 text-ardito-orange border-ardito-orange/50">
              Platform Features
            </Badge>
            <h2 className="font-heading text-3xl sm:text-4xl font-bold mb-4">
              Everything You Need for{" "}
              <span className="text-ardito-blue">Emotion-Driven</span> Sponsorship
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              A complete platform for detecting fan emotions, activating campaigns, 
              and measuring impact - built for enterprise sports marketing teams.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            {FEATURES.map((feature, i) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.1 }}
                className="bg-ardito-surface border border-white/10 rounded-lg p-6 hover:border-ardito-blue/50 transition-all group"
              >
                <div className="h-12 w-12 rounded-lg bg-ardito-blue/20 flex items-center justify-center mb-4 group-hover:bg-ardito-blue/30 transition-colors">
                  <feature.icon className="h-6 w-6 text-ardito-blue" />
                </div>
                <h3 className="font-heading text-xl font-bold mb-2">{feature.title}</h3>
                <p className="text-muted-foreground mb-4">{feature.description}</p>
                <ul className="space-y-2">
                  {feature.bullets.map((bullet) => (
                    <li key={bullet} className="flex items-center gap-2 text-sm">
                      <CheckCircle2 className="h-4 w-4 text-ardito-green shrink-0" />
                      <span className="text-muted-foreground">{bullet}</span>
                    </li>
                  ))}
                </ul>
              </motion.div>
            ))}
          </div>
        </div>
      </Section>

      {/* Channels Section */}
      <Section className="py-24 px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-transparent via-ardito-blue/5 to-transparent">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="font-heading text-3xl sm:text-4xl font-bold mb-4">
              One Trigger, <span className="text-ardito-green">Four Channels</span>
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              When emotions peak, your campaign activates everywhere simultaneously - 
              ensuring no fan misses your message at the perfect moment.
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {CHANNELS.map((channel, i) => (
              <motion.div
                key={channel.name}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: i * 0.1 }}
                className="bg-ardito-surface border border-white/10 rounded-lg p-6 text-center hover:border-ardito-green/50 transition-colors"
              >
                <div className="h-14 w-14 rounded-full bg-ardito-green/20 flex items-center justify-center mx-auto mb-4">
                  <channel.icon className="h-7 w-7 text-ardito-green" />
                </div>
                <h3 className="font-bold mb-1">{channel.name}</h3>
                <p className="text-sm text-muted-foreground">{channel.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </Section>

      {/* How It Works */}
      <Section id="how-it-works" className="py-24 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <Badge className="mb-4 bg-ardito-green/20 text-ardito-green border-ardito-green/50">
              How It Works
            </Badge>
            <h2 className="font-heading text-3xl sm:text-4xl font-bold mb-4">
              From Emotion to <span className="text-ardito-orange">Activation</span> in Seconds
            </h2>
          </div>

          <div className="space-y-12">
            {STEPS.map((step, i) => (
              <motion.div
                key={step.number}
                initial={{ opacity: 0, x: i % 2 === 0 ? -40 : 40 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6 }}
                className={`flex flex-col ${i % 2 === 0 ? "md:flex-row" : "md:flex-row-reverse"} gap-8 items-center`}
              >
                <div className="flex-1">
                  <span className="font-mono text-6xl font-bold text-white/10">{step.number}</span>
                  <h3 className="font-heading text-2xl font-bold mb-3 -mt-4">{step.title}</h3>
                  <p className="text-muted-foreground text-lg">{step.description}</p>
                </div>
                <div className="flex-1 w-full">
                  <div className="bg-ardito-surface border border-white/10 rounded-lg h-48 flex items-center justify-center">
                    <span className="text-muted-foreground">[{step.visual} visualization]</span>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </Section>

      {/* Testimonials */}
      <Section id="testimonials" className="py-24 px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-transparent via-ardito-orange/5 to-transparent">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <Badge className="mb-4 bg-ardito-blue/20 text-ardito-blue border-ardito-blue/50">
              Results
            </Badge>
            <h2 className="font-heading text-3xl sm:text-4xl font-bold mb-4">
              Trusted by <span className="text-ardito-blue">Industry Leaders</span>
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
                className="bg-ardito-surface border border-white/10 rounded-lg p-6"
              >
                <div className="mb-4">
                  <Badge className="bg-ardito-green/20 text-ardito-green border-ardito-green/50 font-mono">
                    {testimonial.metric}
                  </Badge>
                </div>
                <blockquote className="text-muted-foreground mb-6 italic">
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

      {/* CTA Section */}
      <Section id="contact" className="py-24 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="font-heading text-3xl sm:text-4xl lg:text-5xl font-bold mb-6">
            Ready to Transform Your{" "}
            <span className="text-ardito-blue">Sports Sponsorship</span>?
          </h2>
          <p className="text-lg text-muted-foreground mb-8 max-w-2xl mx-auto">
            Join leading brands who have discovered the power of emotion-triggered 
            activation. Our team will show you exactly how Ardito can drive measurable 
            impact for your portfolio.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
            <Button size="lg" className="bg-ardito-blue hover:bg-blue-600 text-lg px-8 shadow-[0_0_30px_rgba(0,102,255,0.3)]">
              Schedule a Demo
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
            <Button size="lg" variant="outline" className="border-white/20 text-lg px-8">
              Talk to Sales
            </Button>
          </div>

          <div className="flex flex-wrap justify-center gap-8 text-sm text-muted-foreground">
            <span className="flex items-center gap-2">
              <CheckCircle2 className="h-4 w-4 text-ardito-green" />
              Dedicated support
            </span>
            <span className="flex items-center gap-2">
              <CheckCircle2 className="h-4 w-4 text-ardito-green" />
              White-glove onboarding
            </span>
            <span className="flex items-center gap-2">
              <CheckCircle2 className="h-4 w-4 text-ardito-green" />
              Enterprise SLA
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
                Emotion Intelligence Platform for Sports Sponsorship
              </p>
            </div>
            <div>
              <h4 className="font-bold mb-4">Platform</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li><a href="#features" className="hover:text-foreground">Features</a></li>
                <li><a href="#" className="hover:text-foreground">Integrations</a></li>
                <li><a href="#" className="hover:text-foreground">Pricing</a></li>
                <li><a href="#" className="hover:text-foreground">Security</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-bold mb-4">Company</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li><a href="#" className="hover:text-foreground">About</a></li>
                <li><a href="#" className="hover:text-foreground">Careers</a></li>
                <li><a href="#" className="hover:text-foreground">Blog</a></li>
                <li><a href="#contact" className="hover:text-foreground">Contact</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-bold mb-4">Legal</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li><a href="#" className="hover:text-foreground">Privacy</a></li>
                <li><a href="#" className="hover:text-foreground">Terms</a></li>
                <li><a href="#" className="hover:text-foreground">Compliance</a></li>
              </ul>
            </div>
          </div>
          <div className="border-t border-white/10 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-sm text-muted-foreground">
              © {new Date().getFullYear()} Ardito Advisors. All rights reserved.
            </p>
            <div className="flex gap-6">
              <a href="#" className="text-muted-foreground hover:text-foreground">
                LinkedIn
              </a>
              <a href="#" className="text-muted-foreground hover:text-foreground">
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
