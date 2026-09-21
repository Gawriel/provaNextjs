import type { NextConfig } from "next";
import path from "path";

const nextConfig: NextConfig = {
  // Consente Hot Reload anche se apri il sito dall'IP di rete (non solo localhost)
  allowedDevOrigins: ["192.168.1.129", "localhost", "127.0.0.1"],
  // Evita che Turbopack prenda un package-lock fuori dal progetto
  turbopack: {
    root: path.join(__dirname),
  },
};

export default nextConfig;
