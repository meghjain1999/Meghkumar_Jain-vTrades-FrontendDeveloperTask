import { NextResponse, NextRequest } from "next/server";

export async function POST(request: NextRequest) {
    try {
        const { email, otp } = await request.json();

        // validations check
        if (!email) {
            return NextResponse.json(
                { success: false, message: "Email missing from request." },
                { status: 400 }
            );
        }

        if (!otp || otp.length !== 6) {
            return NextResponse.json(
                { success: false, message: "Please enter the 6-digit OTP." },
                { status: 400 }
            );
        }

        //  otp match check
        if (otp !== "000000") {
            return NextResponse.json(
                { success: false, message: "Invalid OTP. Please try again." },
                { status: 401 }
            );
        }

        const pendingSignup = request.cookies.get("pendingSignup");
        if (pendingSignup) {
            const data = JSON.parse(pendingSignup.value);
            const added = {
                email: data.email,
                password: data.password,
                name: data.name,
                provider: data.provider,
            };

            // success response for OTP verification incase of Sign Up
            const response = NextResponse.json(
                {
                    success: true,
                    message: "Signup complete.",
                    fromSignup: true,
                    user: added
                },
                { status: 200 }
            );

            //  clearing tempoary cookie for pending signup
            response.cookies.set("pendingSignup", "", {
                maxAge: 0,
                path: "/",
            });

            return response;
        }

        //  success response for OTP verification in case of Forgot Password
        return NextResponse.json(
            {
                success: true,
                message: "OTP verified. Proceed to reset password.",
                fromSignup: false,
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
