const moongose = require("mongoose");
const Schema = mongoose.Schema;

const StudentSchema = new Schema({
  first_name: {type: String, required: true, maxLength: 100},
  family_name: {type: String, required: true, maxLength: 100},
  username: {type: String, required: true, maxLength: 100},
  password: {type: password, required: true, maxLength:100},
  lessons: [{type: Schema.type.ObjectId, ref: "LessonSchema"}]
});

module.exports = mongoose.model("StudentSchema", StudentSchema);
