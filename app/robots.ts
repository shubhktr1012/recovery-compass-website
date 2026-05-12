import { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
    return {
        rules: [
            {
                userAgent: "*",
                allow: "/",
                disallow: ["/checkout", "/checkout/success", "/receipts"],
            },
        ],
        sitemap: "https://recoverycompass.co/sitemap.xml",
        host: "https://recoverycompass.co",
    };
}
