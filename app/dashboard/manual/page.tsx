"use client";

import { Typography, Card, Space, Divider, Button, Collapse, Tag } from "antd";
import {
    BookOutlined,
    FacebookOutlined,
    RobotOutlined,
    ShoppingCartOutlined,
    RocketOutlined,
    CheckCircleOutlined,
    ArrowLeftOutlined,
    QuestionCircleOutlined
} from "@ant-design/icons";
import { useRouter } from "next/navigation";
import AuthGuard from "@/components/AuthGuard";
import { useLanguage } from "@/lib/i18n/LanguageContext";
import { useFestivalTheme } from "@/lib/ThemeContext";

const { Title, Text, Paragraph } = Typography;
const { Panel } = Collapse;

export default function ManualPage() {
    const router = useRouter();
    const { t, language } = useLanguage();
    const { theme, mode } = useFestivalTheme();
    const isDark = mode === 'dark';

    const steps = [
        {
            title: language === 'my' ? "၁။ Facebook Page ချိတ်ဆက်ခြင်း" : "1. Connecting Facebook Page",
            icon: <FacebookOutlined />,
            content: language === 'my'
                ? "Social Platforms page သို့သွားပြီး 'Connect Facebook Page' ကိုနှိပ်ပါ။ သင်အလိုအလျောက်ပြန်ကြားစေလိုသော Page ကို ရွေးချယ်ပါ။"
                : "Go to the Social Platforms page and click 'Connect Facebook Page'. Choose the page you want to automate."
        },
        {
            title: language === 'my' ? "၂။ Flow များ ဖန်တီးခြင်း" : "2. Creating Flows",
            icon: <RocketOutlined />,
            content: language === 'my'
                ? "Auto-Reply Flows page တွင် 'Create New Flow' ကိုနှိပ်ပါ။ Trigger keyword (ဥပမာ- 'ဝယ်မယ်') ကို သတ်မှတ်ပြီး သိမ်းဆည်းပါ။"
                : "Click 'Create New Flow' on the Auto-Reply Flows page. Set a trigger keyword (e.g., 'buy') and save."
        },
        {
            title: language === 'my' ? "၃။ AI Power-Up အသုံးပြုခြင်း" : "3. Using AI Power-Up",
            icon: <RobotOutlined />,
            content: language === 'my'
                ? "Flow configuration ထဲတွင် 'AI Prompt' ကဏ္ဍကို တွေ့ရပါမည်။ ထိုနေရာတွင် Gemini AI အတွက် ညွှန်ကြားချက်များ (ဥပမာ- ယဉ်ကျေးစွာ ပြန်ကြားပေးရန်) ကို ထည့်သွင်းနိုင်ပါသည်။"
                : "In the flow configuration, you'll find the 'AI Prompt' section. You can enter instructions for Gemini AI (e.g., reply politely)."
        },
        {
            title: language === 'my' ? "၄။ အမှာစာများ စစ်ဆေးခြင်း" : "4. Checking Orders",
            icon: <ShoppingCartOutlined />,
            content: language === 'my'
                ? "Customer မှ အော်ဒါတင်လိုက်ပါက 'Orders' page တွင် အလိုအလျောက် ပေါ်လာပါမည်။ ထိုမှတဆင့် Stock များ လျော့သွားခြင်းနှင့် အမှာစာ အခြေအနေများကို စစ်ဆေးနိုင်ပါသည်။"
                : "When a customer places an order, it will automatically appear on the 'Orders' page. From there, you can check stock deduction and order status."
        }
    ];

    return (
        <AuthGuard>
            <div style={{
                minHeight: "100vh",
                background: isDark ? "#0f172a" : "#f8fafc",
                padding: "40px 24px",
                paddingTop: "24px"
            }}>
                <div style={{ maxWidth: "800px", margin: "0 auto" }}>
                    <Button
                        icon={<ArrowLeftOutlined />}
                        onClick={() => router.back()}
                        style={{ marginBottom: 24 }}
                        type="text"
                    >
                        {language === 'my' ? "ပြန်သွားမည်" : "Back"}
                    </Button>

                    <Card bordered={false} style={{ borderRadius: 24, padding: "12px" }}>
                        <Space align="center" style={{ marginBottom: 24 }}>
                            <div style={{
                                background: theme.primaryColor,
                                width: 48,
                                height: 48,
                                borderRadius: 16,
                                display: 'flex',
                                justifyContent: 'center',
                                alignItems: 'center',
                                color: '#fff',
                                fontSize: 24
                            }}>
                                <BookOutlined />
                            </div>
                            <div>
                                <Title level={2} style={{ margin: 0 }}>{t.nav.manual}</Title>
                                <Text type="secondary">{language === 'my' ? "Vibe Auto-Reply ကို ဘယ်လိုသုံးမလဲ" : "How to use Vibe Auto-Reply"}</Text>
                            </div>
                        </Space>

                        <Paragraph style={{ fontSize: 16 }}>
                            {language === 'my'
                                ? "Vibe ကို အသုံးပြုပြီး သင့်ရဲ့ Facebook Page ဝင်စာတွေကို အလိုအလျောက် ပြန်ကြားပေးနိုင်ပါတယ်။ အောက်ပါ အဆင့်လေးတွေကို လိုက်လုပ်ကြည့်ပါ။"
                                : "With Vibe, you can automatically reply to your Facebook Page messages. Follow these steps to get started."}
                        </Paragraph>

                        <Divider />

                        <Space direction="vertical" size="large" style={{ width: '100%' }}>
                            {steps.map((step, idx) => (
                                <div key={idx} style={{ display: 'flex', gap: 16 }}>
                                    <div style={{ fontSize: 24, color: theme.primaryColor, marginTop: 4 }}>
                                        {step.icon}
                                    </div>
                                    <div>
                                        <Title level={4} style={{ margin: 0 }}>{step.title}</Title>
                                        <Text>{step.content}</Text>
                                    </div>
                                </div>
                            ))}
                        </Space>

                        <Divider />

                        <Title level={4}>
                            <QuestionCircleOutlined /> {language === 'my' ? "အမေးများသော မေးခွန်းများ" : "Frequently Asked Questions"}
                        </Title>

                        <Collapse ghost expandIconPosition="end">
                            <Panel header={language === 'my' ? "ဘယ်လောက် ကုန်ကျမလဲ?" : "How much does it cost?"} key="1">
                                <Text>
                                    {language === 'my'
                                        ? "၇ ရက် အခမဲ့ စမ်းသပ်သုံးစွဲနိုင်ပါတယ်။ ထို့နောက် online shop များအတွက် တစ်လလျှင် ၅၀၀ ဘတ် (သို့မဟုတ်) ၄၀,၀၀၀ ကျပ် ဝန်းကျင် ကျသင့်မှာ ဖြစ်ပါတယ်။"
                                        : "You can try it free for 7 days. After that, it costs around 500 Baht per month for online shops."}
                                </Text>
                            </Panel>
                            <Panel header={language === 'my' ? "Gemini AI က ဘာတွေလုပ်ပေးတာလဲ?" : "What does Gemini AI do?"} key="2">
                                <Text>
                                    {language === 'my'
                                        ? "Gemini AI က ဖောက်သည်တွေရဲ့ စကားပြောပုံကို နားလည်ပြီး လူကိုယ်တိုင် ပြန်သလိုမျိုး သဘာဝကျကျနဲ့ ယဉ်ကျေးစွာ ပြန်ပေးနိုင်ပါတယ်။ ပစ္စည်းအချက်အလက်တွေကိုလည်း အလိုအလျောက် ခွဲထုတ်ပေးနိုင်ပါတယ်။"
                                        : "Gemini AI understands customer intent and replies naturally and politely, just like a human. It can also extract product details automatically from conversations."}
                                </Text>
                            </Panel>
                        </Collapse>

                        <div style={{
                            marginTop: 40,
                            padding: 24,
                            background: theme.primaryColor + '10',
                            borderRadius: 16,
                            textAlign: 'center',
                            border: `1px dashed ${theme.primaryColor}`
                        }}>
                            <Title level={5} style={{ color: theme.primaryColor }}>
                                <CheckCircleOutlined /> {language === 'my' ? "အားလုံး အဆင်သင့်ဖြစ်ပြီလား?" : "Ready to go?"}
                            </Title>
                            <Button type="primary" size="large" onClick={() => router.push("/dashboard")} style={{ marginTop: 12 }}>
                                {language === 'my' ? "Dashboard သို့ သွားမည်" : "Go to Dashboard"}
                            </Button>
                        </div>
                    </Card>
                </div>
            </div>
        </AuthGuard>
    );
}
