import { Search, Bell, User, Sparkles } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

const TopNavbar = () => {
  return (
    <nav className="fixed top-0 left-0 right-0 z-50 h-14 glass-panel border-b border-border/30">
      <div className="h-full px-6 flex items-center justify-between">
        {/* Logo */}
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-primary/20 to-accent/10 flex items-center justify-center border border-border/50">
            <span className="text-primary font-semibold text-sm">J</span>
          </div>
          <div>
            <h1 className="text-sm font-medium text-foreground tracking-wide">Jaclang</h1>
            <p className="text-[10px] text-muted-foreground tracking-wider uppercase">Learn</p>
          </div>
        </div>

        {/* Global Search */}
        <div className="flex-1 max-w-sm mx-8">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-muted-foreground" />
            <Input 
              placeholder="Search..."
              className="pl-9 h-8 text-sm bg-secondary/30 border-border/30 focus:border-primary/30 transition-all duration-400"
            />
          </div>
        </div>

        {/* Right Section */}
        <div className="flex items-center gap-3">
          {/* AI Tutor Indicator */}
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-secondary/50 border border-border/30">
            <div className="relative">
              <Sparkles className="w-3.5 h-3.5 text-primary" />
              <div className="absolute -top-0.5 -right-0.5 w-1.5 h-1.5 rounded-full bg-primary animate-pulse-subtle" />
            </div>
            <span className="text-xs text-muted-foreground">AI Tutor</span>
          </div>

          {/* Notifications */}
          <Button variant="ghost" size="icon" className="relative w-8 h-8">
            <Bell className="w-4 h-4 text-muted-foreground" />
            <span className="absolute top-1.5 right-1.5 w-1.5 h-1.5 rounded-full bg-primary" />
          </Button>

          {/* User Profile */}
          <Button variant="ghost" size="icon" className="w-8 h-8 rounded-full">
            <div className="w-7 h-7 rounded-full bg-secondary border border-border/50 flex items-center justify-center">
              <User className="w-3.5 h-3.5 text-muted-foreground" />
            </div>
          </Button>
        </div>
      </div>
    </nav>
  );
};

export default TopNavbar;
