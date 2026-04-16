/** @type {import('next').NextConfig} */
const nextConfig = {
    async headers() {
        return [
            {
                source: '/:path*',
                headers: [
                    {
                        key: 'X-Frame-Options',
                        value: 'DENY',
                    },
                    {
                        key: 'Content-Security-Policy',
                        value: [
                            "default-src 'self'",
                            "script-src 'self' 'unsafe-inline' 'unsafe-eval' cdn.jsdelivr.net checkout.razorpay.com",
                            "style-src 'self' 'unsafe-inline' cdn.jsdelivr.net",
                            "img-src 'self' data: https: *.supabase.co",
                            "font-src 'self' data: https:",
                            "connect-src 'self' *.supabase.co https://vitals.vercel-insights.com cdn.jsdelivr.net *.razorpay.com https://lumberjack.razorpay.com",
                            "frame-src https://api.razorpay.com https://checkout.razorpay.com",
                            "frame-ancestors 'none'",
                            "upgrade-insecure-requests"
                        ].join('; '),
                    },
                    {
                        key: 'X-Content-Type-Options',
                        value: 'nosniff',
                    },
                    {
                        key: 'Referrer-Policy',
                        value: 'strict-origin-when-cross-origin',
                    },
                ],
            },
        ];
    },
};

export default nextConfig;
