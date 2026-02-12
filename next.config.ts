import type { NextConfig } from "next";

const nextConfig: NextConfig = {
    images: {
        remotePatterns: [
            {
                protocol: "https",
                hostname: "rdnegjgzhyjjzvxilxqb.supabase.co",
                pathname: "/storage/v1/object/sign/**",
            },
        ],
    },
};

export default nextConfig;
