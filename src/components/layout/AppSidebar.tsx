import { NavLink, useLocation } from "react-router-dom";
import {
  LayoutDashboard, Users, Droplet, Siren, Syringe, ClipboardCheck,
  Building2, Hospital, UserCog, Tent, ArrowLeftRight, FileText, Heart
} from "lucide-react";
import { cn } from "@/lib/utils";

const items = [
  { to: "/app", label: "Dashboard", icon: LayoutDashboard, end: true },
  { to: "/app/donors", label: "Donors", icon: Users },
  { to: "/app/stock", label: "Blood Stock", icon: Droplet },
  { to: "/app/emergency", label: "Emergency", icon: Siren },
  { to: "/app/donations", label: "Donations", icon: Syringe },
  { to: "/app/screening", label: "Screening", icon: ClipboardCheck },
  { to: "/app/banks", label: "Blood Banks", icon: Building2 },
  { to: "/app/hospitals", label: "Hospitals", icon: Hospital },
  { to: "/app/staff", label: "Staff", icon: UserCog },
  { to: "/app/camps", label: "Camps", icon: Tent },
  { to: "/app/transfers", label: "Transfers", icon: ArrowLeftRight },
  { to: "/app/reports", label: "Reports", icon: FileText },
];

export function AppSidebar() {
  const loc = useLocation();
  return (
    <aside className="hidden md:flex w-64 shrink-0 flex-col bg-sidebar text-sidebar-foreground border-r border-sidebar-border">
      <div className="px-6 py-6 border-b border-sidebar-border">
        <div className="flex items-center gap-2">
          <div className="h-9 w-9 rounded-xl gradient-primary grid place-items-center shadow-glow">
            <Heart className="h-5 w-5 text-primary-foreground" fill="currentColor" />
          </div>
          <div>
            <div className="font-display font-bold text-base leading-tight">SBB-ERMS</div>
            <div className="text-[10px] uppercase tracking-widest text-sidebar-foreground/60">Smart Blood Bank</div>
          </div>
        </div>
      </div>
      <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
        {items.map(({ to, label, icon: Icon, end }) => (
          <NavLink
            key={to}
            to={to}
            end={end}
            className={({ isActive }) =>
              cn(
                "flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-smooth",
                isActive
                  ? "bg-primary text-primary-foreground shadow-elegant"
                  : "text-sidebar-foreground/80 hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
              )
            }
          >
            <Icon className="h-4 w-4" />
            {label}
          </NavLink>
        ))}
      </nav>
      <div className="px-6 py-4 border-t border-sidebar-border text-[10px] leading-snug text-sidebar-foreground/50">
        © 2026 Smart Blood Bank & Emergency Response Management System
      </div>
    </aside>
  );
}