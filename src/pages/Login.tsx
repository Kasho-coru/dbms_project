import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Heart, Shield, Building2, User } from "lucide-react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";

const roles = [
  { id: "admin", label: "Admin", icon: Shield, desc: "Full system control" },
  { id: "staff", label: "Bank Staff", icon: Building2, desc: "Manage donors & stock" },
  { id: "user", label: "Donor / Hospital", icon: User, desc: "Request or donate" },
];

export default function Login() {
  const nav = useNavigate();
  const [role, setRole] = useState("admin");
  const [email, setEmail] = useState("");
  const [pass, setPass] = useState("");
  const [mode, setMode] = useState<"signin" | "signup">("signin");
  const [loading, setLoading] = useState(false);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !pass) { toast.error("Enter email and password"); return; }
    setLoading(true);
    try {
      if (mode === "signup") {
        const { error } = await supabase.auth.signUp({
          email, password: pass,
          options: { emailRedirectTo: `${window.location.origin}/app` }
        });
        if (error) throw error;
        toast.success("Account created. Check your email to confirm, then sign in.");
        setMode("signin");
      } else {
        const { data, error } = await supabase.auth.signInWithPassword({ email, password: pass });
        if (error) throw error;
        const uname = data.user?.email?.split("@")[0] || "User";
        localStorage.setItem("sbb_role", role);
        localStorage.setItem("sbb_username", uname);
        toast.success(`Welcome ${uname}`);
        nav("/app");
      }
    } catch (err: any) {
      toast.error(err.message || "Authentication failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen grid place-items-center bg-gradient-to-br from-background via-background to-accent/30 p-4">
      <Card className="w-full max-w-md p-8 shadow-elegant animate-scale-in">
        <Link to="/" className="flex items-center gap-2 justify-center mb-6">
          <div className="h-11 w-11 rounded-xl gradient-primary grid place-items-center shadow-glow">
            <Heart className="h-6 w-6 text-primary-foreground" fill="currentColor" />
          </div>
          <span className="font-display font-bold text-xl">SBB-ERMS</span>
        </Link>
        <h1 className="font-display font-bold text-2xl text-center">Welcome back</h1>
        <p className="text-sm text-muted-foreground text-center mt-1 mb-6">Smart Blood Bank & Emergency Response</p>

        <div className="grid grid-cols-3 gap-2 mb-5">
          {roles.map(r => {
            const I = r.icon;
            const active = role === r.id;
            return (
              <button key={r.id} type="button" onClick={() => setRole(r.id)}
                className={`p-3 rounded-lg border-2 text-center transition-smooth ${active ? "border-primary bg-primary/10 shadow-elegant" : "border-border hover:border-primary/40"}`}>
                <I className={`h-5 w-5 mx-auto mb-1 ${active ? "text-primary" : "text-muted-foreground"}`} />
                <div className="text-xs font-semibold">{r.label}</div>
              </button>
            );
          })}
        </div>

        <form onSubmit={submit} className="space-y-4">
          <div>
            <Label className="text-xs">Email</Label>
            <Input type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="you@example.com" />
          </div>
          <div>
            <Label className="text-xs">Password</Label>
            <Input type="password" value={pass} onChange={e => setPass(e.target.value)} placeholder="••••••••" />
          </div>
          <Button type="submit" disabled={loading} className="w-full gradient-primary text-primary-foreground shadow-elegant">
            {loading ? "Please wait..." : mode === "signin" ? "Sign In" : "Sign Up"}
          </Button>
          <button type="button" onClick={() => setMode(mode === "signin" ? "signup" : "signin")}
            className="w-full text-xs text-muted-foreground hover:text-primary transition-smooth">
            {mode === "signin" ? "No account? Sign up" : "Have an account? Sign in"}
          </button>
        </form>
        <p className="text-xs text-center text-muted-foreground mt-5">Tip: Add a test user in Cloud → Users for quick access.</p>
      </Card>
    </div>
  );
}