var EventEmitter = require("events").EventEmitter;
var util = require("util");
const RegisterEventClass = function(initial_no){
    this.count=initial_no;
};
util.inherits(RegisterEventClass,EventEmitter);
RegisterEventClass.prototype.increment= function(){
    var self = this;
    self.count++;
    self.emit("visitor");
};
var access = new RegisterEventClass(0);
access.on("visitor",function(){
    console.log("The number of people visited :: "+ this.count);
    globalcount = this.count;
});
exports.visitorCountEvent = function(){
    access.increment();
    return globalcount;
};