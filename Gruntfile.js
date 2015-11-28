module.exports = function (grunt) {
    grunt.initConfig({
        "pkg": grunt.file.readJSON("package.json"),
        "meta": {
            "paths": {
                "source": "Source",
                "dist": "Distribution"
            }
        },
        "clean": ["<%= meta.paths.dist %>"],
        "tslint": {
            "options": {
                "configuration": grunt.file.readJSON("tslint.json")
            },
            "files": {
                "src": [
                    "<%= meta.paths.source %>/<%= pkg.name %>.ts",
                    "<%= meta.paths.source %>/settings/*.ts",
                ]
            }
        },
        "typescript": {
            "base": {
                "src": "<%= meta.paths.source %>/<%= pkg.name %>.ts"
            },
            "distribution": {
                "src": "<%= meta.paths.source %>/<%= pkg.name %>.ts",
                "dest": "<%= meta.paths.dist %>/<%= pkg.name %>-<%= pkg.version %>.js"
            }
        },
        "copy": {
            "dist": {
                "files": [{
                    "src": "<%= meta.paths.source %>/<%= pkg.name %>.ts",
                    "dest": "<%= meta.paths.dist %>/<%= pkg.name %>-<%= pkg.version %>.ts"
                }, {
                    "src": "<%= meta.paths.source %>/<%= pkg.name %>.d.ts",
                    "dest": "<%= meta.paths.dist %>/<%= pkg.name %>-<%= pkg.version %>.d.ts"
                }, {
                    "src": "<%= meta.paths.dist %>/<%= pkg.name %>-<%= pkg.version %>.js",
                    "dest": "<%= meta.paths.dist %>/<%= pkg.name %>-<%= pkg.version %>/<%= pkg.name %>-<%= pkg.version %>.js"
                }, {
                    "src": "<%= meta.paths.source %>/References/*.ts",
                    "dest": "<%= meta.paths.dist %>/",
                    "expand": true,
                    "flatten": true
                }, {
                    "src": "README.md",
                    "dest": "<%= meta.paths.dist %>/"
                }, {
                    "src": "README.md",
                    "dest": "<%= meta.paths.source %>/"
                }, {
                    "src": "LICENSE.txt",
                    "dest": "<%= meta.paths.dist %>/"
                }, {
                    "src": "LICENSE.txt",
                    "dest": "<%= meta.paths.source %>/"
                }, {
                    "cwd": "<%= meta.paths.source %>/",
                    "src": "Fonts/**",
                    "dest": "<%= meta.paths.dist %>/<%= pkg.name %>-<%= pkg.version %>/",
                    "expand": true
                }, {
                    "cwd": "<%= meta.paths.source %>/",
                    "src": "Sounds/**",
                    "dest": "<%= meta.paths.dist %>/<%= pkg.name %>-<%= pkg.version %>/",
                    "expand": true
                }, {
                    "cwd": "<%= meta.paths.source %>/",
                    "src": "Theme/**",
                    "dest": "<%= meta.paths.dist %>/<%= pkg.name %>-<%= pkg.version %>/",
                    "expand": true
                }]
            }
        },
        "uglify": {
            "options": {
                "compress": true,
                "sourceMap": true
            },
            "dist": {
                "files": {
                    "<%= meta.paths.dist %>/<%= pkg.name %>-<%= pkg.version %>/<%= pkg.name %>-<%= pkg.version %>.min.js": [
                        "<%= meta.paths.dist %>/<%= pkg.name %>-<%= pkg.version %>/<%= pkg.name %>-<%= pkg.version %>.js",
                        "<%= meta.paths.source %>/settings/*.js",
                        "<%= meta.paths.source %>/settings/maps/*.js"
                    ],
                    "<%= meta.paths.dist %>/<%= pkg.name %>-<%= pkg.version %>/index.min.js": [
                        "<%= meta.paths.source %>/index.js"
                    ]
                }
            }
        },
        "cssmin": {
            "options": {
                "sourceMap": true
            },
            "dist": {
                "files": {
                    "<%= meta.paths.dist %>/<%= pkg.name %>-<%= pkg.version %>/index.min.css": ["<%= meta.paths.source %>/index.css"]
                }
            }
        },
        "preprocess": {
            "dist": {
                "src": "<%= meta.paths.dist %>/<%= pkg.name %>-<%= pkg.version %>.ts",
                "dest": "<%= meta.paths.dist %>/<%= pkg.name %>-<%= pkg.version %>.ts"
            }
        },
        "processhtml": {
            "dist": {
                "options": {
                    "process": true,
                    "data": {
                        "version": "<%= pkg.version %>"
                    }
                },
                "files": {
                    "<%= meta.paths.dist %>/<%= pkg.name %>-<%= pkg.version %>/index.html": "<%= meta.paths.source %>/index.html"
                }
            }
        },
        "htmlmin": {
            "dist": {
                "options": {
                    "removeComments": true,
                    "collapseWhitespace": true
                },
                "files": {
                    "<%= meta.paths.dist %>/<%= pkg.name %>-<%= pkg.version %>/index.html": "<%= meta.paths.dist %>/<%= pkg.name %>-<%= pkg.version %>/index.html"
                }
            },
        },
        "zip": {
            "dist": {
                "cwd": "<%= meta.paths.dist %>/FullScreenMario-<%= pkg.version %>/",
                "src": "<%= meta.paths.dist %>/FullScreenMario-<%= pkg.version %>/**",
                "dest": "<%= meta.paths.dist %>/FullScreenMario-<%= pkg.version %>.zip"
            }
        },
        "mocha_phantomjs": {
            "all": ["Tests/*.html"]
        }
    });

    grunt.loadNpmTasks("grunt-contrib-clean");
    grunt.loadNpmTasks("grunt-contrib-copy");
    grunt.loadNpmTasks("grunt-contrib-cssmin");
    grunt.loadNpmTasks("grunt-contrib-htmlmin");
    grunt.loadNpmTasks("grunt-contrib-uglify");
    grunt.loadNpmTasks("grunt-mocha-phantomjs");
    grunt.loadNpmTasks("grunt-preprocess");
    grunt.loadNpmTasks("grunt-processhtml");
    grunt.loadNpmTasks("grunt-tslint");
    grunt.loadNpmTasks("grunt-typescript");
    grunt.loadNpmTasks("grunt-zip");
    grunt.registerTask("default", [
        "clean", "tslint", "typescript", "copy", "uglify", "cssmin", "preprocess", "processhtml", "htmlmin", "mocha_phantomjs", "zip"
    ]);
};