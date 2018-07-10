var express = require("express");
var http = require('http');
var formidable = require('formidable');
var fs = require('fs');
const app = express();


const csv = require('csv');

var MyData = [];
function MyCSV(Date,Cabno,DriverName,VehicleType,OpeningKm,Closingkm,Difference,Subtractby80,ExtraKM,Openingtime,ClosingTime,TotalTime,ExtraHours1,ExtraHours2,ExtraKmrate,ExtraHourRate,BaseRate,Toll,Total )
{    this.Date = Date;
    this.Cabno = Cabno;
    this.DriverName = DriverName;
	this.VehicleType= VehicleType;
	this.OpeningKm= OpeningKm;
	this.Closingkm= Closingkm;
	this.Difference= Difference;
	this.Subtractby80= Subtractby80;
	this.ExtraKM= ExtraKM;
	this.Openingtime= Openingtime;	
	this.ClosingTime= ClosingTime;
	this.TotalTime= TotalTime;
	this.ExtraHours1= ExtraHours1;
	this.ExtraHours2= ExtraHours2;
	this.ExtraKmrate= ExtraKmrate;
    this.ExtraHourRate= ExtraHourRate;	
	this.BaseRate= BaseRate;
	this.Toll= Toll;
	this.Total= Total;
	};
// Import Mongodb
const mongoClient = require('mongodb').MongoClient,
  assert = require('assert');
  
  
var port = 8081;
var bodyParser = require('body-parser');
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

var mongoose = require("mongoose");
mongoose.Promise = global.Promise;
mongoose.connect("mongodb://localhost:27017/work",{ useNewUrlParser: true });
var nameSchema = new mongoose.Schema({
	Date:String,
	Cabno:String,
	DriverName:String,
	VehicleType:String,
	OpeningKm:String,
	Closingkm:String,
	Difference:String,
	Subtractby80:String,
	ExtraKM:String,
	Openingtime:String,
	ClosingTime:String,
	TotalTime:String,
	ExtraHours1:String,
	ExtraHours2:String,
	ExtraKmrate:String,
	ExtraHourRate:String,
	BaseRate:String,
	Toll:String,
	Total:String
    
});
var User = mongoose.model("User", nameSchema);

app.get("/", (req, res) => {
    res.sendFile(__dirname + "/sss.html");
});

app.post("/addname", (req, res) => {
    var myData = new User(req.body);
    myData.save()
        .then(item => {
            res.send("saved data");
        })
        .catch(err => {
            res.status(400).send("unable to save to database");
        });
});


app.post("/fileupload", (req, res) => {
	if (req.url == '/fileupload') {
    var form = new formidable.IncomingForm();
    form.parse(req, function (err, fields, files) {
		var table_id=  fields.text_id;
		console.log(" table_id = "+table_id);
	  var oldpath = files.filetoupload.path;
      var newpath = 'C:/MyFiles/kk/' + files.filetoupload.name;
      fs.rename(oldpath, newpath, function (err) {
        if (err) throw err;
        res.write('File uploaded and moved!');
		
		
		var obj = csv();
		obj.from.path(newpath).to.array(function (data) {
				for (var index = 0; index < data.length; index++) {
					MyData.push(new MyCSV(data[index][0], data[index][1], data[index][2], data[index][3],data[index][4],data[index][5],data[index][6],data[index][7],data[index][8],data[index][9],data[index][10],data[index][11],data[index][12],data[index][13],data[index][14],data[index][15],data[index][16],data[index][17],data[index][18]));
				}
				console.log("We are inside reding file ");
				console.log(" This is myData "+MyData);
		});
			
		// Mongodb Connection URL 
		const url = 'mongodb://localhost:27017/work';	
		// Use connect method to connect to the Server
		mongoClient.connect(url, (err, db) => {
		assert.equal(null, err);
		console.log("Connected correctly to server");

			insertDocuments(db,table_id,MyData, function () {
				db.close();
			});
		});
        res.end();
      });
    });
  } else {
    console.log("some other hit");
  }
  });
  
  
  //** Fetching from DB and show in browser 
app.route('/fetchEmailIds').get(function(req, res) {
mongoClient.connect(url, function(err, db) {
       var collection = db.collection(table_id);
	     var table_id=  fields.fetch_id;
       var emailIds = collection.find({});
       var str ="<link rel='stylesheet' type='text/css' href='https://cdnjs.cloudflare.com/ajax/libs/twitter-bootstrap/4.0.0/css/bootstrap.css'>"+ 
				"<link rel='stylesheet' type='text/css' href='https://cdn.datatables.net/1.10.16/css/dataTables.bootstrap4.min.css'>"+
				"<script type='text/javascript' language='javascript' src='https://code.jquery.com/jquery-3.3.1.js'></script>"+
				"<script type='text/javascript' language='javascript' src='https://cdn.datatables.net/1.10.16/js/jquery.dataTables.min.js'></script>"+
				"<script type='text/javascript' language='javascript' src='https://cdn.datatables.net/1.10.16/js/dataTables.bootstrap4.min.js'></script>"+
				"<script type='text/javascript'> $(document).ready(function() {   $('#datatable').DataTable();} );</script>"+
				"<table id='datatable' class='table table-striped table-bordered' style='width:100%'><thead><tr> <th>Sr no</th><th>Date</th><th>Cabno</th><th>DriverName</th><th>VehicleType</th><th>OpeningKm</th><th>Closingkm</th><th>Difference</th><th>Subtractby80</th><th>ExtraKM</th><th>Openingtime</th><th>ClosingTime</th><th>TotalTime</th><th>ExtraHours1</th><th>ExtraHours2</th><th>ExtraKmrate</th><th>ExtraHourRate</th><th>BaseRate</th><th>Toll</th><th>Total</th></tr></thead>";
	   str = str +"<tbody>";
	   var count=0;
       emailIds.forEach(function(obj) {
           if (obj != null) {
                   
				 str = str + "<tr> <td> "+count++ +" </td><td> " + obj.Date + "</td><td> " + obj.Cabno + " </td><td> " +obj.DriverName+ "<td>  " + obj.VehicleType + " </td><td> " + obj.OpeningKm + " </td><td> " + obj.Closingkm + " </td><td> " + obj.Difference + " </td><td> " + obj.Subtractby80 + " </td><td> " + obj.ExtraKM + " </td><td> " + obj.Openingtime + " </td><td> " + obj.ClosingTime + " </td><td> " + obj.TotalTime + " </td><td> " + obj.ExtraHours1 + " </td><td> " + obj.ExtraHours2 + " </td><td> " + obj.ExtraKmrate + " </td><td> " + obj.ExtraHourRate+ " </td><td> " + obj.BaseRate + " </td><td> " + obj.Toll+ " </td><td> " + obj.Total + " </td></tr>";
           }
       }, function(err) {
		   
		   str = str +"</tbody></table>";
           res.send(str);
           db.close();
          }

		  
       );
   });
});


const insertDocuments = (db,table_id ,MyData,callback) => {
  // Get the documents collection
   
	console.log("We are inside method");
	
	let collection = db.collection(table_id);
	db.collection(table_id).insert(MyData, function(err, doc) {
    
	if(err) throw err;
 });
 
}


app.listen(port, () => {
    console.log("Server listening on port " + port);
});