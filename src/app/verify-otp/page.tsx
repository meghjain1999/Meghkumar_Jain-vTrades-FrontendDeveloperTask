"use client";

import { useState, useEffect, useRef } from "react";
import AuthLayout from "@/components/auth/AuthLayout";
import { useRouter } from "next/navigation";
import { ClockIcon } from "@heroicons/react/24/outline";
import InputError from "@/components/ui/InputError";

export default function VerifyOtpPage() {
    const router = useRouter();
    const inputRefs = useRef<HTMLInputElement[]>([]);
    //  email state
    const [email, setEmail] = useState<string>("");

    //  otp state
    const [otp, setOtp] = useState<string[]>(["", "", "", "", "", ""]);


    // Timer state
    const [timeLeft, setTimeLeft] = useState<number>(30);
    const [canResend, setCanResend] = useState<boolean>(false);

    // Error State
    const [otpError, setOtpError] = useState<string>("");

    useEffect(() => {
        // fetching email type for verification
        const saved =
            localStorage.getItem("resetEmail") ||
            localStorage.getItem("signupEmail");

        if (saved) setEmail(saved);
    }, []);

    useEffect(() => {
        // otp timer logic
        if (timeLeft === 0) {
            setCanResend(true);
            return;
        }

        const timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
        return () => clearTimeout(timer);
    }, [timeLeft]);

    function handleOtpChange(value: string, index: number) {
        if (!/^\d?$/.test(value)) return;

        const updated = [...otp];
        updated[index] = value;
        setOtp(updated);
        setOtpError("");

        if (value && index < 5) {
            inputRefs.current[index + 1]?.focus();
        }
    }

    function handleBackspace(e: React.KeyboardEvent, index: number) {
        if (e.key === "Backspace" && !otp[index] && index > 0) {
            inputRefs.current[index - 1]?.focus();
        }
    }

    async function handleContinue() {
        const finalOtp = otp.join("");

        setOtpError("");

        // api call
        const res = await fetch("/api/verify-otp", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ email, otp: finalOtp }),
        });

        const data = await res.json();

        // api error handling
        if (!data.success) {
            setOtpError(data.message);
            return;
        }

        // condition check for further actions
        const fromSignUp = localStorage.getItem("signupEmail");

        const newUser = data.user;

        if (fromSignUp) {
            const users = JSON.parse(localStorage.getItem("workhive_users") || "[]");
            users.push(newUser);
            localStorage.setItem("workhive_users", JSON.stringify(users));
            localStorage.removeItem("signupEmail");
            router.push("/signin");
        } else {
            router.push("/create-password");
        }
    }

    function resendOtp() {
        setOtp(["", "", "", "", "", ""]);
        setOtpError("");
        setTimeLeft(30);
        setCanResend(false);
        inputRefs.current[0]?.focus();
    }

    return (
        <AuthLayout
            title="Enter OTP"
            subtitle="Enter the OTP that we have sent to your email address"
        >
            <p className="text-gray-400 text-xs -mt-3 mb-4">{email}</p>

            {localStorage.getItem("resetEmail") &&
                <button
                    onClick={() => router.push("/forgot-password")}
                    className="text-[#8854C0] text-xs hover:underline mb-3 "
                >
                    Change Email Address
                </button>
            }

            <div className="flex gap-3 my-4">
                {otp.map((digit, index) => (
                    <input
                        key={index}
                        ref={(el: HTMLInputElement | null) => {
                            if (el) inputRefs.current[index] = el;
                        }}
                        type="text"
                        maxLength={1}
                        value={digit}
                        onChange={(e) => handleOtpChange(e.target.value, index)}
                        onKeyDown={(e) => handleBackspace(e, index)}
                        className={`w-12 h-12 bg-transparent text-center text-lg text-white rounded-lg
                        border ${otpError ? "border-[#D33C43]" : "border-gray-700"}
                        focus:outline-none focus:ring-2 focus:ring-[#8854C0]`}
                    />
                ))}
            </div>

            <InputError message={otpError} />

            <div className="flex items-center gap-2 text-gray-400 text-xs mb-4 mt-1">

                {!canResend ? (
                    <>
                        <ClockIcon className="w-4 h-4" />
                        <span>{timeLeft} Sec</span>
                    </>
                ) : (
                    <button
                        onClick={resendOtp}
                        className="text-[#8854C0] hover:underline text-xs"
                    >
                        Resend OTP
                    </button>
                )}
            </div>

            <button
                onClick={handleContinue}
                className="w-full bg-[#8854C0] hover:bg-[#6F3FA4] py-2 rounded-md text-white transition h-12"
            >
                Continue
            </button>
        </AuthLayout>
    );
}
