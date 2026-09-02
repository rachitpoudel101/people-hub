import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Search, CalendarCheck } from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { apiRequest } from "@/lib/api";
import { useToast } from "@/hooks/use-toast";
import { PageHeader } from "@/components/PageHeader";

interface Attendance {
  id: number;
  employee: string;
  date: string;
  check_in: string | null;
  check_out: string | null;
  status: string;
}

const statusColors: Record<string, string> = {
  PRESENT: "bg-success/10 text-success border-success/20",
  ABSENT: "bg-destructive/10 text-destructive border-destructive/20",
  ON_LEAVE: "bg-warning/10 text-warning border-warning/20",
  WORK_FROM_HOME: "bg-info/10 text-info border-info/20",
};

const AttendancePage = () => {
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [date, setDate] = useState(new Date().toISOString().split("T")[0]);
  const [attendance, setAttendance] = useState<Attendance[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    fetchAttendance();
  }, [date]);

  const fetchAttendance = async () => {
    try {
      setLoading(true);
      const data = await apiRequest<any>(`/attendance/?date=${date}`);
      // Handle both direct array and paginated response
      const results = Array.isArray(data) ? data : data.results || [];
      setAttendance(results);
    } catch (error) {
      console.error("Failed to fetch attendance:", error);
      setAttendance([]); // Set empty array on error
      toast({
        variant: "destructive",
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to fetch attendance",
      });
    } finally {
      setLoading(false);
    }
  };

  const filtered = attendance.filter((a) => {
    const matchesSearch = a.employee.toLowerCase().includes(search.toLowerCase());
    const matchesStatus = statusFilter === "all" || a.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const summary = {
    present: attendance.filter((a) => a.status === "PRESENT").length,
    absent: attendance.filter((a) => a.status === "ABSENT").length,
    onLeave: attendance.filter((a) => a.status === "ON_LEAVE").length,
    wfh: attendance.filter((a) => a.status === "WORK_FROM_HOME").length,
  };

  return (
    <div>
      <PageHeader
        title="Attendance"
        description="Track daily attendance records"
        action={
          <Button>
            <CalendarCheck className="h-4 w-4 mr-2" /> Mark Attendance
          </Button>
        }
      />

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        {[
          { label: "Present", value: summary.present, color: "text-success" },
          { label: "Absent", value: summary.absent, color: "text-destructive" },
          { label: "On Leave", value: summary.onLeave, color: "text-warning" },
          { label: "WFH", value: summary.wfh, color: "text-info" },
        ].map((s) => (
          <div key={s.label} className="stat-card animate-fade-in">
            <p className="text-sm text-muted-foreground">{s.label}</p>
            <p className={`text-2xl font-semibold ${s.color}`}>{s.value}</p>
          </div>
        ))}
      </div>

      <div className="data-table-container animate-fade-in">
        <div className="p-4 border-b border-border flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search employees..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-9"
            />
          </div>
          <Input
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            className="w-44"
          />
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-44">
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Status</SelectItem>
              <SelectItem value="PRESENT">Present</SelectItem>
              <SelectItem value="ABSENT">Absent</SelectItem>
              <SelectItem value="ON_LEAVE">On Leave</SelectItem>
              <SelectItem value="WORK_FROM_HOME">WFH</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Employee</TableHead>
              <TableHead>Date</TableHead>
              <TableHead>Check In</TableHead>
              <TableHead>Check Out</TableHead>
              <TableHead>Status</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell colSpan={5} className="text-center text-muted-foreground">
                  Loading attendance...
                </TableCell>
              </TableRow>
            ) : filtered.length === 0 ? (
              <TableRow>
                <TableCell colSpan={5} className="text-center text-muted-foreground">
                  No attendance records found
                </TableCell>
              </TableRow>
            ) : (
              filtered.map((a) => (
                <TableRow key={a.id}>
                  <TableCell className="font-medium">{a.employee}</TableCell>
                  <TableCell className="text-muted-foreground">{a.date}</TableCell>
                  <TableCell className="text-muted-foreground font-mono text-sm">
                    {a.check_in || "—"}
                  </TableCell>
                  <TableCell className="text-muted-foreground font-mono text-sm">
                    {a.check_out || "—"}
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline" className={statusColors[a.status]}>
                      {a.status.replace("_", " ")}
                    </Badge>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};

export default AttendancePage;
