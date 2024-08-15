/** @type {import('next').NextConfig} */

const nextConfig = {
    output: 'export', // Outputs a Single-Page Application (SPA).
    distDir: './dist', // Changes the build output directory to `./dist/`.

    webpack: (config) => {
        config.module.rules.push({
          test: /\.(woff|woff2|eot|ttf|otf)$/, // Matches font files
          use: [
            {
              loader: 'file-loader',
              options: {
                outputPath: 'static/fonts',
                publicPath: '/_next/static/fonts',
                name: '[name].[hash].[ext]', // Keeps font names unique with hashes
              },
            },
          ],
        });
    
        return config;
    },
}
   
  export default nextConfig
