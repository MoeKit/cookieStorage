module.exports = function(grunt) {
    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),
        jasmine: {
            main: {
                src: 'src/cookie-storage.js',
                options: {
                    specs: 'spec/cookie-storage-spec.js',
                    helpers: 'http://underscorejs.org/underscore-min.js'
                }
            }
        },
        uglify: {
            options: {
                banner: '/*! <%= pkg.name %> v<%= pkg.version %> | <%= pkg.license %> */\n'
            },
            build: {
                src: 'src/cookie-storage.js',
                dest: 'dist/cookieStorage.min.js'
            }
        }
    });

    grunt.loadNpmTasks('grunt-contrib-jasmine');
    grunt.loadNpmTasks('grunt-contrib-uglify');
    grunt.registerTask('default', ['jasmine:main', 'uglify']);
    grunt.registerTask('ci', ['default']);
}