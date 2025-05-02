
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
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { saveSymptom } from "@/utils/localStorage";
import { useToast } from "@/components/ui/use-toast";

const symptomSchema = z.object({
  symptomType: z.string().min(1, { message: "Symptom type is required" }),
  severity: z.enum(["mild", "moderate", "severe"]),
  notes: z.string().optional(),
});

type SymptomFormValues = z.infer<typeof symptomSchema>;

interface SymptomFormProps {
  onSuccess?: () => void;
}

const SymptomForm = ({ onSuccess }: SymptomFormProps) => {
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);

  const form = useForm<SymptomFormValues>({
    resolver: zodResolver(symptomSchema),
    defaultValues: {
      symptomType: "",
      severity: "mild",
      notes: "",
    },
  });

  const onSubmit = (data: SymptomFormValues) => {
    setLoading(true);
    
    const newSymptom = {
      id: uuidv4(),
      date: new Date(),
      ...data,
    };
    
    try {
      saveSymptom(newSymptom);
      console.log("Symptom logged:", newSymptom);
      
      toast({
        title: "Symptom logged",
        description: "Your symptom has been recorded",
      });
      
      form.reset();
      
      if (onSuccess) {
        onSuccess();
      }
    } catch (error) {
      console.error("Error saving symptom:", error);
      toast({
        title: "Error",
        description: "Failed to save symptom. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="symptomType"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Symptom Type</FormLabel>
              <FormControl>
                <Input placeholder="e.g. Nausea, Headache, Fatigue" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <FormField
          control={form.control}
          name="severity"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Severity</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select severity" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="mild">Mild</SelectItem>
                  <SelectItem value="moderate">Moderate</SelectItem>
                  <SelectItem value="severe">Severe</SelectItem>
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <FormField
          control={form.control}
          name="notes"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Notes (optional)</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="Add any additional details about this symptom"
                  className="resize-none"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <Button type="submit" disabled={loading} className="w-full">
          {loading ? "Logging..." : "Log Symptom"}
        </Button>
      </form>
    </Form>
  );
};

export default SymptomForm;
