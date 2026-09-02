import { useAuth } from "@/contexts/AuthContext";
import { Badge } from "@/components/ui/badge";

interface PageHeaderProps {
  title: string;
  description: string;
  action?: React.ReactNode;
}

const roleColors: Record<string, string> = {
  SUPERADMIN: "bg-destructive/10 text-destructive border-destructive/20",
  ADMIN: "bg-primary/10 text-primary border-primary/20",
  HR: "bg-info/10 text-info border-info/20",
  MANAGER: "bg-warning/10 text-warning border-warning/20",
  EMPLOYEE: "bg-muted text-muted-foreground border-border",
};

export const PageHeader = ({ title, description, action }: PageHeaderProps) => {
  const { user } = useAuth();

  return (
    <div className="page-header flex items-start justify-between mb-6">
      <div className="flex-1">
        <div className="flex items-center gap-3 mb-1">
          <h1 className="page-title">{title}</h1>
          {user && (
            <Badge variant="outline" className={roleColors[user.role]}>
              {user.role}
            </Badge>
          )}
        </div>
        <p className="page-description">{description}</p>
        {user && (
          <p className="text-xs text-muted-foreground mt-1">
            Logged in as:{" "}
            <span className="font-medium">
              {user.first_name} {user.last_name}
            </span>{" "}
            ({user.username})
          </p>
        )}
      </div>
      {action && <div>{action}</div>}
    </div>
  );
};
