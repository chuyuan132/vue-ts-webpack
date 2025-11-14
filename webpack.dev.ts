import { Configuration } from 'webpack'
import { Configuration as DevServerConfiguration } from 'webpack-dev-server'
import path from 'path'
import baseConfig from './webpack.base'
import {merge} from 'webpack-merge'

type DEVSERVER_CONFIG = Configuration & {
    devServer?: DevServerConfiguration
}

const config:DEVSERVER_CONFIG = merge(baseConfig, {
    mode: 'development',
    devtool: 'eval-cheap-module-source-map',
    devServer: {
        port: 8080,
        open: true,
        hot: true,
        historyApiFallback: true,
        static: {
            directory: path.join(__dirname, 'public'),
        },
    },
})

export default config;
