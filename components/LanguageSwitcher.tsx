"use client";

import React from "react";
import { Dropdown, Button, MenuProps } from "antd";
import { GlobalOutlined, DownOutlined } from "@ant-design/icons";
import { useLanguage } from "@/lib/i18n/LanguageContext";
import { languageFlags, languageNames, Language } from "@/lib/i18n/translations";

export default function LanguageSwitcher() {
    const { language, setLanguage } = useLanguage();

    const items: MenuProps["items"] = [
        {
            key: "my",
            label: (
                <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                    <span>{languageFlags.my}</span>
                    <span>{languageNames.my}</span>
                </div>
            ),
            onClick: () => setLanguage("my"),
        },
        {
            key: "en",
            label: (
                <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                    <span>{languageFlags.en}</span>
                    <span>{languageNames.en}</span>
                </div>
            ),
            onClick: () => setLanguage("en"),
        },
        {
            key: "th",
            label: (
                <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                    <span>{languageFlags.th}</span>
                    <span>{languageNames.th}</span>
                </div>
            ),
            onClick: () => setLanguage("th"),
        },

    ];

    return (
        <Dropdown menu={{ items }} placement="bottomRight" trigger={['click']}>
            <Button
                type="text"
                style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 6,
                    color: "inherit"
                }}
            >
                <GlobalOutlined />
                <span className="hidden sm:inline" style={{ fontWeight: 500 }}>
                    {languageNames[language]}
                </span>
                <DownOutlined style={{ fontSize: 10 }} />
            </Button>
        </Dropdown>
    );
}
