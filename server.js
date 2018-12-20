var express = require("express");
//var logger = require("morgan");
var mongoose = require("mongoose");

// Our scraping tools
// Axios is a promised-based http library, similar to jQuery's Ajax method
// It works on the client and on the server
var axios = require("axios");
var cheerio = require("cheerio");

//Require all models
var db = require("./models");

var PORT = process.env.PORT || 3000;
var MONGODB_URI = process.env.MONGODB_URI || "mongodb://localhost/mongoHeadlines";

//initiaize express
var app = express();

//configure middleware
// Use morgan logger for logging requests
//app.use(logger("dev"));
// Parse request body as JSON
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
// Make public a static folder
app.use(express.static("public"));

// Connect to the Mongo DB
//mongoose.connect("mongodb://localhost/scraping_for_news", { useNewUrlParser: true });
mongoose.connect(MONGODB_URI, { useNewUrlParser: true });

// Routes

// A GET route for scraping the echoJS website
app.get("/scrape", function (req, res) { });
// Route for getting all Articles from the db
app.get("/articles", function (req, res) { });
// Route for grabbing a specific Article by id, populate it with it's note
app.get("/articles/:id", function (req, res) { });
// Route for saving/updating an Article's associated Note
app.post("/articles/:id", function (req, res) { });
// Start the server
app.listen(PORT, function () {
    console.log("App running on port " + PORT + "!");
});