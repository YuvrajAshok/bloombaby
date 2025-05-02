
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { format } from "date-fns";
import { CalendarIcon } from "lucide-react";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import AppLayout from "@/components/Layout/AppLayout";
import { getCurrentUser, updateCurrentUser } from "@/utils/localStorage";
import { User } from "@/types";
import { calculateTrimester } from "@/utils/trimesterHelper";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
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
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { useToast } from "@/components/ui/use-toast";
import { cn } from "@/lib/utils";

const profileSchema = z.object({
  name: z.string().min(2, { message: "Name must be at least 2 characters" }),
  email: z.string().email({ message: "Please enter a valid email" }).optional(),
  dueDate: z.date().optional(),
});

type ProfileFormValues = z.infer<typeof profileSchema>;

const Profile = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(false);

  const form = useForm<ProfileFormValues>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      name: "",
      email: "",
      dueDate: undefined,
    },
  });

  useEffect(() => {
    const currentUser = getCurrentUser();
    if (!currentUser) {
      navigate("/auth");
      return;
    }

    setUser(currentUser);

    form.reset({
      name: currentUser.name,
      email: currentUser.email,
      dueDate: currentUser.dueDate ? new Date(currentUser.dueDate) : undefined,
    });
  }, [form, navigate]);

  const onSubmit = (data: ProfileFormValues) => {
    if (!user) return;
    
    setLoading(true);
    
    try {
      // Calculate trimester if due date is set
      let trimester = user.currentTrimester;
      if (data.dueDate) {
        trimester = calculateTrimester(data.dueDate);
      }
      
      updateCurrentUser({
        name: data.name,
        dueDate: data.dueDate,
        currentTrimester: trimester,
      });
      
      setUser({
        ...user,
        name: data.name,
        dueDate: data.dueDate,
        currentTrimester: trimester,
      });
      
      toast({
        title: "Profile updated",
        description: "Your profile has been successfully updated",
      });
    } catch (error) {
      console.error("Error updating profile:", error);
      toast({
        title: "Update failed",
        description: "Failed to update profile. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <AppLayout>
      <div className="space-y-6 max-w-md mx-auto">
        <div>
          <h1 className="text-3xl font-semibold mb-2">Your Profile</h1>
          <p className="text-muted-foreground">
            Update your personal information
          </p>
        </div>
        
        <Card>
          <CardHeader>
            <CardTitle>User Info</CardTitle>
            <CardDescription>
              Edit your personal details and due date
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Name</FormLabel>
                      <FormControl>
                        <Input {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Email</FormLabel>
                      <FormControl>
                        <Input {...field} disabled />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="dueDate"
                  render={({ field }) => (
                    <FormItem className="flex flex-col">
                      <FormLabel>Due Date</FormLabel>
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
                
                {user?.currentTrimester && (
                  <div className="pt-2">
                    <div className="text-sm font-medium">Current Trimester</div>
                    <div className="bg-mama-lavender bg-opacity-30 px-3 py-2 rounded-md mt-1">
                      {user.currentTrimester === 1 && "First Trimester"}
                      {user.currentTrimester === 2 && "Second Trimester"}
                      {user.currentTrimester === 3 && "Third Trimester"}
                    </div>
                  </div>
                )}
                
                <Button type="submit" className="w-full" disabled={loading}>
                  {loading ? "Updating..." : "Update Profile"}
                </Button>
              </form>
            </Form>
          </CardContent>
        </Card>
      </div>
    </AppLayout>
  );
};

export default Profile;
