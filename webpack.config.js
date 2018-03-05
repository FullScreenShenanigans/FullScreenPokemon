const glob = require("glob");
const path = require("path");

const package = require("./package.json");

const getEntriesAndSources = () => {
    return package.shenanigans.entries === undefined
        ? [
            {
                entry: `./src/index.js`,
                name: package.shenanigans.name,
            }
        ]
        : package.shenanigans.entries;
};

const getExternals = (shenanigans) => {
    const output = {};

    if (shenanigans.externals === undefined) {
        return output;
    }

    for (const external of shenanigans.externals) {
        output[external.name] = external.name;
    }

    return output;
};

const externals = getExternals(package.shenanigans);
const entriesAndSources = getEntriesAndSources();

const entry = {};

for (const pair of entriesAndSources) {
    entry[pair.name] = pair.entry;
}

module.exports = {
    entry,
    externals,
    mode: "production",
    output: {
        filename: "[name].js",
        libraryTarget: "amd",
        path: path.join(__dirname, "dist"),
    },
    performance: {
        hints: false
    }
};
