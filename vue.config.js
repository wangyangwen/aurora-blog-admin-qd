module.exports = {
  // 将 publicPath 设置为相对路径，这样不管部署在哪个路径下，资源都能正确加载
  publicPath: '/admin/',
  
  // 如果你的应用被部署在子路径下，例如 https://example.com/admin/
  // 那么设置为 '/admin/'
  // publicPath: '/admin/',
  
  outputDir: 'dist',
  assetsDir: '',
  productionSourceMap: false,
  
  devServer: {
    port: 8080,
    open: true,
    overlay: {
      warnings: false,
      errors: true
    },
    proxy: {
      '/api': {
        target: 'http://localhost:3000',
        changeOrigin: true,
        pathRewrite: {
          '^/api': ''
        }
      }
    }
  }
} 