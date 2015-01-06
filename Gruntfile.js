	module.exports = function(grunt) {

  // Project configuration.
  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),
		requirejs: {
			compile: {
				options: {
					almond: true,
					baseUrl: 'src',
					dir: 'build',
					optimize: 'uglify'
				}
			}
		},
    jasmine : {
      src : 'src/**/*.js',
      options : {
				specs : 'spec/**/*.js',
				template: require('grunt-template-jasmine-requirejs'),
				templateOptions: {
					requireConfig: {
						baseUrl: 'src/'
					}
				}
      }
		},
    jshint: {
      all: [
        'Gruntfile.js',
        'src/**/*.js',
        'spec/**/*.js'
      ],
      options: {
        jshintrc: '.jshintrc'
      }
    }
  });

  grunt.loadNpmTasks('grunt-contrib-requirejs');

  // Load Jasmine
  grunt.loadNpmTasks('grunt-contrib-jasmine');

  // Default task(s).
  grunt.registerTask('default', ['requirejs:compile']);
  grunt.registerTask('test', ['jasmine']);

};