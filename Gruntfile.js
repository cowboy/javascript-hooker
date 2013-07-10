module.exports = function(grunt) {

  // Project configuration.
  grunt.initConfig({
    pkg: '<json:package.json>',
    meta: {
      name: 'JavaScript Hooker',
    },
    uglify: {
      options: {
        banner: '/*\n' +
                ' * Javascript Hooker\n' +
                ' * http://github.com/cowboy/javascript-hooker\n' +
                ' * Copyright (c) 2012 "Cowboy" Ben Alman\n' +
                ' * Licensed under the MIT license.\n' +
                ' */\n'
      },
      dist: {
        files: {
          'dist/ba-hooker.min.js': 'dist/ba-hooker.js'
        }
      }
    },
    nodeunit: {
      files: ['test/**/*.js']
    },
    lint: {
      files: ['grunt.js', 'lib/**/*.js', 'test/**/*.js']
    },
    watch: {
      files: '<config:lint.files>',
      tasks: 'lint:files nodeunit:files'
    },
    jshint: {
      options: {
        curly: true,
        eqeqeq: true,
        immed: true,
        latedef: true,
        newcap: true,
        noarg: true,
        sub: true,
        undef: true,
        boss: true,
        eqnull: true
      },
      globals: {
        exports: true,
        module: false
      }
    },
  });

  grunt.loadNpmTasks('grunt-contrib-jshint');
  grunt.loadNpmTasks('grunt-contrib-nodeunit');
  grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.loadNpmTasks('grunt-contrib-watch');

  // Default task.
  grunt.registerTask('default', ['lint nodeunit uglify']);
  grunt.registerTask('test', ['lint nodeunit']);

};
