
import AuthForm from "@/components/Auth/AuthForm";
import { useEffect } from "react";
import { getCurrentUser } from "@/utils/localStorage";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/components/ui/use-toast";

const Auth = () => {
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    const user = getCurrentUser();
    if (user) {
      navigate("/");
      toast({
        title: "Welcome back",
        description: `Logged in as ${user.email}`,
      });
    }
  }, [navigate, toast]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-primary/20 to-background p-4">
      <div className="w-full max-w-md">
        <h1 className="text-3xl font-bold text-center mb-8 text-primary">BloomBaby</h1>
        <AuthForm />
      </div>
    </div>
  );
};

export default Auth;
