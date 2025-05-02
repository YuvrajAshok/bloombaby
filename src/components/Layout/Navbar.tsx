
import { User } from "@/types";
import { logoutUser } from "@/utils/localStorage";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuLabel, 
  DropdownMenuSeparator, 
  DropdownMenuTrigger 
} from "@/components/ui/dropdown-menu";

interface NavbarProps {
  user: User;
}

const Navbar = ({ user }: NavbarProps) => {
  const navigate = useNavigate();

  const handleLogout = () => {
    logoutUser();
    navigate("/auth");
  };

  return (
    <header className="border-b border-border bg-white">
      <div className="flex h-16 items-center px-4 md:px-6">
        <div className="ml-auto flex items-center gap-4">
          <div className="hidden md:flex md:gap-4 md:items-center">
            <span className="text-sm text-muted-foreground">Hello, {user.name}</span>
          </div>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="rounded-full">
                <span className="h-8 w-8 rounded-full bg-primary flex items-center justify-center text-primary-foreground">
                  {user.name.charAt(0).toUpperCase()}
                </span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>My Account</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={() => navigate("/profile")}>
                Profile
              </DropdownMenuItem>
              <DropdownMenuItem onClick={handleLogout}>
                Logout
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  );
};

export default Navbar;
