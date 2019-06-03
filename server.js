let express = require("express");
let mongoose = require("mongoose");
var bodyParser = require("body-parser");
let PORT = process.env.PORT || 3000;
let app = express();


// Parse request body as JSON
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(express.static("public"));

let handlebars = require("express-handlebars");
app.engine("handlebars", handlebars({ defaultLayout: "main" }));
app.set("view engine", "handlebars");


// Connect to the Mongo DB
var MONGODB_URI = process.env.MONGODB_URI || "mongodb://localhost/scrapednews";
mongoose.connect(MONGODB_URI, { useNewUrlParser: true });


require("./routes.js")(app);


// Start the server
app.listen(PORT, function() {
  console.log("App running on port http://localhost:" + PORT);
});

mongodb://<dbuser>:<dbpassword>@ds261486.mlab.com:61486/heroku_hwl6l1r4
