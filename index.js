var child_process = require('child_process');
var fs_sync = require('fs-sync');
var path = require('path');

var Putin =  function(cwd){

    this.cwd = cwd || process.cwd();
    return this;
}

Putin.prototype.install = function(module,callback){
    var cwd = this.cwd
    var file = path.resolve(cwd,"package.json");
    var args = ["install"];

    if(module instanceof Array){
        module.forEach(function(mod){
            args.push(mod);
        });
    }else{
        args.push(module);
    }
    
    fs_sync.write(file, "{}");

    var install = child_process.spawn('npm', args, {
        cwd:cwd,
        stdio:"inherit"
    });



    install.on("exit",callback);
}

module.exports = function(cwd){
    return new Putin(cwd);
}