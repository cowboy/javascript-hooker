/*global config:true, task:true*/
config.init({
  pkg: '<json:package.json>',
  meta: {
    title: 'JavaScript Hooker',
    license: ['MIT'],
    copyright: 'Copyright (c) 2012 "Cowboy" Ben Alman',
    banner: '/* {{meta.title}} - v{{pkg.version}} - {{today "m/d/yyyy"}}\n' +
            ' * {{pkg.homepage}}\n' +
            ' * {{{meta.copyright}}}; Licensed {{join meta.license}} */'
  },
  concat: {
    'dist/ba-hooker.js': ['<banner>', '<file_strip_banner:lib/hooker.js>']
  },
  min: {
    'dist/ba-hooker.min.js': ['<banner>', 'dist/ba-hooker.js']
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
      eqnull: true
    },
    globals: {
      exports: true
    }
  },
  uglify: {}
});

// Default task.
task.registerTask('default', 'lint:files test:files concat min');
