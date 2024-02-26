module.exports = {
    // webpack5 不用配置mode
    // 入口
    entry: {
        view: "./src/view/index.js", // 第一个入口，打包为view.js
        service: "./src/service/index.js" // 第二个入口，打包为service.js
    },
    // 出口
    output: {
        // 虚拟打包路径，文件夹不会真正生成，而是在8080端口虚拟生成
        publicPath: "minapp",
        // 打包出来的文件名
        filename: "[name].js",
    },
    // 配置webpack-dev-server
    devServer: {
        // 静态根目录
        contentBase: 'www',
        // 端口号
        port: 8080,
    },
};