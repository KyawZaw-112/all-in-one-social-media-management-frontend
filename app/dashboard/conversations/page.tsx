"use client";

import { useEffect, useState } from "react";
import { Layout, Spin } from "antd";
import ConversationList from "@/components/ConversationList";
import ChatWindow from "@/components/ChatWindow";
import DataPanel from "@/components/DataPanel";
import { getConversations } from "@/lib/api";

const { Sider, Content } = Layout;

export default function ConversationsPage() {
    const [conversations, setConversations] = useState<any[]>([]);
    const [selected, setSelected] = useState<any>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchData();
    }, []);

    async function fetchData() {
        const data = await getConversations();
        setConversations(data);
        setLoading(false);
    }

    if (loading) return <Spin fullscreen />;

    return (
        <Layout style={{ height: "100vh" }}>
            <Sider width={300} theme="light">
                <ConversationList
                    conversations={conversations}
                    onSelect={setSelected}
                />
            </Sider>

            <Content style={{ display: "flex" }}>
                <div style={{ flex: 2 }}>
                    {selected && <ChatWindow conversation={selected} />}
                </div>
                <div style={{ flex: 1, borderLeft: "1px solid #eee" }}>
                    {selected && <DataPanel conversation={selected} />}
                </div>
            </Content>
        </Layout>
    );
}
