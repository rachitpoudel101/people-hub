import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Plus, MoreHorizontal } from "lucide-react";
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from "@/components/ui/table";
import {
  DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const mockCompanies = [
  { id: 1, name: "TechCorp Nepal", code: "TCN", address: "Kathmandu, Nepal", phone: "+977-1-4567890", branches: 3, employees: 248 },
  { id: 2, name: "GreenValley Enterprises", code: "GVE", address: "Pokhara, Nepal", phone: "+977-61-234567", branches: 2, employees: 85 },
];

const CompaniesPage = () => (
  <div>
    <div className="page-header flex items-start justify-between">
      <div>
        <h1 className="page-title">Companies</h1>
        <p className="page-description">Manage registered companies</p>
      </div>
      <Button><Plus className="h-4 w-4 mr-2" /> Add Company</Button>
    </div>
    <div className="data-table-container animate-fade-in">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Company Name</TableHead>
            <TableHead>Code</TableHead>
            <TableHead>Address</TableHead>
            <TableHead>Phone</TableHead>
            <TableHead>Branches</TableHead>
            <TableHead>Employees</TableHead>
            <TableHead className="w-12"></TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {mockCompanies.map((c) => (
            <TableRow key={c.id}>
              <TableCell className="font-medium">{c.name}</TableCell>
              <TableCell><Badge variant="outline">{c.code}</Badge></TableCell>
              <TableCell className="text-muted-foreground">{c.address}</TableCell>
              <TableCell className="text-muted-foreground">{c.phone}</TableCell>
              <TableCell className="tabular-nums">{c.branches}</TableCell>
              <TableCell className="tabular-nums">{c.employees}</TableCell>
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

export default CompaniesPage;
