
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getCurrentUser, updateCurrentUser } from "@/utils/localStorage";
import { User } from "@/types";
import { calculateTrimester } from "@/utils/trimesterHelper";
import Navbar from "./Navbar";
import { Sidebar } from "./Sidebar";
import { useToast } from "@/components/ui/use-toast";

interface AppLayoutProps {
  children: React.ReactNode;
}

const AppLayout = ({ children }: AppLayoutProps) => {
  const [user, setUser] = useState<User | null>(null);
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    const currentUser = getCurrentUser();
    if (!currentUser) {
      navigate("/auth");
      return;
    }

    // Update trimester if due date is set
    if (currentUser.dueDate) {
      const trimester = calculateTrimester(new Date(currentUser.dueDate));
      if (trimester !== currentUser.currentTrimester) {
        updateCurrentUser({ currentTrimester: trimester });
        
        if (currentUser.currentTrimester && trimester > currentUser.currentTrimester) {
          toast({
            title: `Welcome to your ${trimester === 1 ? "First" : trimester === 2 ? "Second" : "Third"} Trimester!`,
            description: "Your pregnancy journey has progressed to a new stage.",
          });
        }
      }
    }

    setUser(currentUser);
  }, [navigate, toast]);

  if (!user) return null;

  return (
    <div className="min-h-screen bg-background flex">
      <Sidebar />
      <div className="flex-1 flex flex-col">
        <Navbar user={user} />
        <main className="flex-1 p-4 md:p-6 max-w-7xl mx-auto w-full">
          {children}
        </main>
      </div>
    </div>
  );
};

export default AppLayout;
