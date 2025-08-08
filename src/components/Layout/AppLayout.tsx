
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { calculateTrimester } from "@/utils/trimesterHelper";
import Navbar from "./Navbar";
import { Sidebar } from "./Sidebar";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { Session, User } from "@supabase/supabase-js";

interface AppLayoutProps {
  children: React.ReactNode;
}

const AppLayout = ({ children }: AppLayoutProps) => {
  const [session, setSession] = useState<Session | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<any>(null);
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    // Set up auth state listener FIRST
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        setSession(session);
        setUser(session?.user ?? null);
        
        if (!session?.user) {
          navigate("/auth");
          return;
        }

        // Fetch user profile data
        setTimeout(async () => {
          if (session?.user) {
            const { data: profileData } = await supabase
              .from('profiles')
              .select('*')
              .eq('user_id', session.user.id)
              .single();
            
            if (profileData) {
              setProfile(profileData);
              
              // Update trimester if due date is set
              if (profileData.due_date) {
                const trimester = calculateTrimester(new Date(profileData.due_date));
                if (trimester !== profileData.current_trimester) {
                  await supabase
                    .from('profiles')
                    .update({ current_trimester: trimester })
                    .eq('user_id', session.user.id);
                  
                  if (profileData.current_trimester && trimester > profileData.current_trimester) {
                    toast({
                      title: `Welcome to your ${trimester === 1 ? "First" : trimester === 2 ? "Second" : "Third"} Trimester!`,
                      description: "Your pregnancy journey has progressed to a new stage.",
                    });
                  }
                }
              }
            }
          }
        }, 0);
      }
    );

    // THEN check for existing session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setUser(session?.user ?? null);
      
      if (!session?.user) {
        navigate("/auth");
        return;
      }
    });

    return () => subscription.unsubscribe();
  }, [navigate, toast]);

  if (!user) return null;

  return (
    <div className="min-h-screen bg-background flex">
      <Sidebar />
      <div className="flex-1 flex flex-col">
        <Navbar user={user} profile={profile} />
        <main className="flex-1 p-4 md:p-6 max-w-7xl mx-auto w-full">
          {children}
        </main>
      </div>
    </div>
  );
};

export default AppLayout;
