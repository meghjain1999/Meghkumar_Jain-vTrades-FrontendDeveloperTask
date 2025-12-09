import { NextResponse } from "next/server";

export async function POST(request: Request) {
    try {
        const { email } = await request.json();

        // validations check
        if (!email) {
            return NextResponse.json(
                { success: false, message: "Please enter your email." },
                { status: 400 }
            );
        }

        // success response
        return NextResponse.json(
            {
                success: true,
                message: "Password reset link sent.",
                email
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
