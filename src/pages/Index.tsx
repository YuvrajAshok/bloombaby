
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { getCurrentUser } from "@/utils/localStorage";
import AppLayout from "@/components/Layout/AppLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import BabySizeCard from "@/components/Home/BabySizeCard";
import TrimesterCard from "@/components/Home/TrimesterCard";
import QuickQuiz from "@/components/Home/QuickQuiz";

const Index = () => {
  const navigate = useNavigate();
  
  useEffect(() => {
    const user = getCurrentUser();
    if (!user) {
      navigate("/auth");
    }
  }, [navigate]);

  return (
    <AppLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-semibold mb-2">Welcome to Your Mindful Journey</h1>
          <p className="text-muted-foreground">
            Track your pregnancy, monitor symptoms, and prepare for your baby's arrival.
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <BabySizeCard />
          <TrimesterCard />
          <QuickQuiz />
        </div>
        
        <Card>
          <CardHeader>
            <CardTitle>Quick Access</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
              {[
                { title: "Log Symptoms", path: "/symptoms" },
                { title: "Record Mood", path: "/mood" },
                { title: "Track Nutrition", path: "/nutrition" },
                { title: "Log Exercise", path: "/exercise" },
                { title: "Update Birth Plan", path: "/birth-plan" },
                { title: "Find Hospitals", path: "/hospitals" },
                { title: "View Calendar", path: "/calendar" },
                { title: "Edit Profile", path: "/profile" },
              ].map((item) => (
                <Card key={item.path} className="cursor-pointer hover:bg-accent transition-colors" onClick={() => navigate(item.path)}>
                  <CardContent className="p-4 flex items-center justify-center h-20">
                    <span className="text-center text-sm font-medium">{item.title}</span>
                  </CardContent>
                </Card>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </AppLayout>
  );
};

export default Index;
