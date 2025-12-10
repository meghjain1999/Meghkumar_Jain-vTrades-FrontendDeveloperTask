import { ReactNode } from "react";

export default function ScreenLayout({
    children,
    userName,
    logoutFunction,
}: {
    children: ReactNode;
    userName: string;
    logoutFunction: () => void;
}) {
    return (
        <main className="min-h-screen w-full bg-[#111111]">
            <div>
                <nav className="bg-gray-800 py-4">
                    <div className="max-w-7xl mx-auto px-4 flex justify-between items-center">
                        <div className="flex items-center">
                            <span className="text-white text-lg font-semibold">Hello, {userName} </span>
                        </div>
                        <div className="hidden md:block">
                            <button
                                onClick={(e) => {
                                    e.preventDefault();
                                    logoutFunction();
                                }}
                                className="mt-6 px-4 py-2 bg-red-600 hover:bg-red-700 rounded-md text-white">
                                Logout
                            </button>
                        </div>
                    </div>
                </nav>
            </div>

            <div className="w-full flex justify-center items-center">
                {children}
            </div>
        </main>
    );
}
