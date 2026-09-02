import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Plus, MoreHorizontal, FolderTree } from "lucide-react";
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

interface Department {
  id: number;
  name: string;
  code: string;
  parent: string | null;
  head: string;
  employees: number;
}

const DepartmentsPage = () => {
  const [departments, setDepartments] = useState<Department[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    fetchDepartments();
  }, []);

  const fetchDepartments = async () => {
    try {
      setLoading(true);
      const data = await apiRequest<any>("/departments/");
      const results = Array.isArray(data) ? data : data.results || [];
      setDepartments(results);
    } catch (error) {
      console.error("Failed to fetch departments:", error);
      setDepartments([]);
      toast({
        variant: "destructive",
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to fetch departments",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <div className="page-header flex items-start justify-between">
        <div>
          <h1 className="page-title">Departments</h1>
          <p className="page-description">Manage organizational departments</p>
        </div>
        <Button>
          <Plus className="h-4 w-4 mr-2" /> Add Department
        </Button>
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
            {loading ? (
              <TableRow>
                <TableCell colSpan={6} className="text-center text-muted-foreground">
                  Loading departments...
                </TableCell>
              </TableRow>
            ) : departments.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} className="text-center text-muted-foreground">
                  No departments found
                </TableCell>
              </TableRow>
            ) : (
              departments.map((d) => (
                <TableRow key={d.id}>
                  <TableCell className="font-medium">
                    <div className="flex items-center gap-2">
                      {d.parent && <span className="text-muted-foreground ml-4">└</span>}
                      <FolderTree className="h-4 w-4 text-muted-foreground" />
                      {d.name}
                    </div>
                  </TableCell>
                  <TableCell className="text-muted-foreground font-mono text-sm">
                    {d.code}
                  </TableCell>
                  <TableCell className="text-muted-foreground">{d.parent || "—"}</TableCell>
                  <TableCell className="text-muted-foreground">{d.head}</TableCell>
                  <TableCell className="tabular-nums">{d.employees}</TableCell>
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

export default DepartmentsPage;
