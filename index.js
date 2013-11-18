var child_process = require('child_process');
var fs_sync = require('fs-sync');
var path = require('path');
var temp = require('temp');

var Putin =  function(cwd){

    this.cwd = path.resolve(cwd || process.cwd()); 
    return this;
}

Putin.prototype.install = function(module,callback){
    var cwd = this.cwd;
    var temp_path = temp.path();
    var file = path.join(temp_path,"package.json");
    var args = ["install"];
    var fake_added = false;


    if(!(module instanceof Array)){
        module = [module];
    }
    module.forEach(function(mod){
        args.push(mod);
    });
    
    if(!fs_sync.exists(file)){
        fake_added = true;
        fs_sync.write(file, "{}");
    }

    fs_sync.mkdir(temp_path);
    var install = child_process.spawn('npm', args, {
        cwd:temp_path,
        stdio:"inherit"
    });


    install.on("exit",function(){
        module.forEach(function(mod){
            var mod_name = mod.split("@")[0];
            var temp_install_path = path.join(temp_path,"node_modules",mod_name);
            var dist_path = path.join(cwd,"node_modules",mod_name);
            console.log("copy: " + dist_path);
            fs_sync.copy(temp_install_path, dist_path);
        });
        callback && callback();
    });
}

module.exports = function(cwd){
    return new Putin(cwd);
}