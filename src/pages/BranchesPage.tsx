import { Button } from "@/components/ui/button";
import { Plus, MoreHorizontal } from "lucide-react";
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from "@/components/ui/table";
import {
  DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const mockBranches = [
  { id: 1, name: "Kathmandu HQ", code: "KTM-HQ", city: "Kathmandu", address: "Durbar Marg, Kathmandu", phone: "+977-1-4567890", company: "TechCorp Nepal", employees: 142 },
  { id: 2, name: "Pokhara Branch", code: "PKR-01", city: "Pokhara", address: "Lakeside, Pokhara", phone: "+977-61-234567", company: "TechCorp Nepal", employees: 64 },
  { id: 3, name: "Biratnagar Branch", code: "BRT-01", city: "Biratnagar", address: "Main Road, Biratnagar", phone: "+977-21-456789", company: "TechCorp Nepal", employees: 42 },
];

const BranchesPage = () => (
  <div>
    <div className="page-header flex items-start justify-between">
      <div>
        <h1 className="page-title">Branches</h1>
        <p className="page-description">Manage company branches and locations</p>
      </div>
      <Button><Plus className="h-4 w-4 mr-2" /> Add Branch</Button>
    </div>
    <div className="data-table-container animate-fade-in">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Branch Name</TableHead>
            <TableHead>Code</TableHead>
            <TableHead>City</TableHead>
            <TableHead>Company</TableHead>
            <TableHead>Phone</TableHead>
            <TableHead>Employees</TableHead>
            <TableHead className="w-12"></TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {mockBranches.map((b) => (
            <TableRow key={b.id}>
              <TableCell className="font-medium">{b.name}</TableCell>
              <TableCell className="text-muted-foreground font-mono text-sm">{b.code}</TableCell>
              <TableCell className="text-muted-foreground">{b.city}</TableCell>
              <TableCell className="text-muted-foreground">{b.company}</TableCell>
              <TableCell className="text-muted-foreground">{b.phone}</TableCell>
              <TableCell className="tabular-nums">{b.employees}</TableCell>
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

export default BranchesPage;
