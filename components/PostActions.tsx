"use client";

import { usePostAll } from "@/hooks/usePostAll";

export default function PostActions({ postId }) {
    const { postAll } = usePostAll();

    const handlePostAll = async () => {
        await postAll(postId);
    };

    return (
        <button onClick={handlePostAll}>
            Post to All Platforms
        </button>
    );
}
