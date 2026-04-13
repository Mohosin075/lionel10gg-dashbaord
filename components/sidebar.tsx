"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import { LayoutDashboard, Users, FileText, Bell, BarChart2, Globe, LogOut } from "lucide-react"

const navItems = [
  { title: "Dashboard", href: "/", icon: LayoutDashboard },
  { title: "User Management", href: "/users", icon: Users },
  { title: "Content Management", href: "/content", icon: FileText },
  { title: "Push Notifications", href: "/notifications", icon: Bell },
  { title: "Reports", href: "/reports", icon: BarChart2 },
  { title: "Language Settings", href: "/languages", icon: Globe },
]

export function Sidebar() {
  const pathname = usePathname()

  return (
    <div className="flex h-screen w-64 flex-col border-r bg-white">
      <div className="p-6">
        <h1 className="text-2xl font-bold tracking-tight text-emerald-900 leading-tight">QURAN</h1>
        <h2 className="text-[10px] font-bold tracking-[0.2em] text-emerald-800">INTERNATIONAL</h2>
      </div>

      <nav className="flex-1 space-y-1 p-4">
        {navItems.map((item) => {
          const isActive = pathname === item.href
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex items-center gap-3 rounded-full px-4 py-3 text-sm font-medium transition-colors cursor-pointer",
                isActive
                  ? "bg-emerald-900 text-white"
                  : "text-slate-500 hover:bg-slate-100"
              )}
            >
              <item.icon className={cn("h-5 w-5", isActive ? "text-white" : "text-slate-400")} />
              {item.title}
            </Link>
          )
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
  )
}
