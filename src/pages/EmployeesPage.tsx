import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Search, Plus, MoreHorizontal } from "lucide-react";
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from "@/components/ui/table";
import {
  DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";

const mockEmployees = [
  { id: 1, name: "Ramesh Sharma", department: "Engineering", designation: "Senior Developer", status: "ACTIVE", joining_date: "2022-03-15", branch: "Kathmandu HQ" },
  { id: 2, name: "Sita Rai", department: "Human Resources", designation: "HR Manager", status: "ACTIVE", joining_date: "2021-07-01", branch: "Kathmandu HQ" },
  { id: 3, name: "Bikash Thapa", department: "Operations", designation: "Branch Manager", status: "ACTIVE", joining_date: "2020-11-20", branch: "Pokhara Branch" },
  { id: 4, name: "Anita Gurung", department: "Engineering", designation: "Junior Developer", status: "ON_LEAVE", joining_date: "2023-01-10", branch: "Kathmandu HQ" },
  { id: 5, name: "Prakash KC", department: "Finance", designation: "Accountant", status: "TERMINATED", joining_date: "2019-06-05", branch: "Biratnagar Branch" },
  { id: 6, name: "Mina Tamang", department: "Marketing", designation: "Marketing Lead", status: "ACTIVE", joining_date: "2022-09-12", branch: "Kathmandu HQ" },
];

const statusColors: Record<string, string> = {
  ACTIVE: "bg-success/10 text-success border-success/20",
  ON_LEAVE: "bg-warning/10 text-warning border-warning/20",
  SUSPENDED: "bg-destructive/10 text-destructive border-destructive/20",
  TERMINATED: "bg-muted text-muted-foreground",
  RESIGNED: "bg-muted text-muted-foreground",
};

const EmployeesPage = () => {
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");

  const filtered = mockEmployees.filter((e) => {
    const matchesSearch = e.name.toLowerCase().includes(search.toLowerCase());
    const matchesStatus = statusFilter === "all" || e.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  return (
    <div>
      <div className="page-header flex items-start justify-between">
        <div>
          <h1 className="page-title">Employees</h1>
          <p className="page-description">View and manage employee profiles</p>
        </div>
        <Button><Plus className="h-4 w-4 mr-2" /> Add Employee</Button>
      </div>

      <div className="data-table-container animate-fade-in">
        <div className="p-4 border-b border-border flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input placeholder="Search employees..." value={search} onChange={(e) => setSearch(e.target.value)} className="pl-9" />
          </div>
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-40">
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Status</SelectItem>
              <SelectItem value="ACTIVE">Active</SelectItem>
              <SelectItem value="ON_LEAVE">On Leave</SelectItem>
              <SelectItem value="SUSPENDED">Suspended</SelectItem>
              <SelectItem value="TERMINATED">Terminated</SelectItem>
              <SelectItem value="RESIGNED">Resigned</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Department</TableHead>
              <TableHead>Designation</TableHead>
              <TableHead>Branch</TableHead>
              <TableHead>Joined</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="w-12"></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filtered.map((emp) => (
              <TableRow key={emp.id}>
                <TableCell className="font-medium">{emp.name}</TableCell>
                <TableCell className="text-muted-foreground">{emp.department}</TableCell>
                <TableCell className="text-muted-foreground">{emp.designation}</TableCell>
                <TableCell className="text-muted-foreground">{emp.branch}</TableCell>
                <TableCell className="text-muted-foreground">{emp.joining_date}</TableCell>
                <TableCell>
                  <Badge variant="outline" className={statusColors[emp.status]}>{emp.status.replace("_", " ")}</Badge>
                </TableCell>
                <TableCell>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon" className="h-8 w-8"><MoreHorizontal className="h-4 w-4" /></Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem>View Profile</DropdownMenuItem>
                      <DropdownMenuItem>Edit</DropdownMenuItem>
                      <DropdownMenuItem className="text-destructive">Delete</DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>

        <div className="p-4 border-t border-border flex items-center justify-between text-sm text-muted-foreground">
          <span>Showing {filtered.length} of {mockEmployees.length} employees</span>
          <div className="flex gap-2">
            <Button variant="outline" size="sm" disabled>Previous</Button>
            <Button variant="outline" size="sm" disabled>Next</Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EmployeesPage;
