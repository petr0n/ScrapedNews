var express = require("express");
var mongoose = require("mongoose");

var PORT = 3000;

var app = express();


// Parse request body as JSON
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
// Make public a static folder
app.use(express.static("public"));

// Connect to the Mongo DB
var MONGODB_URI = process.env.MONGODB_URI || "mongodb://localhost/scrapednews";
mongoose.connect(MONGODB_URI);

require("./routes.js")(app);


// Start the server
app.listen(PORT, function() {
  console.log("App running on port http://localhost:" + PORT);
});
