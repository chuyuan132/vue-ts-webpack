import { Configuration } from 'webpack'
import baseConfig from './webpack.base'
import {merge} from 'webpack-merge'

const config:Configuration = merge(baseConfig, {
    mode: 'production',
})

export default config;
