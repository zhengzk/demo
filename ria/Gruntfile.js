/**
 * Created by admin on 2014/12/1.
 */

module.exports = function(grunt) {

    // Project configuration.
    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),
        concat:{
            basic:{
                src: [
                    'js/src/basic.js',
                    'js/src/component/**/*.js',
                    'js/src/model/**/*.js'
                ],
                dest: 'js/basic.js'
            },
            styles: {

            }
        },
        uglify: {
            options: {
                banner: '/*! <%= pkg.name %> <%= grunt.template.today("yyyy-mm-dd") %> */',
                //beautify:true,
                //sourceMapRoot: '',
                //sourceMap: 'js/<%= pkg.name %>.min.js.map',
                //sourceMapUrl: '<%= pkg.name %>.min.js.map',
                compress: {
                    drop_console: true
                }
            },
            build: {
                src: 'js/basic.js',
                dest: 'js/basic.min.js'
            }
        },
        sprite: {
            options: {
                // sprite背景图源文件夹，只有匹配此路径才会处理，默认 images/slice/
                //imagepath: 'image/icon',
                imagepath: 'images/sprite',
                // 雪碧图输出目录，注意，会覆盖之前文件！默认 images/
                spritedest: 'images/',
                // 替换后的背景路径，默认 ../images/
                spritepath: '../images/',
                // 各图片间间距，如果设置为奇数，会强制+1以保证生成的2x图片为偶数宽高，默认 0
                padding: 20,
                // 默认使用二叉树最优排列算法
                algorithm: 'binary-tree',
                // 默认使用`pngsmith`图像处理引擎
                engine: 'pngsmith'
            },
            autoSprite: {
                files: [{
                    // 启用动态扩展
                    expand: true,
                    // css文件源的文件夹
                    cwd: 'scss/',
                    // 匹配规则
                    //src: '*.css',
                    src: '*.css',
                    // 导出css和sprite的路径地址
                    dest: 'css/',
                    // 导出的css名
                    ext: '.sprite.css'
                }]
            }
        },
        csscomb: {
            options:{
                config: 'csscomb.json'
            },
            build: {
                expand: true,
                cwd: 'css/',
                src: '*.sprite.css',
                dest: 'css/',
                ext: '.css'
            }
        },
        clean: {
            styles: {
                src: ["css/*.sprite.css","css/*.concat.css"]
            }
        },
        tinypng: {
            options: {
                apiKey: "_qqJhh_gyKx9DSI476DYtGdM2x_q0WIs",
                showProgress: true,
                stopOnImageError: true
            },
            compress: {
                expand: true,
                src: ['<%= pkg.name %>.png', '!*.min.png'],
                cwd: 'images/',
                dest: 'images/',
                ext: '.png'
            }
        }
    });

    // 加载相关任务的插件。
    grunt.loadNpmTasks('grunt-contrib-concat');
    grunt.loadNpmTasks('grunt-contrib-uglify');
    grunt.loadNpmTasks('grunt-csscomb');
    grunt.loadNpmTasks('grunt-css-sprite');
    grunt.loadNpmTasks('grunt-contrib-clean');
    grunt.loadNpmTasks('grunt-tinypng');
    // 默认被执行的任务列表。
    grunt.registerTask('default', ['concat:basic','uglify']);
    grunt.registerTask('css', ['concat:styles','sprite','csscomb','clean']);
};
