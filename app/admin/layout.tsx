import AdminLayoutGuard from "@/components/AdminLayoutGuard";

export default function AdminLayout({
                                        children,
                                    }: {
    children: React.ReactNode;
}) {
    return <AdminLayoutGuard>{children}</AdminLayoutGuard>;
}
