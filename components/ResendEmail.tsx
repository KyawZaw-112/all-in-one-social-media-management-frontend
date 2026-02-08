"use client";

import { useState } from "react";
import { supabase } from "@/lib/supabase";

export default function ResendEmail({ email }: { email: string }) {
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState("");

    const resend = async () => {
        if (loading) return;
        setLoading(true);
        setMessage("");

        const { error } = await supabase.auth.resend({
            type: "signup",
            email
        });

        if (error) {
            setMessage(error.message);
        } else {
            setMessage("Confirmation email resent.");
        }

        setLoading(false);
    };

    return (
        <div>
            <button onClick={resend} disabled={loading}>
                {loading ? "Sending..." : "Resend confirmation email"}
            </button>
            {message && <p>{message}</p>}
        </div>
    );
}
