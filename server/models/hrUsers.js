import mongoose from "mongoose";
import bcrypt from 'bcrypt'


const hrUserScheme = new mongoose.Schema({
  first: {type: String, required: true},
  last: {type: String, required: true},
  password: {type: String, required: true},
  email: {type: String, required: true, unique: true},
  company: {type: Object},
  userType: {type: String, required: true, default: 'hr', immutable: true },
  posted_jobs: [Object],
  matches: [String],
})


hrUserScheme.pre('save',async function(next) {
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

hrUserScheme.methods.comparePassword = async function (password) {
  if(!password) throw new Error('no password')
  try{
    const result = await bcrypt.compare(password, this.password)
    return result;
  } catch (err) {
   console.log(err);
  }
}

export const HRuser = mongoose.model('hr_users', hrUserScheme)