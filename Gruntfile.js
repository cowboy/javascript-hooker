module.exports = function(grunt) {

  // Project configuration.
  grunt.initConfig({
    // Metadata.
    pkg: grunt.file.readJSON('package.json'),
    banner: '/*! JavaScript Hooker - v<%= pkg.version %> - ' +
      '<%= grunt.template.today("yyyy-mm-dd") %>\n' +
      '<%= pkg.homepage ? "* " + pkg.homepage + "\\n" : "" %>' +
      '* Copyright (c) <%= grunt.template.today("yyyy") %> <%= pkg.author.name %>;' +
      ' Licensed <%= _.pluck(pkg.licenses, "type").join(", ") %> */\n',
    clean: {
      dist: 'dist',
    },
    concat: {
      options: {
        banner: '<%= banner %>\n',
        stripBanners: true,
      },
      dist: {
        src: ['lib/<%= pkg.name %>.js'],
        dest: 'dist/ba-<%= pkg.name %>.js',
      },
    },
    uglify: {
      options: {
        banner: '<%= banner %>',
      },
      dist: {
        expand: true,
        src: '<%= concat.dist.dest %>',
        ext: '.min.js',
        // dest: 'dist/<%= pkg.name %>.min.js',
      }
    },
    nodeunit: {
      files: ['test/**/*_test.js']
    },
    jshint: {
      build: {
        options: {jshintrc: '.jshintrc'},
        src: ['Gruntfile.js'],
      },
      lib: {
        options: {jshintrc: 'lib/.jshintrc'},
        src: ['lib/**/*.js'],
      },
      test: {
        options: {jshintrc: 'lib/.jshintrc'},
        src: ['test/**/*.js'],
      },
    },
    watch: {
      build: {
        files: '<%= jshint.build.src %>',
        tasks: ['jshint:build']
      },
      lib: {
        files: '<%= jshint.lib.src %>',
        tasks: ['jshint:lib', 'nodeunit']
      },
      test: {
        files: '<%= jshint.test.src %>',
        tasks: ['jshint:test', 'nodeunit']
      },
    },
  });

  grunt.loadNpmTasks('grunt-contrib-jshint');
  grunt.loadNpmTasks('grunt-contrib-nodeunit');
  grunt.loadNpmTasks('grunt-contrib-clean');
  grunt.loadNpmTasks('grunt-contrib-concat');
  grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.loadNpmTasks('grunt-contrib-watch');

  // Default task.
  grunt.registerTask('default', ['test', 'build']);

  grunt.registerTask('test', ['jshint', 'nodeunit']);
  grunt.registerTask('build', ['clean', 'concat', 'uglify']);

};
