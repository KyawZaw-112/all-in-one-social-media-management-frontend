export type Language = "en" | "my" | "th";

export const languageNames: Record<Language, string> = {
    en: "English",
    my: "မြန်မာ",
    th: "ไทย",
};

export const languageFlags: Record<Language, string> = {
    en: "🇬🇧",
    my: "🇲🇲",
    th: "🇹🇭",
};

// Define structure explicitly to avoid literal type inference issues
export type TranslationKeys = {
    nav: {
        login: string;
        getStarted: string;
        signOut: string;
    };
    landing: {
        badge: string;
        headline: string;
        subtitle: string;
        subtitleLine2: string;
        ctaStart: string;
        ctaLearn: string;
        trustNoCc: string;
        trustTrial: string;
        trustCancel: string;
        featuresLabel: string;
        featuresTitle: string;
        featureNoAi: string;
        featureNoAiDesc: string;
        featureSmartReply: string;
        featureSmartReplyDesc: string;
        featureMobile: string;
        featureMobileDesc: string;
        featureLang: string;
        featureLangDesc: string;
        featureDashboard: string;
        featureDashboardDesc: string;
        featureSecure: string;
        featureSecureDesc: string;
        pricingLabel: string;
        pricingTitle: string;
        pricingSubtitle: string;
        planShopTitle: string;
        planShopSubtitle: string;
        planCargoTitle: string;
        planCargoSubtitle: string;
        planPrice: string;
        planCta: string;
        popular: string;
        shopFeature1: string;
        shopFeature2: string;
        shopFeature3: string;
        shopFeature4: string;
        shopFeature5: string;
        shopFeature6: string;
        shopFeature7: string;
        cargoFeature1: string;
        cargoFeature2: string;
        cargoFeature3: string;
        cargoFeature4: string;
        cargoFeature5: string;
        cargoFeature6: string;
        cargoFeature7: string;
        howLabel: string;
        howTitle: string;
        step1Title: string;
        step1Desc: string;
        step2Title: string;
        step2Desc: string;
        step3Title: string;
        step4Title: string;
        step4Desc: string;
        ctaTitle: string;
        ctaDesc: string;
        ctaButton: string;
        footerCopy: string;
        privacy: string;
        terms: string;
        support: string;
    };
    auth: {
        welcomeBack: string;
        loginSubtitle: string;
        emailPlaceholder: string;
        emailRequired: string;
        emailInvalid: string;
        passwordPlaceholder: string;
        passwordRequired: string;
        passwordMin: string;
        forgotPassword: string;
        loginButton: string;
        noAccount: string;
        signUpLink: string;
        createAccount: string;
        signupSubtitle: string;
        namePlaceholder: string;
        nameRequired: string;
        signupButton: string;
        hasAccount: string;
        loginLink: string;
        signupTerms: string;
        changePlan: string;
        trialIncluded: string;
        cargoDeliveryPlan: string;
        onlineShopPlan: string;
        forgotTitle: string;
        forgotSubtitle: string;
        sendResetLink: string;
        backToLogin: string;
        emailSent: string;
        emailSentDesc: string;
        goToLogin: string;
        resetTitle: string;
        resetSubtitle: string;
        newPasswordPlaceholder: string;
        newPasswordRequired: string;
        confirmPasswordPlaceholder: string;
        confirmPasswordRequired: string;
        passwordMismatch: string;
        resetButton: string;
        resetSuccess: string;
        resetSuccessDesc: string;
        selectBusinessType: string;
        onlineShopDesc: string;
        cargoDesc: string;
    };
    dashboard: {
        overview: string;
        dashboard: string;
        activeFlows: string;
        totalReplies: string;
        status: string;
        systemActive: string;
        quickActions: string;
        contactAdmin: string;
        getSupport: string;
        automationSettings: string;
        manageFlows: string;
        connectPage: string;
        linkFacebook: string;
        recentActivity: string;
        noActivity: string;
        newMessageProcessed: string;
        autoReplySent: string;
        completed: string;
        merchantAccount: string;
        freeUser: string;
        editProfile: string;
        billingHistory: string;
        renewPlan: string;
    };
    platforms: {
        title: string;
        limitNotice: string;
        limitDesc: string;
        facebookIntegration: string;
        facebookDesc: string;
        syncButton: string;
        disconnectButton: string;
        disconnectTitle: string;
        disconnectWarning: string;
        disconnectFlows: string;
        disconnectTemplates: string;
        disconnectRules: string;
        disconnectConfirm: string;
        disconnectYes: string;
        disconnectNo: string;
        limitReached: string;
        limitReachedDesc: string;
        noPagesTitle: string;
        noPagesDesc: string;
        connectFacebook: string;
        securityNote: string;
    };
    automation: {
        title: string;
        loading: string;
        emptyTitle: string;
        emptyDesc: string;
        createFirst: string;
        createFlow: string;
        editFlow: string;
        flowName: string;
        businessType: string;
        triggerKeyword: string;
        description: string;
        saveChanges: string;
        deleteTitle: string;
        deleteDesc: string;
        deleteConfirm: string;
        deleteCancel: string;
        deleted: string;
        updated: string;
        created: string;
        toggleFailed: string;
        onlineShop: string;
        cargo: string;
        active: string;
        paused: string;
        placeholderName: string;
        placeholderKeyword: string;
        placeholderDesc: string;
        nameRequired: string;
        businessTypeRequired: string;
        keywordRequired: string;
        noDescription: string;
        customize: string;
        customizeDesc: string;
        welcomeMsg: string;
        welcomePlaceholder: string;
        completionMsg: string;
        completionPlaceholder: string;
        stepsTitle: string;
        stepQuestion: string;
        stepEnabled: string;
        saveCustomization: string;
        customizationSaved: string;
        placeholders: string;
        manageProducts: string;
        manageRates: string;
        manageProductsTip: string;
        manageRatesTip: string;
    };
    common: {
        loading: string;
        save: string;
        cancel: string;
        delete: string;
        edit: string;
        create: string;
        search: string;
        filter: string;
        actions: string;
        success: string;
        error: string;
        warning: string;
        confirm: string;
        copied: string;
    };
};

