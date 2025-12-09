"use client";

import { useState, FormEvent, useEffect } from "react";
import AuthLayout from "@/components/auth/AuthLayout";
import { EyeIcon, EyeSlashIcon } from "@heroicons/react/24/outline";
import { useRouter } from "next/navigation";
import InputError from "@/components/ui/InputError";

export default function CreatePasswordPage() {
    const router = useRouter();

    //  create password fields state
    const [email, setEmail] = useState<string>("");
    const [password, setPassword] = useState<string>("");
    const [confirmPassword, setConfirmPassword] = useState<string>("");

    // password visibility state
    const [showPass1, setShowPass1] = useState<boolean>(false);
    const [showPass2, setShowPass2] = useState<boolean>(false);

    // error fields state
    const [passwordError, setPasswordError] = useState<string>("");
    const [confirmPasswordError, setConfirmPasswordError] = useState<string>("");

    // modal popup visibility
    const [showPopup, setShowPopup] = useState<boolean>(false);

    useEffect(() => {
        // fetching email entered by user
        const saved = localStorage.getItem("resetEmail");
        if (saved) setEmail(saved);
    }, []);


    async function handleSubmit(e: FormEvent) {
        e.preventDefault();

        setPasswordError("");
        setConfirmPasswordError("");

        let valid = true;

        // frontend validations check
        if (!password) {
            setPasswordError("Password is required.");
            valid = false;
        }

        if (!/^(?=.*[A-Z])(?=.*\d).{6,}$/.test(password)) {
            setPasswordError("Password must contain a number and capital letter.");
            valid = false;
        }

        if (!confirmPassword) {
            setConfirmPasswordError("Please confirm your password.");
            valid = false;
        }

        if (password && confirmPassword && password !== confirmPassword) {
            setConfirmPasswordError("Oops! Passwords don't match.");
            valid = false;
        }

        if (!valid) return;

        // email avaiability check
        if (!email) {
            setConfirmPasswordError("Session expired. Please request reset again.");
            return;
        }


        // mock checkup of user exists or not in local storage
        const users = JSON.parse(localStorage.getItem("workhive_users") || "[]");
        const index = users.findIndex((u: any) => u.email === email);

        if (index === -1) {
            setPasswordError("No account found with this email.");
            return;
        }

        if (users[index].provider !== "manual") {
            setPasswordError(`Cannot reset password for ${users[index].provider} accounts.`);
            return;
        }

        // Api Call for password reset
        const res = await fetch("/api/create-password", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ email, password }),
        });

        const data = await res.json();

        // api error handling
        if (!data.success) {
            setConfirmPasswordError(data.message);
            return;
        }

        // updating password in local storage
        users[index].password = password;
        localStorage.setItem("workhive_users", JSON.stringify(users));

        localStorage.removeItem("resetEmail");

        setShowPopup(true);
    }

    function handleClosePopup() {
        setShowPopup(false);
        router.push("/signin");
    }

    return (
        <AuthLayout
            title="Create New Password"
            subtitle="Choose a strong and secure password to keep your account safe. Make sure it's easy for you to remember, but hard for others to guess!"
        >
            <form onSubmit={handleSubmit} className="space-y-4 text-sm">

                <div>
                    <label className="block mb-1 text-gray-300 text-xs">Password</label>

                    <div className="relative">
                        <input
                            type={showPass1 ? "text" : "password"}
                            placeholder="Enter new password"
                            className={`w-full bg-[#1b1b1d] px-3 py-2 rounded-md pr-10 border h-12
                                ${passwordError ? "border-[#D33C43]" : "border-gray-700"}`}
                            onChange={(e) => {
                                setPassword(e.target.value);
                                setPasswordError("");
                            }}
                        />

                        <button
                            type="button"
                            onClick={() => setShowPass1(!showPass1)}
                            className="absolute inset-y-0 right-3 text-gray-400 hover:text-gray-200"
                        >
                            {showPass1 ? (
                                <EyeSlashIcon className="w-5 h-5" />
                            ) : (
                                <EyeIcon className="w-5 h-5" />
                            )}
                        </button>
                    </div>

                    <InputError message={passwordError} />
                </div>

                <div>
                    <label className="block mb-1 text-gray-300 text-xs">Re-enter your new password</label>

                    <div className="relative">
                        <input
                            type={showPass2 ? "text" : "password"}
                            placeholder="Confirm new password"
                            className={`w-full bg-[#1b1b1d] px-3 py-2 rounded-md pr-10 border h-12
                                ${confirmPasswordError ? "border-[#D33C43]" : "border-gray-700"}`}
                            onChange={(e) => {
                                setConfirmPassword(e.target.value);
                                setConfirmPasswordError("");
                            }}
                        />

                        <button
                            type="button"
                            onClick={() => setShowPass2(!showPass2)}
                            className="absolute inset-y-0 right-3 text-gray-400 hover:text-gray-200"
                        >
                            {showPass2 ? (
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
                    Update Password
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
                                <path d="M20.285 6.708l-11.01 11.01-5.657-5.657 1.414-1.414 4.243 4.243 9.596-9.596z" />
                            </svg>
                        </div>

                        <h2 className="text-white text-lg font-semibold mt-4">
                            Password Created!
                        </h2>

                        <p className="text-gray-400 text-sm mt-2">
                            Your password has been successfully updated. You can now use your new password to log in.
                        </p>

                        <button
                            onClick={handleClosePopup}
                            className="mt-6 bg-[#8854C0] hover:bg-[#6F3FA4] text-white py-2 px-6 rounded-md transition"
                        >
                            Okay
                        </button>
                    </div>
                </div>
            )}
        </AuthLayout>
    );
}
