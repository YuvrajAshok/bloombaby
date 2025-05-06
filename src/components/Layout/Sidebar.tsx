
import { useState, useEffect } from "react";
import { NavLink, useLocation } from "react-router-dom";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Baby, Heart, BookOpen, Calendar, Home, Bot, Phone, Clock, Bell } from "lucide-react";

export function Sidebar() {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const location = useLocation();
  
  // Close mobile menu when route changes
  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [location.pathname]);
  
  // Handle window resize to set appropriate sidebar state
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 768) {
        // On mobile, always collapse sidebar when resizing
        setIsCollapsed(true);
      }
    };
    
    window.addEventListener('resize', handleResize);
    handleResize(); // Initialize on first render
    
    return () => window.removeEventListener('resize', handleResize);
  }, []);
  
  return (
    <>
      {/* Mobile menu button */}
      <Button
        variant="ghost"
        size="icon"
        className="fixed top-4 left-4 z-30 md:hidden"
        onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
      >
        <Baby className="h-6 w-6 text-primary" />
        <span className="sr-only">Toggle Menu</span>
      </Button>
      
      {/* Overlay for mobile menu */}
      {isMobileMenuOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-20 md:hidden"
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}
      
      <div
        className={cn(
          "border-r bg-sidebar fixed top-0 left-0 z-20 h-full transition-all duration-300",
          isCollapsed ? "md:w-[80px]" : "md:w-[240px]",
          isMobileMenuOpen ? "w-[240px]" : "w-0",
          "md:relative md:w-auto md:block"
        )}
      >
        <div className={cn("flex h-16 items-center border-b px-4",
          isCollapsed ? "justify-center" : "justify-between"
        )}>
          {!isCollapsed && (
            <span className="text-lg font-semibold text-primary">
              BloomBaby
            </span>
          )}
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setIsCollapsed(!isCollapsed)}
            className="hidden md:flex"
          >
            <Baby className="h-6 w-6 text-primary" />
            <span className="sr-only">Toggle Sidebar</span>
          </Button>
        </div>
        <ScrollArea className="h-[calc(100vh-4rem)]">
          <div className="px-3 py-2">
            <div className="space-y-1">
              <NavItem
                title="Home"
                to="/"
                icon={<Home className="h-5 w-5" />}
                isCollapsed={isCollapsed}
              />
              <NavItem
                title="Symptoms"
                to="/symptoms"
                icon={<Heart className="h-5 w-5" />}
                isCollapsed={isCollapsed}
              />
              <NavItem
                title="Mood"
                to="/mood"
                icon={<Heart className="h-5 w-5" />}
                isCollapsed={isCollapsed}
              />
              <NavItem
                title="Nutrition"
                to="/nutrition"
                icon={<Heart className="h-5 w-5" />}
                isCollapsed={isCollapsed}
              />
              <NavItem
                title="Exercise"
                to="/exercise"
                icon={<Heart className="h-5 w-5" />}
                isCollapsed={isCollapsed}
              />
              <NavItem
                title="Birth Plan"
                to="/birth-plan"
                icon={<BookOpen className="h-5 w-5" />}
                isCollapsed={isCollapsed}
              />
              <NavItem
                title="Hospitals"
                to="/hospitals"
                icon={<Heart className="h-5 w-5" />}
                isCollapsed={isCollapsed}
              />
              <NavItem
                title="Calendar"
                to="/calendar"
                icon={<Calendar className="h-5 w-5" />}
                isCollapsed={isCollapsed}
              />
              <NavItem
                title="Emergency Contacts"
                to="/emergency-contacts"
                icon={<Phone className="h-5 w-5" />}
                isCollapsed={isCollapsed}
              />
              <NavItem
                title="Appointments"
                to="/appointments"
                icon={<Calendar className="h-5 w-5" />}
                isCollapsed={isCollapsed}
              />
              <NavItem
                title="Kick Counter"
                to="/kick-counter"
                icon={<Baby className="h-5 w-5" />}
                isCollapsed={isCollapsed}
              />
              <NavItem
                title="Contraction Timer"
                to="/contraction-timer"
                icon={<Clock className="h-5 w-5" />}
                isCollapsed={isCollapsed}
              />
              <NavItem
                title="AI Assistant"
                to="/ai-assistant"
                icon={<Bot className="h-5 w-5" />}
                isCollapsed={isCollapsed}
              />
            </div>
          </div>
        </ScrollArea>
        <div className="absolute bottom-4 left-0 right-0 flex justify-center">
          <Button variant="ghost" size="sm" onClick={() => setIsCollapsed(!isCollapsed)} className="hidden md:flex">
            {isCollapsed ? "→" : "←"}
          </Button>
        </div>
      </div>
    </>
  );
}

interface NavItemProps {
  title: string;
  to: string;
  icon: React.ReactNode;
  isCollapsed: boolean;
}

function NavItem({ title, to, icon, isCollapsed }: NavItemProps) {
  return (
    <NavLink
      to={to}
      className={({ isActive }) =>
        cn(
          "flex items-center gap-3 rounded-lg px-3 py-2 text-base transition-all",
          isActive
            ? "bg-primary text-primary-foreground"
            : "text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
        )
      }
    >
      {icon}
      {!isCollapsed && <span className="whitespace-nowrap overflow-hidden text-ellipsis">{title}</span>}
    </NavLink>
  );
}
