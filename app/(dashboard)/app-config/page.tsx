"use client";

import React, { useState, useEffect } from "react";
import {
  Settings,
  Image as ImageIcon,
  AlertTriangle,
  Bell,
  Sliders,
  Plus,
  Trash2,
  Save,
  ExternalLink,
  ShieldAlert,
  Smartphone,
  CheckCircle2,
} from "lucide-react";
import { toast } from "sonner";
import {
  useGetAppConfigQuery,
  useUpdateAppConfigMutation,
  IBanner,
} from "@/redux/features/app-config/appConfigApi";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

export default function AppConfigPage() {
  const { data: configRes, isLoading, refetch } = useGetAppConfigQuery();
  const [updateConfig, { isLoading: isSaving }] = useUpdateAppConfigMutation();

  const [banners, setBanners] = useState<IBanner[]>([]);
  const [maintenanceEnabled, setMaintenanceEnabled] = useState(false);
  const [maintenanceMessage, setMaintenanceMessage] = useState("");
  const [minAppVersion, setMinAppVersion] = useState("1.0.0");

  const [reminderEnabled, setReminderEnabled] = useState(true);
  const [reminderMessage, setReminderMessage] = useState("");
  const [reminderTime, setReminderTime] = useState("09:00");

  const [premiumEnabled, setPremiumEnabled] = useState(true);
  const [audioStreamingEnabled, setAudioStreamingEnabled] = useState(true);
  const [aiChatEnabled, setAiChatEnabled] = useState(false);

  // New banner modal state
  const [isBannerModalOpen, setIsBannerModalOpen] = useState(false);
  const [newBannerTitle, setNewBannerTitle] = useState("");
  const [newBannerImageUrl, setNewBannerImageUrl] = useState("");
  const [newBannerActionUrl, setNewBannerActionUrl] = useState("");

  useEffect(() => {
    if (configRes?.data) {
      const cfg = configRes.data;
      setBanners(cfg.banners || []);
      setMaintenanceEnabled(cfg.maintenanceMode?.isEnabled || false);
      setMaintenanceMessage(cfg.maintenanceMode?.message || "");
      setMinAppVersion(cfg.maintenanceMode?.minAppVersion || "1.0.0");

      setReminderEnabled(cfg.dailyReminder?.isEnabled ?? true);
      setReminderMessage(cfg.dailyReminder?.message || "");
      setReminderTime(cfg.dailyReminder?.time || "09:00");

      setPremiumEnabled(cfg.featureFlags?.premiumEnabled ?? true);
      setAudioStreamingEnabled(cfg.featureFlags?.audioStreamingEnabled ?? true);
      setAiChatEnabled(cfg.featureFlags?.aiChatEnabled ?? false);
    }
  }, [configRes]);

  const handleSaveAll = async () => {
    try {
      await updateConfig({
        banners,
        maintenanceMode: {
          isEnabled: maintenanceEnabled,
          message: maintenanceMessage,
          minAppVersion,
        },
        dailyReminder: {
          isEnabled: reminderEnabled,
          message: reminderMessage,
          time: reminderTime,
        },
        featureFlags: {
          premiumEnabled,
          audioStreamingEnabled,
          aiChatEnabled,
        },
      }).unwrap();
      toast.success("App configuration saved and pushed to mobile app!");
      refetch();
    } catch (err: any) {
      toast.error(err?.data?.message || "Failed to save configuration");
    }
  };

  const handleAddBanner = () => {
    if (!newBannerTitle || !newBannerImageUrl) {
      toast.error("Banner title and image URL are required.");
      return;
    }

    const newBanner: IBanner = {
      id: `banner_${Date.now()}`,
      title: newBannerTitle,
      imageUrl: newBannerImageUrl,
      actionUrl: newBannerActionUrl,
      isActive: true,
      order: banners.length + 1,
    };

    setBanners([...banners, newBanner]);
    setNewBannerTitle("");
    setNewBannerImageUrl("");
    setNewBannerActionUrl("");
    setIsBannerModalOpen(false);
    toast.success("Banner added to list. Click 'Save Changes' to publish.");
  };

  const handleDeleteBanner = (id: string) => {
    setBanners(banners.filter((b) => b.id !== id));
  };

  const handleToggleBanner = (id: string) => {
    setBanners(
      banners.map((b) => (b.id === id ? { ...b, isActive: !b.isActive } : b))
    );
  };

  const activeBanners = banners.filter((b) => b.isActive);

  return (
    <div className="p-8 space-y-8 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-3">
            <div className="p-3 bg-gradient-to-br from-slate-800 to-slate-950 rounded-2xl text-white shadow-sm">
              <Settings className="h-7 w-7" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-slate-900 tracking-tight">
                App Config &amp; Banners
              </h1>
              <p className="text-sm text-slate-500">
                Control mobile home screen banners, emergency maintenance mode, and feature flags in real-time
              </p>
            </div>
          </div>
        </div>

        <Button
          onClick={handleSaveAll}
          disabled={isSaving || isLoading}
          className="bg-emerald-900 hover:bg-emerald-800 text-white flex items-center gap-2 rounded-xl shadow px-6 cursor-pointer"
        >
          <Save className="h-4 w-4" />
          {isSaving ? "Saving..." : "Save All Changes"}
        </Button>
      </div>

      {/* Maintenance Mode Alert Banner if active */}
      {maintenanceEnabled && (
        <div className="p-4 bg-amber-500/15 border-2 border-amber-500 rounded-2xl flex items-center gap-4 text-amber-900 animate-pulse">
          <ShieldAlert className="h-8 w-8 text-amber-600 flex-shrink-0" />
          <div>
            <h3 className="font-bold text-sm">Emergency Maintenance Mode is currently ACTIVE</h3>
            <p className="text-xs text-amber-800 mt-0.5">
              Mobile app users will be blocked by a maintenance screen displaying your custom message until toggled off.
            </p>
          </div>
        </div>
      )}

      {/* Grid: Main Config on Left + Live Mobile Simulator on Right */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Column (8 cols): Banners & Controls */}
        <div className="lg:col-span-8 space-y-6">
          {/* Banners List */}
          <Card className="rounded-2xl border-slate-200/90 shadow-sm overflow-hidden">
            <CardHeader className="border-b border-slate-100 flex flex-row items-center justify-between">
              <div>
                <CardTitle className="text-lg font-bold flex items-center gap-2">
                  <ImageIcon className="h-5 w-5 text-emerald-800" />
                  Mobile App Home Screen Banners
                </CardTitle>
                <CardDescription>
                  Carousel banners displayed at the top of the mobile app home screen
                </CardDescription>
              </div>

              <Button
                size="sm"
                onClick={() => setIsBannerModalOpen(true)}
                className="bg-emerald-900 hover:bg-emerald-800 text-white rounded-xl text-xs flex items-center gap-2 cursor-pointer"
              >
                <Plus className="h-3.5 w-3.5" />
                Add Banner
              </Button>
            </CardHeader>

            <CardContent className="p-6">
              {banners.length === 0 ? (
                <div className="p-12 text-center text-slate-400">
                  <ImageIcon className="h-10 w-10 mx-auto text-slate-300 mb-2" />
                  <p className="text-sm font-medium">No banners configured</p>
                  <p className="text-xs mt-1">Add banners to promote events, new reciters, or donations.</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {banners.map((b) => (
                    <div
                      key={b.id}
                      className="rounded-xl border border-slate-200 overflow-hidden bg-white shadow-sm flex flex-col justify-between"
                    >
                      <div className="relative h-36 bg-slate-100">
                        <img
                          src={b.imageUrl}
                          alt={b.title}
                          className="w-full h-full object-cover"
                          onError={(e) => {
                            (e.target as HTMLImageElement).src =
                              "https://images.unsplash.com/photo-1542816417-0983c9c9ad53?auto=format&fit=crop&w=600&q=80";
                          }}
                        />
                        <div className="absolute top-2 right-2">
                          <Badge className={b.isActive ? "bg-emerald-600 text-white" : "bg-slate-400 text-white"}>
                            {b.isActive ? "Active" : "Disabled"}
                          </Badge>
                        </div>
                      </div>

                      <div className="p-3.5 space-y-2.5">
                        <h4 className="font-bold text-slate-800 text-xs line-clamp-1">{b.title}</h4>
                        {b.actionUrl && (
                          <p className="text-[11px] text-blue-600 font-mono truncate flex items-center gap-1">
                            <ExternalLink className="h-3 w-3" /> {b.actionUrl}
                          </p>
                        )}

                        <div className="pt-2 border-t border-slate-100 flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <span className="text-xs text-slate-500">Show on App:</span>
                            <Switch checked={b.isActive} onCheckedChange={() => handleToggleBanner(b.id)} />
                          </div>

                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleDeleteBanner(b.id)}
                            className="h-7 w-7 p-0 text-slate-400 hover:text-red-600 rounded-lg cursor-pointer"
                          >
                            <Trash2 className="h-3.5 w-3.5" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>

          {/* Maintenance Mode & Daily Reminder */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {/* Maintenance Mode */}
            <Card className="rounded-2xl border-slate-200/90 shadow-sm">
              <CardHeader>
                <CardTitle className="text-base font-bold flex items-center gap-2">
                  <AlertTriangle className="h-5 w-5 text-amber-600" />
                  Maintenance Mode
                </CardTitle>
                <CardDescription>
                  Temporarily shut down mobile client access during server migrations
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between p-3 bg-slate-50 rounded-xl">
                  <div>
                    <span className="text-xs font-semibold text-slate-800 block">Enable Emergency Lock</span>
                    <span className="text-[11px] text-slate-500">Blocks non-admin app requests</span>
                  </div>
                  <Switch checked={maintenanceEnabled} onCheckedChange={setMaintenanceEnabled} />
                </div>

                <div>
                  <label className="text-xs font-semibold text-slate-600 block mb-1">Maintenance Notice Message</label>
                  <textarea
                    rows={3}
                    value={maintenanceMessage}
                    onChange={(e) => setMaintenanceMessage(e.target.value)}
                    placeholder="We are currently performing scheduled maintenance..."
                    className="w-full p-3 text-xs rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-900"
                  />
                </div>

                <div>
                  <label className="text-xs font-semibold text-slate-600 block mb-1">Minimum Supported App Version</label>
                  <Input
                    type="text"
                    value={minAppVersion}
                    onChange={(e) => setMinAppVersion(e.target.value)}
                    placeholder="1.0.0"
                    className="rounded-xl text-xs"
                  />
                </div>
              </CardContent>
            </Card>

            {/* Daily Reminder */}
            <Card className="rounded-2xl border-slate-200/90 shadow-sm">
              <CardHeader>
                <CardTitle className="text-base font-bold flex items-center gap-2">
                  <Bell className="h-5 w-5 text-blue-600" />
                  Daily Reminder Message
                </CardTitle>
                <CardDescription>
                  Automatic reminder notification configured across mobile installs
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between p-3 bg-slate-50 rounded-xl">
                  <div>
                    <span className="text-xs font-semibold text-slate-800 block">Enable Daily Notification</span>
                    <span className="text-[11px] text-slate-500">Scheduled local or push reminder</span>
                  </div>
                  <Switch checked={reminderEnabled} onCheckedChange={setReminderEnabled} />
                </div>

                <div>
                  <label className="text-xs font-semibold text-slate-600 block mb-1">Daily Message Prompt</label>
                  <textarea
                    rows={3}
                    value={reminderMessage}
                    onChange={(e) => setReminderMessage(e.target.value)}
                    placeholder="Have you recited your Quran verses today?..."
                    className="w-full p-3 text-xs rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-900"
                  />
                </div>

                <div>
                  <label className="text-xs font-semibold text-slate-600 block mb-1">Scheduled Time (24-hour)</label>
                  <Input
                    type="time"
                    value={reminderTime}
                    onChange={(e) => setReminderTime(e.target.value)}
                    className="rounded-xl text-xs w-36"
                  />
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Feature Flags */}
          <Card className="rounded-2xl border-slate-200/90 shadow-sm">
            <CardHeader>
              <CardTitle className="text-base font-bold flex items-center gap-2">
                <Sliders className="h-5 w-5 text-purple-600" />
                App Feature Flags
              </CardTitle>
              <CardDescription>
                Remotely toggle mobile application capabilities on the fly
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="p-3.5 bg-slate-50 rounded-xl flex items-center justify-between">
                  <div>
                    <span className="text-xs font-semibold text-slate-800 block">Premium Paywall</span>
                    <span className="text-[10px] text-slate-500">Stripe &amp; IAP paywall</span>
                  </div>
                  <Switch checked={premiumEnabled} onCheckedChange={setPremiumEnabled} />
                </div>

                <div className="p-3.5 bg-slate-50 rounded-xl flex items-center justify-between">
                  <div>
                    <span className="text-xs font-semibold text-slate-800 block">Sheikh Audio</span>
                    <span className="text-[10px] text-slate-500">Live streaming audio</span>
                  </div>
                  <Switch checked={audioStreamingEnabled} onCheckedChange={setAudioStreamingEnabled} />
                </div>

                <div className="p-3.5 bg-slate-50 rounded-xl flex items-center justify-between">
                  <div>
                    <span className="text-xs font-semibold text-slate-800 block">AI Islamic Chat</span>
                    <span className="text-[10px] text-slate-500">Assistant feature</span>
                  </div>
                  <Switch checked={aiChatEnabled} onCheckedChange={setAiChatEnabled} />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Right Column (4 cols): Live Mobile App Phone Simulator */}
        <div className="lg:col-span-4 sticky top-20">
          <div className="bg-slate-900 p-4 rounded-[40px] shadow-2xl border-4 border-slate-800 max-w-[320px] mx-auto text-white">
            {/* Phone Top Notch */}
            <div className="flex items-center justify-between px-4 pb-2 text-[10px] text-slate-400 font-semibold border-b border-slate-800">
              <span>9:41</span>
              <div className="w-16 h-3 bg-slate-800 rounded-full mx-auto" />
              <span>5G 100%</span>
            </div>

            {/* Mobile Screen Body */}
            <div className="p-3 space-y-4 bg-slate-950 rounded-[28px] overflow-hidden min-h-[500px] flex flex-col justify-between">
              <div>
                {/* Mobile App Header */}
                <div className="flex items-center justify-between pt-2 pb-3">
                  <div>
                    <span className="text-[10px] text-emerald-400 font-bold block uppercase tracking-wider">
                      Quran International
                    </span>
                    <span className="text-xs font-bold text-white">Assalamu Alaikum</span>
                  </div>
                  <div className="w-6 h-6 rounded-full bg-emerald-900 text-[10px] flex items-center justify-center font-bold text-white">
                    QI
                  </div>
                </div>

                {/* Maintenance Screen in Simulator if on */}
                {maintenanceEnabled ? (
                  <div className="p-4 bg-amber-950/70 border border-amber-500/50 rounded-2xl text-center space-y-2 my-4">
                    <ShieldAlert className="h-7 w-7 text-amber-400 mx-auto" />
                    <p className="text-xs font-bold text-amber-200">Scheduled Maintenance</p>
                    <p className="text-[10px] text-amber-300 leading-relaxed">
                      {maintenanceMessage || "The app is temporarily under maintenance."}
                    </p>
                  </div>
                ) : (
                  <>
                    {/* Simulator Live Banner Carousel */}
                    <div className="space-y-1.5">
                      <span className="text-[10px] text-slate-400 font-semibold block uppercase">
                        Live Carousel Banner
                      </span>

                      {activeBanners.length > 0 ? (
                        <div className="rounded-2xl overflow-hidden relative h-36 bg-slate-800 border border-slate-700">
                          <img
                            src={activeBanners[0].imageUrl}
                            alt="Preview"
                            className="w-full h-full object-cover"
                            onError={(e) => {
                              (e.target as HTMLImageElement).src =
                                "https://images.unsplash.com/photo-1542816417-0983c9c9ad53?auto=format&fit=crop&w=600&q=80";
                            }}
                          />
                          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent flex items-end p-3">
                            <p className="text-xs font-bold text-white line-clamp-2">
                              {activeBanners[0].title}
                            </p>
                          </div>
                        </div>
                      ) : (
                        <div className="h-32 rounded-2xl bg-slate-800/80 border border-dashed border-slate-700 flex items-center justify-center text-[11px] text-slate-400">
                          No active banners
                        </div>
                      )}
                    </div>

                    {/* Simulator Quick Features */}
                    <div className="grid grid-cols-4 gap-2 pt-3">
                      {["Surah", "Hadith", "Duas", "Library"].map((f) => (
                        <div
                          key={f}
                          className="p-2 bg-slate-900 rounded-xl text-center border border-slate-800 text-[10px] font-semibold text-slate-300"
                        >
                          {f}
                        </div>
                      ))}
                    </div>
                  </>
                )}
              </div>

              {/* Mobile Simulator Bottom Nav */}
              <div className="pt-2 border-t border-slate-800 flex items-center justify-around text-[10px] text-slate-500">
                <span className="text-emerald-400 font-bold">Home</span>
                <span>Quran</span>
                <span>Audio</span>
                <span>Profile</span>
              </div>
            </div>

            <div className="text-center pt-2">
              <span className="text-[10px] text-slate-500 flex items-center justify-center gap-1">
                <Smartphone className="h-3 w-3" /> Live Mobile Client Preview
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Add Banner Modal */}
      <Dialog open={isBannerModalOpen} onOpenChange={setIsBannerModalOpen}>
        <DialogContent className="sm:max-w-md rounded-2xl">
          <DialogHeader>
            <DialogTitle className="text-xl font-bold flex items-center gap-2">
              <ImageIcon className="h-5 w-5 text-emerald-800" />
              Add Home Screen Banner
            </DialogTitle>
            <DialogDescription>
              Specify a public image URL and optional action deep link for the carousel banner.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-2">
            <div>
              <label className="text-xs font-semibold text-slate-600 block mb-1">Banner Title</label>
              <Input
                type="text"
                placeholder="e.g. Ramadan Mubarak — Listen to Quran"
                value={newBannerTitle}
                onChange={(e) => setNewBannerTitle(e.target.value)}
                className="rounded-xl text-sm"
              />
            </div>

            <div>
              <label className="text-xs font-semibold text-slate-600 block mb-1">Image URL (High Resolution)</label>
              <Input
                type="text"
                placeholder="https://images.unsplash.com/..."
                value={newBannerImageUrl}
                onChange={(e) => setNewBannerImageUrl(e.target.value)}
                className="rounded-xl text-sm"
              />
            </div>

            <div>
              <label className="text-xs font-semibold text-slate-600 block mb-1">Action URL / Deep Link (Optional)</label>
              <Input
                type="text"
                placeholder="quraninternational://surah/18 or https://..."
                value={newBannerActionUrl}
                onChange={(e) => setNewBannerActionUrl(e.target.value)}
                className="rounded-xl text-sm"
              />
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setIsBannerModalOpen(false)} className="rounded-xl cursor-pointer">
              Cancel
            </Button>
            <Button
              onClick={handleAddBanner}
              className="bg-emerald-900 hover:bg-emerald-800 text-white rounded-xl shadow cursor-pointer"
            >
              Add Banner
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
