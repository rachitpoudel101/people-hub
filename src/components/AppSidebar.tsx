import { NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import {
  LayoutDashboard,
  Users,
  Building2,
  GitBranch,
  Layers,
  Award,
  CalendarCheck,
  CalendarDays,
  Megaphone,
  LogOut,
  ChevronLeft,
  ChevronRight,
  User,
} from "lucide-react";
import { useState } from "react";
import { cn } from "@/lib/utils";

const AppSidebar = () => {
  const { user, logout, hasRole } = useAuth();
  const navigate = useNavigate();
  const [collapsed, setCollapsed] = useState(false);

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const navItems = [
    { to: "/", icon: LayoutDashboard, label: "Dashboard", roles: undefined },
    { to: "/users", icon: Users, label: "Users", roles: ["SUPERADMIN", "ADMIN", "HR"] as const },
    { to: "/employees", icon: User, label: "Employees", roles: ["SUPERADMIN", "ADMIN", "HR", "MANAGER"] as const },
    { to: "/companies", icon: Building2, label: "Companies", roles: ["SUPERADMIN"] as const },
    { to: "/branches", icon: GitBranch, label: "Branches", roles: ["SUPERADMIN", "ADMIN"] as const },
    { to: "/departments", icon: Layers, label: "Departments", roles: ["SUPERADMIN", "ADMIN", "HR"] as const },
    { to: "/designations", icon: Award, label: "Designations", roles: ["SUPERADMIN", "ADMIN", "HR"] as const },
    { to: "/attendance", icon: CalendarCheck, label: "Attendance", roles: undefined },
    { to: "/holidays", icon: CalendarDays, label: "Holidays", roles: undefined },
    { to: "/notices", icon: Megaphone, label: "Notices", roles: undefined },
  ];

  const filteredNav = navItems.filter(
    (item) => !item.roles || hasRole(...(item.roles as any))
  );

  return (
    <aside
      className={cn(
        "h-screen sticky top-0 flex flex-col bg-sidebar text-sidebar-foreground transition-all duration-300 border-r border-sidebar-border",
        collapsed ? "w-16" : "w-60"
      )}
    >
      <div className="flex items-center gap-2 p-4 border-b border-sidebar-border">
        <Building2 className="h-7 w-7 text-sidebar-primary shrink-0" />
        {!collapsed && <span className="text-lg font-bold text-sidebar-primary">HRMS</span>}
      </div>

      <nav className="flex-1 py-3 overflow-y-auto scrollbar-thin">
        {filteredNav.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            end={item.to === "/"}
            className={({ isActive }) =>
              cn(
                "flex items-center gap-3 mx-2 px-3 py-2.5 rounded-md text-sm transition-colors duration-150",
                isActive
                  ? "bg-sidebar-accent text-sidebar-accent-foreground font-medium"
                  : "text-sidebar-foreground/70 hover:bg-sidebar-accent/50 hover:text-sidebar-foreground"
              )
            }
          >
            <item.icon className="h-4.5 w-4.5 shrink-0" />
            {!collapsed && <span>{item.label}</span>}
          </NavLink>
        ))}
      </nav>

      <div className="border-t border-sidebar-border p-3">
        {!collapsed && user && (
          <div className="px-3 mb-3">
            <p className="text-sm font-medium text-sidebar-foreground truncate">
              {user.first_name} {user.last_name}
            </p>
            <p className="text-xs text-sidebar-foreground/50">{user.role}</p>
          </div>
        )}
        <div className="flex items-center justify-between">
          <button
            onClick={handleLogout}
            className="flex items-center gap-2 px-3 py-2 text-sm text-sidebar-foreground/70 hover:text-sidebar-foreground transition-colors rounded-md hover:bg-sidebar-accent/50"
          >
            <LogOut className="h-4 w-4" />
            {!collapsed && "Logout"}
          </button>
          <button
            onClick={() => setCollapsed(!collapsed)}
            className="p-1.5 rounded-md text-sidebar-foreground/50 hover:text-sidebar-foreground hover:bg-sidebar-accent/50 transition-colors"
          >
            {collapsed ? <ChevronRight className="h-4 w-4" /> : <ChevronLeft className="h-4 w-4" />}
          </button>
        </div>
      </div>
    </aside>
  );
};

export default AppSidebar;
