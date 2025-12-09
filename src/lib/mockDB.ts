export interface User {
    name?: string;
    email: string;
    password: string;
    provider: "manual" | "google" | "microsoft";
}

const STORAGE_KEY = "workhive_users";

export function getUsers(): User[] {
    if (typeof window === "undefined") return [];
    try {
        const data = localStorage.getItem(STORAGE_KEY);
        return data ? JSON.parse(data) : [];
    } catch {
        return [];
    }
}


export function getUserByEmail(email: string): User | undefined {
    const users = getUsers();
    return users.find((u) => u.email === email);
}

