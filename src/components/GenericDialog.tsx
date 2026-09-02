import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { apiRequest } from "@/lib/api";
import { useToast } from "@/hooks/use-toast";

interface Field {
  name: string;
  label: string;
  type?: "text" | "email" | "number" | "date" | "textarea";
  required?: boolean;
  placeholder?: string;
}

interface GenericDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess: () => void;
  title: string;
  description: string;
  endpoint: string;
  fields: Field[];
}

export const GenericDialog = ({
  open,
  onOpenChange,
  onSuccess,
  title,
  description,
  endpoint,
  fields,
}: GenericDialogProps) => {
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);

  const initialData = fields.reduce(
    (acc, field) => {
      acc[field.name] = "";
      return acc;
    },
    {} as Record<string, string>
  );

  const [formData, setFormData] = useState(initialData);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const requiredFields = fields.filter((f) => f.required);
    const missingFields = requiredFields.filter((f) => !formData[f.name]);

    if (missingFields.length > 0) {
      toast({
        variant: "destructive",
        title: "Validation Error",
        description: "Please fill all required fields",
      });
      return;
    }

    try {
      setLoading(true);
      await apiRequest(endpoint, {
        method: "POST",
        body: JSON.stringify(formData),
      });

      toast({
        title: "Success",
        description: `${title} created successfully`,
      });

      setFormData(initialData);
      onSuccess();
      onOpenChange(false);
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description:
          error instanceof Error ? error.message : `Failed to create ${title.toLowerCase()}`,
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          <DialogDescription>{description}</DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit}>
          <div className="grid gap-4 py-4 max-h-[60vh] overflow-y-auto">
            {fields.map((field) => (
              <div key={field.name} className="space-y-2">
                <Label htmlFor={field.name}>
                  {field.label} {field.required && "*"}
                </Label>
                {field.type === "textarea" ? (
                  <Textarea
                    id={field.name}
                    value={formData[field.name]}
                    onChange={(e) => setFormData({ ...formData, [field.name]: e.target.value })}
                    placeholder={field.placeholder}
                    required={field.required}
                  />
                ) : (
                  <Input
                    id={field.name}
                    type={field.type || "text"}
                    value={formData[field.name]}
                    onChange={(e) => setFormData({ ...formData, [field.name]: e.target.value })}
                    placeholder={field.placeholder}
                    required={field.required}
                  />
                )}
              </div>
            ))}
          </div>

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              disabled={loading}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={loading}>
              {loading ? "Creating..." : "Create"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};
