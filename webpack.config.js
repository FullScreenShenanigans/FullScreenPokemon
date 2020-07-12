const { shenanigans } = require("./package.json");
const { loading = {} } = shenanigans;

const getEntriesAndSources = () => {
    return (
        loading.entries || [
            {
                entry: `./lib/index.js`,
                name: loading.name || shenanigans.name,
            },
        ]
    );
};

const getExternals = () => {
    const output = {};

    if (loading.externals === undefined) {
        return output;
    }

    for (const external of loading.externals) {
        output[external.name] = external.name;
    }

    return output;
};

const entriesAndSources = getEntriesAndSources();
const externals = getExternals();

const entry = {};

for (const pair of entriesAndSources) {
    entry[pair.name] = pair.entry;
}

module.exports = {
    entry,
    externals,
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
        filename: `[name].js`,
        libraryTarget: "amd",
        publicPath: "dist/",
    },
    resolve: {
        extensions: [".ts", ".tsx", ".js", ".json"],
        symlinks: true,
    },
};
