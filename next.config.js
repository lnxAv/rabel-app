// Plugins
const withPWA = require('next-pwa')
const withBundleAnalyzer = require('@next/bundle-analyzer')({
  enabled: process.env.ANALYZE === 'true',
})

// Imports
const { i18n } = require('./next-i18next.config')
const runtimeCaching = require('next-pwa/cache')

// Notes:
/**
 ** Analzer: https://www.npmjs.com/package/@next/bundle-analyzer
 ** */

const isDev = process.env.NODE_ENV !== 'production'
/** @type {import('next').NextConfig}**/
const nextConfig = {
  pageExtensions: ['page.tsx', 'api.ts', 'index.tsx'],
  reactStrictMode: true,
  swcMinify: true,
  compiler: {
    styledComponents: true,
  },
  i18n,
  pwa: {
    dest: 'public',
    disable: process.env.NODE_ENV === 'development',
    runtimeCaching,
    // register: true,
    // scope: '/app',
    // sw: 'sw.js',
    //...
  },
  webpack: (config, { isServer }) => {
    // audio support
    config.module.rules.push({
      test: /\.(ogg|mp3|wav|mpe?g)$/i,
      exclude: config.exclude,
      use: [
        {
          loader: require.resolve('url-loader'),
          options: {
            limit: config.inlineImageLimit,
            fallback: require.resolve('file-loader'),
            publicPath: `${config.assetPrefix}/_next/static/images/`,
            outputPath: `${isServer ? '../' : ''}static/images/`,
            name: '[name]-[hash].[ext]',
            esModule: config.esModule || false,
          },
        },
      ],
    })
    // shader support
    config.module.rules.push({
      test: /\.(glsl|vs|fs|vert|frag)$/,
      exclude: /node_modules/,
      use: ['raw-loader', 'glslify-loader'],
    })
    return config
  },
}

/** @type {import('next').NextConfig} */

module.exports = () => {
  const plugins = [withPWA, withBundleAnalyzer]
  const config = plugins.reduce((acc, next) => next(acc), {
    ...nextConfig,
  })
  return config
}
