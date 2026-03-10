const path = require("path");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const webpack = require("webpack");
const CopyWebpackPlugin = require("copy-webpack-plugin");

const NODE_ENV =
    process.env.NODE_ENV ||
    (process.env.WEBPACK_SERVE ? "development" : "production");

const APP_LOGS = process.env.APP_LOGS ?? "1";

module.exports = {
    entry: path.resolve(__dirname, "../src/index.tsx"),
    output: {
        path: path.resolve(__dirname, "../dist"),
        filename: "bundle.[contenthash].js",
        clean: true,
        publicPath: "/",
    },
    resolve: {
        extensions: [".tsx", ".ts", ".js"],
    },
    module: {
        rules: [
            {
                test: /\.[tj]sx?$/i,
                exclude: /node_modules/,
                use: "babel-loader",
            },
            {
                test: /\.css$/i,
                use: ["style-loader", "css-loader"],
            },
            {
                test: /\.svg$/i,
                resourceQuery: /raw/,
                type: "asset/source",
            },
        ],
    },
    plugins: [
        new HtmlWebpackPlugin({
            template: path.resolve(__dirname, "../public/index.html"),
        }),

        new webpack.DefinePlugin({
            "process.env.NODE_ENV": JSON.stringify(NODE_ENV),
            "process.env.APP_LOGS": JSON.stringify(APP_LOGS),
        }),

        new CopyWebpackPlugin({
            patterns: [
                {
                    from: path.resolve(__dirname, "../public/icons"),
                    to: "icons",
                },
                {
                    from: path.resolve(__dirname, "../public/images"),
                    to: "images",
                },
            ],
        }),
    ],
};
