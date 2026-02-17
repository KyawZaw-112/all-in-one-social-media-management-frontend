import { Button, Descriptions, Tag } from "antd";
import { closeConversation } from "@/lib/api";

export default function DataPanel({ conversation }: any) {
    const data = conversation.temp_data || {};

    return (
        <div className="p-4">
            <Descriptions title="Extracted Data" column={1}>
                <Descriptions.Item label="Product">
                    {data.product_code || "-"}
                </Descriptions.Item>
                <Descriptions.Item label="Quantity">
                    {data.quantity || "-"}
                </Descriptions.Item>
                <Descriptions.Item label="Address">
                    {data.address || "-"}
                </Descriptions.Item>
                <Descriptions.Item label="Phone">
                    {data.phone || "-"}
                </Descriptions.Item>
            </Descriptions>

            <div className="mt-6">
                <Tag color={conversation.status === "completed" ? "green" : "blue"}>
                    {conversation.status}
                </Tag>
            </div>

            {conversation.status !== "completed" && (
                <Button
                    type="primary"
                    danger
                    className="mt-4"
                    onClick={() => closeConversation(conversation.id)}
                >
                    Close Conversation
                </Button>
            )}
        </div>
    );
}
