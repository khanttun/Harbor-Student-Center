"use client";
import { useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  LayoutDashboard,
  Users,
  Calendar,
  FileText,
  Heart,
  LogOut,
  ChevronLeft,
  Menu,
  ShieldCheck,
} from "lucide-react";
import { createClient } from "@/lib/supabase/client";

interface SidebarProps {
  mobile?: boolean;
  onNavigate?: () => void;
}

const Sidebar = ({ mobile = false, onNavigate }: SidebarProps) => {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const pathname = usePathname();
  const router = useRouter();
  const menuItems = [
    { icon: <LayoutDashboard size={20} />, label: "Dashboard", href: "/dashboard" },
    { icon: <Calendar size={20} />, label: "Events", href: "/dashboard/events" },
    { icon: <FileText size={20} />, label: "Memories", href: "/dashboard/memories" },
    { icon: <Users size={20} />, label: "Announcements", href: "/dashboard/announcements" },
    { icon: <Heart size={20} />, label: "Appreciation", href: "/dashboard/appreciation" },
    { icon: <ShieldCheck size={20} />, label: "Admins", href: "/dashboard/admins" },
  ];

  const showLabels = mobile || !isCollapsed;

  return (
    <div
      className={`flex h-full shrink-0 flex-col overflow-hidden border-r border-sidebar-border bg-sidebar text-sidebar-foreground transition-all duration-300 ${
        mobile ? "w-full" : isCollapsed ? "w-20" : "w-64"
      }`}
    >
      <div className="flex items-center justify-between border-sidebar-border p-4">
        {showLabels && (
          <span
            className="text-xl font-bold tracking-tight"
            style={{ color: "var(--sidebar-primary)" }}
          >
            Harbor Admin
          </span>
        )}
        {!mobile && (
          <button
            onClick={() => setIsCollapsed(!isCollapsed)}
            className="cursor-pointer rounded-lg bg-sidebar-accent p-1.5 transition-colors hover:bg-sidebar-primary"
            aria-label={isCollapsed ? "Expand sidebar" : "Collapse sidebar"}
          >
            {isCollapsed ? <Menu size={20} /> : <ChevronLeft size={20} />}
          </button>
        )}
      </div>

      <nav className="mt-4 flex-1 space-y-1 px-3">
        {menuItems.map((item, index) => {
          const isActive = pathname === item.href;
          return (
            <Link
              key={index}
              href={item.href}
              onClick={onNavigate}
              className={`group relative flex items-center gap-4 rounded-lg px-3 py-3 transition-colors ${
                isActive
                  ? "bg-sidebar-primary text-sidebar-primary-foreground shadow"
                  : "hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
              }`}
            >
              <div className="min-w-5">{item.icon}</div>
              {showLabels && <span className="font-medium">{item.label}</span>}
              {!mobile && isCollapsed && (
                <div className="pointer-events-none absolute left-20 z-50 whitespace-nowrap rounded border border-sidebar-border bg-sidebar px-2 py-1 text-xs text-sidebar-foreground opacity-0 shadow transition-opacity duration-300 group-hover:opacity-100">
                  {item.label}
                </div>
              )}
            </Link>
          );
        })}
      </nav>

      <div className="border-t border-sidebar-border p-4">
        <button
          onClick={async () => {
            const supabase = createClient();
            await supabase.auth.signOut();
            router.push("/login");
          }}
          className="group flex w-full cursor-pointer items-center gap-4 rounded-lg px-3 py-3 font-medium transition-colors duration-300 hover:bg-destructive hover:text-destructive-foreground"
        >
          <LogOut size={20} />
          {showLabels && <span className="font-medium">Logout</span>}
        </button>
      </div>
    </div>
  );
};

export default Sidebar;
