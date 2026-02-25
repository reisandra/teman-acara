import { useState, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { Home, Users, Calendar, MessageCircle, User, Menu, X, LogOut } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { getCurrentUser, subscribeToUser, UserProfile } from "@/lib/userStore";
import { dicebearAvatar } from "@/lib/utils";
import { useAppSettings } from "@/contexts/AppSettingsContext"; 
import { logoutUser } from "@/lib/userStore";
import { useToast } from "@/hooks/use-toast";

// User navigation items - NO admin access
const userNavItems = [
  { label: "Beranda", path: "/", icon: Home },
  { label: "Teman", path: "/talents", icon: Users },
  { label: "Pemesanan", path: "/bookings", icon: Calendar },
  { label: "Percakapan", path: "/chat", icon: MessageCircle },
  { label: "Profil", path: "/profile", icon: User },
];

export function Navbar() {
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [user, setUser] = useState<UserProfile | null>(null);
  const { settings } = useAppSettings();
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleLogout = () => {
    logoutUser();
    toast({
      title: "Logout Berhasil 👋",
      description: "Anda telah keluar dari akun",
    });
    navigate("/login");
  };

  useEffect(() => {
    setUser(getCurrentUser());
    const unsubscribe = subscribeToUser(() => {
      setUser(getCurrentUser());
    });
    return unsubscribe;
  }, []);

  // Hide navbar on admin pages
  if (location.pathname === "/admin" || location.pathname === "/admin-login") {
    return null;
  }

  return (
    <>
      {/* Desktop Navbar */}
      <nav className="hidden md:flex fixed top-0 left-0 right-0 z-50 bg-card/80 backdrop-blur-lg border-b shadow-sm">
        <div className="container flex items-center justify-between h-16">
          <Link to="/" className="flex items-center gap-2">
            {settings.appLogo ? (
              <img src={settings.appLogo} alt="Logo" className="w-10 h-10 rounded-xl object-contain" />
            ) : (
              <div className="w-10 h-10 bg-gradient-hero rounded-xl flex items-center justify-center shadow-orange">
                <span className="text-primary-foreground font-bold text-lg">{settings.appName.charAt(0)}</span>
              </div>
            )}
            <span className="font-bold text-xl text-foreground">{settings.appName}</span>
          </Link>

          <div className="flex items-center gap-1">
            {userNavItems.map((item) => {
              const Icon = item.icon;
              const isActive = location.pathname === item.path;
              const isProfile = item.label === "Profil";
              const unread = isProfile ? (user?.notifications?.filter((n) => !n.read).length || 0) : 0;

              return (
                <div key={item.path} className="relative">
                  <Link to={item.path}>
                    <Button
                      variant={isActive ? "soft" : "ghost"}
                      size="sm"
                      className={cn("gap-2", isActive && "text-primary font-semibold")}
                    >
                      {isProfile && user ? (
                        <img
                          src={user.photo}
                          alt="Profile"
                          className="w-5 h-5 rounded-full object-cover ring-1 ring-primary/20"
                          onError={(e) => {
                            e.currentTarget.onerror = null;
                            e.currentTarget.src = dicebearAvatar(user.name, "Wanita", 64);
                          }}
                        />
                      ) : (
                        <Icon className="w-4 h-4" />
                      )}
                      {item.label}
                      {isProfile && unread > 0 && (
                        <span className="ml-1 inline-flex items-center justify-center text-[10px] min-w-[16px] h-4 px-1 rounded-full bg-red-500 text-white">
                          {unread}
                        </span>
                      )}
                    </Button>
                  </Link>

                  {/* Dropdown Logout for Profile */}
                  {isProfile && user && location.pathname.startsWith("/profile") && (
                    <div className="absolute right-0 mt-2 w-32 bg-card border rounded-xl shadow-md z-50">
                      <Button
                        variant="ghost"
                        size="sm"
                        className="w-full justify-start gap-2"
                        onClick={handleLogout}
                      >
                        <LogOut className="w-4 h-4" /> Logout
                      </Button>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </nav>

      {/* Mobile Header */}
      <nav className="md:hidden fixed top-0 left-0 right-0 z-50 bg-card/80 backdrop-blur-lg border-b shadow-sm">
        <div className="flex items-center justify-between h-14 px-4">
          <Link to="/" className="flex items-center gap-2">
            {settings.appLogo ? (
              <img src={settings.appLogo} alt="Logo" className="w-8 h-8 rounded-lg object-contain" />
            ) : (
              <div className="w-8 h-8 bg-gradient-hero rounded-lg flex items-center justify-center shadow-orange">
                <span className="text-primary-foreground font-bold">{settings.appName.charAt(0)}</span>
              </div>
            )}
            <span className="font-bold text-lg text-foreground">{settings.appName}</span>
          </Link>

          <Button
            variant="ghost"
            size="icon"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </Button>
        </div>

        {/* Mobile Menu Overlay */}
        {mobileMenuOpen && (
          <div className="absolute top-14 left-0 right-0 bg-card border-b shadow-lg animate-slide-up">
            <div className="p-4 space-y-2">
              {userNavItems.map((item) => {
                const Icon = item.icon;
                const isActive = location.pathname === item.path;
                const isProfile = item.label === "Profil";
                const unread = isProfile ? (user?.notifications?.filter((n) => !n.read).length || 0) : 0;

                return (
                  <div key={item.path} className="relative">
                    <Link
                      to={item.path}
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      <div
                        className={cn(
                          "flex items-center gap-3 p-3 rounded-xl transition-colors",
                          isActive ? "bg-accent text-primary" : "hover:bg-secondary"
                        )}
                      >
                        {isProfile && user ? (
                          <img
                            src={user.photo}
                            alt="Profile"
                            className="w-5 h-5 rounded-full object-cover ring-1 ring-primary/20"
                            onError={(e) => {
                              e.currentTarget.onerror = null;
                              e.currentTarget.src = dicebearAvatar(user.name, "Wanita", 64);
                            }}
                          />
                        ) : (
                          <Icon className="w-5 h-5" />
                        )}
                        <span className="font-medium">{item.label}</span>
                        {isProfile && unread > 0 && (
                          <span className="ml-auto inline-flex items-center justify-center text-[10px] min-w-[16px] h-4 px-1 rounded-full bg-red-500 text-white">
                            {unread}
                          </span>
                        )}
                      </div>
                    </Link>

                    {/* Mobile Dropdown Logout */}
                    {isProfile && user && location.pathname.startsWith("/profile") && (
                      <Button
                        variant="outline"
                        className="w-full mt-2 justify-start gap-2"
                        onClick={handleLogout}
                      >
                        <LogOut className="w-4 h-4" /> Logout
                      </Button>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </nav>
    </>
  );
}