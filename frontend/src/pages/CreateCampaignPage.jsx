import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { api } from "@/lib/api";
import { toast } from "sonner";
import { motion, AnimatePresence } from "framer-motion";
import { format, addDays } from "date-fns";
import {
  ArrowLeft,
  ArrowRight,
  Check,
  Target,
  Image,
  Rocket,
  DollarSign,
  Calendar,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import { Calendar as CalendarComponent } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";

const STEPS = [
  { id: 1, title: "Basic Info", icon: Target },
  { id: 2, title: "Targeting", icon: Target },
  { id: 3, title: "Creative", icon: Image },
  { id: 4, title: "Review", icon: Rocket },
];

const EMOTIONS = [
  { id: "euphoria", name: "Euphoria", description: "Walk-off wins, upsets, championships", color: "#00FF66" },
  { id: "tension", name: "Tension", description: "Close games, final minutes, comebacks", color: "#0066FF" },
  { id: "frustration", name: "Frustration", description: "Bad calls, turnovers, injuries", color: "#FF0000" },
  { id: "nostalgia", name: "Nostalgia", description: "Historic moments, throwback content", color: "#9C27B0" },
  { id: "pride", name: "Pride", description: "Dominant performances, record-breaking", color: "#FFD700" },
  { id: "anxiety", name: "Anxiety", description: "Playoff games, must-win situations", color: "#FF6B00" },
  { id: "disappointment", name: "Disappointment", description: "Tough losses, missed opportunities", color: "#757575" },
];

const CHANNELS = [
  { id: "stadium", name: "Stadium Display" },
  { id: "mobile", name: "Mobile Push" },
  { id: "social", name: "Social Ads" },
  { id: "broadcast", name: "Broadcast" },
];

const StepIndicator = ({ currentStep }) => (
  <div className="flex items-center justify-center mb-8">
    {STEPS.map((step, index) => (
      <div key={step.id} className="flex items-center">
        <div
          className={`flex items-center justify-center h-10 w-10 rounded-full border-2 transition-all ${
            currentStep > step.id
              ? "bg-ardito-green border-ardito-green"
              : currentStep === step.id
              ? "bg-ardito-blue border-ardito-blue"
              : "border-white/20 bg-transparent"
          }`}
        >
          {currentStep > step.id ? (
            <Check className="h-5 w-5 text-black" />
          ) : (
            <span className={`text-sm font-bold ${currentStep === step.id ? "text-white" : "text-muted-foreground"}`}>
              {step.id}
            </span>
          )}
        </div>
        <span
          className={`ml-2 text-sm font-medium hidden sm:inline ${
            currentStep >= step.id ? "text-foreground" : "text-muted-foreground"
          }`}
        >
          {step.title}
        </span>
        {index < STEPS.length - 1 && (
          <div
            className={`w-12 sm:w-24 h-0.5 mx-2 ${
              currentStep > step.id ? "bg-ardito-green" : "bg-white/20"
            }`}
          />
        )}
      </div>
    ))}
  </div>
);

const Step1BasicInfo = ({ data, onChange }) => {
  const handleDateSelect = (field, date) => {
    onChange({ [field]: date ? format(date, "yyyy-MM-dd") : "" });
  };

  return (
    <div className="space-y-6 max-w-2xl">
      <div className="space-y-2">
        <Label htmlFor="name">Campaign Name *</Label>
        <Input
          id="name"
          value={data.name}
          onChange={(e) => onChange({ name: e.target.value })}
          placeholder="e.g., Q4 Brand Awareness Push"
          data-testid="campaign-name-input"
          className="bg-ardito-charcoal border-white/10"
          maxLength={100}
        />
        <p className="text-xs text-muted-foreground">Internal name for this campaign</p>
      </div>

      <div className="space-y-2">
        <Label htmlFor="description">Description</Label>
        <Textarea
          id="description"
          value={data.description}
          onChange={(e) => onChange({ description: e.target.value })}
          placeholder="Optional description visible to your team"
          className="bg-ardito-charcoal border-white/10 min-h-[80px]"
          maxLength={500}
        />
      </div>

      <div className="space-y-3">
        <Label>Campaign Objective *</Label>
        <RadioGroup
          value={data.objective}
          onValueChange={(value) => onChange({ objective: value })}
          className="space-y-2"
        >
          {[
            { value: "awareness", label: "Brand Awareness", desc: "Maximize impressions during high-emotion moments" },
            { value: "engagement", label: "Fan Engagement", desc: "Drive interactions (clicks, shares, reactions)" },
            { value: "conversions", label: "Conversions", desc: "Drive specific actions (purchases, sign-ups)" },
          ].map((obj) => (
            <div
              key={obj.value}
              className={`flex items-start space-x-3 p-3 rounded-md border transition-all cursor-pointer ${
                data.objective === obj.value
                  ? "border-ardito-blue bg-ardito-blue/10"
                  : "border-white/10 hover:border-white/20"
              }`}
              onClick={() => onChange({ objective: obj.value })}
            >
              <RadioGroupItem value={obj.value} id={obj.value} className="mt-0.5" />
              <div>
                <Label htmlFor={obj.value} className="font-medium cursor-pointer">
                  {obj.label}
                </Label>
                <p className="text-xs text-muted-foreground">{obj.desc}</p>
              </div>
            </div>
          ))}
        </RadioGroup>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="total_budget">Total Budget *</Label>
          <div className="relative">
            <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              id="total_budget"
              type="number"
              value={data.total_budget}
              onChange={(e) => onChange({ total_budget: parseFloat(e.target.value) || 0 })}
              placeholder="50,000"
              data-testid="budget-input"
              className="bg-ardito-charcoal border-white/10 pl-9"
              min={50000}
            />
          </div>
        </div>
        <div className="space-y-2">
          <Label htmlFor="daily_cap">Daily Cap</Label>
          <div className="relative">
            <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              id="daily_cap"
              type="number"
              value={data.daily_cap}
              onChange={(e) => onChange({ daily_cap: parseFloat(e.target.value) || 0 })}
              placeholder="Optional"
              className="bg-ardito-charcoal border-white/10 pl-9"
            />
          </div>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label>Start Date *</Label>
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                className="w-full justify-start border-white/10 bg-ardito-charcoal"
                data-testid="start-date-btn"
              >
                <Calendar className="mr-2 h-4 w-4" />
                {data.start_date || "Select date"}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0 bg-ardito-surface border-white/10">
              <CalendarComponent
                mode="single"
                selected={data.start_date ? new Date(data.start_date) : undefined}
                onSelect={(date) => handleDateSelect("start_date", date)}
                disabled={(date) => date < new Date()}
              />
            </PopoverContent>
          </Popover>
        </div>
        <div className="space-y-2">
          <Label>End Date *</Label>
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                className="w-full justify-start border-white/10 bg-ardito-charcoal"
                data-testid="end-date-btn"
              >
                <Calendar className="mr-2 h-4 w-4" />
                {data.end_date || "Select date"}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0 bg-ardito-surface border-white/10">
              <CalendarComponent
                mode="single"
                selected={data.end_date ? new Date(data.end_date) : undefined}
                onSelect={(date) => handleDateSelect("end_date", date)}
                disabled={(date) => date < new Date(data.start_date || new Date())}
              />
            </PopoverContent>
          </Popover>
        </div>
      </div>
    </div>
  );
};

const Step2Targeting = ({ data, onChange, schools }) => {
  const toggleEmotion = (emotionId) => {
    const emotions = data.target_emotions || [];
    if (emotions.includes(emotionId)) {
      onChange({ target_emotions: emotions.filter((e) => e !== emotionId) });
    } else {
      onChange({ target_emotions: [...emotions, emotionId] });
    }
  };

  const toggleSchool = (schoolId) => {
    const selected = data.schools || [];
    if (selected.includes(schoolId)) {
      onChange({ schools: selected.filter((s) => s !== schoolId) });
    } else {
      onChange({ schools: [...selected, schoolId] });
    }
  };

  const toggleChannel = (channelId) => {
    const channels = data.channels || [];
    if (channels.includes(channelId)) {
      onChange({ channels: channels.filter((c) => c !== channelId) });
    } else {
      onChange({ channels: [...channels, channelId] });
    }
  };

  return (
    <div className="space-y-8 max-w-3xl">
      {/* Emotion Targeting */}
      <div className="space-y-4">
        <div>
          <Label className="text-base">Which emotions should trigger this campaign? *</Label>
          <p className="text-sm text-muted-foreground mt-1">
            Select at least one emotion to trigger campaign activations
          </p>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
          {EMOTIONS.map((emotion) => {
            const isSelected = (data.target_emotions || []).includes(emotion.id);
            return (
              <div
                key={emotion.id}
                onClick={() => toggleEmotion(emotion.id)}
                className={`p-3 rounded-md border cursor-pointer transition-all ${
                  isSelected
                    ? "border-ardito-blue bg-ardito-blue/10"
                    : "border-white/10 hover:border-white/20"
                }`}
                data-testid={`emotion-${emotion.id}`}
              >
                <div className="flex items-center gap-2 mb-1">
                  <div
                    className="h-3 w-3 rounded-full"
                    style={{ backgroundColor: emotion.color }}
                  />
                  <span className="font-medium text-sm">{emotion.name}</span>
                </div>
                <p className="text-xs text-muted-foreground line-clamp-2">{emotion.description}</p>
              </div>
            );
          })}
        </div>
      </div>

      {/* School Portfolio */}
      <div className="space-y-4">
        <div>
          <Label className="text-base">Which schools should this campaign target? *</Label>
          <p className="text-sm text-muted-foreground mt-1">Select schools from your portfolio</p>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
          {schools.map((school) => {
            const isSelected = (data.schools || []).includes(school.id);
            return (
              <div
                key={school.id}
                onClick={() => toggleSchool(school.id)}
                className={`p-3 rounded-md border cursor-pointer transition-all ${
                  isSelected
                    ? "border-ardito-blue bg-ardito-blue/10"
                    : "border-white/10 hover:border-white/20"
                }`}
                data-testid={`school-${school.id}`}
              >
                <div className="flex items-center gap-2">
                  <Checkbox checked={isSelected} className="pointer-events-none" />
                  <div>
                    <span className="text-sm font-medium">{school.name}</span>
                    <p className="text-xs text-muted-foreground">{school.conference}</p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
        {(data.schools || []).length > 0 && (
          <div className="p-3 bg-ardito-blue/10 border border-ardito-blue/30 rounded-md">
            <p className="text-sm">
              <span className="font-mono font-bold">{data.schools.length}</span> schools selected
              <span className="text-muted-foreground ml-2">
                Est. fees: ${(data.schools.length * 4000).toLocaleString()}/year
              </span>
            </p>
          </div>
        )}
      </div>

      {/* Channels */}
      <div className="space-y-4">
        <div>
          <Label className="text-base">Activation Channels *</Label>
          <p className="text-sm text-muted-foreground mt-1">Where should activations appear?</p>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {CHANNELS.map((channel) => {
            const isSelected = (data.channels || []).includes(channel.id);
            return (
              <div
                key={channel.id}
                onClick={() => toggleChannel(channel.id)}
                className={`p-3 rounded-md border cursor-pointer transition-all text-center ${
                  isSelected
                    ? "border-ardito-blue bg-ardito-blue/10"
                    : "border-white/10 hover:border-white/20"
                }`}
              >
                <Checkbox checked={isSelected} className="pointer-events-none mb-2" />
                <span className="text-sm font-medium block">{channel.name}</span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

const Step3Creative = ({ data, onChange }) => (
  <div className="space-y-6 max-w-2xl">
    <div className="p-8 border-2 border-dashed border-white/20 rounded-md text-center">
      <Image className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
      <h3 className="font-medium mb-2">Upload Creative Assets</h3>
      <p className="text-sm text-muted-foreground mb-4">
        Drag and drop your creative files here, or click to browse
      </p>
      <Button variant="outline" className="border-white/10">
        Browse Files
      </Button>
      <p className="text-xs text-muted-foreground mt-3">
        Supported: JPG, PNG, MP4 (max 10MB)
      </p>
    </div>

    <div className="space-y-4">
      <div className="space-y-2">
        <Label>CTA Text</Label>
        <Input
          value={data.cta_text || ""}
          onChange={(e) => onChange({ cta_text: e.target.value })}
          placeholder="e.g., Claim Victory Discount"
          className="bg-ardito-charcoal border-white/10"
          maxLength={25}
        />
      </div>
      <div className="space-y-2">
        <Label>CTA URL</Label>
        <Input
          value={data.cta_url || ""}
          onChange={(e) => onChange({ cta_url: e.target.value })}
          placeholder="https://sponsor.com/promo"
          className="bg-ardito-charcoal border-white/10"
        />
      </div>
    </div>

    <div className="p-4 bg-ardito-surface border border-white/10 rounded-md">
      <p className="text-sm text-muted-foreground">
        Creative assets will be automatically customized with school branding.
        Preview will be available after upload.
      </p>
    </div>
  </div>
);

const Step4Review = ({ data, schools }) => {
  const selectedSchools = schools.filter((s) => (data.schools || []).includes(s.id));
  const selectedEmotions = EMOTIONS.filter((e) => (data.target_emotions || []).includes(e.id));

  return (
    <div className="space-y-6 max-w-2xl">
      <div className="bg-ardito-surface border border-white/10 rounded-md p-5">
        <h3 className="text-xs font-medium text-muted-foreground uppercase tracking-wide mb-3">
          Campaign Summary
        </h3>
        <div className="space-y-3">
          <div className="flex justify-between">
            <span className="text-muted-foreground">Name</span>
            <span className="font-medium">{data.name || "Untitled"}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-muted-foreground">Objective</span>
            <Badge variant="outline" className="capitalize">{data.objective}</Badge>
          </div>
          <div className="flex justify-between">
            <span className="text-muted-foreground">Budget</span>
            <span className="font-mono">${data.total_budget?.toLocaleString() || 0}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-muted-foreground">Duration</span>
            <span>{data.start_date} → {data.end_date}</span>
          </div>
        </div>
      </div>

      <div className="bg-ardito-surface border border-white/10 rounded-md p-5">
        <h3 className="text-xs font-medium text-muted-foreground uppercase tracking-wide mb-3">
          Targeting
        </h3>
        <div className="space-y-3">
          <div>
            <span className="text-muted-foreground text-sm">Emotions</span>
            <div className="flex flex-wrap gap-2 mt-1">
              {selectedEmotions.map((e) => (
                <Badge
                  key={e.id}
                  style={{ backgroundColor: `${e.color}20`, color: e.color }}
                >
                  {e.name}
                </Badge>
              ))}
            </div>
          </div>
          <div>
            <span className="text-muted-foreground text-sm">
              Schools ({selectedSchools.length})
            </span>
            <div className="flex flex-wrap gap-2 mt-1">
              {selectedSchools.slice(0, 4).map((s) => (
                <Badge key={s.id} variant="outline">{s.name}</Badge>
              ))}
              {selectedSchools.length > 4 && (
                <Badge variant="outline">+{selectedSchools.length - 4} more</Badge>
              )}
            </div>
          </div>
          <div>
            <span className="text-muted-foreground text-sm">Channels</span>
            <div className="flex flex-wrap gap-2 mt-1">
              {(data.channels || []).map((ch) => (
                <Badge key={ch} variant="outline" className="capitalize">{ch}</Badge>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="bg-ardito-blue/10 border border-ardito-blue/30 rounded-md p-5">
        <h3 className="font-medium mb-3">Estimated Performance</h3>
        <div className="grid grid-cols-3 gap-4 text-center">
          <div>
            <p className="font-mono text-xl font-bold">1.2M - 1.8M</p>
            <p className="text-xs text-muted-foreground">Impressions</p>
          </div>
          <div>
            <p className="font-mono text-xl font-bold text-ardito-green">28% - 35%</p>
            <p className="text-xs text-muted-foreground">Engagement Rate</p>
          </div>
          <div>
            <p className="font-mono text-xl font-bold text-ardito-green">6.5x - 9.2x</p>
            <p className="text-xs text-muted-foreground">Est. ROI</p>
          </div>
        </div>
        <p className="text-xs text-muted-foreground mt-3 text-center">
          Estimates based on historical data from similar campaigns
        </p>
      </div>

      <div className="space-y-3">
        <div className="flex items-start space-x-2">
          <Checkbox id="terms1" required />
          <Label htmlFor="terms1" className="text-sm font-normal cursor-pointer">
            I confirm all creative assets are properly licensed and brand-safe
          </Label>
        </div>
        <div className="flex items-start space-x-2">
          <Checkbox id="terms2" required />
          <Label htmlFor="terms2" className="text-sm font-normal cursor-pointer">
            I confirm this campaign complies with NCAA and conference advertising policies
          </Label>
        </div>
        <div className="flex items-start space-x-2">
          <Checkbox id="terms3" required />
          <Label htmlFor="terms3" className="text-sm font-normal cursor-pointer">
            I accept the Ardito Terms of Service and understand activation fees apply
          </Label>
        </div>
      </div>
    </div>
  );
};

const CreateCampaignPage = () => {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [schools, setSchools] = useState([]);
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    objective: "awareness",
    total_budget: 50000,
    daily_cap: 0,
    start_date: format(addDays(new Date(), 1), "yyyy-MM-dd"),
    end_date: format(addDays(new Date(), 31), "yyyy-MM-dd"),
    target_emotions: [],
    schools: [],
    channels: ["stadium", "mobile"],
    cta_text: "",
    cta_url: "",
  });

  useEffect(() => {
    const fetchSchools = async () => {
      try {
        const response = await api.get("/schools");
        setSchools(response.data);
      } catch (error) {
        console.error("Failed to fetch schools:", error);
      }
    };
    fetchSchools();
  }, []);

  const updateForm = (updates) => {
    setFormData((prev) => ({ ...prev, ...updates }));
  };

  const validateStep = () => {
    switch (step) {
      case 1:
        if (!formData.name) {
          toast.error("Campaign name is required");
          return false;
        }
        if (formData.total_budget < 50000) {
          toast.error("Budget must be at least $50,000");
          return false;
        }
        if (!formData.start_date || !formData.end_date) {
          toast.error("Start and end dates are required");
          return false;
        }
        return true;
      case 2:
        if (formData.target_emotions.length === 0) {
          toast.error("Select at least one emotion trigger");
          return false;
        }
        if (formData.schools.length === 0) {
          toast.error("Select at least one school");
          return false;
        }
        if (formData.channels.length === 0) {
          toast.error("Select at least one channel");
          return false;
        }
        return true;
      default:
        return true;
    }
  };

  const handleNext = () => {
    if (validateStep()) {
      setStep((s) => Math.min(s + 1, 4));
    }
  };

  const handleBack = () => {
    setStep((s) => Math.max(s - 1, 1));
  };

  const handleLaunch = async () => {
    setLoading(true);
    try {
      await api.post("/campaigns", formData);
      toast.success("Campaign created successfully!");
      navigate("/app/campaigns");
    } catch (error) {
      toast.error(error.response?.data?.detail || "Failed to create campaign");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto py-6" data-testid="create-campaign-page">
      {/* Header */}
      <div className="mb-8">
        <Button
          variant="ghost"
          onClick={() => navigate("/app/campaigns")}
          className="mb-4"
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Campaigns
        </Button>
        <h1 className="font-heading text-2xl font-bold">Create Campaign</h1>
        <p className="text-muted-foreground">Set up a new emotion-triggered campaign</p>
      </div>

      {/* Step Indicator */}
      <StepIndicator currentStep={step} />

      {/* Step Content */}
      <div className="bg-ardito-surface border border-white/10 rounded-md p-6">
        <AnimatePresence mode="wait">
          <motion.div
            key={step}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.2 }}
          >
            {step === 1 && <Step1BasicInfo data={formData} onChange={updateForm} />}
            {step === 2 && <Step2Targeting data={formData} onChange={updateForm} schools={schools} />}
            {step === 3 && <Step3Creative data={formData} onChange={updateForm} />}
            {step === 4 && <Step4Review data={formData} schools={schools} />}
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Footer */}
      <div className="flex items-center justify-between mt-6">
        <Button
          variant="outline"
          onClick={handleBack}
          disabled={step === 1}
          className="border-white/10"
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back
        </Button>
        <div className="flex gap-3">
          <Button variant="outline" className="border-white/10">
            Save Draft
          </Button>
          {step < 4 ? (
            <Button
              onClick={handleNext}
              className="bg-ardito-blue hover:bg-blue-600"
              data-testid="next-step-btn"
            >
              Next
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          ) : (
            <Button
              onClick={handleLaunch}
              disabled={loading}
              className="bg-ardito-green hover:bg-green-600 text-black"
              data-testid="launch-campaign-btn"
            >
              <Rocket className="mr-2 h-4 w-4" />
              {loading ? "Launching..." : "Launch Campaign"}
            </Button>
          )}
        </div>
      </div>
    </div>
  );
};

export default CreateCampaignPage;
