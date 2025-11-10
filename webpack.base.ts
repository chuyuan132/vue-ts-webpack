import { Configuration } from 'webpack'
import { fileURLToPath } from 'url'
import {VueLoaderPlugin} from 'vue-loader'
import HtmlWebpackPlugin from 'html-webpack-plugin'
import path from 'path'

const __dirname = path.dirname(fileURLToPath(import.meta.url))

const config:Configuration = {
    mode: 'development',
    entry: path.resolve(__dirname, './src/main.ts'),
    output: {
        path: path.resolve(__dirname, './dist'),
        filename: '[name].[contenthash].js',
        clean: true,
        publicPath: '/',
    },
    module: {
        rules: [
            {
                test: /\.ts$/,
                use: {
                    loader: 'ts-loader',
                    options: {
                        appendTsSuffixTo: [/\.vue$/], // 允许 ts-loader 处理 .vue 文件中的 TS 块
                        transpileOnly: true, // 开启仅转译，将类型检查交给 ForkTsChecker
                        happyPackMode: true, // 提高构建速度
                    }
                }
            },
            {
                test: /\.vue$/,
                loader: 'vue-loader',
            },
            {
                test: /\.css$/,
                use: ['style-loader', 'css-loader'],
            }
        ]
    },
    plugins: [
        new VueLoaderPlugin(),
        new HtmlWebpackPlugin({
            template: path.resolve(__dirname, './index.html'),
        })
    ],
    resolve: {
        extensions: ['.vue', '.ts', '.js', '.json'],
        alias: {
            '@': path.resolve(__dirname, 'src'),
        },
    },
}

export default config;
