module.exports = function(grunt) {

	// Project configuration.
	grunt.initConfig({
		pkg: grunt.file.readJSON('package.json'),
		connect:{
			server:{
				options: {
					port: 8000,
					base:'build/dev'
				}
			}
		},
		watch: {
			scripts: {
				files: ['assets/*.txt', '!assets/levels.txt', 'src/**/*.js'],
				tasks: ['clean:dev',
                    'concat',
                    'uglify:development',
                    'copy:dev',
                    'clean:compiled',
                    'clean:tmp']
			}
		},
		uglify: {
			development: {
				options: {
					mangle: false
				},
				files: {
		            'build/compiled.js': ['src/core/coreGlobals.js',
		            	'src/gameFramework.js',
						'src/core/common.js',
						'src/main.js',
						'src/core/readAJAX.js',
                        'src/core/gameObject.js',
						'src/core/sprite.js',
                        'src/core/text.js',
                        'src/core/particle.js',
						'src/core/particleEmitter.js',
						'src/core/state.js',
						'src/**/*.js']
				}
			},
			compressed: {
				options: {
					mangle: true,
					compress: {
						//TODO: Optimize using compressor options (https://github.com/mishoo/UglifyJS2#compressor-options)
					}
				},
				files: {
					'build/compiled.js': ['src/core/coreGlobals.js',
						'src/gameFramework.js',
						'src/common.js',
						'src/main.js',
						'src/readAJAX.js',
						'src/gameObject.js',
						'src/sprite.js',
						'src/text.js',
						'src/particle.js',
						'src/particleEmitter.js',
						'src/state.js',
						'src/**/*.js']
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
					src: ['build/**/*.*'],
					dest: './'
				}]
			}
		},
        concat: {
			options: {},
			levels: {
				src: [
					'assets/level1.txt',
					'assets/level2.txt',
					'assets/level3.txt',
					'assets/level4.txt',
					'assets/level5.txt',
					'assets/level6.txt',
					'assets/level7.txt',
					'assets/level8.txt',
					'assets/level9.txt',
					'assets/level10.txt',
					'assets/level11.txt',
					'assets/level12.txt',
					'assets/level13.txt',
					'assets/level14.txt',
                    'assets/level15.txt',
                    'assets/level16.txt'
				],
				dest: 'tmp/levels.txt',
				options: {
					separator: '&'
				}
			},
			source: {
                src: ['src/core/coreGlobals.js',
                	'src/gameFramework.js',
                    'src/core/common.js',
                    'src/main.js',
                    'src/core/readAJAX.js',
                    'src/core/gameObject.js',
                    'src/core/sprite.js',
                    'src/core/text.js',
                    'src/core/particle.js',
                    'src/core/particleEmitter.js',
                    'src/core/state.js',
                    'src/**/*.js'],
                dest: 'build/compiled.js'
            }
        },
        replace: {
            assets: {
                src: ['build/*.js'],
                overwrite: true,                 // overwrite matched source files
                replacements: [{
                    from: "assets/",
                    to: ""
                }]
            }
        },
		copy: {
			assets: {
				files: [
					{expand: true, flatten: true, src: ['assets/*'], dest: 'build/prod', filter: 'isFile'}
				]
			},
            levels: {
                files: [
                    {expand: true, flatten: true, src: ['assets/levels.txt'], dest: 'build/prod', filter: 'isFile'}
                ]
            },
			dev: {
                files: [
                    {expand: true, flatten: true, src: ['assets/level1.txt'], dest: 'build/dev/assets', filter: 'isFile'},
                    {expand: true, flatten: true, src: ['assets/*.png'], dest: 'build/dev/assets'},
                    {expand: true, flatten: true, src: ['build/compiled.js'], dest: 'build/dev/src', filter: 'isFile'},
                    {expand: true, flatten: true, src: ['htmlFile/index.html'], dest: 'build/dev', filter: 'isFile'}
                ]
			}
		},
        clean: {
            compiled: ["build/compiled.js"],
            build: ["build/game.zip"],
            dev: ["build/dev/*"],
			tmp: ["tmp/**"]

        }
	});

	grunt.loadNpmTasks('grunt-contrib-copy');
    grunt.loadNpmTasks('grunt-text-replace');
	grunt.loadNpmTasks('grunt-contrib-clean');
    grunt.loadNpmTasks('grunt-contrib-concat');
    grunt.loadNpmTasks('grunt-contrib-connect');
	grunt.loadNpmTasks('grunt-contrib-watch');
	grunt.loadNpmTasks('grunt-contrib-uglify');
	grunt.loadNpmTasks('grunt-contrib-less');
	grunt.loadNpmTasks('grunt-contrib-htmlmin');
	grunt.loadNpmTasks('grunt-contrib-compress');
	grunt.loadNpmTasks('grunt-closure-compiler');

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

	grunt.registerTask('closure', ['closure-compiler']);
	grunt.registerTask('default', ['watch']);
	grunt.registerTask('levels', ['concat:levels']);
	grunt.registerTask('build', [
		'concat',
		'copy:levels',
		'replace',
		'clean'
	]);

    grunt.registerTask('dev', [
    	'clean:dev',
        // 'concat',
        'uglify:development',
        'copy:dev',
        'connect',
        'clean:compiled',
        'clean:tmp',
        'watch'
    ]);
    grunt.registerTask('build-compress', [
		'build',
		'compress:main',
		'sizeCheck'
	]);
	grunt.registerTask('zip', ['compress:main', 'sizeCheck']);

};