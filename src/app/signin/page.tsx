"use client";

import { signIn } from "next-auth/react";
import { useState, FormEvent } from "react";
import AuthLayout from "@/components/auth/AuthLayout";
import { useRouter } from "next/navigation";
import { EyeIcon, EyeSlashIcon } from "@heroicons/react/24/outline";
import InputError from "@/components/ui/InputError";

export default function SignInPage() {
    const router = useRouter();

    // sign in fields state
    const [email, setEmail] = useState<string>("");
    const [password, setPassword] = useState<string>("");

    // sing in fields error state
    const [emailError, setEmailError] = useState<string>("");
    const [passwordError, setPasswordError] = useState<string>("");

    // password visibility state
    const [showPassword, setShowPassword] = useState<boolean>(false);

    async function handleLogin(e: FormEvent) {
        e.preventDefault();

        setEmailError("");
        setPasswordError("");

        // frontend validations
        if (!email) {
            setEmailError("Email is required");
            return;
        }

        if (!password) {
            setPasswordError("Password is required");
            return;
        }

        // users check for sign in (no backend involved)
        const users = JSON.parse(localStorage.getItem("workhive_users") || "[]");
        const user = users.find((u: any) => u.email === email);

        if (!user) {
            setEmailError("Account not found. Please sign up first.");
            return;
        }

        if (user.provider !== "manual") {
            const providerName = user.provider === "google" ? "Google" : "Microsoft";
            setEmailError(`This account is registered with ${providerName}. Please sign in using ${providerName}.`);
            return;
        }


        // password check
        const passwordCorrect = user.password === password;

        // Api Call for sign in
        const res = await fetch("/api/signin", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ email, passwordCorrect }),
        });

        const data = await res.json();

        // api error handling
        if (!data.success) {
            setPasswordError(data.message);
            return;
        }

        localStorage.setItem("currentUser", email);

        router.push("/dashboard");
    }


    return (
        <AuthLayout
            title="Sign In"
            subtitle="Manage your workspace seamlessly. Sign in to continue."
        >
            <form onSubmit={handleLogin} className="space-y-4 text-sm">

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
                            setPasswordError("");
                        }}
                    />
                    <InputError message={emailError} />
                </div>

                <div>
                    <label className="block mb-1 text-gray-300 text-xs">Password</label>
                    <div className="relative">
                        <input
                            type={showPassword ? "text" : "password"}
                            placeholder="••••••••"
                            className={`w-full bg-[#1b1b1d] px-3 py-2 rounded-md pr-10 h-12
                            border ${passwordError ? "border-[#D33C43]" : "border-gray-700"}`}
                            onChange={(e) => {
                                setPassword(e.target.value);
                                setPasswordError("");
                            }}
                        />

                        <button
                            type="button"
                            onClick={() => setShowPassword(!showPassword)}
                            className="absolute inset-y-0 right-3 text-gray-400 hover:text-gray-200"
                        >
                            {showPassword ? (
                                <EyeSlashIcon className="w-5 h-5" />
                            ) : (
                                <EyeIcon className="w-5 h-5" />
                            )}
                        </button>
                    </div>

                    <InputError message={passwordError} />
                </div>

                <button type="submit"
                    className="w-full mt-6 h-12 bg-[#8854C0] hover:bg-[#6F3FA4] text-white py-2 px-6 rounded-md transition">
                    Sign In
                </button>

                <div className="flex justify-between text-xs mt-2">
                    <label>
                        <input type="checkbox" className="mr-2 text-xs" /> Remember me
                    </label>

                    <button
                        type="button"
                        onClick={() => router.push("/forgot-password")}
                        className="text-[#8854C0] text-xs hover:underline"
                    >
                        Forgot Password?
                    </button>
                </div>
            </form>

            <div className="flex items-center gap-3 text-xs text-gray-500 mt-4">
                <div className="h-px flex-1 bg-gray-700" />
                <span>or</span>
                <div className="h-px flex-1 bg-gray-700" />
            </div>

            {/* Google Sign in*/}
            <button
                onClick={() => signIn("google")}
                className="flex items-center justify-center h-12 gap-3 w-full border border-gray-700 py-3 px-4 rounded-md
                bg-[#1b1b1d] hover:bg-[#262628] transition"
            >
                <img src="/icons/google.svg" className="w-5 h-5" alt="Google" />
                <span className="text-gray-200 text-sm font-medium">Sign In with Google</span>
            </button>

            {/* Microsoft Sign in */}
            <button
                onClick={() => signIn("azure-ad")}
                className="flex h-12 items-center justify-center gap-3 w-full border border-gray-700 py-3 px-4 rounded-md
                bg-[#1b1b1d] hover:bg-[#262628] transition"
            >
                <img src="/icons/microsoft.svg" className="w-5 h-5" alt="Microsoft" />
                <span className="text-gray-200 text-sm font-medium">Sign In with Microsoft</span>
            </button>

            <p className="text-xs text-gray-400 text-center mt-3">
                Don't have an account?{" "}
                <span className="text-[#8854C0] hover:underline cursor-pointer text-xs" onClick={() => router.push("/signup")}>
                    Sign Up
                </span>
            </p>
        </AuthLayout>
    );
}
