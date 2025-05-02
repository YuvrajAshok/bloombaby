
import { useState, useEffect } from "react";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { v4 as uuidv4 } from "uuid";
import { format } from "date-fns";
import { CalendarIcon, Clock } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  FormDescription,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { saveAppointment, updateAppointment } from "@/utils/localStorage";
import { useToast } from "@/components/ui/use-toast";
import { Appointment } from "@/types";

const appointmentSchema = z.object({
  title: z.string().min(1, { message: "Title is required" }),
  date: z.date({ required_error: "Date is required" }),
  time: z.string().min(1, { message: "Time is required" }),
  location: z.string().optional(),
  notes: z.string().optional(),
  reminder: z.boolean().default(false),
  reminderTime: z.enum(["1hour", "1day", "2days", "1week"]).optional(),
});

type AppointmentFormValues = z.infer<typeof appointmentSchema>;

interface AppointmentFormProps {
  onSuccess?: () => void;
  existingAppointment?: Appointment | null;
}

const AppointmentForm = ({ onSuccess, existingAppointment }: AppointmentFormProps) => {
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);

  const form = useForm<AppointmentFormValues>({
    resolver: zodResolver(appointmentSchema),
    defaultValues: {
      title: existingAppointment?.title || "",
      date: existingAppointment?.date ? new Date(existingAppointment.date) : undefined,
      time: existingAppointment?.time || "",
      location: existingAppointment?.location || "",
      notes: existingAppointment?.notes || "",
      reminder: existingAppointment?.reminder || false,
      reminderTime: existingAppointment?.reminderTime,
    },
  });

  // Watch the reminder field to control reminder time field visibility
  const showReminderOptions = form.watch("reminder");

  const onSubmit = (data: AppointmentFormValues) => {
    setLoading(true);
    
    // Ensure all required properties are explicitly set
    const appointmentData = {
      id: existingAppointment?.id || uuidv4(),
      title: data.title,
      date: data.date,
      time: data.time,
      location: data.location || undefined,
      notes: data.notes || undefined,
      reminder: data.reminder,
      reminderTime: data.reminder ? data.reminderTime : undefined,
    };
    
    try {
      if (existingAppointment) {
        updateAppointment(appointmentData);
        toast({
          title: "Appointment updated",
          description: "Your appointment has been updated",
        });
      } else {
        saveAppointment(appointmentData);
        toast({
          title: "Appointment scheduled",
          description: "Your appointment has been saved",
        });
      }
      
      form.reset();
      
      if (onSuccess) {
        onSuccess();
      }
    } catch (error) {
      console.error("Error saving appointment:", error);
      toast({
        title: "Error",
        description: "Failed to save appointment. Please try again.",
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
          name="title"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Title</FormLabel>
              <FormControl>
                <Input placeholder="e.g. Ultrasound, OB/GYN check-up" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
                      initialFocus
                      className="pointer-events-auto"
                    />
                  </PopoverContent>
                </Popover>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <FormField
            control={form.control}
            name="time"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Time</FormLabel>
                <FormControl>
                  <div className="relative">
                    <Input 
                      placeholder="e.g. 10:00 AM" 
                      {...field}
                    />
                    <Clock className="absolute right-3 top-2.5 h-4 w-4 text-muted-foreground" />
                  </div>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        
        <FormField
          control={form.control}
          name="location"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Location (optional)</FormLabel>
              <FormControl>
                <Input placeholder="e.g. Dr. Smith's Office, 123 Medical Plaza" {...field} />
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
                  placeholder="Add any notes or things to remember for this appointment"
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
          name="reminder"
          render={({ field }) => (
            <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
              <FormControl>
                <Checkbox
                  checked={field.value}
                  onCheckedChange={field.onChange}
                />
              </FormControl>
              <div className="space-y-1 leading-none">
                <FormLabel>Set reminder</FormLabel>
                <FormDescription>
                  Receive a notification before this appointment
                </FormDescription>
              </div>
            </FormItem>
          )}
        />
        
        {showReminderOptions && (
          <FormField
            control={form.control}
            name="reminderTime"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Remind me</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select when to receive reminder" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="1hour">1 hour before</SelectItem>
                    <SelectItem value="1day">1 day before</SelectItem>
                    <SelectItem value="2days">2 days before</SelectItem>
                    <SelectItem value="1week">1 week before</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
        )}
        
        <Button type="submit" disabled={loading} className="w-full">
          {loading ? "Saving..." : (existingAppointment ? "Update Appointment" : "Save Appointment")}
        </Button>
      </form>
    </Form>
  );
};

export default AppointmentForm;
