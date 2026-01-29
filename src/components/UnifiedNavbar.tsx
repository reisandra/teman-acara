import { useState } from "react";
import { Link } from "react-router-dom";
import { Heart, Menu, X } from "lucide-react";
import { useAppSettings } from "@/contexts/AppSettingsContext";

// Definisikan tipe untuk props
interface NavbarProps {
  navLinks: Array<{ label: string; to: string }>;
  basePath: string; // Base path untuk link (misalnya "/" untuk user, "/mitra" untuk mitra)
  showAdminBadge?: boolean; // Untuk menampilkan badge "Admin" di navbar admin
}

const UnifiedNavbar = ({ navLinks, basePath, showAdminBadge = false }: NavbarProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const { settings } = useAppSettings();

  return (
    <header className="sticky top-0 z-50 bg-background/80 backdrop-blur-md border-b border-border">
      <div className="container">
        <div className="flex items-center justify-between h-16">
          {/* Logo - Gunakan dari settings */}
          <Link to={basePath} className="flex items-center gap-2">
            {settings.appLogo ? (
              <img 
                src={settings.appLogo} 
                alt="Logo" 
                className="w-9 h-9 rounded-lg object-contain" 
              />
            ) : (
              <div className="w-9 h-9 rounded-lg bg-gradient-hero flex items-center justify-center">
                <Heart className="w-5 h-5 text-white fill-current" />
              </div>
            )}
            <span className="text-lg font-bold">
              {settings.appName || "Lovable"}
              {showAdminBadge && <span className="ml-2 text-sm font-normal text-muted-foreground">Admin</span>}
            </span>
          </Link>

          {/* Desktop */}
          <nav className="hidden md:flex gap-8">
            {navLinks.map((link) => (
              <Link
                key={link.label}
                to={`${basePath}${link.to}`}
                className="text-sm font-bold text-muted-foreground hover:text-foreground"
              >
                {link.label}
              </Link>
            ))}
          </nav>

          {/* Mobile button */}
          <button onClick={() => setIsOpen(!isOpen)} className="md:hidden p-2">
            {isOpen ? <X /> : <Menu />}
          </button>
        </div>

        {/* Mobile menu */}
        {isOpen && (
          <div className="md:hidden py-4 border-t">
            {navLinks.map((link) => (
              <Link
                key={link.label}
                to={`${basePath}${link.to}`}
                onClick={() => setIsOpen(false)}
                className="block py-2"
              >
                {link.label}
              </Link>
            ))}
          </div>
        )}
      </div>
    </header>
  );
};

export default UnifiedNavbar;