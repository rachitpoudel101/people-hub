import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Plus, MoreHorizontal } from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { apiRequest } from "@/lib/api";
import { useToast } from "@/hooks/use-toast";

interface Branch {
  id: number;
  name: string;
  code: string;
  city: string;
  address: string;
  phone: string;
  company: string;
  employees: number;
}

const BranchesPage = () => {
  const [branches, setBranches] = useState<Branch[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    fetchBranches();
  }, []);

  const fetchBranches = async () => {
    try {
      setLoading(true);
      const data = await apiRequest<any>("/branches/");
      const results = Array.isArray(data) ? data : data.results || [];
      setBranches(results);
    } catch (error) {
      console.error("Failed to fetch branches:", error);
      setBranches([]);
      toast({
        variant: "destructive",
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to fetch branches",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <div className="page-header flex items-start justify-between">
        <div>
          <h1 className="page-title">Branches</h1>
          <p className="page-description">Manage company branches and locations</p>
        </div>
        <Button>
          <Plus className="h-4 w-4 mr-2" /> Add Branch
        </Button>
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
            {loading ? (
              <TableRow>
                <TableCell colSpan={7} className="text-center text-muted-foreground">
                  Loading branches...
                </TableCell>
              </TableRow>
            ) : branches.length === 0 ? (
              <TableRow>
                <TableCell colSpan={7} className="text-center text-muted-foreground">
                  No branches found
                </TableCell>
              </TableRow>
            ) : (
              branches.map((b) => (
                <TableRow key={b.id}>
                  <TableCell className="font-medium">{b.name}</TableCell>
                  <TableCell className="text-muted-foreground font-mono text-sm">
                    {b.code}
                  </TableCell>
                  <TableCell className="text-muted-foreground">{b.city}</TableCell>
                  <TableCell className="text-muted-foreground">{b.company}</TableCell>
                  <TableCell className="text-muted-foreground">{b.phone}</TableCell>
                  <TableCell className="tabular-nums">{b.employees}</TableCell>
                  <TableCell>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon" className="h-8 w-8">
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem>Edit</DropdownMenuItem>
                        <DropdownMenuItem className="text-destructive">Delete</DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
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

export default BranchesPage;
