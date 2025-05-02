
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { getCurrentUser } from "@/utils/localStorage";
import AppLayout from "@/components/Layout/AppLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import BabySizeCard from "@/components/Home/BabySizeCard";
import TrimesterCard from "@/components/Home/TrimesterCard";
import QuickQuiz from "@/components/Home/QuickQuiz";
import { Baby, Heart, BookOpen, Calendar, Robot } from "lucide-react";
import { Button } from "@/components/ui/button";

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
          <h1 className="text-3xl font-semibold mb-2">Welcome to Your BloomBaby Journey 🌱</h1>
          <p className="text-muted-foreground">
            Track your pregnancy, monitor symptoms, and prepare for your baby's arrival.
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <BabySizeCard />
          <TrimesterCard />
          <QuickQuiz />
        </div>
        
        <Card className="overflow-hidden relative">
          <div className="absolute top-0 right-0 w-32 h-32 -mr-10 -mt-10 bg-mama-lavender rounded-full opacity-20 animate-pulse"></div>
          <CardHeader className="relative z-10">
            <CardTitle className="flex items-center gap-2">
              <Robot className="h-5 w-5 text-primary" />
              <span>BloomBaby AI Assistant</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="relative z-10">
            <p className="mb-6">
              Have questions about your pregnancy? Our AI assistant is here to help! 
              Get answers about symptoms, baby development, nutrition, and more.
            </p>
            <Button onClick={() => navigate("/ai-assistant")} className="animate-bounce">
              Chat with BloomBaby AI 💬
            </Button>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="relative">
            <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-r from-mama-softblue to-mama-softgreen opacity-20 rounded-t-lg"></div>
            <CardTitle className="relative z-10">Quick Access</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
              {[
                { title: "Log Symptoms", path: "/symptoms", icon: <Heart className="h-5 w-5 text-red-400" />, emoji: "🤒" },
                { title: "Record Mood", path: "/mood", icon: <Heart className="h-5 w-5 text-yellow-400" />, emoji: "😊" },
                { title: "Track Nutrition", path: "/nutrition", icon: <Heart className="h-5 w-5 text-green-400" />, emoji: "🥗" },
                { title: "Log Exercise", path: "/exercise", icon: <Heart className="h-5 w-5 text-blue-400" />, emoji: "🧘‍♀️" },
                { title: "Update Birth Plan", path: "/birth-plan", icon: <BookOpen className="h-5 w-5 text-purple-400" />, emoji: "📝" },
                { title: "Find Hospitals", path: "/hospitals", icon: <Heart className="h-5 w-5 text-indigo-400" />, emoji: "🏥" },
                { title: "View Calendar", path: "/calendar", icon: <Calendar className="h-5 w-5 text-pink-400" />, emoji: "📆" },
                { title: "Edit Profile", path: "/profile", icon: <Baby className="h-5 w-5 text-teal-400" />, emoji: "👤" },
              ].map((item) => (
                <Card key={item.path} className="cursor-pointer hover:bg-accent transition-colors group" onClick={() => navigate(item.path)}>
                  <CardContent className="p-4 flex flex-col items-center justify-center h-24">
                    <div className="text-2xl mb-2 group-hover:animate-bounce">{item.emoji}</div>
                    <span className="text-center text-sm font-medium">{item.title}</span>
                  </CardContent>
                </Card>
              ))}
            </div>
          </CardContent>
        </Card>
        
        <div className="bg-mama-softgreen bg-opacity-30 rounded-lg p-6 relative overflow-hidden">
          <div className="absolute -right-10 -top-10 w-40 h-40 bg-mama-softblue rounded-full opacity-20"></div>
          <div className="absolute -left-10 -bottom-10 w-40 h-40 bg-mama-lavender rounded-full opacity-20"></div>
          <h2 className="text-xl font-medium mb-3 relative z-10">Your BloomBaby Journey</h2>
          <p className="relative z-10">
            Every pregnancy is unique. Track your journey, connect with resources,
            and prepare for the arrival of your little one with confidence and joy.
          </p>
        </div>
      </div>
    </AppLayout>
  );
};

export default Index;
