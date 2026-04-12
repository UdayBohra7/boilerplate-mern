import { BASE_URL } from "@/lib/config";

export const getImageUrl = (image?: string) => {
    if (!image) return "";
    if (image.startsWith("http")) return image;
    return `${BASE_URL}${image}`;
};