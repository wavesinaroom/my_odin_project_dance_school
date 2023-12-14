const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const UserSchema = new Schema({
  name: {type: String, required: true, maxLength: 100},
  surname: {type: String, required: true, maxLength: 100},
  username: {type: String, required: true, maxLength: 100},
  password: {type: String, required: true, maxLength:100},
  lessons: [{type: Schema.Types.ObjectId, ref: "lesson"}]
});

module.exports = mongoose.model("student", UserSchema);
