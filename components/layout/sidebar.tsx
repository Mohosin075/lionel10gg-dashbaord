"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import {
  LayoutDashboard,
  Users,
  BarChart2,
  BookOpen,
  Video,
  Award,
} from "lucide-react";
import Image from "next/image";

const navItems = [
  { title: "Dashboard", href: "/", icon: LayoutDashboard },
  { title: "User Management", href: "/users", icon: Users },
  { title: "Knowledge Library", href: "/knowledge-library", icon: BookOpen },
  { title: "Sheikh Media", href: "/sheikh-media", icon: Video },
  { title: "Premium Benefits", href: "/premium-benefits", icon: Award },
  { title: "Reports", href: "/reports", icon: BarChart2 },
];

export function Sidebar() {
  const pathname = usePathname();

  return (
    <div className="flex h-[calc(100vh-40px)] w-72 flex-col bg-white rounded-2xl shadow">
      <div className="w-52 h-auto mx-auto py-5">        
        <Image src={require("@/public/logo.png")} className="w-full" alt="Quran" width={500} height={500} />
      </div>

      <nav className="flex-1 space-y-1 p-4">
        {navItems.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex items-center gap-3 rounded-full px-4 py-3 text-sm font-medium transition-colors cursor-pointer",
                isActive
                  ? "bg-emerald-900 text-white"
                  : "text-slate-500 hover:bg-slate-100",
              )}
            >
              <item.icon
                className={cn(
                  "h-5 w-5",
                  isActive ? "text-white" : "text-slate-400",
                )}
              />
              {item.title}
            </Link>
          );
        })}
      </nav>

      <div className="p-4 border-t border-slate-100 flex flex-col gap-4">
        <button className="flex w-full items-center justify-center rounded-full bg-red-600 px-4 py-2.5 text-sm font-medium text-white hover:bg-red-700 transition-colors">
          Logout
        </button>
        <div className="flex items-center gap-3 px-2">
          <div className="h-10 w-10 overflow-hidden rounded-full bg-slate-200">
            <img
              src="https://api.dicebear.com/7.x/avataaars/svg?seed=Admin"
              alt="Admin"
              className="h-full w-full object-cover"
            />
          </div>
          <div className="flex flex-col">
            <span className="text-xs text-slate-500">admin@photopia.app</span>
            <span className="text-sm font-medium text-slate-900">Admin</span>
          </div>
        </div>
      </div>
    </div>
  );
}
