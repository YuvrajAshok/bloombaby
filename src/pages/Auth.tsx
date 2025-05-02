
import AuthForm from "@/components/Auth/AuthForm";
import { useEffect } from "react";
import { getCurrentUser } from "@/utils/localStorage";
import { useNavigate } from "react-router-dom";

const Auth = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const user = getCurrentUser();
    if (user) {
      navigate("/");
    }
  }, [navigate]);

  return <AuthForm />;
};

export default Auth;
