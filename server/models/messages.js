import mongoose from "mongoose";

const msgScheme = new mongoose.Schema({
  room: {type: String, required: true},
  author: {type: String, required: true},
  message: {type: String, required: true},
  time: {type: String, required: true},
})

export const Msg = mongoose.model('messages', msgScheme)