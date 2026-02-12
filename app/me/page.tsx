"use client";

import { useEffect, useState } from "react";
import  supabase  from "@/lib/supabase";

export default function MePage() {
    const [user, setUser] = useState<any>(null);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchMe = async () => {
            const { data } = await supabase.auth.getSession();

            if (!data.session) {
                setError("Not logged in");
                return;
            }

            const res = await fetch("http://localhost:4000/api/me", {
                headers: {
                    Authorization: `Bearer ${data.session.access_token}`,
                },
            });

            if (!res.ok) {
                setError("Unauthorized");
                return;
            }

            const json = await res.json();
            setUser(json.user);
        };

        fetchMe();
    }, []);

    if (error) return <p>{error}</p>;
    if (!user) return <p>Loading...</p>;

    return (
        <div>
            <h1>Authenticated User</h1>
            <pre>{JSON.stringify(user, null, 2)}</pre>
        </div>
    );
}
