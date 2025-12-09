"use client";

import { useState, FormEvent } from "react";
import AuthLayout from "@/components/auth/AuthLayout";
import { useRouter } from "next/navigation";
import InputError from "@/components/ui/InputError";

export default function ForgotPasswordPage() {
    const router = useRouter();

    // email state
    const [email, setEmail] = useState("");

    // Field error
    const [emailError, setEmailError] = useState("");

    // modal popup visibility
    const [showPopup, setShowPopup] = useState(false);

    async function handleSubmit(e: FormEvent) {
        e.preventDefault();

        setEmailError("");

        // frontend validation check
        if (!email) {
            setEmailError("Please enter your email.");
            return;
        }

        //  check user existence as no backend involved
        const users = JSON.parse(localStorage.getItem("workhive_users") || "[]");

        const exists = users.some((u: any) => u.email === email);

        if (!exists) {
            setEmailError("No account found with this email.");
            return;
        }

        // Api Call for forgot password
        const res = await fetch("/api/forgot-password", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ email }),
        });

        const data = await res.json();

        //  api error handling
        if (!data.success) {
            setEmailError(data.message);
            return;
        }

        localStorage.setItem("resetEmail", email);
        setShowPopup(true);
    }

    return (
        <AuthLayout
            title="Forgot Your Password?"
            subtitle="Don’t worry! Enter your email address, and we’ll send you a link to reset it."
        >
            <form onSubmit={handleSubmit} className="space-y-4 text-sm">

                <div>
                    <label className="block mb-1 text-gray-300 text-xs">Email Address</label>

                    <input
                        type="email"
                        placeholder="johndoe@gmail.com"
                        className={`w-full bg-[#1b1b1d] px-3 py-2 rounded-md h-12
                            border ${emailError ? "border-[#D33C43]" : "border-gray-700"}`}
                        onChange={(e) => {
                            setEmail(e.target.value);
                            setEmailError("");
                        }}
                    />
                    <InputError message={emailError} />
                </div>

                <button
                    type="submit"
                    className="w-full mt-6 bg-[#8854C0] hover:bg-[#6F3FA4] text-white py-2 px-6 rounded-md transition h-12"
                >
                    Submit
                </button>
            </form>

            {showPopup && (
                <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50">
                    <div className="bg-[#15151a] w-[380px] p-8 rounded-2xl text-center shadow-xl">

                        <div className="mx-auto w-16 h-16 rounded-full bg-green-500 flex items-center justify-center">
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                fill="white"
                                viewBox="0 0 24 24"
                                className="w-8 h-8"
                            >
                                <path d="M12 12.713l11.985-7.713v14c0 1.104-.896 2-2 2h-20c-1.104 0-2-.896-2-2v-14l11.985 7.713zM12 10l-12-8h24l-12 8z" />
                            </svg>
                        </div>

                        <h2 className="text-white text-lg font-semibold mt-4">
                            Link Sent Successfully!
                        </h2>

                        <p className="text-gray-400 text-sm mt-2">
                            Check your inbox! We’ve sent you an email with instructions to reset your password.
                        </p>

                        <button
                            onClick={() => {
                                setShowPopup(false);
                                localStorage.setItem("resetEmail", email);
                                router.push("/verify-otp");
                            }}
                            className="mt-6 bg-[#8854C0] hover:bg-[#6F3FA4] text-white py-2 px-6 rounded-md transition h-12"
                        >
                            Okay
                        </button>
                    </div>
                </div>
            )}
        </AuthLayout>
    );
}
