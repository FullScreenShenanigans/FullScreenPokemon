module.exports = {
    entry: {
        main: "./src/index.ts",
    },
    mode: "production",
    module: {
        rules: [
            {
                test: /\.(tsx?)|(jsx?)$/,
                exclude: /node_modules/,
                use: {
                    loader: require.resolve("babel-loader"),
                    options: {
                        rootMode: "upward-optional",
                    },
                },
            },
        ],
    },
    output: {
        filename: "FullScreenPokemon.js",
        chunkFilename: "FullScreenPokemon.js",
        publicPath: "dist/",
    },
    resolve: {
        extensions: [".ts", ".tsx", ".js", ".json"],
        symlinks: true,
    },
};
