import { Search, Bell, User, Sparkles, LogOut } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/useAuth";
import { useNavigate } from "react-router-dom";

const TopNavbar = () => {
  const { user, signOut } = useAuth();
  const navigate = useNavigate();

  const handleAuthClick = async () => {
    if (user) {
      await signOut();
    } else {
      navigate("/auth");
    }
  };

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 h-16 glass-panel border-b border-border/50">
      <div className="h-full px-6 flex items-center justify-between">
        {/* Logo */}
        <div className="flex items-center gap-3">
          <div className="relative w-10 h-10 flex items-center justify-center">
            <div className="absolute inset-0 rounded-xl bg-gradient-to-br from-primary/30 to-accent/30 animate-pulse-glow" />
            <div className="relative w-8 h-8 rounded-lg bg-gradient-to-br from-primary to-accent flex items-center justify-center">
              <span className="text-primary-foreground font-bold text-sm">J</span>
            </div>
          </div>
          <div>
            <h1 className="text-lg font-semibold text-foreground">Jaclang Dojo</h1>
            <p className="text-xs text-muted-foreground -mt-0.5">Master the Code</p>
          </div>
        </div>

        {/* Global Search */}
        <div className="flex-1 max-w-md mx-8">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input 
              placeholder="Search lessons, projects, docs..."
              className="pl-10 bg-secondary/50 border-border/50 focus:border-primary/50 transition-colors"
            />
          </div>
        </div>

        {/* Right Section */}
        <div className="flex items-center gap-4">
          {/* AI Tutor Indicator */}
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-full glass-panel-subtle">
            <div className="relative">
              <Sparkles className="w-4 h-4 text-primary" />
              <div className="absolute -top-0.5 -right-0.5 w-2 h-2 rounded-full bg-success animate-pulse" />
            </div>
            <span className="text-sm text-foreground/80">AI Tutor</span>
          </div>

          {/* Notifications */}
          <Button variant="ghost" size="icon" className="relative">
            <Bell className="w-5 h-5 text-muted-foreground" />
            <span className="absolute top-1 right-1 w-2 h-2 rounded-full bg-primary" />
          </Button>

          {/* User Profile / Auth */}
          {user ? (
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-full bg-gradient-to-br from-primary/20 to-accent/20 border border-border flex items-center justify-center">
                <User className="w-4 h-4 text-foreground" />
              </div>
              <span className="text-sm text-foreground hidden md:inline">{user.email?.split("@")[0]}</span>
              <Button variant="ghost" size="icon" onClick={handleAuthClick} title="Sign out">
                <LogOut className="w-4 h-4 text-muted-foreground" />
              </Button>
            </div>
          ) : (
            <Button variant="outline" size="sm" onClick={handleAuthClick} className="border-primary/50 hover:bg-primary/10">
              Sign In
            </Button>
          )}
        </div>
      </div>
    </nav>
  );
};

export default TopNavbar;
