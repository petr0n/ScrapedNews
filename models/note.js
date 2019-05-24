let mongoose = require("mongoose");

let Schema = mongoose.Schema;

let NoteSchema = new Schema({
  title: String,
  body: String
});

module.exports = mongoose.model("Note", NoteSchema);
