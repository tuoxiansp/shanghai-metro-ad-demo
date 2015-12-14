/**
 * gulp 工作流
 * 执行文件变更监听，启动 live-reload 服务器，编译(测试)代码等
 */

var gulp = require('gulp');
var puer = require('puer');
var path = require('path');

var webpack = require('gulp-webpack');
var runSequence = require('run-sequence');
var named = require('vinyl-named');

//gulp 监听到文件变更，则执行 [compile] 任务
gulp.task('watcher', function() {

	return gulp.watch('app/**/*.js', ['compile']);
});

//启动 live-reload 服务器，参数列表查看代码或 https://github.com/leeluolee/puer
gulp.task('server', function() {

	return puer({port: 8002});
});

/**
 * 用户接口
 */

//编译测试代码
gulp.task('test', function() {

	return gulp.src('test/testMain.js')
		.pipe(named())
		.pipe(webpack(require('./webpack.config.js')))
		.pipe(gulp.dest(__dirname+'/dist/'));
});

//编译项目代码
gulp.task('compile', function() {

    return gulp.src('app/src/main.js')
		.pipe(named())
        .pipe(webpack(require('./webpack.config.js')))
        .pipe(gulp.dest('dist/'));
});

//编译代码，并开启服务器和监听任务
gulp.task('default', function() {

    return runSequence('compile', 'server', 'watcher');
});
