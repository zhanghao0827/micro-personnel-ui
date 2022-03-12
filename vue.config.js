module.exports = {
    lintOnSave: false,
    devServer: {
        proxy: {
            "/ws": {
                target: 'ws://localhost:9000',  //代理服务器目标
                ws: true,
            },
            "/": {
                target: 'http://localhost:9000',  //代理服务器目标
                ws: false,
                changOrigin: true,//允许跨域
                pathRewrite: {        //代理服务器路径重写
                    '^/': ''  //要写在最后，否则所有请求都会被http://localhost:8888代理
                }
            }
        }
    },
    configureWebpack: {
        name: '员工管理系统'
    }
}
