/**
 * @format
 * @type {import('next').NextConfig}
 */

const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "xclzkipeiiszotburdie.supabase.co",
        port: "",
        pathname: "/storage/v1/object/public/cabin-images/**",
      },
    ],
    domains: ["lh3.googleusercontent.com", "xclzkipeiiszotburdie.supabase.co"],
  },
  // output: "export",
};

export default nextConfig;
