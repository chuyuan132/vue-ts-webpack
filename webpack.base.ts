import webpack from 'webpack'
import {VueLoaderPlugin} from 'vue-loader'
import HtmlWebpackPlugin from 'html-webpack-plugin'
import path from 'path'
import autoprefixer from 'autoprefixer'
import ForkTsCheckerWebpackPlugin from 'fork-ts-checker-webpack-plugin'
import CopyPlugin from 'copy-webpack-plugin'
const config: webpack.Configuration = {
    entry: path.resolve(__dirname, './src/main.ts'),
    output: {
        path: path.resolve(__dirname, './dist'),
        filename: '[name].[contenthash].js',
        clean: true,
        publicPath: '/',
    },
    module: {
        rules: [
            // {
            //     test: /\.ts$/,
            //     use: {
            //         loader: 'ts-loader',
            //         options: {
            //             appendTsSuffixTo: [/\.vue$/], // 允许 ts-loader 处理 .vue 文件中的 TS 块
            //             transpileOnly: true, // 开启仅转译，将类型检查交给 ForkTsChecker
            //             happyPackMode: true, // 提高构建速度
            //         }
            //     }
            // },
            {
                test: /\.(ts)$/,
                use: 'babel-loader'
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
                    filename: 'static/images/[name][contenthash][ext]', 
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
                filename:'static/fonts/[name][ext]',
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
                filename:'static/media/[name][ext]',
                },
            },
            {
                test: /\.(css|less)$/,
                use: ['style-loader', 'css-loader', {
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
    ],
    resolve: {
        extensions: ['.vue', '.ts', '.js', '.json'],
        alias: {
            '@': path.resolve(__dirname, 'src'),
        },
    },
}

export default config;
