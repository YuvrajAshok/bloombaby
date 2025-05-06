
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
import { saveNutrition } from "@/utils/localStorage";
import { useToast } from "@/components/ui/use-toast";
import { X } from "lucide-react";

const nutritionSchema = z.object({
  mealType: z.enum(["breakfast", "lunch", "dinner", "snack"]),
  foodItems: z.string().min(1, { message: "Please enter food items" }),
  notes: z.string().optional(),
});

type NutritionFormValues = z.infer<typeof nutritionSchema>;

interface NutritionFormProps {
  onSuccess?: () => void;
  onCancel?: () => void;
}

const NutritionForm = ({ onSuccess, onCancel }: NutritionFormProps) => {
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);

  const form = useForm<NutritionFormValues>({
    resolver: zodResolver(nutritionSchema),
    defaultValues: {
      mealType: "breakfast",
      foodItems: "",
      notes: "",
    },
  });

  const onSubmit = (data: NutritionFormValues) => {
    setLoading(true);
    
    const newNutrition = {
      id: uuidv4(),
      date: new Date(),
      foodItems: data.foodItems.split(',').map(item => item.trim()),
      mealType: data.mealType,
      notes: data.notes,
    };
    
    try {
      saveNutrition(newNutrition);
      console.log("Nutrition logged:", newNutrition);
      
      toast({
        title: "Meal logged",
        description: "Your meal has been recorded",
      });
      
      form.reset();
      
      if (onSuccess) {
        onSuccess();
      }
    } catch (error) {
      console.error("Error saving nutrition:", error);
      toast({
        title: "Error",
        description: "Failed to save meal. Please try again.",
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
          name="mealType"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Meal Type</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select meal type" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="breakfast">Breakfast</SelectItem>
                  <SelectItem value="lunch">Lunch</SelectItem>
                  <SelectItem value="dinner">Dinner</SelectItem>
                  <SelectItem value="snack">Snack</SelectItem>
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <FormField
          control={form.control}
          name="foodItems"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Food Items</FormLabel>
              <FormControl>
                <Input 
                  placeholder="Enter food items (separate with commas)" 
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
              <FormLabel>Notes (optional)</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="Add any additional notes about this meal"
                  className="resize-none"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <div className="flex justify-end space-x-4">
          {onCancel && (
            <Button 
              type="button" 
              variant="outline" 
              size="icon"
              onClick={onCancel}
              className="rounded-full"
            >
              <X className="h-4 w-4" />
              <span className="sr-only">Cancel</span>
            </Button>
          )}
          <Button type="submit" disabled={loading}>
            {loading ? "Logging..." : "Log Meal"}
          </Button>
        </div>
      </form>
    </Form>
  );
};

export default NutritionForm;
