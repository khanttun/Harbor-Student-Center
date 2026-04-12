"use client";
import React, { useState } from 'react';
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  LayoutDashboard,
  Users,
  GraduationCap,
  Calendar,
  FileText,
  Settings,
  LogOut,
  ChevronLeft,
  Menu
} from 'lucide-react';
import { createClient } from '@/lib/supabase/client';

const Sidebar = () => {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const pathname = usePathname();
  const router = useRouter();
  const menuItems = [
    { icon: <LayoutDashboard size={20} />, label: 'Dashboard', href: '/dashboard' },
    { icon: <Calendar size={20} />, label: 'Events', href: '/dashboard/events' },
    { icon: <FileText size={20} />, label: 'Memories', href: '/dashboard/memories' },
    { icon: <Users size={20} />, label: 'Announcements', href: '/dashboard/announcements' },
    // Add more as needed
  ];

  return (
    <div
      className={`h-screen transition-all duration-300 flex flex-col border-r`
        + ` ${isCollapsed ? 'w-20' : 'w-64'}`
        + ' bg-sidebar text-sidebar-foreground border-sidebar-border'}
    >

      {/* Header / Logo */}
      <div className="flex items-center justify-between p-4 border-b border-(--sidebar-border)">
        {!isCollapsed && (
          <span
            className="font-bold text-xl tracking-tight"
            style={{ color: 'var(--sidebar-primary)' }}
          >
            Harbor Admin
          </span>
        )}
        <button
          onClick={() => setIsCollapsed(!isCollapsed)}
          className="p-1.5 rounded-lg bg-sidebar-accent hover:bg-sidebar-primary transition-colors"
        >
          {isCollapsed ? <Menu size={20} /> : <ChevronLeft size={20} />}
        </button>
      </div>

      {/* Navigation Links */}
      <nav className="flex-1 mt-4 px-3 space-y-1">
        {menuItems.map((item, index) => {
          const isActive = pathname === item.href;
          return (
            <Link
              key={index}
              href={item.href}
              className={`relative flex items-center gap-4 px-3 py-3 rounded-lg transition-colors group`
                + (isActive
                  ? ' bg-sidebar-primary text-sidebar-primary-foreground shadow'
                  : ' hover:bg-sidebar-accent hover:text-sidebar-accent-foreground')
              }
            >
              <div className="min-w-5">{item.icon}</div>
              {!isCollapsed && <span className="font-medium">{item.label}</span>}
              {/* Tooltip for collapsed state */}
              {isCollapsed && (
                <div className="absolute left-20 bg-sidebar text-sidebar-foreground text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity whitespace-nowrap z-50 border border-sidebar-border shadow">
                  {item.label}
                </div>
              )}
            </Link>
          );
        })}
      </nav>

      <div className="p-4 border-t border-sidebar-border">
        <button
          onClick={async () => {
            const supabase = createClient();
            await supabase.auth.signOut();
            router.push('/login');
          }}
          className="flex items-center gap-4 px-3 py-3 w-full rounded-lg transition-colors group font-medium hover:bg-destructive hover:text-destructive-foreground"
        >
          <LogOut size={20} />
          {!isCollapsed && <span className="font-medium">Logout</span>}
        </button>
      </div>
    </div>
  );
};

export default Sidebar;