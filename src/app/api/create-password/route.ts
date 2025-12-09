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

        // success response
        return NextResponse.json(
            {
                success: true,
                message: "Password updated successfully.",
            },
            { status: 200 }
        );

    } catch (err) {
        // error response
        const response = NextResponse.json(
            { success: true, message: "Server Error Creating User" },
            { status: 500 }
        );
        return response || err;
    }
}
