import path from "path";
import MiniCssExtractPlugin from "mini-css-extract-plugin";
import CssMinimizerPlugin from "css-minimizer-webpack-plugin";
const __dirname = path.resolve();

export default {
    entry: "./public/js/scripts.js",
    output: {
        path: path.resolve(__dirname, "./public/bundle/"),
        filename: "bundle.js",
    },
    plugins: [
        new MiniCssExtractPlugin({
            filename: "bundle.css",
            chunkFilename: "[id].css",
        }),
    ],
    optimization: {
        minimizer: [new CssMinimizerPlugin()],
    },
    module: {
        rules: [
            {
                test: /\.js$/,
                exclude: /node_modules/,
                use: {
                    loader: "babel-loader",
                    options: {
                        presets: ["@babel/preset-env"],
                        plugins: ["@babel/plugin-transform-runtime"],
                    },
                },
            },
            {
                exclude: /node_modules/,
                test: /\.css$/,
                use: [
                    {
                        loader: MiniCssExtractPlugin.loader,
                        options: {
                            publicPath: "./css",
                        },
                    },
                    "css-loader",
                ],
            },
        ],
    },
};
