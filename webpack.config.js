const path = require('path');
const webpack = require('webpack');
module.exports = {
    target: 'node',
    mode: 'development',
    entry: './bin/main.ts',
    plugins: [
        // 解决npm link后。Node.js 将其视为 shell 脚本而不是 JavaScript 文件
        new webpack.BannerPlugin({ banner: '#!/usr/bin/env node', raw: true, entryOnly: true }),
      ],
    output: {
        path: path.resolve(__dirname, 'dist'),
        filename: 'bundle.js',
    },
    module: {
        rules: [
            {
                test: /\.(js|ts)$/,
                exclude: /node_modules/,
                use: [
                    {
                        loader: 'babel-loader',
                        options: {
                            presets: [
                                '@babel/preset-env',
                                '@babel/preset-typescript',
                            ],
                        },
                    },
                ],
            },
        ],
    },
    resolve: {
        extensions: ['.tsx', '.ts', '.js'],
        fallback: {
            "fs": false,
            "tty": false,
            "child_process": false,
            "stream": false,
            "crypto": false,
            "path": false,
            "assert": false,
            "process": false
        },
    },
    externals: {
        'tmp': 'commonjs tmp',
        'external-editor': 'commonjs external-editor',
        'fs': 'commonjs fs',
        'child_process': 'commonjs child_process'
      }
};
