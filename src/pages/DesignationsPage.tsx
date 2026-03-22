import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Plus, MoreHorizontal } from "lucide-react";
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from "@/components/ui/table";
import {
  DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const mockDesignations = [
  { id: 1, title: "Chief Executive Officer", code: "CEO", level: 1, department: "Management" },
  { id: 2, title: "Chief Technology Officer", code: "CTO", level: 2, department: "Engineering" },
  { id: 3, title: "HR Manager", code: "HRM", level: 3, department: "Human Resources" },
  { id: 4, title: "Senior Developer", code: "SR-DEV", level: 4, department: "Engineering" },
  { id: 5, title: "Junior Developer", code: "JR-DEV", level: 6, department: "Engineering" },
  { id: 6, title: "Marketing Lead", code: "MKT-LD", level: 4, department: "Marketing" },
  { id: 7, title: "Accountant", code: "ACCT", level: 5, department: "Finance" },
];

const DesignationsPage = () => (
  <div>
    <div className="page-header flex items-start justify-between">
      <div>
        <h1 className="page-title">Designations</h1>
        <p className="page-description">Manage job titles and hierarchy levels</p>
      </div>
      <Button><Plus className="h-4 w-4 mr-2" /> Add Designation</Button>
    </div>
    <div className="data-table-container animate-fade-in">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Title</TableHead>
            <TableHead>Code</TableHead>
            <TableHead>Level</TableHead>
            <TableHead>Department</TableHead>
            <TableHead className="w-12"></TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {mockDesignations.map((d) => (
            <TableRow key={d.id}>
              <TableCell className="font-medium">{d.title}</TableCell>
              <TableCell className="text-muted-foreground font-mono text-sm">{d.code}</TableCell>
              <TableCell>
                <Badge variant="outline" className="tabular-nums">Level {d.level}</Badge>
              </TableCell>
              <TableCell className="text-muted-foreground">{d.department}</TableCell>
              <TableCell>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon" className="h-8 w-8"><MoreHorizontal className="h-4 w-4" /></Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem>Edit</DropdownMenuItem>
                    <DropdownMenuItem className="text-destructive">Delete</DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  </div>
);

export default DesignationsPage;
