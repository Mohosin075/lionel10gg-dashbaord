"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useEffect, useRef, useState } from "react";


export default function OtpVerify() {
  const [otp, setOtp] = useState(Array(6).fill(""));
  const [isLoading, setIsLoading] = useState(false);
  const [countdown, setCountdown] = useState(60);
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  useEffect(() => {
    if (countdown > 0) {
      const timer = setTimeout(() => setCountdown(countdown - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [countdown]);

  const handlePaste = (index: number, e: React.ClipboardEvent) => {
    e.preventDefault();
    const pasted = e.clipboardData.getData("text").replace(/\D/g, "");
    if (!pasted) return;

    const newOtp = [...otp];
    pasted
      .slice(0, 6 - index)
      .split("")
      .forEach((v, i) => (newOtp[index + i] = v));

    setOtp(newOtp);
    inputRefs.current[Math.min(index + pasted.length, 5)]?.focus();
  };

  const handleChange = (index: number, value: string) => {
    if (!/^\d*$/.test(value)) return;

    const newOtp = [...otp];
    if (value.length > 1) {
      value
        .slice(0, 6 - index)
        .split("")
        .forEach((v, i) => (newOtp[index + i] = v));
      setOtp(newOtp);
      inputRefs.current[Math.min(index + value.length, 5)]?.focus();
      return;
    }

    newOtp[index] = value;
    setOtp(newOtp);
    if (value && index < 5) inputRefs.current[index + 1]?.focus();
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handleVerify = async () => {
    setIsLoading(true);
    await new Promise((r) => setTimeout(r, 2000));
    console.log("Verifying OTP:", otp.join(""));
    setIsLoading(false);
  };

  const handleResend = () => {
    setOtp(Array(6).fill(""));
    setCountdown(60);
    inputRefs.current[0]?.focus();
  };

  const isComplete = otp.every(Boolean);

  return (
    <div className="w-full  rounded-lg bg-white md:px-8 py-10 ">
        {/* Title */}
        <h1 className="text-3xl font-semibold text-gray-900">
          OTP Verify
        </h1>

        {/* Subtitle */}
        <p className="mt-2 text-base text-black mb-6">
          Please check your email We sent there 6 digit code
        </p>

        {/* OTP Inputs */}
        <div className="flex justify-between gap-3 mb-8">
          {otp.map((digit, i) => (
            <Input
              key={i}
              ref={(el) => {
                inputRefs.current[i] = el;
              }}
              type="text"
              inputMode="numeric"
              maxLength={1}
              value={digit}
              onChange={(e) => handleChange(i, e.target.value)}
              onKeyDown={(e) => handleKeyDown(i, e)}
              onPaste={(e) => handlePaste(i, e)}
              className="h-14 w-14 text-lg! rounded-md text-center font-semibold"
            />
          ))}
        </div>

        {/* Verify Button */}
        <Button
          onClick={handleVerify}
          disabled={!isComplete || isLoading}
          className="h-14 text-lg w-full rounded-lg bg-[#0F3D2E] text-white hover:bg-[#0c3326] mb-4"
        >
          {isLoading ? "Verifying..." : "Verify OTP code"}
        </Button>

        {/* Resend */}
        <div className="flex justify-end">
        {countdown > 0 ? (
          <p className="text-base text-gray-600">
            Resend in {countdown}s
          </p>
        ) : (
          <div className="flex items-center gap-1">
            <p className="text-base text-gray-600 ">
              Don’t receive any code?
            </p>
            <Button
              onClick={handleResend}
              variant="link"
              className="text-base text-red-500 font-medium"
            >
              Resend
            </Button>
          </div>
        )}
      </div>
      </div>
  );
}