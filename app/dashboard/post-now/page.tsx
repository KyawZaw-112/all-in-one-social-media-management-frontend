import React, { useState } from 'react';
import {
    Button,
    Card,
    Input,
    Space,
    Avatar,
    Switch,
    Upload,
    message,
    DatePicker,
    Progress,
    Tag,
} from 'antd';
import {
    FacebookFilled,
    TwitterOutlined,
    InstagramFilled,
    LinkedinFilled,
    PictureOutlined,
    CalendarOutlined,
    SendOutlined,
    CloseCircleOutlined,
} from '@ant-design/icons';
import type { UploadFile } from 'antd/es/upload/interface';
import dayjs, { Dayjs } from 'dayjs';

const { TextArea } = Input;

interface Platform {
    id: string;
    name: string;
    icon: React.ReactNode;
    color: string;
    maxChars: number;
    enabled: boolean;
}

const PostToAllPlatforms: React.FC = () => {
    const [platforms, setPlatforms] = useState<Platform[]>([
        {
            id: 'facebook',
            name: 'Facebook',
            icon: <FacebookFilled />,
            color: '#1877F2',
            maxChars: 63206,
            enabled: true,
        },
        {
            id: 'twitter',
            name: 'Twitter',
            icon: <TwitterOutlined />,
            color: '#1DA1F2',
            maxChars: 280,
            enabled: true,
        },
        {
            id: 'instagram',
            name: 'Instagram',
            icon: <InstagramFilled />,
            color: '#E4405F',
            maxChars: 2200,
            enabled: true,
        },
        {
            id: 'linkedin',
            name: 'LinkedIn',
            icon: <LinkedinFilled />,
            color: '#0A66C2',
            maxChars: 3000,
            enabled: true,
        },
    ]);

    const [postContent, setPostContent] = useState('');
    const [fileList, setFileList] = useState<UploadFile[]>([]);
    const [scheduleDate, setScheduleDate] = useState<Dayjs | null>(null);
    const [isScheduled, setIsScheduled] = useState(false);
    const [isPosting, setIsPosting] = useState(false);

    const enabledPlatforms = platforms.filter((p) => p.enabled);
    const minMaxChars = Math.min(...enabledPlatforms.map((p) => p.maxChars));
    const charCount = postContent.length;
    const charPercentage = (charCount / minMaxChars) * 100;

    const togglePlatform = (id: string) => {
        setPlatforms(
            platforms.map((p) => (p.id === id ? { ...p, enabled: !p.enabled } : p))
        );
    };

    const handlePost = async () => {
        if (!postContent.trim()) {
            message.warning('Please write something to post');
            return;
        }

        if (enabledPlatforms.length === 0) {
            message.warning('Please select at least one platform');
            return;
        }

        if (charCount > minMaxChars) {
            message.error(`Post exceeds character limit for selected platforms`);
            return;
        }

        setIsPosting(true);

        try {
            // Simulate API call
            await new Promise((resolve) => setTimeout(resolve, 2000));

            const enabledPlatformNames = enabledPlatforms.map((p) => p.name).join(', ');

            if (isScheduled && scheduleDate) {
                message.success(
                    `Post scheduled for ${scheduleDate.format('MMM DD, YYYY HH:mm')} on ${enabledPlatformNames}`
                );
            } else {
                message.success(`Posted successfully to ${enabledPlatformNames}!`);
            }

            // Reset form
            setPostContent('');
            setFileList([]);
            setScheduleDate(null);
            setIsScheduled(false);
        } catch (error) {
            message.error('Failed to post. Please try again.');
        } finally {
            setIsPosting(false);
        }
    };

    const uploadProps = {
        fileList,
        beforeUpload: (file: File) => {
            const isImage = file.type.startsWith('image/');
            if (!isImage) {
                message.error('You can only upload image files!');
                return false;
            }
            const isLt5M = file.size / 1024 / 1024 < 5;
            if (!isLt5M) {
                message.error('Image must be smaller than 5MB!');
                return false;
            }
            return false;
        },
        onChange: ({ fileList: newFileList }: { fileList: UploadFile[] }) => {
            setFileList(newFileList.slice(0, 4)); // Max 4 images
        },
        onRemove: (file: UploadFile) => {
            setFileList(fileList.filter((f) => f.uid !== file.uid));
        },
        listType: 'picture-card' as const,
        maxCount: 4,
    };

    return (
        <div
            style={{
                minHeight: '100vh',
                background: '#f5f5f5',
                padding: '16px',
                maxWidth: '600px',
                margin: '0 auto',
            }}
        >
            <Card
                bordered={false}
                style={{
                    borderRadius: '16px',
                    boxShadow: '0 2px 8px rgba(0,0,0,0.06)',
                }}
            >
                {/* Header */}
                <div style={{ marginBottom: '24px' }}>
                    <h2 style={{ margin: 0, fontSize: '20px', fontWeight: 600 }}>
                        Create Post
                    </h2>
                    <p style={{ margin: '4px 0 0', color: '#8c8c8c', fontSize: '14px' }}>
                        Share to multiple platforms at once
                    </p>
                </div>

                {/* Platform Selection */}
                <div style={{ marginBottom: '20px' }}>
                    <Space size={12} wrap>
                        {platforms.map((platform) => (
                            <div
                                key={platform.id}
                                onClick={() => togglePlatform(platform.id)}
                                style={{
                                    cursor: 'pointer',
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: '8px',
                                    padding: '8px 14px',
                                    borderRadius: '20px',
                                    border: `2px solid ${platform.enabled ? platform.color : '#d9d9d9'}`,
                                    background: platform.enabled ? `${platform.color}10` : '#fff',
                                    transition: 'all 0.2s',
                                }}
                            >
                                <Avatar
                                    size={24}
                                    style={{
                                        background: platform.enabled ? platform.color : '#d9d9d9',
                                        fontSize: '14px',
                                    }}
                                    icon={platform.icon}
                                />
                                <span
                                    style={{
                                        fontSize: '14px',
                                        fontWeight: platform.enabled ? 500 : 400,
                                        color: platform.enabled ? '#262626' : '#8c8c8c',
                                    }}
                                >
                  {platform.name}
                </span>
                            </div>
                        ))}
                    </Space>
                </div>

                {/* Text Area */}
                <div style={{ marginBottom: '16px' }}>
                    <TextArea
                        value={postContent}
                        onChange={(e) => setPostContent(e.target.value)}
                        placeholder="What's on your mind?"
                        autoSize={{ minRows: 4, maxRows: 8 }}
                        style={{
                            fontSize: '15px',
                            border: '1px solid #f0f0f0',
                            borderRadius: '12px',
                            padding: '12px',
                        }}
                        maxLength={minMaxChars}
                    />

                    {/* Character Counter */}
                    {charCount > 0 && (
                        <div style={{ marginTop: '8px' }}>
                            <Progress
                                percent={charPercentage}
                                showInfo={false}
                                strokeColor={charPercentage > 90 ? '#ff4d4f' : '#1890ff'}
                                style={{ marginBottom: '4px' }}
                            />
                            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px' }}>
                <span style={{ color: '#8c8c8c' }}>
                  {charCount} / {minMaxChars} characters
                </span>
                                {charPercentage > 90 && (
                                    <span style={{ color: '#ff4d4f' }}>
                    {minMaxChars - charCount} left
                  </span>
                                )}
                            </div>
                        </div>
                    )}
                </div>

                {/* Image Upload */}
                <div style={{ marginBottom: '16px' }}>
                    <Upload {...uploadProps}>
                        {fileList.length < 4 && (
                            <div
                                style={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    flexDirection: 'column',
                                    gap: '4px',
                                }}
                            >
                                <PictureOutlined style={{ fontSize: '24px', color: '#8c8c8c' }} />
                                <span style={{ fontSize: '12px', color: '#8c8c8c' }}>Add Photo</span>
                            </div>
                        )}
                    </Upload>
                </div>

                {/* Schedule Toggle */}
                <div
                    style={{
                        marginBottom: '16px',
                        padding: '12px',
                        background: '#fafafa',
                        borderRadius: '12px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                    }}
                >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <CalendarOutlined style={{ fontSize: '18px', color: '#8c8c8c' }} />
                        <span style={{ fontSize: '14px' }}>Schedule Post</span>
                    </div>
                    <Switch checked={isScheduled} onChange={setIsScheduled} />
                </div>

                {/* Date Picker */}
                {isScheduled && (
                    <div style={{ marginBottom: '20px' }}>
                        <DatePicker
                            showTime
                            value={scheduleDate}
                            onChange={setScheduleDate}
                            placeholder="Select date and time"
                            style={{ width: '100%', borderRadius: '8px' }}
                            disabledDate={(current) => current && current < dayjs().startOf('day')}
                        />
                    </div>
                )}

                {/* Action Buttons */}
                <Space style={{ width: '100%' }} direction="vertical" size={12}>
                    <Button
                        type="primary"
                        size="large"
                        block
                        icon={<SendOutlined />}
                        onClick={handlePost}
                        loading={isPosting}
                        disabled={enabledPlatforms.length === 0}
                        style={{
                            height: '48px',
                            borderRadius: '12px',
                            fontSize: '16px',
                            fontWeight: 500,
                        }}
                    >
                        {isScheduled ? 'Schedule Post' : 'Post Now'}
                    </Button>

                    {(postContent || fileList.length > 0) && (
                        <Button
                            size="large"
                            block
                            icon={<CloseCircleOutlined />}
                            onClick={() => {
                                setPostContent('');
                                setFileList([]);
                                setScheduleDate(null);
                            }}
                            style={{
                                height: '44px',
                                borderRadius: '12px',
                                border: 'none',
                                color: '#8c8c8c',
                            }}
                        >
                            Clear
                        </Button>
                    )}
                </Space>

                {/* Platform Indicators */}
                {enabledPlatforms.length > 0 && (
                    <div style={{ marginTop: '16px', textAlign: 'center' }}>
                        <Space size={4} wrap>
                            <span style={{ fontSize: '12px', color: '#8c8c8c' }}>Posting to:</span>
                            {enabledPlatforms.map((platform) => (
                                <Tag
                                    key={platform.id}
                                    color={platform.color}
                                    style={{ borderRadius: '4px', fontSize: '11px', margin: '2px' }}
                                >
                                    {platform.name}
                                </Tag>
                            ))}
                        </Space>
                    </div>
                )}
            </Card>
        </div>
    );
};

export default PostToAllPlatforms;