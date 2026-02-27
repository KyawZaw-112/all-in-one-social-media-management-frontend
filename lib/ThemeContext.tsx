'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';

export interface BurmeseFestivalTheme {
    monthName: string;
    burmeseMonth: string;
    festivalName: string;
    primaryColor: string;
    secondaryColor: string;
    icon: string;
    description: string;
}

const festivalThemes: Record<number, BurmeseFestivalTheme> = {
    0: {
        monthName: "January",
        burmeseMonth: "Pyatho (ပြာသို)",
        festivalName: "Equestrian Festival (မြင်းခင်းသဘင်)",
        primaryColor: "#d4af37", // Gold
        secondaryColor: "#8b4513",
        icon: "🐎",
        description: "The month of Pyatho features the traditional equestrian and military skills competition."
    },
    1: {
        monthName: "February",
        burmeseMonth: "Tabodwe (တပို့တွဲ)",
        festivalName: "Htamane Festival (ထမနဲပွဲ)",
        primaryColor: "#ff8c00", // DarkOrange
        secondaryColor: "#f4a460",
        icon: "🥣",
        description: "The month of sticky rice making (Htamane), a communal tradition of sharing delicious treats."
    },
    2: {
        monthName: "March",
        burmeseMonth: "Tabaung (တပေါင်း)",
        festivalName: "Sand Pagoda Festival (သဲပုံစေတီပွဲ)",
        primaryColor: "#c2b280", // Sand
        secondaryColor: "#4a4a4a",
        icon: "🏖️",
        description: "The month of sand pagoda building, often celebrated at the Shwedagon Pagoda."
    },
    3: {
        monthName: "April",
        burmeseMonth: "Tagu (တန်ခူး)",
        festivalName: "Thingyan Water Festival (သင်္ကြန်ပွဲတော်)",
        primaryColor: "#00bfff", // DeepSkyBlue
        secondaryColor: "#1e90ff",
        icon: "💦",
        description: "The Myanmar New Year Water Festival, celebrating the washing away of past sins."
    },
    4: {
        monthName: "May",
        burmeseMonth: "Kason (ကဆုန်)",
        festivalName: "Banyan Tree Watering Festival (ကဆုန်ညောင်ရေသွန်းပွဲ)",
        primaryColor: "#228b22", // ForestGreen
        secondaryColor: "#006400",
        icon: "🌳",
        description: "The month of watering the Banyan tree, marking Buddha's birth, enlightenment, and parinirvana."
    },
    5: {
        monthName: "June",
        burmeseMonth: "Nayone (နယုန်)",
        festivalName: "Tipitaka Festival (စာပြန်ပွဲ)",
        primaryColor: "#9370db", // MediumPurple
        secondaryColor: "#4b0082",
        icon: "📚",
        description: "The month for Buddhist scriptural examinations (Tipitaka Examination)."
    },
    6: {
        monthName: "July",
        burmeseMonth: "Waso (ဝါဆို)",
        festivalName: "Dhammasekya Day (ဝါဆိုပွဲတော်)",
        primaryColor: "#b22222", // Firebrick
        secondaryColor: "#800000",
        icon: "🕯️",
        description: "The start of Buddhist Lent (Waso), a period of reflection and devotion."
    },
    7: {
        monthName: "August",
        burmeseMonth: "Wagaung (ဝါခေါင်)",
        festivalName: "Metta Day & Say-tan-pwe (မေတ္တာအခါတော်နေ့)",
        primaryColor: "#ff69b4", // HotPink
        secondaryColor: "#c71585",
        icon: "💖",
        description: "A month for spreading loving-kindness and holding alms-giving festivals."
    },
    8: {
        monthName: "September",
        burmeseMonth: "Tawthalin (တော်သလင်း)",
        festivalName: "Boat Racing Festival (လှေလှော်ပွဲတော်)",
        primaryColor: "#008080", // Teal
        secondaryColor: "#2f4f4f",
        icon: "🛶",
        description: "The traditional boat racing month on Myanmar's large rivers and lakes."
    },
    9: {
        monthName: "October",
        burmeseMonth: "Thadingyut (သီတင်းကျွတ်)",
        festivalName: "Festival of Lights (မီးထွန်းပွဲတော်)",
        primaryColor: "#ff4500", // OrangeRed
        secondaryColor: "#ffd700",
        icon: "🏮",
        description: "The Festival of Lights, marking Buddha's return from Tavatimsa Heaven."
    },
    10: {
        monthName: "November",
        burmeseMonth: "Tazaungmon (တန်ဆောင်မုန်း)",
        festivalName: "Tazaungdaing Balloon Festival (တန်ဆောင်တိုင်ပွဲတော်)",
        primaryColor: "#8a2be2", // BlueViolet
        secondaryColor: "#483d8b",
        icon: "🎈",
        description: "The hot air balloon festival and weaving contests (Matho Thingan)."
    },
    11: {
        monthName: "December",
        burmeseMonth: "Nadaw (နတ်တော်)",
        festivalName: "Sarsodaw Day (Poet's Day) (စာဆိုတော်နေ့)",
        primaryColor: "#8b4513", // SaddleBrown
        secondaryColor: "#cd853f",
        icon: "✍️",
        description: "A month honoring Myanmar's great poets and literary heritage."
    }
};

interface ThemeContextType {
    theme: BurmeseFestivalTheme;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [currentTheme, setCurrentTheme] = useState<BurmeseFestivalTheme>(festivalThemes[new Date().getMonth()]);

    useEffect(() => {
        const month = new Date().getMonth();
        const theme = festivalThemes[month];
        setCurrentTheme(theme);

        // Update CSS Variables
        document.documentElement.style.setProperty('--primary-500', theme.primaryColor);
        document.documentElement.style.setProperty('--festival-name', `'${theme.festivalName}'`);

        // Also update Meta theme-color for PWA/Mobile address bar
        const metaThemeColor = document.querySelector('meta[name="theme-color"]');
        if (metaThemeColor) {
            metaThemeColor.setAttribute('content', theme.primaryColor);
        }
    }, []);

    return (
        <ThemeContext.Provider value={{ theme: currentTheme }}>
            {children}
        </ThemeContext.Provider>
    );
};

export const useFestivalTheme = () => {
    const context = useContext(ThemeContext);
    if (context === undefined) {
        throw new Error('useFestivalTheme must be used within a ThemeProvider');
    }
    return context;
};
