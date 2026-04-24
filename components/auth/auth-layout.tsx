"use client";

import bgImg from "@/public/auth-bg.png";
import type { ReactNode } from "react";

interface AuthLayoutProps {
  children: ReactNode;
}
export function AuthLayout({ children }: AuthLayoutProps) {
  return (
    <div className="min-h-screen flex">
      <div className="flex-1 lg:w-1/2 flex items-center justify-center p-8">
        <div className="w-full max-w-lg ">
          {/* Logo */}
          {/* <div className="shrink-0">
            <Link href="/" className="lg:hidden">
              <Image
                src={require("@/public/logo.png")}
                alt="Dashboard Logo"
                height={500}
                width={500}
                className="w-72 h-auto mx-auto "
              />
            </Link>
          </div> */}
          {children}
        </div>
      </div>

      <div
        className="hidden lg:flex lg:w-1/2 bg-cover bg-center min-h-screen"
        style={{
          background: `url(${bgImg.src})`,
          backgroundPosition: "center",
          backgroundSize: "cover",
        }}
      ></div>
    </div>
  );
}
