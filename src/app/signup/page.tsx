"use client";

import { useState, FormEvent } from "react";
import AuthLayout from "@/components/auth/AuthLayout";
import { useRouter } from "next/navigation";
import { EyeIcon, EyeSlashIcon } from "@heroicons/react/24/outline";
import { signIn } from "next-auth/react";
import InputError from "@/components/ui/InputError";

export default function SignUpPage() {
    const router = useRouter();

    // sign up fields state
    const [email, setEmail] = useState<string>("");
    const [password, setPassword] = useState<string>("");
    const [confirmPassword, setConfirmPassword] = useState<string>("");

    // error fields state
    const [emailError, setEmailError] = useState<string>("");
    const [passwordError, setPasswordError] = useState<string>("");
    const [confirmPasswordError, setConfirmPasswordError] = useState<string>("");

    // password visibility state
    const [showPassword, setShowPassword] = useState<boolean>(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState<boolean>(false);

    async function handleSignup(e: FormEvent) {
        e.preventDefault();

        setEmailError("");
        setPasswordError("");
        setConfirmPasswordError("");

        let valid = true;

        // frontend validations
        if (!email) {
            setEmailError("Email is required.");
            valid = false;
        }

        if (!password) {
            setPasswordError("Password is required.");
            valid = false;
        } else if (!/^(?=.*[A-Z])(?=.*\d).{6,}$/.test(password)) {
            setPasswordError("Password must contain a number and capital letter.");
            valid = false;
        }

        if (!confirmPassword) {
            setConfirmPasswordError("Please confirm your password.");
            valid = false;
        } else if (password !== confirmPassword) {
            setConfirmPasswordError("Oops! Passwords Don't Match");
            valid = false;
        }

        // user existence check as no backend available
        const users = JSON.parse(localStorage.getItem("workhive_users") || "[]");

        const exists = users.some((u: any) => u.email === email);
        if (exists) {
            setEmailError("Email already exists. Please sign in.");
            return;
        }

        if (!valid) return;

        // Api Call for sign up
        const res = await fetch("/api/signup", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ email, password }),
        });

        const data = await res.json();

        // api error handling
        if (!data.success) {
            if (res.status === 409) {
                setEmailError("Email already exists. Please sign in.");
            } else {
                setEmailError(data.message || "Something went wrong.");
            }
            return;
        }

        localStorage.setItem("signupEmail", email);
        router.push("/verify-otp");
    }


    return (
        <AuthLayout
            title="Sign Up"
            subtitle="Manage your workspace seamlessly. Sign up to continue."
        >
            <form onSubmit={handleSignup} className="space-y-4 text-sm">
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

                <div>
                    <label className="block mb-1 text-gray-300 text-xs">Password</label>
                    <div className="relative">
                        <input
                            type={showPassword ? "text" : "password"}
                            placeholder="Password"
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
                            className="absolute inset-y-0 right-3 flex items-center text-gray-400 hover:text-gray-200"
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

                <div>
                    <label className="block mb-1 text-gray-300 text-xs">Confirm Password</label>
                    <div className="relative">
                        <input
                            type={showConfirmPassword ? "text" : "password"}
                            placeholder="Password"
                            className={`w-full bg-[#1b1b1d] px-3 py-2 rounded-md pr-10 h-12
                                border ${confirmPasswordError ? "border-[#D33C43]" : "border-gray-700"}`}
                            onChange={(e) => {
                                setConfirmPassword(e.target.value);
                                setConfirmPasswordError("");
                            }}
                        />

                        <button
                            type="button"
                            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                            className="absolute inset-y-0 right-3 flex items-center text-gray-400 hover:text-gray-200"
                        >
                            {showConfirmPassword ? (
                                <EyeSlashIcon className="w-5 h-5" />
                            ) : (
                                <EyeIcon className="w-5 h-5" />
                            )}
                        </button>
                    </div>

                    <InputError message={confirmPasswordError} />
                </div>

                <button
                    type="submit"
                    className="w-full mt-6 bg-[#8854C0] hover:bg-[#6F3FA4] text-white py-2 px-6 rounded-md transition h-12"
                >
                    Sign Up
                </button>
            </form>

            <div className="flex items-center gap-3 text-xs text-gray-500">
                <div className="h-px flex-1 bg-gray-700" />
                <span>or</span>
                <div className="h-px flex-1 bg-gray-700" />
            </div>

            {/* Google Sign Up */}
            <button
                onClick={() => signIn("google")}
                className="flex items-center justify-center gap-3 w-full border border-gray-700 py-3 px-4 rounded-md 
                    bg-[#1b1b1d] hover:bg-[#262628] transition h-12"
            >
                <img src="/icons/google.svg" className="w-5 h-5" />
                <span className="text-gray-200 text-sm font-medium">
                    Sign Up with Google
                </span>
            </button>

            {/* Microsoft Sign Up */}
            <button
                onClick={() => signIn("azure-ad")}
                className="flex items-center justify-center gap-3 w-full border border-gray-700 py-3 px-4 rounded-md 
                    bg-[#1b1b1d] hover:bg-[#262628] transition h-12"
            >
                <img src="/icons/microsoft.svg" className="w-5 h-5" />
                <span className="text-gray-200 text-sm font-medium">
                    Sign Up with Microsoft
                </span>
            </button>

            <p className="text-xs text-gray-400 text-center">
                Already have an account?{" "}
                <span
                    onClick={() => router.push("/signin")}
                    className="text-[#8854C0] hover:underline cursor-pointer text-xs"
                >
                    Sign In
                </span>
            </p>
        </AuthLayout>
    );
}
