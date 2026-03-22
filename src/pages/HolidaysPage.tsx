import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Plus, CalendarDays } from "lucide-react";
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from "@/components/ui/table";

const mockHolidays = [
  { id: 1, name: "New Year", date: "2026-01-01", type: "Public", applicable_to: "All" },
  { id: 2, name: "Republic Day", date: "2026-01-22", type: "Public", applicable_to: "All" },
  { id: 3, name: "Holi", date: "2026-03-14", type: "Cultural", applicable_to: "All" },
  { id: 4, name: "Dashain", date: "2026-10-15", type: "Cultural", applicable_to: "All" },
  { id: 5, name: "Tihar", date: "2026-11-02", type: "Cultural", applicable_to: "All" },
  { id: 6, name: "Company Foundation Day", date: "2026-06-15", type: "Company", applicable_to: "Kathmandu HQ" },
];

const HolidaysPage = () => {
  const upcoming = mockHolidays.filter((h) => new Date(h.date) >= new Date()).slice(0, 3);

  return (
    <div>
      <div className="page-header flex items-start justify-between">
        <div>
          <h1 className="page-title">Holidays</h1>
          <p className="page-description">Manage company and public holidays</p>
        </div>
        <Button><Plus className="h-4 w-4 mr-2" /> Add Holiday</Button>
      </div>

      {upcoming.length > 0 && (
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
          {upcoming.map((h, i) => (
            <div key={h.id} className="stat-card animate-fade-in flex items-center gap-4" style={{ animationDelay: `${i * 80}ms` }}>
              <div className="p-2.5 rounded-lg bg-primary/10 text-primary">
                <CalendarDays className="h-5 w-5" />
              </div>
              <div>
                <p className="font-medium text-sm">{h.name}</p>
                <p className="text-xs text-muted-foreground">{h.date}</p>
              </div>
            </div>
          ))}
        </div>
      )}

      <div className="data-table-container animate-fade-in" style={{ animationDelay: "200ms" }}>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Holiday Name</TableHead>
              <TableHead>Date</TableHead>
              <TableHead>Type</TableHead>
              <TableHead>Applicable To</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {mockHolidays.map((h) => (
              <TableRow key={h.id}>
                <TableCell className="font-medium">{h.name}</TableCell>
                <TableCell className="text-muted-foreground">{h.date}</TableCell>
                <TableCell>
                  <Badge variant="outline">{h.type}</Badge>
                </TableCell>
                <TableCell className="text-muted-foreground">{h.applicable_to}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};

export default HolidaysPage;
