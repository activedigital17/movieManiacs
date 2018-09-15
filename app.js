var express = require("express");
var app = express();
var request = require("request");
var bodyParser = require("body-parser");
var feed = require("feed-read");



app.use(bodyParser.urlencoded({extended:true}));

app.use(express.static("public"));

app.set("view engine", "ejs");


app.get("/", function(req,res){
    
    feed("http://movieweb.com/rss/all-news/", function(err, articles) {
          if (err) throw err;
    
          
         var xml = articles;
         
         
          res.render("home", {xml:xml});
         
        });
        
    
    
});

app.get("/review", function(req,res){
    
    
    
    var searchedMovie = req.query.search;
    var url = "http://www.omdbapi.com/?s=" + searchedMovie + "&apikey=thewdb";
    
    
    
    
    request(url, function (error, response, body) {
        
        console.log('statusCode:', response && response.statusCode);

        
        
        var parsedData = JSON.parse(body);

        if (parsedData["Response"] == "True"){

            res.render("review", {parsedData:parsedData})
        } else {

            console.log("nema toga ");
            res.render("error");
        }
         
        
        
        
        
        
       
        
          
});
    
    
    
});



app.get("/about", function(req,res){
    
    res.render("about");
    
    
});


app.get("/single", function(req,res){
  
   var singleMovie = req.query.singleMovie;
   console.log(req.query.singleMovie);
   var urlSingle = "http://www.omdbapi.com/?t=" + singleMovie+ "&apikey=thewdb&plot=full";
  
  request(urlSingle, function (error, response, body) {
        
        var data = JSON.parse(body)
       
         res.render("single", {data:data});
         
        
         
          
          
});
  
   
});
  




app.get("/latest",function (req,res) {

    var urlLatest = "https://yts.ag/api/v2/list_movies.json?sort_by=date_uploaded&limit=50";

    request(urlLatest, function (error, response, body) {
        
        var dataLatest = JSON.parse(body);
        

         res.render("latest", {dataLatest:dataLatest});

         



          
    });


});


app.get("/download", function (req,res){


            var searchDownload = req.query.download;

            var urlDownload = "https://yts.ag/api/v2/list_movies.json?query_term=" + searchDownload;

                request (urlDownload, function (error, response,body) {

                    var downloadBody= JSON.parse(body);

                    console.log(downloadBody["data"]["movie_count"]);

                    if (downloadBody["data"]["movie_count"]==0){

                        res.render("errorDownload");
                        
                    } else {


                        res.render("download",{downloadBody:downloadBody});

                    }

                    

                });
         

});


app.listen(process.env.PORT || 8080, function(){
    
    
    console.log("server started");
});
