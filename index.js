var child_process = require('child_process');
var fs_sync = require('fs-sync');
var path = require('path');

var Putin =  function(cwd){

    this.cwd = cwd || process.cwd();
    return this;
}

Putin.prototype.install = function(module,callback){
    var cwd = this.cwd;
    var file = path.resolve(cwd,"package.json");
    var args = ["install"];
    var fake_added = false;

    if(module instanceof Array){
        module.forEach(function(mod){
            args.push(mod);
        });
    }else{
        args.push(module);
    }
    
    if(!fs_sync.exists(file)){
        fake_added = true;
        fs_sync.write(file, "{}");
    }

    var install = child_process.spawn('npm', args, {
        cwd:cwd,
        stdio:"inherit"
    });



    install.on("exit",function(){
        fs_sync.remove(file);
    });
    install.on("exit",callback);
}

module.exports = function(cwd){
    return new Putin(cwd);
}