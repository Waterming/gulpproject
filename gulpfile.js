var gulp = require('gulp');
var $ = require('gulp-load-plugins')();
var browserSync = require('browser-sync').create();
var minimist = require('minimist');

var Init = require('./init');
var opt = {
  string: "name",
  default: { name: 'dev'}
};
var options = minimist(process.argv.slice(2), opt);
var name = options.name;
//新建文件夹
gulp.task('create',function(){
    Init.createPage(options.name);
});
//编译模板
gulp.task('compile',function(){
    var opt1 = {
      string: ["name","title"],
      default: { name: "dev", title:"Document" }
    };
    var options1 = minimist(process.argv.slice(2), opt1);
    Init.compileTemp(options1);
 });

 //处理样式
 gulp.task('css', function(){
    return gulp.src(name+"/index.less")
      .pipe($.less())
      .pipe($.autoprefixer())
      .pipe($.cleanCss())
      .pipe($.rename('index.min.css'))
      .pipe(gulp.dest(name))
      .pipe(browserSync.reload({stream: true}));
  });

  //处理JS
  gulp.task('js',function(){
      return gulp.src(name+'/index.es6.js')
      .pipe($.babel())
      .pipe($.uglify())
      .pipe($.rename('index.min.js'))
      .pipe(gulp.dest(name))
      .pipe(browserSync.reload({stream: true}));
  });

  //处理html

 gulp.task('css_js_build',function(){
    return gulp.src([name+"/index.min.js",name+"/index.min.css"])
    .pipe($.rev())
    .pipe(gulp.dest('build/'+name))
    .pipe($.rev.manifest())
    .pipe(gulp.dest(name+'/rev'))
  })
  gulp.task('html_revcollect', function () {
    return gulp.src([name+'/rev/*.json', name+'/index.html'])
        .pipe( $.revCollector({
            replaceReved: true
        }) )
        .pipe($.htmlReplace({
            'basecss' : 'http://cdn.com/base.min.css',
            'basejs' : 'http://cdn.com/base.min.js'
        }))
        .pipe($.htmlmin({
            removeComments: true,//清除HTML注释
            collapseWhitespace: true,//压缩HTML
            minifyJS: true,//压缩页面JS
            minifyCSS: true//压缩页面CSS
        }))
        .pipe( gulp.dest('build/'+name) );
  });


  //浏览测试
  gulp.task('browser-sync', function() {
    browserSync.init({
        server: {
            baseDir: name
        }
    });
    gulp.watch(name+'/index.less',['css']);
    gulp.watch(name+'/index.es6.js',['js']);
    gulp.watch(name+"/index.html").on('change',browserSync.reload);
  });

  //复制文件
  gulp.task('copy-images', function(){
    return gulp.src(name+'/images/*')
      .pipe(gulp.dest('build/'+name+'/images'));
  });

  gulp.task('start',[
      'css',
      'js',
      'browser-sync'
  ])

  gulp.task('build', [
    'css_js_build',
    'html_revcollect',
    'copy-images'
  ]);

