import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { AuthProvider } from "@/contexts/AuthContext";
import ProtectedRoute from "@/components/ProtectedRoute";
import LoginPage from "@/pages/LoginPage";
import DashboardPage from "@/pages/DashboardPage";
import UsersPage from "@/pages/UsersPage";
import EmployeesPage from "@/pages/EmployeesPage";
import CompaniesPage from "@/pages/CompaniesPage";
import BranchesPage from "@/pages/BranchesPage";
import DepartmentsPage from "@/pages/DepartmentsPage";
import DesignationsPage from "@/pages/DesignationsPage";
import AttendancePage from "@/pages/AttendancePage";
import HolidaysPage from "@/pages/HolidaysPage";
import NoticesPage from "@/pages/NoticesPage";
import NotFound from "@/pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <AuthProvider>
          <Routes>
            <Route path="/login" element={<LoginPage />} />
            <Route element={<ProtectedRoute />}>
              <Route path="/" element={<DashboardPage />} />
              <Route path="/users" element={<UsersPage />} />
              <Route path="/employees" element={<EmployeesPage />} />
              <Route path="/companies" element={<CompaniesPage />} />
              <Route path="/branches" element={<BranchesPage />} />
              <Route path="/departments" element={<DepartmentsPage />} />
              <Route path="/designations" element={<DesignationsPage />} />
              <Route path="/attendance" element={<AttendancePage />} />
              <Route path="/holidays" element={<HolidaysPage />} />
              <Route path="/notices" element={<NoticesPage />} />
            </Route>
            <Route path="*" element={<NotFound />} />
          </Routes>
        </AuthProvider>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
