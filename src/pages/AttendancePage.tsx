import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Search, Plus, CalendarCheck } from "lucide-react";
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from "@/components/ui/table";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";

const mockAttendance = [
  { id: 1, employee: "Ramesh Sharma", date: "2026-03-22", check_in: "09:02", check_out: "17:45", status: "PRESENT" },
  { id: 2, employee: "Sita Rai", date: "2026-03-22", check_in: "08:55", check_out: "17:30", status: "PRESENT" },
  { id: 3, employee: "Bikash Thapa", date: "2026-03-22", check_in: null, check_out: null, status: "ABSENT" },
  { id: 4, employee: "Anita Gurung", date: "2026-03-22", check_in: null, check_out: null, status: "ON_LEAVE" },
  { id: 5, employee: "Prakash KC", date: "2026-03-22", check_in: "09:15", check_out: null, status: "PRESENT" },
  { id: 6, employee: "Mina Tamang", date: "2026-03-22", check_in: "08:30", check_out: "17:00", status: "WORK_FROM_HOME" },
];

const statusColors: Record<string, string> = {
  PRESENT: "bg-success/10 text-success border-success/20",
  ABSENT: "bg-destructive/10 text-destructive border-destructive/20",
  ON_LEAVE: "bg-warning/10 text-warning border-warning/20",
  WORK_FROM_HOME: "bg-info/10 text-info border-info/20",
};

const AttendancePage = () => {
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [date, setDate] = useState("2026-03-22");

  const filtered = mockAttendance.filter((a) => {
    const matchesSearch = a.employee.toLowerCase().includes(search.toLowerCase());
    const matchesStatus = statusFilter === "all" || a.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const summary = {
    present: mockAttendance.filter((a) => a.status === "PRESENT").length,
    absent: mockAttendance.filter((a) => a.status === "ABSENT").length,
    onLeave: mockAttendance.filter((a) => a.status === "ON_LEAVE").length,
    wfh: mockAttendance.filter((a) => a.status === "WORK_FROM_HOME").length,
  };

  return (
    <div>
      <div className="page-header flex items-start justify-between">
        <div>
          <h1 className="page-title">Attendance</h1>
          <p className="page-description">Track daily attendance records</p>
        </div>
        <Button><CalendarCheck className="h-4 w-4 mr-2" /> Mark Attendance</Button>
      </div>

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
            <Input placeholder="Search employees..." value={search} onChange={(e) => setSearch(e.target.value)} className="pl-9" />
          </div>
          <Input type="date" value={date} onChange={(e) => setDate(e.target.value)} className="w-44" />
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
            {filtered.map((a) => (
              <TableRow key={a.id}>
                <TableCell className="font-medium">{a.employee}</TableCell>
                <TableCell className="text-muted-foreground">{a.date}</TableCell>
                <TableCell className="text-muted-foreground font-mono text-sm">{a.check_in || "—"}</TableCell>
                <TableCell className="text-muted-foreground font-mono text-sm">{a.check_out || "—"}</TableCell>
                <TableCell>
                  <Badge variant="outline" className={statusColors[a.status]}>{a.status.replace("_", " ")}</Badge>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};

export default AttendancePage;
