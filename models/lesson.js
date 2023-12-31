const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const LessonSchema = new Schema({
  number_spots: {type:Number, required: true},
  booked_spots: {type:Number, required:true},
  day: {type: String, required: true},
  time: {type: String, required: true},
  teacher: {type:String, required:true},
  style: {type:String, required:true},
  classroom: {type:String, enum:["A", "B"], required:true},
})

module.exports = mongoose.model("lesson", LessonSchema);


