"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useSession, signOut } from "next-auth/react";
import { getUserByEmail } from "@/lib/mockDB";
import ScreenLayout from "@/components/ScreenLayout";
export default function Dashboard() {
    const router = useRouter();
    const { data: session, status } = useSession();

    const [name, setName] = useState<string | null>(null);

    useEffect(() => {
        if (status === "loading") return;

        //  session check for logged in user
        if (session?.user?.email) {
            const localUser = getUserByEmail(session.user.email);

            setName(
                localUser?.name ||
                session.user.name ||
                "User"
            );

            return;
        }

        const localEmail = typeof window !== "undefined"
            ? localStorage.getItem("currentUser")
            : null;

        if (localEmail) {
            const user = getUserByEmail(localEmail);
            setName(user?.name || "User");
            return;
        }

        router.replace("/signin");
    }, [session, status, router]);

    const handleLogout = () => {
        if (session?.user) {
            signOut({
                callbackUrl: "/signin",
                redirect: true,
            });
            return;
        }

        localStorage.removeItem("currentUser");
        document.cookie = `currentUser=; Max-Age=0; path=/;`;

        router.replace("/signin");
    };

    if (!name) {
        return (
            <div className="p-6 text-white flex flex-col  justify-center items-center h-screen">
                Loading Dashboard...
            </div>
        );
    }
    return (
        <ScreenLayout userName={name} logoutFunction={() => { handleLogout() }}>
            <div className="p-6 text-white flex flex-col h-full justify-center items-center">
                <h1>Dashboard Screen</h1>
            </div>
        </ScreenLayout>
    );
}
