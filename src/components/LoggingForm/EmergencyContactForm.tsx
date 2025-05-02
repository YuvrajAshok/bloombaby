
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
import { saveEmergencyContact } from "@/utils/localStorage";
import { useToast } from "@/components/ui/use-toast";

const contactSchema = z.object({
  name: z.string().min(1, { message: "Name is required" }),
  relationship: z.string().min(1, { message: "Relationship is required" }),
  phone: z.string().min(7, { message: "Valid phone number is required" }),
});

type EmergencyContactFormValues = z.infer<typeof contactSchema>;

interface EmergencyContactFormProps {
  onSuccess?: () => void;
}

const EmergencyContactForm = ({ onSuccess }: EmergencyContactFormProps) => {
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);

  const form = useForm<EmergencyContactFormValues>({
    resolver: zodResolver(contactSchema),
    defaultValues: {
      name: "",
      relationship: "",
      phone: "",
    },
  });

  const onSubmit = (data: EmergencyContactFormValues) => {
    setLoading(true);
    
    // Ensure all required properties are explicitly set
    const newContact = {
      id: uuidv4(),
      name: data.name,
      relationship: data.relationship,
      phone: data.phone,
    };
    
    try {
      saveEmergencyContact(newContact);
      console.log("Emergency contact saved:", newContact);
      
      toast({
        title: "Contact saved",
        description: "Your emergency contact has been added",
      });
      
      form.reset();
      
      if (onSuccess) {
        onSuccess();
      }
    } catch (error) {
      console.error("Error saving contact:", error);
      toast({
        title: "Error",
        description: "Failed to save contact. Please try again.",
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
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Name</FormLabel>
              <FormControl>
                <Input placeholder="Contact name" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <FormField
          control={form.control}
          name="relationship"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Relationship</FormLabel>
              <Select onValueChange={field.onChange} value={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select relationship" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="doctor">Doctor</SelectItem>
                  <SelectItem value="obgyn">OB/GYN</SelectItem>
                  <SelectItem value="husband">Husband</SelectItem>
                  <SelectItem value="partner">Partner</SelectItem>
                  <SelectItem value="family">Family Member</SelectItem>
                  <SelectItem value="friend">Friend</SelectItem>
                  <SelectItem value="emergency">Emergency Contact</SelectItem>
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <FormField
          control={form.control}
          name="phone"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Phone Number</FormLabel>
              <FormControl>
                <Input placeholder="Phone number" type="tel" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <Button type="submit" disabled={loading} className="w-full">
          {loading ? "Saving..." : "Save Contact"}
        </Button>
      </form>
    </Form>
  );
};

export default EmergencyContactForm;
