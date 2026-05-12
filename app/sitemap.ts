import { MetadataRoute } from "next";

export default function sitemap(): MetadataRoute.Sitemap {
    const baseUrl = (
        process.env.NEXT_PUBLIC_SITE_URL ||
        (process.env.NODE_ENV === "development" ? "http://localhost:3000" : "https://recoverycompass.co")
    ).replace(/\/$/, "");
    const lastModified = new Date();

    return [
        {
            url: baseUrl,
            lastModified,
            changeFrequency: "weekly",
            priority: 1,
        },
        {
            url: `${baseUrl}/privacy`,
            lastModified,
            changeFrequency: "monthly",
            priority: 0.8,
        },
        {
            url: `${baseUrl}/terms`,
            lastModified,
            changeFrequency: "monthly",
            priority: 0.8,
        },
        {
            url: `${baseUrl}/about`,
            lastModified,
            changeFrequency: "monthly",
            priority: 0.9,
        },
        {
            url: `${baseUrl}/support`,
            lastModified,
            changeFrequency: "monthly",
            priority: 0.8,
        },
        {
            url: `${baseUrl}/delete-account`,
            lastModified,
            changeFrequency: "monthly",
            priority: 0.6,
        },
        {
            url: `${baseUrl}/citations`,
            lastModified,
            changeFrequency: "monthly",
            priority: 0.8,
        },
    ];
}
