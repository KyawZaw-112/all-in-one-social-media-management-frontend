import { useEffect, useState } from "react";
import { getConversationDetail } from "@/lib/api";
import { Card } from "antd";

export default function ChatWindow({ conversation }: any) {
    const [messages, setMessages] = useState<any[]>([]);

    useEffect(() => {
        fetchDetail();
    }, [conversation]);

    async function fetchDetail() {
        const data = await getConversationDetail(conversation.id);
        setMessages(data.messages);
    }

    return (
        <div className="p-4 overflow-y-auto h-full">
            {messages.map((msg, index) => (
                <Card
                    key={index}
                    style={{
                        marginBottom: 10,
                        textAlign: msg.role === "assistant" ? "left" : "right",
                    }}
                >
                    {msg.content}
                </Card>
            ))}
        </div>
    );
}
