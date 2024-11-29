/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  images: {
    domains: ['github.com', 'avatars.githubusercontent.com'],
  },
  experimental: {
    optimizeCss: true,
    turbo: {
      rules: {
        '*.md': ['raw-loader']
      }
    },
  },
  webpack: (config) => {
    // Add cache configuration
    config.cache = {
      type: 'filesystem',
      buildDependencies: {
        config: [__filename],
      }
    }

    config.module.rules.push({
      test: /\.js$/,
      include: /node_modules\/undici/,
      use: {
        loader: 'babel-loader',
        options: {
          presets: ['@babel/preset-env'],
          plugins: ['@babel/plugin-proposal-private-methods', '@babel/plugin-proposal-class-properties']
        }
      }
    })
    return config;
  }
}

module.exports = nextConfig