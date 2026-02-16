"use client";

import { Suspense } from "react";
import PlatformsContent from "@/components/PlatformsContent";

export default function PlatformsPage() {
    return (
        <Suspense fallback={null}>
            <PlatformsContent />
        </Suspense>
    );
}
