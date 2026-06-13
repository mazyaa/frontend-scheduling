/** @type {import('next').NextConfig} */
const nextConfig = {
    images: {
    remotePatterns: [
      {
        hostname: "res.cloudinary.com",
        protocol: "https",
      },
      {
        hostname: "*.google.com",
        protocol: "https",
      },
      {
        hostname: "*.googleusercontent.com",
        protocol: "https",
      },
      {
        hostname: "lh3.googleusercontent.com",
        protocol: "https",
      },
      {
        hostname: "drive.google.com",
        protocol: "https",
      },
      {
        hostname: "drive.usercontent.google.com",
        protocol: "https",
      },
      {
        hostname: "image",
        protocol: "https",
      },
      {
        hostname: "images.unsplash.com",
        protocol: "https",
      },
      {
        hostname: "i.pravatar.cc",
        protocol: "https",
      }
    ],
  },
};

export default nextConfig;
