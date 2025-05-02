
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
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { saveMood } from "@/utils/localStorage";
import { useToast } from "@/components/ui/use-toast";

const moodSchema = z.object({
  mood: z.enum(["happy", "sad", "anxious", "calm", "irritated"]),
  notes: z.string().optional(),
});

type MoodFormValues = z.infer<typeof moodSchema>;

interface MoodFormProps {
  onSuccess?: () => void;
}

const MoodForm = ({ onSuccess }: MoodFormProps) => {
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);

  const form = useForm<MoodFormValues>({
    resolver: zodResolver(moodSchema),
    defaultValues: {
      mood: "calm",
      notes: "",
    },
  });

  const onSubmit = (data: MoodFormValues) => {
    setLoading(true);
    
    // Ensure all required properties are explicitly set
    const newMood = {
      id: uuidv4(),
      date: new Date(),
      mood: data.mood,
      notes: data.notes,
    };
    
    try {
      saveMood(newMood);
      console.log("Mood logged:", newMood);
      
      toast({
        title: "Mood logged",
        description: "Your mood has been recorded",
      });
      
      form.reset();
      
      if (onSuccess) {
        onSuccess();
      }
    } catch (error) {
      console.error("Error saving mood:", error);
      toast({
        title: "Error",
        description: "Failed to save mood. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const moodEmojis: Record<string, string> = {
    happy: "😊",
    sad: "😔",
    anxious: "😟",
    calm: "😌",
    irritated: "😠",
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="mood"
          render={({ field }) => (
            <FormItem className="space-y-3">
              <FormLabel>How are you feeling today?</FormLabel>
              <FormControl>
                <RadioGroup
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                  className="flex flex-wrap gap-4"
                >
                  {Object.entries(moodEmojis).map(([mood, emoji]) => (
                    <div key={mood} className="flex flex-col items-center">
                      <RadioGroupItem
                        value={mood}
                        id={`mood-${mood}`}
                        className="peer sr-only"
                      />
                      <Label
                        htmlFor={`mood-${mood}`}
                        className="flex flex-col items-center space-y-2 rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary"
                      >
                        <span className="text-2xl">{emoji}</span>
                        <span className="text-xs font-normal capitalize">
                          {mood}
                        </span>
                      </Label>
                    </div>
                  ))}
                </RadioGroup>
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
                  placeholder="Add any details about your mood or day"
                  className="resize-none"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <Button type="submit" disabled={loading} className="w-full">
          {loading ? "Logging..." : "Log Mood"}
        </Button>
      </form>
    </Form>
  );
};

export default MoodForm;
