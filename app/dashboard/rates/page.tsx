"use client";

import { useState, useEffect } from "react";
import {
    Table, Card, Typography, Tag, Space, Button, message,
    Modal, Input, InputNumber, Form, Select, Row, Col, Statistic,
    Popconfirm, Divider
} from "antd";
import {
    CalculatorOutlined, ArrowLeftOutlined, PlusOutlined,
    EditOutlined, DeleteOutlined, DollarOutlined, GlobalOutlined
} from "@ant-design/icons";
import { useRouter } from "next/navigation";
import axios from "axios";
import { API_URL } from "@/lib/apiConfig";
import AuthGuard from "@/components/AuthGuard";
import { useLanguage } from "@/lib/i18n/LanguageContext";

const { Title, Text } = Typography;

export default function RatesPage() {
    const [loading, setLoading] = useState(false);
    const [rates, setRates] = useState<any[]>([]);
    const [modalVisible, setModalVisible] = useState(false);
    const [editing, setEditing] = useState<any>(null);
    const [saving, setSaving] = useState(false);
    const [form] = Form.useForm();
    const { language } = useLanguage();
    const router = useRouter();

    // Calculator state
    const [calcCountry, setCalcCountry] = useState<string>("");
    const [calcShipping, setCalcShipping] = useState<string>("");
    const [calcCategory, setCalcCategory] = useState<string>("");
    const [calcWeight, setCalcWeight] = useState<number>(1);
    const [calcResult, setCalcResult] = useState<any>(null);
    const [calculating, setCalculating] = useState(false);

    const fetchRates = async () => {
        setLoading(true);
        try {
            const token = localStorage.getItem("authToken");
            const res = await axios.get(`${API_URL}/api/rates`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setRates(res.data.data || []);
        } catch {
            message.error("Failed to fetch rates");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => { fetchRates(); }, []);

    const handleSave = async (values: any) => {
        setSaving(true);
        try {
            const token = localStorage.getItem("authToken");
            if (editing) {
                await axios.patch(`${API_URL}/api/rates/${editing.id}`, values, {
                    headers: { Authorization: `Bearer ${token}` }
                });
                message.success(language === "my" ? "ပြင်ဆင်ပြီးပါပြီ" : "Updated");
            } else {
                await axios.post(`${API_URL}/api/rates`, values, {
                    headers: { Authorization: `Bearer ${token}` }
                });
                message.success(language === "my" ? "ထည့်သွင်းပြီးပါပြီ" : "Created");
            }
            setModalVisible(false);
            setEditing(null);
            form.resetFields();
            fetchRates();
        } catch {
            message.error("Failed to save");
        } finally {
            setSaving(false);
        }
    };

    const handleDelete = async (id: string) => {
        try {
            const token = localStorage.getItem("authToken");
            await axios.delete(`${API_URL}/api/rates/${id}`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            message.success(language === "my" ? "ဖျက်ပြီးပါပြီ" : "Deleted");
            fetchRates();
        } catch {
            message.error("Failed to delete");
        }
    };

    const handleCalculate = async () => {
        if (!calcCountry || !calcShipping || !calcCategory || !calcWeight) {
            message.warning(language === "my" ? "အချက်အလက်အားလုံးဖြည့်ပေးပါ" : "Please fill all fields");
            return;
        }
        setCalculating(true);
        try {
            const token = localStorage.getItem("authToken");
            const res = await axios.post(`${API_URL}/api/rates/calculate`, {
                country: calcCountry,
                shipping_type: calcShipping,
                item_category: calcCategory,
                weight_kg: calcWeight
            }, { headers: { Authorization: `Bearer ${token}` } });
            setCalcResult(res.data.data);
        } catch (err: any) {
            const msg = err.response?.data?.error || "Calculation failed";
            message.error(msg);
            setCalcResult(null);
        } finally {
            setCalculating(false);
        }
    };

    const openEdit = (record: any) => {
        setEditing(record);
        form.setFieldsValue(record);
        setModalVisible(true);
    };

    const openAdd = () => {
        setEditing(null);
        form.resetFields();
        form.setFieldsValue({ currency: "THB", is_active: true });
        setModalVisible(true);
    };

    // Get unique countries and shipping types for calculator dropdowns
    const countries = [...new Set(rates.map(r => r.country))];
    const shippingTypes = [...new Set(rates.filter(r => r.country === calcCountry).map(r => r.shipping_type))];
    const categories = [...new Set(rates.filter(r => r.country === calcCountry && r.shipping_type === calcShipping).map(r => r.item_category))];

    const columns = [
        {
            title: language === "my" ? "လမ်းကြောင်း" : "Route",
            dataIndex: "country",
            key: "country",
            render: (c: string) => <Space><GlobalOutlined /><Text strong>{c}</Text></Space>
        },
        {
            title: language === "my" ? "ပို့ဆောင်မှု" : "Shipping Type",
            dataIndex: "shipping_type",
            key: "shipping_type",
            render: (t: string) => (
                <Tag color={t === "Air" || t === "လေကြောင်း" ? "blue" : "orange"}>
                    {t === "Air" || t === "လေကြောင်း" ? "✈️" : "⚡"} {t}
                </Tag>
            )
        },
        {
            title: language === "my" ? "အမျိုးအစား" : "Category",
            dataIndex: "item_category",
            key: "item_category",
            render: (cat: string) => <Tag color="cyan">{cat}</Tag>
        },
        {
            title: language === "my" ? "နှုန်း (per kg)" : "Rate (per kg)",
            dataIndex: "rate_per_kg",
            key: "rate_per_kg",
            render: (rate: number, record: any) => (
                <Text strong style={{ color: "#6366f1" }}>{Number(rate).toLocaleString()} {record.currency}</Text>
            )
        },
        {
            title: language === "my" ? "အခြေအနေ" : "Status",
            dataIndex: "is_active",
            key: "is_active",
            width: 90,
            render: (active: boolean) => <Tag color={active ? "green" : "default"}>{active ? "Active" : "Off"}</Tag>
        },
        {
            title: language === "my" ? "လုပ်ဆောင်ချက်" : "Action",
            key: "action",
            width: 120,
            render: (_: any, record: any) => (
                <Space>
                    <Button icon={<EditOutlined />} size="small" onClick={() => openEdit(record)} />
                    <Popconfirm title={language === "my" ? "ဖျက်မှာ သေချာလား?" : "Delete?"} onConfirm={() => handleDelete(record.id)}>
                        <Button icon={<DeleteOutlined />} size="small" danger />
                    </Popconfirm>
                </Space>
            )
        }
    ];

    return (
        <AuthGuard>
            <div style={{ padding: "24px", maxWidth: "1200px", margin: "0 auto" }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 24 }}>
                    <Space size="middle">
                        <Button icon={<ArrowLeftOutlined />} onClick={() => router.push("/dashboard")} type="text" style={{ fontSize: 18 }} />
                        <CalculatorOutlined style={{ fontSize: 24, color: "#f59e0b" }} />
                        <Title level={2} style={{ margin: 0, fontWeight: 300 }}>
                            {language === "my" ? "လမ်းကြောင်းအလိုက် ပို့ဆောင်ခ" : "Route Rates"}
                        </Title>
                    </Space>
                    <Button type="primary" icon={<PlusOutlined />} onClick={openAdd}
                        style={{ background: "#f59e0b", borderColor: "#f59e0b" }}>
                        {language === "my" ? "လမ်းကြောင်းထည့်မည်" : "Add Route"}
                    </Button>
                </div>

                {/* Calculator Card */}
                <Card
                    bordered={false}
                    style={{
                        borderRadius: 16,
                        background: "linear-gradient(135deg, #fffbeb, #fef3c7)",
                        border: "1px solid #fde68a",
                        marginBottom: 24
                    }}
                >
                    <Title level={4} style={{ margin: "0 0 16px 0" }}>
                        🧮 {language === "my" ? "ပို့ဆောင်ခ တွက်ချက်ရန်" : "Calculate Shipping Cost"}
                    </Title>
                    <Row gutter={[16, 16]} align="middle">
                        <Col xs={24} sm={6}>
                            <Text type="secondary">{language === "my" ? "လမ်းကြောင်း" : "Route"}</Text>
                            <Select
                                style={{ width: "100%", marginTop: 4 }}
                                placeholder={language === "my" ? "ရွေးပါ" : "Select"}
                                value={calcCountry || undefined}
                                onChange={setCalcCountry}
                            >
                                {countries.map(c => (
                                    <Select.Option key={c} value={c}>
                                        {c.includes('->') ? c : `Route: ${c}`}
                                    </Select.Option>
                                ))}
                            </Select>
                        </Col>
                        <Col xs={24} sm={5}>
                            <Text type="secondary">{language === "my" ? "ပို့ဆောင်မှု" : "Shipping"}</Text>
                            <Select
                                style={{ width: "100%", marginTop: 4 }}
                                placeholder={language === "my" ? "ရွေးပါ" : "Select"}
                                value={calcShipping || undefined}
                                onChange={setCalcShipping}
                                disabled={!calcCountry}
                            >
                                {shippingTypes.map(t => <Select.Option key={t} value={t}>{t}</Select.Option>)}
                            </Select>
                        </Col>
                        <Col xs={24} sm={5}>
                            <Text type="secondary">{language === "my" ? "ပစ္စည်းအမျိုးအစား" : "Category"}</Text>
                            <Select
                                style={{ width: "100%", marginTop: 4 }}
                                placeholder={language === "my" ? "ရွေးပါ" : "Select"}
                                value={calcCategory || undefined}
                                onChange={setCalcCategory}
                                disabled={!calcShipping}
                            >
                                {categories.map(c => <Select.Option key={c} value={c}>{c}</Select.Option>)}
                            </Select>
                        </Col>
                        <Col xs={24} sm={4}>
                            <Text type="secondary">{language === "my" ? "အလေးချိန် (kg)" : "Weight (kg)"}</Text>
                            <InputNumber
                                style={{ width: "100%", marginTop: 4 }}
                                min={0.1}
                                step={0.5}
                                value={calcWeight}
                                onChange={v => setCalcWeight(v || 1)}
                            />
                        </Col>
                        <Col xs={24} sm={2}>
                            <div style={{ marginTop: 20 }}>
                                <Button
                                    type="primary"
                                    block
                                    loading={calculating}
                                    onClick={handleCalculate}
                                    style={{ background: "#f59e0b", borderColor: "#f59e0b" }}
                                >
                                    {language === "my" ? "တွက်ရှာ" : "Calc"}
                                </Button>
                            </div>
                        </Col>
                        <Col xs={24} sm={4}>
                            {calcResult && (
                                <Card bordered={false} style={{ background: "#fff", borderRadius: 12, textAlign: "center" }}>
                                    <Statistic
                                        title={language === "my" ? "စုစုပေါင်း" : "Total"}
                                        value={calcResult.total.toLocaleString()}
                                        suffix={calcResult.currency}
                                        valueStyle={{ color: "#f59e0b", fontWeight: "bold" }}
                                    />
                                </Card>
                            )}
                        </Col>
                    </Row>
                </Card>

                {/* Rate Table */}
                <Card bordered={false} style={{ borderRadius: 16, boxShadow: "0 4px 20px rgba(0,0,0,0.05)" }}
                    title={
                        <Space>
                            <DollarOutlined />
                            <span>{language === "my" ? "လမ်းကြောင်းအလိုက် နှုန်းထားများ" : "Shipping Route Rates"}</span>
                        </Space>
                    }
                >
                    {rates.length === 0 && !loading ? (
                        <div style={{ textAlign: "center", padding: "40px 0" }}>
                            <Text type="secondary">
                                {language === "my"
                                    ? "ပို့ဆောင်ခ နှုန်းထားများ မရှိသေးပါ။ \"လမ်းကြောင်းထည့်မည်\" ကိုနှိပ်ပြီး ထည့်သွင်းပါ။"
                                    : "No rates yet. Click \"Add Route\" to get started."}
                            </Text>
                        </div>
                    ) : (
                        <Table columns={columns} dataSource={rates} rowKey="id" loading={loading}
                            pagination={{ pageSize: 10 }} />
                    )}
                </Card>

                {/* Add/Edit Rate Modal */}
                <Modal
                    title={editing
                        ? (language === "my" ? "လမ်းကြောင်းပြင်ဆင်ရန်" : "Edit Route")
                        : (language === "my" ? "လမ်းကြောင်းအသစ်ထည့်ရန်" : "Add Route")
                    }
                    open={modalVisible}
                    onCancel={() => { setModalVisible(false); setEditing(null); }}
                    footer={null}
                    destroyOnClose
                >
                    <Form form={form} layout="vertical" onFinish={handleSave}>
                        <Form.Item name="country" label={language === "my" ? "လမ်းကြောင်း" : "Route"}
                            rules={[{ required: true, message: "Required" }]}>
                            <Select
                                showSearch
                                placeholder={language === "my" ? "လမ်းကြောင်းရွေးပါ သို့မဟုတ် အသစ်ရိုက်ထည့်ပါ" : "Select or type new Route"}
                                tokenSeparators={[',']}
                                options={[
                                    { value: 'Thailand -> Myanmar', label: '🇹🇭 ထိုင်း -> မြန်မာ 🇲🇲' },
                                    { value: 'China -> Myanmar', label: '🇨🇳 တရုတ် -> မြန်မာ 🇲🇲' },
                                    { value: 'Korea -> Myanmar', label: '🇰🇷 ကိုရီးယား -> မြန်မာ 🇲🇲' },
                                    { value: 'Japan -> Myanmar', label: '🇯🇵 ဂျပန် -> မြန်မာ 🇲🇲' },
                                    { value: 'Other', label: '🌍 အခြား (Other)' },
                                    ...countries.filter(c => !['Thailand -> Myanmar', 'China -> Myanmar', 'Korea -> Myanmar', 'Japan -> Myanmar', 'Other'].includes(c)).map(c => ({ value: c, label: c }))
                                ]}
                                dropdownRender={(menu) => (
                                    <>
                                        {menu}
                                        <Divider style={{ margin: '8px 0' }} />
                                        <div style={{ padding: '0 8px 4px' }}>
                                            <Input
                                                placeholder={language === "my" ? "နိုင်ငံအမည်အသစ်..." : "Type new country..."}
                                                onKeyDown={(e) => {
                                                    if (e.key === 'Enter') {
                                                        const val = (e.target as HTMLInputElement).value;
                                                        if (val) {
                                                            form.setFieldsValue({ country: val });
                                                            e.stopPropagation();
                                                        }
                                                    }
                                                }}
                                            />
                                        </div>
                                    </>
                                )}
                            />
                        </Form.Item>
                        <Form.Item name="shipping_type" label={language === "my" ? "ပို့ဆောင်မှုအမျိုးအစား" : "Shipping Type"}
                            rules={[{ required: true, message: "Required" }]}>
                            <Select
                                showSearch
                                placeholder={language === "my" ? "ရွေးပါ သို့မဟုတ် အသစ်ရိုက်ပါ" : "Select or type new"}
                                options={[
                                    { value: 'Air', label: '✈️ Air (လေကြောင်း)' },
                                    { value: 'Express', label: '⚡ Express' },
                                    { value: 'Sea', label: '🚢 Sea (ရေကြောင်း)' },
                                    ...shippingTypes.filter(t => !['Air', 'Express', 'Sea'].includes(t)).map(t => ({ value: t, label: t }))
                                ]}
                                dropdownRender={(menu) => (
                                    <>
                                        {menu}
                                        <Divider style={{ margin: '8px 0' }} />
                                        <div style={{ padding: '0 8px 4px' }}>
                                            <Input
                                                placeholder={language === "my" ? "အမျိုးအစားအသစ်..." : "Type new type..."}
                                                onKeyDown={(e) => {
                                                    if (e.key === 'Enter') {
                                                        const val = (e.target as HTMLInputElement).value;
                                                        if (val) {
                                                            form.setFieldsValue({ shipping_type: val });
                                                            e.stopPropagation();
                                                        }
                                                    }
                                                }}
                                            />
                                        </div>
                                    </>
                                )}
                            />
                        </Form.Item>
                        <Form.Item name="item_category" label={language === "my" ? "ပစ္စည်းအမျိုးအစား" : "Item Category"}
                            initialValue="General"
                            rules={[{ required: true, message: "Required" }]}>
                            <Select placeholder={language === "my" ? "ရွေးပါ" : "Select"}>
                                <Select.Option value="General">📦 General</Select.Option>
                                <Select.Option value="Electronics">📱 Electronics</Select.Option>
                                <Select.Option value="Cosmetics">🧴 Cosmetics</Select.Option>
                                <Select.Option value="Food">🍜 Food</Select.Option>
                                <Select.Option value="Clothing">👗 Clothing</Select.Option>
                            </Select>
                        </Form.Item>
                        <Row gutter={16}>
                            <Col span={12}>
                                <Form.Item name="rate_per_kg" label={language === "my" ? "နှုန်း (per kg)" : "Rate (per kg)"}
                                    rules={[{ required: true, message: "Required" }]}>
                                    <InputNumber style={{ width: "100%" }} min={0} />
                                </Form.Item>
                            </Col>
                            <Col span={12}>
                                <Form.Item name="currency" label={language === "my" ? "ငွေကြေး" : "Currency"}>
                                    <Select>
                                        <Select.Option value="THB">THB (Baht)</Select.Option>
                                        <Select.Option value="MMK">MMK (Kyat)</Select.Option>
                                        <Select.Option value="USD">USD</Select.Option>
                                    </Select>
                                </Form.Item>
                            </Col>
                        </Row>
                        <Form.Item>
                            <Button type="primary" htmlType="submit" loading={saving} block
                                style={{ background: "#f59e0b", borderColor: "#f59e0b" }}>
                                {editing
                                    ? (language === "my" ? "သိမ်းဆည်းမည်" : "Save Changes")
                                    : (language === "my" ? "ထည့်သွင်းမည်" : "Add Rate")
                                }
                            </Button>
                        </Form.Item>
                    </Form>
                </Modal>
            </div>
        </AuthGuard>
    );
}
