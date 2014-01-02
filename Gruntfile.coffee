# Globbing
# for performance reasons we're only matching one level down:
# 'test/spec/{,*/}*.js'
# use this if you want to match all subfolders:
# 'test/spec/**/*.js'

module.exports = (grunt) ->
  # load all grunt tasks
  require('matchdep').filterDev('grunt-*').forEach(grunt.loadNpmTasks);

  debugConfigJs =
    'async/lib': 'async.js'
    'backbone-amd': 'backbone.js'
    'backbone.babysitter/lib/amd': 'backbone.babysitter.js'
    'backbone.marionette/lib/core/amd': 'backbone.marionette.js'
    'backbone.wreqr/lib/amd': 'backbone.wreqr.js'
    'bootstrap/dist/js': 'bootstrap.js'
    'jquery': 'jquery.js'
    'requirejs': 'require.js'
    'underscore-amd': 'underscore.js'
    'jade': 'runtime.js'
    'momentjs': 'moment.js'

  debugConfigCss =
    'bootstrap/dist/css': 'bootstrap.css'
    'font-awesome/css': 'font-awesome.css'

  debugFiles =
    for lib, file of debugConfigJs
      expand: true
      cwd: 'bower_components/' + lib
      dest: 'public/scripts'
      src: file
  for lib, file of debugConfigCss
    debugFiles.push
      expand: true
      cwd: 'bower_components/' + lib
      dest: 'public/stylesheets'
      src: file
  debugFiles.push
    expand: true
    cwd: 'bower_components/font-awesome/'
    src: 'font/*'
    dest: 'public/'

  jadeConfig = {}
  for view in ['header', 'news']
    jadeConfig[view] =
      options:
        client: true
        amd: true
        namespace: 'JST.' + view
        processName: (name) ->
          name.replace /.*\/([A-Za-z]+)\.jade/, '$1'
      files: {}
    jadeConfig[view].files['public/views/' + view + '.js'] =
      'private/views/' + view + '/*.jade'

  grunt.initConfig
    watch:
      js:
        files: ['private/**/*.js']
        tasks: ['copy:js']
      stylus:
        files: ['private/**/*.styl']
        tasks: ['stylus']
      clientJade:
        files: ['private/**/*.jade']
        tasks: ['jade']

    clean:
      dist: ['dist']
      components: ['bower_components']

    bower:
      install:
        options:
          copy: false

    stylus:
      app:
        files:
          'public/stylesheets/style.css': 'private/stylesheets/style.styl'

    copy:
      js:
        expand: true
        cwd: 'private'
        src: 'scripts/*'
        dest: 'public'

      components:
        files: debugFiles

    rename:
      jadeRuntime:
        src: 'public/scripts/runtime.js'
        dest: 'public/scripts/jade.js'

    jade: jadeConfig

    nodemon:
      lcm:
        options:
          file: 'server.js'

    concurrent:
      local:
        tasks: ['nodemon', 'watch']
        options:
          logConcurrentOutput: true

  grunt.registerTask 'components', [
    'clean:components',
    'bower'
  ]

  grunt.registerTask 'dist', [
    'clean:dist',
    'stylus',
    'jade',
    'copy',
    'rename'
  ]

  grunt.registerTask 'default', [
    'dist',
    'concurrent'
  ]
