"use client";

import React, { useState, useEffect, useMemo } from "react";
import Link from "next/link";
import {
  ShieldCheck,
  Calendar,
  Clock,
  Printer,
  Share2,
  Check,
  ChevronRight,
  Trash2,
  Mail,
  ExternalLink,
  BookOpen,
  ArrowUp,
  Globe,
  ChevronDown,
  Sparkles,
  Smartphone,
  Lock,
  FileCheck2,
} from "lucide-react";
import { toast } from "sonner";
import { POLICY_DEFINITIONS, PolicyDefinition } from "@/lib/policyTemplates";

const HEADER_NAV_ITEMS = [
  { type: "privacy-policy", label: "Privacy Policy", shortLabel: "Privacy" },
  { type: "terms-and-conditions", label: "Terms of Service", shortLabel: "Terms" },
  { type: "data-deletion", label: "Data Deletion", shortLabel: "Data Deletion" },
  { type: "disclaimer", label: "Disclaimer", shortLabel: "Disclaimer" },
  { type: "refund-policy", label: "Refunds", shortLabel: "Refund Policy" },
  { type: "contact", label: "Support", shortLabel: "Support" },
];

interface Props {
  policy: {
    title: string;
    content: string;
    type: string;
    lastUpdated: string;
    isDefault: boolean;
    category: string;
  };
  slug: string;
}

