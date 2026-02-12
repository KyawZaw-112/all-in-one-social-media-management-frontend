"use client";
import AdminLayoutGuard from "@/components/AdminLayoutGuard";
import { Layout, Menu } from "antd";
import {
    UserOutlined,
    DashboardOutlined,
    CreditCardOutlined,
} from "@ant-design/icons";
import { useRouter } from "next/navigation";
import Sider from "antd/es/layout/Sider";
import { Content } from "antd/es/layout/layout";
export default function AdminLayout({
                                        children,
                                    }: {
    children: React.ReactNode;
}) {
    const router = useRouter();
    return(
    <AdminLayoutGuard>
        <Layout style={{ minHeight: "100vh" }}>
        <Sider theme="light">
            <Menu
                mode="inline"
                defaultSelectedKeys={["dashboard"]}
                onClick={(e) => router.push(`/admin/${e.key}`)}
                items={[
                    {
                        key: "",
                        icon: <DashboardOutlined />,
                        label: "Dashboard",
                    },
                    {
                        key: "payments",
                        icon: <CreditCardOutlined /> ,
                        label: "Payment Logs",
                    },
                    {
                        key: "users",
                        icon: <UserOutlined />,
                        label: "Subscribed Users",
                    },
                ]}
            />
        </Sider>
        <Layout>
            <Content style={{ padding: 24 }}>
                {children}
            </Content>
        </Layout>
    </Layout>
    </AdminLayoutGuard>
    )
}
