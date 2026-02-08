const connectFacebook = () => {
    const appId = process.env.NEXT_PUBLIC_FACEBOOK_APP_ID;
    const redirectUri = `${process.env.NEXT_PUBLIC_API_URL}/api/oauth/facebook/callback`;

    const scopes = [
        "public_profile",
        "email",
        "pages_show_list",
        "pages_read_engagement",
        "pages_manage_metadata",
        "business_management",
        "instagram_basic",
        "instagram_manage_insights"
    ].join(",");

    const url =
        `https://www.facebook.com/v24.0/dialog/oauth` +
        `?client_id=${appId}` +
        `&redirect_uri=${encodeURIComponent(redirectUri)}` +
        `&scope=${scopes}` +
        `&response_type=code`;

    window.location.href = url;
};
