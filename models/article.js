let mongoose = require("mongoose");

let Schema = mongoose.Schema;

let ArticleSchema = new Schema({
  title: {
    type: String,
    required: true
  },
  url: {
    type: String,
    required: true
  },
  blurb: {
    type: String,
    required: true
  },
  note: {
    type: Schema.Types.ObjectId,
    ref: "Note"
  }
});


module.exports = mongoose.model("Article", ArticleSchema);
