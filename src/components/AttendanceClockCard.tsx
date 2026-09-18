import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Clock, LogIn, LogOut, Calendar } from "lucide-react";
import { apiRequest } from "@/lib/api";
import { useToast } from "@/hooks/use-toast";
import { Badge } from "@/components/ui/badge";

interface AttendanceStatus {
  has_checked_in: boolean;
  has_checked_out: boolean;
  attendance: {
    id: number;
    date: string;
    check_in: string | null;
    check_out: string | null;
    status: string;
    work_duration: string | null;
    work_duration_hours: number;
    work_duration_minutes: number;
    total_hours: number;
  } | null;
}

export const AttendanceClockCard = () => {
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState<AttendanceStatus | null>(null);
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    fetchStatus();
    // Update current time every second
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const fetchStatus = async () => {
    try {
      const data = await apiRequest<AttendanceStatus>("/attendance/my-status/");
      setStatus(data);
    } catch (error) {
      console.error("Failed to fetch attendance status:", error);
    }
  };

  const handleCheckIn = async () => {
    try {
      setLoading(true);
      const response = await apiRequest<{
        success: boolean;
        data: AttendanceStatus["attendance"];
        message: string;
      }>("/attendance/check-in/", {
        method: "POST",
      });

      if (response.success) {
        toast({
          title: "Checked In Successfully",
          description: `Welcome! You checked in at ${new Date(response.data?.check_in || "").toLocaleTimeString()}`,
        });
        fetchStatus();
      }
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Check-in Failed",
        description: error instanceof Error ? error.message : "Failed to check in",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleCheckOut = async () => {
    try {
      setLoading(true);
      const response = await apiRequest<{
        success: boolean;
        data: AttendanceStatus["attendance"];
        message: string;
      }>("/attendance/check-out/", {
        method: "POST",
      });

      if (response.success) {
        toast({
          title: "Checked Out Successfully",
          description: `See you tomorrow! You checked out at ${new Date(response.data?.check_out || "").toLocaleTimeString()}`,
        });
        fetchStatus();
      }
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Check-out Failed",
        description: error instanceof Error ? error.message : "Failed to check out",
      });
    } finally {
      setLoading(false);
    }
  };

  const formatTime = (time: Date) => {
    return time.toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
      hour12: true,
    });
  };

  const formatDate = (time: Date) => {
    return time.toLocaleDateString("en-US", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const hasCheckedIn = status?.has_checked_in || false;
  const hasCheckedOut = status?.has_checked_out || false;

  return (
    <Card className="border-2 shadow-lg">
      <CardHeader className="pb-4">
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="text-2xl">Attendance Clock</CardTitle>
            <CardDescription className="text-base mt-1">Track your working hours</CardDescription>
          </div>
          <div className="p-3 rounded-full bg-primary/10">
            <Clock className="h-8 w-8 text-primary" />
          </div>
        </div>
      </CardHeader>

      <CardContent className="space-y-6">
        {/* Current Time Display */}
        <div className="text-center py-6 bg-muted/50 rounded-lg">
          <div className="flex items-center justify-center gap-2 mb-2">
            <Calendar className="h-5 w-5 text-muted-foreground" />
            <p className="text-sm text-muted-foreground">{formatDate(currentTime)}</p>
          </div>
          <p className="text-4xl font-bold font-mono tracking-wider">{formatTime(currentTime)}</p>
        </div>

        {/* Check-in/Check-out Status */}
        {status?.attendance && (
          <>
            <div className="grid grid-cols-2 gap-4">
              <div className="p-4 bg-success/10 border border-success/20 rounded-lg">
                <div className="flex items-center gap-2 mb-1">
                  <LogIn className="h-4 w-4 text-success" />
                  <p className="text-sm font-medium text-success">Check In</p>
                </div>
                <p className="text-lg font-semibold font-mono">
                  {status.attendance.check_in
                    ? new Date(status.attendance.check_in).toLocaleTimeString("en-US", {
                        hour: "2-digit",
                        minute: "2-digit",
                        hour12: true,
                      })
                    : "—"}
                </p>
              </div>

              <div className="p-4 bg-destructive/10 border border-destructive/20 rounded-lg">
                <div className="flex items-center gap-2 mb-1">
                  <LogOut className="h-4 w-4 text-destructive" />
                  <p className="text-sm font-medium text-destructive">Check Out</p>
                </div>
                <p className="text-lg font-semibold font-mono">
                  {status.attendance.check_out
                    ? new Date(status.attendance.check_out).toLocaleTimeString("en-US", {
                        hour: "2-digit",
                        minute: "2-digit",
                        hour12: true,
                      })
                    : "—"}
                </p>
              </div>
            </div>

            {/* Work Duration Display */}
            {status.attendance.check_in && status.attendance.check_out && (
              <div className="p-4 bg-primary/10 border border-primary/20 rounded-lg text-center">
                <p className="text-sm text-muted-foreground mb-1">Total Work Duration</p>
                <div className="flex items-center justify-center gap-2">
                  <Clock className="h-5 w-5 text-primary" />
                  <p className="text-2xl font-bold text-primary">
                    {status.attendance.work_duration ||
                      `${status.attendance.work_duration_hours}h ${status.attendance.work_duration_minutes}m`}
                  </p>
                </div>
                <p className="text-xs text-muted-foreground mt-1">
                  {status.attendance.total_hours} hours total
                </p>
              </div>
            )}
          </>
        )}

        {/* Action Buttons */}
        <div className="flex gap-3">
          {!hasCheckedIn ? (
            <Button
              onClick={handleCheckIn}
              disabled={loading}
              size="lg"
              className="flex-1 h-14 text-base"
            >
              <LogIn className="h-5 w-5 mr-2" />
              {loading ? "Checking In..." : "Check In"}
            </Button>
          ) : !hasCheckedOut ? (
            <Button
              onClick={handleCheckOut}
              disabled={loading}
              variant="destructive"
              size="lg"
              className="flex-1 h-14 text-base"
            >
              <LogOut className="h-5 w-5 mr-2" />
              {loading ? "Checking Out..." : "Check Out"}
            </Button>
          ) : (
            <div className="flex-1 p-4 bg-muted rounded-lg text-center">
              <Badge className="bg-success text-success-foreground mb-2">Completed</Badge>
              <p className="text-sm text-muted-foreground">
                You've completed your attendance for today
              </p>
            </div>
          )}
        </div>

        {/* Status Badge */}
        {status?.attendance && (
          <div className="flex items-center justify-between pt-2 border-t">
            <span className="text-sm text-muted-foreground">Today's Status:</span>
            <Badge
              variant="outline"
              className={
                status.attendance.status === "PRESENT"
                  ? "bg-success/10 text-success border-success/20"
                  : "bg-muted"
              }
            >
              {status.attendance.status.replace("_", " ")}
            </Badge>
          </div>
        )}
      </CardContent>
    </Card>
  );
};
