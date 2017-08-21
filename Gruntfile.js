module.exports = function(grunt) {

	require('google-closure-compiler').grunt(grunt);

	// Project configuration.
	grunt.initConfig({
		pkg: grunt.file.readJSON('package.json'),
		connect:{
			dev:{
				options: {
					port: 8000,
					base:'build/dev'
				}
			},
			prod:{
				options: {
					port: 8001,
					base:'build/prod'
				}
			}
		},
		watch: {
			dev: {
				files: ['assets/*.txt', 'assets/*.png', 'assets/*.jpg', '!assets/levels.txt', 'src/**/*.js', 'htmlFile/index.html'],
				tasks: ['dev-build']
            },
            prod: {
				files: ['assets/*.txt', 'assets/*.png', 'assets/*.jpg', '!assets/levels.txt', 'src/**/*.js', 'htmlFile/index.html'],
				tasks: ['prod-build']
			}
		},
		uglify: {
			development: {
				options: {
					mangle: false,
					beautify: true,
					sourceMap: {
						includeSources: true
					}
				},
				files: {
		            'build/compiled.js': [ 'src/**/*.js']
				}
			},
			compressed: {
				options: {
					mangle: true,
					compress: {
					},
					sourceMap: false
				},
				files: {
					'build/compiled.js': [ 'src/**/*.js' ]
				}
			}
		},
		htmlmin: {
			development: {
				options: {
					removeComments: false,
					collapseWhitespace: false
				},
				files: {
					'build/index.html': '*.html'
				}
			},
			compressed: {
				options: {
					removeComments: true,
					collapseWhitespace: true
				},
				files: {
					'build/index.html': '*.html'
				}
			}
		},
		compress: {
			main: {
				options: {
					archive: 'build/game.zip',
					mode: 'zip'
				},
				files: [{
					expand: true,
					flatten: true,
					cwd: './',
					src: ['build/prod/**/*.*'],
					dest: './'
				}]
			}
		},
		copy: {
			dev: {
                files: [
					{expand: true, flatten: true, src: ['assets/*.png'], dest: 'build/dev/assets'},
					{expand: true, flatten: true, src: ['assets/*.jpg'], dest: 'build/dev/assets'},
                    {expand: true, flatten: true, src: ['assets/level1.txt'], dest: 'build/dev/assets', filter: 'isFile'},
                    {expand: true, flatten: true, src: ['build/compiled.js*'], dest: 'build/dev/src', filter: 'isFile'},
                    {expand: true, flatten: true, src: ['htmlFile/index.html'], dest: 'build/dev', filter: 'isFile'}
                ]
			},
			prod: {
                files: [
					{expand: true, flatten: true, src: ['assets/*.png'], dest: 'build/prod/assets'},
					{expand: true, flatten: true, src: ['assets/*.jpg'], dest: 'build/prod/assets'},
                    {expand: true, flatten: true, src: ['assets/level1.txt'], dest: 'build/prod/assets', filter: 'isFile'},
                    {expand: true, flatten: true, src: ['htmlFile/index.html'], dest: 'build/prod', filter: 'isFile'}
                ]
			}
		},
        clean: {
            compiled: ["build/compiled.js*"],
            build: ["build/game.zip"],
			dev: ["build/dev/*"],
			prod: ["build/prod/*"]
		},
		'closure-compiler': {
			compress: {
				closurePath: './',
				files: {
				'build/compiled.js' : ['src/**/*.js']
				},
				options: {

					compilation_level: 'SIMPLE',
					dependency_mode: 'LOOSE',
					language_in: 'ECMASCRIPT5_STRICT'
				}
			},
			compiled: {
				closurePath: './',
				files: {
				'build/prod/src/compiled.js' : ['build/compiled.js']
				},
				options: {

					compilation_level: 'ADVANCED',
                    language_in: 'ECMASCRIPT5_STRICT'
				}
			}
		}
	});

	grunt.loadNpmTasks('grunt-contrib-copy');
	grunt.loadNpmTasks('grunt-contrib-clean');
    grunt.loadNpmTasks('grunt-contrib-connect');
	grunt.loadNpmTasks('grunt-contrib-watch');
	grunt.loadNpmTasks('grunt-contrib-uglify');
	grunt.loadNpmTasks('grunt-contrib-htmlmin');
	grunt.loadNpmTasks('grunt-contrib-compress');

	grunt.registerTask('default', ['dev']);

	var fs = require('fs');
	grunt.registerTask('sizeCheck', function() {
		var done = this.async();
		fs.stat('build/game.zip', function(err, zip) {
			if (zip.size > 13312) {
				//If size in bytes greater than 13kb
				grunt.log.error("Zipped file greater than 13kb \x07 \n");
				grunt.log.error("Zip is " + zip.size + " bytes when js13k max is 13,312 bytes");
			}
			done();
		});
    });

    grunt.registerTask('dev-build', [
    	'clean:dev',
        'uglify:development',
        'copy:dev',
        'clean:compiled',
	]);

    grunt.registerTask('dev', [
        'dev-build',
        'connect:dev',
        'watch:dev'
	]);

	grunt.registerTask('prod-build', [
    	'clean:prod',
		'uglify:development',
		'closure-compiler:compiled',
        'copy:prod',
        'clean:compiled'
	]);

	grunt.registerTask('prod', [
		'prod-build',
        'connect:prod',
        'watch:prod'
	]);

    grunt.registerTask('13k', [
		'prod-build',
		'compress:main',
		'sizeCheck'
	]);

	grunt.registerTask('zip', ['compress:main', 'sizeCheck']);
};
