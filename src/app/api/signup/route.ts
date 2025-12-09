import { NextResponse } from "next/server";

export async function POST(request: Request) {
    try {
        const { email, password } = await request.json();

        // validations check
        if (!email || !password) {
            return NextResponse.json(
                { success: false, message: "Email and password are required." },
                { status: 400 }
            );
        }

        // success response with verfication pending
        const response = NextResponse.json(
            { success: true, message: "User Pending Verification" },
            { status: 201 }
        );

        // temporary cookie setting for pending signup
        response.cookies.set(
            "pendingSignup",
            JSON.stringify({
                email,
                password,
                name: email.split("@")[0],
                provider: "manual",
            }),
            {
                httpOnly: true,
                path: "/",
            }
        );

        return response;
    } catch (err) {
        // error response
        const response = NextResponse.json(
            { success: true, message: "Server Error Creating User" },
            { status: 500 }
        );
        return response || err;
    }
}
