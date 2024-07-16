const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const CopyPlugin = require("copy-webpack-plugin");
// const MomentLocalesPlugin = require('moment-locales-webpack-plugin');
module.exports = {
    entry: [
        // './src/components/form.js',
        './src/components/bootstrap.min.js',
        './src/app.ts',
    ],
    devtool: 'inline-source-map',
    mode: "development",
    output: {
        filename: 'main.js',
        path: path.resolve(__dirname, 'dist'),
        clean: true,
    },
    devServer: {
        static: '.dist',
        compress: true,
        port: 9001,
    },
    module: {
        rules: [
            {
                test: /\.tsx?$/,
                use: 'ts-loader',
                exclude: /node_modules/,
            },
        ],
    },
    resolve: {
        extensions: ['.tsx', '.ts', '.js']
    },
    plugins: [
        new HtmlWebpackPlugin({
            template: "./index.html"
        }),
        new CopyPlugin({
            patterns: [
                {from: "templates", to: "templates"},
                {from: "src/components", to: "components"},
                {from: "styles", to: "styles"},
                {from: "static/fonts", to: "fonts"},
                {from: "static/images", to: "images"},

            ],
        }),


        /*        new MomentLocalesPlugin(),

                 new MomentLocalesPlugin({
                    localesToKeep: ['es-us', 'ru'],
                }),*/

    ],
    // module: {
    //     rules: [
    //         {
    //             test: /\.(?:js|mjs|cjs)$/,
    //             exclude: /node_modules/,
    //             use: {
    //                 loader: 'babel-loader',
    //                 options: {
    //                     presets: [
    //                         ['@babel/preset-env', { targets: "defaults" }]
    //                     ]
    //                 }
    //             }
    //         }
    //     ]
    // }
};