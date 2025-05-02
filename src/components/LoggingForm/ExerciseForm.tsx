
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
import { Slider } from "@/components/ui/slider";
import { saveExercise } from "@/utils/localStorage";
import { useToast } from "@/components/ui/use-toast";

const exerciseSchema = z.object({
  type: z.string().min(1, { message: "Exercise type is required" }),
  duration: z.number().min(1, { message: "Duration must be at least 1 minute" }),
  intensity: z.enum(["light", "moderate", "intense"]),
  notes: z.string().optional(),
});

type ExerciseFormValues = z.infer<typeof exerciseSchema>;

interface ExerciseFormProps {
  onSuccess?: () => void;
}

const ExerciseForm = ({ onSuccess }: ExerciseFormProps) => {
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);

  const form = useForm<ExerciseFormValues>({
    resolver: zodResolver(exerciseSchema),
    defaultValues: {
      type: "",
      duration: 15,
      intensity: "light",
      notes: "",
    },
  });

  const onSubmit = (data: ExerciseFormValues) => {
    setLoading(true);
    
    // Ensure all required properties are explicitly set
    const newExercise = {
      id: uuidv4(),
      date: new Date(),
      type: data.type,
      duration: data.duration,
      intensity: data.intensity,
      notes: data.notes,
    };
    
    try {
      saveExercise(newExercise);
      console.log("Exercise logged:", newExercise);
      
      toast({
        title: "Exercise logged",
        description: "Your exercise has been recorded",
      });
      
      form.reset();
      
      if (onSuccess) {
        onSuccess();
      }
    } catch (error) {
      console.error("Error saving exercise:", error);
      toast({
        title: "Error",
        description: "Failed to save exercise. Please try again.",
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
          name="type"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Exercise Type</FormLabel>
              <FormControl>
                <Input placeholder="e.g. Walking, Yoga, Swimming" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <FormField
          control={form.control}
          name="duration"
          render={({ field: { value, onChange } }) => (
            <FormItem>
              <FormLabel>Duration (minutes): {value}</FormLabel>
              <FormControl>
                <Slider
                  min={1}
                  max={120}
                  step={1}
                  defaultValue={[value]}
                  onValueChange={(vals) => onChange(vals[0])}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <FormField
          control={form.control}
          name="intensity"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Intensity</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select intensity" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="light">Light</SelectItem>
                  <SelectItem value="moderate">Moderate</SelectItem>
                  <SelectItem value="intense">Intense</SelectItem>
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
                  placeholder="How did you feel during and after exercise?"
                  className="resize-none"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <Button type="submit" disabled={loading} className="w-full">
          {loading ? "Logging..." : "Log Exercise"}
        </Button>
      </form>
    </Form>
  );
};

export default ExerciseForm;
