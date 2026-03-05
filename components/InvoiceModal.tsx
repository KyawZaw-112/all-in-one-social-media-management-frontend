import React from 'react';
import { Modal, Button, Typography, Space, Divider, Row, Col, Table } from 'antd';
import { DownloadOutlined, FileTextOutlined } from '@ant-design/icons';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

const { Title, Text } = Typography;

interface InvoiceModalProps {
    visible: boolean;
    onClose: () => void;
    paymentData: {
        userId: string;
        userName: string;
        userEmail: string;
        amount: string;
        reference: string;
        provider: string;
        date: string;
        plan: string;
    } | null;
}

const InvoiceModal: React.FC<InvoiceModalProps> = ({ visible, onClose, paymentData }) => {
    if (!paymentData) return null;

    const downloadPDF = () => {
        const doc = new jsPDF();

        // Add Title
        doc.setFontSize(22);
        doc.setTextColor(114, 46, 209); // #722ed1
        doc.text('Vibe - Invoice', 105, 20, { align: 'center' });

        doc.setFontSize(10);
        doc.setTextColor(100);
        doc.text('Facebook Auto-Reply Platform', 105, 27, { align: 'center' });

        doc.setDrawColor(200);
        doc.line(20, 35, 190, 35);

        // Billing Info
        doc.setFontSize(12);
        doc.setTextColor(0);
        doc.text('Bill To:', 20, 45);
        doc.setFontSize(10);
        doc.text(`Name: ${paymentData.userName}`, 20, 52);
        doc.text(`Email: ${paymentData.userEmail}`, 20, 57);
        doc.text(`User ID: ${paymentData.userId}`, 20, 62);

        doc.setFontSize(12);
        doc.text('Invoice Details:', 140, 45);
        doc.setFontSize(10);
        doc.text(`Date: ${paymentData.date}`, 140, 52);
        doc.text(`Reference: ${paymentData.reference}`, 140, 57);
        doc.text(`Status: Pending Approval`, 140, 62);

        // Table
        autoTable(doc, {
            startY: 75,
            head: [['Description', 'Provider', 'Amount']],
            body: [
                [`Subscription Plan: ${paymentData.plan}`, paymentData.provider, paymentData.amount]
            ],
            headStyles: { fillColor: [114, 46, 209] }, // #722ed1
            theme: 'striped'
        });

        const lastAutoTable = (doc as any).lastAutoTable;
        const finalY = lastAutoTable ? lastAutoTable.finalY + 10 : 100;

        doc.setFontSize(12);
        doc.text(`Total: ${paymentData.amount}`, 140, finalY + 5);

        doc.setFontSize(8);
        doc.setTextColor(150);
        doc.text('Thank you for using Vibe!', 105, 280, { align: 'center' });
        doc.text('Kyaw Zaw Win | vibe.myanmar@gmail.com', 105, 285, { align: 'center' });

        doc.save(`Invoice_${paymentData.reference}.pdf`);
    };

    return (
        <Modal
            title={<Space><FileTextOutlined /> Invoice Details</Space>}
            open={visible}
            onCancel={onClose}
            footer={[
                <Button key="close" onClick={onClose}>Close</Button>,
                <Button key="download" type="primary" icon={<DownloadOutlined />} onClick={downloadPDF}>
                    Download PDF
                </Button>
            ]}
            width={600}
        >
            <div id="invoice-content" style={{ padding: '20px 0' }}>
                <div style={{ textAlign: 'center', marginBottom: 20 }}>
                    <Title level={3} style={{ color: '#722ed1', margin: 0 }}>Vibe</Title>
                    <Text type="secondary">Payment Confirmation & Invoice</Text>
                </div>

                <Divider />

                <Row gutter={24}>
                    <Col span={12}>
                        <Text strong>Bill To:</Text>
                        <div style={{ marginTop: 8 }}>
                            <Text style={{ display: 'block' }}>{paymentData.userName}</Text>
                            <Text style={{ display: 'block' }} type="secondary">{paymentData.userEmail}</Text>
                            <Text type="secondary" style={{ display: 'block', fontSize: 12 }}>ID: {paymentData.userId}</Text>
                        </div>
                    </Col>
                    <Col span={12} style={{ textAlign: 'right' }}>
                        <Text strong>Invoice Info:</Text>
                        <div style={{ marginTop: 8 }}>
                            <Text style={{ display: 'block' }}>Date: {paymentData.date}</Text>
                            <Text style={{ display: 'block' }}>Ref: {paymentData.reference}</Text>
                            <Text style={{ display: 'block', color: '#fa8c16' }}>Status: Pending Approval</Text>
                        </div>
                    </Col>
                </Row>

                <Table
                    pagination={false}
                    style={{ marginTop: 24 }}
                    dataSource={[
                        {
                            key: '1',
                            desc: `Subscription Plan: ${paymentData.plan}`,
                            provider: paymentData.provider,
                            amount: paymentData.amount
                        }
                    ]}
                    columns={[
                        { title: 'Description', dataIndex: 'desc', key: 'desc' },
                        { title: 'Method', dataIndex: 'provider', key: 'provider' },
                        { title: 'Amount', dataIndex: 'amount', key: 'amount', align: 'right' }
                    ]}
                />

                <div style={{ textAlign: 'right', marginTop: 24, paddingRight: 12 }}>
                    <Title level={4}>Total: {paymentData.amount}</Title>
                </div>

                <Divider />

                <div style={{ textAlign: 'center' }}>
                    <Text type="secondary" style={{ fontSize: 12 }}>
                        Kyaw Zaw Win | vibe.myanmar@gmail.com
                    </Text>
                    <br />
                    <Text type="secondary" style={{ fontSize: 10 }}>
                        Thank you for your business!
                    </Text>
                </div>
            </div>
        </Modal>
    );
};

export default InvoiceModal;
