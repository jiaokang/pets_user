module.exports = {
  devServer: {
    proxy: {
      '/api': {
        target: 'http://localhost:9000',
        changeOrigin: true,
        pathRewrite: null // 不重写路径，保持原有的 /api 前缀
      }
    }
  }
}