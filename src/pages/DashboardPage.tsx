import { useAuth } from "@/contexts/AuthContext";
import { Users, CalendarCheck, Megaphone, Building2, TrendingUp, Clock } from "lucide-react";

const StatCard = ({
  icon: Icon,
  label,
  value,
  change,
  color,
}: {
  icon: any;
  label: string;
  value: string;
  change?: string;
  color: string;
}) => (
  <div className="stat-card animate-fade-in">
    <div className="flex items-start justify-between">
      <div>
        <p className="text-sm text-muted-foreground">{label}</p>
        <p className="text-2xl font-semibold mt-1 tracking-tight">{value}</p>
        {change && (
          <p className="text-xs text-success mt-2 flex items-center gap-1">
            <TrendingUp className="h-3 w-3" /> {change}
          </p>
        )}
      </div>
      <div className={`p-2.5 rounded-lg ${color}`}>
        <Icon className="h-5 w-5" />
      </div>
    </div>
  </div>
);

const DashboardPage = () => {
  const { user, hasRole } = useAuth();

  const stats = [
    {
      icon: Users,
      label: "Total Employees",
      value: "248",
      change: "+12 this month",
      color: "bg-primary/10 text-primary",
    },
    {
      icon: CalendarCheck,
      label: "Present Today",
      value: "213",
      change: "86% attendance",
      color: "bg-success/10 text-success",
    },
    {
      icon: Clock,
      label: "On Leave",
      value: "18",
      color: "bg-warning/10 text-warning",
    },
    {
      icon: Megaphone,
      label: "Active Notices",
      value: "7",
      color: "bg-info/10 text-info",
    },
  ];

  const recentActivities = [
    { text: "Ramesh Sharma checked in", time: "2 min ago", type: "attendance" },
    { text: "New holiday added: Dashain", time: "1 hour ago", type: "holiday" },
    { text: "Sita Rai submitted leave request", time: "3 hours ago", type: "leave" },
    { text: "Department 'Engineering' updated", time: "5 hours ago", type: "department" },
    { text: "Notice: Office closure on Friday", time: "Yesterday", type: "notice" },
  ];

  return (
    <div>
      <div className="page-header">
        <h1 className="page-title">
          Welcome back, {user?.first_name || "User"}
        </h1>
        <p className="page-description">
          Here's what's happening across your organization today.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {stats.map((stat, i) => (
          <div key={stat.label} style={{ animationDelay: `${i * 80}ms` }}>
            <StatCard {...stat} />
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 data-table-container p-6 animate-fade-in" style={{ animationDelay: "300ms" }}>
          <h2 className="text-lg font-semibold mb-4">Recent Activity</h2>
          <div className="space-y-4">
            {recentActivities.map((activity, i) => (
              <div
                key={i}
                className="flex items-center justify-between py-2 border-b border-border last:border-0"
              >
                <p className="text-sm">{activity.text}</p>
                <span className="text-xs text-muted-foreground whitespace-nowrap ml-4">
                  {activity.time}
                </span>
              </div>
            ))}
          </div>
        </div>

        <div className="data-table-container p-6 animate-fade-in" style={{ animationDelay: "400ms" }}>
          <h2 className="text-lg font-semibold mb-4">Quick Actions</h2>
          <div className="space-y-2">
            {hasRole("SUPERADMIN", "ADMIN", "HR") && (
              <QuickAction icon={Users} label="Add Employee" href="/employees" />
            )}
            <QuickAction icon={CalendarCheck} label="View Attendance" href="/attendance" />
            <QuickAction icon={Megaphone} label="Post Notice" href="/notices" />
            {hasRole("SUPERADMIN", "ADMIN") && (
              <QuickAction icon={Building2} label="Manage Branches" href="/branches" />
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

const QuickAction = ({ icon: Icon, label, href }: { icon: any; label: string; href: string }) => (
  <a
    href={href}
    className="flex items-center gap-3 p-3 rounded-md hover:bg-muted transition-colors group"
  >
    <div className="p-2 rounded-md bg-primary/10 text-primary group-hover:bg-primary group-hover:text-primary-foreground transition-colors">
      <Icon className="h-4 w-4" />
    </div>
    <span className="text-sm font-medium">{label}</span>
  </a>
);

export default DashboardPage;
