require "coffee-script"
fs = require "fs"
open = require "open"

module.exports = (grunt) ->
    pkg = grunt.file.readJSON "package.json"
    version = pkg.version
    banner = """
        /**
        * <%= pkg.name %> <%= pkg.version %>
        * <%= pkg.author.url %> *
        * Copyright <%= grunt.template.today("yyyy") %>, <%= pkg.author.name %>
        * Dual licensed under the MIT or GPL licenses.
        */
    """

    docGen = ->
        outputFile = "./build/api.json"
        sourceParser = require "./build/parseSourceDocs"
        apiGenerator = require "./build/parseNodes"

        sourceFiles = grunt.file.expand "src/**/*.js"
        blocks = sourceParser.parse sourceFiles
        jsonObject = apiGenerator.structureBlocks blocks

        apiJSON = JSON.stringify jsonObject, null, 4
        grunt.file.write outputFile, apiJSON
        grunt.log.writeln "Wrote api data to #{outputFile}"

    apiServer = require "./build/api-gen/dynamic-server"
    runApiServer = ->
        done = @async()
        apiServer grunt, "./build/api.json"
        setTimeout (-> open "http://localhost:8080"), 100

    grunt.initConfig
        pkg: pkg
        usebanner:
            dist:
                options:
                    position: "top"
                    banner: banner
                files:
                    src: ["crafty.js"]
        browserify:
            dist:
                files:
                    "crafty.js": ["src/crafty.js"]
                options:
                    transform: ["brfs"]
            debug:
                files:
                    "crafty.js": ["src/crafty.js"]
                options:
                    debug: true
                    transform: ["brfs"]
        watch:
            files: ["src/*.js"]
            tasks: ["build:dev"]
        uglify:
            options:
                banner: banner
            build:
                src: "crafty.js"
                dest: "crafty-min.js"
        jshint:
            files: ["Gruntfile.js", "src/**/*.js", "tests/**/*.js"]
            options:
                trailing: true
                ignores: ["tests/lib/*.js"]
        qunit:
            all: ["tests/index.html"]
        "node-qunit":
            all:
                deps: "tests/lib/helperFunctions.js"
                code: "tests/index_headless.js"
                tests: [
                    "tests/common.js"
                    "tests/core.js"
                    "tests/2d.js"
                    "tests/logging.js"
                    "tests/controls.js"
                    "tests/events.js"
                    #TODO add these once isometric adapted:
                    #"tests/isometric.js"
                    "tests/math.js"
                    "tests/model.js"
                    "tests/storage.js"
                    "tests/systems.js"
                    "tests/time.js"
                    "tests/tween.js"
                    "tests/issue746/mbr.js"
                    "tests/issue746/pos.js"
                    "tests/2D/collision/collision.js"
                    "tests/2D/collision/sat.js"
                ]
                setup:
                    log:
                        errors: true
                        #tests: true
                        globalSummary: true
                done: (err, res) ->
                    if not err
                        grunt.log.ok "NODE TESTS SUCCESSFUL"
                    else
                        grunt.log.error "NODE TESTS FAILED"
        jsvalidate:
            files: ["crafty.js", "tests/**/*.js"]
        connect:
            server:
                options:
                    keepalive: true
        open:
            api :
              path: "http://localhost:8080/"

    # Load the plugin that provides the "uglify" task.
    grunt.loadNpmTasks "grunt-contrib-uglify"
    grunt.loadNpmTasks "grunt-contrib-jshint"
    grunt.loadNpmTasks "grunt-contrib-qunit"
    grunt.loadNpmTasks "grunt-contrib-watch"
    grunt.loadNpmTasks "grunt-contrib-connect"
    grunt.loadNpmTasks "grunt-jsvalidate"
    grunt.loadNpmTasks "grunt-browserify"
    grunt.loadNpmTasks "grunt-banner"
    grunt.loadNpmTasks "grunt-node-qunit"

    grunt.registerTask "version", "Takes the version into src/version.js", ->
        fs.writeFileSync "src/version.js", "module.exports = \"#{version}\";"

    # Build development
    grunt.registerTask "build:dev", ["browserify:debug", "usebanner"]

    # Build release
    grunt.registerTask "build:release", ["browserify:dist", "usebanner"]

    # Building the documentation
    grunt.registerTask "api", "Generate api documentation", docGen

    # Default task.
    grunt.registerTask "default", ["build:dev", "jsvalidate"]

    # Run the test suite
    grunt.registerTask "check", ["build:dev", "jsvalidate", "qunit", "node-qunit", "jshint"]

    # Make crafty.js ready for release - minified version
    grunt.registerTask "release", ["version", "build:release", "uglify", "api"]

    # Run only tests
    grunt.registerTask "validate", ["qunit", "node-qunit"]

    grunt.registerTask "api-server", "View dynamically generated docs", runApiServer
    grunt.registerTask "view-api", ["api", "api-server"]
