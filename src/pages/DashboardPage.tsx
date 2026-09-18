import { useState, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { Users, CalendarCheck, Megaphone, Building2, TrendingUp, Clock } from "lucide-react";
import { apiRequest } from "@/lib/api";
import { useToast } from "@/hooks/use-toast";
import { AttendanceClockCard } from "@/components/AttendanceClockCard";

interface DashboardStats {
  total_employees?: number;
  today_present?: number;
  today_absent?: number;
  today_on_leave?: number;
  today_wfh?: number;
  attendance_rate?: number;
  total_team_members?: number;
  team_attendance_rate?: number;
  monthly_attendance_days?: number;
  monthly_present_days?: number;
  monthly_attendance_rate?: number;
}

interface DashboardActivity {
  id: number;
  type: string;
  employee_name: string;
  employee_id: string;
  date: string;
  check_in: string | null;
  check_out: string | null;
  status: string;
  is_approved: boolean;
}

interface DashboardResponse {
  user: {
    name: string;
    employee_id: string;
    role: string;
    department: string | null;
    designation: string | null;
  };
  today_status: {
    has_checked_in: boolean;
    has_checked_out: boolean;
    check_in_time: string | null;
    check_out_time: string | null;
    status: string | null;
    is_approved: boolean;
  };
  statistics: DashboardStats;
  recent_activities: DashboardActivity[];
  pending_approvals?: {
    total_pending: number;
    pending_today: number;
    pending_this_week: number;
  };
  upcoming_events: {
    holidays: Array<{ id: number; title: string; date: string }>;
    notices: Array<{ id: number; name: string; date: string }>;
  };
}

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

// Helper function to format time ago
const getTimeAgo = (dateString: string): string => {
  const date = new Date(dateString);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffMins = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMs / 3600000);
  const diffDays = Math.floor(diffMs / 86400000);

  if (diffMins < 1) return "Just now";
  if (diffMins < 60) return `${diffMins} min ago`;
  if (diffHours < 24) return `${diffHours} hour${diffHours > 1 ? "s" : ""} ago`;
  if (diffDays < 7) return `${diffDays} day${diffDays > 1 ? "s" : ""} ago`;
  return date.toLocaleDateString();
};

const DashboardPage = () => {
  const { user, hasRole } = useAuth();
  const { toast } = useToast();
  const [dashboardData, setDashboardData] = useState<DashboardResponse | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      const data = await apiRequest<DashboardResponse>("/dashboard/activities/");
      setDashboardData(data);
    } catch (error) {
      console.error("Failed to fetch dashboard data:", error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to load dashboard data",
      });
    } finally {
      setLoading(false);
    }
  };

  const stats = dashboardData?.statistics || {};

  const statCards = [
    {
      icon: Users,
      label: "Total Employees",
      value: loading ? "..." : (stats.total_employees || stats.total_team_members || 0).toString(),
      change: stats.attendance_rate ? `${stats.attendance_rate}% present` : undefined,
      color: "bg-primary/10 text-primary",
    },
    {
      icon: CalendarCheck,
      label: "Present Today",
      value: loading ? "..." : (stats.today_present || 0).toString(),
      change: stats.attendance_rate
        ? `${stats.attendance_rate}% attendance`
        : stats.team_attendance_rate
          ? `${stats.team_attendance_rate}% team rate`
          : undefined,
      color: "bg-success/10 text-success",
    },
    {
      icon: Clock,
      label: "On Leave",
      value: loading ? "..." : (stats.today_on_leave || 0).toString(),
      color: "bg-warning/10 text-warning",
    },
    {
      icon: Megaphone,
      label: "Notices",
      value: loading ? "..." : (dashboardData?.upcoming_events?.notices?.length || 0).toString(),
      color: "bg-info/10 text-info",
    },
  ];

  return (
    <div>
      <div className="page-header">
        <h1 className="page-title">Welcome back, {user?.first_name || "User"}</h1>
        <p className="page-description">Here's what's happening across your organization today.</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {statCards.map((stat, i) => (
          <div key={stat.label} style={{ animationDelay: `${i * 80}ms` }}>
            <StatCard {...stat} />
          </div>
        ))}
      </div>

      <div className="mb-6">
        <AttendanceClockCard />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div
          className="lg:col-span-2 data-table-container p-6 animate-fade-in"
          style={{ animationDelay: "300ms" }}
        >
          <h2 className="text-lg font-semibold mb-4">Recent Activity</h2>
          <div className="space-y-4">
            {loading ? (
              <div className="text-center text-muted-foreground py-4">Loading activities...</div>
            ) : !dashboardData?.recent_activities ||
              dashboardData.recent_activities.length === 0 ? (
              <div className="text-center text-muted-foreground py-4">No recent activities</div>
            ) : (
              dashboardData.recent_activities.map((activity) => {
                const timeAgo = getTimeAgo(activity.date);
                const statusText = activity.status.replace(/_/g, " ");
                const activityText = `${activity.employee_name} - ${statusText}`;
                const checkInTime = activity.check_in
                  ? new Date(activity.check_in).toLocaleTimeString("en-US", {
                      hour: "2-digit",
                      minute: "2-digit",
                      hour12: true,
                    })
                  : null;
                const checkOutTime = activity.check_out
                  ? new Date(activity.check_out).toLocaleTimeString("en-US", {
                      hour: "2-digit",
                      minute: "2-digit",
                      hour12: true,
                    })
                  : null;

                return (
                  <div
                    key={activity.id}
                    className="flex items-center justify-between py-2 border-b border-border last:border-0"
                  >
                    <div className="flex-1">
                      <p className="text-sm font-medium">{activityText}</p>
                      <p className="text-xs text-muted-foreground">
                        {checkInTime || "Not checked in"}
                        {checkOutTime && ` - ${checkOutTime}`}
                      </p>
                    </div>
                    <span className="text-xs text-muted-foreground whitespace-nowrap ml-4">
                      {timeAgo}
                    </span>
                  </div>
                );
              })
            )}
          </div>
        </div>

        <div
          className="data-table-container p-6 animate-fade-in"
          style={{ animationDelay: "400ms" }}
        >
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
