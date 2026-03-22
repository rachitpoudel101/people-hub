import { Button } from "@/components/ui/button";
import { Plus, MoreHorizontal, FolderTree } from "lucide-react";
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from "@/components/ui/table";
import {
  DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const mockDepartments = [
  { id: 1, name: "Engineering", code: "ENG", parent: null, head: "Ramesh Sharma", employees: 82 },
  { id: 2, name: "Human Resources", code: "HR", parent: null, head: "Sita Rai", employees: 12 },
  { id: 3, name: "Finance", code: "FIN", parent: null, head: "Prakash KC", employees: 18 },
  { id: 4, name: "Marketing", code: "MKT", parent: null, head: "Mina Tamang", employees: 24 },
  { id: 5, name: "Operations", code: "OPS", parent: null, head: "Bikash Thapa", employees: 35 },
  { id: 6, name: "Frontend Team", code: "ENG-FE", parent: "Engineering", head: "Dev Lead", employees: 28 },
  { id: 7, name: "Backend Team", code: "ENG-BE", parent: "Engineering", head: "Dev Lead", employees: 32 },
];

const DepartmentsPage = () => (
  <div>
    <div className="page-header flex items-start justify-between">
      <div>
        <h1 className="page-title">Departments</h1>
        <p className="page-description">Manage organizational departments</p>
      </div>
      <Button><Plus className="h-4 w-4 mr-2" /> Add Department</Button>
    </div>
    <div className="data-table-container animate-fade-in">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Department</TableHead>
            <TableHead>Code</TableHead>
            <TableHead>Parent</TableHead>
            <TableHead>Head</TableHead>
            <TableHead>Employees</TableHead>
            <TableHead className="w-12"></TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {mockDepartments.map((d) => (
            <TableRow key={d.id}>
              <TableCell className="font-medium">
                <div className="flex items-center gap-2">
                  {d.parent && <span className="text-muted-foreground ml-4">└</span>}
                  <FolderTree className="h-4 w-4 text-muted-foreground" />
                  {d.name}
                </div>
              </TableCell>
              <TableCell className="text-muted-foreground font-mono text-sm">{d.code}</TableCell>
              <TableCell className="text-muted-foreground">{d.parent || "—"}</TableCell>
              <TableCell className="text-muted-foreground">{d.head}</TableCell>
              <TableCell className="tabular-nums">{d.employees}</TableCell>
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

export default DepartmentsPage;
