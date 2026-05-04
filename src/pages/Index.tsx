import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Heart, Droplet, Siren, MapPin, ShieldCheck, Activity, Zap, QrCode, ArrowRight, Bell } from "lucide-react";
import hero from "@/assets/hero.jpg";

const stats = [
  { value: "12,480+", label: "Total Donors" },
  { value: "3,120", label: "Blood Units" },
  { value: "156", label: "Emergency Requests" },
  { value: "84", label: "Active Banks" },
];

const features = [
  { icon: Activity, title: "Real-time Stock Tracking", desc: "Live GPS-integrated inventory across all city blood banks." },
  { icon: Zap, title: "Emergency Dispatch", desc: "Automated priority handling for critical surgeries and trauma." },
  { icon: ShieldCheck, title: "Eligibility Verification", desc: "Digital health screening ensures donor safety standards." },
  { icon: QrCode, title: "Smart Donor Passport", desc: "Donation history and rewards in a single digital ID." },
];

export default function Index() {
  return (
    <div className="min-h-screen bg-background">
      {/* Nav */}
      <header className="sticky top-0 z-40 backdrop-blur-xl bg-background/70 border-b border-border">
        <div className="container flex items-center justify-between h-16">
          <Link to="/" className="flex items-center gap-2">
            <div className="h-9 w-9 rounded-xl gradient-primary grid place-items-center shadow-glow">
              <Heart className="h-5 w-5 text-primary-foreground" fill="currentColor" />
            </div>
            <span className="font-display font-bold text-lg">SBB<span className="text-primary">-ERMS</span></span>
          </Link>
          <nav className="hidden md:flex items-center gap-8 text-sm font-medium">
            <a href="#features" className="hover:text-primary transition-smooth">Features</a>
            <a href="#stats" className="hover:text-primary transition-smooth">Impact</a>
            <a href="#contact" className="hover:text-primary transition-smooth">Contact</a>
          </nav>
          <div className="flex items-center gap-2">
            <Button asChild variant="outline">
              <Link to="/app">Dashboard</Link>
            </Button>
            <Button asChild className="gradient-primary text-primary-foreground hover:opacity-90 shadow-elegant">
              <Link to="/login">Sign In <ArrowRight className="ml-1 h-4 w-4" /></Link>
            </Button>
          </div>
        </div>
      </header>

      {/* Urgent banner */}
      <div className="bg-destructive text-destructive-foreground">
        <div className="container flex flex-wrap items-center justify-center gap-3 py-2.5 text-sm font-semibold">
          <Bell className="h-4 w-4 animate-pulse" />
          URGENT — O- BLOOD REQUIRED AT CITY HOSPITAL
          <Button size="sm" variant="secondary" asChild className="ml-2 h-7 rounded-full">
            <Link to="/app/emergency">Respond Now</Link>
          </Button>
        </div>
      </div>

      {/* Hero */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0">
          <img src={hero} alt="Hospital corridor" width={1600} height={900} className="w-full h-full object-cover opacity-40" />
          <div className="absolute inset-0 bg-gradient-to-r from-background via-background/85 to-transparent" />
        </div>
        <div className="container relative py-20 md:py-32 grid md:grid-cols-2 gap-12 items-center">
          <div className="animate-fade-in">
            <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-accent text-accent-foreground text-xs font-semibold tracking-wide">
              <Droplet className="h-3.5 w-3.5" /> ADVANCED MANAGEMENT SYSTEM
            </span>
            <h1 className="mt-5 font-display font-bold text-5xl md:text-6xl leading-[1.05] tracking-tight">
              Smart Blood Bank &<br />
              <span className="text-gradient">Emergency Response</span>
            </h1>
            <p className="mt-5 text-lg text-muted-foreground max-w-lg">
              Where every drop is tracked, every life matters. Our platform connects donors, blood banks and hospitals in real time.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Button asChild size="lg" className="gradient-primary text-primary-foreground shadow-elegant hover:scale-[1.02] transition-smooth">
                <Link to="/app/donors"><Heart className="mr-2 h-4 w-4" fill="currentColor" /> Donate Blood</Link>
              </Button>
              <Button asChild size="lg" variant="outline" className="border-primary text-primary hover:bg-primary hover:text-primary-foreground transition-smooth">
                <Link to="/app/emergency"><Siren className="mr-2 h-4 w-4" /> Request Blood</Link>
              </Button>
            </div>
            <Link to="/app/stock" className="inline-flex items-center gap-1 mt-5 text-sm font-medium hover:text-primary transition-smooth">
              <MapPin className="h-3.5 w-3.5" /> Check Local Availability
            </Link>
          </div>

          <Card className="p-6 shadow-elegant backdrop-blur-xl bg-card/95 animate-scale-in">
            <div className="flex items-center gap-2 mb-4">
              <Activity className="h-4 w-4 text-primary" />
              <h3 className="font-display font-semibold">Live Inventory</h3>
            </div>
            {[
              { g: "Type O+ Positive", pct: 82, label: "82% Stocked", tone: "bg-success" },
              { g: "Type AB- Negative", pct: 12, label: "12% Critical", tone: "bg-destructive" },
              { g: "Type A+ Positive", pct: 45, label: "45% Moderate", tone: "bg-warning" },
            ].map(r => (
              <div key={r.g} className="mb-4 last:mb-0">
                <div className="flex justify-between text-sm mb-1.5">
                  <span className="font-medium">{r.g}</span>
                  <span className="text-muted-foreground">{r.label}</span>
                </div>
                <div className="h-2 rounded-full bg-muted overflow-hidden">
                  <div className={`h-full ${r.tone} transition-all duration-700`} style={{ width: `${r.pct}%` }} />
                </div>
              </div>
            ))}
            <div className="mt-5 pt-4 border-t border-border flex items-center gap-3 text-xs text-muted-foreground">
              <div className="flex -space-x-2">
                {["bg-primary","bg-warning","bg-success"].map((c,i) => (
                  <div key={i} className={`h-6 w-6 rounded-full ${c} ring-2 ring-card`} />
                ))}
              </div>
              24+ recently active responders
            </div>
          </Card>
        </div>
      </section>

      {/* Stats */}
      <section id="stats" className="bg-accent/40 border-y border-border">
        <div className="container py-12 grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
          {stats.map(s => (
            <div key={s.label}>
              <div className="font-display font-bold text-3xl md:text-4xl text-primary">{s.value}</div>
              <div className="text-xs uppercase tracking-widest text-muted-foreground mt-1">{s.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* Features */}
      <section id="features" className="container py-20">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <h2 className="font-display font-bold text-4xl">Engineered for Precision</h2>
          <p className="mt-3 text-muted-foreground">Advanced logistics and real-time data bridging supply and demand.</p>
        </div>
        <div className="grid md:grid-cols-2 gap-6">
          {features.map(f => (
            <Card key={f.title} className="p-7 shadow-card hover:shadow-elegant hover:-translate-y-1 transition-smooth group">
              <div className="h-11 w-11 rounded-xl bg-accent grid place-items-center mb-4 group-hover:bg-primary group-hover:text-primary-foreground transition-smooth">
                <f.icon className="h-5 w-5" />
              </div>
              <h3 className="font-display font-semibold text-xl">{f.title}</h3>
              <p className="mt-2 text-muted-foreground text-sm">{f.desc}</p>
            </Card>
          ))}
        </div>
      </section>

      <footer id="contact" className="border-t border-border bg-card">
        <div className="container py-10 grid md:grid-cols-3 gap-8 text-sm">
          <div>
            <div className="flex items-center gap-2 mb-3">
              <Heart className="h-4 w-4 text-primary" fill="currentColor" />
              <span className="font-display font-bold">SBB-ERMS</span>
            </div>
            <p className="text-muted-foreground">Revolutionizing emergency response through intelligent blood supply management.</p>
          </div>
          <div>
            <div className="font-semibold mb-3">Resources</div>
            <ul className="space-y-2 text-muted-foreground">
              <li>Donor Guidelines</li><li>Medical FAQ</li><li>Privacy Policy</li>
            </ul>
          </div>
          <div>
            <div className="font-semibold mb-3">Contact</div>
            <ul className="space-y-2 text-muted-foreground">
              <li>+1 (800) EMERGENCY</li><li>support@hemacare.org</li>
            </ul>
          </div>
        </div>
        <div className="border-t border-border py-4 text-center text-xs text-muted-foreground">
          © 2026 Smart Blood Bank & Emergency Response Management System. All rights reserved.
        </div>
      </footer>
    </div>
  );
}
