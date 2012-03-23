module.exports = function(grunt) {

  // Project configuration.
  grunt.initConfig({
    pkg: '<json:package.json>',
    meta: {
      name: 'JavaScript Hooker',
      banner: '/*! <%= meta.name %> - v<%= pkg.version %> - <%= grunt.template.today("m/d/yyyy") %>\n' +
              '* <%= pkg.homepage %>\n' +
              '* Copyright (c) <%= grunt.template.today("yyyy") %> <%= pkg.author.name %>;' +
              ' Licensed <%= _.pluck(pkg.licenses, "type").join(", ") %> */'
    },
    concat: {
      dist: {
        src: ['<banner>', '<file_strip_banner:lib/hooker.js>'],
        dest: 'dist/ba-hooker.js'
      }
    },
    min: {
      dist: {
        src: ['<banner>', 'dist/ba-hooker.js'],
        dest: 'dist/ba-hooker.min.js'
      }
    },
    test: {
      files: ['test/**/*.js']
    },
    lint: {
      files: ['grunt.js', 'lib/**/*.js', 'test/**/*.js']
    },
    watch: {
      files: '<config:lint.files>',
      tasks: 'lint:files test:files'
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
    uglify: {}
  });

  // Default task.
  grunt.registerTask('default', 'lint test concat min');

};
