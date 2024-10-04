/** @type {import('next').NextConfig} */
const nextConfig = {
    async redirects() {
        return [
            {
                source: "/",
                destination: "/projects",
                permanent: false
            }
        ]
    }
};

export default nextConfig;
