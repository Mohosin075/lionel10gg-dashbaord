"use client";

import React, { useState, useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";
import {
  Search,
  DownloadCloud,
  Languages,
  Calendar,
  Layers,
  ChevronRight,
  ShieldCheck,
  Sparkles,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";

const ROUTE_NAMES: Record<string, { title: string; section: string }> = {
  "/": { title: "Command Center", section: "Main" },
  "/offline-packs": { title: "Offline Pack Manager", section: "Publishing" },
  "/translations": { title: "109-Language Batch Translations", section: "AI Pipeline" },
  "/hadith": { title: "Hadith Collections Manager", section: "Islamic Content" },
  "/duas": { title: "Supplications & Duas Manager", section: "Islamic Content" },
  "/app-config": { title: "App Config & Banners", section: "Platform" },
  "/knowledge-library": { title: "Knowledge Library", section: "Islamic Content" },
  "/articles": { title: "Articles Manager", section: "Islamic Content" },
  "/sheikh-media": { title: "Sheikh Media Streams", section: "Islamic Content" },
  "/users": { title: "User Management", section: "Operations" },
  "/subscriptions/plans": { title: "Subscription Plans", section: "Operations" },
  "/subscriptions/benefits": { title: "Premium Benefits", section: "Operations" },
  "/reports": { title: "Analytics & Reports", section: "Operations" },
  "/notifications": { title: "Push Notifications", section: "Operations" },
};

export function TopNav() {
  const pathname = usePathname();
  const router = useRouter();
  const [currentDate, setCurrentDate] = useState("");
  const [isCommandOpen, setIsCommandOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    const d = new Date();
    setCurrentDate(
      d.toLocaleDateString("en-US", {
        weekday: "short",
        month: "short",
        day: "numeric",
        year: "numeric",
      })
    );
  }, []);

  const routeInfo = ROUTE_NAMES[pathname] || { title: "Dashboard", section: "Portal" };

  const quickNavItems = [
    { title: "Offline Pack Manager", href: "/offline-packs", icon: DownloadCloud, desc: "Generate & upload .json.gz to S3" },
    { title: "Batch Translations (109 Lng)", href: "/translations", icon: Languages, desc: "OpenAI gpt-4o-mini async batch translation" },
    { title: "Hadith Manager (8 Books)", href: "/hadith", icon: Layers, desc: "Bukhari, Muslim, and Sunan collections" },
    { title: "Dua Manager (Hisn al-Muslim)", href: "/duas", icon: Sparkles, desc: "Authentic supplications and daily duas" },
    { title: "Mobile App Banners & Config", href: "/app-config", icon: ShieldCheck, desc: "Home banners and maintenance mode" },
  ];

  const filteredItems = quickNavItems.filter((item) =>
    item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    item.desc.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <header className="sticky top-0 z-40 w-full bg-white/90 backdrop-blur-md border-b border-slate-200 px-8 py-3.5 flex items-center justify-between gap-4 transition-all">
      {/* Breadcrumb & Current Route */}
      <div className="flex items-center gap-2 text-sm text-slate-500">
        <span className="font-semibold text-slate-400">{routeInfo.section}</span>
        <ChevronRight className="h-4 w-4 text-slate-300" />
        <span className="font-bold text-slate-800 text-base">{routeInfo.title}</span>
      </div>

      {/* Center Search / Command Trigger */}
      <div className="hidden md:flex items-center gap-2 w-72 lg:w-96">
        <button
          type="button"
          onClick={() => setIsCommandOpen(true)}
          className="w-full flex items-center justify-between px-3.5 py-1.5 bg-slate-100/80 hover:bg-slate-100 rounded-xl text-slate-400 text-xs transition-colors border border-slate-200/60 cursor-pointer"
        >
          <div className="flex items-center gap-2">
            <Search className="h-3.5 w-3.5 text-slate-400" />
            <span>Quick jump to module or action...</span>
          </div>
          <kbd className="px-1.5 py-0.5 bg-white rounded border border-slate-200 text-[10px] font-mono text-slate-500 shadow-2xs">
            ⌘K
          </kbd>
        </button>
      </div>

      {/* Right Side: Status, Date, Quick Generate */}
      <div className="flex items-center gap-3">
        {/* Backend API Live Status */}
        <div className="hidden sm:flex items-center gap-1.5 px-3 py-1 bg-emerald-50 text-emerald-800 rounded-full text-xs font-semibold border border-emerald-200/70">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
          </span>
          API Live
        </div>

        {/* Date Display */}
        <div className="hidden lg:flex items-center gap-1.5 text-xs text-slate-500 font-medium px-2 py-1">
          <Calendar className="h-3.5 w-3.5 text-slate-400" />
          {currentDate}
        </div>

        {/* Quick Offline Pack Generator Shortcut */}
        <Button
          size="sm"
          onClick={() => router.push("/offline-packs")}
          className="bg-emerald-900 hover:bg-emerald-800 text-white rounded-xl text-xs font-semibold px-3.5 shadow flex items-center gap-1.5 cursor-pointer"
        >
          <DownloadCloud className="h-3.5 w-3.5" />
          <span className="hidden sm:inline">Packs</span>
        </Button>
      </div>

      {/* Quick Jump Command Dialog */}
      <Dialog open={isCommandOpen} onOpenChange={setIsCommandOpen}>
        <DialogContent className="sm:max-w-lg rounded-2xl p-0 overflow-hidden">
          <DialogHeader className="p-4 border-b border-slate-100">
            <DialogTitle className="flex items-center gap-2 text-base font-bold text-slate-800">
              <Search className="h-4 w-4 text-emerald-800" />
              Command Palette &amp; Quick Jump
            </DialogTitle>
          </DialogHeader>

          <div className="p-4 space-y-3">
            <input
              type="text"
              autoFocus
              placeholder="Type to search page, manager or action..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full px-4 py-2.5 text-sm rounded-xl bg-slate-50 border border-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-800"
            />

            <div className="space-y-1.5 pt-2 max-h-72 overflow-y-auto">
              {filteredItems.map((item) => (
                <button
                  key={item.href}
                  onClick={() => {
                    router.push(item.href);
                    setIsCommandOpen(false);
                  }}
                  className="w-full flex items-center gap-3 p-3 rounded-xl hover:bg-emerald-50/70 text-left transition-colors cursor-pointer group"
                >
                  <div className="p-2 rounded-lg bg-slate-100 group-hover:bg-emerald-100 text-slate-600 group-hover:text-emerald-900 transition-colors">
                    <item.icon className="h-4 w-4" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-slate-800 group-hover:text-emerald-950">
                      {item.title}
                    </p>
                    <p className="text-xs text-slate-400 truncate">{item.desc}</p>
                  </div>
                  <ChevronRight className="h-4 w-4 text-slate-300 group-hover:text-emerald-600" />
                </button>
              ))}
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </header>
  );
}
