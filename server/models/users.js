import mongoose from "mongoose";
import bcrypt from 'bcrypt'

const userScheme = new mongoose.Schema({
  first: {type: String, required: true},
  last: {type: String, required: true},
  password: {type: String, required: true},
  email: {type: String, required: true , unique: true},
  userType: {type: String, required: true, default: 'worker', immutable: true },
  cv: {
    name: {type: String, maxlength: 20},
    email: {type: String},
    education: {type: String, maxlength: 200},
    experience: {type: String, maxlength: 200},
    skills: {type: String, maxlength: 40},
    languages: {type: String, maxlength: 20},
    imgURL: {type: String},
    imgLinkTo: {type: String},
  },
  matches: [Object],
  applied: [Object],
  rooms: [String]
})


userScheme.pre('save',async function(next) {
  try{
    const salt = await bcrypt.genSalt(10)
    const hashedPassword = await bcrypt.hash(this.password, salt)
    this.password = hashedPassword;
    next()
  } catch(e){
    console.log(e);
    next()
  }
})
// hash password
userScheme.methods.comparePassword = async function (password) {
  if(!password) throw new Error('no password')
  try{
    const result = await bcrypt.compare(password, this.password)
    return result;
  } catch (err) {
    console.log(err);
  }
}


export const User = mongoose.model('users', userScheme)