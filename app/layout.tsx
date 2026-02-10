import Navbar from "@/components/Navbar";
import "antd/dist/reset.css";

export default function RootLayout({
                                             children,
                                         }: {
    children: React.ReactNode;
}) {
    return (
        <html>
        <body>
        <Navbar />
        {children}
        </body>
        </html>
    );
}
