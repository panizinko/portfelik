import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { MobileNotificationsPanel } from "@/modules/shared/components/navigation/MobileNotificationsPanel";
import { Link } from "@tanstack/react-router";
import { Bell, LogOut, Menu } from "lucide-react";
import { useState } from "react";
import { NavigationLinks } from "./NavigationLinks";

interface MobileMenuProps {
  isAuthenticated: boolean;
  isAdmin?: boolean;
  notificationPermission: NotificationPermission;
  onNotificationClick: () => void;
  onLogout: () => void;
}

export function MobileMenu({
  isAuthenticated,
  isAdmin,
  notificationPermission,
  onNotificationClick,
  onLogout,
}: MobileMenuProps) {
  const [open, setOpen] = useState(false);

  const handleOpenChange = (open: boolean) => {
    setOpen(open);
  };

  return (
    <Sheet open={open} onOpenChange={handleOpenChange}>
      <SheetTrigger asChild>
        <button className="inline-flex items-center justify-center p-2 rounded-md text-gray-700 hover:text-blue-600 hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-blue-500">
          <span className="sr-only">Open main menu</span>
          <Menu className="h-6 w-6" />
        </button>
      </SheetTrigger>
      <SheetContent>
        <div className="mt-6 flex flex-col gap-4">
          <NavigationLinks
            isAdmin={isAdmin}
            isMobile
            onNavigate={() => {
              setOpen(false);
            }}
          />
          {isAuthenticated && notificationPermission === "granted" ? (
            <MobileNotificationsPanel />
          ) : (
            isAuthenticated && (
              <Button
                variant="outline"
                size="sm"
                onClick={onNotificationClick}
                className="flex items-center gap-2 w-full"
              >
                <Bell className="h-4 w-4" />
                Enable Notifications
              </Button>
            )
          )}
          <div className="mt-4">
            {isAuthenticated ? (
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  onLogout();
                  setOpen(false);
                }}
                className="flex items-center gap-2 w-full"
              >
                <LogOut className="h-4 w-4" />
                Logout
              </Button>
            ) : (
              <Button variant="outline" size="sm" asChild className="w-full">
                <Link to="/login" onClick={() => setOpen(false)}>
                  Login
                </Link>
              </Button>
            )}
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
}
