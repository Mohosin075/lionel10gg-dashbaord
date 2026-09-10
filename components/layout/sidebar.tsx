"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { cn } from "@/lib/utils";
import {
  LayoutDashboard,
  Users,
  BarChart2,
  CreditCard,
  ListOrdered,
  BookOpen,
  Video,
  Bell,
  DownloadCloud,
  Languages,
  BookText,
  Heart,
  Settings,
  FileText,
  LogOut,
} from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import { removeUser, selectUser } from "@/redux/slice/userSlice";
import { useGetProfileQuery } from "@/redux/features/user/userApi";

interface NavGroup {
  section: string;
  items: {
    title: string;
    href: string;
    icon: any;
    badge?: string;
    badgeColor?: string;
  }[];
}

const navGroups: NavGroup[] = [
  {
    section: "Main Portal",
    items: [
      { title: "Command Center", href: "/", icon: LayoutDashboard },
      { title: "App Config & Banners", href: "/app-config", icon: Settings, badge: "Live", badgeColor: "bg-emerald-600" },
    ],
  },
  {
    section: "Offline & AI Pipeline",
    items: [
      { title: "Offline Pack Manager", href: "/offline-packs", icon: DownloadCloud, badge: "S3 Sync", badgeColor: "bg-blue-600" },
      { title: "Translations Manager", href: "/translations", icon: Languages, badge: "109 Lng", badgeColor: "bg-purple-600" },
    ],
  },
  {
    section: "Islamic Content",
    items: [
      { title: "Hadith Manager", href: "/hadith", icon: BookText, badge: "8 Books", badgeColor: "bg-amber-600" },
      { title: "Dua Manager", href: "/duas", icon: Heart },
      { title: "Knowledge Library", href: "/knowledge-library", icon: BookOpen },
      { title: "Articles Manager", href: "/articles", icon: FileText },
      { title: "Sheikh Media", href: "/sheikh-media", icon: Video },
    ],
  },
  {
    section: "Administration & Users",
    items: [
      { title: "User Management", href: "/users", icon: Users },
      { title: "Subscription Plans", href: "/subscriptions/plans", icon: CreditCard },
      { title: "Premium Benefits", href: "/subscriptions/benefits", icon: ListOrdered },
      { title: "Reports & Analytics", href: "/reports", icon: BarChart2 },
      { title: "Push Notifications", href: "/notifications", icon: Bell },
    ],
  },
];

export function Sidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const dispatch = useDispatch();
  const userState = useSelector(selectUser);
  const { data: profileRes } = useGetProfileQuery();

  const profile = profileRes?.data;
  const role = userState?.user?.role || profile?.role || "admin";
  const email = profile?.email || "admin@quraninternational.com";
  const name = profile?.name || role;

  const handleLogout = () => {
    dispatch(removeUser());
    router.push("/login");
  };

  return (
    <div className="flex h-[calc(100vh-32px)] w-72 flex-col bg-white rounded-3xl shadow-sm border border-slate-200/90 overflow-hidden">
      {/* Brand Header */}
      <div className="py-5 px-6 border-b border-slate-100 flex items-center gap-3">
        <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-emerald-800 to-emerald-950 flex items-center justify-center text-white font-bold text-lg shadow-sm">
          QI
        </div>
        <div>
          <span className="font-extrabold text-slate-900 tracking-tight block text-base leading-tight">
            Quran International
          </span>
          <span className="text-[11px] text-emerald-700 font-semibold tracking-wider uppercase">
            Global Admin Console
          </span>
        </div>
      </div>

      {/* Categorized Nav Groups */}
      <nav className="flex-1 space-y-5 p-4 overflow-y-auto">
        {navGroups.map((group) => (
          <div key={group.section} className="space-y-1">
            <div className="px-3 pb-1 text-[11px] font-bold text-slate-400 uppercase tracking-wider">
              {group.section}
            </div>

            {group.items.map((item) => {
              const isActive =
                item.href === "/"
                  ? pathname === "/"
                  : pathname === item.href || pathname.startsWith(`${item.href}/`);

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cn(
                    "flex items-center justify-between rounded-xl px-3.5 py-2.5 text-xs font-semibold transition-all cursor-pointer group",
                    isActive
                      ? "bg-emerald-900 text-white shadow-sm"
                      : "text-slate-600 hover:bg-slate-100 hover:text-slate-900",
                  )}
                >
                  <div className="flex items-center gap-2.5">
                    <item.icon
                      className={cn(
                        "h-4 w-4 transition-transform group-hover:scale-110",
                        isActive ? "text-white" : "text-slate-400 group-hover:text-slate-700",
                      )}
                    />
                    <span>{item.title}</span>
                  </div>

                  {item.badge && (
                    <span
                      className={cn(
                        "text-[10px] font-bold px-1.5 py-0.5 rounded-md text-white shadow-2xs",
                        isActive ? "bg-white/20 text-white" : item.badgeColor || "bg-slate-400"
                      )}
                    >
                      {item.badge}
                    </span>
                  )}
                </Link>
              );
            })}
          </div>
        ))}
      </nav>

      {/* User Card & Logout */}
      <div className="p-4 border-t border-slate-100 bg-slate-50/70 space-y-3">
        <div className="flex items-center gap-3">
          <div className="h-9 w-9 overflow-hidden rounded-xl bg-emerald-100 border border-emerald-200">
            <img
              src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(email)}`}
              alt={name}
              className="h-full w-full object-cover"
            />
          </div>
          <div className="flex flex-col min-w-0 flex-1">
            <span className="text-xs font-bold text-slate-800 capitalize truncate">
              {name}
            </span>
            <span className="text-[11px] text-slate-400 truncate">{email}</span>
          </div>
          <button
            type="button"
            onClick={handleLogout}
            title="Log Out"
            className="p-1.5 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors cursor-pointer"
          >
            <LogOut className="h-4 w-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
