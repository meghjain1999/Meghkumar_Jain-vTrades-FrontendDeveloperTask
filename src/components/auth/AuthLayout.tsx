import Image from "next/image";
import { ReactNode } from "react";
import AuthImage from "../../assets/images/AuthImage.png";

export default function AuthLayout({
    children,
    title,
    subtitle,
}: {
    children: ReactNode;
    title: string;
    subtitle?: string;
}) {
    return (
        <main className="min-h-screen w-full bg-[#111111] flex items-center justify-center">
            <div className="w-full max-w-7xl rounded-2xl overflow-hidden flex">

                <div className="hidden md:block relative w-[60%] h-[650px] rounded-3xl overflow-hidden shadow-[0_0_25px_rgba(0,0,0,0.6)]">

                    <Image
                        src={AuthImage}
                        alt="Welcome Image"
                        fill
                        className="object-cover rounded-3xl"
                        priority
                    />

                    <div className="absolute inset-0 rounded-3xl pointer-events-none bg-[radial-gradient(circle,_transparent_60%,_rgba(0,0,0,0.55)_100%)]" />
                    <div className="absolute bottom-10 left-10 w-[80%] text-white">
                        <h2 className="text-3xl font-semibold">Welcome to WORKHIVE!</h2>

                        <ul className="mt-4 ml-4 space-y-1 text-sm text-gray-300 list-disc">
                            <li>Employee Management: View detailed profiles, track performance, and manage attendance.</li>
                            <li>Performance Insights: Analyze team goals, progress and achievements.</li>
                            <li>Attendance & Leaves: Track attendance patterns and manage leave requests effortlessly.</li>
                        </ul>
                    </div>
                </div>

                <div className="w-full md:w-[40%] p-12 flex items-center justify-center md:ml-10">
                    <div className="w-full space-y-6">
                        <div>
                            <h1 className="text-3xl font-semibold font-sans">{title}</h1>
                            {subtitle && (
                                <p className="text-sm text-gray-400 mt-1">{subtitle}</p>
                            )}
                        </div>

                        {children}
                    </div>
                </div>
            </div>
        </main>
    );
}
