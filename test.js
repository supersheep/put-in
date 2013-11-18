var putin = require("./index.js");


putin("./temp").install(["async","modified@1.0.3"],function(){
	console.log("done")
});