var mkdirp = require('mkdirp');
var fse=require("fs-extra");
var ejs = require('ejs');
//创建文件
function writeFile(path,data){
  fse.outputFile(path,data,'utf8',function(error){
    if(error){
      console.log("创建失败");
    }else{
      console.log("--------"+path +" 创建成功--------");  
    }
  });
}

//新建目录
function createPage(path){
  fse.ensureDirSync(path);
  fse.ensureDir(path+'/images', function(err) {
    console.log(err);
  });
  fse.ensureFile(path+'/index.less',function(err){
      console.log(err);
  });
  fse.ensureFile(path+'/index.es6.js',function(err){
    console.log(err);
  });
  fse.copy('templates/base.css',path+'/cdn/base.css',function(err){
    if(err){
      console.log("创建失败");
    }else{
      console.log("-------- 创建成功--------");  
    }
    })
  fse.copy('templates/base.js',path+'/cdn/base.js',function(err){
      if(err){
      console.log("创建失败");
      }else{
      console.log("-------- 创建成功--------");  
      }
  })
}
//编译ejs模板
function compileTemp(data){
  ejs.renderFile('templates/index.ejs',data,{},function(err,str){
    writeFile(data.name+'/index.html',str)
  })
}

module.exports = { createPage, compileTemp};