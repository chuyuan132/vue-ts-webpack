module.exports = {
    presets: [
        [
            '@babel/preset-env',
            {
                // 不写会自己根据 browserslist 配置
                // "targets": {
                //     "chrome": 35,
                //     "ie": 9
                // },
                "useBuiltIns": "usage",
                "corejs": 3
            }
        ],
        [
            '@babel/preset-typescript',
            {   
                "allExtensions": true,
            }
        ]
    ],
}