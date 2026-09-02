import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
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

interface Designation {
  id: number;
  title: string;
  code: string;
  level: number;
  department: string;
}

const DesignationsPage = () => {
  const [designations, setDesignations] = useState<Designation[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    fetchDesignations();
  }, []);

  const fetchDesignations = async () => {
    try {
      setLoading(true);
      const data = await apiRequest<any>("/designations/");
      const results = Array.isArray(data) ? data : data.results || [];
      setDesignations(results);
    } catch (error) {
      console.error("Failed to fetch designations:", error);
      setDesignations([]);
      toast({
        variant: "destructive",
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to fetch designations",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <div className="page-header flex items-start justify-between">
        <div>
          <h1 className="page-title">Designations</h1>
          <p className="page-description">Manage job titles and hierarchy levels</p>
        </div>
        <Button>
          <Plus className="h-4 w-4 mr-2" /> Add Designation
        </Button>
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
            {loading ? (
              <TableRow>
                <TableCell colSpan={5} className="text-center text-muted-foreground">
                  Loading designations...
                </TableCell>
              </TableRow>
            ) : designations.length === 0 ? (
              <TableRow>
                <TableCell colSpan={5} className="text-center text-muted-foreground">
                  No designations found
                </TableCell>
              </TableRow>
            ) : (
              designations.map((d) => (
                <TableRow key={d.id}>
                  <TableCell className="font-medium">{d.title}</TableCell>
                  <TableCell className="text-muted-foreground font-mono text-sm">
                    {d.code}
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline" className="tabular-nums">
                      Level {d.level}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-muted-foreground">{d.department}</TableCell>
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

export default DesignationsPage;
