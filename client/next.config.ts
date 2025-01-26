const nextConfig = {
    experimental: {
        appDir: true // Ensure the app directory is enabled
    },
    images: {
        remotePatterns: [
            {
                protocol: 'https',
                hostname: 'lh3.googleusercontent.com',
                port: '',
                pathname: '/a/**'
            }
        ]
    }
};

module.exports = nextConfig;