export default function PublicPolicyClient({ policy, slug }: Props) {
  const [copied, setCopied] = useState(false);
  const [activeSection, setActiveSection] = useState<string>("");
  const [showScrollTop, setShowScrollTop] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Parse Table of Contents and inject IDs into H2 elements
  const { toc, processedContent } = useMemo(() => {
    const headings: { id: string; text: string }[] = [];
    let counter = 0;

    const modified = policy.content.replace(
      /<h2([^>]*)>(.*?)<\/h2>/gi,
      (match, attrs, content) => {
        counter++;
        const text = content.replace(/<[^>]*>/g, "").trim();
        const id =
          text
            .toLowerCase()
            .replace(/[^a-z0-9]+/g, "-")
            .replace(/(^-|-$)/g, "") || `section-${counter}`;

        headings.push({ id, text });
        return `<h2 id="${id}" class="scroll-mt-28"${attrs}>${content}</h2>`;
      }
    );

    return { toc: headings, processedContent: modified };
  }, [policy.content]);

  // Track scroll position for Table of Contents and Back-to-top
  useEffect(() => {
    const handleScroll = () => {
      setShowScrollTop(window.scrollY > 400);

      if (toc.length > 0) {
        const scrollPosition = window.scrollY + 160;
        for (let i = toc.length - 1; i >= 0; i--) {
          const el = document.getElementById(toc[i].id);
          if (el && el.offsetTop <= scrollPosition) {
            setActiveSection(toc[i].id);
            return;
          }
        }
        setActiveSection(toc[0].id);
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, [toc]);

  const handlePrint = () => {
    window.print();
  };

  const handleShare = async () => {
    const url = window.location.href;
    try {
      if (navigator.share) {
        await navigator.share({
          title: `${policy.title} - Quran International`,
          url,
        });
      } else {
        await navigator.clipboard.writeText(url);
        setCopied(true);
        toast.success("Policy link copied to clipboard!");
        setTimeout(() => setCopied(false), 2000);
      }
    } catch {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      toast.success("Policy link copied to clipboard!");
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const formattedDate = new Date(policy.lastUpdated).toLocaleDateString(
    "en-US",
    {
      year: "numeric",
      month: "long",
      day: "numeric",
    }
  );

  const wordCount = useMemo(() => {
    const text = policy.content.replace(/<[^>]*>/g, " ").trim();
    return text ? text.split(/\s+/).length : 0;
  }, [policy.content]);

  const readingTimeMinutes = Math.max(1, Math.ceil(wordCount / 200));

  const isDeletionPolicy =
    slug === "data-deletion" || slug === "account-deletion";

  return (
    <div className="min-h-screen bg-[#f8fafc] text-slate-800 font-sans selection:bg-emerald-100 selection:text-emerald-950 flex flex-col">
      {/* Top Accent Gradient Ribbon */}
      <div className="h-1 w-full bg-gradient-to-r from-emerald-800 via-teal-500 to-emerald-700" />

      {/* Header - Expansive, Clean, Frosted Glass */}
      <header className="sticky top-0 z-50 bg-white/90 backdrop-blur-xl border-b border-slate-200/80 shadow-xs transition-all">
        <div className="max-w-[1536px] w-full mx-auto px-4 sm:px-6 lg:px-10 h-18 flex items-center justify-between gap-6">
          {/* Brand & Badge */}
          <Link href="/" className="flex items-center gap-3.5 group shrink-0">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-emerald-800 via-emerald-900 to-slate-950 flex items-center justify-center text-white font-black text-sm shadow-md ring-1 ring-emerald-500/20 group-hover:scale-105 transition-all">
              QI
            </div>
            <div className="flex flex-col">
              <div className="flex items-center gap-2">
                <span className="font-black text-slate-950 tracking-tight text-base sm:text-lg group-hover:text-emerald-900 transition-colors">
                  Quran International
                </span>
                <span className="hidden sm:inline-flex items-center px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-800 text-[10px] font-bold border border-emerald-200/80 uppercase tracking-wider">
                  Legal
                </span>
              </div>
              <span className="text-[11px] text-slate-500 font-medium tracking-wide">
                Official Compliance &amp; Policy Portal
              </span>
            </div>
          </Link>

          {/* Clean Desktop Navigation (No Clunky Containers) */}
          <nav className="hidden lg:flex items-center gap-1">
            {HEADER_NAV_ITEMS.map((item) => {
              const isCurrent =
                item.type === slug ||
                (slug.includes("terms") && item.type.includes("terms")) ||
                (slug.includes("deletion") && item.type.includes("deletion"));

              return (
                <Link
                  key={item.type}
                  href={`/policies/${item.type}`}
                  className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all ${
                    isCurrent
                      ? "bg-emerald-900 text-white shadow-xs"
                      : "text-slate-600 hover:text-slate-950 hover:bg-slate-100/80"
                  }`}
                >
                  {item.label}
                </Link>
              );
            })}
          </nav>

          {/* Action Toolbar on the Right */}
          <div className="flex items-center gap-2 shrink-0">
            <button
              type="button"
              onClick={handlePrint}
              className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-bold text-slate-700 bg-slate-100 hover:bg-slate-200/80 transition cursor-pointer"
              title="Print Document or Save as PDF"
            >
              <Printer className="w-3.5 h-3.5 text-slate-600" />
              <span className="hidden sm:inline">Print / PDF</span>
            </button>

            <button
              type="button"
              onClick={handleShare}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold text-slate-700 bg-slate-100 hover:bg-slate-200/80 transition cursor-pointer"
              title="Copy Public Link or Share"
            >
              {copied ? (
                <>
                  <Check className="w-3.5 h-3.5 text-emerald-600" />
                  <span className="text-emerald-700">Copied!</span>
                </>
              ) : (
                <>
                  <Share2 className="w-3.5 h-3.5 text-slate-600" />
                  <span className="hidden sm:inline">Share</span>
                </>
              )}
            </button>

            <Link
              href="/policies/contact"
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-extrabold text-white bg-emerald-900 hover:bg-emerald-800 shadow-sm transition"
            >
              <span>Support Desk</span>
            </Link>

            {/* Mobile Menu Dropdown Toggle */}
            <button
              type="button"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden p-2 rounded-xl text-slate-700 hover:bg-slate-100 transition cursor-pointer"
              aria-label="Toggle navigation"
            >
              <ChevronDown
                className={`w-4 h-4 transition-transform ${
                  mobileMenuOpen ? "rotate-180" : ""
                }`}
              />
            </button>
          </div>
        </div>

        {/* Mobile Dropdown Menu */}
        {mobileMenuOpen && (
          <div className="lg:hidden bg-white border-b border-slate-200 px-4 py-3 space-y-1 text-xs font-bold">
            {HEADER_NAV_ITEMS.map((item) => (
              <Link
                key={item.type}
                href={`/policies/${item.type}`}
                onClick={() => setMobileMenuOpen(false)}
                className={`block px-3 py-2 rounded-xl ${
                  item.type === slug
                    ? "bg-emerald-900 text-white"
                    : "text-slate-700 hover:bg-slate-100"
                }`}
              >
                {item.label}
              </Link>
            ))}
          </div>
        )}
      </header>

      {/* Hero Banner Section - Expansive Width */}
      <section className="bg-gradient-to-br from-slate-950 via-emerald-950 to-slate-900 text-white border-b border-emerald-900/50 relative overflow-hidden">
        {/* Subtle geometric star pattern */}
        <div
          className="absolute inset-0 opacity-[0.05] pointer-events-none"
          style={{
            backgroundImage: `radial-gradient(#10b981 1.5px, transparent 1.5px), radial-gradient(#10b981 1.5px, #022c22 1.5px)`,
            backgroundSize: "32px 32px",
            backgroundPosition: "0 0, 16px 16px",
          }}
        />
        <div className="absolute right-0 top-0 w-[500px] h-[500px] bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="max-w-[1536px] w-full mx-auto px-4 sm:px-6 lg:px-10 py-12 sm:py-16 relative z-10 space-y-4">
          {/* Breadcrumb row */}
          <div className="flex flex-wrap items-center gap-2 text-xs text-emerald-300 font-semibold">
            <Link href="/" className="hover:underline text-emerald-200">
              Home
            </Link>
            <span>/</span>
            <span className="text-emerald-400">Legal Documentation</span>
            <span>/</span>
            <span className="text-white font-bold">{policy.title}</span>
          </div>

          <div className="flex flex-wrap items-center gap-2.5 pt-1">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-300 text-xs font-bold border border-emerald-500/30">
              <ShieldCheck className="w-3.5 h-3.5" />
              {policy.category || "Official App Compliance Policy"}
            </span>
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/10 text-slate-200 text-xs font-medium">
              <Globe className="w-3.5 h-3.5 text-emerald-400" />
              Verified Global Standard
            </span>
          </div>

          <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black tracking-tight text-white max-w-5xl leading-[1.15]">
            {policy.title}
          </h1>

          <div className="flex flex-wrap items-center gap-x-6 gap-y-2 text-xs sm:text-sm text-emerald-100/80 pt-3 border-t border-white/10">
            <div className="flex items-center gap-1.5">
              <Calendar className="w-4 h-4 text-emerald-400" />
              <span>
                Effective Date: <strong>{formattedDate}</strong>
              </span>
            </div>
            <div className="flex items-center gap-1.5">
              <Clock className="w-4 h-4 text-teal-400" />
              <span>
                ~{readingTimeMinutes} min read ({wordCount} words)
              </span>
            </div>
            <div className="flex items-center gap-1.5">
              <Smartphone className="w-4 h-4 text-emerald-300" />
              <span>Google Play Store &amp; Apple StoreKit Verified</span>
            </div>
          </div>
        </div>
      </section>

      {/* Main Expansive Layout (Width expanded to 1536px) */}
      <div className="flex-1 max-w-[1536px] w-full mx-auto px-4 sm:px-6 lg:px-10 py-10 sm:py-14">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 xl:gap-12 items-start">
          {/* Left Column: Table of Contents & Quick Selector */}
          <aside className="hidden lg:block lg:col-span-3 xl:col-span-3 sticky top-24 space-y-5">
            {/* Table of Contents */}
            {toc.length > 0 && (
              <div className="bg-white rounded-3xl p-6 border border-slate-200/90 shadow-sm space-y-3.5">
                <div className="flex items-center gap-2 pb-2.5 border-b border-slate-100 text-xs font-black text-slate-900 uppercase tracking-wider">
                  <BookOpen className="w-4 h-4 text-emerald-700" />
                  Table of Contents
                </div>
                <nav className="space-y-1 max-h-[calc(100vh-260px)] overflow-y-auto pr-1 text-xs">
                  {toc.map((item) => {
                    const isActive = activeSection === item.id;
                    return (
                      <a
                        key={item.id}
                        href={`#${item.id}`}
                        className={`block py-1.5 px-3 rounded-xl transition-all leading-snug cursor-pointer ${
                          isActive
                            ? "bg-emerald-50 text-emerald-950 font-bold border-l-2 border-emerald-700 pl-2.5"
                            : "text-slate-600 hover:text-slate-900 hover:bg-slate-50"
                        }`}
                      >
                        {item.text}
                      </a>
                    );
                  })}
                </nav>
              </div>
            )}

            {/* Quick Policies Switcher List */}
            <div className="bg-white rounded-3xl p-6 border border-slate-200/90 shadow-sm space-y-3">
              <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">
                All Legal Policies
              </span>
              <div className="space-y-1 text-xs">
                {POLICY_DEFINITIONS.map((def) => {
                  const isCurrent =
                    def.type === slug ||
                    (slug.includes("terms") && def.type.includes("terms")) ||
                    (slug.includes("deletion") && def.type.includes("deletion"));

                  return (
                    <Link
                      key={def.type}
                      href={`/policies/${def.type}`}
                      className={`flex items-center justify-between p-2.5 rounded-xl transition ${
                        isCurrent
                          ? "bg-emerald-900 text-white font-bold"
                          : "text-slate-600 hover:bg-slate-100 hover:text-slate-900"
                      }`}
                    >
                      <span className="truncate">{def.title}</span>
                      <ChevronRight
                        className={`w-3.5 h-3.5 shrink-0 ${
                          isCurrent ? "text-white" : "text-slate-400"
                        }`}
                      />
                    </Link>
                  );
                })}
              </div>
            </div>
          </aside>

          {/* Right Column: Expansive Document Content */}
          <main className="lg:col-span-9 xl:col-span-9 space-y-8">
            {/* Google Play Data Deletion Prominent Callout Card */}
            {isDeletionPolicy && (
              <div className="bg-gradient-to-br from-rose-50 via-white to-rose-50 border-2 border-rose-300 rounded-3xl p-6 sm:p-10 shadow-sm space-y-6">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-2xl bg-rose-600 text-white flex items-center justify-center shadow-md shrink-0">
                    <Trash2 className="w-6 h-6" />
                  </div>
                  <div>
                    <h2 className="text-xl sm:text-2xl font-black text-slate-950 tracking-tight">
                      Account &amp; Personal Data Deletion Request
                    </h2>
                    <p className="text-xs sm:text-sm text-rose-900 font-medium pt-0.5">
                      Compliant with Google Play Store Data Safety &amp; Apple App Store Guideline 5.1.1.
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* Method 1 */}
                  <div className="bg-white p-6 rounded-2xl border border-rose-200/90 shadow-xs space-y-2.5">
                    <div className="flex items-center gap-2 text-sm font-extrabold text-slate-950">
                      <span className="w-6 h-6 rounded-full bg-emerald-100 text-emerald-900 flex items-center justify-center text-xs font-black">
                        1
                      </span>
                      Instant In-App Deletion
                    </div>
                    <ol className="text-xs text-slate-600 space-y-2 list-decimal pl-5 leading-relaxed pt-1">
                      <li>Open the <strong>Quran International</strong> app on your device.</li>
                      <li>Navigate to <strong>Settings</strong> &gt; <strong>Profile</strong>.</li>
                      <li>Tap on <strong>Delete Account</strong>.</li>
                      <li>Confirm the prompt. Your account is erased immediately.</li>
                    </ol>
                  </div>

                  {/* Method 2 */}
                  <div className="bg-white p-6 rounded-2xl border border-rose-200/90 shadow-xs space-y-2.5 flex flex-col justify-between">
                    <div className="space-y-2">
                      <div className="flex items-center gap-2 text-sm font-extrabold text-slate-950">
                        <span className="w-6 h-6 rounded-full bg-rose-100 text-rose-900 flex items-center justify-center text-xs font-black">
                          2
                        </span>
                        Web / Email Request (Without App)
                      </div>
                      <p className="text-xs text-slate-600 leading-relaxed">
                        If you have uninstalled the app, email us from your registered address at{" "}
                        <strong className="text-slate-900">support@quraninternational.com</strong>{" "}
                        with subject <em>&quot;Account Deletion Request&quot;</em>.
                      </p>
                    </div>

                    <a
                      href="mailto:support@quraninternational.com?subject=Account%20Deletion%20Request&body=Hello%20Quran%20International%20Support,%0D%0A%0D%0APlease%20permanently%20delete%20my%20account%20and%20all%20associated%20data.%0D%0AMy%20registered%20email%20address%20is:%20"
                      className="inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-rose-600 hover:bg-rose-700 text-white text-xs font-extrabold shadow-sm transition mt-3 cursor-pointer"
                    >
                      <Mail className="w-4 h-4" />
                      Send Instant Deletion Email Request
                    </a>
                  </div>
                </div>

                <div className="p-4 bg-rose-100/70 rounded-2xl text-xs text-rose-950 flex items-start gap-3">
                  <span className="font-bold shrink-0">Erased Data:</span>
                  <span>
                    Your profile credentials, email, password hashes, Quran reading bookmarks, surah highlights, personal notes, and push notification device tokens are completely erased within 48 to 72 hours.
                  </span>
                </div>
              </div>
            )}

            {/* Document Article Card (Expansive, Generous Padding) */}
            <article className="bg-white rounded-3xl p-8 sm:p-12 lg:p-16 border border-slate-200/90 shadow-xs space-y-6">
              <div
                dangerouslySetInnerHTML={{ __html: processedContent }}
                className="policy-article-content space-y-6 text-slate-700 text-base sm:text-[17px] leading-[1.8]
                [&_h1]:text-3xl [&_h1]:sm:text-4xl [&_h1]:font-black [&_h1]:text-slate-950 [&_h1]:tracking-tight [&_h1]:mb-6
                [&_h2]:text-xl [&_h2]:sm:text-2xl [&_h2]:font-bold [&_h2]:text-slate-950 [&_h2]:mt-12 [&_h2]:mb-4 [&_h2]:pb-3 [&_h2]:border-b [&_h2]:border-slate-200/80 [&_h2]:tracking-tight
                [&_h3]:text-lg [&_h3]:font-bold [&_h3]:text-slate-900 [&_h3]:mt-8 [&_h3]:mb-2
                [&_p]:text-slate-600 [&_p]:leading-[1.8] [&_p]:mb-5
                [&_ul]:list-disc [&_ul]:pl-7 [&_ul]:space-y-2.5 [&_ul]:mb-6 [&_ul]:text-slate-600
                [&_ol]:list-decimal [&_ol]:pl-7 [&_ol]:space-y-2.5 [&_ol]:mb-6 [&_ol]:text-slate-600
                [&_li]:leading-[1.75]
                [&_strong]:text-slate-900 [&_strong]:font-bold
                [&_a]:text-emerald-700 [&_a]:underline [&_a]:underline-offset-4 [&_a]:font-semibold hover:[&_a]:text-emerald-950
                [&_blockquote]:border-l-4 [&_blockquote]:border-emerald-600 [&_blockquote]:bg-emerald-50/70 [&_blockquote]:p-5 [&_blockquote]:rounded-r-2xl [&_blockquote]:text-slate-800 [&_blockquote]:italic [&_blockquote]:my-6"
              />

              {/* End of Document Attestation Ribbon */}
              <div className="pt-10 mt-14 border-t border-slate-100 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 text-xs text-slate-500">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-emerald-100 text-emerald-800 flex items-center justify-center font-bold text-sm">
                    ✓
                  </div>
                  <div>
                    <span className="font-extrabold text-slate-900 block text-sm">
                      Officially Verified &amp; Active
                    </span>
                    <span>Quran International Legal &amp; Compliance Team</span>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={handleShare}
                    className="px-4 py-2 rounded-xl border border-slate-200 hover:bg-slate-50 text-slate-700 font-bold transition cursor-pointer"
                  >
                    Share Document
                  </button>
                  <button
                    type="button"
                    onClick={handlePrint}
                    className="px-4 py-2 rounded-xl border border-slate-200 hover:bg-slate-50 text-slate-700 font-bold transition cursor-pointer"
                  >
                    Print / PDF
                  </button>
                </div>
              </div>
            </article>

            {/* Need Assistance Card */}
            <div className="bg-gradient-to-r from-emerald-950 via-emerald-900 to-teal-950 text-white rounded-3xl p-8 sm:p-10 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6 shadow-md">
              <div className="space-y-1.5 max-w-2xl">
                <span className="text-xs text-emerald-400 font-bold uppercase tracking-wider">
                  Have inquiries or suggestions?
                </span>
                <h3 className="text-2xl font-black text-white">
                  We are here to support our global community
                </h3>
                <p className="text-xs sm:text-sm text-emerald-100/80 leading-relaxed">
                  Our compliance and developer teams review inquiries, translation feedback, and data requests within 24 to 48 hours.
                </p>
              </div>

              <Link
                href="/policies/contact"
                className="px-6 py-3 rounded-2xl bg-white text-emerald-950 font-extrabold text-xs shadow-md hover:bg-emerald-50 transition shrink-0"
              >
                Contact Support Team &rarr;
              </Link>
            </div>
          </main>
        </div>
      </div>

      {/* Floating Scroll to Top Button */}
      {showScrollTop && (
        <button
          type="button"
          onClick={scrollToTop}
          className="fixed bottom-8 right-8 z-50 w-12 h-12 rounded-2xl bg-emerald-900 text-white shadow-2xl flex items-center justify-center hover:bg-emerald-800 transition cursor-pointer"
          title="Back to Top"
        >
          <ArrowUp className="w-5 h-5" />
        </button>
      )}

      {/* Global Expansive Footer */}
      <footer className="bg-white border-t border-slate-200 py-12 px-4 mt-auto">
        <div className="max-w-[1536px] w-full mx-auto px-4 sm:px-6 lg:px-10 space-y-10">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="md:col-span-2 space-y-3">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-2xl bg-emerald-900 text-white flex items-center justify-center font-black text-sm">
                  QI
                </div>
                <span className="font-extrabold text-slate-900 text-lg">
                  Quran International
                </span>
              </div>
              <p className="text-xs sm:text-sm text-slate-500 max-w-md leading-relaxed">
                Dedicated to providing authentic, spiritually enriching, and technologically modern Islamic Quran recitations, prayer timings, and scholarly resources worldwide.
              </p>
              <div className="text-xs text-slate-400">
                Support:{" "}
                <a
                  href="mailto:support@quraninternational.com"
                  className="text-emerald-700 font-semibold underline"
                >
                  support@quraninternational.com
                </a>
              </div>
            </div>

            <div className="space-y-2.5">
              <span className="text-xs font-black text-slate-900 uppercase tracking-wider block">
                Store Compliance
              </span>
              <ul className="text-xs text-slate-600 space-y-2">
                <li>
                  <Link href="/policies/privacy-policy" className="hover:text-emerald-800">
                    Privacy Policy
                  </Link>
                </li>
                <li>
                  <Link href="/policies/terms-and-conditions" className="hover:text-emerald-800">
                    Terms &amp; Conditions
                  </Link>
                </li>
                <li>
                  <Link href="/policies/data-deletion" className="hover:text-emerald-800">
                    Account &amp; Data Deletion
                  </Link>
                </li>
              </ul>
            </div>

            <div className="space-y-2.5">
              <span className="text-xs font-black text-slate-900 uppercase tracking-wider block">
                Resources
              </span>
              <ul className="text-xs text-slate-600 space-y-2">
                <li>
                  <Link href="/policies/disclaimer" className="hover:text-emerald-800">
                    Content Disclaimer
                  </Link>
                </li>
                <li>
                  <Link href="/policies/refund-policy" className="hover:text-emerald-800">
                    Subscription &amp; Refunds
                  </Link>
                </li>
                <li>
                  <Link href="/policies/contact" className="hover:text-emerald-800">
                    Support Desk
                  </Link>
                </li>
              </ul>
            </div>
          </div>

          <div className="pt-8 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-400">
            <p>
              &copy; {new Date().getFullYear()} Quran International. All rights reserved.
            </p>
            <p className="flex items-center gap-3">
              <span>Google Play Store</span>
              <span>&bull;</span>
              <span>Apple App Store</span>
              <span>&bull;</span>
              <span>GDPR &amp; CCPA Ready</span>
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
