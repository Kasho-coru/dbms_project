import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { ThemeProvider } from "@/components/theme-provider";
import Index from "./pages/Index.tsx";
import NotFound from "./pages/NotFound.tsx";
import AppLayout from "./components/layout/AppLayout";
import Dashboard from "./pages/app/Dashboard";
import Donors from "./pages/app/Donors";
import BloodStock from "./pages/app/BloodStock";
import Emergency from "./pages/app/Emergency";
import Donations from "./pages/app/Donations";
import Screening from "./pages/app/Screening";
import Banks from "./pages/app/Banks";
import Hospitals from "./pages/app/Hospitals";
import Staff from "./pages/app/Staff";
import Camps from "./pages/app/Camps";
import Transfers from "./pages/app/Transfers";
import Reports from "./pages/app/Reports";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <ThemeProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/app" element={<AppLayout />}>
              <Route index element={<Dashboard />} />
              <Route path="donors" element={<Donors />} />
              <Route path="stock" element={<BloodStock />} />
              <Route path="emergency" element={<Emergency />} />
              <Route path="donations" element={<Donations />} />
              <Route path="screening" element={<Screening />} />
              <Route path="banks" element={<Banks />} />
              <Route path="hospitals" element={<Hospitals />} />
              <Route path="staff" element={<Staff />} />
              <Route path="camps" element={<Camps />} />
              <Route path="transfers" element={<Transfers />} />
              <Route path="reports" element={<Reports />} />
            </Route>
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </ThemeProvider>
  </QueryClientProvider>
);

export default App;
