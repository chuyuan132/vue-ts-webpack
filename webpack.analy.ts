import { Configuration } from 'webpack'
import SpeedMeasurePlugin from 'speed-measure-webpack-plugin'
import { merge } from 'webpack-merge'
import webpackProdConfig from './webpack.prod'

const smp = new SpeedMeasurePlugin({})

const config: Configuration = merge(webpackProdConfig, {
})

export default smp.wrap(config as any)