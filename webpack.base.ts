import webpack from 'webpack'
import {VueLoaderPlugin} from 'vue-loader'
import HtmlWebpackPlugin from 'html-webpack-plugin'
import path from 'path'
import autoprefixer from 'autoprefixer'
import ForkTsCheckerWebpackPlugin from 'fork-ts-checker-webpack-plugin'
import CopyPlugin from 'copy-webpack-plugin'
import MiniCssExtractPlugin from 'mini-css-extract-plugin'
import CssMinimizerPlugin from 'css-minimizer-webpack-plugin'
import TerserPlugin from 'terser-webpack-plugin'
import CompressionPlugin from 'compression-webpack-plugin'
const isDev = process.env.NODE_ENV === 'development' // 是否是开发模式


const config: webpack.Configuration = {
    entry: path.resolve(__dirname, './src/main.ts'),
    output: {
        path: path.resolve(__dirname, './dist'),
        filename: '[name].[chunkhash:8].js',
        clean: true,
        publicPath: '/',
    },
    module: {
        rules: [
            {
                test: /\.(ts)$/,
                use: ['thread-loader', isDev ? {
                    loader: 'ts-loader',
                    options: {
                        transpileOnly: true,
                        happyPackMode: true,
                    },
                } : 'babel-loader'],
            },
            {
                test: /\.vue$/,
                loader: 'vue-loader',
            },
           {
                test: /\.(png|jpe?g|gif|svg)$/i,
                type: 'asset',
                parser: {
                    dataUrlCondition: {
                        maxSize: 10 * 1024, // 8kb
                    },
                },
                generator: {
                    filename: 'static/images/[name][contenthash:8][ext]', 
                }
            },
            {
                test:/.(woff2?|eot|ttf|otf)$/,
                type: "asset",
                parser: {
                dataUrlCondition: {
                    maxSize: 10 * 1024,
                }
                },
                generator:{ 
                filename:'static/fonts/[name][contenthash:8][ext]',
                },
            },
            {
                test:/.(mp4|webm|ogg|mp3|wav|flac|aac)$/,
                type: "asset",
                parser: {
                dataUrlCondition: {
                    maxSize: 10 * 1024,
                }
                },
                generator:{ 
                filename:'static/media/[name][contenthash:8][ext]',
                },
            },
            {
                test: /\.css$/,
                use: [isDev ? 'style-loader' : MiniCssExtractPlugin.loader, 'css-loader', {
                    loader: 'postcss-loader',
                    options: {
                        postcssOptions: {
                            plugins: [
                                autoprefixer
                            ],
                        },
                    },
                }],
            },
            {
                test: /\.less$/,
                use: [isDev ? 'style-loader' : MiniCssExtractPlugin.loader, 'css-loader', {
                    loader: 'postcss-loader',
                    options: {
                        postcssOptions: {
                            plugins: [
                                autoprefixer
                            ],
                        },
                    },
                }, 'less-loader'],
            },
        ]
    },
    plugins: [
        new VueLoaderPlugin(),
        new HtmlWebpackPlugin({
            template: path.resolve(__dirname, './index.html'),
        }),
        // 注入环境变量，业务层可以访问 process.env.NODE_ENV
        new webpack.DefinePlugin({
            'process.env.NODE_ENV': JSON.stringify(process.env.NODE_ENV || 'development'),
        }),
        new ForkTsCheckerWebpackPlugin({
            // async: true, 如果webpack的mode是development，会自动开启，在webpack编译后输出类型检查结果，否则会阻塞webpack的构建
            typescript: {
                configFile: path.resolve(__dirname, './tsconfig.json'),
            },
        }),
        new CopyPlugin({
           patterns: [
            {
                from: path.resolve(__dirname, './public'),
                to: path.resolve(__dirname, './dist'),
            }
           ]
        }),
        new webpack.ProgressPlugin(),
        new MiniCssExtractPlugin({
            filename: 'static/css/[name].[contenthash:8].css' // 抽离css的输出目录和名称
        }),
        new CompressionPlugin({
            filename: '[path][base].gz', // 文件命名
            algorithm: 'gzip', // 压缩格式,默认是gzip
            test: /.(js|css)$/, // 只生成css,js压缩文件
            threshold: 10240, // 只有大小大于该值的资源会被处理。默认值是 10k
            minRatio: 0.8, // 压缩率,默认值是 0.8
            deleteOriginalAssets: true,
        })
    ],
    resolve: {
        extensions: ['.vue', '.ts', '.js', '.json'],
        alias: {
            '@': path.resolve(__dirname, 'src'),
        },
    },
    // 持久化存储缓存，提高构建速度
    cache: {
        type: 'filesystem',
    },
    optimization: {
        minimize: true,
        runtimeChunk: 'single',
        minimizer: [
            new CssMinimizerPlugin(),
            new TerserPlugin({
                terserOptions: {
                    compress: {
                        pure_funcs: ["console.log"] // 删除console.log
                    }
                }
            })
        ],
        splitChunks: {
            chunks: 'all',
            cacheGroups: {
                vendors: {
                   test: /node_modules/, // 只匹配node_modules里面的模块
                    name: 'vendors', // 提取文件命名为vendors,js后缀和chunkhash会自动加
                    minChunks: 1, // 只要使用一次就提取出来
                    chunks: 'initial', // 只提取初始化就能获取到的模块,不管异步的
                    minSize: 0, // 提取代码体积大于0就提取出来
                    priority: 1, // 提取优先级为1
                },
                commons: { // 提取页面公共代码
                    name: 'commons', // 提取文件命名为commons
                    minChunks: 2, // 只要使用两次就提取出来
                    chunks: 'initial', // 只提取初始化就能获取到的模块,不管异步的
                    minSize: 0, // 提取代码体积大于0就提取出来
                }
            },
        },
    },
}

export default config;
