import Navbar from "@/components/Navbar";
import { supabase } from "@/lib/supabase";
import "antd/dist/reset.css";
export default async function RootLayout({
                                             children,
                                         }: {
    children: React.ReactNode;
}) {
    const {
        data: { session },
    } = await supabase.auth.getSession();

    return (
        <html>
        <body>
        <Navbar />
        {children}
        </body>
        </html>
    );
}
