方式一：transform-runtime

{
    "presets": [
        [
            "env",
            {
                "targets": {
                    "browsers": [
                        "> 1%",
                        "last 2 versions",
                        "not ie <= 8"
                    ]
                }
            }
        ],
        "stage-2"
    ],
    "plugins": [
        [
            "transform-runtime"
        ],
        [
            "component",
            {
                "libraryName": "mint-ui",
                "style": true
            }
        ],
        [
            "transform-decorators-legacy"
        ],
        [
            "transform-vue-jsx"
        ]
    ]
}

方式二：babel-polyfill+ env中配置"useBuiltIns": true
入口
import "babel-polyfill";


{
    "presets": [
        [
            "env",
            {
                "targets": {
                    "browsers": [
                        "> 1%",
                        "last 2 versions",
                        "not ie <= 8"
                    ]
                },
                "useBuiltIns": true
            }
        ],
        "stage-2"
    ],
    "plugins": [
        [
            "component",
            {
                "libraryName": "mint-ui",
                "style": true
            }
        ],
        [
            "transform-decorators-legacy"
        ],
        [
            "transform-vue-jsx"
        ]
    ]
}

测试方式一更小