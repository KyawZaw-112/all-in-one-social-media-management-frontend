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
        <div className="p-4 overflow-y-auto h-full flex flex-col gap-4">
            {messages.map((msg, index) => {
                const isAssistant = msg.sender_email === "AI-Assistant" || msg.sender_id === conversation.merchant_id;

                return (
                    <div
                        key={index}
                        className={`flex ${isAssistant ? 'justify-start' : 'justify-end'}`}
                    >
                        <Card
                            size="small"
                            className={`${isAssistant ? 'bg-blue-50' : 'bg-white'}`}
                            style={{
                                maxWidth: '80%',
                                borderRadius: '12px',
                                borderTopLeftRadius: isAssistant ? '0' : '12px',
                                borderTopRightRadius: isAssistant ? '12px' : '0',
                                boxShadow: '0 2px 4px rgba(0,0,0,0.05)'
                            }}
                        >
                            <div className="whitespace-pre-wrap">{msg.body}</div>
                            <div className="text-[10px] text-gray-400 mt-1 text-right">
                                {new Date(msg.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                            </div>
                        </Card>
                    </div>
                );
            })}
        </div>
    );
}
