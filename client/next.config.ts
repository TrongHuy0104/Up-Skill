const nextConfig = {
    images: {
        domains: ['creativelayers.net', 'res.cloudinary.com'],
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