export const translations: Record<Language, TranslationKeys> = {
    en: {
        nav: {
            login: "Login",
            getStarted: "Get Started",
            signOut: "Sign Out",
        },
        landing: {
            badge: "Myanmar's #1 Auto-Reply Platform",
            headline: "Automate Your Facebook Replies",
            subtitle: "No extra cost. The Automation System built for Online Shop and Cargo businesses.",
            subtitleLine2: "Save time. Boost sales. Never miss a customer message again.",
            ctaStart: "Start Free Trial",
            ctaLearn: "Learn More",
            trustNoCc: "No Credit Card Required",
            trustTrial: "7-Day Free Trial",
            trustCancel: "Cancel Anytime",
            featuresLabel: "Features",
            featuresTitle: "Everything you need to automate",
            featureNoAi: "No Extra Cost",
            featureNoAiDesc: "Fully automated system, completely free!",
            featureSmartReply: "Smart Auto-Reply",
            featureSmartReplyDesc: "Respond to customers instantly with keyword-based auto-replies",
            featureMobile: "Mobile First",
            featureMobileDesc: "Optimized for mobile usage",
            featureLang: "Myanmar + English",
            featureLangDesc: "Full support for both languages",
            featureDashboard: "Real-time Dashboard",
            featureDashboardDesc: "Monitor message volume, reply rates, all from your dashboard",
            featureSecure: "Secure & Fast",
            featureSecureDesc: "Secure, fast, 99.9% uptime",
            pricingLabel: "Pricing",
            pricingTitle: "Choose your business type",
            pricingSubtitle: "7-day free trial. No credit card required.",
            planShopTitle: "Online Shop",
            planShopSubtitle: "E-commerce & Online Selling",
            planCargoTitle: "Cargo & Delivery",
            planCargoSubtitle: "Logistics & Shipping Business",
            planPrice: "Baht / month",
            planCta: "Start Free Trial",
            popular: "POPULAR",
            shopFeature1: "Unlimited conversations",
            shopFeature2: "Auto order collection",
            shopFeature3: "Product catalog management",
            shopFeature4: "Online Warehouse feature",
            shopFeature5: "Payment options (COD/Bank)",
            shopFeature6: "Myanmar + English support",
            shopFeature7: "Mobile dashboard",
            cargoFeature1: "Unlimited shipment tracking",
            cargoFeature2: "Auto booking system",
            cargoFeature3: "Tracking number generation",
            cargoFeature4: "Cargo process flow",
            cargoFeature5: "Rate calculator",
            cargoFeature6: "Myanmar + English support",
            cargoFeature7: "Priority support 24/7",
            howLabel: "How It Works",
            howTitle: "Get started in minutes",
            step1Title: "Create Account",
            step1Desc: "Sign up and choose your plan (7-day free trial)",
            step2Title: "Connect Facebook Page",
            step2Desc: "Link your Facebook Page — just 1 click!",
            step3Title: "Setup Auto-Reply Flows",
            step4Title: "Start Receiving Orders!",
            step4Desc: "You're all set! Orders & bookings will come in automatically! 🎉",
            ctaTitle: "Ready to automate your business?",
            ctaDesc: "Start your 7-day free trial. Less work, more sales.",
            ctaButton: "Start Free Trial Now",
            footerCopy: "Copyright © 2026 Vibe. All Rights Reserved.",
            privacy: "Privacy",
            terms: "Terms",
            support: "Support",
        },
        auth: {
            welcomeBack: "Welcome Back",
            loginSubtitle: "Sign in to your Dashboard",
            emailPlaceholder: "Email Address",
            emailRequired: "Please enter your email",
            emailInvalid: "Please enter a valid email",
            passwordPlaceholder: "Password",
            passwordRequired: "Please enter your password",
            passwordMin: "Minimum 6 characters",
            forgotPassword: "Forgot password?",
            loginButton: "Login",
            noAccount: "Don't have an account?",
            signUpLink: "Sign Up",
            createAccount: "Create Account",
            signupSubtitle: "Get started with Auto-Reply",
            namePlaceholder: "Full Name",
            nameRequired: "Please enter your name",
            signupButton: "Sign Up — Start Free Trial",
            hasAccount: "Already have an account?",
            loginLink: "Login",
            signupTerms: "By signing up, you agree to our Terms and Privacy Policy.",
            changePlan: "Change",
            trialIncluded: "7 Days Free Trial",
            cargoDeliveryPlan: "Cargo & Delivery Plan",
            onlineShopPlan: "Online Shop Plan",
            forgotTitle: "Forgot your password?",
            forgotSubtitle: "Enter your email to receive a reset link",
            sendResetLink: "Send Reset Link",
            backToLogin: "Back to Login",
            emailSent: "Email Sent!",
            emailSentDesc: "Check your email inbox and click the password reset link. Also check your spam folder.",
            goToLogin: "Go to Login",
            resetTitle: "Set New Password",
            resetSubtitle: "Enter your new password (minimum 6 characters)",
            newPasswordPlaceholder: "New Password",
            newPasswordRequired: "Please enter new password",
            confirmPasswordPlaceholder: "Confirm Password",
            confirmPasswordRequired: "Please confirm your password",
            passwordMismatch: "Passwords do not match",
            resetButton: "Change Password",
            resetSuccess: "Password Changed!",
            resetSuccessDesc: "You can now login with your new password",
            selectBusinessType: "Select Business Type",
            onlineShopDesc: "E-commerce & Online Selling",
            cargoDesc: "Logistics & Shipping Business",
        },
        dashboard: {
            overview: "Overview",
            dashboard: "Dashboard",
            activeFlows: "Active Flows",
            totalReplies: "Total Replies",
            status: "Status",
            systemActive: "System Active",
            quickActions: "Quick Actions",
            contactAdmin: "Contact Admin",
            getSupport: "Get support from our team",
            automationSettings: "Bot Settings",
            manageFlows: "Manage Auto-Reply Flows",
            connectPage: "Connect Page",
            linkFacebook: "Link Facebook",
            recentActivity: "Recent Activity",
            noActivity: "No recent activity to show.",
            newMessageProcessed: "New Message Processed",
            autoReplySent: "Auto-reply sent successfully via Facebook",
            completed: "Completed",
            merchantAccount: "Merchant Account",
            freeUser: "Free User",
            editProfile: "Edit Profile",
            billingHistory: "Billing History",
            renewPlan: "Renew / Upgrade Plan",
        },
        platforms: {
            title: "Social Platforms",
            limitNotice: "Only one Facebook Page per account is allowed",
            limitDesc: "To connect a new page, disconnect the current one. Disconnecting will also delete all auto-reply data.",
            facebookIntegration: "Facebook Integration",
            facebookDesc: "Connect your Page to auto-reply to messages using Automation System",
            syncButton: "Sync",
            disconnectButton: "Disconnect",
            disconnectTitle: "Disconnect this page?",
            disconnectWarning: "If you disconnect this page:",
            disconnectFlows: "All auto-reply flows will be deleted",
            disconnectTemplates: "All templates will be deleted",
            disconnectRules: "All rules will be deleted",
            disconnectConfirm: "Are you sure you want to continue?",
            disconnectYes: "Yes, Disconnect",
            disconnectNo: "No",
            limitReached: "Page limit reached",
            limitReachedDesc: "Only one page per account is allowed. Disconnect the above page to connect a new one.",
            noPagesTitle: "No pages connected yet",
            noPagesDesc: "Connect your Facebook Page to start using Auto-Reply",
            connectFacebook: "Connect Facebook Page",
            securityNote: "Your data is secure and encrypted. We only access the permissions necessary for auto-reply.",
        },
        automation: {
            title: "Auto-Reply Flows",
            loading: "Loading flows...",
            emptyTitle: "No Flows Created Yet",
            emptyDesc: "Start by creating a flow to automate your replies.",
            createFirst: "Create First Flow",
            createFlow: "Create New Flow",
            editFlow: "Edit Flow",
            flowName: "Flow Name",
            businessType: "Business Type",
            triggerKeyword: "Trigger Keyword",
            description: "Description",
            saveChanges: "Save Changes",
            deleteTitle: "Are you sure you want to delete?",
            deleteDesc: "Deleting this flow will stop the auto-reply functionality associated with it.",
            deleteConfirm: "Delete",
            deleteCancel: "Cancel",
            deleted: "Deleted",
            updated: "Updated Successfully! ✅",
            created: "Flow Created! 🚀",
            toggleFailed: "Toggle failed",
            onlineShop: "Online Shop (E-commerce)",
            cargo: "Cargo & Delivery",
            active: "Active",
            paused: "Paused",
            placeholderName: "e.g., Order Confirmation",
            placeholderKeyword: "e.g., order, buy",
            placeholderDesc: "What is this flow for?",
            nameRequired: "Please enter a flow name",
            businessTypeRequired: "Please select a business type",
            keywordRequired: "Please enter a trigger keyword",
            noDescription: "No description provided.",
            customize: "Customize Flow",
            customizeDesc: "Edit messages and questions for this flow",
            welcomeMsg: "Welcome Message",
            welcomePlaceholder: "e.g. Hello {{senderName}}, welcome to {{pageName}}!",
            completionMsg: "Completion Message",
            completionPlaceholder: "e.g. Order #{{orderNo}} received! We will contact {{full_name}} soon.",
            stepsTitle: "Conversation Steps",
            stepQuestion: "Question Text",
            stepEnabled: "Enabled",
            saveCustomization: "Save Customization",
            customizationSaved: "Customization saved successfully",
            placeholders: "Available placeholders: {{senderName}}, {{pageName}}, {{orderNo}}, {{full_name}}, {{phone}}, etc.",
            manageProducts: "Manage Products",
            manageRates: "Manage Rates",
            manageProductsTip: "Add or edit products to use in your flow.",
            manageRatesTip: "Add or edit shipping rates to use in your flow.",
        },
        common: {
            loading: "Loading...",
            save: "Save",
            cancel: "Cancel",
            delete: "Delete",
            edit: "Edit",
            create: "Create",
            search: "Search",
            filter: "Filter",
            actions: "Actions",
            success: "Success",
            error: "Error",
            warning: "Warning",
            confirm: "Confirm",
            copied: "Copied to clipboard",
        },
    },
    my: {
        nav: {
            login: "Login ဝင်ရန်",
            getStarted: "စတင်မည်",
            signOut: "ထွက်မည်",
        },
        landing: {
            badge: "Myanmar ၏ နံပါတ်တစ် Auto-Reply Platform",
            headline: "Facebook Reply များကို အလိုအလျောက်လုပ်ဆောင်ပါ",
            subtitle: "အပိုကုန်ကျစရိတ်မရှိ၊ ငွေချွေတာမယ့် Automation System။ Online Shop နဲ့ Cargo လုပ်ငန်းတွေအတွက် အထူးဖန်တီးထားပါတယ်။",
            subtitleLine2: "အချိန်သက်သာမယ်။ အရောင်းတက်မယ်။ ဖောက်သည် message တစ်ခုမှ လွတ်မသွားပါ။",
            ctaStart: "Free Trial စမည်",
            ctaLearn: "ပိုမိုလေ့လာမည်",
            trustNoCc: "Credit Card မလိုပါ",
            trustTrial: "၇ ရက် အခမဲ့ စမ်းသုံးခွင့်",
            trustCancel: "အချိန်မရွေး ပယ်ဖျက်နိုင်",
            featuresLabel: "Features များ",
            featuresTitle: "Automate လုပ်ရန် လိုအပ်သမျှ",
            featureNoAi: "အပိုကုန်ကျစရိတ် မရှိ",
            featureNoAiDesc: "Automation System ဖြစ်၍ လုံးဝ Free!",
            featureSmartReply: "Smart Auto-Reply",
            featureSmartReplyDesc: "Keyword-based reply ဖြင့် ဖောက်သည်များကို လျှင်မြန်စွာ ပြန်ကြားပါ",
            featureMobile: "Mobile First",
            featureMobileDesc: "ဖုန်းနဲ့ သုံးဖို့ အဆင်ပြေဆုံး!",
            featureLang: "Myanmar + English",
            featureLangDesc: "နှစ်ဘာသာလုံး Support!",
            featureDashboard: "Real-time Dashboard",
            featureDashboardDesc: "Message ပမာဏ၊ Reply Rate အားလုံးကို Dashboard မှာ ကြည့်ပါ",
            featureSecure: "လုံခြုံ & မြန်ဆန်",
            featureSecureDesc: "လုံခြုံ၊ မြန်ဆန်၊ 99.9% uptime",
            pricingLabel: "ဈေးနှုန်း",
            pricingTitle: "သင့်လုပ်ငန်းအမျိုးအစား ရွေးပါ",
            pricingSubtitle: "၇ ရက် အခမဲ့ စမ်းသုံးပါ။ Credit card မလိုပါ။",
            planShopTitle: "Online Shop",
            planShopSubtitle: "E-commerce နဲ့ Online ရောင်းဝယ်ရေး",
            planCargoTitle: "Cargo & Delivery",
            planCargoSubtitle: "သယ်ယူပို့ဆောင်ရေး လုပ်ငန်း",
            planPrice: "Baht / လ",
            planCta: "Free Trial စမည်",
            popular: "လူကြိုက်များ",
            shopFeature1: "Conversation အကန့်အသတ်မရှိ",
            shopFeature2: "Auto order collection",
            shopFeature3: "Product catalog စီမံခန့်ခွဲမှု",
            shopFeature4: "Online Warehouse feature",
            shopFeature5: "ငွေပေးချေမှု (COD/Bank)",
            shopFeature6: "Myanmar + English support",
            shopFeature7: "Mobile dashboard",
            cargoFeature1: "Shipment tracking အကန့်အသတ်မရှိ",
            cargoFeature2: "Auto booking system",
            cargoFeature3: "Tracking number ထုတ်ပေးခြင်း",
            cargoFeature4: "Cargo process flow",
            cargoFeature5: "Rate calculator",
            cargoFeature6: "Myanmar + English support",
            cargoFeature7: "Priority support 24/7",
            howLabel: "အသုံးပြုပုံ",
            howTitle: "မိနစ်ပိုင်းအတွင်း စတင်နိုင်ပါတယ်",
            step1Title: "အကောင့်ဖွင့်ပါ",
            step1Desc: "အကောင့်ဖွင့်ပြီး plan ရွေးပါ (၇ ရက် free trial)",
            step2Title: "Facebook Page ချိတ်ဆက်ပါ",
            step2Desc: "သင့် Facebook Page ချိတ်ဆက်ပါ — 1 click!",
            step3Title: "Auto-Reply Flows Setup",
            step4Title: "Order/Booking များ လက်ခံပါ!",
            step4Desc: "ပြီးပါပြီ! Order/Booking တွေ အလိုအလျောက် လက်ခံပါမယ်! 🎉",
            ctaTitle: "သင့်လုပ်ငန်းကို automate လုပ်ဖို့ အဆင်သင့်ဖြစ်ပြီလား?",
            ctaDesc: "၇ ရက် အခမဲ့ စမ်းသုံးပါ။ အလုပ်များမှုက လျော့မယ်၊ အရောင်းက တက်မယ်။",
            ctaButton: "Free Trial အခုစမည်",
            footerCopy: "Copyright ©  2026 Vibe. All Rights Reserved.",
            privacy: "Privacy",
            terms: "Terms",
            support: "Support",
        },
        auth: {
            welcomeBack: "ပြန်လည်ကြိုဆိုပါတယ်",
            loginSubtitle: "သင့် Dashboard သို့ ပြန်လည်ဝင်ရောက်ပါ",
            emailPlaceholder: "Email Address",
            emailRequired: "Email ထည့်ပေးပါ",
            emailInvalid: "Email ပုံစံ မှန်ကန်မှု မရှိပါ",
            passwordPlaceholder: "Password",
            passwordRequired: "Password ထည့်ပေးပါ",
            passwordMin: "အနည်းဆုံး ၆ လုံး ရှိရပါမည်",
            forgotPassword: "Password မေ့နေပါသလား?",
            loginButton: "Login ဝင်မည်",
            noAccount: "အကောင့်မရှိသေးဘူးလား?",
            signUpLink: "Sign Up လုပ်ရန်",
            createAccount: "အကောင့်ဖွင့်ရန်",
            signupSubtitle: "Auto-Reply စတင်အသုံးပြုရန် အကောင့်ဖွင့်ပါ",
            namePlaceholder: "သင့်အမည် (Full Name)",
            nameRequired: "သင့်အမည် ထည့်ပေးပါ",
            signupButton: "Sign Up — Free Trial စမည်",
            hasAccount: "ရှိပြီးသား အကောင့်ရှိလား?",
            loginLink: "Login ဝင်ရန်",
            signupTerms: "Sign up လုပ်ခြင်းဖြင့် Terms နှင့် Privacy Policy ကို သဘောတူပါသည်။",
            changePlan: "ပြောင်းရန်",
            trialIncluded: "၇ ရက် Free Trial ပါဝင်",
            cargoDeliveryPlan: "Cargo & Delivery Plan",
            onlineShopPlan: "Online Shop Plan",
            forgotTitle: "Password မေ့နေပါသလား?",
            forgotSubtitle: "သင့် email ကို ရိုက်ထည့်ပြီး reset link ရယူပါ",
            sendResetLink: "Reset Link ပို့မည်",
            backToLogin: "Login Page သို့ ပြန်သွားမည်",
            emailSent: "Email ပို့ပြီးပါပြီ!",
            emailSentDesc: "သင့် email inbox ကို စစ်ကြည့်ပြီး password reset link ကို နှိပ်ပါ။ Spam folder ကိုလည်း စစ်ကြည့်ပေးပါ။",
            goToLogin: "Login Page သို့",
            resetTitle: "Password အသစ် သတ်မှတ်ရန်",
            resetSubtitle: "Password အသစ်ကို ရိုက်ထည့်ပါ (အနည်းဆုံး ၆ လုံး)",
            newPasswordPlaceholder: "Password အသစ်",
            newPasswordRequired: "Password အသစ် ထည့်ပေးပါ",
            confirmPasswordPlaceholder: "Password ကို ထပ်ရိုက်ထည့်ပါ",
            confirmPasswordRequired: "Password ကို ထပ်မံရိုက်ထည့်ပါ",
            passwordMismatch: "Password နှစ်ခု မတူညီပါ",
            resetButton: "Password ပြောင်းလဲမည်",
            resetSuccess: "Password ပြောင်းပြီးပါပြီ!",
            resetSuccessDesc: "Password အသစ်ဖြင့် login ပြန်ဝင်နိုင်ပါပြီ",
            selectBusinessType: "လုပ်ငန်းအမျိုးအစား ရွေးချယ်ပါ",
            onlineShopDesc: "အွန်လိုင်းစျေးဆိုင်နှင့် အရောင်းအဝယ်",
            cargoDesc: "သယ်ယူပို့ဆောင်ရေးနှင့် ကုန်စည်ပို့ဆောင်ရေး",
        },
        dashboard: {
            overview: "အကျဉ်းချုပ်",
            dashboard: "Dashboard",
            activeFlows: "Active Flows",
            totalReplies: "စုစုပေါင်း Replies",
            status: "Status",
            systemActive: "• System Active",
            quickActions: "Quick Actions",
            contactAdmin: "အက်မင်ကိုဆက်သွယ်ရန်",
            getSupport: "အကူအညီရယူရန်",
            automationSettings: "အလိုအလျောက်ပြန်စာ စနစ်",
            manageFlows: "Flow များကို ပြင်ဆင်ရန်",
            connectPage: "Page ချိတ်ဆက်ရန်",
            linkFacebook: "Facebook ချိတ်ဆက်ရန်",
            recentActivity: "လတ်တလော Activity",
            noActivity: "ပြရန် activity မရှိသေးပါ။",
            newMessageProcessed: "Message အသစ် Process ပြီး",
            autoReplySent: "Facebook မှတဆင့် auto-reply အောင်မြင်စွာ ပို့ပြီး",
            completed: "ပြီးမြောက်",
            merchantAccount: "Merchant Account",
            freeUser: "Free User",
            editProfile: "Profile ပြင်ဆင်ရန်",
            billingHistory: "Billing History",
            renewPlan: "အစီအစဉ်အသစ်ဝယ်ရန် / သက်တမ်းတိုးရန်",
        },
        platforms: {
            title: "Social Platforms",
            limitNotice: "အကောင့်တစ်ခုလျှင် Facebook Page တစ်ခုသာ ချိတ်ဆက်ခွင့်ရှိပါသည်",
            limitDesc: "Page အသစ်ချိတ်ဆက်လိုပါက လက်ရှိချိတ်ဆက်ထားသည့် page ကို disconnect လုပ်ပေးပါ။ Disconnect လုပ်လိုက်ပါက auto-reply data များအားလုံးကိုလည်း ရှင်းလင်းမည်ဖြစ်ပါသည်။",
            facebookIntegration: "Facebook Integration",
            facebookDesc: "သင့် Page မှ message များကို Automation System ဖြင့် အလိုအလျောက် ပြန်ကြားပေးရန် ချိတ်ဆက်ပါ",
            syncButton: "Sync",
            disconnectButton: "Disconnect",
            disconnectTitle: "ဒီ page ကို disconnect လုပ်မှာ သေချာပါသလား?",
            disconnectWarning: "ဒီ page ကို disconnect လုပ်လိုက်ပါက:",
            disconnectFlows: "Auto-reply flows အားလုံး ဖျက်ပစ်မည်",
            disconnectTemplates: "Templates အားလုံး ဖျက်ပစ်မည်",
            disconnectRules: "Rules အားလုံး ဖျက်ပစ်မည်",
            disconnectConfirm: "ဆက်လုပ်မှာ သေချာပါသလား?",
            disconnectYes: "ဟုတ်ကဲ့, Disconnect",
            disconnectNo: "မလုပ်ပါ",
            limitReached: "Page limit ရောက်ပါပြီ",
            limitReachedDesc: "အကောင့်တစ်ခုလျှင် page တစ်ခုသာ ချိတ်ဆက်ခွင့်ရှိပါသည်။ Page အသစ်ချိတ်ဆက်ရန် အထက်က page ကို disconnect လုပ်ပါ။",
            noPagesTitle: "Page ချိတ်ဆက်ထားခြင်း မရှိသေးပါ",
            noPagesDesc: "Facebook Page ကို ချိတ်ဆက်ပြီး Auto-Reply စတင်အသုံးပြုနိုင်ပါပြီ",
            connectFacebook: "Facebook Page ချိတ်ဆက်ရန်",
            securityNote: "သင့် data သည် လုံခြုံပြီး encrypted ဖြစ်ပါသည်။ Auto-reply အတွက် လိုအပ်သော permissions များကိုသာ access လုပ်ပါသည်။",
        },
        automation: {
            title: "Auto-Reply Flows",
            loading: "Flows များ Load လုပ်နေသည်...",
            emptyTitle: "Flows မရှိသေးပါ",
            emptyDesc: "Flow တစ်ခု ဖန်တီးပြီး Auto-reply စတင်လိုက်ပါ။",
            createFirst: "Flow စတင်ဖန်တီးမည်",
            createFlow: "Flow အသစ်လုပ်မည်",
            editFlow: "Flow ပြင်ဆင်မည်",
            flowName: "Flow အမည်",
            businessType: "လုပ်ငန်းအမျိုးအစား",
            triggerKeyword: "Trigger Keyword",
            description: "အကြောင်းအရာ",
            saveChanges: "သိမ်းဆည်းမည်",
            deleteTitle: "ဖျက်မှာ သေချာပါသလား?",
            deleteDesc: "ဤ Flow ကို ဖျက်လိုက်ပါက Auto-reply အလုပ်လုပ်တော့မည် မဟုတ်ပါ။",
            deleteConfirm: "ဖျက်မည်",
            deleteCancel: "မဖျက်တော့ပါ",
            deleted: "ဖျက်ပြီးပါပြီ",
            updated: "ပြင်ဆင်ပြီးပါပြီ! ✅",
            created: "Flow ဖန်တီးပြီးပါပြီ! 🚀",
            toggleFailed: "မအောင်မြင်ပါ",
            onlineShop: "Online Shop (E-commerce)",
            cargo: "Cargo & Delivery",
            active: "Active",
            paused: "ရပ်ထားသည်",
            placeholderName: "ဥပမာ- ဈေးနှုန်းမေးခြင်း",
            placeholderKeyword: "ဥပမာ- price, ဈေး",
            placeholderDesc: "ဒီ flow က ဘာအတွက်လဲ...",
            nameRequired: "Flow အမည် ထည့်ပေးပါ",
            businessTypeRequired: "လုပ်ငန်းအမျိုးအစား ရွေးပေးပါ",
            keywordRequired: "Trigger keyword ထည့်ပေးပါ",
            noDescription: "အကြောင်းအရာ မထည့်ထားပါ",
            customize: "Flow ကို ကိုယ်တိုင်ပြင်ဆင်ရန်",
            customizeDesc: "မေးခွန်းများနှင့် မက်ဆေ့ချ်များကို စိတ်ကြိုက်ပြင်ဆင်ပါ",
            welcomeMsg: "နှုတ်ဆက်စာ (Welcome Message)",
            welcomePlaceholder: "ဥပမာ - မင်္ဂလာပါ {{senderName}}၊ {{pageName}} မှ ကြိုဆိုပါတယ်။",
            completionMsg: "ပြီးဆုံးကြောင်းပြစာ (Completion Message)",
            completionPlaceholder: "ဥပမာ - Order #{{orderNo}} လက်ခံရရှိပါပြီ။ {{full_name}} ထံ မကြာခင် ဆက်သွယ်ပါမယ်။",
            stepsTitle: "မေးမြန်းမည့် အဆင့်ဆင့်",
            stepQuestion: "မေးခွန်းစာသား",
            stepEnabled: "အသုံးပြုမည်",
            saveCustomization: "သိမ်းဆည်းမည်",
            customizationSaved: "ပြင်ဆင်မှုများ သိမ်းဆည်းပြီးပါပြီ",
            placeholders: "အသုံးပြုနိုင်သော placeholders များ: {{senderName}}, {{pageName}}, {{orderNo}}, {{full_name}}, {{phone}} စသည်ဖြင့်...",
            manageProducts: "Product စာရင်း ပြင်ဆင်ရန်",
            manageRates: "ပို့ဆောင်ခနှုန်းထား ပြင်ဆင်ရန်",
            manageProductsTip: "Flow ထဲမှာ သုံးဖို့ product တွေကို ဒီမှာ အရင်ထည့်ထားပေးပါ။",
            manageRatesTip: "Flow ထဲမှာ သုံးဖို့ shipping rate တွေကို ဒီမှာ အရင်ထည့်ထားပေးပါ။",
        },
        common: {
            loading: "Loading...",
            save: "သိမ်းမည်",
            cancel: "ပယ်ဖျက်မည်",
            delete: "ဖျက်မည်",
            edit: "ပြင်ဆင်မည်",
            create: "ဖန်တီးမည်",
            search: "ရှာဖွေမည်",
            filter: "စစ်ထုတ်မည်",
            actions: "Actions",
            success: "အောင်မြင်",
            error: "အမှား",
            warning: "သတိပေးချက်",
            confirm: "အတည်ပြု",
            copied: "Copy ကူးပြီးပါပြီ",
        },
    },
    th: {
        nav: {
            login: "เข้าสู่ระบบ",
            getStarted: "เริ่มต้นใช้งาน",
            signOut: "ออกจากระบบ",
        },
        landing: {
            badge: "แพลตฟอร์มตอบกลับอัตโนมัติอันดับ 1 ในเมียนมา",
            headline: "จัดการตอบกลับ Facebook ของคุณโดยอัตโนมัติ",
            subtitle: "ไม่มีค่าใช้จ่ายเพิ่มเติม ระบบอัตโนมัติที่สร้างขึ้นสำหรับธุรกิจร้านค้าออนไลน์และธุรกิจคาร์โก้",
            subtitleLine2: "ประหยัดเวลา เพิ่มยอดขาย ไม่พลาดทุกข้อความจากลูกค้า",
            ctaStart: "เริ่มทดลองใช้งานฟรี",
            ctaLearn: "เรียนรู้เพิ่มเติม",
            trustNoCc: "ไม่ต้องใช้บัตรเครดิต",
            trustTrial: "ทดลองใช้งานฟรี 7 วัน",
            trustCancel: "ยกเลิกได้ทุกเมื่อ",
            featuresLabel: "คุณสมบัติ",
            featuresTitle: "ทุกสิ่งที่คุณต้องการเพื่อความเป็นอัตโนมัติ",
            featureNoAi: "ไม่มีค่าใช้จ่ายเพิ่มเติม",
            featureNoAiDesc: "ระบบอัตโนมัติเต็มรูปแบบ ฟรีแน่นอน!",
            featureSmartReply: "ตอบกลับอัตโนมัติอัจฉริยะ",
            featureSmartReplyDesc: "ตอบกลับลูกค้าทันทีด้วยคีย์เวิร์ด",
            featureMobile: "เน้นการใช้งานบนมือถือ",
            featureMobileDesc: "ปรับให้เข้ากับการใช้งานบนมือถือเป็นหลัก",
            featureLang: "เมียนมา + อังกฤษ + ไทย",
            featureLangDesc: "รองรับทั้งสามภาษาอย่างเต็มรูปแบบ",
            featureDashboard: "แดชบอร์ดแบบเรียลไทม์",
            featureDashboardDesc: "ตรวจสอบปริมาณข้อความ อัตราการตอบกลับ ทั้งหมดจากแดชบอร์ดของคุณ",
            featureSecure: "ปลอดภัยและรวดเร็ว",
            featureSecureDesc: "ปลอดภัย รวดเร็ว อัตราการทำงาน 99.9%",
            pricingLabel: "ราคา",
            pricingTitle: "เลือกประเภทธุรกิจของคุณ",
            pricingSubtitle: "ทดลองใช้งานฟรี 7 วัน ไม่ต้องใช้บัตรเครดิต",
            planShopTitle: "ร้านค้าออนไลน์",
            planShopSubtitle: "อีคอมเมิร์ซและการขายออนไลน์",
            planCargoTitle: "ธุรกิจคาร์โก้และการขนส่ง",
            planCargoSubtitle: "โลจิสติกส์และธุรกิจการขนส่ง",
            planPrice: "บาท / เดือน",
            planCta: "เริ่มทดลองใช้งานฟรี",
            popular: "ยอดนิยม",
            shopFeature1: "สนทนาได้ไม่จำกัด",
            shopFeature2: "รวบรวมคำสั่งซื้ออัตโนมัติ",
            shopFeature3: "จัดการแคตตาล็อกสินค้า",
            shopFeature4: "ฟีเจอร์คลังสินค้าออนไลน์",
            shopFeature5: "ช่องทางการชำระเงิน (COD/ธนาคาร)",
            shopFeature6: "รองรับภาษาเมียนมา อังกฤษ และไทย",
            shopFeature7: "แดชบอร์ดบนมือถือ",
            cargoFeature1: "ติดตามการขนส่งได้ไม่จำกัด",
            cargoFeature2: "ระบบการจองอัตโนมัติ",
            cargoFeature3: "สร้างหมายเลขติดตามพัสดุ",
            cargoFeature4: "กระบวนการทำงานสำหรับคาร์โก้",
            cargoFeature5: "เครื่องคำนวณอัตราค่าขนส่ง",
            cargoFeature6: "รองรับภาษาเมียนมา อังกฤษ และไทย",
            cargoFeature7: "การสนับสนุนระดับพรีเมียม 24 ชั่วโมง",
            howLabel: "วิธีการทำงาน",
            howTitle: "เริ่มต้นในไม่กี่นาที",
            step1Title: "สร้างบัญชี",
            step1Desc: "ลงทะเบียนและเลือกแผนการใช้งาน (ทดลองใช้ฟรี 7 วัน)",
            step2Title: "เชื่อมต่อเพจ Facebook",
            step2Desc: "เชื่อมต่อเพจ Facebook ของคุณ — เพียงคลิกเดียว!",
            step3Title: "ตั้งค่ากระบวนการตอบกลับอัตโนมัติ",
            step4Title: "เริ่มรับออเดอร์ได้เลย!",
            step4Desc: "เสร็จเรียบร้อย! ออเดอร์และการจองจะเข้ามาโดยอัตโนมัติ! 🎉",
            ctaTitle: "พร้อมที่จะเปลี่ยนธุรกิจของคุณให้เป็นอัตโนมัติหรือยัง?",
            ctaDesc: "เริ่มทดลองใช้งานฟรี 7 วัน ทำงานน้อยลง ยอดขายมากขึ้น",
            ctaButton: "เริ่มทดลองใช้งานฟรีตอนนี้",
            footerCopy: "ลิขสิทธิ์ © 2026 Vibe สงวนลิขสิทธิ์",
            privacy: "ความเป็นส่วนตัว",
            terms: "ข้อกำหนด",
            support: "การสนับสนุน",
        },
        auth: {
            welcomeBack: "ยินดีต้อนรับกลับมา",
            loginSubtitle: "ลงชื่อเข้าสู่แดชบอร์ดของคุณ",
            emailPlaceholder: "ที่อยู่อีเมล",
            emailRequired: "กรุณากรอกอีเมลของคุณ",
            emailInvalid: "กรุณากรอกอีเมลที่ถูกต้อง",
            passwordPlaceholder: "รหัสผ่าน",
            passwordRequired: "กรุณากรอกรหัสผ่านของคุณ",
            passwordMin: "อย่างน้อย 6 ตัวอักษร",
            forgotPassword: "ลืมรหัสผ่าน?",
            loginButton: "เข้าสู่ระบบ",
            noAccount: "ยังไม่มีบัญชีใช่หรือไม่?",
            signUpLink: "ลงทะเบียน",
            createAccount: "สร้างบัญชี",
            signupSubtitle: "เริ่มต้นใช้งานการตอบกลับอัตโนมัติ",
            namePlaceholder: "ชื่อ-นามสกุล",
            nameRequired: "กรุณากรอกชื่อของคุณ",
            signupButton: "ลงทะเบียน — เริ่มทดลองใช้ฟรี",
            hasAccount: "มีบัญชีอยู่แล้วใช่หรือไม่?",
            loginLink: "เข้าสู่ระบบ",
            signupTerms: "การลงทะเบียนแสดงว่าคุณยอมรับข้อกำหนดและนโยบายความเป็นส่วนตัวของเรา",
            changePlan: "เปลี่ยน",
            trialIncluded: "ทดลองใช้งานฟรี 7 วัน",
            cargoDeliveryPlan: "แผนธุรกิจคาร์โก้และการขนส่ง",
            onlineShopPlan: "แผนร้านค้าออนไลน์",
            forgotTitle: "ลืมรหัสผ่านใช่หรือไม่?",
            forgotSubtitle: "กรอกอีเมลของคุณเพื่อรับลิงก์รีเซ็ตรหัสผ่าน",
            sendResetLink: "ส่งลิงก์รีเซ็ต",
            backToLogin: "กลับไปที่หน้าเข้าสู่ระบบ",
            emailSent: "ส่งอีเมลแล้ว!",
            emailSentDesc: "ตรวจสอบกล่องจดหมายของคุณและคลิกลิงก์รีเซ็ตรหัสผ่าน อย่าลืมตรวจสอบในโฟลเดอร์ขยะด้วย",
            goToLogin: "ไปที่หน้าเข้าสู่ระบบ",
            resetTitle: "ตั้งรหัสผ่านใหม่",
            resetSubtitle: "กรอกรหัสผ่านใหม่ของคุณ (อย่างน้อย 6 ตัวอักษร)",
            newPasswordPlaceholder: "รหัสผ่านใหม่",
            newPasswordRequired: "กรุณากรอกรหัสผ่านใหม่",
            confirmPasswordPlaceholder: "ยืนยันรหัสผ่าน",
            confirmPasswordRequired: "กรุณายืนยันรหัสผ่านของคุณ",
            passwordMismatch: "รหัสผ่านไม่ตรงกัน",
            resetButton: "เปลี่ยนรหัสผ่าน",
            resetSuccess: "เปลี่ยนรหัสผ่านสำเร็จ!",
            resetSuccessDesc: "คุณสามารถเข้าสู่ระบบด้วยรหัสผ่านใหม่ได้แล้ว",
            selectBusinessType: "เลือกประเภทธุรกิจ",
            onlineShopDesc: "อีคอมเมิร์ซและการขายออนไลน์",
            cargoDesc: "โลจิสติกส์และธุรกิจการขนส่ง",
        },
        dashboard: {
            overview: "ภาพรวม",
            dashboard: "แดชบอร์ด",
            activeFlows: "ลำดับงานที่เปิดอยู่",
            totalReplies: "การตอบกลับทั้งหมด",
            status: "สถานะ",
            systemActive: "ระบบกำลังทำงาน",
            quickActions: "การดำเนินการด่วน",
            contactAdmin: "ติดต่อแอดมิน",
            getSupport: "ขอรับการสนับสนุนจากทีมงานของเรา",
            automationSettings: "การตั้งค่าบอท",
            manageFlows: "จัดการลำดับการตอบกลับอัตโนมัติ",
            connectPage: "เชื่อมต่อเพจ",
            linkFacebook: "ลิงก์ Facebook",
            recentActivity: "กิจกรรมล่าสุด",
            noActivity: "ไม่มีกิจกรรมล่าสุดที่จะแสดง",
            newMessageProcessed: "ประมวลผลข้อความใหม่แล้ว",
            autoReplySent: "ส่งการตอบกลับอัตโนมัติผ่าน Facebook สำเร็จ",
            completed: "เสร็จสมบูรณ์",
            merchantAccount: "บัญชีร้านค้า",
            freeUser: "ผู้ใช้งานฟรี",
            editProfile: "แก้ไขโปรไฟล์",
            billingHistory: "ประวัติการชำระเงิน",
            renewPlan: "ต่ออายุ / อัปเกรดแผน",
        },
        platforms: {
            title: "โซเชียลแพลตฟอร์ม",
            limitNotice: "อนุญาตให้เชื่อมต่อเพจ Facebook เพียงหนึ่งเพจต่อบัญชีเท่านั้น",
            limitDesc: "หากต้องการเชื่อมต่อเพจใหม่ ให้ยกเลิกการเชื่อมต่อเพจปัจจุบันก่อน การยกเลิกจะลบข้อมูลการตอบกลับอัตโนมัติทั้งหมดด้วย",
            facebookIntegration: "การรวมระบบกับ Facebook",
            facebookDesc: "เชื่อมต่อเพจของคุณเพื่อตอบกลับข้อความโดยอัตโนมัติโดยใช้ระบบอัตโนมัติ",
            syncButton: "ซิงค์",
            disconnectButton: "ยกเลิกการเชื่อมต่อ",
            disconnectTitle: "ยกเลิกการเชื่อมต่อเพจนี้ใช่หรือไม่?",
            disconnectWarning: "หากคุณยกเลิกการเชื่อมต่อเพจนี้:",
            disconnectFlows: "ลำดับการตอบกลับอัตโนมัติทั้งหมดจะถูกลบ",
            disconnectTemplates: "เทมเพลตทั้งหมดจะถูกลบ",
            disconnectRules: "กฎทั้งหมดจะถูกลบ",
            disconnectConfirm: "คุณแน่ใจหรือไม่ว่าต้องการดำเนินการต่อ?",
            disconnectYes: "ใช่ ยกเลิกการเชื่อมต่อ",
            disconnectNo: "ไม่",
            limitReached: "ถึงขีดจำกัดเพจแล้ว",
            limitReachedDesc: "อนุญาตเพียงหนึ่งเพจต่อบัญชีเท่านั้น ยกเลิกการเชื่อมต่อเพจข้างต้นเพื่อเชื่อมต่อเพจใหม่",
            noPagesTitle: "ยังไม่มีเพจที่เชื่อมต่อ",
            noPagesDesc: "เชื่อมต่อเพจ Facebook ของคุณเพื่อเริ่มใช้งานการตอบกลับอัตโนมัติ",
            connectFacebook: "เชื่อมต่อเพจ Facebook",
            securityNote: "ข้อมูลของคุณปลอดภัยและได้รับการเข้ารหัส เราใช้สิทธิ์ที่จำเป็นสำหรับการตอบกลับอัตโนมัติเท่านั้น",
        },
        automation: {
            title: "ลำดับการตอบกลับอัตโนมัติ",
            loading: "กำลังโหลดลำดับงาน...",
            emptyTitle: "ยังไม่ได้สร้างลำดับงาน",
            emptyDesc: "เริ่มต้นโดยการสร้างลำดับงานเพื่อจัดการการตอบกลับของคุณแบบอัตโนมัติ",
            createFirst: "สร้างลำดับงานแรก",
            createFlow: "สร้างลำดับงานใหม่",
            editFlow: "แก้ไขลำดับงาน",
            flowName: "ชื่อลำดับงาน",
            businessType: "ประเภทธุรกิจ",
            triggerKeyword: "คีย์เวิร์ดเรียกใช้",
            description: "คำอธิบาย",
            saveChanges: "บันทึกการเปลี่ยนแปลง",
            deleteTitle: "คุณแน่ใจหรือไม่ว่าต้องการลบ?",
            deleteDesc: "การลบลำดับงานนี้จะหยุดการทำงานของการตอบกลับอัตโนมัติที่เกี่ยวข้อง",
            deleteConfirm: "ลบ",
            deleteCancel: "ยกเลิก",
            deleted: "ลบแล้ว",
            updated: "อัปเดตสำเร็จ! ✅",
            created: "สร้างลำดับงานแล้ว! 🚀",
            toggleFailed: "การสลับการทำงานล้มเหลว",
            onlineShop: "ร้านค้าออนไลน์ (อีคอมเมิร์ซ)",
            cargo: "คาร์โก้และการขนส่ง",
            active: "เปิดใช้งาน",
            paused: "หยุดชั่วคราว",
            placeholderName: "เช่น ยืนยันคำสั่งซื้อ",
            placeholderKeyword: "เช่น สั่งซื้อ, ซื้อ",
            placeholderDesc: "ลำดับงานนี้มีไว้สำหรับอะไร?",
            nameRequired: "กรุณากรอกชื่อลำดับงาน",
            businessTypeRequired: "กรุณาเลือกประเภทธุรกิจ",
            keywordRequired: "กรุณากรอกคีย์เวิร์ดเรียกใช้",
            noDescription: "ไม่มีคำอธิบาย",
            customize: "ปรับแต่งลำดับงาน",
            customizeDesc: "แก้ไขข้อความและคำถามสำหรับลำดับงานนี้",
            welcomeMsg: "ข้อความต้อนรับ",
            welcomePlaceholder: "เช่น สวัสดีคุณ {{senderName}} ยินดีต้อนรับสู่ {{pageName}}!",
            completionMsg: "ข้อความเมื่อเสร็จสิ้น",
            completionPlaceholder: "เช่น ได้รับคำสั่งซื้อ #{{orderNo}} แล้ว! เราจะติดต่อคุณ {{full_name}} เร็วๆ นี้",
            stepsTitle: "ขั้นตอนการสนทนา",
            stepQuestion: "ข้อความคำถาม",
            stepEnabled: "เปิดใช้งาน",
            saveCustomization: "บันทึกการปรับแต่ง",
            customizationSaved: "บันทึกการปรับแต่งสำเร็จ",
            placeholders: "ตัวแทนข้อมูลที่ใช้ได้: {{senderName}}, {{pageName}}, {{orderNo}}, {{full_name}}, {{phone}} เป็นต้น",
            manageProducts: "จัดการสินค้า",
            manageRates: "จัดการอัตราค่าขนส่ง",
            manageProductsTip: "เพิ่มหรือแก้ไขสินค้าเพื่อใช้ในลำดับงานของคุณ",
            manageRatesTip: "เพิ่มหรือแก้ไขอัตราค่าขนส่งเพื่อใช้ในลำดับงานของคุณ",
        },
        common: {
            loading: "กำลังโหลด...",
            save: "บันทึก",
            cancel: "ยกเลิก",
            delete: "ลบ",
            edit: "แก้ไข",
            create: "สร้าง",
            search: "ค้นหา",
            filter: "กรอง",
            actions: "ดำเนินการ",
            success: "สำเร็จ",
            error: "ข้อผิดพลาด",
            warning: "คำเตือน",
            confirm: "ยืนยัน",
            copied: "คัดลอกไปยังคลิปบอร์ดแล้ว",
        },
    },
};
