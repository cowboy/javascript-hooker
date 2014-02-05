'use strict';

module.exports = function(grunt) {
  require('load-grunt-tasks')(grunt);
  
  var getLicenseType = function(license) {
    return license.type;
  };

  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),
    banner: '/*! JavaScript Hooker - v<%= pkg.version %> - <%= grunt.template.today("m/d/yyyy") %>\n' +
            '* <%= pkg.homepage %>\n' +
            '* Copyright (c) <%= grunt.template.today("yyyy") %> <%= pkg.author.name %>;' +
            ' Licensed MIT */',
    replace: {
      dist: {
        options: {
          patterns: [{
            match: /^\/\*[^$]*\*\//m,
            replacement: '<%= banner %>'
          }],
          force: true
        },
        src: ['lib/hooker.js'],
        dest: 'dist/ba-hooker.js'
      }
    },
    uglify: {
      dist: {
        options: {
          preserveComments: 'some'
        },
        src: ['dist/ba-hooker.js'],
        dest: 'dist/ba-hooker.min.js'
      }
    },
    nodeunit: {
      test: {
        src: ['test/**/*.js']
      }
    },
    jshint: {
      options: {
        jshintrc: true
      },
      all: {
        src: [
          'Gruntfile.js',
          'lib/hooker.js',
          '<%= nodeunit.test.src %>'
        ]
      }
    },
    watch: {
      jshint: {
        files: ['<%= jshint.all.src %>'],
        tasks: ['jshint']
      },
      test: {
        files: ['lib/hooker.js', '<%= nodeunit.test.src %>'],
        tasks: ['nodeunit']
      },
      build: {
        files: ['lib/hooker.js'],
        tasks: ['build']
      }
    }
  });

  grunt.registerTask('test', ['jshint', 'nodeunit']);
  grunt.registerTask('build', ['replace', 'uglify']);
  grunt.registerTask('default', ['test', 'build', 'watch']);
};
