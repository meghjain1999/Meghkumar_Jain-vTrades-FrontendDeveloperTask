"use client";

import { ExclamationCircleIcon } from "@heroicons/react/24/solid";

export default function InputError({ message }: { message?: string }) {
    if (!message) return null;

    return (
        <div className="flex items-center gap-2 text-[#D33C43] text-xs mt-3">
            <ExclamationCircleIcon className="w-4 h-4" />
            <span>{message}</span>
        </div>
    );
}
