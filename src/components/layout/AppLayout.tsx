import { Outlet, NavLink, Link } from "react-router-dom";
import { AppSidebar } from "./AppSidebar";
import { useTheme } from "next-themes";
import { Moon, Sun, Bell, Heart, Home } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useEffect, useState } from "react";
import {
  Sheet, SheetContent, SheetTrigger
} from "@/components/ui/sheet";
import { Menu } from "lucide-react";
import {
  DropdownMenu, DropdownMenuContent, DropdownMenuItem,
  DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger
} from "@/components/ui/dropdown-menu";

export default function AppLayout() {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const [username, setUsername] = useState("Guest");
  const [role, setRole] = useState("user");
  useEffect(() => {
    setMounted(true);
    setUsername(localStorage.getItem("sbb_username") || "Guest");
    setRole(localStorage.getItem("sbb_role") || "user");
  }, []);

  const initials = username.slice(0, 2).toUpperCase();
  const roleLabel = role === "admin" ? "Administrator" : role === "staff" ? "Bank Staff" : "Donor / Hospital";

  const notifications = [
    { title: "URGENT: O- needed at City Hospital", time: "2m ago" },
    { title: "Low stock alert — AB- below threshold", time: "1h ago" },
    { title: "New donor registered: Coral", time: "3h ago" },
    { title: "Camp scheduled for next Saturday", time: "1d ago" },
  ];

  return (
    <div className="min-h-screen flex bg-background">
      <AppSidebar />
      <div className="flex-1 flex flex-col min-w-0">
        <header className="sticky top-0 z-30 h-16 border-b border-border bg-card/80 backdrop-blur-xl flex items-center justify-between px-4 md:px-8">
          <div className="flex items-center gap-3">
            <Sheet>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon" className="md:hidden">
                  <Menu className="h-5 w-5" />
                </Button>
              </SheetTrigger>
              <SheetContent side="left" className="p-0 w-64 bg-sidebar text-sidebar-foreground border-sidebar-border">
                <div className="md:hidden"><AppSidebar /></div>
              </SheetContent>
            </Sheet>
            <NavLink to="/" className="md:hidden flex items-center gap-2">
              <div className="h-8 w-8 rounded-lg gradient-primary grid place-items-center">
                <Heart className="h-4 w-4 text-primary-foreground" fill="currentColor" />
              </div>
              <span className="font-display font-bold">SBB-ERMS</span>
            </NavLink>
          </div>
          <div className="flex items-center gap-2">
            <Button asChild variant="ghost" size="icon" title="Home">
              <Link to="/"><Home className="h-5 w-5" /></Link>
            </Button>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="relative">
                  <Bell className="h-5 w-5" />
                  <span className="absolute top-2 right-2 h-2 w-2 rounded-full bg-primary animate-pulse-ring" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-80">
                <DropdownMenuLabel>Notifications</DropdownMenuLabel>
                <DropdownMenuSeparator />
                {notifications.map((n, i) => (
                  <DropdownMenuItem key={i} className="flex flex-col items-start gap-1 py-2">
                    <span className="text-sm font-medium">{n.title}</span>
                    <span className="text-xs text-muted-foreground">{n.time}</span>
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>
            {mounted && (
              <Button variant="ghost" size="icon" onClick={() => setTheme(theme === "dark" ? "light" : "dark")}>
                {theme === "dark" ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
              </Button>
            )}
            <div className="hidden sm:flex items-center gap-3 pl-3 ml-1 border-l border-border">
              <div className="h-9 w-9 rounded-full gradient-primary grid place-items-center text-primary-foreground font-semibold text-sm">{initials}</div>
              <div className="text-sm leading-tight">
                <div className="font-semibold">{username}</div>
                <div className="text-xs text-muted-foreground">{roleLabel}</div>
              </div>
            </div>
          </div>
        </header>
        <main className="flex-1 p-4 md:p-8 animate-fade-in">
          <Outlet />
        </main>
      </div>
    </div>
  );
}