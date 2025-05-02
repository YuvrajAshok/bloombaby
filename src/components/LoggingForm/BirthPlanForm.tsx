
import { useState } from "react";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { v4 as uuidv4 } from "uuid";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { saveBirthPlanItem } from "@/utils/localStorage";
import { useToast } from "@/components/ui/use-toast";

const birthPlanSchema = z.object({
  category: z.enum(["environment", "procedures", "support", "pain management", "postpartum"]),
  preference: z.string().min(1, { message: "Your preference is required" }),
  notes: z.string().optional(),
});

type BirthPlanFormValues = z.infer<typeof birthPlanSchema>;

interface BirthPlanFormProps {
  onSuccess?: () => void;
}

const BirthPlanForm = ({ onSuccess }: BirthPlanFormProps) => {
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);

  const form = useForm<BirthPlanFormValues>({
    resolver: zodResolver(birthPlanSchema),
    defaultValues: {
      category: "environment",
      preference: "",
      notes: "",
    },
  });

  const onSubmit = (data: BirthPlanFormValues) => {
    setLoading(true);
    
    const newBirthPlanItem = {
      id: uuidv4(),
      ...data,
    };
    
    try {
      saveBirthPlanItem(newBirthPlanItem);
      console.log("Birth plan item added:", newBirthPlanItem);
      
      toast({
        title: "Birth plan updated",
        description: "Your preference has been added to your birth plan",
      });
      
      form.reset();
      
      if (onSuccess) {
        onSuccess();
      }
    } catch (error) {
      console.error("Error saving birth plan item:", error);
      toast({
        title: "Error",
        description: "Failed to save preference. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const getCategoryPlaceholder = (category: string) => {
    switch (category) {
      case "environment":
        return "e.g., dim lighting, music preferences, bring my own pillow";
      case "procedures":
        return "e.g., delayed cord clamping, skin-to-skin immediately after birth";
      case "support":
        return "e.g., who will be present, roles for your support team";
      case "pain management":
        return "e.g., epidural preferences, natural pain management techniques";
      case "postpartum":
        return "e.g., breastfeeding plans, newborn procedures";
      default:
        return "Enter your preference here";
    }
  };

  const selectedCategory = form.watch("category");

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="category"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Category</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select category" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="environment">Birth Environment</SelectItem>
                  <SelectItem value="procedures">Medical Procedures</SelectItem>
                  <SelectItem value="support">Support Team</SelectItem>
                  <SelectItem value="pain management">Pain Management</SelectItem>
                  <SelectItem value="postpartum">Postpartum</SelectItem>
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <FormField
          control={form.control}
          name="preference"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Your Preference</FormLabel>
              <FormControl>
                <Textarea
                  placeholder={getCategoryPlaceholder(selectedCategory)}
                  className="resize-none"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <FormField
          control={form.control}
          name="notes"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Additional Notes (optional)</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="Add any additional details or alternatives"
                  className="resize-none"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <Button type="submit" disabled={loading} className="w-full">
          {loading ? "Saving..." : "Add to Birth Plan"}
        </Button>
      </form>
    </Form>
  );
};

export default BirthPlanForm;
