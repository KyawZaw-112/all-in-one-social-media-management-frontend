import { List, Badge } from "antd";

export default function ConversationList({ conversations, onSelect }: any) {
    return (
        <List
            itemLayout="horizontal"
            dataSource={conversations}
            renderItem={(item: any) => (
                <List.Item onClick={() => onSelect(item)} style={{ cursor: "pointer" }}>
                    <List.Item.Meta
                        title={
                            <div className="flex justify-between">
                                <span>{item.user_psid}</span>
                                <Badge
                                    status={item.status === "completed" ? "success" : "processing"}
                                />
                            </div>
                        }
                        description={`Flow: ${item.flow_name}`}
                    />
                </List.Item>
            )}
        />
    );
}
