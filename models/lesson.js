const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const LessonSchema = new Schema({
  available_spots: {type:Number, required:true},
  day_time: {type: Date, required: true},
  teacher: {type:String, required:true},
  style: {type:String, required:true},
  classroom: {type:String, required:true},
})

module.exports = mongoose.model("LessonSchema", LessonSchema);


