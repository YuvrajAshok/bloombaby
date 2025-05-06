
import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { v4 as uuidv4 } from "uuid";
import { format } from "date-fns";
import { Symptom } from "@/types";
import { saveSymptom } from "@/utils/localStorage";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Form,
  FormControl,
  FormDescription,
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
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/components/ui/use-toast";
import { Calendar as CalendarIcon, X } from "lucide-react";
import { cn } from "@/lib/utils";

// Define the form schema using Zod
const formSchema = z.object({
  date: z.date({
    required_error: "A date is required.",
  }),
  type: z.string({
    required_error: "Please select a symptom type.",
  }),
  severity: z.string({
    required_error: "Please select a severity level.",
  }),
  notes: z.string().optional(),
});

interface SymptomFormProps {
  onComplete: () => void;
  onCancel: () => void;
}

const symptomTypes = [
  "Nausea",
  "Fatigue",
  "Headache",
  "Back Pain",
  "Swelling",
  "Insomnia",
  "Heartburn",
  "Cramping",
  "Other",
];

// Changed to lowercase to match the Symptom type
const severityLevels = ["mild", "moderate", "severe"];

const SymptomForm = ({ onComplete, onCancel }: SymptomFormProps) => {
  const { toast } = useToast();
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      date: new Date(),
      notes: "",
    },
  });

  const onSubmit = (values: z.infer<typeof formSchema>) => {
    // Create the symptom object
    const newSymptom: Symptom = {
      id: uuidv4(),
      date: values.date,
      symptomType: values.type,
      severity: values.severity as "mild" | "moderate" | "severe",
      notes: values.notes,
    };

    // Save to localStorage
    saveSymptom(newSymptom);

    // Show success notification
    toast({
      title: "Symptom logged successfully",
      description: `${values.severity} ${values.type} on ${format(
        values.date,
        "MMM d, yyyy"
      )}`,
    });

    // Call the onComplete callback
    onComplete();
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <FormField
          control={form.control}
          name="date"
          render={({ field }) => (
            <FormItem className="flex flex-col">
              <FormLabel>Date</FormLabel>
              <Popover>
                <PopoverTrigger asChild>
                  <FormControl>
                    <Button
                      variant={"outline"}
                      className={cn(
                        "w-full pl-3 text-left font-normal",
                        !field.value && "text-muted-foreground"
                      )}
                    >
                      {field.value ? (
                        format(field.value, "PPP")
                      ) : (
                        <span>Pick a date</span>
                      )}
                      <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                    </Button>
                  </FormControl>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={field.value}
                    onSelect={field.onChange}
                    disabled={(date) =>
                      date > new Date() || date < new Date("1900-01-01")
                    }
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
              <FormDescription>
                Select the date when you experienced this symptom.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="type"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Symptom Type</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select a symptom" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {symptomTypes.map((type) => (
                    <SelectItem key={type} value={type}>
                      {type}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormDescription>
                Select the type of symptom you experienced.
              </FormDescription>
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
                  {severityLevels.map((level) => (
                    <SelectItem key={level} value={level}>
                      {level.charAt(0).toUpperCase() + level.slice(1)}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormDescription>
                How severe was this symptom?
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="notes"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Notes</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="Any additional details about this symptom..."
                  className="resize-none"
                  {...field}
                />
              </FormControl>
              <FormDescription>
                Optional details about this symptom.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="flex justify-end space-x-4">
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
          <Button type="submit">Save</Button>
        </div>
      </form>
    </Form>
  );
};

export default SymptomForm;
