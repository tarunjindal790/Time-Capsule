console.log(new Date());

const express=require("express"),
	  request=require("request"),
	  bodyParser=require("body-parser"),
	  schedule=require("node-schedule"),
	  sgMail = require('@sendgrid/mail'),
	  moment=require('moment'),
	  mongoose=require('mongoose'),
	  multer=require("multer"),
	  cloudinary=require('cloudinary'),
	  env=require('dotenv');

env.config();

const port=process.env.PORT||3000;
var storage=multer.diskStorage({
	filename:function(req,file,callback){
		callback(null,Date.now()+file.originalname);
	}
});
var imageFilter=function(req,file,cb){
	if(!file.originalname.match(/\.(jpg|png|jpeg|gif)$/i)){
		return cb(new Error('Only image files are allowed'),false)
	}
	cb(null,true);
};
var upload=multer({storage:storage,fileFilter:imageFilter});
cloudinary.config({
	cloud_name:'timecapsule',
	api_key:process.env.CLOUDINARY_API_KEY,
	api_secret:process.env.CLOUDINARY_API_SECRET

});

// mongoose.connect("mongodb://localhost/time_capsule");
app=express();

//Schema Setup
// var userSchema=new mongoose.Schema({
// 	email:String,
// 	image:String,
// 	video:String,
// 	date:Date,
// 	message:String
// })

// var User=mongoose.model("User",userSchema);


//SENDGRID CONFIG
sgMail.setApiKey(process.env.SGMAIL_API_KEY);

app.set("view engine","ejs");
app.use(express.static("public"));
app.use(bodyParser.urlencoded({extended:true}));

app.get("/",function(req,res){
	res.render("index");
})

app.post("/submit",upload.single('image'),function(req,res){
	var imageUrl;
	cloudinary.v2.uploader.upload(req.file.path,function(err,result){
		 imageUrl=result.secure_url;
		 console.log(imageUrl);
	
	var message=req.body.message;

	var d=req.body.dateInput.split("-");  //Date array from string
	console.log(d);
	var t=req.body.timeInput.split(":");  //Time array from string
	console.log(t);
	var date=d[2];
	var month=d[1]-1;   //month in js start with 0
	var year=d[0];
	var hour=t[0]
	var minute=t[1];
	var toAddress=req.body.toAddress;
	var dateObject=new Date(Date.UTC(year,month,date,hour,minute,0));  //Use UTC so values don't change
	console.log('Date input:' + dateObject);
	var milisecondDate=dateObject.getTime()+(dateObject.getTimezoneOffset()*60000);  //Calculate miliseconds in UTC
	var epochDate=new Date(0);  //Epoch date-UTC Start

	epochDate.setUTCMilliseconds(milisecondDate);  //convert milisecond to date object
	console.log(epochDate);
	schedule.scheduleJob(epochDate,function(){
	
		console.log("Mailing");
		const msg = {
		  to: toAddress,
		  from: 'tarunjindal790@gmail.com',
		  subject: "YOUR TIME CAPSULE!",
		  text: "Here is your secret message : ",
		  html: `<h1><strong>Here is your secret message:<br><br> <h2>${message}</h2> </strong></h1>
		  		<p><img src=${imageUrl}></p>`
		  	};
		sgMail.send(msg);
	})

	res.render("submit",{message:message,date:date,hour:hour,minute:minute,month:month,toAddress:toAddress});
})
});



app.listen(port,function(){
	console.log("Starting app...");
})