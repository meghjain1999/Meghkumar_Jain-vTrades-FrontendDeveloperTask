import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
    try {
        const { email, passwordCorrect } = await request.json();

        // validations check
        if (!email) {
            return NextResponse.json(
                { success: false, message: "Email is required." },
                { status: 400 }
            );
        }

        if (!passwordCorrect) {
            return NextResponse.json(
                { success: false, message: "Incorrect password." },
                { status: 401 }
            );
        }

        // success response
        const response = NextResponse.json(
            {
                success: true,
                message: "Login session created.",
            },
            { status: 200 }
        );

        //  set cookie for dashboard
        response.cookies.set("currentUser", email, {
            httpOnly: true,
            path: "/",
        });

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
