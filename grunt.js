/*global config:true, task:true*/
config.init({
  meta: {
    name: 'javascript-hooker',
    title: 'JavaScript Hooker',
    version: '0.2.3',
    description: 'Monkey-patch (hook) functions for debugging and stuff.',
    homepage: 'http://github.com/cowboy/javascript-hooker',
    author: '"Cowboy" Ben Alman',
    license: ['MIT', 'GPL'],
    copyright: 'Copyright (c) 2011 "Cowboy" Ben Alman',
    repository: 'git://github.com/cowboy/javascript-hooker.git',
    banner: '/* {{meta.title}} - v{{meta.version}} - {{today "m/d/yyyy"}}\n' +
            ' * {{meta.homepage}}\n' + 
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
