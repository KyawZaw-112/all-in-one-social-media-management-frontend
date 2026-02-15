import axios from "axios";

export const usePostAll = () => {
    const postAll = async (postId: string) => {
        const { data } = await axios.post(
            `${process.env.NEXT_PUBLIC_API_URL}/posts/${postId}/post-all`
        );

        return data;
    };

    return { postAll };
};
