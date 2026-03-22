import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Plus, Megaphone, Paperclip } from "lucide-react";

const mockNotices = [
  {
    id: 1,
    title: "Office Closure - Public Holiday",
    content: "The office will remain closed on March 14th on account of Holi. Regular operations will resume on March 15th.",
    type: "General",
    created_at: "2026-03-10",
    author: "Sita Rai",
    target: "All Branches",
    has_attachment: false,
  },
  {
    id: 2,
    title: "New Leave Policy Update",
    content: "Please review the updated leave policy effective from April 1st. All employees are required to acknowledge the changes.",
    type: "Policy",
    created_at: "2026-03-08",
    author: "Admin",
    target: "All Employees",
    has_attachment: true,
  },
  {
    id: 3,
    title: "Annual Performance Review Schedule",
    content: "Performance reviews for Q1 will begin on April 15th. Managers should prepare evaluation forms by April 10th.",
    type: "HR",
    created_at: "2026-03-05",
    author: "Sita Rai",
    target: "Managers",
    has_attachment: true,
  },
];

const typeBadgeColors: Record<string, string> = {
  General: "bg-muted text-muted-foreground",
  Policy: "bg-info/10 text-info border-info/20",
  HR: "bg-primary/10 text-primary border-primary/20",
  Urgent: "bg-destructive/10 text-destructive border-destructive/20",
};

const NoticesPage = () => {
  return (
    <div>
      <div className="page-header flex items-start justify-between">
        <div>
          <h1 className="page-title">Notices</h1>
          <p className="page-description">Company announcements and notices</p>
        </div>
        <Button><Plus className="h-4 w-4 mr-2" /> Post Notice</Button>
      </div>

      <div className="space-y-4">
        {mockNotices.map((notice, i) => (
          <div
            key={notice.id}
            className="bg-card border rounded-lg p-6 shadow-sm hover:shadow-md transition-shadow animate-fade-in"
            style={{ animationDelay: `${i * 100}ms` }}
          >
            <div className="flex items-start justify-between mb-3">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-primary/10 text-primary">
                  <Megaphone className="h-4 w-4" />
                </div>
                <div>
                  <h3 className="font-semibold text-sm">{notice.title}</h3>
                  <p className="text-xs text-muted-foreground mt-0.5">
                    By {notice.author} · {notice.created_at} · {notice.target}
                  </p>
                </div>
              </div>
              <Badge variant="outline" className={typeBadgeColors[notice.type]}>
                {notice.type}
              </Badge>
            </div>
            <p className="text-sm text-muted-foreground leading-relaxed">{notice.content}</p>
            {notice.has_attachment && (
              <div className="mt-3 flex items-center gap-1.5 text-xs text-primary">
                <Paperclip className="h-3 w-3" />
                <span>Attachment available</span>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default NoticesPage;
