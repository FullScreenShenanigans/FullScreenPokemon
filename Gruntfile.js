module.exports = function (grunt) {
    grunt.initConfig({
        "pkg": grunt.file.readJSON("package.json"),
        "meta": {
            "deployPath": "dist"
        },
        "copy": {
            "default": {
                "files": [{
                    "src": "Sounds/**",
                    "dest": "<%= meta.deployPath %>/"
                }, {
                    "src": "Theme/**",
                    "dest": "<%= meta.deployPath %>/"
                }, {
                    "src": "Fonts/**",
                    "dest": "<%= meta.deployPath %>/"
                }, {
                    "src": "README.md",
                    "dest": "<%= meta.deployPath %>/"
                }, {
                    "src": "LICENSE.txt",
                    "dest": "<%= meta.deployPath %>/"
                }]
            }
        },
        "concat": {
            "dist": {
                "src": [
                    "src/*.js",
                    "src/*/*.js",
                    "FullScreenPokemon.js",
                    "settings/*.js"
                ],
                "dest": "<%= meta.deployPath %>/FullScreenPokemon.js"
            }
        },
        "uglify": {
            "options": {
                "compress": true
            },
            "dist": {
                "files": {
                    "<%= meta.deployPath %>/FullScreenPokemon.min.js": ["<%= meta.deployPath %>/FullScreenPokemon.js"],
                    "<%= meta.deployPath %>/index.min.js": ["index.js"]
                }
            }
        },
        "cssmin": {
            "target": {
                "files": {
                    "<%= meta.deployPath %>/index.min.css": ["index.css"]
                }
            }
        },
        "processhtml": {
            "dist": {
                "files": {
                    "<%= meta.deployPath %>/index.html": ["index.html"]
                }
            }
        },
        "htmlmin": {
            "dist": {
                "options": {
                    "removeComments": true,
                    "collapseWhitespace": true,
                    "minifyURLs": true
                },
                "files": {
                    "<%= meta.deployPath %>/index.html": ["<%= meta.deployPath %>/index.html"]
                }
            }
        },
        "clean": {
            "js": ["<%= meta.deployPath %>/FullScreenPokemon.js"]
        },
        "zip": {
            "using-cwd": {
            "cwd": "<%= meta.deployPath %>",
            "src": ["**"],
            "dest": "FullScreenPokemon-v<%= pkg.version %>.zip"
          }
        }
    });
    
    grunt.loadNpmTasks("grunt-contrib-copy");
    grunt.loadNpmTasks("grunt-contrib-concat");
    grunt.loadNpmTasks("grunt-contrib-uglify");
    grunt.loadNpmTasks("grunt-contrib-cssmin");
    grunt.loadNpmTasks("grunt-processhtml");
    grunt.loadNpmTasks("grunt-contrib-htmlmin");
    grunt.loadNpmTasks("grunt-contrib-clean");
    grunt.loadNpmTasks("grunt-zip");
    grunt.registerTask("default", [
        "copy", "concat", "uglify", "cssmin", "processhtml", "htmlmin", "clean", "zip"
    ]);
};