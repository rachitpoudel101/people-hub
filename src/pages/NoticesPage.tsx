import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Plus, Megaphone, Paperclip } from "lucide-react";
import { apiRequest } from "@/lib/api";
import { useToast } from "@/hooks/use-toast";

interface Notice {
  id: number;
  title: string;
  content: string;
  type: string;
  created_at: string;
  author: string;
  target: string;
  has_attachment: boolean;
}

const typeBadgeColors: Record<string, string> = {
  General: "bg-muted text-muted-foreground",
  Policy: "bg-info/10 text-info border-info/20",
  HR: "bg-primary/10 text-primary border-primary/20",
  Urgent: "bg-destructive/10 text-destructive border-destructive/20",
};

const NoticesPage = () => {
  const [notices, setNotices] = useState<Notice[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    fetchNotices();
  }, []);

  const fetchNotices = async () => {
    try {
      setLoading(true);
      const data = await apiRequest<any>("/notices/");
      const results = Array.isArray(data) ? data : data.results || [];
      setNotices(results);
    } catch (error) {
      console.error("Failed to fetch notices:", error);
      setNotices([]);
      toast({
        variant: "destructive",
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to fetch notices",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <div className="page-header flex items-start justify-between">
        <div>
          <h1 className="page-title">Notices</h1>
          <p className="page-description">Company announcements and notices</p>
        </div>
        <Button>
          <Plus className="h-4 w-4 mr-2" /> Post Notice
        </Button>
      </div>

      <div className="space-y-4">
        {loading ? (
          <div className="bg-card border rounded-lg p-6 text-center text-muted-foreground">
            Loading notices...
          </div>
        ) : notices.length === 0 ? (
          <div className="bg-card border rounded-lg p-6 text-center text-muted-foreground">
            No notices found
          </div>
        ) : (
          notices.map((notice, i) => (
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
          ))
        )}
      </div>
    </div>
  );
};

export default NoticesPage;
