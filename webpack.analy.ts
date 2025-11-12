import { Configuration } from 'webpack'
import baseConfig from './webpack.base'
import {merge} from 'webpack-merge'
import { BundleAnalyzerPlugin } from 'webpack-bundle-analyzer'
const config:Configuration = merge(baseConfig, {
    mode: 'production',
    plugins: [
        new BundleAnalyzerPlugin()
    ]
})

export default config;
