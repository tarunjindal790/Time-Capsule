// var schedule=require("node-schedule");
// dateFormatted=new Date('cdscsd');
// schedule.scheduleJob(dateFormatted,function(){
// 	console.log("Running process..");
// })


// var indiaTime = new Date().toLocaleString("en-US", {timeZone: "Asia/Kolkata"});
// indiaTime = new Date(indiaTime);
// console.log('India time: '+indiaTime.toLocaleString())


const express=require("express");
var app=express();

app.get("/",function(req,res){
	res.send('Hello');
})



app.listen("3000","0.0.0.0",function(){
	console.log("Starting app...");
})


var schedule=require('node-schedule');
var utcdate=new Date();
console.log(utcdate);
var date=new Date(Date.UTC(2019,3,13,10,14,0));
console.log(date);
var j=schedule.scheduleJob(date,function(){
	console.log('Hello from cron.');
});