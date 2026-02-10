import Link from "next/link";

const adminSections = [
    {
        href: "/admin/metrics",
        title: "User Metrics",
        description: "View high-level user growth and engagement numbers.",
    },
    {
        href: "/admin/payments",
        title: "Payment Approval",
        description: "Review and approve pending subscription payments.",
    },
    {
        href: "/admin/users",
        title: "User Management",
        description: "Review users and manage account status.",
    },
];

export default function AdminHomePage() {
    return (
        <div className="p-6 space-y-6">
            <h1 className="text-2xl font-bold">Admin Dashboard</h1>

            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {adminSections.map((section) => (
                    <Link
                        key={section.href}
                        href={section.href}
                        className="block rounded-lg border border-gray-200 p-4 transition hover:border-gray-400 hover:shadow-sm"
                    >
                        <h2 className="text-lg font-semibold">{section.title}</h2>
                        <p className="mt-2 text-sm text-gray-600">{section.description}</p>
                    </Link>
                ))}
            </div>
        </div>
    );
}
